# ParkNow — Week 6 Build Discipline Packet

**Assignment:** Integrated Agentic Venture + Impact & Viability  
**Required live page:** `/demo`  
**Status:** Approved planning baseline. The project owner authorized implementation on `week6-implementation` on 2026-11-18; production deployment and merging to `main` are not authorized.

Related planning: [UX mockup](./WEEK6_UX_MOCKUP.md) · [Architecture](./WEEK6_ARCHITECTURE.md)

## 1. Requirement source and approval

This packet was checked against the Week 6 requirements in the assignment brief supplied for this task. No separate official rubric, course handout, or grading link was present in the repository or supplied with the brief. If an additional official rubric exists, compare it before implementation; this packet does not infer undisclosed grading criteria.

| Field | Status |
|---|---|
| Planning version | Approved, 2026-11-18 |
| Approver / approval evidence | Project owner approved the three planning documents and deterministic multi-agent scope in chat on 2026-11-18 |
| Scope approval | Approved |
| Implementation authorization | **Yes, on `week6-implementation`; no merge to `main` or production deployment** |
| Sources inspected | Repository source, Weeks 2–5 submissions/plans, tests, and Supabase migrations; assignment brief |

## 2. Problem and target users

**Problem:** Drivers and parking-lot operators need a clearer way to understand ParkNow's prototype capabilities and limitations. The existing features are spread across routes; some labels can be mistaken for verified live availability even though the underlying data provenance is not established. The `/demo` page should connect the existing driver and operator journeys, explain how the current decision-support components work, and make uncertainty and business assumptions visible.

| User | Need | Current evidence / assumption |
|---|---|---|
| Driver / visitor | Find the relevant ParkNow feature, compare an illustrative parking plan, and know whether availability is verified | Existing `/parking`, `/core`, and `/chat`; the home page identifies sample occupancy as simulated |
| Parking-lot owner / operator | Understand the operator proposition, see illustrative pricing, and assess the dashboard and research tools | Existing `/pricing`, `/dashboard`, `/research`; no verified operator interviews or willingness-to-pay results are supplied |
| Evaluator / stakeholder | Follow a concise end-to-end walkthrough, inspect the agent/feature map, and assess evidence and risks | Existing `/demo` is only a seven-step outline and claims five-user feedback without attached proof |

**Value proposition to test, not a proven impact claim:** ParkNow may help drivers compare parking options and help operators explore occupancy and pricing workflows. The prototype does not establish that it reduces search time, traffic, emissions, or operating costs.

## 3. Goal, scope, and success criteria

**Goal:** Turn `/demo` into an interactive, testable integrated product demonstration. A server-side orchestrator runs three bounded specialist agents in sequence, reusing the existing parking planner, chat rules, and pricing calculation. Each agent returns structured output; downstream agents consume explicit upstream outputs. The demo must disclose that occupancy is simulated or unverified.

**Proposed in scope after approval:** `/demo` form and execution/results UI; a new server route and orchestration module; three specialist agent functions; extracting the current `/core` planner into a shared pure module without changing its behavior; a read-only occupancy snapshot using the existing `parking_spaces` data and public RLS access; explicit execution trace/handoffs; focused tests; and the walkthrough, saved-record links, evidence summary, impact/viability/risk, and V2 roadmap.

**Proposed out of scope:** generative model calls, autonomous planning loops, agent memory, tool execution beyond the three fixed services, any writes to parking/chat/research/pricing data from the orchestrator, sensor/availability integrations, reservations, payments, accounts, new database tables/migrations, collecting user-test data through the public site, and validated business or environmental impact claims.

### Success criteria

1. A first-time evaluator can follow the walkthrough and reach the named existing features from `/demo`.
2. One valid `/demo` run executes each of the three named agents exactly once, in the documented order, and displays each status and output.
3. The orchestration response contains verifiable upstream-to-downstream references; the chat agent consumes the planner result and the viability agent consumes both planner and chat results.
4. The example is marked illustrative/simulated and agrees with `/core`'s current deterministic options and constraints.
5. The page distinguishes records that can actually be saved from conversation history that is saved but not browsable as a history list.
6. Five external participants complete the planned tasks; results are recorded without fabricating missing observations. Target: at least 4/5 can find the core demo links, identify the handoffs, and correctly explain that parking availability is not verified live.
7. All site routes and core flows pass the regression checks in §10; `npm test` and `npm run build` pass on the approved implementation branch.
8. Evidence is captured for at least five meaningful implementation commits, two Vercel deployments, and five actual coding prompts. These are future evidence targets, not claims that they already exist.

