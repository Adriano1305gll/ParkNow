# Park Now Final Five-Minute Demo Script

## Purpose

This script is a five-minute presentation guide for the Park Now AI-101 submission. It uses simple English and follows the current production application. It tells the presenter which page to show, what to click, and what to say.

This is a prepared script, not evidence that the final demo has already been recorded. Replace every bracketed placeholder with real information after recording. Do not invent user testing results, feedback, approvals, or deployment history.

## Pre-Demo Setup

Complete these checks before recording:

- Open the production URL: <https://park-now-seven.vercel.app>.
- Confirm the production `/core` route: <https://park-now-seven.vercel.app/core>.
- Have the Supabase project open in a separate browser tab.
- Have the GitHub repository open: <https://github.com/Adriano1305gll/ParkNow>.
- Confirm the application loads without exposing any environment variable or secret key.
- Prepare valid Core inputs that produce a recommendation:
  - Destination: `Campus Center`
  - Arrival time: choose a valid future or current test time
  - Duration: `90` minutes
  - Maximum walking time: `15` minutes
  - Budget: `10`
  - Accessibility needs: `None`
- Record the current `core_outputs` count before saving: `_____`.
- Decide whether the recording should save a new production record. If it does, record the count afterward: `_____`.
- Do not modify database schema during the demo.
- Do not show `.env.local`, API keys, service-role keys, or browser developer tools containing secrets.

## Five-Minute Script

### 0:00-0:40 - Introduce Park Now and the Problem

**Page to show:** Home at `https://park-now-seven.vercel.app`.

**Click:** No required click. Keep the Home page visible. Point to the main message and the parking preview.

**What to say:**

> This is Park Now, a parking availability application. The problem is simple: drivers often enter a busy or unfamiliar parking facility without knowing where an open space is. They drive around, lose time, and create more traffic inside the facility. Park Now turns parking status into a simple visual map so a driver can make a faster decision.

**What to show:**

- The Park Now name and main message.
- The Central Garage preview.
- The numbered spaces.
- The visible simulation notice.

**Transition:** Move to Live Parking using the View Live Parking button.

### 0:40-1:20 - Target Users and Value Proposition

**Page to show:** Home first, then optionally Product at `/product` if the transition is quick.

**Click:** Click **How it works** only if you want to show the Product page. Otherwise remain on Home and continue.

**What to say:**

> The primary user is a driver who needs to park in a large or unfamiliar facility. The secondary user is the parking operator, such as a school, office, hospital, airport, or event venue. Drivers use Park Now to reduce searching and uncertainty. Operators get a clearer view of occupancy. The prototype is intentionally focused on one decision: where can I find an available space right now?

> The data can be simulated for this capstone. The application does not promise that a space will still be available when the driver arrives.

**What to show:**

- The driver-facing Home call to action.
- The product explanation if the Product page is opened.
- The simulation notice.

**Transition:** Return to Home if needed, then click **View Live Parking**.

### 1:20-2:10 - Home and Live Parking

**Page to show:** `/parking` at <https://park-now-seven.vercel.app/parking>.

**Click:** Click **View Live Parking** from Home, or click **Live Parking** in the navigation. Wait for the page to finish loading.

**What to say:**

> This is the Live Parking page for Central Garage. At the top, the user can see the available, occupied, and total space counts. Below that, each numbered tile represents one parking space. The state is shown visually and by the space number, so the user does not have to depend on color alone.

> I can identify an available space by checking its status and number. The page reads parking spaces from Supabase. It also listens for Realtime changes to the parking spaces table, so a database update can refresh the map and totals.

**What to click:**

1. Point to the Available count.
2. Point to the Occupied count.
3. Point to the Total Spaces count.
4. Point to one available numbered space.
5. Point to one occupied numbered space.
6. Do not claim a simulated update occurred unless you actually trigger or observe one.

**What to say if the page shows a configuration or loading error:**

> This environment is not currently showing the live data service. The application has an explicit configuration state instead of presenting missing data as live availability.

**Transition:** Open `/core` directly using the prepared URL or browser address bar.

