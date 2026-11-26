"""Project proposer (owner: Kat).

Pairs a county's strongest parcels with what its residents care about, picks
commitments from the playbook, and explains the pairing. Rule-based so every
line traces back to site or community data.
"""
import json
from pathlib import Path

PLAYBOOK_PATH = Path(__file__).with_name("playbook.json")
MIN_SITE_SCORE = 55
PARCELS_PER_COUNTY = 2
MAX_COMMITMENTS = 5


def load_playbook(path=PLAYBOOK_PATH):
    return json.loads(Path(path).read_text())


def score_label(score):
    if score >= 75:
        return "Strong"
    if score >= 60:
        return "Promising"
    if score >= 45:
        return "Mixed"
    return "Challenging"


def clean(text):
    return text.replace("Sample: ", "").replace("Sample:", "").strip()


def lower_first(text):
    return text[:1].lower() + text[1:]


def category(playbook, name):
    return playbook["categories"].get(name, playbook["categories"]["other"])


def pick_issues(issues, index):
    """First parcel gets issues 1-2, the second 2-3, so proposals differ."""
    if len(issues) <= 2:
        return issues[:2]
    return issues[index:index + 2] if index + 2 <= len(issues) else issues[-2:]


def build_commitments(site, paired, sentiment, playbook):
    out = []
    for issue in paired:
        out.extend(category(playbook, issue["category"])["commitments"][:2])
    concern_added = None
    for concern in (sentiment or {}).get("top_concerns", []):
        extra = playbook["concerns"].get(concern.lower())
        if extra and extra[0] not in out:
            out.append(extra[0])
            concern_added = (concern, extra[0])
            break
    water_rule = playbook["site_rules"]["high_water_risk_commitment"]
    if site.get("water_risk") == "high" and water_rule not in out:
        out.insert(0, water_rule)
    seen, deduped = set(), []
    for c in out:
        if c not in seen:
            seen.add(c)
            deduped.append(c)
    return deduped[:MAX_COMMITMENTS], concern_added


def community_fit(paired, top_issues):
    total = sum(i["salience"] for i in top_issues)
    if total == 0:
        return 0
    return round(100 * sum(i["salience"] for i in paired) / total)


def propose_for_site(site, index, county, issues, sentiment, playbook):
    paired = pick_issues(issues, index)
    if not paired:
        return None
    primary = category(playbook, paired[0]["category"])
    secondary = category(playbook, paired[1]["category"]) if len(paired) > 1 else None
    if secondary and secondary is not primary:
        title = f"{primary['headline']} with {secondary['with_phrase']}"
    else:
        title = primary["headline"]

    commitments, concern_added = build_commitments(site, paired, sentiment, playbook)
    fragments = [primary["pitch"]] + ([secondary["pitch"]] if secondary and secondary is not primary else [])
    pitch = " ".join(f.format(county=county["name"]) for f in fragments)

    rationale = [
        f"{site['name']} scores {site['score']} ({score_label(site['score']).lower()}): "
        f"{site.get('substation_kv') or '?'} kV substation {site.get('nearest_substation_km') or '?'} km away, "
        f"{site.get('acres') or '?'} acres."
    ]
    for issue in paired:
        first = category(playbook, issue["category"])["commitments"][0]
        rationale.append(
            f"Residents rank {lower_first(clean(issue['issue']))} as a top local issue "
            f"(salience {round(issue['salience'] * 100)}%). Commitment: {lower_first(first)}."
        )
    if concern_added:
        rationale.append(
            f"“{concern_added[0].capitalize()}” is one of the most-raised concerns about data centers here. "
            f"Commitment: {lower_first(concern_added[1])}."
        )
    water_rule = playbook["site_rules"]["high_water_risk_commitment"]
    water_explained = any(i["category"] == "water" for i in paired) or (concern_added and concern_added[1] == water_rule)
    if site.get("water_risk") == "high" and not water_explained:
        rationale.append("The parcel sits in a high water-stress area, so cooling is designed to use almost no water.")

    return {
        "id": "prop-" + site["id"].removeprefix("site-"),
        "site_id": site["id"],
        "issue_ids": [i["id"] for i in paired],
        "title": title,
        "pitch": pitch,
        "commitments": commitments,
        "rationale": rationale,
        "community_fit": community_fit(paired, issues[:3]),
        "status": "draft",
        "is_sample": bool(site.get("is_sample") or any(i.get("is_sample") for i in paired)),
    }


def propose(counties, sites, issues, sentiment, playbook):
    proposals = []
    for county in counties:
        fips = county["fips"]
        county_sites = sorted(
            (s for s in sites if s["fips"] == fips and s["score"] >= MIN_SITE_SCORE),
            key=lambda s: s["score"],
            reverse=True,
        )[:PARCELS_PER_COUNTY]
        county_issues = sorted((i for i in issues if i["fips"] == fips), key=lambda i: i["salience"], reverse=True)
        county_sentiment = next((s for s in sentiment if s["fips"] == fips), None)
        for index, site in enumerate(county_sites):
            p = propose_for_site(site, index, county, county_issues, county_sentiment, playbook)
            if p:
                proposals.append(p)
    return proposals
