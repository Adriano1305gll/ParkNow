# Week 2 — Coding Prompt Log

## Prompt 1 — Research Intake
Requested: Add city/market, facility type and research question fields; validate required fields; show feedback without claiming persistence; preserve existing pages.

Result: Implemented. npm run build passed (15 routes). git diff --check passed.

## Prompt 2 — Global Benchmarks and Comparison
Requested: Add five documented global parking-solution benchmark cards, Mexico localization notes, eight competitor or substitute entries, search by name or feature, category filters, and a helpful no-results state without implementing persistence.

Result: Implemented on `/research`. Sources were checked with HTTP requests; an inaccessible Parkopedia URL was replaced with the accessible official APCOA Parking URL. `npm run build` passed (15 routes). `git diff --check` passed.

## Prompt 3 — Risk and Opportunity Map
Requested: Add at least four relevant risks with impact and mitigation, plus four opportunities with potential value and next validation step, while preserving the existing research workflow and avoiding persistence.

Result: Implemented on `/research` with four risks and four opportunities in the existing Park Now visual style. The intake, global benchmarks, Mexico localization, competitor table, search, and filters remain in place. `npm run build` passed (15 routes). `git diff --check` passed.

## Prompt 4 — Persistent Research Records
Requested: Persist city/market, facility type, research question, and timestamp in Supabase; retrieve records after refresh; show loading, empty, success, and error states; add RLS and keep research separate from occupancy data.

Result: Implemented on `/research` with the separate `research_records` table and client-side Supabase load/insert flow. Migration added at `supabase/migrations/20260924120000_research_records.sql` with read/insert RLS policies and no service-role credentials. `npm run build` passed (15 routes). `git diff --check` passed.

Database verification: Owner verified that the migration was executed in production, a real Mexico City record was saved, and the record remained available after refresh.

## Prompt 5 — Dashboard Research Summary
Requested: Read `research_records` on `/dashboard`, show the saved-record count and latest research details, add a link to `/research`, preserve occupancy analytics, and include loading, empty, and error states without changing the schema.

Result: Implemented an independent Research Summary widget on `/dashboard`. Existing parking-space loading, occupancy calculations, and realtime subscription remain unchanged. `npm run build` passed (15 routes). `git diff --check` passed.

Database verification: Owner verified that production `/dashboard` displayed the saved record with `Saved records: 1`, market `mexico city`, and facility `shopping mall`.
