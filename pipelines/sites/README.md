# Site pipeline (owner: Kat)

Finds powered land in the demo counties and scores it. Writes rows that match
the `sites` table in `db/migrations/0001_init.sql`.

Until the database is connected, output goes to
`apps/web/src/data/fixtures/sites.json`, which the app reads.

## Python setup (both of us, once)

Use Python 3.11 (pinned in `/.python-version`, same as CI). macOS's built-in
Python 3.9 ships an old SSL library that can't reach some data servers.

```
curl -LsSf https://astral.sh/uv/install.sh | sh   # installs uv; restart the terminal
uv python install 3.11
```

Then, in this folder:

```
uv venv                       # picks up 3.11 from .python-version
source .venv/bin/activate
uv pip install -r requirements.txt
```

Run:

```
python -m unittest discover -s tests -t . -v           # engine tests
python run.py score inputs/sample_candidates.json      # score and write the app fixture
python run.py --check                                  # validate the fixture
python run.py enrich-substations inputs/x.json S W N E --cache ../../data/osm_<fips>.json
```

How scoring works: `../../docs/scoring-engine.md`.

Log every data source in `docs/data-sources.md` before using it.
