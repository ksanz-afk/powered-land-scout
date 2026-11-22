# Web app

Next.js 16 app for Powered Land Scout. See `../../docs/architecture.md` and
`../../CLAUDE.md`.

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, as Vercel runs it
```

Data comes from `src/lib/data.ts`, which reads the JSON fixtures in
`src/data/fixtures` until Postgres is connected.
