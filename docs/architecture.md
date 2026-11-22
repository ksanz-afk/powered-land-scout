# Architecture

## What it does

1. **Site identifier (Kat):** finds parcels with power, size, fiber and
   suitable zoning, and scores them.
2. **Community scrubber (Dhruv):** reads public discussion per county,
   measures stance on data centers, and surfaces the local issues people care
   about (roads, schools, water, jobs).
3. **Project proposer (Kat):** pairs a strong site with the issues its county
   cares about, e.g. "build here, and we fund road repairs."
4. **Education hub (Dhruv):** plain-language explainers for residents and
   local leaders, by county and topic.

## How the parts connect

```
pipelines/sites ──────> sites ──────────────┐
                                            ├──> proposals (proposer)
pipelines/community ──> community_issues ───┘
                   └──> community_signals, county_sentiment
education hub ────────> education_content
                 all keyed by counties.fips
```

The schema in `db/migrations/0001_init.sql` is the contract. Each person can
build against the sample fixtures before the other's pipeline exists.

## Stack

| Layer | Choice |
|---|---|
| Web app | Next.js 16 (App Router, Cache Components), TypeScript, Tailwind v4, shadcn/ui |
| Maps | MapLibre GL with OpenFreeMap tiles (no API key) |
| Data, now | JSON fixtures in `apps/web/src/data/fixtures`, read through `src/lib/data.ts` |
| Data, next | Postgres + PostGIS (Neon or Supabase via the Vercel Marketplace) |
| Pipelines | Python scripts in `pipelines/`, run locally or on a schedule by GitHub Actions |
| AI | Claude API for classifying community text and drafting proposals |
| Hosting | Vercel, root directory `apps/web`, preview deploy per PR |

Pipelines don't run inside Vercel functions: scraping and classification take
too long for request-time functions. They write to fixtures (now) or the
database (later), and the app reads.

## Demo counties

| FIPS | County | Why |
|---|---|---|
| 51107 | Loudoun, VA | Densest data center market; growing local debate |
| 47157 | Shelby, TN | Memphis / xAI Colossus backlash |
| 53025 | Grant, WA | Quincy: early support tested by water and noise |
| 48441 | Taylor, TX | Abilene: no county zoning, developer-friendly |

## Moving to Postgres

1. Create a Postgres database from the Vercel Marketplace and enable PostGIS.
2. Run `db/migrations/0001_init.sql`.
3. Add `DATABASE_URL` in Vercel and `.env.local`.
4. Change the functions in `src/lib/data.ts` to query the database. Pages
   don't change.
