# Park Now — Week 2 Submission

Date: 2026-09-24

## Live Links

- Vercel application: https://park-now-seven.vercel.app
- Research: https://park-now-seven.vercel.app/research
- Dashboard: https://park-now-seven.vercel.app/dashboard
- GitHub repository: https://github.com/Adriano1305gll/ParkNow

The production `/research` and `/dashboard` URLs returned HTTP 200 during the final audit.

## Week 2 Deliverables

- [Build Discipline Packet](WEEK2_BUILD_DISCIPLINE_PACKET.md)
- [Product Specification](WEEK2_PRODUCT_SPEC.md)
- [UX Mockup](WEEK2_UX_MOCKUP.md)
- [Coding Prompt Log](evidence/week2/CODING_PROMPTS.md)
- [Test Results](evidence/week2/TEST_RESULTS.md)
- [Final Checklist](evidence/week2/FINAL_CHECKLIST.md)
- [Research records migration](supabase/migrations/20260924120000_research_records.sql)
- [Research implementation](app/research/page.js)
- [Dashboard implementation](app/dashboard/page.js)

## What Was Built

Week 2 extends Park Now with a research and benchmarking workflow. `/research` includes a validated research intake form, five documented global benchmarks, Mexico localization considerations, an eight-entry competitor/substitute comparison with search and category filters, a no-results state, and a risk and opportunity map. Research records are stored in the separate Supabase `research_records` table with a timestamp and RLS read/insert policies. `/dashboard` includes a Research Summary showing the saved-record count and latest research details without replacing the existing parking occupancy analytics.

## Verified Production Tests

1. **Required-field validation — PASS.** The production form displayed `Choose a facility type` and prevented submission when the facility type was missing.
2. **Competitor search empty state — PASS.** Searching for `zzzznotfound` displayed `0 of 8` and the no-results message.
3. **Supabase persistence and dashboard — PASS.** A real Mexico City research record was saved and appeared in the dashboard Research Summary. The owner verified `Saved records: 1`, `Market: mexico city`, and `Facility: shopping mall`, with the record remaining available after refresh.

Technical validation also passed: `npm run build` generated 15 routes and `git diff --check` reported no errors.

## Git Evidence

The five Week 2 implementation commits are recorded in the checklist and repository history:

- `93b9519` — research intake form
- `42572f3` — benchmarks and competitor comparison
- `caa1710` — risk and opportunity map
- `bc25eca` — persistent research records
- `19d14c9` — dashboard research summary

## Remaining Rubric Evidence

The following items are not claimed as complete because no repository or production evidence was provided:

- A separately documented human validation conversation and resulting feedback.
- Production screenshots.
- A 2–3 minute demo video, if required by the course rubric.
- Evidence of two Week 2 Vercel deployments.
- A 150–250 word personal reflection, if required by the course rubric.

These are evidence artifacts, not unresolved application build failures. No participant feedback, screenshots, video, or deployment history is invented in this submission.