## 4. Product specification and acceptance criteria

| ID | Requirement / measurable acceptance criterion | Verification |
|---|---|---|
| W6-01 | `/demo` responds successfully and presents a clear title, audience, purpose, and ordered walkthrough. | Production/preview HTTP check and desktop/mobile browser capture |
| W6-02 | The walkthrough links to existing `/parking`, `/core`, `/chat`, `/assistant`, `/dashboard`, `/pricing`, and `/research` routes; every link resolves to the intended page. | Automated link/route check plus manual click-through |
| W6-03 | Orchestrator validates the request and runs Parking Planner → Chat Guide → Venture Viability once each; returns ordered statuses/results and stable `runId`. | Orchestrator integration test with injected parking-data adapter |
| W6-04 | Parking Planner reuses the `/core` pure planning logic and returns the same best option, cost, walk time, backup, and risks for the same input. It returns explicit occupancy provenance and keeps the snapshot separate from the planner result. | Existing `/core` regression plus planner unit tests |
| W6-05 | Chat Guide invokes the existing `getChatReply` rule engine and consumes the planner result. Availability answers cannot promise a space; an unsupported question preserves `humanHelp`. | Agent test for availability and unsupported intents |
| W6-06 | Venture Viability reuses `parseCustomers` and `calculateRevenue`; it consumes both planner and chat outputs and labels counts/revenue hypothetical. For the `Expected` scenario, output is $36,967 MXN/month and $443,604 MXN/year. | Unit test against existing pricing calculation and handoff references |
| W6-07 | Each agent result includes `agentId`, `status`, structured output, and `consumedFrom` references; response trace proves all handoffs. A required agent failure is visible and blocks dependent agents; no success-shaped fallback. | Full orchestration test asserts order, executions, and references |
| W6-08 | Missing/unavailable Supabase data is represented as `not_configured`, `empty`, or `error`, never as zero available or verified live; snapshot counts are not attributed to the static recommended option without verified mapping. | Inject each data status and assert visible structured state |
| W6-09 | `/demo` displays each agent's execution status/output and an explicit simulated/unverified occupancy caveat; no orchestration action writes to existing records. | Browser test and source inspection; database remains unchanged |
| W6-10 | Saved-result guidance links to `/core` and `/research`; chat persistence is described without promising a history browser. | Manual link/behavior check |
| W6-11 | Evidence is labelled by source/status; impact and viability claims remain hypotheses; V2 is conditional. | Copy review against this packet |
| W6-12 | Existing navy/green style, shared navigation, keyboard focus, headings, link names, and narrow-screen layout are preserved. | Desktop/mobile keyboard and viewport checks |
| W6-13 | No other route's behavior, existing Supabase schema/policies, secret handling, or service behavior changes outside the approved refactor. | Diff review and regression tests |

### Agent contracts and per-agent acceptance

| Agent | Responsibilities and inputs | Outputs and handoff |
|---|---|---|
| **Parking Planner Agent** | Accepts validated trip fields (`destination`, `arrivalTime`, `duration`, `walkingTime`, `budget`, `accessibility`); runs the extracted existing deterministic `/core` planner. Separately reads the current lot-1 `parking_spaces` snapshot using the same public Supabase configuration/table as `/parking`. | `plan` (best/backup, price, walking time, reasons, risks) plus separate `occupancyContext` with status, counts only when returned, `SIMULATED / UNVERIFIED` provenance, and `facilityRelation: "unverified_to_plan"`. Do not merge the snapshot into or attribute it to the static plan. Its outputs are passed to Chat Guide and Venture Viability. Arrival time does not affect the current ranking. |
| **Chat Guide Agent** | Accepts a question (existing 300-character chat limit) and the planner's `plan`/`occupancyContext`; calls existing `getChatReply` rules, without calling the persistence API. | `intent`, `answer`, `humanHelp`, a `relatedPlan` context copied from the planner output, and `consumedFrom: ["parking-planner"]`; availability intent retains the explicit non-guarantee. Its result and the planner output are passed to Venture Viability. |
| **Venture Viability Agent** | Accepts plan and chat result (including occupancy status and intent) plus validated Basic/Pro/Enterprise hypothetical customer counts; calls existing `parseCustomers` and `calculateRevenue`. | Monthly/annual modeled revenue, the three counts, assumptions, data-basis note, and `consumedFrom: ["parking-planner", "chat-guide"]`. Explicitly says revenue is hypothetical and not derived from occupancy, bookings, actual customers, or validated willingness to pay. |

