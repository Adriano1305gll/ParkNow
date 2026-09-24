# Park Now Build Discipline Packet

## Purpose and Evidence Rule

This packet consolidates the existing AI-101 project evidence into one submission document. It is based on the current repository, application routes, Supabase records reported by the project owner, Git history, and existing project documents.

It does not invent user responses, testing metrics, screenshots, deployment history, or approvals. Where evidence is incomplete, the gap is listed explicitly.

## 1. Problem Definition

Park Now addresses the uncertainty drivers face when entering a busy or unfamiliar parking facility without knowing where an available space is located. The stated problem includes unnecessary searching, internal congestion, wasted time, and frustration.

The product response is a visual parking-space map that shows numbered spaces and available or occupied states. Simulated or changing occupancy must be labeled honestly.

**Evidence:**

- [PROJECT_REPORT.md](PROJECT_REPORT.md), Problem Definition.
- [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md), checkpoint 1, confirmed by the project owner on September 23, 2026.

## 2. Target Users and Value Proposition

### Primary User

Drivers who need to park in a large or unfamiliar parking facility.

### Secondary User and Buyer

Parking facility operators, including schools, office campuses, shopping centers, hospitals, airports, hotels, and event venues.

### User Need

The user wants to know where an open parking space is without driving around and guessing.

### Value Proposition

Park Now helps drivers find parking faster by showing current space availability visually. For operators, it provides an occupancy layer that can improve traffic flow, user experience, and utilization visibility.

**Evidence:**

- [PROJECT_REPORT.md](PROJECT_REPORT.md), User Definition and Value Proposition.
- [app/research/page.js](app/research/page.js).
- [app/pricing/page.js](app/pricing/page.js).

**Confirmation status:** The problem is confirmed by the project owner. Target-user approval is still `PENDING HUMAN CONFIRMATION` in [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md).

## 3. Success Criteria and Acceptance Criteria

The project defines success as helping a user understand parking availability in under ten seconds and distinguish available from occupied spaces without assistance.

The documented acceptance criteria are:

- The user can reach Live Parking.
- Available and occupied spaces are distinguishable without explanation.
- Summary counts match visible space states.
- An occupancy update changes both the map and totals.
- Simulated data is clearly identified when sensor data is unavailable.
- The Assistant does not guarantee future availability.
- The product remains readable on desktop and mobile screens.

**Evidence:** [PROJECT_REPORT.md](PROJECT_REPORT.md), Product Specification and UX Concept.

## 4. Product Specification

The MVP includes:

1. Parking-location selection.
2. Visual parking-lot map.
3. Space-level Available / Occupied status.
4. Live or simulated-live occupancy updates.
5. Available, occupied, and occupancy-percentage totals.
6. Operator dashboard.
7. Parking Assistant.
8. Documentation explaining system design and safety limitations.

The current application also includes a deterministic `/core` planning module with trip constraints, recommendation explanation, backup option, cost, walking time, risk information, and a human Save action for valid recommendations.

**Evidence:**

- [PROJECT_REPORT.md](PROJECT_REPORT.md), MVP Features and Acceptance Criteria.
- [app/core/page.js](app/core/page.js).
- [app/parking/page.js](app/parking/page.js).
- [app/dashboard/page.js](app/dashboard/page.js).
- [FINAL_DEMO_SCRIPT.md](FINAL_DEMO_SCRIPT.md).

## 5. UX and Wireframes

The current UX uses a dark visual system, green available states, red occupied states, numbered spaces, summary metrics, explicit simulation language, and grouped navigation: Explore, Plan, Operate, and Learn.

The wireframes are reconstructed from the current application. They are not historical design evidence.

**Evidence:**

- [UX_WIREFRAMES.md](UX_WIREFRAMES.md), reconstructed wireframes for Home, Live Parking, Core, Dashboard, Assistant, and the complete journey.
- [components/Nav.js](components/Nav.js).
- [components/Page.js](components/Page.js).
- [app/globals.css](app/globals.css).

