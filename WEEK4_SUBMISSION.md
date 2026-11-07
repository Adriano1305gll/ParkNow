# Park Now — Week 4 Submission

Branch: `week4-final-evidence` (from `main` after PR #4). Repository: https://github.com/Adriano1305gll/ParkNow

## Scope

Week 4 adds a marketing content system on `/marketing`: 10 social posts, 3 short-form video scripts, a 14-day campaign calendar, two A/B experiment designs, and browser-based save/export. Drivers use Park Now free; parking-lot owners are the paying subscribers.

Not changed: Supabase, pricing simulator, dashboard, parking pages, payments, API routes.

## Acceptance Criteria

| # | Criterion | Status |
| --- | --- | --- |
| 1 | 10 posts across Instagram, Facebook, LinkedIn, TikTok | Implemented; checked by automated test |
| 2 | 3 video scripts with hook, scenes, narration, CTA | Implemented; checked by automated test |
| 3 | 14-day calendar balanced between drivers and owners | Implemented (6 driver, 6 owner, 2 both); automated test |
| 4 | Experiment A: two driver headlines, with hypothesis, audience, variants, metric | Implemented; automated test |
| 5 | Experiment B: two owner CTAs, with the same fields | Implemented; automated test |
| 6 | Variant select/compare interface | Implemented; not tested in a browser |
| 7 | Experiments state results are hypothetical | Implemented; automated test on notice text |
| 8 | Save, Load, Delete, Export (CSV and TXT) with localStorage | Implemented; logic covered by automated tests, UI not tested in a browser |
| 9 | Existing Copy buttons keep working | Code unchanged in behavior; not manually verified |
| 10 | No fabricated customer results; simulated parking data labelled | Copy reviewed in code; no real data exists |

## Architecture Notes

```text
app/marketing/page.js (server component)
  -> lib/marketingContent.mjs   posts, scripts, audiences
  -> lib/campaignCalendar.mjs   14-day plan (contentRef -> post/script id)
  -> lib/abExperiments.mjs      experiment definitions + results notice
  -> components/ExperimentCard.js   client: select / compare variants
  -> components/CopyButton.js       client: clipboard
  -> components/SaveButton.js       client: save item -> lib/savedContent.mjs
  -> components/SavedContent.js     client: list, load, delete, export
lib/savedContent.mjs -> browser localStorage (key parknow.savedMarketingContent)
```

- Content and logic live in `.mjs` modules so Node's test runner can import them without a build step. `marketingContent.js` was renamed to `.mjs` for this reason.
- `SaveButton` notifies `SavedContent` through a window event, so no shared state or backend is needed.
- Saved content stays in one browser; it is not stored in Supabase and is lost if browser data is cleared.
- CSV export quotes every cell, doubles embedded quotes, and prefixes cells starting with `=`, `+`, `-`, `@` with `'` to avoid spreadsheet formula execution.

## Test Results

Run in the dev container on this branch:

| Command | Result |
| --- | --- |
| `npm test` | PASS (26 passed, 0 failed) |
| `npm run build` | PASS (compiled successfully, 15/15 static pages) |

Automated tests cover the logic modules only: experiment definitions, save/load/replace/delete, corrupt storage, export formatting (TXT and CSV), and existing campaign/content integrity. React components, the file download, and clipboard behavior have no automated tests.

## Evidence Checklist

- [x] Branch created from latest `main`
- [x] Separate commits: A/B experiments; saved content, export and tests; documentation
- [x] `npm test` passed
- [x] `npm run build` passed
- [ ] Manual browser test of `/marketing` (variant select/compare, Save, Load, Delete, Export, Copy): NOT DONE
- [ ] Screenshots: NOT COLLECTED
- [ ] Real A/B test run: NOT DONE. Experiments are designs only; no results exist
- [ ] Real campaign published or customer conversions measured: NOT DONE
- [ ] Pull request opened and reviewed: see below once created

## Links

- Marketing page: `/marketing`
- Pull request into `main`: to be added when created
