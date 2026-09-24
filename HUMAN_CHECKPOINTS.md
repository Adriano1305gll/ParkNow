# Park Now Human Checkpoints

## Purpose and Evidence Rule

This document records human decisions that are described or evidenced by the current Park Now project materials. It does not create approval evidence after the fact. A decision can be documented without being formally approved, and those cases are marked `PENDING HUMAN CONFIRMATION`.

Dates are included only when they can be tied to a Git commit or an explicit project-owner confirmation. No participant approvals or instructor approval are claimed here.

## Checkpoint Summary

| # | Checkpoint | Status | Date |
| --- | --- | --- | --- |
| 1 | Choose the parking availability problem | CONFIRMED BY PROJECT OWNER | September 23, 2026 |
| 2 | Define target users | PENDING HUMAN CONFIRMATION | Not verifiable |
| 3 | Select the technical stack | PENDING HUMAN CONFIRMATION | 2026-08-20 implementation evidence |
| 4 | Approve UX and application structure | CONFIRMED BY PROJECT OWNER | September 23, 2026 |
| 5 | Choose the generative recommendation module | PENDING HUMAN CONFIRMATION | 2026-09-03 implementation evidence |
| 6 | Connect the application to Supabase | PENDING HUMAN CONFIRMATION | 2026-08-20 to 2026-09-24 implementation evidence |
| 7 | Validate that recommendations save correctly | VERIFIED IMPLEMENTATION CHECK | 2026-09-24 reported verification |
| 8 | Review the live Vercel deployment | VERIFIED DEPLOYMENT CHECK | 2026-09-24 reported verification |
| 9 | Review user feedback and approve iteration | CONFIRMED BY PROJECT OWNER | September 23, 2026 |
| 10 | Accept the current Dashboard scope | CONFIRMED BY PROJECT OWNER | September 24, 2026 |
| 11 | Approve the current Park Now submission | CONFIRMED BY PROJECT OWNER | September 24, 2026 |

## 1. Choosing the Parking Availability Problem

### Decision

Focus Park Now on helping drivers understand which parking spaces are available before or immediately after entering a parking facility.

### Reason

The project report identifies parking uncertainty, unnecessary searching, internal congestion, wasted time, and frustration as the central problem. A visual space-level map provides a focused way to reduce that uncertainty.

### Human Involvement

Adriano García, the project owner, personally identified the available-parking problem and chose to develop Park Now as his university project. The Human Decision Note in `PROJECT_REPORT.md` also records the decision to reject larger MVP features such as reservations, navigation, camera recognition, and payment.

**Status:** `CONFIRMED BY PROJECT OWNER`

**Confirmation date:** September 23, 2026

### Evidence Available

- `PROJECT_REPORT.md`, Problem Definition and Human Decision Note.
- MVP acceptance criteria for the Live Parking experience.
- Current Home and Live Parking implementation.

### Date

September 23, 2026, as confirmed by the project owner.

## 10. Accepting the Current Dashboard Scope

### Decision

Accept the existing Dashboard functionality for the current AI-101 project scope without adding a saved-recommendation view.

### Human Involvement

Adriano García, the project owner, confirmed that the current Dashboard functionality is acceptable and that no additional feature is required unless the course rubric explicitly requires it.

**Status:** `CONFIRMED BY PROJECT OWNER`

**Confirmation date:** September 24, 2026

## 11. Final Submission Approval

### Decision

Approve the current Park Now implementation for the AI-101 final submission.

### Human Involvement

Adriano García confirmed that he is the project owner and personally approves the current implementation for final submission.

**Status:** `CONFIRMED BY PROJECT OWNER`

**Confirmation date:** September 24, 2026

## 2. Defining the Target Users

### Decision

Define drivers in large or unfamiliar parking facilities as the primary users, with parking facility operators as the secondary users and buyers.

### Reason

Drivers need to find an open space without driving around and guessing. Operators need occupancy visibility and a way to improve facility utilization and traffic flow.

### Human Involvement

The user definition and buyer distinction are documented in `PROJECT_REPORT.md`. The document does not identify a separate approval meeting, reviewer, or approval date.

**Status:** `PENDING HUMAN CONFIRMATION`

### Evidence Available

- `PROJECT_REPORT.md`, User Definition and Value Proposition.
- `app/research/page.js`, which describes user pain and primary users.
- `app/pricing/page.js`, which distinguishes drivers from operators.

### Date

Not verifiable from the available evidence.

## 3. Selecting the Next.js, GitHub, Vercel, and Supabase Stack

### Decision

Use Next.js and React for the frontend, GitHub for source control, Vercel for hosting, and Supabase for persistent parking data and Realtime updates.

