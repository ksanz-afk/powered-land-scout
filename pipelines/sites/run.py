"""Site pipeline entry point (owner: Kat).

Today it only validates the sites fixture against the data contract.
Replace `collect()` with real sourcing (hosting-capacity maps, EIA, parcels).
"""
import argparse
import json
from pathlib import Path

FIXTURE = Path(__file__).resolve().parents[2] / "apps/web/src/data/fixtures/sites.json"
REQUIRED = {
    "id", "fips", "name", "lat", "lng", "acres", "nearest_substation_km",
    "substation_kv", "est_available_mw", "fiber_km", "water_risk", "zoning",
    "score", "notes", "is_sample",
}


def collect():
    """Return a list of site dicts. Not implemented yet."""
    raise NotImplementedError("Site sourcing not built yet")


def check(rows):
    for row in rows:
        missing = REQUIRED - row.keys()
        assert not missing, f"{row.get('id')}: missing {sorted(missing)}"
        assert 0 <= row["score"] <= 100, f"{row['id']}: score out of range"
        assert row["water_risk"] in {"low", "medium", "high"}, f"{row['id']}: bad water_risk"
    print(f"OK: {len(rows)} sites match the contract")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="validate the fixture only")
    args = parser.parse_args()
    if args.check:
        check(json.loads(FIXTURE.read_text()))
    else:
        rows = collect()
        check(rows)
        FIXTURE.write_text(json.dumps(rows, indent=2) + "\n")
