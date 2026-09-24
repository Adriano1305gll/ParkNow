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

| Participant ID | Date | Device/browser | Completed tasks | Total time | Main success | Main confusion | Trust rating (1-5) | Would use? | Key quote or observation | Evidence link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 |  |  |  |  |  |  |  |  |  |  |
| P2 |  |  |  |  |  |  |  |  |  |  |
| P3 |  |  |  |  |  |  |  |  |  |  |
| P4 |  |  |  |  |  |  |  |  |  |  |
| P5 |  |  |  |  |  |  |  |  |  |  |

## Bugs and Improvements Log

Record observed problems separately from ideas that are not necessarily bugs. Assign a priority after reviewing all five sessions.

| ID | Type (Bug / Improvement) | Scenario | Description | Steps to reproduce | Expected result | Actual result | Frequency | Priority | Proposed action | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |  |  |  | Open |
| 2 |  |  |  |  |  |  |  |  |  | Open |
| 3 |  |  |  |  |  |  |  |  |  | Open |
| 4 |  |  |  |  |  |  |  |  |  | Open |
| 5 |  |  |  |  |  |  |  |  |  | Open |

### Suggested Priority Scale

- **High:** Prevents task completion, creates a serious misunderstanding, or creates a safety concern.
- **Medium:** Causes repeated confusion or slows down an important workflow.
- **Low:** Minor wording, visual, or convenience issue.

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
