# Learn page

Dhruv’s curated electricity briefing is embedded at `/learn`. It keeps the
existing app header and layout. `/learn/electricity` redirects to
`/learn#electricity` for earlier links.

The page shows two cards: the Virginia electricity concern and Microsoft’s
company commitment. Each opens its matching evidence summary. The reader has
Virginia review, Microsoft and Other tabs, with four document thumbnails and
links to the original publications. Other topics and the county cards remain
inactive in this version, as in the reviewed local design. Existing
`/learn/[fips]` pages are unchanged and remain directly accessible.

## Run and check

Use Node 22, matching CI. From `apps/web`:

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 8772
```

Open `http://127.0.0.1:8772/learn`.

Before sharing, run the same web checks as CI:

```sh
npx next typegen
npm run lint
npx tsc --noEmit
npm run build
```

Check the Learn navigation, both opening cards, all three evidence tabs,
four thumbnails and original-source links. Check keyboard tab switching,
Escape to close, focus returning to the opening button, and a narrow viewport.
Visit another app page after Learn to confirm the scoped styles stay contained.

## Files and evidence

- `apps/web/src/app/learn/page.tsx` places the briefing inside the app.
- `apps/web/src/app/learn/electricity/` holds the React components, scoped CSS
  and curated source records.
- `apps/web/public/community-education/assets/evidence/` holds four thumbnails.
- `docs/data-sources.md` registers the documents.

The numerical summaries are transcribed source findings, not an interactive
cost model. JLARC’s ranges are 2024 modeled scenarios for Dominion Virginia;
Microsoft’s 7.9 GW refers to company-reported MISO generation contracts.
Publication dates, passage locations and limitations remain in `evidence.ts`
and `evidence-highlights.ts`. No county-specific forecast or consent claim
is made. Full PDFs and research working files stay outside the repository.

To add another curated source, add its record, a small preview and its source
registry entry, then explicitly choose where it belongs in the reader. A new
county case needs its own evidence and presentation; these Virginia and US
examples should not simply be relabeled for another county.

## Integration boundary

This Learn change starts from `main` at `1369b8f`. It does not require PR #3,
change shared components or data types, or modify Sites, Proposals or Community.
This can be reviewed in its own pull request into `main` before PR #3 merges.
After Kat merges her redesign, update the Learn branch if needed and repeat
the visual checks inside the new layout.

No new dependencies or environment variables are needed. The app’s existing
Vercel setup applies; this integration has not been deployed.
