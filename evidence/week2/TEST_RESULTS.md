# Week 2 — Test Results

Date: 2026-09-24

## Scope

These results cover the Week 2 research intake, benchmarks, competitor comparison, risk map, Supabase wiring, and dashboard summary. No user feedback, screenshots, video evidence, or deployment history is inferred here.

## Test 1 — Required-Field Validation

**Result:** PASS — owner-verified production result.

Submitting the research form without a facility type displayed `Choose a facility type` and prevented submission.

## Test 2 — Competitor Search Empty State

**Result:** PASS — owner-verified production result.

Searching the competitor table for `zzzznotfound` displayed `0 of 8` and the no-results message.

## Test 3 — Supabase Persistence and Dashboard Summary

**Result:** PASS — owner-verified production result.

A real Mexico City research record was saved from production `/research` and appeared in the `/dashboard` Research Summary. The verified production summary showed:

- Saved records: `1`
- Market: `mexico city`
- Facility: `shopping mall`

The owner also confirmed the record remained available after refresh.

## Test 4 — Production Build and Diff Hygiene

**Commands:** `npm run build` and `git diff --check`

**Result:** PASS.

- Next.js build completed successfully.
- 15 routes generated.
- No diff whitespace errors reported.

## Evidence Limitations

- The three functional results above are owner-verified production results.
- No participant feedback, screenshots, video, or deployment count is claimed by these tests.
