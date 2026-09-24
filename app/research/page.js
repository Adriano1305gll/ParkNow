"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Page from '../../components/Page';

const initialForm = { market: '', facilityType: '', question: '' };

function getSupabaseErrorMessage(error) {
	if (!error) return 'Supabase returned an unknown error.';

	const code = error.code ? ` (${error.code})` : '';
	return `${error.message || 'Supabase returned an unknown error.'}${code}`;
}

const benchmarks = [
	{
		name: 'ParkMobile',
		market: 'United States and Canada',
		approach: 'Digital parking payments and parking discovery for drivers and parking operators.',
		relevance: 'A reference for connecting driver workflows with operator tools.',
		source: 'https://parkmobile.io/',
	},
	{
		name: 'EasyPark',
		market: 'Europe and other international markets',
		approach: 'A parking app focused on finding, paying for, and managing parking sessions.',
		relevance: 'A reference for reducing friction during a parking session.',
		source: 'https://www.easypark.com/',
	},
	{
		name: 'JustPark',
		market: 'United Kingdom',
		approach: 'A marketplace that helps drivers find and book parking spaces.',
		relevance: 'A reference for making underused parking supply discoverable.',
		source: 'https://www.justpark.com/',
	},
	{
		name: 'APCOA Parking',
		market: 'Europe and international markets',
		approach: 'A parking operator offering parking facilities and related services across multiple markets.',
		relevance: 'A reference for connecting facility operations with a consistent driver experience.',
		source: 'https://www.apcoa.com/',
	},
	{
		name: 'INDIGO Neo',
		market: 'France and international markets',
		approach: 'A digital service from INDIGO for finding and using parking facilities.',
		relevance: 'A reference for pairing facility operations with a digital driver experience.',
		source: 'https://www.indigoneo.com/',
	},
];

const solutions = [
	{
		name: 'ParkMobile',
		market: 'United States and Canada',
		category: 'Competitor',
		feature: 'Parking discovery and digital parking payments',
		relevance: 'Shows how a driver-facing parking workflow can connect to operators.',
		source: 'https://parkmobile.io/',
	},
	{
		name: 'SpotHero',
		market: 'United States and Canada',
		category: 'Competitor',
		feature: 'Finding and reserving parking before arrival',
		relevance: 'Highlights pre-arrival decision support as an alternative to searching on site.',
		source: 'https://spothero.com/',
	},
	{
		name: 'EasyPark',
		market: 'Europe and other international markets',
		category: 'Competitor',
		feature: 'Finding, paying for, and managing parking sessions',
		relevance: 'Provides a benchmark for a focused parking-session experience.',
		source: 'https://www.easypark.com/',
	},
	{
		name: 'JustPark',
		market: 'United Kingdom',
		category: 'Competitor',
		feature: 'Discovering and booking parking spaces',
		relevance: 'Shows how distributed parking supply can be made easier to find.',
		source: 'https://www.justpark.com/',
	},
	{
		name: 'APCOA Parking',
		market: 'Europe and international markets',
		category: 'Competitor',
		feature: 'Parking facility operations and driver services',
		relevance: 'Provides a benchmark for connecting operator workflows with driver services.',
		source: 'https://www.apcoa.com/',
	},
	{
		name: 'INDIGO Neo',
		market: 'France and international markets',
		category: 'Competitor',
		feature: 'Digital access to and use of INDIGO parking facilities',
		relevance: 'Connects a parking operator experience with a digital service.',
		source: 'https://www.indigoneo.com/',
	},
	{
		name: 'Google Maps',
		market: 'Global',
		category: 'Substitute',
		feature: 'General map and place discovery',
		relevance: 'Represents the map-first behavior users may use before a dedicated parking tool.',
		source: 'https://maps.google.com/',
	},
	{
		name: 'Waze',
		market: 'Global',
		category: 'Substitute',
		feature: 'Navigation and arrival planning',
		relevance: 'Represents navigation software that can shape the arrival experience without specializing in parking.',
		source: 'https://www.waze.com/',
	},
];

