# Park Now — Week 2 Product Specification

## Feature
Research + Benchmarking Dashboard.

## Existing Routes
/research
/dashboard

## Functional Requirements

FR1. Preserve the existing research introduction and validation plan.

FR2. Add a research intake form for market, parking facility type and research question.

FR3. Present five documented global parking examples with identifiable sources.

FR4. Explain considerations for adapting relevant solutions to Mexico.

FR5. Present eight competitors or substitutes in a comparison table.

FR6. Allow users to search the comparison table by name or feature.

FR7. Allow users to filter the comparison table by category.

FR8. Present a risk and opportunity map relevant to Park Now.

FR9. Allow users to save research records and retrieve them after refreshing the page.

FR10. Add a research summary to /dashboard without changing existing parking analytics.

## Acceptance Criteria

AC1. /research loads without an application error.

AC2. The intake form identifies required fields and prevents empty submissions.

AC3. Five global examples are visible with sources.

AC4. Eight competitors or substitutes are visible with sources.

AC5. Searching and filtering update the visible comparison results.

AC6. A search with no matches shows a helpful empty state.

AC7. A saved research record remains available after page refresh.

AC8. /dashboard shows research information from saved records.

AC9. Existing parking statistics remain unchanged by research operations.

AC10. The interface communicates loading, success and error states clearly.

## Technical Constraints
- Reuse the existing Next.js, React, Tailwind and Supabase stack.
- Use free tools only.
- Do not invent live competitor data or user feedback.
- Do not claim persistence until it has been tested.
- Do not replace existing parking functionality.

## Definition of Done
The required functions work in production, tests are documented, the owner reviews the result, and the Week 2 evidence packet contains real links and screenshots.
