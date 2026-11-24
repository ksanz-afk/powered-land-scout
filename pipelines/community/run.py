"""Community pipeline entry point (owner: Dhruv).

Today it only validates the community fixtures against the data contract.
Replace `collect()` with real sourcing (GDELT, Reddit API, meeting minutes).
"""
import argparse
import json
from pathlib import Path

FIXTURES = Path(__file__).resolve().parents[2] / "apps/web/src/data/fixtures"
STANCES = {"support", "oppose", "neutral", "unrelated"}
CATEGORIES = {
    "infrastructure", "education", "water", "energy_costs", "jobs",
    "health", "environment", "housing", "public_safety", "other",
}


def collect():
    """Return (signals, sentiment, issues). Not implemented yet."""
    raise NotImplementedError("Community sourcing not built yet")


def check(signals, sentiment, issues):
    for s in signals:
        assert s["stance_on_dc"] in STANCES, f"{s['id']}: bad stance"
    for s in sentiment:
        assert 0 <= s["support_share"] + s["oppose_share"] <= 1, f"{s['fips']}: shares exceed 1"
    for i in issues:
        assert i["category"] in CATEGORIES, f"{i['id']}: bad category"
        assert 0 <= i["salience"] <= 1, f"{i['id']}: salience out of range"
    print(f"OK: {len(signals)} signals, {len(sentiment)} counties, {len(issues)} issues")


def load(name):
    return json.loads((FIXTURES / name).read_text())


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="validate fixtures only")
    args = parser.parse_args()
    if args.check:
        check(load("community_signals.json"), load("county_sentiment.json"), load("community_issues.json"))
    else:
        signals, sentiment, issues = collect()
        check(signals, sentiment, issues)
        for name, rows in [("community_signals.json", signals), ("county_sentiment.json", sentiment),
                           ("community_issues.json", issues)]:
            (FIXTURES / name).write_text(json.dumps(rows, indent=2) + "\n")
