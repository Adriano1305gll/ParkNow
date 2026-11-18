# ParkNow — Week 6 Architecture

**Purpose:** Record the repository's actual architecture and implemented three-agent `/demo` workflow.
**Status:** Implemented on `week6-implementation`; no merge to `main` or Production deployment is authorized.

Related planning: [Build Discipline Packet](./WEEK6_BUILD_DISCIPLINE_PACKET.md) · [UX mockup](./WEEK6_UX_MOCKUP.md)

## 1. Current repository baseline

The repository is a JavaScript Next.js App Router application. `package.json` pins Next.js 15.5.21, React/React DOM 19.0.0, Tailwind CSS 4.0.17, Supabase JS (`^2.0.0`), and OpenAI (`^5.0.0`). `npm run dev`, `npm run build`, `npm start`, and `npm test` are defined. The test command uses Node's built-in test runner against `tests/*.test.mjs`. No new package is proposed.

| Layer | Actual current role |
|---|---|
| Next.js | App Router pages in `app/`, shared layout, and server route handlers under `app/api/` |
| React | Server-rendered page components by default; interactive pages/components use client components (`'use client'`) and React state/effects |
| Tailwind CSS | Tailwind 4 imported in `app/globals.css`, alongside existing global CSS and component styles |
| Supabase | PostgreSQL accessed from browser components with the publishable key for parking, research, dashboard, and recommendation data; server-only service-role client for chat persistence; Realtime subscriptions refresh selected parking views |
| OpenAI | One Responses API call in `/api/assistant`; no OpenAI call in deterministic `/chat` or the `/core` planner |
| GitHub | Source repository and version history; the Week 6 work is committed on and pushed to `week6-implementation` |
| Vercel | Prior project documents identify Vercel as the deployment host and reference `https://park-now-seven.vercel.app/chat`. Week 6 Preview deployments `7892802200` and `7892937125` completed, but both `/demo` routes redirect to Vercel SSO; project settings and environment configuration remain unverified |

No Vercel configuration file was present in the inspected repository root. Deployment workflow details should be confirmed in the actual Vercel project before any approved release.

## 2. Existing routes and features

| Route | Current behavior | Data/source boundary |
|---|---|---|
| `/` | Product introduction, driver/owner pathways, sample lot map | Home-page map is explicitly labelled simulated |
| `/parking` | Reads `parking_spaces` for lot ID 1, shows status/counts, subscribes to Postgres changes | Database-backed display; database provenance is not evidence of sensor verification |
| `/dashboard` | Reads parking counts and latest research records | UI uses “live” wording for database metrics; independent real-world source/freshness is not established |
| `/core` | Deterministic constraint filtering/ranking over three hard-coded parking options; saves recommendation rows to `core_outputs`; previews up to three saved records | Does not query real availability, routing, traffic, or actual lot prices |
| `/chat` | Rule-based answer from `lib/chatRules.mjs`; sends chat/feedback to server routes when configured | Chat is not an LLM; saves records but does not provide a history browser |
| `/assistant` | Sends question to `/api/assistant`, which reads `parking_spaces` and makes one OpenAI Responses API request | Server key required; prompt calls input “live,” but no verified sensor/real-time feed is documented |
| `/research` | Displays static competitor/market information and saves research-intake records | Supabase `research_records`; static research copy is not new primary research |
| `/pricing` | Illustrative owner plans and local pricing simulator | The page says project prices are illustrative; no payment is processed |
| `/marketing` | Campaign content, calendar, A/B experiment designs, browser save/export | A/B results are hypothetical; saved content uses browser `localStorage` |
| `/product`, `/docs` | Product and supporting information pages | Documentation/copy; no additional agent service |
| `/demo` | Interactive Week 6 walkthrough; runs Parking Planner → Chat Guide → Venture Viability and renders the API execution trace | New route and deterministic agents reuse existing planner/chat/pricing logic. Runs are not persisted; occupancy remains simulated/unverified |

The route list is from the current App Router and navigation. The Week 6 regression plan additionally exercises the existing API handlers `/api/assistant`, `/api/chat/messages`, and `/api/chat/feedback`.

## 3. Current data flow

