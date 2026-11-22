---
name: schema-change
description: Change the shared data contract (tables, columns, enums). Use whenever a task needs a new field, table or allowed value that both pipelines or the app depend on.
---

The schema is shared, so every change lands in one PR that both owners approve.

1. Add a new numbered migration in `db/migrations/` (e.g. `0002_add_site_owner.sql`). Never edit an applied migration.
2. Update `apps/web/src/lib/types.ts` to match.
3. Update every affected fixture in `apps/web/src/data/fixtures/` so the sample data stays valid.
4. Update `apps/web/src/lib/data.ts` if a query changes.
5. Update the `check()` functions in `pipelines/*/run.py` for new required fields or allowed values.
6. Run `npx tsc --noEmit`, `npm run build` (in `apps/web`) and both `python3 pipelines/*/run.py --check`.
7. Open the PR with title prefix `schema:`. The body states which table changed, why, and what the other owner must do (e.g. "community pipeline must now emit `topic`"). Request review from the other owner.
