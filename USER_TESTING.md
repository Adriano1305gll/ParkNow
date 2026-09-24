# Park Now User Testing

## Purpose

This document provides a consistent usability-testing plan for the Park Now AI-101 capstone. The goal is to learn whether real users can understand parking availability, use the core workflows, interpret simulated data correctly, and identify any usability problems before final submission.

Testing must be conducted with five real participants who are not the person building the application. Do not fill in results before a participant completes the session. Record what the participant does and says rather than leading them toward an expected answer.

## Before Testing

- Recruit five participants who represent likely Park Now users, such as students, staff, visitors, drivers, or parking operators.
- Use the same deployed URL for every participant when possible.
- Record the deployment URL, test date, device, browser, and facilitator name.
- Ask for permission before recording audio, video, screen activity, or screenshots.
- Do not collect license plates, personal vehicle details, or unnecessary personal information.
- Explain that the test evaluates the product, not the participant.
- Do not help unless the participant is blocked. Record any help provided.

### Session Information

| Field | Value |
| --- | --- |
| Deployment URL |  |
| Test date range |  |
| Facilitator |  |
| Version or commit |  |
| Supabase data mode | Simulated / Connected / Unknown |
| Notes about test environment |  |

## Testing Scenarios

Each participant should complete all five scenarios in order. Read only the instructions in the scenario to the participant. Do not explain where to click or what the correct answer should be before they attempt the task.

### Scenario 1: Find an Available Space

**Context:** You are arriving at an unfamiliar campus parking facility and want to know whether you can park before driving around the lot.

**Participant instructions:**

1. Open the Park Now home page.
2. Find the live parking view without assistance.
3. Report how many spaces are currently available.
4. Identify one available space by its number.
5. Explain how you decided that the space was available.

**Record:**

| Measure | Result |
| --- | --- |
| Completed without help? |  |
| Time to find the live parking view |  |
| Available-space count reported |  |
| Space number identified |  |
| Confusion or hesitation |  |
| Facilitator help given |  |

### Scenario 2: Interpret the Parking Map

**Context:** You are comparing the map with the physical signs or markings in a parking facility.

**Participant instructions:**

1. Stay on the Live Parking page.
2. Explain what the two space states mean.
3. Identify one occupied space and one available space.
4. Explain whether the numbers help you connect the map to a real parking space.
5. State whether color alone was enough to understand the status.

**Record:**

| Measure | Result |
| --- | --- |
| Completed without help? |  |
| Occupied space identified |  |
| Available space identified |  |
| Correct explanation of statuses? |  |
| Understood labels without relying only on color? |  |
| Confusion or hesitation |  |

### Scenario 3: Observe a Parking Status Update

**Context:** You are watching the lot while availability changes.

**Participant instructions:**

1. Open Live Parking.
2. Note the available, occupied, and total counts.
3. Trigger or observe a simulated update if the control is available.
4. Report what changed on the map.
5. Check whether the summary counts changed consistently.
6. Explain whether the data appears simulated, live, or unclear.

**Record:**

| Measure | Result |
| --- | --- |
| Completed without help? |  |
| Counts before update |  |
| Space changed |  |
| Counts after update |  |
| Counts remained consistent? |  |
| Simulation notice understood? |  |
| Confusion or hesitation |  |

### Scenario 4: Ask the Parking Assistant a Safety Question

**Context:** You want to know whether a currently available space will still be available when you arrive later.

**Participant instructions:**

1. Open the Assistant page.
2. Ask: "Can you guarantee space 12 will still be free when I arrive?"
3. Read the response aloud or summarize it.
4. Explain whether the response makes a promise about future availability.
5. Ask one additional question about current parking availability.
6. State whether the answer was useful and clear.

**Record:**

| Measure | Result |
| --- | --- |
| Completed without help? |  |
| Guarantee question response understood? |  |
| Assistant made an unsafe guarantee? |  |
| Additional question asked |  |
| Additional answer useful? |  |
| Confusion or hesitation |  |

### Scenario 5: Decide Whether to Use Park Now

**Context:** You are deciding whether Park Now would be useful for a regular campus trip.

**Participant instructions:**

1. Explore the Home, Live Parking, Dashboard, and Documentation pages.
2. Explain in your own words what Park Now does.
3. Identify the most useful page for a driver.
4. Identify the most useful page for a parking operator.
5. State whether you would use the product and why.
6. Name one change that would make the product more useful or trustworthy.

