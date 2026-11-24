---
name: add-demo-county
description: Add a new county to the demo across fixtures, pipelines and pages. Use when expanding the demo to another place.
---

1. Look up the county's 5-digit FIPS code and centroid lat/lng.
2. Add it to `apps/web/src/data/fixtures/counties.json` with a one-sentence factual summary (cite the source in the PR body).
3. Add placeholder rows, each with `is_sample: true`, so every page renders:
   - `county_sentiment.json` (Dhruv's area), at least one `community_issues.json` row
   - at least one `sites.json` row (Kat's area)
   - optionally an `education_content.json` item
4. Tell the other owner which placeholder rows they now need to replace with real pipeline output.
5. Run `npx next typegen`, `npm run build` and both pipeline `--check` commands; confirm the county's pages appear in the build output.
