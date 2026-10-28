'use client';

import { useEffect, useRef, useState } from 'react';

export default function CopyButton({ text, label = 'Copy' }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  }

  const text_ = status === 'copied' ? 'Copied!' : status === 'error' ? 'Copy failed' : label;

  return (
    <button
      type="button"
      onClick={copy}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        status === 'copied'
          ? 'border-emerald-400 bg-emerald-400 text-slate-950'
          : status === 'error'
            ? 'border-rose-400 text-rose-300'
            : 'border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10'
      }`}
    >
      <span aria-live="polite">{text_}</span>
    </button>
  );
}
