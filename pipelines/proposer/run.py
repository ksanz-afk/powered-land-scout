"""Proposer entry point (owner: Kat).

    python run.py            generate proposals from the current fixtures
    python run.py --check    validate the proposals fixture against the contract
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from proposer import load_playbook, propose  # noqa: E402

FIXTURES = Path(__file__).resolve().parents[2] / "apps/web/src/data/fixtures"
REQUIRED = {"id", "site_id", "issue_ids", "title", "pitch", "commitments", "rationale",
            "community_fit", "status", "is_sample"}


def load(name):
    return json.loads((FIXTURES / name).read_text())


def check(rows, site_ids, issue_ids):
    for r in rows:
        missing = REQUIRED - r.keys()
        assert not missing, f"{r.get('id')}: missing {sorted(missing)}"
        assert r["site_id"] in site_ids, f"{r['id']}: unknown site {r['site_id']}"
        assert all(i in issue_ids for i in r["issue_ids"]), f"{r['id']}: unknown issue"
        assert 0 <= r["community_fit"] <= 100, f"{r['id']}: community_fit out of range"
        assert r["status"] in {"draft", "ready", "archived"}, f"{r['id']}: bad status"
        assert r["commitments"] and r["rationale"], f"{r['id']}: empty commitments or rationale"
    print(f"OK: {len(rows)} proposals match the contract")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    sites, issues = load("sites.json"), load("community_issues.json")
    site_ids, issue_ids = {s["id"] for s in sites}, {i["id"] for i in issues}
    if args.check:
        check(load("proposals.json"), site_ids, issue_ids)
    else:
        rows = propose(load("counties.json"), sites, issues, load("county_sentiment.json"), load_playbook())
        check(rows, site_ids, issue_ids)
        (FIXTURES / "proposals.json").write_text(json.dumps(rows, indent=2) + "\n")
        print(f"Wrote {len(rows)} proposals")