**Confirmation status:** Design and functionality are confirmed by the project owner on September 23, 2026. The wireframes remain explicitly reconstructed documentation.

## 6. Architecture

### Prototype Flow

```text
Simulated occupancy or approved data source
        -> Supabase
        -> Next.js / React data layer
        -> Live Parking Map
        -> Dashboard and Assistant context
```

### Core Recommendation Flow

```text
Trip constraint form
        -> deterministic recommendation
        -> human Save action
        -> Supabase core_outputs
        -> Core dashboard preview
```

### Production Direction

Approved sensors or a parking-management API can replace simulated occupancy through authenticated backend ingestion, Supabase persistence, and Realtime subscriptions.

**Evidence:**

- [PROJECT_REPORT.md](PROJECT_REPORT.md), Architecture Sketch and Agentic Workflow sections.
- [app/core/page.js](app/core/page.js).
- [app/parking/page.js](app/parking/page.js).
- [app/dashboard/page.js](app/dashboard/page.js).
- [app/api/assistant/route.js](app/api/assistant/route.js).
- [app/docs/page.js](app/docs/page.js).

## 7. Technology Stack

- Next.js and React for the frontend.
- Tailwind/PostCSS styling.
- Supabase for persistent data and Realtime subscriptions.
- GitHub for source control.
- Vercel for hosting.
- OpenAI integration for the Parking Assistant API.
- Coding-agent support for implementation, debugging, refactoring, and documentation.

**Evidence:**

- [package.json](package.json).
- [PROJECT_REPORT.md](PROJECT_REPORT.md), Tech Stack and DevOps Plan.
- GitHub repository: <https://github.com/Adriano1305gll/ParkNow>.

**Confirmation status:** Stack implementation is evidenced by the repository. Formal owner approval remains `PENDING HUMAN CONFIRMATION`.

## 8. DevOps and Version Control

The documented DevOps plan includes repository setup, Supabase configuration, environment variables, Vercel deployment, incremental features, user testing, iteration, and final documentation.

The repository contains incremental commits for:

- Initial project setup and styling.
- Supabase dependency and Live Parking integration.
- Dashboard and Assistant integration.
- Generative Core implementation.
- Supabase save flow and RLS-safe save behavior.
- No-match save prevention.
- Database migration.
- User testing, wireframes, human checkpoints, demo script, and final delivery documentation.

**Evidence:**

- [README.md](README.md).
- [PROJECT_REPORT.md](PROJECT_REPORT.md), DevOps Plan and Minimum Commit Plan.
- GitHub history on `main`.
- `.gitignore` excludes local environment files and build output.

## 9. Supabase Integration

The project owner verified the existing Supabase project with these six tables:

- `assistant_logs`
- `core_outputs`
- `occupancy_events`
- `parkin_lots`
- `parking_spaces`
- `user_tests`

The project owner also verified that `core_outputs` increased from 3 to 4 records after a valid recommendation save.

The application uses:

- `parking_spaces` for Live Parking, Dashboard, and Assistant data.
- `core_outputs` for Core saved recommendations and the Core preview.
- Realtime subscriptions for `parking_spaces` in Live Parking and Dashboard.

The incremental migration preserves existing tables and data and creates only supporting tables where needed.

**Evidence:**

- [supabase/migrations/20260924000000_initial_park_now_schema.sql](supabase/migrations/20260924000000_initial_park_now_schema.sql).
- [app/core/page.js](app/core/page.js).
- [app/parking/page.js](app/parking/page.js).
- [app/dashboard/page.js](app/dashboard/page.js).
- [app/api/assistant/route.js](app/api/assistant/route.js).
- [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md), checkpoints 6 and 7.

**Known limitation:** The main Dashboard currently reports occupancy metrics from `parking_spaces`; saved `core_outputs` recommendations appear in the Core preview, not the main Dashboard.

## 10. Testing Plan and Evidence

[USER_TESTING.md](USER_TESTING.md) contains:

- Five realistic scenarios.
- Participant instructions.
- Post-session questions.
- Feedback and bug/improvement tables.
- Screenshot and evidence guidance.
- A final testing summary template.
- Testing-informed improvements.