For the existing `Expected` counts (20 / 10 / 3), calculation is `20×499 + 10×1,499 + 3×3,999 = 36,967` MXN/month and 12× monthly = 443,604 MXN/year. These are outputs of the illustrative pricing formula, not forecasts or observed business results.

## 5. UX requirements

See [WEEK6_UX_MOCKUP.md](./WEEK6_UX_MOCKUP.md). The page collects one trip, one chat question, and one hypothetical owner scenario, then shows the three agents executing and exchanging structured outputs. Retain the guided feature links, saved-record paths, evidence summary, impact/risk, and V2 roadmap. Preserve the navy/green style and show an explicit occupancy caveat beside agent results.

## 6. Scope cuts

- No OpenAI or other paid model call in the orchestrated flow; agents use existing deterministic logic, with no autonomous loop or persistent memory.
- No writes from orchestration to Supabase, `localStorage`, chat history, feedback, pricing scenarios, occupancy, or research records.
- No simulation control that changes occupancy; database reads are a snapshot only and never establish real-world freshness.
- No reservations, payments, account/operator workflows, new schema/migrations, auth, or analytics package.
- No saved orchestration runs or user profiling; results exist only in the response/page state.
- Do not display invented user quotes, completed test results, deployment IDs, screenshots, or prompt logs.
- Do not claim time, traffic, emissions, actual revenue, or customer improvements without a defined measurement and collected evidence.
- If an official rubric requires LLM-driven or autonomous agents rather than deterministic specialists with real handoffs, stop for scope approval; this proposal makes no such claim.

## 7. Architecture and data flow

The actual current architecture and the proposed Week 6 runtime are documented in [WEEK6_ARCHITECTURE.md](./WEEK6_ARCHITECTURE.md). The proposed `/demo` page adds a server route/orchestrator and three bounded agent wrappers that reuse existing logic; only the parking agent performs a read-only Supabase query. No run persistence, chat persistence call, write, LLM request, schema change, or new dependency is required.

## 8. Free-stack technology and cost plan

| Technology | Current/proposed use | Cost / qualification |
|---|---|---|
| Next.js, React, Tailwind CSS | Existing app framework, UI, and styling; reuse for `/demo` | Open-source packages; hosting and operations are separate |
| Node.js built-in test runner | Existing `npm test` test command | No additional test service required |
| GitHub | Existing repository, branches, review, and source history | Free-tier availability/limits apply; use a pull request and preserve review evidence |
| Vercel | Existing documented production host and proposed preview/prod validation | Plan limits and current account/project settings must be confirmed; do not assume two deployments are free or already configured |
| Supabase | Existing PostgreSQL and Realtime reads, research/core records, and server-side chat persistence | Free-tier quotas/retention may change; verify current project plan and do not put credentials in the packet |
| OpenAI API | Existing `/api/assistant` route only | **Not assumed free.** Usage may incur charges; `/demo` must not add calls. Confirm key, model availability, usage controls, and budget before using this route in a test |
| Browser localStorage | Existing `/marketing` saved content | Browser-local only; no cross-device persistence |

## 9. GitHub, Vercel, Supabase, and environment-variable plan

**GitHub:** After approval, create/use a feature branch, keep this approved plan as the scope baseline, make at least five meaningful commits (no empty or artificially split commits), open a PR, and record the PR, commit SHAs, checks, review, and merge decision. Do not push before approval. Do not commit credentials or participant personal data.

**Vercel:** Verify the linked project, GitHub branch integration, build command, domains, and Preview/Production environment settings before testing. After approval, record two distinct successful deployment records with deployment URL, environment, source SHA, status, date, and `/demo` verification. A preview plus a production deployment is the suggested pair, subject to owner approval; never deploy this draft.

**Supabase:** Reuse the current project/schema for read-only inspection and already-supported records; this proposal requires no migration. Use a separate test project or clearly identified test records where feasible. Check RLS and policies before public tests; do not loosen access to make tests pass. Verify deletion/retention of test records with the owner. Never copy production rows, credentials, or personal data into GitHub evidence.