```text
Browser
  ├─ Next.js pages / React components
  │    ├─ /parking, /dashboard ── Supabase publishable key ──> parking_spaces
  │    │                                      └─ Realtime subscription refreshes query
  │    ├─ /research ───────────── Supabase publishable key ──> research_records
  │    ├─ /core ───────────────── deterministic local rules ──> illustrative result
  │    │                                      └─ Supabase publishable key ──> core_outputs
  │    ├─ /chat ───────────────── local deterministic rules + POST ──> Next.js API
  │    │                                                          └─ service role ──> chat tables
  │    ├─ /assistant ──────────── POST ──> /api/assistant
  │    │                                      ├─ Supabase publishable key ──> parking_spaces
  │    │                                      └─ OPENAI_API_KEY ──> OpenAI Responses API
  │    └─ /marketing ─────────── browser localStorage
  └─ /demo ───────────── POST /api/demo/orchestrate ──> bounded server orchestrator
```

### Occupancy data boundary

`/parking` and `/dashboard` read database rows and can refresh when Supabase emits a change. The repository does not establish that the database is connected to physical sensors, that values are current, or that availability is independently verified. The home page, `/core`, and deterministic chat describe occupancy as simulated or unverified. Therefore, **a Supabase row, Realtime event, changing count, or model answer must not be presented as verified real-time availability**. Some existing page copy does say “live”; do not repeat or strengthen those claims in the Week 6 demo. Revising other pages is outside this proposed scope and needs separate approval.

## 4. Supabase schema and access paths

Migrations in `supabase/migrations/` establish or extend:

- Existing base tables referenced by the project: `parkin_lots`, `parking_spaces`, and `core_outputs`.
- Supporting tables in the initial incremental migration: `occupancy_events`, `user_tests`, and `assistant_logs`. Its SQL comments state these supporting tables are not used by the current UI; the repository contains no active `occupancy_events` write workflow.
- `research_records`, written/read by `/research` and summarized by `/dashboard`.
- `chat_conversations`, `chat_messages`, and `chat_feedback`, written through server handlers in `app/api/chat/` using the server-only service-role client. Browser ownership uses an HTTP-only random token cookie; only its hash is stored for conversation ownership. The chat migration enables RLS and revokes direct `anon`/`authenticated` access.

The parking/research/core pages use the publishable key from the browser and are subject to database RLS/policies. The SQL migrations define public read/insert policies for some tables. Policy effectiveness, production schema state, and the actual source of parking rows were not independently checked during this planning inspection. Do not add a migration or broaden policies for `/demo`.

## 5. Existing agentic capability vs. Week 6 implementation

**Current state:** The repository does not implement a multi-agent framework, an autonomous agent team, or agent orchestration. It has deterministic keyword rules for `/chat`, deterministic ranking logic for `/core`, a database-reading UI, and one OpenAI Responses API call for `/assistant`.

**Implemented Week 6 capability:** `/demo` invokes a working, bounded server-side orchestration flow. It runs three separately testable deterministic specialist agents in sequence and passes structured outputs between them. The agents have task-specific responsibilities but no LLM, autonomous loop, persistent memory, or side effects. This is an executing multi-agent workflow with explicit handoffs; it is not represented as a generative or autonomous AI team. If the official rubric specifically requires LLM-driven autonomy, obtain a scope decision before expanding implementation.

## 6. Implemented `/demo` orchestration architecture and flow

```text
User
  └─ /demo (Next.js/React form + visual execution trace)
       └─ POST /api/demo/orchestrate (validate; create runId; no persistence)
            └─ runDemoOrchestration (sequential, bounded coordinator)
                 ├─ 1. Parking Planner Agent
                 │    ├─ shared pure planner extracted from app/core/page.js
                 │    └─ Supabase publishable-key read of parking_spaces, lot_id=1
                 ├─ 2. Chat Guide Agent
                 │    └─ existing lib/chatRules.mjs getChatReply(question)
                 │         consumes planner result + occupancy disclosure
                 └─ 3. Venture Viability Agent
                      └─ existing lib/pricingScenarios.mjs parseCustomers/calculateRevenue
                           consumes planner result + chat intent
            └─ JSON response: runId + ordered agent statuses/outputs/consumedFrom
```

`/demo` submits a trip request, parking question, and hypothetical owner customer-count scenario. It shows a card for each agent with status, inputs received, output, and a visible handoff to the next card. Existing feature links still lead to `/parking`, `/core`, `/chat`, `/pricing`, `/dashboard`, and `/research`.

### Agent contracts and coordination

The implementation remains JavaScript, so these are JSON contracts rather than TypeScript types. The route validates the request before starting. Use one generated `runId` per valid request and fixed IDs/order:

