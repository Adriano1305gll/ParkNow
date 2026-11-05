'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AVAILABILITY_NOTE,
  MAX_MESSAGE_LENGTH,
  STARTER_QUESTIONS,
  getChatReply,
} from '../../lib/chatRules.mjs';

const MAX_COMMENT = 500;

function Feedback({ message, conversationId }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const id = message.messageId;

  if (!message.saved) {
    return (
      <p className="mt-3 text-xs text-slate-400">
        Feedback is unavailable because this answer was not saved.
      </p>
    );
  }

  async function submit(e) {
    e.preventDefault();
    if (!rating || status !== 'idle') return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/chat/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: id, conversationId: message.conversationId, rating, comment }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.saved) {
        setStatus('done');
      } else if (res.status === 409) {
        setStatus('done');
      } else {
        setError(data.error || 'Feedback could not be saved. Please try again.');
        setStatus('idle');
      }
    } catch {
      setError('Network error. Feedback was not saved. Please try again.');
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <p role="status" className="mt-3 text-sm text-emerald-300">
        Thanks! Your feedback was saved.
      </p>
    );
  }

  const btn = (value, label, icon) => (
    <button
      type="button"
      aria-pressed={rating === value}
      aria-label={label}
      onClick={() => setRating(value)}
      disabled={status === 'sending'}
      className={`min-h-[44px] min-w-[44px] rounded-lg border px-3 py-1 text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:opacity-50 ${
        rating === value ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600 hover:bg-white/10'
      }`}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );

  return (
    <form onSubmit={submit} className="mt-3 border-t border-slate-600/60 pt-2" aria-label="Rate this answer">
      <div className="flex items-center gap-2" role="group" aria-label="Was this answer helpful?">
        <span className="text-xs text-slate-300">Helpful?</span>
        {btn('up', 'Helpful answer', '👍')}
        {btn('down', 'Not helpful answer', '👎')}
      </div>
      {rating && (
        <div className="mt-2">
          <label htmlFor={`fb-${id}`} className="block text-xs text-slate-300">
            Optional comment
          </label>
          <textarea
            id={`fb-${id}`}
            value={comment}
            maxLength={MAX_COMMENT}
            rows={2}
            onChange={(e) => setComment(e.target.value)}
            disabled={status === 'sending'}
            className="mt-1 w-full rounded-lg border border-slate-600 bg-[#07111f] px-2 py-1 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-1 min-h-[44px] rounded-lg bg-emerald-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send feedback'}
          </button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const endRef = useRef(null);
  const requestId = useRef(0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  async function send(text) {
    if (loading) return;
    const local = getChatReply(text);
    if (!local.ok) {
      setError(local.error);
      return;
    }
    setError('');
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: text.trim() }]);
    setLoading(true);
    const current = ++requestId.current;
    let reply;
    try {
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), conversationId }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.answer) {
        reply = data;
      } else if (res.status === 404) {
        reply = { ...local, saved: false, saveError: 'This conversation could not be found. Start a new chat to save again.' };
      } else {
        reply = { ...local, saved: false, saveError: 'Could not save this conversation.' };
      }
    } catch {
      reply = { ...local, saved: false, saveError: 'Network error. This conversation was not saved.' };
    }
    if (current !== requestId.current) return;
    if (reply.saved && reply.conversationId) setConversationId(reply.conversationId);
    setMessages((m) => [...m, { role: 'bot', ...reply }]);
    setLoading(false);
  }

  function reset() {
    requestId.current++;
    setMessages([]);
    setLoading(false);
    setError('');
    setInput('');
    setConversationId(null);
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[.2em] text-emerald-400">
        ParkNow Assistant
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">Ask about parking.</h1>
      <p className="mt-3 text-slate-300">
        Guided, rule-based answers for drivers. No live parking data is used.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-700 bg-[#0d1a2b]">
        <div className="flex items-center justify-between border-b border-slate-700 bg-[#0b2545] px-4 py-3">
          <span className="font-semibold">PARK <span className="text-emerald-400">NOW</span> Assistant</span>
          <button
            type="button"
            onClick={reset}
            disabled={messages.length === 0 && !loading}
            className="rounded-lg px-3 py-1 text-sm text-slate-200 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:opacity-40"
          >
            New chat
          </button>
        </div>

        <div
          role="log"
          aria-live="polite"
          aria-label="Chat conversation"
          className="flex min-h-[320px] max-h-[55vh] flex-col gap-3 overflow-y-auto p-4"
        >
          {messages.length === 0 && !loading && (
            <div className="my-auto text-center text-slate-300">
              <p className="font-semibold text-white">Welcome to ParkNow.</p>
              <p className="mt-1 text-sm">Pick a question below or type your own.</p>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-emerald-500 px-4 py-2 text-slate-950">
                {m.text}
              </div>
            ) : (
              <div key={i} className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-[#16304f] px-4 py-3 text-slate-100">
                <p>{m.answer}</p>
                {m.simulated && (
                  <p className="mt-2 rounded-md border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-xs text-amber-200">
                    {AVAILABILITY_NOTE}
                  </p>
                )}
                {m.saved === false && m.saveError && (
                  <p className="mt-2 text-xs text-amber-200">{m.saveError}</p>
                )}
                {m.humanHelp && (
                  <p className="mt-2 text-sm">
                    <a
                      href="mailto:support@parknow.example?subject=ParkNow%20question"
                      className="font-semibold text-emerald-300 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
                    >
                      Contact a human (opens your email app)
                    </a>
                  </p>
                )}
                <Feedback message={m} conversationId={conversationId} />
              </div>
            )
          )}

          {loading && (
            <div role="status" className="self-start rounded-2xl bg-[#16304f] px-4 py-2 text-sm text-slate-300">
              ParkNow Assistant is typing…
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-slate-700 p-4">
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Starter questions">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                disabled={loading}
                className="rounded-full border border-emerald-500/60 px-3 py-1.5 text-left text-sm text-emerald-200 hover:bg-emerald-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              maxLength={MAX_MESSAGE_LENGTH + 1}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'chat-error' : undefined}
              className="min-w-0 flex-1 rounded-xl border border-slate-600 bg-[#07111f] px-3 py-2 text-white placeholder:text-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
          {error && (
            <p id="chat-error" role="alert" className="mt-2 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
