'use client';

import { useEffect, useRef, useState } from 'react';
import { saveContent } from '../lib/savedContent.mjs';
import { SAVED_EVENT } from './savedContentEvents';

export default function SaveButton({ item }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function save() {
    const { error } = saveContent(window.localStorage, item);
    setStatus(error ? 'error' : 'saved');
    window.dispatchEvent(new Event(SAVED_EVENT));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <button
      type="button"
      onClick={save}
      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        status === 'saved'
          ? 'border-emerald-400 bg-emerald-400 text-slate-950'
          : status === 'error'
            ? 'border-rose-400 text-rose-300'
            : 'border-white/20 text-slate-200 hover:bg-white/5'
      }`}
    >
      <span aria-live="polite">{status === 'saved' ? 'Saved!' : status === 'error' ? 'Save failed' : 'Save'}</span>
    </button>
  );
}
