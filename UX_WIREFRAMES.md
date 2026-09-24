# Park Now UX Wireframes

## Status and Scope

These are **reconstructed wireframes** based on the current Park Now application, its routes, components, and documented product specification. They are not original design artifacts, historical sketches, or evidence that these layouts existed before implementation.

The wireframes describe the current information hierarchy and intended user flow in a format that can be included in the AI-101 submission. They use plain ASCII boxes to keep the structure easy to review and revise.

## Shared Product Context

- Primary user: a driver looking for an available space.
- Secondary user: a parking facility operator.
- Core promise: show parking availability clearly enough for a quick decision.
- Data status: parking availability is presented as live when connected to Supabase; prototype documentation must identify simulated or changing availability honestly.
- Shared navigation: Home, Live Parking, Research, Product, Pricing, Marketing, Assistant, Dashboard, Docs, and Demo.
- Core note: `/core` is implemented but is not currently listed in the shared navigation links. The complete journey below therefore treats it as a direct route or a route that should be linked as part of the final product flow.

## 1. Home Page

### Purpose

Introduce the parking problem and send a driver to the Live Parking experience quickly. The page also provides a concise explanation of the product and a visual preview of numbered parking spaces.

### Target User Action

Select **View Live Parking** to inspect current availability.

### Main Interface Components

- Park Now brand and shared navigation.
- Short value proposition: parking without guessing.
- Primary action: View Live Parking.
- Secondary action: How it works, linking to Product.
- Simulation notice.
- Central Garage preview with available-space count.
- Numbered grid showing available and occupied visual states.

### User Flow

1. The user lands on Home.
2. The user reads the one-sentence value proposition.
3. The user scans the preview and simulation notice.
4. The user selects View Live Parking.
5. The application routes to `/parking`.

### Reconstructed ASCII Wireframe

```text
+--------------------------------------------------------------------------+
| PARK NOW | Home | Live Parking | Research | Product | ...                |
+--------------------------------------------------------------------------+
|                                                                          |
| FIND A SPACE BEFORE YOU ARRIVE                                           |
|                                                                          |
| Parking without the guessing.                                            |
| Park Now shows available and occupied spaces on a parking-lot map.       |
|                                                                          |
| [ View Live Parking ]     [ How it works ]                               |
|                                                                          |
| Capstone prototype: occupancy is simulated unless physical sensors exist.|
|                                                                          |
|                         +--------------------------------------------+   |
|                         | Central Garage     18 spaces free          |   |
|                         | LIVE SIMULATION                           |   |
|                         |                                            |   |
|                         | [1][2][3][4]                             |   |
|                         | [5][6][7][8]                             |   |
|                         | [9][10][11][12]                         |   |
|                         | [13][14][15][16]                       |   |
|                         | [17][18][19][20]                       |   |
|                         | [21][22][23][24]                       |   |
|                         +--------------------------------------------+   |
+--------------------------------------------------------------------------+
```

### Design Decisions

- The primary action appears before secondary product information.
- The parking preview makes the product concrete without requiring a database action on Home.
- Space numbers connect the visual concept to physical parking signage.
- Available and occupied states use both color and numbered tiles rather than color alone.
- The simulation notice prevents the preview from being presented as guaranteed sensor data.
- The current page uses a responsive two-column layout that collapses for smaller screens.

## 2. Live Parking Page

### Purpose

Show space-level availability for Central Garage and provide the operational view a driver needs before choosing a space.

### Target User Action

Read the available and occupied totals, identify a numbered available space, and understand the current data state.

### Main Interface Components

- Page heading for Central Garage.
- Available count.
- Occupied count.
- Total spaces count.
- Numbered parking-space grid.
- Available and occupied visual states.
- Supabase loading and configuration-error states.
- Realtime subscription to `parking_spaces` filtered to `parking_lot_id = 1`.

### User Flow