**Record:**

| Measure | Result |
| --- | --- |
| Completed without help? |  |
| Participant description of product |  |
| Most useful driver feature |  |
| Most useful operator feature |  |
| Would use Park Now? |  |
| Suggested improvement |  |

## Questions After Each Session

Ask these questions after the participant completes all scenarios. Use open-ended follow-up questions such as "What made you say that?" when clarification is needed.

1. What did you think Park Now was for when you first opened it?
2. What information was easiest to understand?
3. What information was hardest to understand?
4. Did you trust the availability information? Why or why not?
5. Did you understand that occupancy may be simulated or may change?
6. Did any label, color, button, or page behave differently than you expected?
7. What would you change first?
8. Would you use Park Now for a real parking trip? Why or why not?
9. Would you recommend it to another driver or parking operator?
10. Is there anything important you expected to see but did not find?

## Participant Feedback Log

Use one row per participant. Use participant aliases or IDs instead of names.

| Participant ID | Date | Device/browser | Completed tasks | Total time | Main success | Main confusion | Trust rating (1-5) | Experience rating (1-5) | Would use? | Key quote or observation | Evidence link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 |  |  |  |  |  |  |  |  |  |  |  |
| P2 | September 23, 2026 |  |  |  | Easy to use and easy to understand |  |  |  |  | The visualization was the favorite aspect; accessible-space identification was suggested as a future improvement. |  |
| P3 |  |  |  |  |  |  |  |  |  |  |  |
| P4 | September 23, 2026 |  |  |  | Intuitive and easy to navigate |  |  | 4/5 |  | Practical and specific to the need it covers |  |
| P5 | September 23, 2026 |  |  |  | Easy to use, intuitive, and quick to understand |  |  | 4/5 |  | Live Parking and Assistant were favorite features; requested richer lot information and clearer loading/empty-data states. |  |

### Recorded Session: User 4

| Field | Recorded response |
| --- | --- |
| Date | September 23, 2026 |
| Participant | User 4 |
| Ease of use | "Sí, muy intuitiva." |
| Navigation | "Sí, el menú daba la opción muy clara." |
| Favorite aspect | "Muy práctico y específico a la necesidad que cubre." |
| Suggested improvement | "Visualmente separar más los títulos de acuerdo a funciones." |
| Experience rating | 4/5 |
| Main finding | The participant found Park Now intuitive, practical, and easy to navigate. |
| Suggested future improvement | Improve visual hierarchy by separating section headings according to their functions. |

Only the information above was provided for User 4. Unreported device, task-completion, timing, trust, usage-intention, and evidence fields remain blank.

### Recorded Session: User 2

| Field | Recorded response |
| --- | --- |
| Date | September 23, 2026 |
| Participant | User 2 |
| Ease of use | "Sí me pareció fácil la app." |
| Understanding | "Sí entendí muy fácil." |
| Favorite aspect | "La visualización." |
| Suggested improvement | "Lo que le falta app es la individualizada de los hándicap." |
| Interpretation for future improvement | Identify accessible parking spaces for people with disabilities. |

Only the information above was provided for User 2. No rating or additional response is claimed.

### Recorded Session: User 5

| Field | Recorded response |
| --- | --- |
| Date | September 23, 2026 |
| Participant | User 5 |
| Ease of use | "Sí, me pareció fácil de usar y bastante intuitiva. Las secciones están bien organizadas y es sencillo entender para qué sirve cada una." |
| Understanding | "Sí, entendí rápidamente cómo buscar un estacionamiento y cómo utilizar las recomendaciones para encontrar una opción disponible." |
| Favorite features | "Lo que más me gustó fue la sección de Live Parking, porque permite visualizar la disponibilidad de estacionamientos. También me gustó el Assistant, ya que hace más fácil obtener información haciendo preguntas." |
| Suggested improvements | "Mejoraría la información que aparece sobre cada estacionamiento, por ejemplo, el precio, la distancia y los horarios. También haría más clara la información cuando no hay datos disponibles o cuando la aplicación está cargando." |
| Experience rating | 4/5 |
| Additional comment | "Me pareció una aplicación fácil de entender, útil y con una idea interesante. Creo que con algunos detalles adicionales podría mejorar mucho la experiencia." |

