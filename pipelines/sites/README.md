# Site pipeline (owner: Kat)

Finds powered land in the demo counties and scores it. Writes rows that match
the `sites` table in `db/migrations/0001_init.sql`.

Until the database is connected, output goes to
`apps/web/src/data/fixtures/sites.json`, which the app reads.

```
cd pipelines/sites
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python run.py --check     # validate the current fixture against the contract
```

Log every data source in `docs/data-sources.md` before using it.
