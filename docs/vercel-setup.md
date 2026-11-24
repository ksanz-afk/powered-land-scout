# Vercel setup (one time, Kat's account)

1. In Vercel, **Add New → Project** and import `ksanz-afk/powered-land-scout`.
2. Set **Root Directory** to `apps/web`. Framework preset: Next.js.
3. Deploy. Every PR then gets a preview URL posted on the PR.
4. Under **Settings → Collaborators** (or a team), invite Dhruv so he can see
   deployments and logs.
5. Later: add a Postgres database from **Storage / Marketplace** (Neon or
   Supabase); Vercel adds `DATABASE_URL` to the project automatically.
6. Add a custom domain under **Settings → Domains** when ready.

Secrets (API keys for Reddit, Claude, etc.) go in **Settings → Environment
Variables**, never in git.