| Sequence / ID | Inputs | Reused behavior | Structured output |
|---|---|---|---|
| 1 — `parking-planner` | `trip`: destination, arrival time, duration minutes, max walking minutes, budget, accessibility | Existing `/core` plan calculation moved without behavior change to a shared pure module. Read a `parking_spaces` snapshot for lot 1 using the existing Supabase URL/publishable key and public RLS path. The snapshot is context only and must not affect the hard-coded planner's ranking. | `plan`: best/backup, estimate, walk minutes, reasons, risks. Separate `occupancyContext`: `sourceStatus` (`loaded`, `not_configured`, `empty`, `error`), counts only if actually returned, `provenance: "simulated_or_unverified"`, and `facilityRelation: "unverified_to_plan"` |
| 2 — `chat-guide` | `question` plus planner `plan` and `occupancyContext` | Existing `getChatReply`; do not call `/api/chat/messages`, because that handler also persists history. | `intent`, `answer`, `humanHelp`, a `relatedPlan` object containing the actual planner result/caveat, `dataNotice`, and `consumedFrom: ["parking-planner"]` |
| 3 — `venture-viability` | validated `ownerScenario` counts plus planner output and chat intent/data notice | Existing `parseCustomers` and `calculateRevenue`; it does not save to pricing `localStorage`. | `monthlyRevenueMxn`, `annualRevenueMxn`, counts, assumptions, a data-basis note derived from occupancy status and chat intent, and `consumedFrom: ["parking-planner", "chat-guide"]` |

The API response contains `runId`, the three ordered `{ agentId, status, output, consumedFrom }` entries, and any visible error/status details. The UI renders those same records; it does not infer that an agent ran from a static diagram. The chat agent must receive the planner result and include the actual upstream plan/caveat in `relatedPlan`; a test with a changed planner fixture must produce changed `relatedPlan` content. The viability agent must receive both prior results and return a data-basis note derived from their occupancy status/intent while stating that they do not make customer counts or revenue factual.

Although the existing `/parking` page labels lot ID 1 as Central Garage, the source/freshness contract for those rows is not verified. Do not equate that row count with the static `/core` Central Garage recommendation or use it to imply that the recommended lot has those spaces. Display occupancy context in its own card with `facilityRelation: "unverified_to_plan"` unless the owner later approves and documents a validated mapping.

The coordinator calls each agent exactly once, in order, and does not retry or loop. Validate nonempty destination/arrival, positive finite duration/walk/budget, the existing accessibility choices, a nonempty chat question within 300 characters, and whole-number customer counts from 0 to `MAX_CUSTOMERS` before executing any agent. Invalid counts must not flow through `calculateRevenue`'s existing invalid-as-zero behavior. Limit the JSON body to 8 KB. If a required agent throws, report that step as failed and mark downstream steps blocked; do not return a completed-looking result.

Successful queries with recognized rows return `sourceStatus: "loaded"`; an unconfigured project, empty result, query error, or unexpected status returns `not_configured`, `empty`, or `error` respectively. Do not report counts for unexpected data. The deterministic plan may still complete because it does not depend on occupancy. Never substitute zero occupancy, a fixture, or a stale value as a successful live read. Fixtures are allowed only in automated tests. The route makes at most one read-only query per run, has no server-role credential, does not persist/log raw trip or question content, and returns no secrets. Confirm platform-level abuse protection before exposing a public endpoint; do not assume Vercel rate-limiting is configured.

The occupancy reader accepts only rows with recognized `available`/`occupied` states for its summary; if a row contains an unexpected status, return `sourceStatus: "error"` and omit counts.

### API data contract and example

Request shape:

```json
{
  "trip": {
    "destination": "City Hall",
    "arrivalTime": "2026-11-18T19:00",
    "duration": 90,
    "walkingTime": 15,
    "budget": 10,
    "accessibility": "None"
  },
  "question": "Is there parking available right now?",
  "ownerScenario": { "Basic": 20, "Pro": 10, "Enterprise": 3 }
}
```

The response carries three agent records and their handoff references. With the current sample planner data and the `Expected` pricing counts, the expected deterministic values are Central Garage / $6 / 6 minutes, Market Street Lot backup, and $36,967 MXN/month / $443,604 MXN/year. The chat result must state it cannot confirm real-time availability. An occupancy snapshot may be present, but its provenance must remain **SIMULATED / UNVERIFIED**. Arrival time is collected by the existing planner UI but is not used by current ranking logic.

