"use client";

import { useState } from 'react';
import Page from '../../components/Page';

const initialForm = { market: '', facilityType: '', question: '' };

export default function Research() {
	const [form, setForm] = useState(initialForm);
	const [errors, setErrors] = useState({});
	const [feedback, setFeedback] = useState('');

	function updateField(event) {
		const { name, value } = event.target;
		setForm((current) => ({ ...current, [name]: value }));
		setErrors((current) => ({ ...current, [name]: '' }));
		setFeedback('');
	}

	function submitIntake(event) {
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

		setFeedback('Research intake submitted for this session. It has not been saved yet.');
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
						<button type="submit">Submit research intake</button>
						<p className="text-sm" aria-live="polite" role="status">{feedback}</p>
					</div>
				</form>
			</section>

			<h2 className="mt-10 text-2xl font-semibold text-white">Validation plan</h2>
			<p className="mt-3 max-w-3xl">Test the prototype with at least five external users. Measure whether they can identify an available space, understand the color system, switch parking areas, and explain the value of the product without help.</p>
		</Page>
	);
}

function Card({ t, x }) {
	return <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold text-white">{t}</h2><p className="mt-2 text-sm leading-6">{x}</p></div>;
}
