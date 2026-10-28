'use client';

import { useState } from 'react';
import CopyButton from './CopyButton';

export default function ExperimentCard({ experiment, notice }) {
  const [selected, setSelected] = useState('A');
  const [compare, setCompare] = useState(false);
  const keys = ['A', 'B'];
  const isOwner = experiment.audience === 'owner';

  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-[#0b1b30] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold text-white">{experiment.name}</h3>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
            isOwner
              ? 'border-amber-300/40 bg-amber-300/10 text-amber-200'
              : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
          }`}
        >
          {experiment.audienceLabel}
        </span>
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Hypothesis</p>
      <p>{experiment.hypothesis}</p>
      <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Success metric</p>
      <p>{experiment.successMetric}</p>

      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label={`Choose variant for ${experiment.name}`}>
        {keys.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={!compare && selected === k}
            onClick={() => {
              setSelected(k);
              setCompare(false);
            }}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
              !compare && selected === k
                ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                : 'border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10'
            }`}
          >
            {experiment.variants[k].label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={compare}
          onClick={() => setCompare((c) => !c)}
          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
            compare ? 'border-white bg-white text-slate-950' : 'border-white/20 text-slate-200 hover:bg-white/5'
          }`}
        >
          Compare side by side
        </button>
      </div>

      <div className={`mt-4 grid gap-3 ${compare ? 'sm:grid-cols-2' : ''}`}>
        {(compare ? keys : [selected]).map((k) => (
          <div key={k} className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{experiment.variants[k].label}</p>
            <p className="mt-2 text-lg font-semibold text-white">{experiment.variants[k].text}</p>
            <div className="mt-3">
              <CopyButton text={experiment.variants[k].text} label="Copy variant" />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-sm text-amber-100">
        {notice}
      </p>
    </article>
  );
}