1. The user opens `/parking` from Home or navigation.
2. The page checks for Supabase configuration.
3. The page loads parking spaces ordered by space number.
4. The user reads the summary counts.
5. The user selects or identifies a space from the grid.
6. A database change can trigger the page to reload the current spaces through Realtime.
7. If Supabase is unavailable, the page presents its configuration state rather than claiming live data.

### Reconstructed ASCII Wireframe

```text
+--------------------------------------------------------------------------+
| PARK NOW | Home | Live Parking | Research | Product | ...                |
+--------------------------------------------------------------------------+
| LIVE PARKING                                                             |
| Central Garage                                                           |
| Real-time parking availability powered by Supabase.                      |
|                                                                          |
| +----------------+  +----------------+  +----------------+               |
| | Available      |  | Occupied       |  | Total Spaces   |               |
| |       15       |  |        9       |  |       24       |               |
| +----------------+  +----------------+  +----------------+               |
|                                                                          |
| +--------------------------------------------------------------------+   |
| |              PARKING SPACE MAP                                    |   |
| |                                                                    |   |
| | [ 1 AVAILABLE ] [ 2 OCCUPIED ] [ 3 AVAILABLE ] [ 4 AVAILABLE ]   |   |
| | [ 5 OCCUPIED ]  [ 6 AVAILABLE ] [ 7 AVAILABLE ] [ 8 OCCUPIED ]   |   |
| | [ 9 OCCUPIED ]  [10 AVAILABLE ] [11 AVAILABLE ] [12 AVAILABLE ]  |   |
| | ...                                                                |   |
| +--------------------------------------------------------------------+   |
+--------------------------------------------------------------------------+
```

### Design Decisions

- Summary counts appear before the grid because drivers need an immediate availability answer.
- Each tile includes a number, so status is not communicated by color alone.
- The layout uses a dense grid to support quick scanning and comparison.
- Loading and configuration-error states are explicit instead of showing fabricated live data.
- The current implementation listens for Supabase `postgres_changes` events on `parking_spaces`.
- The current reverted application page does not include a local simulated-update button; simulation should therefore be demonstrated using the connected data source or documented as a prototype limitation.

## 3. Generative Core Page

### Purpose

Convert one student's arrival constraints into a deterministic parking recommendation with a best option, backup option, costs, walking time, risks, and simulation notice.

### Target User Action

Enter trip constraints, generate a plan, and save a valid recommendation when the result is not a no-match result.

### Main Interface Components

- Destination input.
- Arrival time input.
- Parking duration input.
- Maximum walking time input.
- Budget input.
- Accessibility needs selector.
- Validation messages.
- Generate parking plan action.
- Recommendation panel.
- Best option and explanation.
- Estimated cost and walking minutes.
- Backup option and risks.
- No-match state with the exact instruction to adjust constraints.
- Save result action for valid recommendations only.
- Supabase `core_outputs` save flow.
- Dashboard preview of the three most recent saved outputs.

### User Flow

1. The user opens `/core`.
2. The user enters destination, arrival time, duration, walking limit, budget, and accessibility needs.
3. The user selects Generate parking plan.
4. The deterministic planner filters and ranks the available simulated options.
5. A valid result shows a best option, reasons, cost, walking time, backup, and risks.
6. The user selects Save result.
7. The application inserts the valid result into `core_outputs` and updates the local preview.
8. If no option matches, the application shows the no-match state and does not show a save button or insert a record.

### Reconstructed ASCII Wireframe

