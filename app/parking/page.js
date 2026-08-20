'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Page from '../../components/Page';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Parking() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadParkingSpaces() {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('id, space_number, status')
        .eq('parking_lot_id', 1)
        .order('space_number', { ascending: true });

      if (!error && data) {
        setSpots(data);
      }

      setLoading(false);
    }

    loadParkingSpaces();

    const channel = supabase
      .channel('parking-spaces-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_spaces',
          filter: 'parking_lot_id=eq.1',
        },
        () => {
          loadParkingSpaces();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const available = useMemo(
    () => spots.filter((spot) => spot.status === 'available').length,
    [spots]
  );

  const occupied = spots.length - available;

  return (
    <Page
      eyebrow="Live Parking"
      title="Central Garage"
      subtitle="Real-time parking availability powered by Supabase."
    >
      <section>
        <div className="status">
          <div>
            <h3>Available</h3>
            <strong>{available}</strong>
          </div>

          <div>
            <h3>Occupied</h3>
            <strong>{occupied}</strong>
          </div>

          <div>
            <h3>Total Spaces</h3>
            <strong>{spots.length}</strong>
          </div>
        </div>

        {loading ? (
          <p>Loading parking availability...</p>
        ) : (
          <div className="parking-grid">
            {spots.map((spot) => (
              <div
                key={spot.id}
                className={`parking-space ${
                  spot.status === 'available' ? 'available' : 'occupied'
                }`}
              >
                {spot.space_number}
              </div>
            ))}
          </div>
        )}
      </section>
    </Page>
  );
}
