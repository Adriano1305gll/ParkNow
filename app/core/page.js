'use client';

import { useState } from 'react';
import Page from '../../components/Page';

const initialForm = {
  destination: '',
  arrivalTime: '',
  duration: '',
  walkingTime: '',
  budget: '',
  accessibility: 'None',
};

const parkingOptions = [
  {
    name: 'Central Garage',
    costPerHour: 3,
    walkingMinutes: 6,
    accessible: true,
    capacity: 'high',
  },
  {
    name: 'Market Street Lot',
    costPerHour: 2,
    walkingMinutes: 11,
    accessible: true,
    capacity: 'medium',
  },
  {
    name: 'Riverside Overflow',
    costPerHour: 1,
    walkingMinutes: 18,
    accessible: false,
    capacity: 'low',
  },
];

function getEstimatedCost(option, duration) {
  return Math.ceil(duration / 60) * option.costPerHour;
}

function isPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

function buildPlan(form) {
  const duration = Number(form.duration);
  const walkingTime = Number(form.walkingTime);
  const budget = Number(form.budget);
  const accessibleOnly = form.accessibility !== 'None';

  const eligibleOptions = parkingOptions.filter((option) => {
    return (
      option.walkingMinutes <= walkingTime &&
      getEstimatedCost(option, duration) <= budget &&
      (!accessibleOnly || option.accessible)
    );
  });

  const rankedOptions = [...eligibleOptions].sort((first, second) => {
    const firstScore =
      first.walkingMinutes + getEstimatedCost(first, duration) * 2;
    const secondScore =
      second.walkingMinutes + getEstimatedCost(second, duration) * 2;
    return firstScore - secondScore;
  });

  const bestOption = rankedOptions[0];
  const backupOption = rankedOptions[1] || parkingOptions.find(
    (option) => option.name !== bestOption?.name
  );

  if (!bestOption) {
    return {
      unavailable: true,
      backupOption,
      risks: [
        'No simulated option meets every constraint.',
        'Try increasing the budget or maximum walking time.',
      ],
    };
  }

  const reasons = [
    `${bestOption.walkingMinutes} minutes from your destination`,
    `$${getEstimatedCost(bestOption, duration)} estimated cost`,
  ];

  if (accessibleOnly) {
    reasons.push('matches your accessibility requirement');
  }

  return {
    bestOption,
    backupOption,
    estimatedCost: getEstimatedCost(bestOption, duration),
    walkingMinutes: bestOption.walkingMinutes,
    why: `It fits because it offers ${reasons.join(', ')}.`,
    risks: [
      bestOption.capacity === 'low'
        ? 'Lower simulated capacity may make this option less reliable.'
        : 'Availability may change before arrival.',
      'Travel time and final parking charges are not simulated.',
    ],
  };
}

