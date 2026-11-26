# Site scoring engine

Owner: Kat. Code: `pipelines/sites/scoring/`. Config: `scoring/config.json`.

## What it answers

"Is this parcel a strong technical candidate for a data center?" It scores
only the technical side. Community fit stays separate (Dhruv's community
data); the proposer combines the two. Mixing them into one number would hide
the trade-off the product exists to show.

## How it works

```
candidate parcels ──> features (power, land, fiber, water, hazard, zoning)
                  ──> 1. hard filters  ──> excluded, with reasons
                  ──> 2. weighted score 0-100 + per-factor breakdown + confidence
                  ──> sites table / fixture ──> app
```

1. **Hard filters** remove parcels that can't work: under 40 acres, substation
   over 15 km away or under 69 kV, in a 100-year floodplain, or protected
   land. Excluded parcels are listed with reasons, not silently dropped.
2. **Weighted score.** Each factor maps a raw value to 0-1 with a
   piecewise-linear curve (or a category table), times its weight, times 100.
3. **Breakdown.** Every site stores each factor's value, normalized score,
   weight and points. The site page shows it as "Why this score."
4. **Confidence** is the share of total weight backed by real data. A missing
   value scores neutral (0.5) and lowers confidence, so a site isn't punished
   or rewarded for a gap, and the gap is visible.

## Factors (v0 weights: starting assumptions, not calibrated)

| Factor | Weight | Feature | Better when | Source |
|---|---|---|---|---|
| Power proximity | 25% | `nearest_substation_km` | Closer (≤1 km best, 15 km = 0) | OSM substations (working); HIFLD to cross-check |
| Power capacity | 20% | `substation_kv` | Higher voltage (345 kV+ best) | OSM `voltage` tag |
| Grid congestion | 5% | `county_queue_gw` | Less queued capacity in the county | LBNL Queued Up |
| Land size | 15% | `acres` | Larger (250+ acres best) | State parcel data (TxGIO etc.) |
| Land suitability | 5% | `land_cover` | Developed / barren / grassland | USGS NLCD |
| Fiber | 10% | `fiber_km` | Closer to fiber | FCC National Broadband Map (proxy) |
| Water stress | 10% | `water_stress` | Lower baseline water stress | WRI Aqueduct 4.0 |
| Flood risk | 5% | `flood_zone` | Minimal flood risk | FEMA NFHL |
| Zoning | 5% | `zoning_status` | Industrial, then unzoned | County zoning / parcel land-use codes |

`est_available_mw` is a rough proxy from the substation's voltage class, not
real available capacity. Real headroom needs utility data or studies; the app
labels it "MW proxy."

## Running it

```
cd pipelines/sites
python -m unittest discover -s tests -t . -v
python run.py score inputs/sample_candidates.json      # writes the app fixture
python run.py enrich-substations inputs/x.json S W N E --cache ../../data/osm_<fips>.json
```

`enrich-substations` needs Python 3.10+ (macOS's built-in 3.9 fails the TLS
handshake with Overpass). Cache every Overpass response; the server is shared.

## Validating it

Weights are guesses until checked. Two checks, in order:

1. **Known cases (demo counties).** Existing data center sites in Loudoun,
   Grant and Taylor should score well; known bad parcels should be filtered or
   score low. If not, adjust curves or weights and record why in the commit.
2. **Sensitivity.** Change each weight by ±50% and see whether the top 10
   parcels change. Factors that reorder everything deserve the most scrutiny.

## From demo to greenfield

The engine scores rules, not hand-picked places, so it runs on any county:

1. Pull every parcel above the size filter in a state (Texas first: free
   statewide parcels from TxGIO, open ERCOT data).
2. Enrich each with the features above, then filter and score.
3. Take top-scoring parcels in counties without existing data center
   clusters, and hand those counties to the community scrubber.

Strong power + little existing development + a supportive or persuadable
community is the greenfield product.

## Open questions

- Real available capacity: which utilities publish usable load-side data,
  and is a proxy from voltage class plus queue congestion good enough?
- Which parcels count as candidates: every parcel over 40 acres, or only
  certain land-use codes?
- Whether water risk should be a hard filter in high-stress basins.