| Variable | Existing use | Handling |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server Supabase URL | Public configuration; set per local/Preview/Production environment |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser Supabase client for parking, research, dashboard, and core | Publishable key, not a secret; restrict access with reviewed RLS/policies |
| `SUPABASE_URL` | Optional server-side URL override for chat persistence | Server environment; use only if needed |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only chat persistence client | Secret; never prefix `NEXT_PUBLIC_`, print, screenshot, or commit |
| `OPENAI_API_KEY` | Server-only `/api/assistant` | Secret; budget/usage approval required; do not expose to browser or add calls |

`.env` and `.env.*` are ignored, with `.env.example` allowed by `.gitignore`. Do not populate documentation with actual values. Verify that required settings exist per environment without exposing values. Missing variables should be documented as an environment limitation, not bypassed with secret exposure.

## 10. Test plan

### Five external participants

Recruit five people who are not the builder; target three drivers/visitors and two lot owners/operators if available. Obtain permission for notes/screenshots/recording, use aliases, avoid collecting unnecessary personal information, and record date, device/browser, deployment SHA/URL, task completion, time, help, misunderstandings, and follow-up. Existing entries in `USER_TESTING.md` are incomplete/historical notes and do not count automatically as five complete Week 6 sessions.

Each participant is asked to:
1. Start at `/demo` and explain the product in their own words.
2. Enter the documented trip, availability question, and sample operator counts; run the orchestration.
3. Identify the three agents and explain what data moved between them by following the visible `consumedFrom`/handoff labels.
4. Explain the parking result and simulated/unverified occupancy caveat; verify that no space was guaranteed.
5. Explain the hypothetical revenue output and identify one excluded assumption.
6. Find the existing saved-result/research path and distinguish it from saved chat history.
7. Identify one practical benefit and one risk/limitation; drivers also locate availability information, operators locate pricing/dashboard information.

**Pass targets:** 4/5 reach the named route without facilitator direction; 4/5 correctly state that displayed availability is not verified real-time; 4/5 interpret the example as a simulated recommendation; no participant is led to believe that support, booking, or payment occurred. Record individual results; if a target is missed, classify it as a product issue and revise/retest only after approval.

### Automated, manual, and full-site regression

#### Orchestration/agent test cases

| Test | Setup and action | Required observable result |
|---|---|---|
| AG-01 Parking Planner executes existing rules | Submit the documented City Hall / 90-minute / 15-minute walk / $10 example with a fixture occupancy snapshot. | Planner agent executes once; returns Central Garage ($6, 6 minutes) and Market Street Lot backup; output retains simulated/unverified provenance and keeps the snapshot separate from the plan. |
| AG-02 Chat Guide consumes planner output | Use “Is there parking available right now?” with AG-01's result. | Chat agent executes after planner, `consumedFrom` identifies `parking-planner`, reuses the availability rule, and states availability cannot be confirmed/guaranteed. |
| AG-03 Venture Viability consumes both prior outputs | Use `Expected` counts (20 / 10 / 3). | Agent executes after both; `consumedFrom` identifies both prior agents; outputs $36,967 MXN/month and $443,604/year as hypothetical, not measured revenue. |
| AG-04 Complete flow proves data exchange | Run the real orchestrator and all real agents with only the parking reader replaced by a deterministic fixture; inspect trace and structured response. | Exactly three completed agents appear in order; run ID is consistent across response/trace; downstream inputs contain upstream result references and changing a planner fixture changes Chat Guide `relatedPlan` and Venture Viability's data-basis note. |
| AG-05 Unsupported chat remains bounded | Use a valid but unsupported question. | Chat Guide outputs existing unsupported/human-help behavior; no false support message is sent; subsequent viability agent receives the `unsupported` intent. |
| AG-06 Occupancy source unavailable | Run with Supabase unconfigured, empty, query-error, and unexpected-status adapters. | Planner result remains clearly simulated; occupancy status is respectively `not_configured`, `empty`, or `error`; unexpected status yields no counts; no state is converted to “0 available” or “live”; page shows the warning. |
| AG-07 Invalid input and agent error | Submit invalid planner/question/customer count and an over-8-KB body; separately force a required downstream agent to throw using a test-only injected agent. | Invalid request is rejected before execution; invalid counts are not silently treated as zero; on an agent failure the failed step is reported and dependent steps are blocked; no invented/partial success is returned as complete. |
| AG-08 No persistence or model call | Run the workflow and inspect writes/provider invocation and source logging. | No chat, feedback, pricing scenario, occupancy, or research write occurs; OpenAI is not called; raw request text is not logged; no secrets are returned in JSON. |
| AG-09 No false facility mapping | Return a lot-1 snapshot alongside the static planner result. | UI labels occupancy as a separate unverified context and never claims the count belongs to Central Garage or the recommendation unless that relationship is verified by an approved data contract. |

