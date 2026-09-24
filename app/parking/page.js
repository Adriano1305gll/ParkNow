'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Page from '../../components/Page';

export default function Parking() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configurationError, setConfigurationError] = useState(false);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      setConfigurationError(true);
      setLoading(false);
      return;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

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
        {configurationError ? (
          <div className="card" role="alert">
            <h2>Parking data unavailable</h2>
            <p>Supabase is not configured. Add the required environment variables to load current availability.</p>
          </div>
        ) : loading ? (
          <p className="card" role="status">Loading parking availability...</p>
        ) : spots.length === 0 ? (
          <div className="card" role="status">
            <h2>No parking data available</h2>
            <p>The parking service returned no spaces for Central Garage.</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </section>
    </Page>
  );
}