### Reason

The project report selects these tools because they fit a modern responsive web application, support Vercel deployment, provide a free or low-cost capstone path, and support database-backed parking data.

### Human Involvement

The stack is recorded as the project technology decision and was implemented through the repository setup and integration commits. A named human approval record is not present.

**Status:** `PENDING HUMAN CONFIRMATION`

### Evidence Available

- `PROJECT_REPORT.md`, Tech Stack and DevOps Plan.
- `package.json` includes Next.js, React, Supabase, and OpenAI dependencies.
- GitHub repository: <https://github.com/Adriano1305gll/ParkNow>.
- Commit `6c5a229` added the Supabase dependency on 2026-08-20.
- Commit `1759c0e` connected Live Parking to Supabase on 2026-08-20.
- Commit `6ee8043` connected the Dashboard to Supabase on 2026-08-20.

### Date

2026-08-20 is verifiable for the implementation commits. The approval date is not verifiable.

## 4. Approving the UX and Application Structure

### Decision

Use a dark, scan-friendly interface with shared navigation, a visual numbered parking grid, clear occupancy metrics, a dashboard, an assistant, documentation, and supporting product pages.

### Reason

The UX concept prioritizes understanding availability in under ten seconds. Numbered spaces connect the digital view to physical signage, while labels and contrasting states help users distinguish available and occupied spaces.

### Human Involvement

Adriano García personally reviewed and approved the design and functionality of Park Now throughout development. This confirmation covers the UX structure, navigation, page organization, and implemented functionality.

**Status:** `CONFIRMED BY PROJECT OWNER`

**Confirmation date:** September 23, 2026

### Evidence Available

- `PROJECT_REPORT.md`, UX Concept and Product Specification.
- `UX_WIREFRAMES.md`, explicitly documented as reconstructed current-state wireframes.
- `components/Nav.js` and `components/Page.js`.
- Commit `c576b16` improved the visual design on 2026-08-20.
- Current routes include Home, Live Parking, Research, Product, Pricing, Marketing, Assistant, Dashboard, Docs, Demo, and Core.

### Date

September 23, 2026 for the owner approval; 2026-08-20 is separately verifiable for the visual-design implementation commit.

## 5. Choosing the Generative Parking Recommendation Module

### Decision

Add `/core` as a deterministic recommendation module that converts destination, arrival, duration, walking, budget, and accessibility constraints into a best option, backup option, explanation, cost, walking time, and risks.

### Reason

The module turns the product from a status display into a planning workflow. Deterministic ranking makes the prototype explainable and keeps the output tied to submitted constraints.

### Human Involvement

The module was added through a focused feature commit and later refined for Supabase saving and no-match safety. The project materials do not include a separate approval signature or meeting record.

**Status:** `PENDING HUMAN CONFIRMATION`

### Evidence Available

- Production page: <https://park-now-seven.vercel.app/core>.
- `app/core/page.js` contains the form, validation, deterministic ranking, save flow, no-match guardrail, and saved-output preview.
- `PROJECT_REPORT.md`, Generative Core and Coding Agent Prompt sections.
- Commit `ae6c5ba` added the generative parking Core page on 2026-09-03.

### Date

2026-09-03 is verifiable for the Core implementation commit. The approval date is not verifiable.

## 6. Connecting the Application to Supabase

### Decision

Connect Live Parking, Dashboard, the Assistant API, and Core saved outputs to the existing Supabase project, while keeping simulated-data and safety limitations explicit.

### Reason

Supabase provides persistent parking records, saved recommendations, and Realtime subscriptions without adding a paid backend. The application can use the current schema while leaving room for approved sensor data later.

### Human Involvement

The project owner verified that the existing Supabase project contains six tables and that the migration was executed successfully. The repository contains the implementation and migration history. A separate formal approval record is not present.

**Status:** `PENDING HUMAN CONFIRMATION`

### Evidence Available

- Existing tables verified by the project owner: `assistant_logs`, `core_outputs`, `occupancy_events`, `parkin_lots`, `parking_spaces`, and `user_tests`.
- `supabase/migrations/20260924000000_initial_park_now_schema.sql`.
- Supabase integration commit `70d8818` on 2026-09-24.
- `app/parking/page.js` and `app/dashboard/page.js` read `parking_spaces` and subscribe to Realtime changes.
- `app/core/page.js` reads and inserts `core_outputs`.
- `PROJECT_REPORT.md`, Architecture Sketch and Data Model.

### Date

Implementation dates range from 2026-08-20 to 2026-09-24. The migration execution date is not independently recorded in Git.

