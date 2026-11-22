# Data sources

Log a source here before using it. Status: **candidate** (identified, not
used yet), **in use**, or **rejected** (with reason).

**Rules:** official APIs or terms-compliant access only. No Facebook or
Nextdoor scraping. Community data aggregated at county level, short excerpts
only, no personal data.

## Site identifier (Kat)

| Source | Gives | Coverage | Access / license | Status | Notes |
|---|---|---|---|---|---|
| [OpenStreetMap via Overpass](https://wiki.openstreetmap.org/wiki/Power_networks/United_States) | Substations and voltage | US, uneven | Free API; ODbL: attribute OSM, derived databases shared under ODbL | **In use** (`sources/osm_substations.py`) | Taylor County test: 56 substations, all voltage-tagged (2026-11-22). Send a User-Agent; cache responses. |
| [HIFLD electric substations](https://catalog.data.gov/dataset/electric-substations-c633a) / [transmission lines](https://catalog.data.gov/dataset/electric-power-transmission-lines) | Substations, lines by voltage | National | Public via data.gov; some HIFLD data moved to a restricted platform | Candidate | Cross-check OSM gaps. Check currency of each layer. |
| [LBNL Queued Up](https://emp.lbl.gov/queues) | Interconnection queue by project, county | ~98% of US capacity | CC BY 4.0, attribute LBNL and GridTracker | Candidate | 2026 edition: data through end of 2025. For `county_queue_gw`. |
| [EIA-860](https://www.eia.gov/electricity/data/eia860/) | Power plants and generators, by county | National | Public domain | Candidate | Nearby generation as context. |
| [TxGIO StratMap land parcels](https://www.geographic.texas.gov/stratmap/land-parcels.html) | Parcels, acreage, land use (Texas) | Texas, most counties | Free download | Candidate | First statewide sweep. Other states: county or state GIS portals; Regrid is paid. |
| [FCC National Broadband Map](https://broadbandmap.fcc.gov) | Fiber-to-the-premises availability | National | Public downloads and APIs | Candidate | Proxy for fiber proximity, not long-haul routes. |
| [WRI Aqueduct 4.0](https://www.wri.org/data/aqueduct-global-maps-40-data) | Baseline water stress (0-5) | Global | CC BY 4.0, "Source: WRI Aqueduct, accessed on [date]" | Candidate | Basin-level; join to parcel by location. |
| FEMA National Flood Hazard Layer | Flood zones | National (where mapped) | Public | Candidate | Not verified in this pass. |
| USGS NLCD | Land cover | National | Public domain | Candidate | Not verified in this pass. |
| [Dominion hosting capacity maps](https://www.dominionenergy.com/HostingCapacity) | Distribution hosting capacity | Dominion territory | Public web tool | Candidate (limited) | Built for solar/EV, not large loads; no public large-load capacity map found for Dominion, ERCOT or TVA. |

## Community scrubber (Dhruv)

| Source | Gives | Coverage | Access / license | Status | Notes |
|---|---|---|---|---|---|
| | | | | | |
