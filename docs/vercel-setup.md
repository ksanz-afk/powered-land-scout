# Vercel setup (one time, Kat's account)

Merge the scaffold into `main` first: Vercel deploys `main` as production.

1. Sign in at vercel.com with GitHub (`ksanz-afk`).
2. **Add New → Project → Import** `ksanz-afk/powered-land-scout`. If it isn't
   listed, use **Adjust GitHub App Permissions** and grant access to this repo
   only.
3. **Root Directory: `apps/web`** (click Edit). Framework: Next.js (auto).
   Leave build and install commands as defaults. No environment variables yet.
4. **Deploy.** Every PR then gets a preview URL posted as a comment.

## Letting Dhruv see previews

By default, preview links sit behind Vercel login, and the free Hobby plan
doesn't allow teammates. Either:

- **Settings → Deployment Protection:** turn off Vercel Authentication for
  previews, so anyone with the link can view (fine for this demo: no
  sensitive data), or
- move the project to a Pro team and invite Dhruv.

Check the current options in the Vercel dashboard; plan features change.

## Later

- **Database:** add Postgres from **Storage / Marketplace** (Neon or
  Supabase); Vercel adds `DATABASE_URL` to the project.
- **Secrets** (Reddit, Claude API keys, etc.) go in **Settings → Environment
  Variables**, never in git.
- **Custom domain:** **Settings → Domains**.
