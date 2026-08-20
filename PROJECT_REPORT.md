# Park Now — Final Capstone Project

## Executive Summary
Park Now is a web-based parking availability platform designed to reduce the uncertainty and time involved in finding a parking space. The application presents a visual map of a selected parking facility and marks each individual parking space as available or occupied. Occupancy information is designed to update in real time through parking sensors or an existing parking-management data source. For the capstone prototype, real-time changes are simulated and clearly labeled as such.

The product is intended primarily for drivers using structured parking environments such as schools, offices, shopping centers, hospitals, airports, and event venues. A secondary customer is the parking operator, who can use the dashboard to monitor occupancy and understand utilization patterns.

## 1. Problem Definition
Drivers frequently enter parking facilities without knowing whether spaces are available or where those spaces are located. This creates unnecessary searching, internal congestion, wasted time, and frustration. Existing signs may only show total capacity, while many facilities provide no live availability information at all.

Park Now solves this by converting parking occupancy data into a simple visual map that a user can understand quickly.

### Problem Statement
How might we help drivers identify available parking spaces before or immediately after entering a parking facility, using a simple and reliable real-time visual interface?

## 2. User Definition
### Primary User
Drivers who need to park in a large or unfamiliar parking facility.

### Secondary User / Buyer
Parking facility operators, schools, office campuses, shopping centers, hospitals, airports, hotels, and event venues.

### Core User Need
“I want to know where an open parking space is without driving around and guessing.”

## 3. Value Proposition
Park Now helps drivers find parking faster by showing exactly which spaces are currently available on a live visual map. For operators, it creates a digital occupancy layer that can improve traffic flow, user experience, and utilization visibility.

## 4. Product Specification
### MVP Features
1. Parking-location selection.
2. Visual parking-lot map.
3. Space-level Available / Occupied status.
4. Live or simulated-live occupancy updates.
5. Available, occupied, and occupancy-percentage totals.
6. Operator dashboard.
7. Parking Assistant for simple availability questions.
8. Documentation page explaining system design and safety limitations.

### Acceptance Criteria
- The user can open the app and reach the Live Parking page.
- The user can distinguish available and occupied spaces without explanation.
- Space counts match the visible parking-space states.
- A status update changes both the map and summary totals.
- The system clearly identifies simulated data when no real sensor feed is connected.
- The assistant never guarantees that a parking space will remain available.
- The product works on desktop and mobile screen sizes.

## 5. UX Concept
The interface uses a dark, clean visual system. Available spaces are represented in green and occupied spaces in red. Each parking space is numbered so users can connect the digital map to physical signage. The most important information—availability count, occupancy count, and lot name—appears above the map.

The design principle is “understand in under ten seconds.” The interface should not require the user to interpret complex charts before making a parking decision.

## 6. Architecture Sketch
Data Source / Parking Sensors
→ Supabase database
→ Next.js server/client data layer
→ Live Parking Map
→ Operator Dashboard
→ Parking Assistant context

### Prototype Mode
Simulated occupancy generator
→ React state / Supabase demo records
→ UI updates

### Production Mode
Approved physical occupancy sensor or existing parking-management API
→ authenticated backend ingestion
→ Supabase
→ real-time subscription
→ UI

## 7. Data Model
### ParkingLot
- id
- name
- address/description
- total_spaces
- active

### ParkingSpace
- id
- parking_lot_id
- label
- section
- status
- last_updated

### OccupancyEvent
- id
- parking_space_id
- previous_status
- new_status
- timestamp

### UserTest
- id
- participant_alias
- task
- result
- feedback
- iteration_action

### AssistantLog
- id
- question
- response_type
- timestamp

## 8. Tech Stack
### Frontend
Next.js and React because they support a modern responsive web application and integrate directly with Vercel.

### Styling
Tailwind CSS for rapid, consistent interface development.

### Database
Supabase Free for parking data, test evidence, logs, and real-time subscriptions.

### Hosting
Vercel Hobby for free deployment.

### Version Control
GitHub for source control and documented iterative commits.

### Coding Agent
Codex or Claude Code for implementation, debugging, refactoring, and test support.

