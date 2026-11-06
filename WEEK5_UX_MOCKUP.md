# ParkNow — Week 5 UX Mockup

## Public Chatbot — /chat

**Student:** Adriano García Llanos
**Status:** Approved UX concept before coding. The approved requirements below remain unchanged; current implementation and evidence status is recorded separately.

## Screen 1: Welcome
- ParkNow logo and Assistant header.
- Welcome message explaining the chatbot.
- Three quick options: Driver, Parking Lot Owner, Other Question.
- Start Chat button.

## Screen 2: Guided Intake
- Question 1: What type of user are you?
- Question 2: What do you need help with?
- Question 3: What area or specific issue do you have?
- Quick-reply chips and chat bubbles.

## Screen 3: Guided Answer
- Relevant answer based on the user's selections.
- Safety message: parking availability is not guaranteed without verified live data.
- Human-help option.

## Screen 4: Feedback
- Thumbs up and thumbs down buttons.
- Session summary and feedback saved in Supabase.
- Clear confirmation only after a successful save.

## UX Principles
- Responsive mobile and desktop design.
- Accessible labels and keyboard-friendly controls.
- ParkNow navy and green visual identity.
- No invented availability or unsupported claims.

## Human Checkpoint
Approved: rule-based guided assistant, three initial questions,
feedback, Supabase persistence, and human-help option.

## Implementation Status (2026-11-06)

The shipped `/chat` page is a free-form question-and-answer interface with three optional starter-question buttons, a New chat control, deterministic responses, availability caveats, feedback controls, and server-side persistence. The three buttons are suggestions, not the approved three-question guided intake.

The approved human-help scope is not fully verified: unsupported answers show a contact link, but its current `support@parknow.example` address is a placeholder. No external user test or mobile viewport test is documented. Do not treat the mockup or approval as evidence that those requirements are complete.

Persistence uses `chat_conversations`, `chat_messages`, and `chat_feedback` in Supabase, accessed through `/api/chat/messages` and `/api/chat/feedback`. The project owner reports that production `/chat` answered parking and pricing questions, New chat created a second conversation, Supabase showed two conversations and four messages, and feedback saved successfully. These are reported manual observations, not attached screenshots or independently replayed tests.

Production: [ParkNow /chat](https://park-now-seven.vercel.app/chat)

Implementation PR: [GitHub PR #7](https://github.com/Adriano1305gll/ParkNow/pull/7)

Acceptance audit: [WEEK5_BUILD_DISCIPLINE_PACKET.md](./WEEK5_BUILD_DISCIPLINE_PACKET.md)

**Note:** This document retains the approved UX concept and is not a claim that every screen or interaction in that concept has shipped.

## Visual UX Mockup

![ParkNow Week 5 Chat UX Mockup](evidence/week5/week5-chat-ux-mockup.png)