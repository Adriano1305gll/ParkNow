# Week 2 — Test Results

Date: 2026-09-24

## Scope

These results cover the Week 2 research intake, benchmarks, competitor comparison, risk map, Supabase wiring, and dashboard summary. No user feedback, screenshots, video evidence, or deployment history is inferred here.

## Test 1 — Required Fields and Competitor Search/Filter

**Command:** Node smoke test asserting the implemented `/research` contracts in `app/research/page.js`.

**Checks:**

- City/market, facility type, and research question required-field checks exist.
- Search matches solution name and feature.
- Category filtering is present.
- A no-results message is present.

**Result:** PASS. The command reported: `required-field validation, competitor search, category filter, and empty-state contracts are present.`

**Limit:** This was a source-level smoke test, not browser automation. The environment has no Playwright/Cypress tool installed.

## Test 2 — Supabase Save and Refresh Retrieval

**Result:** PASS — owner-verified production result.

The owner confirmed that the migration had already been executed, a real record was saved from production `/research`, and the record remained available after refresh. The verified record contained:

- Saved records: `1`
- Market: `mexico city`
- Facility: `shopping mall`

The implementation and migration wiring also confirm that `/research` inserts into `research_records`, records use the database `created_at` timestamp, and retrieval is ordered by the newest record.

## Test 3 — Dashboard Research Summary and Parking Analytics

**Commands:**

- Static smoke test of `app/dashboard/page.js`.
- HTTP smoke test against the public routes.

**Checks:**

- `parking_spaces` remains the source for occupancy data.
- `available`, `occupied`, and `occupancyRate` calculations remain present.
- `ResearchSummary` and `research_records` loading are present independently.
- `https://park-now-seven.vercel.app/research` returned 200.
- `https://park-now-seven.vercel.app/dashboard` returned 200.
- `https://park-now-seven.vercel.app/parking` returned 200.
- `https://park-now-seven.vercel.app/core` returned 200.

**Result:** PASS for source-level non-regression and public route availability. The owner additionally verified that production `/dashboard` displayed the saved research record with `Saved records: 1`, `Market: mexico city`, and `Facility: shopping mall`.

The parking analytics portion is supported by the source-level non-regression check and successful build. No independent production occupancy values were supplied, so no new production metric claim is made.

## Test 4 — Production Build and Diff Hygiene

**Commands:** `npm run build` and `git diff --check`

**Result:** PASS.

- Next.js build completed successfully.
- 15 routes generated.
- No diff whitespace errors reported.

## Environment and Evidence Limitations

- The local shell did not have Supabase public environment variables, but this did not prevent the owner-verified production save and refresh result recorded above.
- No browser automation dependency was installed; Test 1 remains a source-level smoke test rather than an automated browser interaction test.
- No participant feedback, screenshots, video, or deployment count is claimed by these tests.
