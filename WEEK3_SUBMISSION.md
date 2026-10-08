# Park Now — Week 3 Submission

Date: 2026-10-08

## Project Goal

Park Now helps drivers find available parking and helps parking-lot owners monitor occupancy. Week 3 adds a subscription pricing simulator on `/pricing` so lot owners and the project team can estimate recurring revenue. The problem definition and success criteria are in [BUILD_DISCIPLINE_PACKET.md](BUILD_DISCIPLINE_PACKET.md).

## Target Users

Target users are defined in [BUILD_DISCIPLINE_PACKET.md](BUILD_DISCIPLINE_PACKET.md). Drivers use Park Now for free; parking-lot owners are the subscribers. Target-user definition is still marked `PENDING HUMAN CONFIRMATION` in [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md).

## Pricing Simulator Specification

| Plan | Monthly price (MXN) |
| --- | --- |
| Basic | 499 |
| Pro | 1,499 |
| Enterprise | 3,999 |

The project owner approved keeping these prices on October 8, 2026 (checkpoint 12 in [HUMAN_CHECKPOINTS.md](HUMAN_CHECKPOINTS.md)). They are illustrative; no real payments are processed.

- Monthly revenue = sum of (customers × plan price). Annual revenue = monthly revenue × 12.
- Scenarios (Basic / Pro / Enterprise customers): Conservative 10 / 5 / 1, Expected 20 / 10 / 3, Optimistic 50 / 25 / 10. Inputs can also be edited manually.
- Assumptions are displayed on the page. Estimates exclude operating costs, taxes, discounts, and cancellations.
- Validation: customer counts must be whole numbers from 0 to 100,000. Invalid values show an error and count as 0.
- Saved scenarios: a name plus the three customer counts, monthly revenue, and annual revenue can be saved, listed, loaded, and deleted. A name is required.

### Where saved scenarios are stored

Saved scenarios use the browser's `localStorage` (key `parknow.savedScenarios`). They are not stored in Supabase: they stay on one browser and device, are not shared between users, and are lost if the browser data is cleared. No Supabase schema change was made for Week 3.

## UX Evidence

No new screenshots or Week 3 user feedback were collected, and none are claimed. The existing design evidence is in [UX_WIREFRAMES.md](UX_WIREFRAMES.md) (reconstructed current-state wireframes, which do not include the pricing simulator) and [USER_TESTING.md](USER_TESTING.md) (earlier feedback, not about the simulator). The simulator reuses the existing dark visual style, with three scenario buttons, plan input cards, revenue cards, a saved-scenarios panel, and an assumptions panel.

## Architecture

Overall architecture and stack are described in [BUILD_DISCIPLINE_PACKET.md](BUILD_DISCIPLINE_PACKET.md). Week 3 files:

- [app/pricing/page.js](app/pricing/page.js): plan cards and the embedded simulator.
- [components/PricingSimulator.js](components/PricingSimulator.js): client component with the UI and state.
- [lib/pricingScenarios.mjs](lib/pricingScenarios.mjs): prices, scenarios, validation, revenue calculation, and `localStorage` save/load/delete logic.
- [tests/pricingScenarios.test.mjs](tests/pricingScenarios.test.mjs): automated tests for that logic.

```text
PricingSimulator (React) -> lib/pricingScenarios.mjs -> browser localStorage
```

## Testing Evidence

`npm test` runs 8 Node test-runner tests covering revenue calculation, input validation, saving, loading, deleting, and corrupt-storage handling. Results of the run for this submission:

| Command | Result |
| --- | --- |
| `npm test` | PASS (8 passed, 0 failed) |
| `npm run build` | PASS (compiled with no errors) |

The tests cover the logic module only. The React component and browser `localStorage` behavior have no automated tests and were not manually verified by the assistant.

## GitHub

Pull request #2, "Week 3: add saved scenarios and automated tests" (`week3-pricing-simulator` into `main`): <https://github.com/Adriano1305gll/ParkNow/pull/2>. Its state was `MERGED` when this document was written. Repository: <https://github.com/Adriano1305gll/ParkNow>.

## Vercel Deployment

Production application: <https://park-now-seven.vercel.app>, with `/pricing` as the simulator route. A Vercel deployment of the Week 3 changes has not been verified in this document; confirm that `/pricing` shows the simulator in production before citing it as evidence.

## Remaining Limitations

- Saved scenarios are per-browser (`localStorage`) and are not synced or shared.
- Prices are illustrative and not validated with real customers or the market.
- The simulator excludes costs, taxes, discounts, and churn.
- No component or end-to-end tests; no screenshots or Week 3 user testing.
- Week 3 Vercel deployment and any instructor approval are not documented here.
- A recorded demo is not included.