Only the information above was provided for User 5. Unreported device, task-completion, timing, trust, usage-intention, and evidence fields remain blank.

## Bugs and Improvements Log

Record observed problems separately from ideas that are not necessarily bugs. Assign a priority after reviewing all five sessions.

| ID | Type (Bug / Improvement) | Scenario | Description | Steps to reproduce | Expected result | Actual result | Frequency | Priority | Proposed action | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Improvement | Overall navigation and visual hierarchy | Separate section headings more clearly according to their functions. |  | Clearer functional grouping of headings. | Participant requested stronger visual separation of headings. | 1 participant |  | Improve heading hierarchy after reviewing remaining sessions. | Open |
| 2 | Improvement | Parking map / accessibility | Identify accessible parking spaces for people with disabilities. |  | Users can identify accessible spaces before choosing a spot. | User 2 requested individualized support for disabilities. | 1 participant | High | Consider accessible-space data and visual identification as a future feature. | Open |
| 3 | Improvement | Parking information and data states | Show price, distance, and hours for each parking option and make loading/no-data states clearer. |  | Users understand each option and what the interface is doing when data is unavailable. | User 5 requested richer parking information and clearer loading/no-data messaging. | 1 participant | Medium | Define the additional fields and improve loading/empty-state copy. | Open |
| 4 |  |  |  |  |  |  |  |  |  | Open |
| 5 |  |  |  |  |  |  |  |  | Open |
### Suggested Priority Scale

- **High:** Prevents task completion, creates a serious misunderstanding, or creates a safety concern.
- **Medium:** Causes repeated confusion or slows down an important workflow.
- **Low:** Minor wording, visual, or convenience issue.

## Consolidated Testing Findings

### Response Completeness

The project owner reported that five external users evaluated Park Now. This file currently contains detailed responses for User 2, User 4, and User 5. Detailed responses for User 1 and User 3 are not present in the available project documentation, so their answers are not inferred here.

| Participant | Detailed response status | Rating status |
| --- | --- | --- |
| User 1 | No detailed response recorded in this file | No rating recorded |
| User 2 | Partial: ease of use, understanding, favorite aspect, and improvement | No rating provided |
| User 3 | No detailed response recorded in this file | No rating recorded |
| User 4 | Partial: ease of use, navigation, favorite aspect, improvement, and rating | 4/5 |
| User 5 | Partial: all supplied question responses and additional comment; task metrics were not supplied | 4/5 |

### Average Explicit Rating

Only participants who provided a numerical rating are included:

```text
(User 4: 4 + User 5: 4) / 2 = 4.0 / 5
```

User 2 did not provide a rating. User 1 and User 3 have no rating recorded in this file and are excluded from the calculation.

### Recurring Positive Findings

These findings recur in the documented responses:

- Ease of use and intuitiveness were positive themes for User 2, User 4, and User 5.
- The visual presentation was valued by User 2, and Live Parking was specifically valued by User 5 for making availability visible.
- The documented participants described the concept as practical, useful, or easy to understand.

These findings summarize only the three detailed records currently present. They are not a substitute for the missing User 1 and User 3 response details.

### Recurring Usability Problems

No single usability problem is confirmed as recurring across the documented responses. The following are separate suggestions from individual participants:

- User 2: identify accessible spaces for people with disabilities.
- User 4: separate headings more clearly according to function.
- User 5: show price, distance, and hours, and clarify loading/no-data states.

### Prioritized Improvements

This priority order is a project synthesis based on the documented suggestions, not additional participant feedback.

1. **High: Add accessible-space identification.** Support an accessibility field in parking data and make accessible spaces identifiable before selection.
2. **Medium: Improve parking-option details and data states.** Add price, distance, and hours where reliable data exists, and make loading and no-data messages clearer.
3. **Medium: Improve visual hierarchy.** Separate headings and sections more clearly according to their functions.
4. **Pending evidence: Review User 1 and User 3 records.** Complete the consolidation only when their actual responses are available.

### What We Learned

The documented participants understood the main idea quickly and generally found the interface easy to use. Live Parking is valuable because it makes availability visible, and the Assistant adds a direct way to ask questions. The next improvements should add decision-relevant parking details, make accessibility visible, and clarify the interface during loading or missing-data states. These conclusions should be checked against the missing User 1 and User 3 records before being presented as a complete five-user synthesis.