### 2:10-3:10 - Generative Core Recommendation

**Page to show:** `/core` at <https://park-now-seven.vercel.app/core>.

**Click:** Enter the trip details, then click **Generate parking plan**.

**What to say while entering the form:**

> The Core module converts trip constraints into a structured parking plan. I will use Campus Center as the destination, a 90-minute stay, a maximum walking time of 15 minutes, a budget of 10 dollars, and no special accessibility requirement for this example.

**What to show after generating:**

- Best option.
- Why it fits.
- Estimated cost.
- Walking minutes.
- Backup option.
- Risks and the simulation notice.

**What to say:**

> The recommendation is deterministic in this prototype. It filters options using the submitted constraints and ranks the options using walking distance and estimated cost. The result explains why the best option fits the request and also shows a backup and risks. This makes the output easier to inspect than an unexplained answer.

**Click:** Click **Save result** for a valid recommendation only.

**What to say:**

> I am choosing the human Save action now. The application sends this valid result to the Supabase `core_outputs` table. The risks are stored as text-compatible JSON because that matches the existing database column.

> A no-match result behaves differently. It tells the user to adjust the constraints and does not show a Save result button. It also does not attempt a database insert.

**What to show after saving:**

- The success message, if displayed.
- The Dashboard preview inside the Core page.
- The recorded before-and-after `core_outputs` count only if it was checked during the demo.

**Do not say:**

- Do not say the recommendation is guaranteed.
- Do not say the data is from physical sensors unless that is true for the deployment being shown.
- Do not claim the save succeeded unless the UI or Supabase table confirms it.

### 3:10-3:50 - Supabase and Dashboard

**Page to show:** Supabase project in one tab, then `/dashboard` at <https://park-now-seven.vercel.app/dashboard>.

**Click:** In Supabase, open the relevant table view or read-only table information. Do not open or display secrets. Then click or navigate to Dashboard in the application.

**What to say:**

> The backend uses Supabase. The project currently contains six tables: `assistant_logs`, `core_outputs`, `occupancy_events`, `parkin_lots`, `parking_spaces`, and `user_tests`.

> `core_outputs` contains the saved recommendation records. Before this live save there were 3 records, and the verified count after saving was 4. I will show the actual table count or table rows here rather than inventing a result.

> The main Dashboard reads `parking_spaces` and calculates total spaces, available spaces, occupied spaces, and occupancy rate for the operator. It also subscribes to parking-space changes. The Core page has the preview of saved recommendations; the main Dashboard currently focuses on occupancy metrics.

**What to show:**

- The six table names or the relevant Supabase table evidence.
- The actual `core_outputs` count: `_____`.
- The Dashboard metric cards.
- The Central Garage summary.

**Important:** Never show the Supabase URL value, publishable key value, service-role key, or any private project setting on screen.

### 3:50-4:30 - GitHub, Vercel, Architecture, and AI Support

**Page to show:** GitHub repository, then the production application or `/docs` page.

**Click:** Open the repository commit list. Optionally open `/docs` in the production app.

**What to say:**

> The source code is stored in the Park Now GitHub repository. The project was built through incremental commits, including the Core page, Supabase save flow, the no-match guardrail, the database migration, and the user testing documentation.

> The current production URL is `https://park-now-seven.vercel.app`, and the Core page is available at `/core`. The architecture is Next.js and React in the frontend, Supabase for parking and saved-output data, and an API route for the Parking Assistant.

> AI helped structure the interface, implementation prompts, documentation, and debugging. Human decisions remained important for the product scope, safety language, simulated-data disclosure, and the decision not to save no-match recommendations.

**What to show:**

- Repository URL and recent commits.
- Production URL.
- `/docs` architecture and guardrails, if useful.
- Do not claim a second deployment unless its evidence is available.

### 4:30-5:00 - Testing, Limitations, and Future Improvements

**Page to show:** `/docs` or the testing documentation, then return to the production app if needed.

**Click:** Show `USER_TESTING.md` in GitHub or the prepared testing materials. Do not present empty tables as completed results.

**What to say:**

