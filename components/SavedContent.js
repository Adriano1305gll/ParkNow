'use client';

import { useCallback, useEffect, useState } from 'react';
import CopyButton from './CopyButton';
import { SAVED_EVENT } from './savedContentEvents';
import { loadContent, getContent, deleteContent, formatText, formatCsv } from '../lib/savedContent.mjs';

function download(filename, mime, content) {
  const url = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function SavedContent() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(null);
  const [message, setMessage] = useState('');

  const refresh = useCallback(() => setItems(loadContent(window.localStorage)), []);

  useEffect(() => {
    refresh();
    window.addEventListener(SAVED_EVENT, refresh);
    return () => window.removeEventListener(SAVED_EVENT, refresh);
  }, [refresh]);

  function handleLoad(id) {
    const item = getContent(window.localStorage, id);
    setLoaded(item);
    setMessage(item ? '' : 'That item is no longer in storage.');
  }

  function handleDelete(id) {
    const { items: next, error } = deleteContent(window.localStorage, id);
    setItems(next);
    if (loaded?.id === id) setLoaded(null);
    setMessage(error || 'Deleted.');
  }

  function handleExport(kind) {
    const current = loadContent(window.localStorage);
    if (current.length === 0) {
      setMessage('Nothing to export. Save some content first.');
      return;
    }
    if (kind === 'csv') download('parknow-saved-content.csv', 'text/csv', formatCsv(current));
    else download('parknow-saved-content.txt', 'text/plain', formatText(current));
    setMessage(`Exported ${current.length} item(s).`);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1b30] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-400">
          Saved in this browser only (localStorage). Clearing browser data removes it.
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={() => handleExport('csv')} className="rounded-lg border border-emerald-400/50 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10">
            Export CSV
          </button>
          <button type="button" onClick={() => handleExport('txt')} className="rounded-lg border border-emerald-400/50 px-3 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10">
            Export TXT
          </button>
        </div>
      </div>

      {message && <p role="status" className="mt-3 text-sm text-emerald-300">{message}</p>}

      {items.length === 0 ? (
        <p className="mt-4 text-slate-400">No saved content yet. Use the Save button on any card.</p>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((i) => (
            <li key={i.id} className="rounded-xl border border-white/10 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{i.type}</p>
              <p className="font-semibold text-white">{i.title}</p>
              <p className="text-xs text-slate-400">{i.audience}{i.platform ? ` · ${i.platform}` : ''}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => handleLoad(i.id)} className="rounded-lg border border-emerald-400/50 px-3 py-1 text-sm font-semibold text-emerald-300 hover:bg-emerald-400/10">Load</button>
                <button type="button" onClick={() => handleDelete(i.id)} className="rounded-lg border border-rose-400/50 px-3 py-1 text-sm font-semibold text-rose-300 hover:bg-rose-400/10">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {loaded && (
        <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-4">
          <p className="font-semibold text-white">{loaded.title}</p>
          <p className="mt-2 whitespace-pre-line text-slate-300">{loaded.text}</p>
          <div className="mt-3"><CopyButton text={loaded.text} label="Copy loaded content" /></div>
        </div>
      )}
    </div>
  );
}