const risks = [
	{
		name: 'Occupancy data becomes stale',
		impact: 'Drivers may follow a space indicator that is no longer accurate, reducing trust in the map.',
		mitigation: 'Show the data status and last update clearly, keep the experience honest about simulation, and test refresh behavior with facility staff.',
	},
	{
		name: 'Facilities have inconsistent layouts',
		impact: 'A map that does not match the physical space can increase confusion during arrival.',
		mitigation: 'Start with one clearly documented facility layout and validate space numbering with operators before expanding coverage.',
	},
	{
		name: 'Connectivity is unreliable at arrival',
		impact: 'A driver may lose access to the latest parking context at the moment it is needed.',
		mitigation: 'Test the core view on slower connections, preserve a readable last-known state, and label its freshness instead of implying real-time certainty.',
	},
	{
		name: 'The workflow distracts drivers',
		impact: 'Complex interaction while driving could create an unsafe product experience.',
		mitigation: 'Keep the flow glanceable, encourage setup before arrival, and test the interface with a safety-focused review that excludes active driving use.',
	},
];

const opportunities = [
	{
		name: 'Operator occupancy visibility',
		value: 'A shared occupancy view could help facilities communicate availability and spot operational issues earlier.',
		validation: 'Interview operators at one facility and map the current process for collecting and communicating occupancy information.',
	},
	{
		name: 'Facility-specific wayfinding',
		value: 'Clear numbered spaces and facility context could make a parking map more useful than a general map result.',
		validation: 'Run a task test with drivers using a real or accurately documented facility layout and observe whether they identify a target space.',
	},
	{
		name: 'Mexico-focused research layer',
		value: 'Local language, facility types, and arrival constraints could make the product more relevant to the intended market.',
		validation: 'Review the intake questions with Mexican drivers and operators, then record which assumptions need local evidence.',
	},
	{
		name: 'Trust through transparent uncertainty',
		value: 'Explicit data status and limitations could help users understand what the map can and cannot promise.',
		validation: 'Compare two versions of the status language in a usability session and ask users to explain the confidence they place in each.',
	},
];

