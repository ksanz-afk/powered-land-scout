---
name: start-work
description: Start a task in Powered Land Scout. Use at the beginning of any coding or data session, before editing files.
---

1. Identify the user from `git config user.email` / `gh api user` (Kat = ksanz-afk, Dhruv = dhruvtandon1). Check `CLAUDE.md` for which paths they own.
2. `git checkout main && git pull`.
3. Read `docs/architecture.md` and the schema in `db/migrations/`. If the task touches the other person's area or the schema, say so before starting.
4. Check the GitHub Project board / open issues (`gh issue list`) so you don't start a task someone else holds; assign the issue to the user.
5. Create a branch: `<owner>/<short-task>` (e.g. `kat/site-scoring`, `dhruv/reddit-source`).
6. In `apps/web`, run `npm install` if dependencies changed, and `npx next typegen` if routes changed.
