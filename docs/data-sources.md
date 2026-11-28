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

| Source | Date and location | Use in Taylor Community |
|---|---|---|
| [Abilene discussion](https://www.reddit.com/r/Abilene/comments/1pf0ac8/datacenters/) | Individual comment links and dates in `pipelines/community/inputs/taylor-reviewed.json`. Reviewed Nov 25, 2026. | Ten selected accounts from one thread. Stance and topic counts describe this selection. County residence is unverified. |
| [Texas House written testimony](https://capitol.texas.gov/tlodocs/89R/handouts/C4502026040910001/f9b7e4d8-0a5a-409d-a0f7-efd9ab44c138.PDF#page=124) | Apr 9, 2026, PDF p. 124, Stefani Wagley of Abilene. | One resident’s concerns about drought and work after construction. |
| [City of Abilene lake levels](https://abilenetx.gov/saveabilenewater) | Nov 23, 2026, November lake levels for Lake Fort Phantom Hill and Hubbard Creek Lake. | Combined available capacity was 40.9%, rounded to 41%. The city updates the page. |
| [Texas State Technical College graduation report](https://www.tstc.edu/blog/2026/06/23/first-cohort-of-data-center-operators-graduate-from-tstc/) | Jun 23, 2026, opening two paragraphs. | Twelve regional residents completed the first 15-week operator course in Abilene. The report establishes training completion only. |

## Education hub (Dhruv)

Manually curated from the four supplied documents. No scraping, API keys or live data collection. Original source text was reviewed on 2026-11-19; numerical summaries were checked on 2026-11-23. This records evidence review, not a new license or terms-of-service assessment. Only small document thumbnails and curated records are included; full PDFs stay local.

| Source | Coverage | Access | Status | Use and limits |
|---|---|---|---|---|
| [Virginia JLARC: Data Centers in Virginia](https://jlarc.virginia.gov/landing-2024-data-centers-in-virginia.asp) (December 9, 2024) | Virginia | Supplied PDF; original publisher link | In use, curated Learn example | 2024 modeled scenarios, not a current household forecast. Numerical summaries checked against Table 4-2, printed p. 48 (PDF p. 66), on 2026-11-23. |
| [Nature Energy: Data centres asymmetrically exacerbate energy burdens through wholesale price increases and regressive grid cost shifting](https://doi.org/10.1038/s41560-026-02163-x) (November 9, 2026) | US research | Supplied PDF; original publisher link | In use, curated Learn example | Main paper only; supplementary methods not supplied. Supporting source link in the Other tab. Publication date checked on the supplied PDF. |
| [Virginia SCC: In Biennial Review Ruling, SCC Creates New Class for Large-Scale Energy Users](https://www.scc.virginia.gov/about-the-scc/newsreleases/release/scc-issues-order-on-dev-biennial-review-2025/scc-rules-in-dev-biennial-review-case.html) (November 25, 2025) | Dominion Energy Virginia | Supplied PDF; original publisher link | In use, curated Learn example | Official decision announcement only; full order and tariff not assessed. Saved PDF p. 1. Supporting source link in the Other tab. |
| [Microsoft: Building Community-First AI Infrastructure](https://blogs.microsoft.com/on-the-issues/2026/01/13/community-first-ai-infrastructure/) (January 13, 2026) | US company policy | Supplied PDF; original publisher link | In use, curated Learn example | Company-reported commitments and MISO generation contracts, not verified operating supply or a site agreement. PDF pp. 1–2; numerical summary checked 2026-11-23. |
