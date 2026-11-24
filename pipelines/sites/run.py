"""Site pipeline entry point (owner: Kat).

    python run.py --check                         validate the app fixture
    python run.py score inputs/sample_candidates.json
                                                  score candidates and write the fixture
    python run.py enrich-substations inputs/x.json S W N E
                                                  fill substation distance/kV from OSM

Candidates are dicts of raw features (see docs/scoring-engine.md). The engine
filters and scores them; output rows match the `sites` table.
"""
import argparse
import json
from pathlib import Path

from scoring.engine import load_config, run as score_run

ROOT = Path(__file__).resolve().parents[2]
FIXTURE = ROOT / "apps/web/src/data/fixtures/sites.json"
REQUIRED = {
    "id", "fips", "name", "lat", "lng", "acres", "nearest_substation_km",
    "substation_kv", "est_available_mw", "fiber_km", "water_risk", "zoning",
    "score", "score_breakdown", "confidence", "notes", "is_sample",
}


def check(rows):
    for row in rows:
        missing = REQUIRED - row.keys()
        assert not missing, f"{row.get('id')}: missing {sorted(missing)}"
        assert 0 <= row["score"] <= 100, f"{row['id']}: score out of range"
        assert 0 <= row["confidence"] <= 1, f"{row['id']}: confidence out of range"
        assert row["water_risk"] in {"low", "medium", "high"}, f"{row['id']}: bad water_risk"
    print(f"OK: {len(rows)} sites match the contract")


def score(path):
    config = load_config()
    candidates = json.loads(Path(path).read_text())
    sites, excluded = score_run(candidates, config)
    check(sites)
    FIXTURE.write_text(json.dumps(sites, indent=2) + "\n")
    print(f"Scored {len(sites)} sites; excluded {len(excluded)}")
    for e in excluded:
        print(f"  excluded {e['id']}: {', '.join(e['reasons'])}")


def enrich_substations(path, bbox, min_kv, cache=None):
    from sources.geo import nearest
    from sources.osm_substations import fetch_substations

    candidates = json.loads(Path(path).read_text())
    substations = fetch_substations(*bbox, cache=cache)
    print(f"Fetched {len(substations)} substations from OSM")
    for c in candidates:
        hit = nearest(c["lat"], c["lng"], substations, min_kv=min_kv)
        if hit:
            c["nearest_substation_km"] = round(hit[0], 1)
            c["substation_kv"] = hit[1]["kv"]
            c["substation_source"] = f"osm:{hit[1]['osm_id']}"
    Path(path).write_text(json.dumps(candidates, indent=2) + "\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    sub = parser.add_subparsers(dest="cmd")
    s = sub.add_parser("score")
    s.add_argument("path")
    e = sub.add_parser("enrich-substations")
    e.add_argument("path")
    e.add_argument("bbox", nargs=4, type=float, metavar=("S", "W", "N", "E"))
    e.add_argument("--min-kv", type=float, default=69)
    e.add_argument("--cache", help="path to cache the Overpass response (re-used if present)")
    args = parser.parse_args()
    if args.check:
        check(json.loads(FIXTURE.read_text()))
    elif args.cmd == "score":
        score(args.path)
    elif args.cmd == "enrich-substations":
        enrich_substations(args.path, args.bbox, args.min_kv, args.cache)
    else:
        parser.print_help()
