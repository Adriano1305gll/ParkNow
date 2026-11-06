# ParkNow — Week 5 Submission

**Reviewed:** 2026-11-06  
**Route:** `/chat`  
**Implementation:** [GitHub PR #7](https://github.com/Adriano1305gll/ParkNow/pull/7) — merged into `main`  
**Production:** [ParkNow chat](https://park-now-seven.vercel.app/chat)

## Submission links

- [Production `/chat`](https://park-now-seven.vercel.app/chat)
- [GitHub PR #7](https://github.com/Adriano1305gll/ParkNow/pull/7)
- [Week 5 acceptance criteria and evidence checklist](./WEEK5_BUILD_DISCIPLINE_PACKET.md#7-testable-acceptance-criteria)
- [Approved UX mockup and current implementation status](./WEEK5_UX_MOCKUP.md)
- [Chat rules tests](./tests/chatRules.test.mjs)
- [Chat server validation tests](./tests/chatServer.test.mjs)
- [Supabase chat schema migration](./supabase/migrations/20261104000000_chat_persistence.sql)

## Evidence checklist

- **Production endpoint availability:** PASS — `https://park-now-seven.vercel.app/chat` returned HTTP 200 when checked on 2026-11-06.
- **Production question handling:** manual evidence reported by the project owner — `/chat` responded to parking and pricing questions.
- **New chat:** manual evidence reported — using New chat created a second conversation.
- **Supabase persistence:** manual evidence reported — Supabase showed two `chat_conversations` rows and four `chat_messages` rows.
- **Feedback persistence:** manual evidence reported — feedback was saved successfully. The schema links feedback to a message and conversation.
- **Automated tests:** verified below.
- **Approved UX:** [WEEK5_UX_MOCKUP.md](./WEEK5_UX_MOCKUP.md) records the approved scope separately from implementation evidence.

The production interactions and database observations in this checklist are the project owner's reported manual evidence. They were not independently replayed for this documentation update; no screenshots, query exports, or external-user records were supplied.

## Testing results

| Check | Result | Evidence / limitation |
|---|---|---|
| `npm test` | **PASS** — 21 passed, 0 failed | Node test runner; includes chat rules, feedback validation, and other project tests. |
| Production `/chat` response | **PASS** — HTTP 200 | Endpoint status checked on 2026-11-06; this does not verify mobile layout or every chat behavior. |
| Parking and pricing questions | **Reported PASS** | Project-owner manual observation; no attached recording. |
| New chat and database counts | **Reported PASS** | Two conversations and four messages reported in Supabase after creating a second chat. |
| Feedback save | **Reported PASS** | Successful save reported; no attached database export. |
| Formal mobile/desktop viewport test | **PENDING** | Responsiveness is not confirmed by the evidence available. |
| External user tests | **PENDING** | No three-user test records or observations are documented. |
| Broader security assessment | **PENDING** | Source inspection supports the AC08 code claim; no separate security check is claimed. |

## Acceptance criteria

The complete AC01–AC09 audit, with PASS/PARTIAL/PENDING statuses and evidence, is in [WEEK5_BUILD_DISCIPLINE_PACKET.md](./WEEK5_BUILD_DISCIPLINE_PACKET.md#7-testable-acceptance-criteria). In summary: AC04, AC06, AC07, and AC08 are PASS on the evidence described there; AC01, AC03, AC05, and AC09 are PARTIAL; AC02 is PENDING.

## Outstanding tasks

- Implement the approved three-question guided intake (AC02).
- Verify driver and owner flows with recorded production scenarios (AC03).
- Replace the placeholder human-help destination and verify the option without implying a message was sent (AC05).
- Record desktop and mobile viewport results (AC01).
- Document three distinct software test scenarios and three external user tests (AC09).
- Complete and preserve the required coding prompt log, iteration log, and personal decision note.
- Verify the original target of at least five authentic implementation commits and two Vercel deployments.
- Record Supabase policy/security review evidence and attach reproducible persistence evidence.
- Create the required 2–3-minute demo video.

## Honest limitations

The approved scope remains the original specification in the build packet. The current UI provides optional starter questions and free-form chat, not a guided three-question intake. No external user testing, mobile responsiveness testing, complete prompt log, security assessment, or demo video is claimed as complete. The unsupported-answer contact link currently targets `support@parknow.example`, which is a placeholder. The manual production and Supabase evidence above is reported by the project owner rather than independently reproduced or supported by attached screenshots.


## Personal Decision Note — Week 5

For Week 5, I decided to build a guided, rule-based chat assistant for ParkNow instead of using a fully generative AI chatbot. My main reason was to make the answers more reliable, easier to test, and more useful for drivers.

The assistant helps users understand how to find parking, check the available information, and learn about pricing. I also wanted the application to be transparent, so it clearly explains that parking occupancy is simulated and not verified in real time.

One important improvement was connecting the chat to Supabase. This allows conversations, messages, and user feedback to be stored. During testing, I confirmed that the application could save this information correctly.

The biggest trade-off was flexibility. A rule-based assistant cannot answer every possible question like a generative AI model, but it provides more predictable responses and reduces the risk of giving incorrect parking information.

If I continued developing ParkNow, I would improve the assistant's understanding of different questions, test it with real drivers and parking lot owners, and eventually connect it to verified parking availability data.

Overall, this week taught me that building a useful AI product is not just about adding advanced technology. It is about choosing the right solution, testing it, and making sure users can trust the information they receive.