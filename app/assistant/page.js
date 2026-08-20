'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Page from '../../components/Page';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Assistant() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [spots, setSpots] = useState([]);

  async function loadData() {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('space_number, status')
      .eq('parking_lot_id', 1)
      .order('space_number', { ascending: true });

    if (!error && data) {
      setSpots(data);
    }
  }

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('assistant-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_spaces',
          filter: 'parking_lot_id=eq.1',
        },
        loadData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function ask() {
    const q = question.toLowerCase().trim();

    const availableSpots = spots.filter(
      (spot) => spot.status === 'available'
    );

    const occupiedSpots = spots.filter(
      (spot) => spot.status === 'occupied'
    );

    const occupancyRate =
      spots.length > 0
        ? Math.round((occupiedSpots.length / spots.length) * 100)
        : 0;

    if (!q) {
      setAnswer('Please enter a question.');
    } else if (q.includes('available')) {
      setAnswer(
        `${availableSpots.length} parking spaces are currently available. Available spaces include: ${availableSpots
          .map((spot) => spot.space_number)
          .join(', ')}.`
      );
    } else if (q.includes('occupied')) {
      setAnswer(
        `${occupiedSpots.length} parking spaces are currently occupied.`
      );
    } else if (q.includes('total')) {
      setAnswer(`Central Garage currently has ${spots.length} total spaces.`);
    } else if (
      q.includes('occupancy') ||
      q.includes('percentage') ||
      q.includes('percent')
    ) {
      setAnswer(`The current occupancy rate is ${occupancyRate}%.`);
    } else if (
      q.includes('best') ||
      q.includes('where') ||
      q.includes('park')
    ) {
      if (availableSpots.length > 0) {
        setAnswer(
          `Space ${availableSpots[0].space_number} is currently available. You can also choose spaces ${availableSpots
            .slice(1, 5)
            .map((spot) => spot.space_number)
            .join(', ')}.`
        );
      } else {
        setAnswer('There are currently no available parking spaces.');
      }
    } else {
      setAnswer(
        'I can help with current availability, occupied spaces, total spaces, occupancy rate, and parking recommendations.'
      );
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
              if (event.key === 'Enter') ask();
            }}
            placeholder="Ask about parking availability..."
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid #334155',
              background: '#0d1a2b',
              color: 'white',
              marginBottom: '14px'
            }}
          />

          <button onClick={ask}>Ask Park Now</button>
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
