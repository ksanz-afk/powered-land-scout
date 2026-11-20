# Community education demo

A standalone resident briefing about data centers and electricity bills: a company commitment, a cost concern, supporting evidence, and a practical contact step. This is Dhruv’s education component only.

## Run

From the repository root:

```sh
python3 -m http.server 8768 --bind 127.0.0.1 --directory src/community-education/public
```

Open http://127.0.0.1:8768. Use a different port if 8768 is occupied. You can also open `public/index.html` directly.

No installation, build, accounts, secrets, or external services are needed. The page and document previews work offline; publisher/contact links require internet. Nothing is sent or stored about residents.

## Files and integration

- `public/index.html`: page, illustration, evidence and contact dialogs.
- `public/styles.css`: component styles scoped to `#ce-brief`, plus one standalone `body` rule.
- `public/app.js`: interactions; `public/evidence.js`: curated source records.
- `public/assets/evidence/`: four previews rendered from supplied PDFs. Full PDFs are not bundled.

Start by linking to this standalone page from the main app. For later embedding, retain `#ce-brief` and the two dialogs, load `evidence.js` before `app.js`, preserve relative asset paths, and adapt the standalone body styling. One instance per page is supported. The root emits `education:change` with `{view: 'brief' | 'contact', source: string | null}`; nothing listens outside the component by default.

This is a static `public` folder. It can use the main app’s eventual hosting setup; no Vercel configuration or deployment is included.

## Evidence and boundaries

Reviewed November 19, 2026. These documents are separate examples, not records for one assessed site. No bill forecast, approval score, or user validation is claimed. The illustration is conceptual.

- **Virginia JLARC, December 9, 2024:** summary printed page v (PDF page 9), continued on vi. Existing service costs and future growth are distinct findings.
- **Virginia SCC, November 25, 2025:** official announcement, PDF page 1, case PUR-2025-00058. The announced new rate-class date is January 1, 2027. The full order/tariff and project eligibility were not assessed. Percentages refer to contracted demand, not total project costs.
- **Microsoft, January 13, 2026:** hero quotation on PDF page 1; electricity passage on page 2. US company policy, not a site agreement or verified outcome.
- **Feng and You, Nature Energy, November 9, 2026:** excerpt on PDF page 2; main-text methods on pages 10–11. Date checked visually because the text layer has a placeholder. Supplementary methods were not supplied.

Each record contains its publisher link, date, passage location, limitation, and preview description. Government/research previews show first pages; SCC/Microsoft previews crop the original announcement pages. Highlights are editorial emphasis on unchanged source text. Full source details are available inside the reader.

Contact: [Dominion’s official Virginia support page](https://www.dominionenergy.com/service), Customer Service section, checked November 19, 2026. The number/hours are sourced; the request wording is our suggestion. This is general customer service for the Dominion example, not a project-specific contact or a guarantee of disclosure.

To add another source, add its record and preview to `evidence.js` and the source ID to the display-order list in `app.js`. Keep highlight phrases verbatim and in reading order. A new case also needs its visible briefing and contact scope updated; changing a source alone does not create a site assessment.

## Check before sharing

1. At 1280 × 800 and 360px width, confirm the page and dialogs remain readable without horizontal overflow.
2. Open all four sources. Verify thumbnails, findings, highlighted passages, details, and original links match.
3. Open evidence by keyboard, expand a passage, and use Close/Escape. Focus should return to the opening control.
4. Open the contact panel. Check its official link and source date; opening the panel must not send a message or call anyone.
5. After content edits, check quotations against the cited documents. For feedback, ask a resident what the promise guarantees, what remains unanswered, and whom they would contact. Keep their observations separate from your interpretation.

Desktop/mobile browser checks and passage checks passed for this handoff. Cross-browser coverage, integration into the main app, and Vercel deployment have not been tested.
