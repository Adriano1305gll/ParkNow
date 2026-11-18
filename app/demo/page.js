'use client';

import { useState } from 'react';
import Link from 'next/link';
import Page from '../../components/Page';
import { isPositiveNumber } from '../../lib/parkingPlanner.mjs';
import { MAX_CUSTOMERS, parseCustomers } from '../../lib/pricingScenarios.mjs';
import { validateMessage } from '../../lib/chatRules.mjs';

const initialTrip = {
  destination: 'City Hall',
  arrivalTime: '2026-12-01T18:00',
  duration: '90',
  walkingTime: '15',
  budget: '10',
  accessibility: 'None',
};

const initialCounts = { Basic: '20', Pro: '10', Enterprise: '3' };

const features = [
  ['/parking', 'Parking snapshot', 'Explore the existing parking-space view.'],
  ['/core', 'Plan a trip', 'Generate and optionally save a deterministic recommendation.'],
  ['/chat', 'Chat', 'Try the existing rule-based assistant and saved chat flow.'],
  ['/assistant', 'AI assistant', 'Open the separate existing assistant feature.'],
  ['/dashboard', 'Dashboard', 'Review the existing operator and research summary.'],
  ['/pricing', 'Pricing', 'Use the existing subscription pricing simulator.'],
  ['/research', 'Research', 'Explore the existing feedback and research forms.'],
  ['/docs', 'Documentation', 'Read the existing product and technical documentation.'],
];