| Check | Method / pass condition |
|---|---|
| Existing suite | Run `npm test`; all tests pass, recording exact output. Current test files cover campaign calendar, saved content, chat rules/server, pricing scenarios, and A/B experiments; add focused planner/orchestration tests after approval. This planning task does not run them. |
| Agent tests | Pass AG-01–AG-09 using Node's existing test runner and injected deterministic adapters; no live Supabase/OpenAI dependency for repeatable test cases. |
| Production build | Run `npm run build`; successful Next.js build and no new warnings/errors attributable to the change |
| `/demo` content/links | Validate every acceptance criterion W6-01–W6-13, verify all linked routes, submit valid/invalid forms, observe three statuses and handoff data, and test at desktop/mobile widths |
| Site route smoke | Visit `/`, `/parking`, `/research`, `/product`, `/pricing`, `/core`, `/dashboard`, `/assistant`, `/chat`, `/marketing`, `/docs`, and `/demo`; confirm expected page renders and no uncaught client errors |
| Existing interactions | Exercise parking empty/data/error states; research save/load; core validation, generate, save, and saved preview; chat supported/unsupported input, feedback and new chat; assistant configured/unconfigured response; marketing save/load/delete/export; pricing simulator; navigation |
| Data and privacy | Confirm simulated-data caveats remain visible, no new Supabase writes/migration, no browser exposure of service-role/OpenAI secrets, and no personally identifying participant data in evidence |
| Deployment smoke | On each of the two approved deployments, record `/demo` response, links, screenshots, source SHA, environment, and errors. Do not call a deployment verified from a URL alone. |

## 11. Evidence plan: commits, deployments, and prompts

These are collection targets for work **after approval**. The listed commit subjects are planning examples, not evidence that commits exist.

| Evidence | Planned record |
|---|---|
| Five meaningful commits | 1) shared pure planner extraction with unchanged `/core` behavior; 2) Parking Planner agent and explicit occupancy status; 3) Chat Guide, Venture Viability, and orchestrator data handoffs; 4) `/demo` execution UI, visual trace, and disclosures; 5) focused agent tests, regression, accessibility, and evidence/docs. Record each SHA/files/tests; keep commits logical and never manufacture empty commits. |
| Two Vercel deployments | Record two successful, distinct deployment IDs/URLs and environment/source SHA; suggested Preview and Production after review/approval. Include `/demo` and full-site smoke results. |
| Five actual coding prompts | Preserve five verbatim prompts used during implementation, tool/model and date, response summary, changed files, human decision, related commit SHA, and screenshot or transcript link. Capture actual prompts when used; do not backfill invented prompts. Suggested stages: page structure; accurate feature map; example/output and saved record links; evidence/impact/risk/roadmap; accessibility/regression review. |

## 12. Exact future Codex / Claude Code implementation prompt

Use only after the owner has approved all three planning documents and explicitly authorized implementation:

> Implement the approved Week 6 ParkNow multi-agent `/demo` flow only, following the three approved Week 6 planning documents. Before editing, inspect the current code and preserve unrelated work. Keep the existing navy/green style. Create a bounded server-side orchestrator and three separately testable deterministic agents: (1) Parking Planner reuses the existing `/core` calculation and reads the existing lot-1 `parking_spaces` snapshot without treating it as verified; (2) Chat Guide reuses `getChatReply` and consumes the planner result without writing chat history; (3) Venture Viability reuses `parseCustomers`/`calculateRevenue` and consumes both earlier results, labelling the revenue hypothetical. Extract shared `/core` calculation only as a behavior-preserving refactor with regression coverage. Validate input, return ordered per-agent status/output and explicit `consumedFrom` handoffs, and show that trace in `/demo`. If a parking snapshot is missing/error, report its exact status and keep the plan marked simulated; never turn missing data into zero availability or verified live data. On a required agent failure, report failure and block dependent agents rather than returning success-shaped defaults. Do not call OpenAI, add new packages, persist orchestration runs, change schema/policies, or add writes/reservations/payments. Keep saved recommendations, research, pricing scenarios, and chat behavior intact. Add deterministic tests for each agent and full orchestration proving execution, order, changed upstream data propagation, errors, invalid inputs, simulated disclosure, and no writes/model calls. Run `npm test`, `npm run build`, and the approved full-site regression; report exact results and changed files, then stop before commit, push, or deploy. Do not invent user results, deployment, commit, or prompt evidence. If actual rubric requirements differ or scope must expand, stop for approval.

