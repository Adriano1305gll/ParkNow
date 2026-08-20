'use client';

import { useState } from 'react';
import Page from '../../components/Page';

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question.trim()) {
      setAnswer('Please enter a question.');
      return;
    }

    setLoading(true);
    setAnswer('');

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAnswer(data.error || 'Unable to answer your question.');
      } else {
        setAnswer(data.answer);
      }
    } catch (error) {
      setAnswer('Unable to connect to the Park Now Assistant.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page
      eyebrow="Park Now Assistant"
      title="Ask about parking."
      subtitle="Get answers using live parking data from Central Garage."
    >
      <section className="card">
        <h2>Parking Assistant</h2>

        <p>
          Ask questions such as “How many spaces are available?” or
          “Where should I park?”
        </p>

        <div style={{ marginTop: '24px' }}>
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !loading) {
                ask();
              }
            }}
            placeholder="Ask about parking availability..."
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #334155',
              background: '#0d1a2b',
              color: 'white',
              marginBottom: '14px',
            }}
          />

          <button onClick={ask} disabled={loading}>
            {loading ? 'Thinking...' : 'Ask Park Now'}
          </button>
        </div>

        {answer && (
          <div
            className="card"
            style={{ marginTop: '24px' }}
          >
            <h3>Assistant</h3>
            <p>{answer}</p>
          </div>
        )}
      </section>
    </Page>
  );
}