### Final Evidence Summary

- External evaluations reported by the project owner: 5.
- Detailed response records available in this repository: Users 2, 4, and 5.
- Detailed responses missing from this repository: Users 1 and 3.
- Explicit numerical ratings available: User 4 = 4/5 and User 5 = 4/5.
- Average of explicit ratings: 4.0/5.
- Task-completion counts, device/browser details, consent records, screenshots, and session recordings: not provided in the available evidence.
- Improvements implemented from documented feedback: grouped navigation, clearer parking details and data states, green/red availability visibility, Live Parking totals, and preserved Supabase/Core functionality.

## Evidence of Implemented Improvements

This section documents changes visible in the current application after reviewing the recorded external feedback. It is implementation evidence, not a new user-test result, screenshot, or human approval.

### Navigation Organization

The shared navigation is organized into four labeled sections: **Explore**, **Plan**, **Operate**, and **Learn**. This responds to User 4's request to separate headings and functions more clearly, while preserving access to the existing routes.

### Parking Availability Visibility

Live Parking uses green styling for available spaces and red styling for occupied spaces. Each space also keeps its number, so users do not have to rely on color alone.

### Live Parking Totals

The Live Parking page displays **Available**, **Occupied**, and **Total Spaces** metrics above the numbered parking-space grid. These values are derived from the same `parking_spaces` records used to render the map.

### Supabase and Existing Functionality

The improvements preserve the existing Supabase integration, routes, database tables, recommendation engine, and Core save flow. The UI changes do not modify the database schema. Supabase configuration, loading, and empty states are shown honestly when data is unavailable.

### Relationship to Documented Feedback

- User 2 valued the visualization; the numbered green/red map keeps availability easy to scan.
- User 4 found the application intuitive and requested clearer separation of headings; the grouped navigation addresses that visual-organization request.
- User 5 valued Live Parking and requested clearer parking information and data states; the current application now emphasizes availability totals and explicit loading/no-data messages.

No additional participant feedback or test result is claimed by this section.

## Screenshots and Evidence

Add evidence only after a participant has given permission. Use participant IDs in filenames and avoid personal information.

### Evidence Index

| Evidence ID | Participant ID | Scenario | Evidence type | File or URL | What it demonstrates | Consent confirmed? |
| --- | --- | --- | --- | --- | --- | --- |
| E1 |  |  | Screenshot / recording / note |  |  |  |
| E2 |  |  | Screenshot / recording / note |  |  |  |
| E3 |  |  | Screenshot / recording / note |  |  |  |
| E4 |  |  | Screenshot / recording / note |  |  |  |
| E5 |  |  | Screenshot / recording / note |  |  |  |

### Recommended Evidence to Capture

- A participant locating the Live Parking page.
- A participant identifying available and occupied spaces.
- Counts before and after a status update.
- The assistant response to the no-guarantee question.
- A participant explaining the product in their own words.
- A final screenshot of the completed feedback and bug logs.

Do not present planned evidence as completed evidence. Replace each placeholder only after the corresponding session has taken place.

## Final Testing Summary Template

Complete this section after all five sessions. Do not estimate or invent values; use the recorded logs.

### Participants and Method

- Number of participants: ___ / 5
- Participant profile summary: ___
- Deployment tested: ___
- Test dates: ___
- Devices and browsers used: ___
- Data mode observed: ___

### Results

- Participants who found Live Parking without help: ___ / 5
- Participants who correctly identified available and occupied states: ___ / 5
- Participants who understood the simulated/live data notice: ___ / 5
- Participants who observed a consistent update: ___ / 5
- Participants who understood the assistant's no-guarantee response: ___ / 5
- Participants who would use Park Now: ___ / 5

### Main Findings

1. Finding that worked well: ___
2. Most common confusion: ___
3. Most important bug: ___
4. Most valuable improvement: ___
5. Evidence supporting these findings: ___

### Iteration Decision

- Changes to make before final submission: ___
- Changes deferred and why: ___
- Retest required? Yes / No
- Retest date or owner: ___

### Submission Evidence Checklist

- [ ] Five completed participant records.
- [ ] Completed feedback table.
- [ ] Completed bugs and improvements table.
- [ ] Screenshots or evidence links with consent recorded.
- [ ] Final summary completed from observed results.
- [ ] Any product changes linked to a recorded finding.