The project owner reports that five external users evaluated Park Now. Detailed records currently available in the repository are for Users 2, 4, and 5. Detailed responses for Users 1 and 3 are not present, so no values are inferred for them.

The explicit numerical rating average is `4.0/5`, calculated only from User 4 and User 5, both rated `4/5`. User 2 did not provide a rating.

Documented testing-informed improvements include:

- Grouped navigation.
- Clear green/red availability states with numbered spaces.
- Available, Occupied, and Total Spaces metrics.
- More informative Core parking details.
- Clearer loading, error, and empty-data states.
- Accessibility labeling when current recommendation data contains it.

No participant task-completion rates, screenshots, consent records, or User 1/User 3 responses are claimed.

## 11. Coding-Agent Prompt and Workflow Evidence

The project documents two workflows:

### Product Builder

Human defines the problem and acceptance criteria, the coding agent implements a small feature, the human tests it, the agent fixes specific failures, and the human accepts or rejects the change.

### Parking Assistant

The question is classified, current parking context is retrieved, a concise answer is generated, guardrails are applied, and the answer is displayed.

The coding-agent prompt specifies the role, goal, constraints, required pages, core requirements, acceptance criteria, and human approval checkpoints.

**Evidence:**

- [PROJECT_REPORT.md](PROJECT_REPORT.md), Agentic Workflow and Coding Agent Implementation Prompt.
- [app/docs/page.js](app/docs/page.js), `Park Now Core Extraction v1`.
- [FINAL_DEMO_SCRIPT.md](FINAL_DEMO_SCRIPT.md), AI support explanation.

## 12. Scope Cuts and Safety Decisions

The project explicitly excludes payment processing, reservations, license-plate recognition, camera-based computer vision, turn-by-turn navigation, city-wide coverage, native mobile applications, and hardware installation from the MVP.

Safety decisions include:

- No guarantees that a space will remain available.
- Clear simulated-data language.
- No license-plate or vehicle identity collection.
- No unsafe instructions encouraging interaction while driving.
- Explicit uncertainty and risk messaging in Core recommendations.

**Evidence:**

- [PROJECT_REPORT.md](PROJECT_REPORT.md), Scope Cuts, Risks, Mitigations, and Guardrails.
- [app/core/page.js](app/core/page.js).
- [app/api/assistant/route.js](app/api/assistant/route.js).

## 13. Build and Delivery Validation

The current validation evidence is:

- `npm run build` passes.
- The build generates 15 routes.
- `git diff --check` passes.
- The production URL responds successfully.
- The production Core URL responds successfully.
- No `.env.local` or secret key is included in tracked files.
- A final demo script is prepared; a video is not required for this submission audit.

**Evidence:**

- [FINAL_SUBMISSION_CHECKLIST.md](FINAL_SUBMISSION_CHECKLIST.md).
- [FINAL_DEMO_SCRIPT.md](FINAL_DEMO_SCRIPT.md).
- [FINAL_DELIVERY_GUIDE.md](FINAL_DELIVERY_GUIDE.md).

## 14. Remaining Personal Confirmations

The following still require Adriano García's personal confirmation before submission:

1. Target-user definition.
2. Technical stack selection.
3. Approval of the generative Core module.
4. Approval of the Supabase integration.
5. Detailed response records for Users 1 and 3, if those records exist outside the repository.
6. Evidence of a second Vercel deployment, if the course rubric requires two deployments.

The following are already confirmed by the project owner on September 23, 2026:

- Problem and project selection.
- Design and functionality approval.
- User feedback review and iteration approval.
- Dashboard scope acceptance.
- Current implementation approval for final submission.

## Packet Integrity Statement

This packet consolidates existing evidence. It does not claim that missing participant records, screenshots, formal approvals, second-deployment evidence, or dashboard recommendation integration exist. Those items remain visible as pending actions in [FINAL_SUBMISSION_CHECKLIST.md](FINAL_SUBMISSION_CHECKLIST.md).
