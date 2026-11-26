# Project proposer

Owner: Kat. Code: `pipelines/proposer/`. Commitment library: `playbook.json`.

## What it does

For each county it takes the strongest parcels (top two scoring 55+) and
pairs each with what residents care about, then writes a project:

1. **Issues:** the county's `community_issues`, ranked by salience. The first
   parcel gets issues 1-2, the second issues 2-3, so projects differ.
2. **Commitments:** two per issue from the playbook, plus one for a top
   data-center concern (noise, water use, air quality...), plus a
   zero-water-cooling commitment if the parcel's water risk is high. Max five.
3. **Title and pitch:** built from the playbook's headline and pitch phrases
   for the two issue categories.
4. **Why this pairing:** plain reasons tying the site's facts and each
   commitment to the community data.
5. **Community fit (0-100):** the addressed issues' share of the salience of
   the county's top three issues.

Rule-based on purpose: every line traces to site or community data, and
output is stable for the demo. An LLM drafting step can be added later on
top of the same pairing.

## Running it

```
cd pipelines/proposer
python -m unittest discover -s tests -t . -v
python run.py            # regenerate apps/web/src/data/fixtures/proposals.json
python run.py --check    # validate against the contract
```

Run it after the site or community data changes. It reads `sites.json`,
`community_issues.json`, `county_sentiment.json` and `counties.json`.

## Changing it

- New issue category or better wording: edit `playbook.json`.
- Selection rules (threshold, parcels per county, max commitments): constants
  at the top of `proposer.py`.
- Say why in the commit. Wording changes show up on every project page.
