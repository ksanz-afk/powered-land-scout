# Site data sources

One module per source. Each returns plain dicts; `run.py` joins them into
candidate features. Log every source in `docs/data-sources.md` first.

| Module | Feature(s) | Status |
|---|---|---|
| `osm_substations.py` | `nearest_substation_km`, `substation_kv` | Working (OSM via Overpass) |
| HIFLD substations / transmission lines | same, cross-check | To add |
| LBNL Queued Up | `county_queue_gw` | To add |
| State parcels (TxGIO etc.) | `acres`, candidate parcels | To add |
| FCC National Broadband Map | `fiber_km` (proxy) | To add |
| WRI Aqueduct 4.0 | `water_stress` | To add |
| FEMA NFHL | `flood_zone` | To add |
| USGS NLCD | `land_cover` | To add |
