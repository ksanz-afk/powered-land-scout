# Community pipeline (owner: Dhruv)

Collects public discussion about each demo county, classifies stance on data
centers and the local issues people raise, and writes rows matching
`community_signals`, `county_sentiment` and `community_issues` in
`db/migrations/0001_init.sql`.

The point is not only to rate data-center sentiment but to surface what each
community cares about (roads, schools, water, jobs), since those issues become
the basis for partnerships in the proposer.

Until the database is connected, output goes to the matching JSON files in
`apps/web/src/data/fixtures/`.

```
cd pipelines/community
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py --check
```

Rules (see README): official APIs or terms-compliant access only, no Facebook
or Nextdoor scraping, aggregate at county level, short excerpts only, no
personal data. Log every source in `docs/data-sources.md` first.
