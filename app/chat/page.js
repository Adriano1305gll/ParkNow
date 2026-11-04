'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AVAILABILITY_NOTE,
  MAX_MESSAGE_LENGTH,
  STARTER_QUESTIONS,
  getChatReply,
} from '../../lib/chatRules.mjs';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function send(text) {
    if (loading) return;
    const reply = getChatReply(text);
    if (!reply.ok) {
      setError(reply.error);
      return;
    }
    setError('');
    setInput('');
    setMessages((m) => [...m, { role: 'user', text: text.trim() }]);
    setLoading(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { role: 'bot', ...reply }]);
      setLoading(false);
    }, 400);
  }

  function reset() {
    clearTimeout(timer.current);
    setMessages([]);
    setLoading(false);
    setError('');
    setInput('');
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