function AgentStatus({ status }) {
  const styles = status === 'completed'
    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
    : status === 'failed'
      ? 'border-red-400/40 bg-red-400/10 text-red-200'
      : 'border-amber-300/40 bg-amber-300/10 text-amber-100';

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles}`}>
      {status}
    </span>
  );
}

function AgentOutput({ record }) {
  if (record.status !== 'completed') {
    return <p className="text-sm text-amber-100">{record.output.message}</p>;
  }

  if (record.agentId === 'parking-planner') {
    const { plan, occupancyContext } = record.output;
    return (
      <div className="grid gap-4">
        {plan.unavailable ? (
          <div>
            <h4 className="font-semibold text-white">No exact simulated match</h4>
            <p>No hard-coded option meets every submitted constraint.</p>
            {plan.backupOption && <p>Fallback option: {plan.backupOption.name}</p>}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            <p><span className="text-white">Suggested option:</span> {plan.bestOption.name}</p>
            <p><span className="text-white">Estimated cost:</span> ${plan.estimatedCost}</p>
            <p><span className="text-white">Walking time:</span> {plan.walkingMinutes} minutes</p>
            <p><span className="text-white">Backup:</span> {plan.backupOption?.name || 'Not available'}</p>
          </div>
        )}
        {plan.why && <p>{plan.why}</p>}
        <div className="rounded-xl border border-amber-300/30 bg-amber-300/5 p-4">
          <p className="font-bold uppercase tracking-wide text-amber-100">SIMULATED / UNVERIFIED</p>
          <p className="mt-1 text-sm">
            Occupancy source status: <strong>{occupancyContext.sourceStatus}</strong>.
            {occupancyContext.counts
              ? ` Database rows labeled available: ${occupancyContext.counts.available}; rows labeled occupied: ${occupancyContext.counts.occupied}.`
              : ' No occupancy counts are being reported.'}
          </p>
          {occupancyContext.message && <p className="mt-1 text-sm">{occupancyContext.message}</p>}
          <p className="mt-1 text-sm">
            Snapshot relationship: <code>{occupancyContext.facilityRelation}</code>. It is not verified real-time availability and is not mapped to the suggested option.
          </p>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {plan.risks.map((risk) => <li key={risk}>{risk}</li>)}
        </ul>
      </div>
    );
  }

  if (record.agentId === 'chat-guide') {
    const { output } = record;
    return (
      <div className="grid gap-3">
        <p><span className="text-white">Intent:</span> {output.intent}</p>
        <p>{output.answer}</p>
        <p className="text-sm">{output.dataNotice}</p>
        {output.humanHelp && <p className="font-semibold text-amber-100">Human help is needed for this question.</p>}
      </div>
    );
  }

  const { counts, monthlyRevenueMxn, annualRevenueMxn, assumptions, dataBasis } = record.output;
  const currency = new Intl.NumberFormat('en-US');
  return (
    <div className="grid gap-3">
      <p className="font-bold text-white">
        Hypothetical: MXN {currency.format(monthlyRevenueMxn)} / month · MXN {currency.format(annualRevenueMxn)} / year
      </p>
      <p>Assumed customers — Basic: {counts.Basic}, Pro: {counts.Pro}, Enterprise: {counts.Enterprise}</p>
      <ul className="list-disc space-y-1 pl-5 text-sm">
        {assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
      </ul>
      <p className="text-sm">{dataBasis}</p>
    </div>
  );
}

function AgentCard({ record, name, inputSummary }) {
  return (
    <article className="card min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.15em] text-emerald-300">{record.agentId}</p>
          <h3 className="mt-1 text-xl font-bold text-white">{name}</h3>
        </div>
        <AgentStatus status={record.status} />
      </div>
      <p className="mt-4 text-sm">
        <span className="font-semibold text-white">Received from:</span>{' '}
        {record.consumedFrom.length ? record.consumedFrom.join(' → ') : 'User trip request'}
      </p>
      <p className="mt-2 text-sm"><span className="font-semibold text-white">Input summary:</span> {inputSummary}</p>
      <div className="mt-4 border-t border-white/10 pt-4">
        <AgentOutput record={record} />
      </div>
    </article>
  );
}

function FieldError({ id, children }) {
  return <span id={id} role="alert" className="text-sm text-red-200">{children || ''}</span>;
}

export default function Demo() {
  const [trip, setTrip] = useState(initialTrip);
  const [question, setQuestion] = useState('Is there parking available right now?');
  const [counts, setCounts] = useState(initialCounts);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [formError, setFormError] = useState('');
  const [running, setRunning] = useState(false);

  function clearPreviousRun() {
    setResult(null);
    setFormError('');
  }

  function updateTrip(event) {
    const { name, value } = event.target;
    setTrip((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    clearPreviousRun();
  }

  function updateCount(event) {
    const { name, value } = event.target;
    setCounts((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    clearPreviousRun();
  }

  function validateForm() {
    const nextErrors = {};
    if (!trip.destination.trim()) nextErrors.destination = 'Enter a destination.';
    if (trip.destination.trim().length > 120) nextErrors.destination = 'Use 120 characters or fewer.';
    if (!trip.arrivalTime) nextErrors.arrivalTime = 'Choose an arrival time.';
    if (!isPositiveNumber(trip.duration)) nextErrors.duration = 'Use a positive number of minutes.';
    if (!isPositiveNumber(trip.walkingTime)) nextErrors.walkingTime = 'Use a positive number of minutes.';
    if (!isPositiveNumber(trip.budget)) nextErrors.budget = 'Enter a positive budget.';
    const message = validateMessage(question);
    if (!message.ok) nextErrors.question = message.error;

    for (const plan of ['Basic', 'Pro', 'Enterprise']) {
      const count = parseCustomers(counts[plan]);
      if (count === null || count > MAX_CUSTOMERS) {
        nextErrors[plan] = `Enter a whole number from 0 to ${MAX_CUSTOMERS}.`;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function runDemo(event) {
    event.preventDefault();
    clearPreviousRun();
    if (!validateForm()) return;

    setRunning(true);
    try {
      const response = await fetch('/api/demo/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip: {
            ...trip,
            destination: trip.destination.trim(),
            duration: Number(trip.duration),
            walkingTime: Number(trip.walkingTime),
            budget: Number(trip.budget),
          },
          question,
          ownerScenario: Object.fromEntries(
            Object.entries(counts).map(([plan, count]) => [plan, parseCustomers(count)]),
          ),
        }),
      });

      let payload;
      try {
        payload = await response.json();
      } catch {
        setFormError('The orchestration endpoint returned an unreadable response. Please try again.');
        return;
      }

      if (Array.isArray(payload.agents)) setResult(payload);
      if (!response.ok) {
        setFormError(payload.error || 'One or more agents could not complete this run.');
      }
    } catch {
      setFormError('Could not reach the orchestration endpoint. Check your connection and try again.');
    } finally {
      setRunning(false);
    }
  }

  const orderedAgents = result?.agents || [];
  const inputSummaries = {
    'parking-planner':
      `${trip.destination}, ${trip.duration} minutes, ${trip.walkingTime}-minute walk limit, $${trip.budget} budget.`,
    'chat-guide':
      `Question: “${question}” plus the actual Parking Planner output.`,
    'venture-viability':
      `Basic ${counts.Basic}, Pro ${counts.Pro}, Enterprise ${counts.Enterprise} assumptions plus planner and chat outputs.`,
  };
  const agentNames = {
    'parking-planner': 'Parking Planner',
    'chat-guide': 'Chat Guide',
    'venture-viability': 'Venture Viability',
  };

  return (
    <Page
      eyebrow="Week 6 · Integrated Agentic Venture"
      title="See how ParkNow works."
      subtitle="Run a guided driver and operator scenario through three deterministic agents that reuse real ParkNow logic and show their data handoffs."
    >
      <div className="grid gap-8">
        <section className="rounded-2xl border border-amber-300/40 bg-amber-300/5 p-5" aria-label="Availability disclosure">
          <p className="font-bold uppercase tracking-[.12em] text-amber-100">Prototype · simulated / unverified occupancy</p>
          <p className="mt-2">
            This demo does not verify real-time availability, reserve a space, or change occupancy. Any parking recommendation is generated from hard-coded prototype options; a database snapshot is separate context only.
          </p>
        </section>

        <nav className="card" aria-label="Guided walkthrough">
          <h2 className="text-2xl font-bold text-white">Guided walkthrough</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3">
            <li><a className="text-emerald-300 underline underline-offset-4" href="#run-workflow">1. Enter one example</a></li>
            <li><a className="text-emerald-300 underline underline-offset-4" href="#agent-map">2. Inspect agent handoffs</a></li>
            <li><a className="text-emerald-300 underline underline-offset-4" href="#impact">3. Review impact and limits</a></li>
          </ol>
        </nav>

        <section id="run-workflow" className="card">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-emerald-300">Interactive walkthrough</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Run the three-agent demo</h2>
            </div>
            <p className="max-w-xl text-sm">The example is prefilled. Edit any field and submit to execute the server-side workflow.</p>
          </div>

          <form onSubmit={runDemo} noValidate className="mt-6 grid gap-7">
            <fieldset className="grid gap-4">
              <legend className="mb-2 font-bold text-white">Trip request</legend>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="font-semibold text-white">Destination</span>
                  <input id="destination" name="destination" value={trip.destination} onChange={updateTrip} aria-invalid={Boolean(errors.destination)} aria-describedby="destination-error" className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                  <FieldError id="destination-error">{errors.destination}</FieldError>
                </label>
                <label className="grid gap-2">
                  <span className="font-semibold text-white">Arrival time</span>
                  <input id="arrivalTime" type="datetime-local" name="arrivalTime" value={trip.arrivalTime} onChange={updateTrip} aria-invalid={Boolean(errors.arrivalTime)} aria-describedby="arrivalTime-error" className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                  <FieldError id="arrivalTime-error">{errors.arrivalTime}</FieldError>
                </label>
                <label className="grid gap-2">
                  <span className="font-semibold text-white">Duration (minutes)</span>
                  <input id="duration" type="number" min="1" name="duration" value={trip.duration} onChange={updateTrip} aria-invalid={Boolean(errors.duration)} aria-describedby="duration-error" className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                  <FieldError id="duration-error">{errors.duration}</FieldError>
                </label>
                <label className="grid gap-2">
                  <span className="font-semibold text-white">Maximum walking time (minutes)</span>
                  <input id="walkingTime" type="number" min="1" name="walkingTime" value={trip.walkingTime} onChange={updateTrip} aria-invalid={Boolean(errors.walkingTime)} aria-describedby="walkingTime-error" className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                  <FieldError id="walkingTime-error">{errors.walkingTime}</FieldError>
                </label>
                <label className="grid gap-2">
                  <span className="font-semibold text-white">Budget (USD)</span>
                  <input id="budget" type="number" min="0.01" step="0.01" name="budget" value={trip.budget} onChange={updateTrip} aria-invalid={Boolean(errors.budget)} aria-describedby="budget-error" className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                  <FieldError id="budget-error">{errors.budget}</FieldError>
                </label>
                <label className="grid gap-2">
                  <span className="font-semibold text-white">Accessibility need</span>
                  <select id="accessibility" name="accessibility" value={trip.accessibility} onChange={updateTrip} aria-label="Accessibility need" className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400">
                    <option>None</option>
                    <option>Step-free access</option>
                    <option>Accessible parking space</option>
                  </select>
                </label>
              </div>
            </fieldset>

            <fieldset className="grid gap-3">
              <legend className="font-bold text-white">Parking question</legend>
              <label htmlFor="question">Ask the existing rule-based chat guide (300 characters maximum)</label>
              <textarea id="question" value={question} maxLength={300} onChange={(event) => { setQuestion(event.target.value); setErrors((current) => ({ ...current, question: '' })); clearPreviousRun(); }} aria-invalid={Boolean(errors.question)} aria-describedby="question-error question-count" rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <FieldError id="question-error">{errors.question}</FieldError>
                <span id="question-count">{question.length}/300</span>
              </div>
            </fieldset>

            <fieldset className="grid gap-4">
              <legend className="font-bold text-white">Owner scenario · hypothetical customer counts</legend>
              <p className="text-sm">These are assumptions for the existing illustrative pricing formula, not actual ParkNow customers.</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {['Basic', 'Pro', 'Enterprise'].map((plan) => (
                  <label key={plan} className="grid gap-2">
                    <span className="font-semibold text-white">{plan} customers</span>
                    <input type="number" min="0" max={MAX_CUSTOMERS} step="1" name={plan} value={counts[plan]} onChange={updateCount} aria-label={`${plan} customers`} aria-invalid={Boolean(errors[plan])} aria-describedby={`${plan}-error`} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400" />
                    <FieldError id={`${plan}-error`}>{errors[plan]}</FieldError>
                  </label>
                ))}
              </div>
            </fieldset>

            {formError && <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-red-100">{formError}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={running} className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60">
                {running ? 'Running the three-agent workflow…' : 'Run three-agent demo'}
              </button>
              <span className="text-sm">No agent runs until all inputs pass validation.</span>
            </div>
          </form>
        </section>

        <section id="agent-map" className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-emerald-300">Agent map</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Three agents, one coordinated demo</h2>
            <p className="mt-2 max-w-3xl">Existing deterministic features are reused by new Week 6 agent wrappers. These are not LLM-based autonomous agents.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ['Parking Planner', 'Existing /core planner + /parking read pattern', 'New wrapper sends plan and separate occupancy context.'],
              ['Chat Guide', 'Existing getChatReply rule engine', 'New wrapper consumes the actual planner result; no chat persistence call.'],
              ['Venture Viability', 'Existing pricing calculation', 'New wrapper consumes planner + chat outputs and calculates a hypothetical scenario.'],
            ].map(([name, existing, responsibility], index) => (
              <article className="card" key={name}>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Step {index + 1} · new orchestration</p>
                <h3 className="mt-2 text-xl font-bold text-white">{name}</h3>
                <p className="mt-3 text-sm"><span className="font-semibold text-white">Existing logic:</span> {existing}</p>
                <p className="mt-2 text-sm"><span className="font-semibold text-white">Week 6 handoff:</span> {responsibility}</p>
              </article>
            ))}
          </div>
          <p className="text-center font-semibold text-emerald-200">
            User input → Parking Planner → plan + occupancy status → Chat Guide → answer + intent → Venture Viability → integrated result
          </p>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.16em] text-emerald-300">Execution trace</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Agent results and exchanged data</h2>
            </div>
            {result?.runId && <p className="text-sm">Run ID: <code>{result.runId}</code></p>}
          </div>
          {running && <p role="status" aria-live="polite">Running the three-agent workflow. Results will appear when the request completes.</p>}
          {orderedAgents.length ? (
            <div className="grid gap-4 lg:grid-cols-3" aria-live="polite">
              {orderedAgents.map((record) => (
                <AgentCard key={record.agentId} record={record} name={agentNames[record.agentId] || record.agentId} inputSummary={inputSummaries[record.agentId]} />
              ))}
            </div>
          ) : !running ? (
            <p className="card">No agent has run in this page session yet. Submit the form above to see actual execution results.</p>
          ) : null}
          {result?.status === 'completed' && (
            <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4 text-emerald-100">
              All three agents completed in sequence. This run exists only in this page session; it is not saved.
            </p>
          )}
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-white">Explore existing ParkNow features</h2>
          <p className="mt-2">These routes work independently of the new Week 6 orchestrator.</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(([href, label, description]) => (
              <li key={href} className="rounded-xl border border-white/10 p-4">
                <Link className="font-semibold text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 hover:text-emerald-200" href={href}>{label}</Link>
                <p className="mt-2 text-sm">{description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-white/10 pt-4 text-sm">
            <p><strong className="text-white">Saved results:</strong> orchestration runs are not saved. `/core` can save trip outputs, `/research` saves research records, `/chat` saves conversations when configured, and `/pricing` stores scenarios in this browser only.</p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <article className="card">
            <h2 className="text-2xl font-bold text-white">Example input and output</h2>
            <p className="mt-3"><strong className="text-white">Input:</strong> City Hall · 90 minutes · 15-minute walk · $10 budget · no accessibility filter.</p>
            <p className="mt-3"><strong className="text-white">Planner:</strong> Central Garage · $6 estimate · 6-minute walk · Market Street Lot backup.</p>
            <p className="mt-3"><strong className="text-white">Viability:</strong> with hypothetical counts of 20 / 10 / 3, the existing formula yields MXN 36,967/month and MXN 443,604/year.</p>
            <p className="mt-3 text-amber-100">These deterministic examples are not verified parking availability or actual revenue.</p>
          </article>

          <article className="card">
            <h2 className="text-2xl font-bold text-white">Testing evidence</h2>
            <ul className="mt-4 grid gap-3">
              <li><span className="font-semibold text-emerald-200">Automated:</span> planner, agent handoffs, invalid input, and failure-blocking cases are implemented; final full-suite result is recorded in the submission evidence.</li>
              <li><span className="font-semibold text-amber-100">External users:</span> five sessions are planned; no participant results are claimed yet.</li>
              <li><span className="font-semibold text-amber-100">Full-site regression:</span> checklist is in the Week 6 submission; manual checks remain evidence-gated.</li>
              <li><span className="font-semibold text-amber-100">Preview deployments:</span> two successful deployments are recorded; Vercel SSO blocked hosted `/demo` verification.</li>
            </ul>
            <Link href="/docs" className="mt-4 inline-block text-emerald-300 underline underline-offset-4">Review current documentation</Link>
          </article>
        </section>

        <section id="impact" className="grid gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-emerald-300">Impact & viability</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Practical value, with evidence boundaries</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="card">
              <h3 className="text-xl font-bold text-white">Potential impact · hypotheses</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Drivers may find options and cost assumptions easier to understand.</li>
                <li>Operators may find the dashboard and pricing simulator useful for exploring workflows.</li>
                <li>Better-informed choices could reduce unnecessary circulation, but no time, traffic, or emissions benefit has been measured.</li>
              </ul>
            </article>
            <article className="card">
              <h3 className="text-xl font-bold text-white">Risks and mitigations</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Outdated or simulated occupancy can mislead; disclose uncertainty and do not guarantee a space.</li>
                <li>Hard-coded options and prices may not reflect a real lot; verify with operators before relying on them.</li>
                <li>Revenue scenarios omit churn, costs, discounts, taxes, and validated demand; label every result hypothetical.</li>
                <li>Do not use the interface while driving; validate accessibility and wayfinding details with operators.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl font-bold text-white">Version 2 roadmap · conditional</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5">
            <li>Complete five external-user sessions and prioritize observed driver/operator confusion.</li>
            <li>Establish a documented occupancy data owner, source, update cadence, stale-data policy, and verification before any real-time claim.</li>
            <li>Validate accessibility, layout, and wayfinding information with facilities and users.</li>
            <li>Define a baseline and pilot metrics before evaluating time, traffic, environmental, or commercial outcomes.</li>
            <li>Review privacy, authorization, operating support, and payment requirements before proposing expanded integrations.</li>
          </ol>
          <p className="mt-4 text-sm">Roadmap items are hypotheses for future approval, not current product capabilities.</p>
        </section>
      </div>
    </Page>
  );
}