> The project owner reports that five external users evaluated the application using the plan in `USER_TESTING.md`. The test scenarios cover finding an available space, understanding the map, observing a status update, checking the assistant guardrail, and deciding whether the product is useful.

> The repository contains detailed response records for Users 2, 4, and 5. Detailed responses for Users 1 and 3 are not present here, so I will not invent their answers or task-completion numbers. The recorded feedback led to grouped navigation, clearer Live Parking availability totals and states, more informative Core cards, and clearer loading and no-data messages. The current limitations are simulated or changing availability, incomplete detailed records for two participants, and the fact that the main Dashboard focuses on occupancy metrics rather than saved Core recommendations.

> Future improvements include connecting approved real sensor data, adding stronger stale-data indicators, adding database-backed accessible-space information, completing the dashboard recommendation view if required, and documenting the remaining participant records.

**What to show:**

- The blank or in-progress test record, clearly labeled as incomplete.
- The testing plan.
- Any real evidence collected before recording, without inventing missing results.

**Closing sentence:**

> Park Now is a focused prototype that makes parking availability easier to understand, while being honest about simulated data, uncertainty, and the work still needed before a production rollout.

## Recording Checklist

### Before Recording

- [ ] Production Home URL opens successfully.
- [ ] Production `/core` URL opens successfully.
- [ ] Live Parking is reachable and its current data state is understood.
- [ ] Supabase tab is open without exposing secrets.
- [ ] GitHub repository tab is open.
- [ ] Valid Core input values are prepared.
- [ ] Current `core_outputs` count is recorded: `_____`.
- [ ] Browser notifications and unrelated tabs are hidden.
- [ ] Microphone and screen recording have been tested.
- [ ] The presenter knows which claims are verified and which remain placeholders.

### During Recording

- [ ] Stay within each timestamp block.
- [ ] Click only the actions described in the script.
- [ ] Show the actual result after generating and saving.
- [ ] Do not expose environment variables, API keys, or private Supabase settings.
- [ ] Do not claim user feedback that has not been collected.
- [ ] Do not claim the final demo is complete before this recording is actually saved.
- [ ] Record any unexpected behavior in the notes below.

### After Recording

- [ ] Watch the recording once for missing sections or inaccurate claims.
- [ ] Confirm the final duration is approximately five minutes.
- [ ] Add the recording link to the submission checklist.
- [ ] Add the recording date and version/commit.
- [ ] Record the final `core_outputs` count if a demo save was performed.
- [ ] Store the final video where the evaluator can access it.

## Evidence to Show

| Evidence | Where to show it | Actual evidence link or note |
| --- | --- | --- |
| Production Home page | `https://park-now-seven.vercel.app` |  |
| Production Core page | `https://park-now-seven.vercel.app/core` |  |
| Live Parking page | `/parking` |  |
| Supabase table names | Supabase Table Editor or project evidence |  |
| `core_outputs` count | Supabase table or query result |  |
| Six existing tables | Supabase table list |  |
| Dashboard metrics | `/dashboard` |  |
| GitHub repository | `https://github.com/Adriano1305gll/ParkNow` |  |
| Relevant GitHub commits | Commit history |  |
| Architecture and guardrails | `/docs` or `PROJECT_REPORT.md` |  |
| User testing plan | `USER_TESTING.md` |  |
| Actual user testing results | Completed testing records only |  |
| Final recording | Video link after recording |  |

## Recording Notes and Placeholders

- Recording date: `____________________________`
- Application version or commit: `____________________________`
- Presenter: `____________________________`
- Actual duration: `____________________________`
- `core_outputs` count before demonstration save: `____________________________`
- `core_outputs` count after demonstration save: `____________________________`
- Supabase evidence link: `____________________________`
- GitHub evidence link: `____________________________`
- Final video link: `____________________________`
- Unexpected behavior to disclose: `____________________________`

## Claims That Must Remain Unfinished Until Evidence Exists

- Detailed response records for all five users have been documented.
- User feedback confirms a specific product decision.
- The final demo video has been recorded or submitted.
- At least two Vercel deployments have been independently documented.
- A human reviewer has approved the final submission.
