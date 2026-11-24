# Powered Land Scout

Prototype software that helps data center developers find sites worth
pursuing. It combines three signals:

1. **Powered land.** Parcels with available or near-term power capacity
   (substations, transmission, interconnection headroom, existing large-load
   sites) and the basics for a data center: size, zoning, fiber, water.
2. **Community sentiment.** What people in nearby communities say about data
   centers and large development, from public online discussion, to flag
   places likely to support or oppose a project.
3. **Partnerships.** Local organizations, utilities, unions, schools and
   programs a developer or hyperscaler could partner with to earn support
   and move a project through approvals.

Output: a ranked list of candidate sites, each with its power picture,
sentiment summary and suggested partnerships.

## Team

- Kat Sanz ([@ksanz-afk](https://github.com/ksanz-afk))
- Dhruv Tandon

## Status

Foundation in place: a Next.js app with all four areas rendering sample data,
the shared schema, pipeline stubs, CI and agent skills. Sample rows are
labelled in the app.

Start with `docs/architecture.md`, then `CLAUDE.md` for working rules.

## Run it locally

```
cd apps/web
npm install
npm run dev        # http://localhost:3000
```

## Open questions to settle first

- **Power data.** Which public sources give substation and capacity
  information (utility hosting-capacity maps, EIA, ISO queue data), and how
  far they get us in the four demo counties.
- **Community sources.** Which official APIs and public records (GDELT,
  Reddit API, county meeting minutes) cover the demo counties well.
- **First user.** Which developer or hyperscaler role the output is for, and
  what decision it helps them make.

## Data sourcing rules

Community sentiment comes from public online discussion, so the prototype has
to respect platform terms and people's privacy:

- **Use official APIs and terms-compliant access only.** Reddit and Threads
  have official APIs with their own terms. Facebook groups and Nextdoor
  prohibit scraping; for those, use only what their terms or a partnership
  allows, or leave them out.
- **Aggregate, don't profile.** Store sentiment at the community level.
  Don't build profiles of individual people or keep personal data longer than
  needed.
- **Keep raw data out of git.** `data/` is ignored; document sources in
  `docs/` instead.

## Layout

```
apps/web/            Next.js app (deployed to Vercel)
pipelines/sites/     site identifier pipeline (Kat)
pipelines/community/ community scrubber pipeline (Dhruv)
db/migrations/       shared schema: the data contract
docs/                architecture, data sources, Vercel setup
.claude/skills/      shared agent skills
data/                local raw data (not committed)
```