export default function Research() {
	const [form, setForm] = useState(initialForm);
	const [errors, setErrors] = useState({});
	const [feedback, setFeedback] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const [category, setCategory] = useState('All');
	const [savedResearch, setSavedResearch] = useState([]);
	const [researchLoading, setResearchLoading] = useState(true);
	const [researchError, setResearchError] = useState('');
	const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });
	const normalizedSearch = searchTerm.trim().toLowerCase();
	const filteredSolutions = solutions.filter((solution) => {
		const matchesCategory = category === 'All' || solution.category === category;
		const matchesSearch = !normalizedSearch
			|| solution.name.toLowerCase().includes(normalizedSearch)
			|| solution.feature.toLowerCase().includes(normalizedSearch);
		return matchesCategory && matchesSearch;
	});

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
			setResearchError('Supabase is not configured. Saved research is unavailable.');
			setResearchLoading(false);
			return;
		}

		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
		);

		async function loadResearch() {
			const { data, error } = await supabase
				.from('research_records')
				.select('id, market, facility_type, research_question, created_at')
				.order('created_at', { ascending: false });

			if (error) {
				setResearchError(getSupabaseErrorMessage(error));
			} else {
				setSavedResearch(data || []);
			}

			setResearchLoading(false);
		}

		loadResearch();
	}, []);

	function updateField(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
		setErrors((current) => ({ ...current, [name]: '' }));
		setFeedback('');
	}

	async function submitIntake(event) {
		event.preventDefault();
		const nextErrors = {};

		if (!form.market.trim()) nextErrors.market = 'Enter a city or market.';
		if (!form.facilityType) nextErrors.facilityType = 'Choose a facility type.';
		if (!form.question.trim()) nextErrors.question = 'Enter a research question.';

		setErrors(nextErrors);
		if (Object.keys(nextErrors).length > 0) {
			setFeedback('Complete the required fields before submitting.');
			return;
		}

		setFeedback('');
		if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
			setSaveStatus({ type: 'error', message: 'Supabase is not configured. This research record was not saved.' });
			return;
		}

		setSaveStatus({ type: 'loading', message: 'Saving research record...' });
		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL,
			process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
		);
		const { data, error } = await supabase
			.from('research_records')
			.insert({
				market: form.market.trim(),
				facility_type: form.facilityType,
				research_question: form.question.trim(),
			})
			.select('id, market, facility_type, research_question, created_at')
			.single();

		if (error) {
			setSaveStatus({ type: 'error', message: `Research record was not saved. ${getSupabaseErrorMessage(error)}` });
			return;
		}

		setSavedResearch((current) => [data, ...current]);
		setSaveStatus({ type: 'success', message: 'Research record saved successfully.' });
	}

	return (
		<Page eyebrow="Research" title="The parking problem is an information problem.">
			<div className="grid gap-5 md:grid-cols-3">
				<Card t="User pain" x="Drivers enter busy parking facilities without knowing where open spaces are, creating unnecessary searching, stress, and internal traffic." />
				<Card t="Primary user" x="Drivers visiting schools, malls, hospitals, offices, airports, and event venues with structured parking facilities." />
				<Card t="Research question" x="Can a simple live occupancy map reduce the time and uncertainty involved in finding a parking space?" />
			</div>

			<section className="card mt-10">
				<div>
					<h2>Research intake</h2>
					<p>Define the market and question for this research session. Required fields are marked with an asterisk.</p>
				</div>

				<form onSubmit={submitIntake} className="mt-6 grid gap-5" noValidate>
					<label className="grid gap-2">
						<span className="font-semibold text-white">City / market <span aria-hidden="true">*</span></span>
						<input
							name="market"
							value={form.market}
							onChange={updateField}
							placeholder="e.g. Mexico City"
							aria-invalid={Boolean(errors.market)}
							aria-describedby={errors.market ? 'market-error' : undefined}
							className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
						/>
						{errors.market && <span id="market-error" className="text-sm text-red-300">{errors.market}</span>}
					</label>

					<label className="grid gap-2">
						<span className="font-semibold text-white">Parking facility type <span aria-hidden="true">*</span></span>
						<select
							name="facilityType"
							value={form.facilityType}
							onChange={updateField}
							aria-invalid={Boolean(errors.facilityType)}
							aria-describedby={errors.facilityType ? 'facility-type-error' : undefined}
							className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
						>
							<option value="">Select a facility type</option>
							<option value="shopping-mall">Shopping mall</option>
							<option value="university">University</option>
							<option value="hospital">Hospital</option>
							<option value="office">Office campus</option>
							<option value="airport">Airport</option>
							<option value="event-venue">Event venue</option>
						</select>
						{errors.facilityType && <span id="facility-type-error" className="text-sm text-red-300">{errors.facilityType}</span>}
					</label>

					<label className="grid gap-2">
						<span className="font-semibold text-white">Research question <span aria-hidden="true">*</span></span>
						<textarea
							name="question"
							value={form.question}
							onChange={updateField}
							placeholder="What do you need to learn about parking in this market?"
							rows="4"
							aria-invalid={Boolean(errors.question)}
							aria-describedby={errors.question ? 'question-error' : undefined}
							className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
						/>
						{errors.question && <span id="question-error" className="text-sm text-red-300">{errors.question}</span>}
					</label>

					<div className="flex flex-wrap items-center gap-4">
						<button type="submit" disabled={saveStatus.type === 'loading'}>{saveStatus.type === 'loading' ? 'Saving research...' : 'Save research intake'}</button>
						<p className="text-sm" aria-live="polite" role="status">{feedback}</p>
					</div>
					{saveStatus.message && <p className={saveStatus.type === 'error' ? 'text-sm text-red-300' : 'text-sm text-emerald-300'} aria-live="polite" role={saveStatus.type === 'error' ? 'alert' : 'status'}>{saveStatus.message}</p>}
				</form>
			</section>

			<section className="card mt-10" aria-live="polite">
				<h2>Saved research</h2>
				<p>Research records retrieved from Supabase, kept separate from parking occupancy data.</p>
				{researchError ? (
					<p className="mt-5 text-red-300" role="alert">{researchError}</p>
				) : researchLoading ? (
					<p className="mt-5" role="status">Loading saved research...</p>
				) : savedResearch.length === 0 ? (
					<p className="mt-5" role="status">No saved research records yet. Submit the intake above to create the first record.</p>
				) : (
					<div className="mt-5 grid gap-4 md:grid-cols-2">
						{savedResearch.map((record) => (
							<article key={record.id} className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
								<div className="flex flex-wrap items-center justify-between gap-2">
									<h3 className="font-semibold text-white">{record.market}</h3>
									<time className="text-xs text-slate-400" dateTime={record.created_at}>{new Date(record.created_at).toLocaleString()}</time>
								</div>
								<p className="mt-3 text-sm text-slate-300">{record.facility_type.replaceAll('-', ' ')}</p>
								<p className="mt-2 text-sm leading-6">{record.research_question}</p>
							</article>
						))}
					</div>
				)}
			</section>

			<section className="mt-10">
				<h2 className="text-2xl font-semibold text-white">Global benchmarks</h2>
				<p className="mt-3 max-w-3xl">Documented reference examples for comparison. These are curated sources, not live search results or performance claims.</p>
				<div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{benchmarks.map((benchmark) => (
						<article key={benchmark.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
							<div className="flex items-start justify-between gap-4">
								<h3 className="font-semibold text-white">{benchmark.name}</h3>
								<span className="rounded-full border border-emerald-400/30 px-2 py-1 text-xs text-emerald-300">Benchmark</span>
							</div>
							<p className="mt-3 text-sm text-slate-300">{benchmark.market}</p>
							<p className="mt-3 text-sm leading-6">{benchmark.approach}</p>
							<p className="mt-3 text-sm leading-6"><span className="font-semibold text-white">Park Now relevance:</span> {benchmark.relevance}</p>
							<a className="mt-4 inline-block text-sm text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 hover:text-emerald-200" href={benchmark.source} target="_blank" rel="noreferrer">View documented source</a>
						</article>
					))}
				</div>
			</section>

			<section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
				<h2 className="text-2xl font-semibold text-white">Mexico localization</h2>
				<p className="mt-3 max-w-3xl">Park Now should validate local conditions before adopting patterns from international services. The research focus is on clear location context, reliable facility-level availability, and workflows that remain understandable when connectivity or data coverage is limited.</p>
				<div className="mt-5 grid gap-5 md:grid-cols-3">
					<Card t="Local user needs" x="Test language, arrival habits, payment expectations, and how drivers currently decide whether to enter a facility." />
					<Card t="Infrastructure" x="Check whether facilities have consistent space identifiers, occupancy inputs, connectivity, and staff workflows to support current information." />
					<Card t="Business opportunity" x="Explore operator value in traffic visibility and clearer driver communication without promising availability that cannot be verified." />
				</div>
			</section>

			<section className="mt-10">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold text-white">Competitor comparison</h2>
						<p className="mt-3 max-w-3xl">Compare documented competitors and substitutes. Sources identify the reference product; they are not claims of current availability in Mexico.</p>
					</div>
					<p className="text-sm text-slate-400" aria-live="polite">Showing {filteredSolutions.length} of {solutions.length}</p>
				</div>

				<div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
					<label className="grid gap-2">
						<span className="font-semibold text-white">Search by name or feature</span>
						<input
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="e.g. payments or navigation"
							className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
						/>
					</label>
					<label className="grid gap-2">
						<span className="font-semibold text-white">Category</span>
						<select
							value={category}
							onChange={(event) => setCategory(event.target.value)}
							className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
						>
							<option>All</option>
							<option>Competitor</option>
							<option>Substitute</option>
						</select>
					</label>
				</div>

				<div className="mt-5 overflow-x-auto rounded-2xl border border-white/10">
					<table className="w-full min-w-[900px] text-left text-sm">
						<thead className="bg-white/5 text-xs uppercase tracking-[.12em] text-slate-400">
							<tr>
								<th className="px-4 py-3">Solution</th>
								<th className="px-4 py-3">Market</th>
								<th className="px-4 py-3">Category</th>
								<th className="px-4 py-3">Main feature</th>
								<th className="px-4 py-3">Relevance</th>
								<th className="px-4 py-3">Source</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/10">
							{filteredSolutions.map((solution) => (
								<tr key={solution.name} className="align-top">
									<td className="px-4 py-4 font-semibold text-white">{solution.name}</td>
									<td className="px-4 py-4">{solution.market}</td>
									<td className="px-4 py-4"><span className={solution.category === 'Competitor' ? 'text-emerald-300' : 'text-amber-300'}>{solution.category}</span></td>
									<td className="px-4 py-4">{solution.feature}</td>
									<td className="px-4 py-4">{solution.relevance}</td>
									<td className="px-4 py-4"><a className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 hover:text-emerald-200" href={solution.source} target="_blank" rel="noreferrer">Open source</a></td>
								</tr>
							))}
						</tbody>
					</table>
					{filteredSolutions.length === 0 && <p className="p-6 text-sm text-slate-300" role="status">No documented solutions match this search and category. Try a different name, feature, or category.</p>}
				</div>
			</section>

			<section className="mt-10">
				<h2 className="text-2xl font-semibold text-white">Risk and opportunity map</h2>
				<p className="mt-3 max-w-3xl">Working hypotheses for Park Now research. Each item has a practical next step so the map guides validation rather than presenting assumptions as facts.</p>
				<div className="mt-5 grid gap-5 lg:grid-cols-2">
					<div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-5">
						<h3 className="text-xl font-semibold text-red-200">Risks</h3>
						<div className="mt-5 grid gap-4">
							{risks.map((risk) => (
								<article key={risk.name} className="border-l-2 border-red-300/60 pl-4">
									<h4 className="font-semibold text-white">{risk.name}</h4>
									<p className="mt-2 text-sm leading-6"><span className="font-semibold text-red-200">Impact:</span> {risk.impact}</p>
									<p className="mt-2 text-sm leading-6"><span className="font-semibold text-white">Mitigation:</span> {risk.mitigation}</p>
								</article>
							))}
						</div>
					</div>

					<div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
						<h3 className="text-xl font-semibold text-emerald-200">Opportunities</h3>
						<div className="mt-5 grid gap-4">
							{opportunities.map((opportunity) => (
								<article key={opportunity.name} className="border-l-2 border-emerald-300/60 pl-4">
									<h4 className="font-semibold text-white">{opportunity.name}</h4>
									<p className="mt-2 text-sm leading-6"><span className="font-semibold text-emerald-200">Potential value:</span> {opportunity.value}</p>
									<p className="mt-2 text-sm leading-6"><span className="font-semibold text-white">Next validation step:</span> {opportunity.validation}</p>
								</article>
							))}
						</div>
					</div>
				</div>
			</section>

			<h2 className="mt-10 text-2xl font-semibold text-white">Validation plan</h2>
			<p className="mt-3 max-w-3xl">Test the prototype with at least five external users. Measure whether they can identify an available space, understand the color system, switch parking areas, and explain the value of the product without help.</p>
		</Page>
	);
}

function Card({ t, x }) {
	return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold text-white">{t}</h2><p className="mt-2 text-sm leading-6">{x}</p></div>;
}
