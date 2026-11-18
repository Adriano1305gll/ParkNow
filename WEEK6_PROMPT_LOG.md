# ParkNow — Week 6 Prompt and Decision Log

**Branch:** `week6-implementation`  
**Scope:** Approved deterministic Parking Planner → Chat Guide → Venture Viability workflow.  
**Evidence rule:** This log records actual user authorization and decisions only. Tool calls, internal task decomposition, and the reference prompt in the Build Discipline Packet are not counted as separate user coding prompts.

## Actual coding prompt received

**Prompt 1 of 5 evidence target**

- **Source/date:** Copilot conversation `2683f2a4-972a-41c8-b5e0-b2d7376a79dc`, user turn 4, 2026-11-18 18:51:54.812 UTC; user message titled “ParkNow — Week 6 Implementation Authorization.”
- **Verbatim excerpts retained from the authorization:**

  > “I approve the Week 6 Build Discipline Packet, UX Mockup, Architecture, and deterministic multi-agent scope.”

  > “You are now authorized to implement Week 6.”

  > “Implement the approved scope using the existing Next.js, React, Tailwind, and Supabase architecture.”

- **Requested scope:** Implement `/demo`; execute real deterministic Parking, Chat, and Venture Viability agents with structured handoffs; reuse current features; disclose simulated occupancy; add agent/orchestration/invalid-input tests; run full tests, build, lint check, and regression; create submission and prompt evidence; remain on `week6-implementation`; allow Preview only; do not merge to `main` or deploy to Production.
- **Response / outcome:** Implemented the shared planner, orchestration API, three agent functions, `/demo` UI, focused tests, and evidence documentation. `npm test` passed 49 tests and `npm run build` succeeded. Local route and orchestration smoke tests passed. Two hosted Preview deployments completed, but both routes are SSO-protected; external-user evidence remains pending.
- **Human decision:** Approval and branch/deployment boundaries are explicitly recorded in the user message and the three planning documents.
- **Related implementation commits:** `8d0c186`, `acd6bc8`, `e106902`, `60c3c8f`, `69d647a`, included in merged [PR #10](https://github.com/Adriano1305gll/ParkNow/pull/10) (merge commit `04405396e22dba9ddf5c0b323dab0a438169f40e`).
- **Tool/model/date:** Copilot SDK in VS Code environment; exact model identifier was not exposed in the retained prompt record. No model is inferred.
- **Transcript evidence:** The available Copilot conversation record is the source. Its final report checklist is truncated; the excerpts above are retained verbatim, and missing text is not reconstructed. No separate screenshot or export was created.

The available conversation record also contains review/planning requests (turns 0–3), a PR review request (turn 5), and a documentation update request (turn 6). None is a separate application coding prompt, so none is counted.

## Prompt evidence shortfall

The planned five-prompt evidence target is **not met**: only one user coding authorization prompt is documented in the available Copilot conversation record. No separate user coding prompts for page structure, feature map, output/evidence content, or accessibility review are documented. Those work areas were delivered from the single approved scope and must not be relabelled as separate prompts.

| Prompt slot | Status |
|---|---|
| 1 — Implementation authorization and approved scope | Recorded above |
| 2 | **NOT DOCUMENTED** — no separate coding prompt appears in the available conversation record |
| 3 | **NOT DOCUMENTED** — no separate coding prompt appears in the available conversation record |
| 4 | **NOT DOCUMENTED** — no separate coding prompt appears in the available conversation record |
| 5 | **NOT DOCUMENTED** — no separate coding prompt appears in the available conversation record |

The exact Codex/Claude Code prompt included in `WEEK6_BUILD_DISCIPLINE_PACKET.md` is a planning artifact. It is not an additional user message and does not increase the actual prompt count.

## Human decisions and implementation boundaries

| Decision | Source | Applied behavior |
|---|---|---|
| Deterministic three-agent flow is approved | Owner approval of planning documents and implementation authorization | Fixed sequential execution; no OpenAI call or autonomous loop |
| `/demo` is the required live page | Week 6 brief and authorization | New walkthrough and actual execution trace on `/demo` |
| Reuse existing ParkNow behavior | Authorization and approved architecture | Shared `/core` planner, `getChatReply`, `parseCustomers`, and `calculateRevenue` |
| Occupancy is not verified real-time | Approved planning docs and authorization | Snapshot is separate, always labelled `SIMULATED / UNVERIFIED`, with no facility mapping |
| No write/persistence/schema expansion | Approved planning scope | Read-only occupancy query; no saved orchestration runs, migrations, or chat persistence call |
| Work on feature branch; Preview allowed | Explicit implementation authorization | Commits and branch push stay on `week6-implementation`; no merge or Production deployment |
| Five actual prompts are an evidence target | Build Discipline Packet | One prompt documented; four slots remain **NOT DOCUMENTED** |

## Implementation record

| Commit | Decision/work |
|---|---|
| `8d0c186` | Extract planner to a reusable pure module while retaining the existing `/core` sample behavior. |
| `acd6bc8` | Add request validation, read-only occupancy states, three agents, ordered handoffs, and route tests. |
| `e106902` | Implement the guided `/demo` UX, actual execution trace, links, caveat, impact/risk, and V2 sections. |
| `60c3c8f` | Add explicit unsupported-chat and upstream/midstream/final agent failure tests. |
| `69d647a` | Ensure Supabase query errors stay explicit and never become empty/zero occupancy. |

See [WEEK6_SUBMISSION.md](./WEEK6_SUBMISSION.md) for test results, deployment status, participant plan, and remaining evidence gaps.