```text
+--------------------------------------------------------------------------+
| GENERATIVE CORE                                                         |
| Build a parking plan.                                                    |
|                                                                          |
| +--------------------------------+  +--------------------------------+   |
| | TRIP DETAILS                   |  | YOUR RECOMMENDATION            |   |
| |                                |  |                                |   |
| | Destination [______________]   |  | Best option                    |   |
| | Arrival time [____________]    |  | Central Garage                 |   |
| |                                |  | Why it fits: ...               |   |
| | Duration [____]  Walk [____]   |  |                                |   |
| | Budget [$____]                 |  | +-------------+ +------------+ |   |
| | Accessibility [None       v]   |  | | Cost        | | Walk       | |   |
| |                                |  | | $3          | | 6 minutes  | |   |
| | [ Generate parking plan ]      |  | +-------------+ +------------+ |   |
| +--------------------------------+  | Backup option                  |   |
|                                    | Risks                          |   |
|                                    | [ Save result ]                 |   |
|                                    +--------------------------------+   |
|                                                                          |
| +--------------------------------------------------------------------+   |
| | DASHBOARD PREVIEW: recent saved recommendations                    |   |
| | Destination | Best option | Why it fits | Cost | Simulation notice |   |
| +--------------------------------------------------------------------+   |
+--------------------------------------------------------------------------+
```

### No-Match State

```text
+--------------------------------+
| NO EXACT MATCH YET             |
| No simulated option meets all  |
| of your requirements.          |
|                                |
| Backup option: ...             |
| Risks: ...                     |
|                                |
| Adjust your constraints before |
| saving a result.               |
|                                |
| Prototype recommendation;      |
| availability is simulated.     |
+--------------------------------+
```

### Design Decisions

- The form keeps all constraints visible so the recommendation can be understood as a response to user needs.
- Deterministic ranking makes the prototype explainable and repeatable without requiring an external AI call.
- The recommendation separates best option, backup, costs, walking time, and risks for decision-making.
- Save is a deliberate human action and is unavailable for no-match results.
- `risks` is serialized as text-compatible JSON for the existing Supabase schema.
- The preview confirms the saved-output path without replacing the main recommendation workflow.
- The current route exists and works in production, but `/core` is not currently a visible item in `components/Nav.js`.

## 4. Dashboard

### Purpose

Give a parking operator a quick operational view of facility occupancy.

### Target User Action

Review total capacity, available spaces, occupied spaces, and occupancy rate for Central Garage.

### Main Interface Components

- Operations Dashboard heading.
- Total Spaces metric.
- Available metric.
- Occupied metric.
- Occupancy Rate metric.
- Central Garage facility summary.
- Supabase loading and configuration-error states.
- Realtime subscription to `parking_spaces`.

### User Flow

1. The operator opens `/dashboard`.
2. The page checks Supabase configuration.
3. The page reads `parking_spaces` for `parking_lot_id = 1`.
4. The page derives available, occupied, and occupancy-rate metrics.
5. A `parking_spaces` change triggers a reload through Realtime.
6. The operator uses the metrics to understand current facility utilization.

### Reconstructed ASCII Wireframe

```text
+--------------------------------------------------------------------------+
| OPERATIONS DASHBOARD                                                     |
| Parking Analytics                                                        |
| Live parking statistics powered by Supabase.                             |
|                                                                          |
| +------------+ +------------+ +------------+ +-------------------------+ |
| | Total      | | Available  | | Occupied   | | Occupancy Rate          | |
| | 24         | | 15         | | 9          | | 38%                     | |
| +------------+ +------------+ +------------+ +-------------------------+ |
|                                                                          |
| +--------------------------------------------------------------------+   |
| | CENTRAL GARAGE                                                    |   |
| | Live operational overview of the parking facility.                |   |
| |                                                                    |   |
| | Facility: Central Garage   Status: Live   Availability: 15 spaces |   |
| +--------------------------------------------------------------------+   |
+--------------------------------------------------------------------------+
```

### Design Decisions

- Metrics are presented as a compact group for operational scanning.
- Occupancy rate is derived from the same `parking_spaces` records as the counts.
- The page uses the same Central Garage identifier and lot filter as Live Parking.
- Realtime keeps operator metrics aligned with parking-space changes.
- The current dashboard is an occupancy dashboard. It does not currently retrieve saved `core_outputs` recommendations; those appear in the Core page preview instead.
- Configuration and loading states prevent the dashboard from presenting unavailable data as live.

