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

## Rubric Alignment

| Criterion | Status | Evidence |
|---|---|---|
| Build discipline before coding — 1.5 | COMPLETE | The Week 2 scope, success criteria, architecture direction, UX plan, and owner decision are recorded in [WEEK2_BUILD_DISCIPLINE_PACKET.md](WEEK2_BUILD_DISCIPLINE_PACKET.md). The five-step coding sequence is recorded in [CODING_PROMPTS.md](evidence/week2/CODING_PROMPTS.md). |
| UX planning and mockup — 1 | COMPLETE | [WEEK2_UX_MOCKUP.md](WEEK2_UX_MOCKUP.md) defines the research intake, benchmarks, Mexico localization, comparison table, risk map, saved research, and dashboard summary. It is planning evidence, not historical screenshot evidence. |
| Product spec — 1 | COMPLETE | [WEEK2_PRODUCT_SPEC.md](WEEK2_PRODUCT_SPEC.md) defines FR1–FR10, acceptance criteria, technical constraints, and the definition of done. |
| Architecture and stack — 1 | COMPLETE | [BUILD_DISCIPLINE_PACKET.md](BUILD_DISCIPLINE_PACKET.md) and [PROJECT_REPORT.md](PROJECT_REPORT.md) document Next.js/React, Tailwind/PostCSS, Supabase, GitHub, Vercel, and the OpenAI assistant integration. The research flow uses `research_records` separately from `parking_spaces`; [app/research/page.js](app/research/page.js) and [app/dashboard/page.js](app/dashboard/page.js) show the client data flow. |
| Working deployment — 2 | COMPLETE for the verified deployment | The live application is at https://park-now-seven.vercel.app. Production `/research` and `/dashboard` returned HTTP 200 during the audit, and the owner verified the research record in production. Evidence of a second Vercel deployment is still missing. |
| Build evidence — 1 | COMPLETE | `npm run build` passed and generated 15 routes; `git diff --check` passed. Results are recorded in [TEST_RESULTS.md](evidence/week2/TEST_RESULTS.md). |
| Testing iteration — 1 | PARTIAL | Recorded feedback from Users 2, 4, and 5 in [USER_TESTING.md](USER_TESTING.md) was reviewed, then grouped navigation, clearer availability totals/states, richer Core details, accessibility labeling, and clearer loading/no-data states were implemented; [PROJECT_REPORT.md](PROJECT_REPORT.md) records those changes. Detailed records for Users 1 and 3 are absent, so no complete five-user synthesis is claimed. The three final production checks are recorded in [TEST_RESULTS.md](evidence/week2/TEST_RESULTS.md). |
| Human judgment — 1 | PARTIAL | [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md) documents owner decisions on the parking problem, UX structure, scope cuts, simulated-data disclosure, stack clarification, Supabase integration, dashboard scope, and final submission. A separate human validation conversation for the Week 2 workflow is not documented and requires personal confirmation. |
| Demo clarity — 0.5 | PARTIAL | [FINAL_DEMO_SCRIPT.md](FINAL_DEMO_SCRIPT.md) provides a prepared walkthrough and guardrails. A final recorded demo/video is not present, so this is not claimed as completed evidence. |

## What Was Built

Week 2 extends Park Now with a research and benchmarking workflow. `/research` includes a validated research intake form, five documented global benchmarks, Mexico localization considerations, an eight-entry competitor/substitute comparison with search and category filters, a no-results state, a risk and opportunity map, and Supabase-backed saved research. `/dashboard` includes a Research Summary showing the saved-record count and latest research details without replacing the existing parking occupancy analytics.

## Architecture and Stack

The frontend uses Next.js and React with Tailwind/PostCSS styling. Vercel hosts the production application, GitHub records the implementation history, and Supabase stores parking data, research records, and other project evidence. The research path is:

```text
Research intake -> Supabase research_records -> /research saved list and /dashboard Research Summary
```

The parking path remains separate:

```text
parking_spaces -> occupancy calculations and Realtime updates -> /parking and /dashboard parking analytics
```

The migration and RLS policies are documented in [20260924120000_research_records.sql](supabase/migrations/20260924120000_research_records.sql). No service-role credential is used in the client.

## Testing to Improvement Sequence

1. The project documented a five-part usability plan in [USER_TESTING.md](USER_TESTING.md).
2. The repository contains detailed records for Users 2, 4, and 5, including requests for clearer hierarchy, accessible-space identification, richer parking details, and clearer loading/no-data states. Users 1 and 3 remain undocumented here.
3. The implementation incorporated the documented improvements: grouped navigation, clearer Live Parking totals and states, more informative Core details, accessibility labeling when data exists, and clearer loading/empty states. The evidence and limitations are recorded in [PROJECT_REPORT.md](PROJECT_REPORT.md).
4. The final owner-verified production checks then confirmed required-field prevention, the competitor empty state, and research persistence/dashboard display. These checks validate the implementation; no additional improvement is claimed from them.

## Verified Production Tests

1. **Required-field validation — PASS.** The production form displayed `Choose a facility type` and prevented submission when the facility type was missing.
2. **Competitor search empty state — PASS.** Searching for `zzzznotfound` displayed `0 of 8` and the no-results message.
3. **Supabase persistence and dashboard — PASS.** A real Mexico City research record was saved and appeared in the dashboard Research Summary. The owner verified `Saved records: 1`, `Market: mexico city`, and `Facility: shopping mall`, with the record remaining available after refresh.

Full results are in [TEST_RESULTS.md](evidence/week2/TEST_RESULTS.md).

## Documented Human Decisions

The owner chose the parking-availability problem, kept the MVP focused by rejecting reservations/navigation/camera/payment scope, required simulated-data disclosure, accepted a simple numbered grid, approved the UX structure, verified Supabase integration, accepted the dashboard scope, and approved the current submission. These decisions are documented in [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md) and the Human Decision Note in [PROJECT_REPORT.md](PROJECT_REPORT.md). Target-user approval and a separate Week 2 human-validation conversation remain personal confirmations, not assumed approvals.

## Short Demo Walkthrough

This is a prepared walkthrough, not evidence that a video has been recorded:

1. Open the live Home page and explain the parking-information problem and simulated-data limitation.
2. Open `/parking` and show available, occupied, total, and numbered-space states.
3. Open `/research`, demonstrate required-field validation, then show the five benchmarks, Mexico localization, searchable comparison, risk map, and saved research record.
4. Open `/dashboard` and show the existing parking analytics beside the Research Summary with the verified record count and latest market.
5. Open `/core` to show the deterministic recommendation and human Save action, then close with the documented safety limitations.

The full prepared script is [FINAL_DEMO_SCRIPT.md](FINAL_DEMO_SCRIPT.md). No final video link is claimed.

## Git Evidence

The five Week 2 implementation commits are recorded in the checklist and repository history:

- `93b9519` — research intake form
- `42572f3` — benchmarks and competitor comparison
- `caa1710` — risk and opportunity map
- `bc25eca` — persistent research records
- `19d14c9` — dashboard research summary

## Missing or Personally Confirmed Items

The following are not claimed as complete because evidence is absent or requires Adriano García's personal confirmation:

- Detailed response records for Users 1 and 3, if they exist outside the repository.
- A separate human validation conversation for the Week 2 workflow.
- Production screenshots.
- A 2–3 minute demo video, if required by the course rubric.
- Evidence of two Week 2 Vercel deployments.
- A 150–250 word personal reflection, if required by the course rubric.

No participant feedback, screenshots, video, second deployment, or approval is invented in this submission.
