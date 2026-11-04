# ParkNow — Week 5 Build Discipline Packet

**Student:** Adriano García Llanos  
**Project:** ParkNow — Public Chatbot / Guided Assistant  
**Route:** /chat  
**Status:** Planning approved; implementation pending.

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
- AC01: GET /chat loads successfully on desktop and mobile.
- AC02: Users can complete exactly three guided intake questions.
- AC03: Driver and owner flows return different, relevant guidance.
- AC04: Unverified real-time availability requests receive a clear limitation message.
- AC05: Users can access a human-help option without a false claim that support was contacted.
- AC06: Completed sessions are saved to Supabase and can be verified in the database.
- AC07: Thumbs-up/down feedback is stored and linked to a session.
- AC08: No Supabase service-role secret is exposed in browser code.
- AC09: Three software tests and three external user tests are documented with observed results.

## 8. Architecture Diagram

```text
User Browser
    |
    v
Next.js /chat (React + Tailwind)
    |
    v
Next.js API /api/chat (validation + rule-based responses)
    |
    v
Supabase PostgreSQL
    |-- chat_sessions
    |-- chat_feedback
```

## 9. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js + React | Chat interface |
| Styling | Tailwind CSS | Responsive UI |
| Backend | Next.js Route Handlers | Validation and chat rules |
| Database | Supabase PostgreSQL | Sessions and feedback |
| Development | GitHub Codespaces + Copilot | Coding and prompt evidence |
| Version Control | GitHub | Commits and pull requests |
| Deployment | Vercel | Preview and production |

## 10. Development Plan
1. Commit the approved planning packet before implementation.
2. Build the responsive /chat UI.
3. Implement the three-question intake and deterministic responses.
4. Add safety guardrails and human-help functionality.
5. Integrate Supabase session and feedback persistence.
6. Add tests, documentation, and deployment evidence.

Target: at least five authentic implementation commits and two documented Vercel deployments.

## 11. Testing Plan
Software test 1: Complete the three-question guided flow.
Software test 2: Verify that unsupported live-availability questions trigger guardrails.
Software test 3: Verify session and feedback records in Supabase.

External user test 1: Driver completes a parking-help scenario.
External user test 2: Owner completes a registration-help scenario.
External user test 3: User asks an unsupported question and tries human help.

Record dates, observations, issues, changes, and retest results. Do not invent outcomes.

## 12. Coding Prompt Log
Record at least five real Copilot prompts, including the exact prompt text, response, files changed, screenshots, and related commit SHA. This section is a requirement, not proof of execution.

## 13. Human Decision Checkpoint
Approved decision: Use a free, rule-based assistant instead of a paid generative AI API.

Reason: predictable answers, lower cost, easier testing, and reduced risk of invented parking availability.

Rejected approach: Depend on an external paid LLM for the core chatbot.

Accepted trade-off: More limited conversational flexibility in exchange for reliability and control.

A final 150–250-word personal decision note will be completed after actual development and testing.

## 14. Evidence and Demo Requirements
- Week 5 UX mockup and approved product specification.
- Architecture diagram and stack table.
- At least five genuine commits.
- At least two real Vercel deployments.
- At least five actual coding prompts.
- Three software tests and three external user tests.
- Supabase tables, policies, and stored data evidence.
- Iteration log and final personal decision note.
- A 2–3-minute demo video showing the application and development evidence.

**Evidence status:** All implementation, testing, deployment, and video evidence is pending until verified.