## 9. DevOps Plan
1. Create GitHub repository `park-now-capstone`.
2. Push the initial Next.js scaffold.
3. Create Supabase project and database schema.
4. Store Supabase environment variables in `.env.local` and Vercel environment settings.
5. Deploy first functional version to Vercel.
6. Add dashboard and assistant workflow in separate commits.
7. Run user tests and make an iteration commit.
8. Deploy the improved final version.

### Minimum Commit Plan
1. `chore: initialize Park Now Next.js project`
2. `feat: add responsive navigation and landing page`
3. `feat: build live parking map and occupancy states`
4. `feat: add operator dashboard and demo data`
5. `feat: add parking assistant and safety guardrails`
6. `test: improve interface from user testing feedback`
7. `docs: add architecture, testing, and final demo documentation`

## 10. Test Plan
### Functional Test 1 — Space Status
Input: Open Live Parking.
Expected: Each space is visibly marked available or occupied.

### Functional Test 2 — Update
Input: Trigger a simulated live update.
Expected: At least some space states and summary counts update consistently.

### Functional Test 3 — Assistant Guardrail
Input: “Can you guarantee space 12 will still be free when I arrive?”
Expected: The assistant explains that availability can change and does not guarantee the space.

### Usability Tests
Conduct testing with at least five people. Ask each participant to:
1. Find how many spaces are currently available.
2. Identify one available parking space.
3. Explain what the colors mean.
4. Trigger or observe an update.
5. Explain what they think the product does and whether they would use it.

Measure task completion, confusion points, and feedback.

## 11. Agentic Workflow and Prompt Logic
### Workflow A — Product Builder
Human defines the problem and acceptance criteria → coding agent implements one small feature → human tests it → agent fixes specific failures → human approves or rejects the change.

### Workflow B — Parking Assistant
User question → classify whether it is about availability, product information, or unsupported action → retrieve current demo occupancy context → generate a concise answer → apply guardrails → display answer.

### Guardrails
- Never claim simulated data is live sensor data.
- Never guarantee that a space will remain available.
- Never provide unsafe instructions that encourage interacting with the app while actively driving.
- Never collect or expose license plates or personal vehicle identity in the MVP.
- Show when parking data was last updated.

## 12. Coding Agent Implementation Prompt
ROLE: You are a disciplined senior full-stack engineer building a school capstone called Park Now.

GOAL: Build a responsive Next.js + React + Tailwind web application that shows parking-space availability on a visual parking-lot map.

CONSTRAINTS:
- Use free tools only.
- Deploy on Vercel.
- Use Supabase when persistent data is required.
- Do not use paid APIs.
- If occupancy is simulated, label it clearly.
- Build features incrementally and keep code readable.
- Do not add unnecessary libraries.

REQUIRED PAGES:
1. Home
2. Live Parking
3. Research
4. Product
5. Pricing
6. Marketing
7. Assistant
8. Dashboard
9. Documentation
10. Demo

CORE FEATURE REQUIREMENTS:
- Display a parking lot as a grid/map of numbered spaces.
- Every space has an available or occupied status.
- Available and occupied spaces must be visually distinct and also identifiable with labels, not color alone.
- Show total, available, occupied, and occupancy percentage.
- Provide a safe simulated update mode for the prototype.
- Architecture must make it easy to replace simulation with Supabase real-time data.
- Add a simple assistant workflow that can answer questions about current demo availability.
- The assistant must never guarantee future availability.
- Add a dashboard with parking utilization metrics.
- Make the UI responsive.
- Add empty/loading/error states where relevant.

ACCEPTANCE CRITERIA:
- `npm run build` succeeds.
- Navigation reaches all required pages.
- Live Parking correctly updates counts when statuses change.
- Mobile layout remains readable.
- Simulated occupancy is clearly labeled.
- No secrets are committed to GitHub.
- Assistant guardrail responses work for guarantee requests.

Before modifying code, explain which files you plan to change. After each feature, provide a test checklist and wait for human approval before expanding scope.

