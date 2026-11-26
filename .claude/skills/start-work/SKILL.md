---
name: start-work
description: Start a task in Powered Land Scout. Use at the beginning of any coding or data session, before editing files.
---

1. Identify the user from `git config user.email` / `gh api user` (Kat = ksanz-afk, Dhruv = dhruvtandon1). Check `CLAUDE.md` for which paths they own.
2. Check `git config user.email`. It must be an email GitHub links to the user's account (best: the GitHub noreply address, `$(gh api user --jq .id)+<username>@users.noreply.github.com`). If it's unset or a hostname address (`...@...local`, `...@...rr.com`), stop and offer to set it with `git config --local user.email`. Otherwise Vercel blocks the deploy.
3. `git checkout main && git pull`.
4. Read `docs/architecture.md` and the schema in `db/migrations/`. If the task touches the other person's area or the schema, say so before starting.
5. Check the GitHub Project board / open issues (`gh issue list`) so you don't start a task someone else holds; assign the issue to the user.
6. Create a branch: `<owner>/<short-task>` (e.g. `kat/site-scoring`, `dhruv/reddit-source`).
7. In `apps/web`, run `npm install` if dependencies changed, and `npx next typegen` if routes changed.
