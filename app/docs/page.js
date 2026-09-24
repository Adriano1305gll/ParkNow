import Page from '../../components/Page';

const promptText = `ROLE: You are Park Now's campus parking recommendation agent.

TASK: Convert one student's parking constraints into one structured parking plan.

INPUTS: destination, arrival_time, duration_minutes, max_walk_minutes, budget, accessibility_needs.

RULES:
1. Prioritize accessibility needs, maximum walking time, budget, and convenience.
2. Return one best option and one backup option.
3. Explain why the best option fits at least two submitted constraints.
4. Include estimated cost and walking time.
5. Explain uncertainty or constraint conflicts honestly.
6. Never claim that simulated availability is guaranteed.

OUTPUT:
best_option, why_it_fits, estimated_cost, walking_minutes, backup_option, risks, simulation_notice.`;

export default function Docs() {
	return (
		<Page eyebrow="Documentation" title="How Park Now is designed.">
			<div className="max-w-4xl space-y-8">
				<S t="Architecture">
					Next.js/React frontend → occupancy status source → Supabase database → live parking map and operator dashboard. The recommendation flow is form → deterministic recommendation → human Save action → Supabase core_outputs → dashboard preview. For the capstone, the occupancy feed can be simulated. In a real deployment, approved sensors or parking-system APIs would update the database.
				</S>
				<S t="Data model">
					ParkingLot, ParkingSpace, OccupancyEvent, UserTest, AssistantLog, and core_outputs. Each space stores a stable ID, location, current status, and last-updated timestamp.
				</S>
				<S t="Prompt library entry">
					<p className="font-semibold text-white">Park Now Core Extraction v1</p>
					<pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">{promptText}</pre>
				</S>
				<S t="Output schema">
					<strong className="text-white">best_option</strong> names the recommended facility. <strong className="text-white">why_it_fits</strong> connects it to submitted constraints. <strong className="text-white">estimated_cost</strong> and <strong className="text-white">walking_minutes</strong> provide the key comparison values. <strong className="text-white">backup_option</strong> gives a fallback. <strong className="text-white">risks</strong> records uncertainty or conflicts. <strong className="text-white">simulation_notice</strong> identifies simulated availability and pricing.
				</S>
				<S t="Guardrails">
					Availability and pricing are simulated in this prototype and can change. Never guarantee that a displayed space will remain available or that an estimated price is final. Mark stale data, do not direct users to interact with the app while actively driving, and do not expose license plates or personally identifying vehicle data.
				</S>
				<S t="Success criteria">
					Generate: valid constraints produce one best option, one backup, reasons, cost, walking time, and risks. No-match: conflicting constraints produce an honest no-match result and useful risks. Save: the user explicitly chooses the human Save action before data is written. Saved-output preview: a successful save appears in the dashboard preview with its recommendation and simulation notice.
				</S>
			</div>
		</Page>
	);
}

function S({ t, children }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-white">{t}</h2>
			<div className="mt-2 leading-7">{children}</div>
		</section>
	);
}
