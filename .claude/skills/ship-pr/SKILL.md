---
name: ship-pr
description: Check and open a pull request. Use when a task is ready for review.
---

1. In `apps/web`: `npm run lint`, `npx tsc --noEmit`, `npm run build`. Fix anything that fails.
2. Run `python3 pipelines/sites/run.py --check` and `python3 pipelines/community/run.py --check`.
3. Run the app (`npm run dev`) and check the pages you changed, including empty and not-found states.
4. Review the diff: no secrets, no raw data, no edits to the other owner's area without saying so, no lorem ipsum.
5. Push the branch and open the PR with `gh pr create`. Body:
   - **What changed and why**, in plain English (2-4 sentences)
   - **Areas touched** (yours / shared / the other owner's)
   - **How to check it** (pages to visit on the Vercel preview)
   - **Follow-ups** for the other owner, if any
6. Request review from the other owner if the PR touches shared or their files; otherwise merging your own PR after CI passes is fine.
