"""Site scoring engine (owner: Kat).

Two stages, both driven by config.json:
1. Hard filters remove candidates that can't host a data center.
2. Weighted factors score the rest 0-100, with a per-factor breakdown so every
   score can be explained, and a confidence value for missing data.

Pure Python, no dependencies, so it runs anywhere (locally, CI, Actions).
"""
import json
from pathlib import Path

CONFIG_PATH = Path(__file__).with_name("config.json")


def load_config(path=CONFIG_PATH):
    config = json.loads(Path(path).read_text())
    total = sum(f["weight"] for f in config["factors"].values())
    if abs(total - 1.0) > 1e-6:
        raise ValueError(f"Factor weights must sum to 1.0, got {total:.3f}")
    return config


def interpolate(points, x):
    """Piecewise-linear lookup; clamps outside the first and last points."""
    if x <= points[0][0]:
        return points[0][1]
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x <= x1:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return points[-1][1]


def exclusion_reasons(candidate, filters):
    """Return a list of reasons a candidate fails the hard filters (empty = passes)."""
    reasons = []
    acres = candidate.get("acres")
    if acres is not None and acres < filters["min_acres"]:
        reasons.append(f"parcel under {filters['min_acres']} acres")
    km = candidate.get("nearest_substation_km")
    if km is not None and km > filters["max_substation_km"]:
        reasons.append(f"substation over {filters['max_substation_km']} km away")
    kv = candidate.get("substation_kv")
    if kv is not None and kv < filters["min_substation_kv"]:
        reasons.append(f"substation under {filters['min_substation_kv']} kV")
    if filters["exclude_floodplain"] and candidate.get("flood_zone") == "high":
        reasons.append("in 100-year floodplain")
    if filters["exclude_protected"] and candidate.get("protected_land"):
        reasons.append("protected land")
    return reasons


def score_factor(factor, value, missing_value_score):
    if value is None:
        return missing_value_score, False
    if "points" in factor:
        return interpolate(factor["points"], float(value)), True
    return factor["categories"].get(value, missing_value_score), value in factor["categories"]


def score_candidate(candidate, config):
    breakdown = {}
    total = 0.0
    confidence = 0.0
    for name, factor in config["factors"].items():
        value = candidate.get(factor["feature"])
        normalized, known = score_factor(factor, value, config["missing_value_score"])
        points = 100 * factor["weight"] * normalized
        total += points
        if known:
            confidence += factor["weight"]
        breakdown[name] = {
            "label": factor["label"],
            "value": value,
            "normalized": round(normalized, 3),
            "weight": factor["weight"],
            "points": round(points, 1),
            "known": known,
        }
    return round(total), breakdown, round(confidence, 2)


def water_risk(stress):
    if stress is None:
        return "medium"
    return "low" if stress < 2 else "medium" if stress < 3 else "high"


def estimate_mw(kv, config):
    """Rough proxy from voltage class. Not real available capacity."""
    if kv is None:
        return 0
    return round(interpolate(config["mw_proxy_by_kv"], float(kv)))


def run(candidates, config):
    """Score candidates. Returns (site rows matching the contract, excluded list)."""
    sites, excluded = [], []
    for c in candidates:
        reasons = exclusion_reasons(c, config["filters"])
        if reasons:
            excluded.append({"id": c["id"], "reasons": reasons})
            continue
        score, breakdown, confidence = score_candidate(c, config)
        sites.append({
            "id": c["id"],
            "fips": c["fips"],
            "name": c["name"],
            "lat": c["lat"],
            "lng": c["lng"],
            "acres": c.get("acres"),
            "nearest_substation_km": c.get("nearest_substation_km"),
            "substation_kv": c.get("substation_kv"),
            "est_available_mw": estimate_mw(c.get("substation_kv"), config),
            "fiber_km": c.get("fiber_km"),
            "water_risk": water_risk(c.get("water_stress")),
            "zoning": c.get("zoning_label") or (c.get("zoning_status") or "unknown").title(),
            "score": score,
            "score_breakdown": breakdown,
            "confidence": confidence,
            "notes": c.get("notes", ""),
            "is_sample": c.get("is_sample", False),
        })
    sites.sort(key=lambda s: s["score"], reverse=True)
    return sites, excluded