## 7. Validating That Recommendations Are Saved Correctly

### Decision

Keep valid recommendation saving as an explicit human action and prevent no-match recommendations from being saved.

### Reason

A valid recommendation contains a best option and useful planning fields. A no-match result does not represent a recommendation and should require the user to adjust constraints instead of creating misleading database data.

### Human Involvement

The project owner reported a live successful save to Supabase. The `core_outputs` count increased from 3 to 4 records. This is a recorded verification, not a claim that all user testing is complete or that a formal reviewer approved the flow.

**Status:** `VERIFIED IMPLEMENTATION CHECK`

### Evidence Available

- `app/core/page.js` blocks no-match saves with `plan.unavailable`.
- Valid saves insert into `core_outputs`.
- The `risks` array is serialized to text-compatible JSON before insertion.
- Commit `8a44819` completed the Supabase save flow.
- Commit `31ece6e` removed the dependency on a post-insert RLS select.
- Commit `61f437d` prevented saving no-match results.
- Project owner reported the live record count changing from 3 to 4.

### Date

2026-09-24, based on the live verification reported during final submission preparation.

## 8. Reviewing the Live Vercel Deployment

### Decision

Use the Vercel production deployment as the accessible final application and verify the production Core route before submission.

### Reason

A public deployment gives reviewers a stable way to inspect the application without setting up the local project. It also demonstrates the intended Next.js and Vercel delivery path.

### Human Involvement

The project owner reported that the latest Vercel production deployment was successfully verified and provided the production URLs. This document does not claim a second deployment or a completed final demo recording.

**Status:** `VERIFIED DEPLOYMENT CHECK`

### Evidence Available

- Production application: <https://park-now-seven.vercel.app>.
- Production Core page: <https://park-now-seven.vercel.app/core>.
- `PROJECT_REPORT.md`, DevOps Plan and Final Demo Script sections.
- `FINAL_DEMO_SCRIPT.md` contains the verification steps and recording placeholders.

### Date

2026-09-24, based on the deployment verification reported during final submission preparation.

## 9. Reviewing User Feedback and Approving Iteration

### Decision

Review the feedback collected from five external users and implement improvements based on their comments.

### Reason

The feedback identified opportunities to improve navigation hierarchy, parking information, accessibility visibility, and loading or no-data states.

### Human Involvement

Adriano García, the project owner, personally reviewed the feedback collected from five external users and decided to implement improvements based on their comments. This confirmation does not add or replace any participant responses or testing evidence.

**Status:** `CONFIRMED BY PROJECT OWNER`

**Confirmation date:** September 23, 2026

### Evidence Available

- `USER_TESTING.md` contains the documented participant feedback and improvement synthesis.
- `PROJECT_REPORT.md` documents the testing-informed improvements.
- The current application includes the resulting navigation, parking-information, and loading/empty-state improvements.

### Date

September 23, 2026, as confirmed by the project owner.

## Human Confirmation Table

Complete these fields only with real confirmation from the project owner, reviewer, or instructor. Blank fields do not represent approval.

| Checkpoint | Confirmed by | Role | Date | Evidence or note |
| --- | --- | --- | --- | --- |
| Parking problem selected | Adriano García | Project owner | September 23, 2026 | CONFIRMED BY PROJECT OWNER |
| Target users defined |  |  |  | PENDING HUMAN CONFIRMATION |
| Technical stack selected |  |  |  | PENDING HUMAN CONFIRMATION |
| UX and application structure approved | Adriano García | Project owner | September 23, 2026 | CONFIRMED BY PROJECT OWNER |
| Generative Core module approved |  |  |  | PENDING HUMAN CONFIRMATION |
| Supabase integration approved |  |  |  | PENDING HUMAN CONFIRMATION |
| Save behavior verified | Project owner reported live verification |  | 2026-09-24 | Record count changed from 3 to 4 |
| Production deployment reviewed | Project owner reported live verification |  | 2026-09-24 | Production URLs listed above |
| User feedback and iteration approved | Adriano García | Project owner | September 23, 2026 | CONFIRMED BY PROJECT OWNER |
| Dashboard scope accepted | Adriano García | Project owner | September 24, 2026 | CONFIRMED BY PROJECT OWNER |
| Final submission approved | Adriano García | Project owner | September 24, 2026 | CONFIRMED BY PROJECT OWNER |

## Explicit Non-Claims

This document does not claim:

- That five real users have completed testing.
- That participant approvals or task-completion results exist.
- That the final five-minute demo has been recorded.
- That a reviewer or instructor has formally approved the submission.
- That all human confirmation fields are complete.