### Services, boundaries, and side effects

- **Existing:** `/core` planning algorithm and form, `/parking` Supabase table/query semantics, `/chat` deterministic rules, `/pricing` simulator and pricing formulas, Next.js/React/Tailwind, Supabase database.
- **New Week 6 implementation:** `/api/demo/orchestrate`, pure shared planner module/refactor, the three agent wrappers, response contracts/trace, `/demo` input and execution UI, and focused unit/integration tests.
- No OpenAI calls, service-role key, chat persistence route, schema/policy change, price-scenario save, or database write is used by orchestration; Supabase is the sole external service and is read-only.
- The new API uses only existing Supabase URL/publishable-key environment settings for its single RLS-protected read; it adds no environment variable. It validates request size/fields, performs no raw-input logging, and needs hosting-level abuse controls confirmed before public rollout.
- On the page, the `SIMULATED / UNVERIFIED` notice is shown before submission, alongside the parking agent result, and in final combined summary. Database Realtime or a row count is never described as sensor verification.
- If the Supabase public query is unavailable, the planner result may still be shown but must show the exact `not_configured`/`empty`/`error` state. Do not silently hide the error.

### Testability design

Keep the orchestrator and agent functions importable without Next.js runtime state. Inject the parking snapshot reader for deterministic fixtures; optionally inject an agent only for a failure-path test. The complete successful integration test must use all real agent functions and the real coordinator, replacing only the external data read. Inspect the returned execution trace, `consumedFrom`, `relatedPlan`, and data-basis note, including assertions that an altered upstream fixture changes downstream context. The route handler test should validate request parsing and response mapping without live Supabase. A separate manual Preview smoke test checks the actual configured read path. No new test framework is proposed.

## 7. Environment and hosting plan

| Variable | Existing consumer | Required handling |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server Supabase clients | Public project URL; configure per environment |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser queries on parking, dashboard, research, and core | Publishable key, not a secret; security depends on reviewed RLS/policies |
| `SUPABASE_URL` | Optional URL override used by server chat client | Server environment only |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/chatServer.mjs` server client | Secret; never send to browser or commit |
| `OPENAI_API_KEY` | `/api/assistant` only | Server secret; paid usage and external data processing require explicit budget/privacy review |

`.gitignore` excludes `.env` and `.env.*` and permits `.env.example`. The actual values and whether each is set in local, Preview, or Production were not inspected and must not be put in these documents. The implemented endpoint reuses the current Supabase URL and publishable-key settings; no new environment variable is added.

GitHub is the source/review workflow; Vercel is the documented hosting target; Supabase is the existing database/realtime service. Before implementation/deployment, confirm GitHub branch protection/checks, Vercel project linkage/build and environment settings, and Supabase project plan/RLS. Free-tier limits and provider terms may change. The OpenAI API is not assumed to be free.

## 8. Reliability, security, and operational limits

- Existing Supabase read components have explicit unconfigured/loading/empty states, but query failures and UI behavior should be exercised in regression.
- Chat persistence and feedback require server configuration; unsaved/error states must not be described as saved.
- `/assistant` requires `OPENAI_API_KEY` and Supabase configuration; current handler returns errors when missing. Its provider call may incur charges.
- Browser publishable keys are intended for public use but must rely on reviewed least-privilege RLS policies; service-role and OpenAI secrets stay server-side.
- Public user research should use aliases and minimal data, with consent for recordings. Do not expose participant records or credentials in screenshots.
- No sensor SLA, data freshness contract, model-accuracy target, rate limit, or business continuity commitment is established by this prototype.

## 9. Architecture validation and human gate

The implementation was verified with the automated test suite, production build, local route smoke checks, and a local valid orchestrator request. Still verify the Vercel Preview environment, complete manual desktop/mobile/keyboard and existing-interaction regression, recruit the five planned external users, and check any separate official rubric. Do not export secrets or personal data. See the [build packet](./WEEK6_BUILD_DISCIPLINE_PACKET.md) and [submission evidence](./WEEK6_SUBMISSION.md).

The project owner approved this architecture and deterministic workflow on 2026-11-18 and authorized implementation on `week6-implementation`. Preview deployment is allowed. Production deployment, merge to `main`, schema/policy changes, and any LLM-driven or sensor integration remain out of scope without separate approval.
