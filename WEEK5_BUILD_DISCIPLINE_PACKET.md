# ParkNow — Week 5 Build Discipline Packet

**Student:** Adriano García Llanos  
**Project:** ParkNow — Public Chatbot / Guided Assistant  
**Route:** /chat  
**Status (2026-11-06):** Implementation merged in [GitHub PR #7](https://github.com/Adriano1305gll/ParkNow/pull/7). This packet retains the approved scope and records verified evidence and outstanding gaps; see [WEEK5_SUBMISSION.md](./WEEK5_SUBMISSION.md).

## 1. Problem
Drivers need clear guidance about finding parking and using ParkNow. Parking lot owners need help understanding registration and management options.

## 2. Target Users
- Drivers using ParkNow for free.
- Parking lot owners and administrators using paid plans.

## 3. Goal
Build a public, responsive, rule-based chatbot that guides users, answers common questions, provides safety boundaries, and stores sessions and feedback.

## 4. Approved Scope
- Public /chat page.
- Three guided intake questions.
- Quick-reply buttons and conversational messages.
- Different responses for drivers and owners.
- Safety guardrails: never invent live parking availability.
- Human-help option.
- Session and feedback persistence in Supabase.
- Thumbs-up and thumbs-down feedback.

### Out of Scope
- Paid AI APIs.
- Real-time parking inventory integration.
- WhatsApp integration.
- Automated human support.
- Claims of verified parking availability without a reliable source.

## 5. UX Mockup
The proposed interface includes a ParkNow Assistant header, message bubbles, three initial questions, quick-reply chips, a text input, feedback buttons, and a human-help option.

Flow:
Start → User type → Goal → Location or need → Guided response → Feedback → Save session.

UX approval: Rule-based guided assistant approved by student before implementation.

## 6. Product Specification
The application uses deterministic rules to classify user intent and return appropriate guidance. It must communicate limitations clearly and avoid misleading users.

## 7. Testable Acceptance Criteria
- AC01: GET /chat loads successfully on desktop and mobile. **PARTIAL** — production `/chat` returned HTTP 200 on 2026-11-06 and the project owner reports using it, but desktop/mobile viewport checks are not documented.
- AC02: Users can complete exactly three guided intake questions. **PENDING** — the current UI offers three optional starter-question buttons and free-form chat, not a three-question guided intake.
- AC03: Driver and owner flows return different, relevant guidance. **PARTIAL** — deterministic driver-cost and owner rules exist; reported production checks cover parking and pricing questions, but no driver-versus-owner scenario results are documented.
- AC04: Unverified real-time availability requests receive a clear limitation message. **PASS** — the availability rule warns that live availability cannot be confirmed; automated test coverage verifies the limitation response.
- AC05: Users can access a human-help option without a false claim that support was contacted. **PARTIAL** — unsupported questions display a contact link and state the assistant does not send the message; its `support@parknow.example` destination is a placeholder, and an end-to-end human-help test is not documented.
- AC06: Completed sessions are saved to Supabase and can be verified in the database. **PASS** — the project owner reports that after using New chat, Supabase showed two `chat_conversations` rows and four `chat_messages` rows.
- AC07: Thumbs-up/down feedback is stored and linked to a session. **PASS** — the project owner reports successful feedback save; the schema links each `chat_feedback` row to a message and conversation.
- AC08: No Supabase service-role secret is exposed in browser code. **PASS (source inspection)** — service-role access is in server-only `lib/chatServer.mjs` and is used by API route handlers. This is not a broader security assessment.
- AC09: Three software tests and three external user tests are documented with observed results. **PARTIAL** — `npm test` passed 21 automated tests; three separate software-test reports and three external-user test records are not documented.

Status meanings: **PASS** = evidence meets the criterion; **PARTIAL** = some implementation or evidence exists but the full criterion is not verified; **PENDING** = not implemented or no supporting evidence. The manual interaction and Supabase observations above are reported by the project owner; the production HTTP status and automated test run were checked for this documentation update.

## 8. Architecture Diagram

```text
User Browser
    |
    v
Next.js /chat (React + Tailwind)
    |
    v
Next.js API Route Handlers
    |-- POST /api/chat/messages (validation + deterministic rules)
    |-- POST /api/chat/feedback (feedback validation)
    |
    v
Supabase PostgreSQL
    |-- chat_conversations
    |-- chat_messages
    |-- chat_feedback
```

The browser sends chat requests to the server routes. A random browser owner token is kept in an HTTP-only cookie; Supabase stores only its SHA-256 hash in `chat_conversations.owner_hash`. Server routes use the service-role key. Feedback is linked to an assistant message and its conversation. No `chat_sessions` table is used by this implementation.

## 9. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js + React | Chat interface |
| Styling | Tailwind CSS | Chat interface styling |
| Backend | Next.js Route Handlers | Validation and chat rules |
| Database | Supabase PostgreSQL | Conversations, messages, and feedback |
| Development | GitHub Codespaces + Copilot | Coding and prompt evidence |
| Version Control | GitHub | Commits and pull requests |
| Deployment | Vercel | Preview and production |

## 10. Development Plan
1. Commit the approved planning packet before implementation.
2. Build the /chat UI. **Implemented**; responsive behavior has not been tested/documented.
3. Implement the three-question intake and deterministic responses. **PARTIAL**; deterministic answers exist, but the approved guided intake is not implemented.
4. Add safety guardrails and human-help functionality. **PARTIAL**; the availability guardrail exists; the human contact destination remains a placeholder.
5. Integrate Supabase session and feedback persistence. **Implemented** using conversations, messages, and feedback tables; see AC06–AC07.
6. Add tests, documentation, and deployment evidence. **PARTIAL**; automated tests and production/manual evidence are recorded, but external testing, prompt log, and demo video remain outstanding.

The original target of at least five authentic implementation commits and two documented Vercel deployments remains in force. Completion of those evidence requirements has not been verified here.

## 11. Testing Plan
Software test 1: Complete the three-question guided flow. **Not completed**; the flow is not implemented.
Software test 2: Verify that unsupported live-availability questions trigger guardrails. **Automated rule test passed**; no separate manual report is documented.
Software test 3: Verify session and feedback records in Supabase. **Manual evidence reported**: two conversations, four messages, and feedback saved; no screenshot or exported query result is included.

External user tests 1–3 (driver scenario, owner scenario, unsupported question/human help): **PENDING**. No external-user observations are documented.

Record dates, observations, issues, changes, and retest results if these tests are performed. Do not infer completion from automated unit tests or project-owner checks.

## 12. Coding Prompt Log
Requirement: record at least five real Copilot prompts, including exact prompt text, response, files changed, screenshots, and related commit SHA. **PENDING** — no complete Week 5 prompt log has been verified; the requirement is not evidence of execution.

## 13. Human Decision Checkpoint
Approved decision: Use a free, rule-based assistant instead of a paid generative AI API.

Reason: predictable answers, lower cost, easier testing, and reduced risk of invented parking availability.

Rejected approach: Depend on an external paid LLM for the core chatbot.

Accepted trade-off: More limited conversational flexibility in exchange for reliability and control.

A final 150–250-word personal decision note will be completed after actual development and testing.

## 14. Evidence and Demo Requirements
- Week 5 UX mockup and approved product specification: **available** in [WEEK5_UX_MOCKUP.md](./WEEK5_UX_MOCKUP.md) and this packet; the mockup remains a specification, not proof of shipped UX.
- Architecture diagram and stack table: **documented** above.
- At least five genuine commits: **not verified** for the requirement.
- At least two real Vercel deployments: **not verified**; the production `/chat` URL is live.
- At least five actual coding prompts: **PENDING**; no complete prompt log is verified.
- Three software tests: **PARTIAL**; `npm test` passed 21 tests, but the three specified test reports are not separately documented. Three external user tests: **PENDING**.
- Supabase tables, policies, and stored data: schema/migration is documented in source; project-owner-reported data counts are recorded under AC06. No policy/security audit or database export is attached.
- Iteration log and final personal decision note: **not verified**.
- A 2–3-minute demo video: **PENDING**; no video is documented.

See [WEEK5_SUBMISSION.md](./WEEK5_SUBMISSION.md) for the consolidated checklist, links, test results, and limitations.