## 13. Scope Cuts
Not included in the first capstone version:
- Payment processing.
- Parking-space reservations.
- License-plate recognition.
- Camera-based computer vision.
- Turn-by-turn navigation.
- City-wide parking coverage.
- Native iOS/Android applications.
- Hardware sensor installation.

These features increase cost, technical risk, privacy concerns, or project scope without being necessary to prove the core value proposition.

## 14. Product and Revenue Logic
### User
Driver.

### Buyer
Parking facility operator.

### Value Created
Less searching and uncertainty for drivers; clearer occupancy visibility for operators.

### Business Model
Drivers use the app for free. Operators pay a recurring software fee based on number of locations or parking spaces monitored. Pricing in the prototype is illustrative only.

## 15. Practical Impact and Risks
### Positive Impact
- Reduces unnecessary circulation inside parking facilities.
- Reduces time spent searching for parking.
- Improves the parking experience.
- Gives operators occupancy visibility.

### Risks
- Incorrect or stale occupancy information.
- Driver distraction.
- Overpromising accuracy.
- Privacy risk if future versions collect vehicle-identifying data.

### Mitigations
- Display last-updated time.
- Use a stale-data warning when updates stop.
- Avoid guaranteed availability language.
- Design for pre-arrival or stopped-vehicle use.
- Avoid personal vehicle identification in the MVP.

## 16. Five-Minute Demo Script Outline
### 0:00–0:45 — Problem
Explain the uncertainty drivers experience in busy parking facilities.

### 0:45–2:00 — Core Product
Open the Live Parking page, identify open spaces, and explain the status map.

### 2:00–2:45 — Real-Time Simulation
Trigger an update and show the map and totals changing together.

### 2:45–3:30 — Dashboard and AI Workflow
Show operator metrics and ask the Parking Assistant a question.

### 3:30–4:15 — Testing and Iteration
Present feedback from five users and explain at least two changes made because of testing.

### 4:15–5:00 — Value, Risk, and Future
Explain the buyer, potential revenue model, safety guardrails, and how real sensors could replace simulated data later.

## 17. Human Decision Note — Draft
As the human builder, I chose to keep Park Now focused on one clear problem: helping a driver understand parking availability quickly. AI suggested several larger features, including reservations, navigation, camera recognition, and payment systems. I rejected those ideas for the MVP because they would add technical complexity without proving the main value of the product. I also decided that the capstone must clearly label simulated occupancy data instead of presenting it as real sensor data. This makes the demonstration more honest and easier to defend. I accepted AI support for structuring the interface, architecture, test plan, and coding prompts, but I kept the final decisions about product scope and safety. One important tradeoff was using a simple parking-space grid rather than a geographically accurate garage map. The grid is less realistic, but it is easier to understand, test, and build within the course timeline. If the prototype performs well in user testing, the next major improvement would be connecting the same interface to a real sensor or parking-management data source.

## 18. User Testing Evidence Template
| Test User | Task Result | Confusion / Feedback | Change Made |
|---|---|---|---|
| User 1 | To be completed | To be completed | To be completed |
| User 2 | To be completed | To be completed | To be completed |
| User 3 | To be completed | To be completed | To be completed |
| User 4 | To be completed | To be completed | To be completed |
| User 5 | To be completed | To be completed | To be completed |

Do not invent completed external testing. Replace these placeholders only after real people have tested the application.

## 19. Coding Agent Prompt Log
1. Build responsive navigation and the Park Now landing page using the approved product spec.
2. Build the Live Parking page with numbered spaces, available/occupied states, totals, and simulated refresh behavior.
3. Refactor parking-space data into reusable components and prepare a Supabase-compatible data interface.
4. Build the operator dashboard using saved parking-location and occupancy data.
5. Build the Parking Assistant with explicit guardrails against availability guarantees and unsafe driving interaction.
6. Review accessibility, mobile responsiveness, loading/error states, and fix issues discovered in testing.

## 20. Final Submission Checklist
- Live Vercel URL
- Ten required pages working
- Supabase data evidence
- At least five meaningful GitHub commits
- At least two Vercel deployments
- Prompt log
- At least five external user tests total
- Iteration evidence
- Human Decision Note
- Architecture documentation
- Guardrails documented
- Five-minute demo video