## 5. AI Assistant

### Purpose

Answer short questions about current Central Garage availability using the parking-space data returned from Supabase, while avoiding future-availability guarantees.

### Target User Action

Ask a concise parking question and use the answer to understand current availability.

### Main Interface Components

- Assistant heading and description.
- Question input.
- Ask Park Now button.
- Loading state while the request is processed.
- Assistant response panel.
- API route that reads `parking_spaces` and sends structured current data to the model.
- Guardrails against invented spaces and guaranteed future availability.

### User Flow

1. The user opens `/assistant`.
2. The user enters a question such as "How many spaces are available?".
3. The browser sends the question to `/api/assistant`.
4. The API reads current spaces from Supabase.
5. The API builds available and occupied counts and space-number lists.
6. The assistant responds using only that context.
7. The page displays the answer or a clear configuration/error message.
8. For a guarantee question, the assistant explains that availability can change.

### Reconstructed ASCII Wireframe

```text
+--------------------------------------------------------------------------+
| PARK NOW ASSISTANT                                                       |
| Ask about parking.                                                       |
| Get answers using current parking data from Central Garage.               |
|                                                                          |
| +--------------------------------------------------------------------+   |
| | PARKING ASSISTANT                                                 |   |
| | Ask questions such as "How many spaces are available?"            |   |
| |                                                                    |   |
| | [ Ask about parking availability...                         ]      |   |
| | [ Ask Park Now ]                                                   |   |
| |                                                                    |   |
| | ASSISTANT                                                          |   |
| | There are currently ... available spaces.                         |   |
| +--------------------------------------------------------------------+   |
+--------------------------------------------------------------------------+
```

### Design Decisions

- The assistant is a focused question-and-answer surface rather than a general chat interface.
- Current parking data is retrieved before the model receives the question.
- The API provides available and occupied space numbers so the assistant can avoid inventing spaces.
- The guardrail explicitly rejects guarantees about future availability.
- Empty questions, missing API configuration, missing Supabase configuration, and temporary failures have explicit responses.
- The assistant should be used while stopped or before driving; it should not encourage interaction while the user is actively driving.

## Complete User Journey

This journey documents the current product concept and the intended submission walkthrough. The Core page is a direct route in the current application because it is not currently listed in the shared navigation.

```text
+------+       +---------------+       +----------------------+
| Home | ----> | Live Parking  | ----> | Core Recommendation  |
+------+       +---------------+       +----------------------+
   |                    |                         |
   |                    | read current            | enter constraints
   |                    | spaces                  | and generate plan
   |                    v                         v
   |             availability map          valid recommendation
   |                                               |
   |                                               v
   |                                        +-------------+
   |                                        | Save Result |
   |                                        +-------------+
   |                                               |
   |                                               | insert core_outputs
   |                                               v
   |                                        +-------------+
   +--------------------------------------> | Dashboard   |
                                            +-------------+
```

### Step-by-Step Journey

1. **Home:** The driver understands the problem and selects View Live Parking.
2. **Live Parking:** The driver checks available, occupied, and total spaces and identifies a numbered space.
3. **Core Recommendation:** The user opens `/core`, enters destination and arrival constraints, and generates a deterministic plan.
4. **Save Result:** If the result is valid, the user deliberately saves it to `core_outputs`. No-match results cannot be saved.
5. **Dashboard:** The operator reviews occupancy metrics from `parking_spaces`. The Core page also shows a preview of saved recommendations; the current main Dashboard does not yet display `core_outputs` records.

### Current-State Constraints

- These wireframes document the current implementation; they do not claim that the screens were designed in this order historically.
- The Live Parking page depends on configured Supabase access and does not currently include a local simulated-update control.
- The application uses a numbered grid rather than a geographically accurate garage map.
- The main Dashboard displays occupancy metrics, while saved Core recommendations remain in the Core preview.
- User testing, human approvals, and the final demo remain separate evidence requirements and are not claimed by this document.
