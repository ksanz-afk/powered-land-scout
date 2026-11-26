# Powered Land Scout: rules for agents

Rules only, loaded every session. Procedures live in `.claude/skills/`.

## Team and ownership

| Person | GitHub | Owns |
|---|---|---|
| Kat Sanz | @ksanz-afk | Site identifier, project proposer |
| Dhruv Tandon | @dhruvtandon1 | Community scrubber, education hub |

| Path | Owner |
|---|---|
| `apps/web/src/app/sites`, `apps/web/src/app/proposals`, `apps/web/src/app/explore/[fips]/energy`, `pipelines/sites` | Kat |
| `apps/web/src/app/counties`, `apps/web/src/app/learn`, `apps/web/src/app/explore/[fips]/community`, `pipelines/community` | Dhruv |
| `db/migrations`, `apps/web/src/lib/` (types, data, scores), `apps/web/src/app/explore/[fips]` overview and layout, shared components | Both |

Don't edit the other person's area without their OK in the PR.

## Session start

Run the `start-work` skill: pull `main`, read `docs/architecture.md`, branch
per task, and claim the task on the GitHub Project board.

## The data contract

- `db/migrations/` is the contract. Every module joins on `counties.fips`
  (5-digit county FIPS).
- Change the contract only with the `schema-change` skill. It updates the
  migration, `types.ts`, fixtures and `data.ts` together and needs both
  owners' approval (CODEOWNERS).
- Pages read data only through `apps/web/src/lib/data.ts`, never from
  fixtures directly, so the switch to Postgres touches one file.

## Next.js

This is Next.js 16 with Cache Components. APIs differ from older versions:
read `apps/web/node_modules/next/dist/docs/` before writing framework code.
Route `params` are promises; every dynamic route needs `generateStaticParams`
returning at least one param; data loaders use `"use cache"` + `cacheLife`.
Run `npx next typegen` after adding routes.

## Product quality

This should feel like real software, not a demo page.
- Use shadcn/ui components from `src/components/ui` and the shared components
  in `src/components`. Add new shadcn components with `npx shadcn@latest add`.
- Every page handles loading, empty and not-found states.
- No lorem ipsum. Sample rows set `is_sample: true` and show the Sample badge.

## Data sourcing

- Log every source in `docs/data-sources.md` before using it
  (`add-data-source` skill).
- Official APIs or terms-compliant access only. No Facebook or Nextdoor
  scraping.
- Community data is aggregated at county level. Store short excerpts, never
  personal data or profiles of individuals.
- Raw data stays out of git (`data/` is ignored). Secrets go in `.env.local`
  locally and in Vercel environment variables, never in git.

## Shipping

**Vercel rules (Hobby plan):** Vercel deploys a commit only if its author is
linked to Kat's account, and it checks the latest commit.
- Your git email must be one GitHub links to your account. Use your GitHub
  noreply address (`<id>+<username>@users.noreply.github.com`), set per repo:
  `git config --local user.email ...`. A hostname email like
  `you@Your-MacBook.local` gets the deploy blocked.
- PRs merge with **"Create a merge commit"** only (squash and rebase are
  disabled in the repo settings). The merge commit is authored by whoever
  merges, so Kat merging keeps production deploys working.
- Previews of Dhruv's PRs may show "Blocked" on Hobby; that's the plan
  limit, not a code problem. Check changes locally with `npm run dev`.

- One branch per task; merge through PRs. Run `ship-pr` before opening one.
- CI must pass (lint, typecheck, build, pipeline checks). Vercel posts a
  preview URL on every PR; use it to review each other's work.
- Commit messages and PR descriptions say what changed and why, in plain
  English.