export default function Core() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [plan, setPlan] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  }

  function generatePlan(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.destination.trim()) nextErrors.destination = 'Enter a destination.';
    if (!form.arrivalTime) nextErrors.arrivalTime = 'Choose an arrival time.';
    if (!isPositiveNumber(form.duration)) {
      nextErrors.duration = 'Use a positive number of minutes.';
    }
    if (!isPositiveNumber(form.walkingTime)) {
      nextErrors.walkingTime = 'Use a positive number of minutes.';
    }
    if (!isPositiveNumber(form.budget)) {
      nextErrors.budget = 'Enter a positive budget.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setPlan(null);
      return;
    }

    setPlan(buildPlan(form));
  }

  return (
    <Page
      eyebrow="Generative Core"
      title="Build a parking plan."
      subtitle="Shape a practical parking recommendation from a few arrival constraints."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="card">
          <h2>Trip details</h2>
          <p>Tell Park Now what the arrival needs to support.</p>

          <form onSubmit={generatePlan} className="mt-6 grid gap-5">
            <label className="grid gap-2">
              <span className="font-semibold text-white">Destination</span>
              <input
                name="destination"
                value={form.destination}
                onChange={updateField}
                placeholder="e.g. City Hall"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
              {errors.destination && <span className="text-sm text-red-300">{errors.destination}</span>}
            </label>

            <label className="grid gap-2">
              <span className="font-semibold text-white">Arrival time</span>
              <input
                type="datetime-local"
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={updateField}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
              />
              {errors.arrivalTime && <span className="text-sm text-red-300">{errors.arrivalTime}</span>}
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="font-semibold text-white">Parking duration (minutes)</span>
                <input
                  type="number"
                  min="1"
                  name="duration"
                  value={form.duration}
                  onChange={updateField}
                  placeholder="90"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
                {errors.duration && <span className="text-sm text-red-300">{errors.duration}</span>}
              </label>

              <label className="grid gap-2">
                <span className="font-semibold text-white">Maximum walking time (minutes)</span>
                <input
                  type="number"
                  min="1"
                  name="walkingTime"
                  value={form.walkingTime}
                  onChange={updateField}
                  placeholder="15"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
                {errors.walkingTime && <span className="text-sm text-red-300">{errors.walkingTime}</span>}
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2">
                <span className="font-semibold text-white">Budget</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  name="budget"
                  value={form.budget}
                  onChange={updateField}
                  placeholder="10"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
                />
                {errors.budget && <span className="text-sm text-red-300">{errors.budget}</span>}
              </label>

              <label className="grid gap-2">
                <span className="font-semibold text-white">Accessibility needs</span>
                <select
                  name="accessibility"
                  value={form.accessibility}
                  onChange={updateField}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-emerald-400"
                >
                  <option>None</option>
                  <option>Step-free access</option>
                  <option>Accessible parking space</option>
                </select>
              </label>
            </div>

            <button type="submit" className="mt-2 w-full sm:w-fit">
              Generate parking plan
            </button>
          </form>
        </section>

        <section className="card" aria-live="polite">
          <h2>Your recommendation</h2>
          {!plan ? (
            <div className="border-l-2 border-emerald-400/60 pl-4">
              <p>Complete the trip details to generate a simulated parking plan.</p>
            </div>
          ) : plan.unavailable ? (
            <div className="grid gap-6">
              <div>
                <h3 className="text-red-200">No exact match yet</h3>
                <p>No simulated parking option meets all of your requirements.</p>
              </div>
              <div>
                <h3>Backup option</h3>
                <p>{plan.backupOption?.name || 'No backup option available'}</p>
              </div>
              <div>
                <h3>Risks</h3>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {plan.risks.map((risk) => <li key={risk}>{risk}</li>)}
                </ul>
              </div>
              <p className="border-t border-white/10 pt-4 text-sm text-emerald-200">
                Prototype recommendation; availability is simulated.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              <div>
                <p className="mb-1 text-sm font-semibold uppercase tracking-[.15em] text-emerald-400">Best option</p>
                <h3 className="text-2xl font-bold text-white">{plan.bestOption.name}</h3>
              </div>
              <div>
                <h3>Why it fits</h3>
                <p>{plan.why}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <h3 className="text-base">Estimated cost</h3>
                  <strong className="text-2xl text-white">${plan.estimatedCost}</strong>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/40 p-4">
                  <h3 className="text-base">Walking minutes</h3>
                  <strong className="text-2xl text-white">{plan.walkingMinutes}</strong>
                </div>
              </div>
              <div>
                <h3>Backup option</h3>
                <p>{plan.backupOption?.name || 'No backup option available'}</p>
              </div>
              <div>
                <h3>Risks</h3>
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {plan.risks.map((risk) => <li key={risk}>{risk}</li>)}
                </ul>
              </div>
              <p className="border-t border-white/10 pt-4 text-sm text-emerald-200">
                Prototype recommendation; availability is simulated.
              </p>
            </div>
          )}
        </section>
      </div>
    </Page>
  );
}
