"""Build community rows from a small, manually reviewed case. No network access."""
import argparse
from datetime import date
import json
from pathlib import Path
from urllib.parse import urlparse

FIXTURES = Path(__file__).resolve().parents[2] / "apps/web/src/data/fixtures"
DEFAULT_CASE = Path(__file__).parent / "inputs/taylor-reviewed.json"
FILES = ("community_signals.json", "county_sentiment.json", "community_issues.json")


def build(case):
    fips = case["fips"]
    if len(fips) != 5 or not fips.isdigit():
        raise ValueError("A five-digit county FIPS is required")
    records = case["records"]
    if not records:
        raise ValueError("No reviewed comments: do not generate a balanced score")
    seen_ids, seen_urls = set(), set()
    signals = []
    for row in records:
        if row["id"] in seen_ids or row["source_url"] in seen_urls:
            raise ValueError("Duplicate comment ID or source URL")
        seen_ids.add(row["id"])
        seen_urls.add(row["source_url"])
        url = urlparse(row["source_url"])
        if url.scheme != "https" or not url.netloc or not row["excerpt"].strip():
            raise ValueError("Every reviewed comment needs an HTTPS source and excerpt")
        date.fromisoformat(row["published_at"])
        if row["stance_on_dc"] not in {"support", "oppose", "neutral"}:
            raise ValueError("Unknown or unrelated stances must be reviewed separately")
        if not row["topics"] or row["topic"] not in {
            "infrastructure", "education", "water", "energy_costs", "jobs",
            "health", "environment", "housing", "public_safety", "other",
        }:
            raise ValueError("Every comment needs valid topic coding")
        signals.append({
            key: row[key] for key in (
                "id", "source", "source_url", "published_at",
                "stance_on_dc", "topic", "excerpt",
            )
        } | {"fips": fips, "is_sample": False})
    n = len(signals)
    sentiment = [{
        "fips": fips,
        "support_share": sum(s["stance_on_dc"] == "support" for s in signals) / n,
        "oppose_share": sum(s["stance_on_dc"] == "oppose" for s in signals) / n,
        "signal_count": n,
        "top_concerns": case["top_concerns"],
        "is_sample": False,
    }]
    issues = []
    for issue in case["issues"]:
        mentions = sum(issue["topic"] in set(r["topics"]) for r in records)
        issues.append({
            key: issue[key] for key in ("id", "issue", "category", "summary")
        } | {
            "fips": fips, "salience": mentions / n,
            "signal_count": mentions, "is_sample": False,
        })
    return signals, sentiment, issues


def replace_county(existing, replacement, fips):
    """Preserve other counties and the existing county position."""
    result, inserted = [], False
    for row in existing:
        if row["fips"] == fips:
            if not inserted:
                result.extend(replacement)
                inserted = True
        else:
            result.append(row)
    if not inserted:
        result.extend(replacement)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--case", type=Path, default=DEFAULT_CASE)
    parser.add_argument("--check", action="store_true", help="compare generated rows; do not write")
    args = parser.parse_args()
    case = json.loads(args.case.read_text())
    output = build(case)
    # Read and validate every destination before writing any file.
    destinations = []
    for name, rows in zip(FILES, output):
        path = FIXTURES / name
        existing = json.loads(path.read_text())
        if args.check:
            actual = [r for r in existing if r["fips"] == case["fips"]]
            if actual != rows:
                raise SystemExit(f"{name}: reviewed rows differ; run reviewed.py")
        destinations.append((path, replace_county(existing, rows, case["fips"])))
    if not args.check:
        for path, rows in destinations:
            # Keep existing compact fixture convention and focused county diffs.
            path.write_text("[\n" + ",\n".join(
                "  " + json.dumps(r, ensure_ascii=False, separators=(",", ":"))
                for r in rows
            ) + "\n]\n")
    print(f"OK: {len(output[0])} reviewed comments for {case['fips']}")


if __name__ == "__main__":
    main()
