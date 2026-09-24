# Park Now — Week 2 Build Discipline Packet

## 1. Problem
Drivers entering busy parking facilities often lack reliable information about available spaces. Park Now already addresses this problem through a visual parking map. Week 2 investigates how comparable solutions work and which features are relevant to the Mexican market.

## 2. Primary User
Drivers using structured parking facilities such as shopping malls, universities, hospitals, offices, airports, and event venues in Mexico.

## 3. Week 2 Goal
Transform the existing /research page into an interactive Research + Benchmarking Dashboard that helps the project owner compare parking solutions, identify opportunities and risks, and save research findings.

## 4. Success Criteria
- The existing Park Now application continues working.
- /research contains a research intake form.
- Research presents five documented global examples.
- Research explains relevant considerations for Mexico.
- A comparison table contains eight competitors or substitutes.
- Users can search and filter the comparison table.
- A risk map identifies risks and opportunities.
- Research findings can be saved and retrieved.
- /dashboard displays a summary of saved research.
- Loading, empty, success, and error states are understandable.

## 5. UX Plan
Preserve the current Park Now visual identity and existing introductory content.

Proposed /research layout:
1. Existing problem statement and validation plan.
2. Research intake form.
3. Five global examples.
4. Mexico localization insights.
5. Searchable and filterable competitor table.
6. Risk and opportunity map.
7. Saved research results and confirmation.

Proposed /dashboard addition:
- A Research Summary card below the existing parking analytics.
- A link back to /research.

## 6. Product Specification
The intake form should collect the research location, parking facility type, and research question.

The competitor comparison should show a solution name, geographic market, category, main feature, relevance to Park Now, and source.

Saving should preserve the submitted research information and a timestamp. The application must clearly distinguish documented reference information from user-entered findings.

## 7. Architecture
Existing stack: Next.js, React, Tailwind CSS, Vercel, GitHub, and Supabase.

Reuse the existing /research and /dashboard routes. Keep research data separate from live parking occupancy data.

Use Supabase for persistent research records if the existing project configuration and permissions support it. Any new database table or policy must be documented and tested.

## 8. Scope Limits
Do not rebuild Park Now, replace the parking dashboard, or introduce paid APIs.

Do not present manually curated competitor information as live internet search results.

Do not claim that research records are saved unless persistence has been tested.

## 9. Testing Plan
Test 1: /research renders correctly and displays the required research content.

Test 2: Competitor search and filters produce the expected results, including an empty state.

Test 3: A research record can be saved, retrieved after refresh, and summarized on /dashboard.

Also check that /parking, /core, and the existing dashboard continue working.

## 10. Human Checkpoints
The project owner approves the Week 2 scope before coding, reviews the finished interface, and decides which research findings are useful.

At least one real person will review the new research workflow. Record actual feedback and any resulting improvement without inventing responses.

## 11. Evidence Plan
Keep dated evidence of:
- This planning document before implementation.
- UX mockup and product specification.
- At least five genuine coding prompts.
- At least five relevant Git commits.
- At least two Week 2 Vercel deployments.
- Three actual software tests and fixes.
- One real human validation conversation.
- Working production links and screenshots.
- A 150–250-word personal reflection.
- A 2–3-minute demo video.

Evidence requirements will be checked against the teacher's original Week 2 instructions before submission.

## 12. Owner Decision
Week 2 will extend the existing Park Now project rather than start a new application. The parking analytics will remain separate from research and benchmarking results.
