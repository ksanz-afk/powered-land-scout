---
name: add-data-source
description: Add a new external data source (API, dataset, website) to a pipeline. Use before writing any code that fetches outside data.
---

1. Identify how to access it: official API, bulk download, or public page.
2. Check the terms of service for automated access and reuse. Stop and tell the user if:
   - the platform prohibits scraping (Facebook groups, Nextdoor and similar), or
   - access requires a commercial agreement we don't have.
3. Confirm the data can be stored at county level without personal data. Plan to keep only short excerpts and source links for community data.
4. Add a row to `docs/data-sources.md`: source, owner, used for, access method, date terms were checked, notes (rate limits, keys needed).
5. Put any API key in `.env.local` (and Vercel env vars), never in code or git. Document the variable name in the pipeline's README.
6. Raw downloads go in `data/` (git-ignored); only processed rows matching the contract reach fixtures or the database.