## 13. Risks, limitations, and human checkpoint

| Risk / limitation | Mitigation or evidence needed |
|---|---|
| Supabase rows and Realtime refresh may be mistaken for sensor-verified availability | Label data provenance as unverified/simulated unless a real source, freshness contract, and operator validation are demonstrated |
| Existing pages use “live” language while project documentation describes simulated occupancy | Do not amplify those claims in `/demo`; flag wording for a separate, owner-approved correction if necessary |
| `/assistant` sends a database snapshot to a paid external model and its current instructions call it “live” | Do not use it as proof of an agentic system or real availability; verify key, model, cost, privacy, and data assumptions before a demo |
| No complete Week 6 external-user records, deployment records, or five-prompt log are supplied | Collect real evidence after approval; mark missing until completed |
| Historical user-test notes in `USER_TESTING.md` lack complete session fields | Reconfirm participant/session evidence; do not fill blanks from memory or count partial entries as complete |
| Public Supabase policies and browser-accessible data paths require security/privacy review | Review RLS and test with least privilege; no policy/schema change in this scope |
| The proposed agents are deterministic bounded workers, not LLM-based autonomous agents | Verify that this meets the official rubric; if it requires generative/autonomous agents, obtain a separate explicit decision on cost, privacy, safety, and testing before implementation |
| Public orchestration endpoint could be spammed and trigger repeated Supabase reads | Enforce request/body/input limits, make one read per run, use no model calls/writes, and verify platform-level abuse protection before public rollout; no protection configuration is assumed |
| A small prototype cannot substantiate revenue, time, traffic, or emissions impact | Present business model/pricing as illustrative and impact as hypotheses; define later measurement methods |
| Free tiers, service terms, quotas, and availability can change; OpenAI may cost money | Verify current account plan and projected usage before any deployment or AI-backed test |

**Human approval checkpoint:** The project owner approved the planning documents and deterministic agent scope in chat on 2026-11-18 and explicitly authorized implementation on `week6-implementation`. Preview deployments are allowed. Merging to `main` and production deployments remain approval-gated. Any change to LLM use, data writes, schema/policies, sensor integrations, or other excluded scope needs a separate approval.

## 14. Review against the Week 6 assignment brief

| Assignment requirement | Covered in |
|---|---|
| Problem, users, success, scope, measurable specification, UX, scope cuts | §§2–6 and UX mockup |
| Actual architecture/data flow and existing versus proposed functionality | §7 and architecture document |
| Free-stack table; GitHub, Vercel, Supabase, environment plan | §§8–9 |
| Five external users and full-site regression | §10 |
| Exact Codex/Claude Code prompt | §12 |
| Five-commit, two-deployment, five-prompt evidence | §11 |
| Risks, limitations, and human approval gate | §13 |
| Integrated agentic venture | The repository has no existing multi-agent orchestration. This revision proposes a working, testable deterministic three-agent workflow with explicit data handoffs; confirm whether the official rubric accepts this bounded non-LLM approach. |
| Agent responsibilities, inputs, outputs, and coordination | §4 agent contracts and [architecture sequence](./WEEK6_ARCHITECTURE.md#6-proposed-demo-orchestration-architecture-and-flow) |
| Visual `/demo` UX flow | [UX flow and wireframe](./WEEK6_UX_MOCKUP.md#3-visual-ux-flow) |
| Measurable acceptance per agent and tests proving execution/data exchange | §§4 and 10; AG-01–AG-09 exercise actual agent functions and coordinator handoffs |
| Practical `/demo` UX including walkthrough, feature links, agent map, example, saved records, evidence, impact/risk, V2, branding | UX mockup |
| Review and missing evidence | This section and §13 |

**Remaining evidence and scope gaps before a complete Week 6 submission:** confirmation that deterministic agents meet the official rubric's meaning of “agentic”; five complete external-user records; post-change agent/unit/integration tests and build output; full route and interaction regression evidence; screenshots; five actual prompt records; five authentic implementation commit SHAs; two successful deployment records; and a separate official rubric/link if one exists for final compliance cross-check. Do not mark any evidence complete without its artifact.
