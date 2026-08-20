'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Page from '../../components/Page';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
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

  useEffect(() => {
    loadData();

    const channel = supabase
      .channel('dashboard-live')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'parking_spaces',
          filter: 'parking_lot_id=eq.1',
        },
        () => {
          loadData();
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

  const occupancyRate =
    spots.length > 0
      ? Math.round((occupied / spots.length) * 100)
      : 0;

  return (
    <Page
      eyebrow="Operations Dashboard"
      title="Parking Analytics"
      subtitle="Live parking statistics powered by Supabase."
    >
      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <section className="status">
            <div>
              <h3>Total Spaces</h3>
              <strong>{spots.length}</strong>
            </div>

            <div>
              <h3>Available</h3>
              <strong>{available}</strong>
            </div>

            <div>
              <h3>Occupied</h3>
              <strong>{occupied}</strong>
            </div>

            <div>
              <h3>Occupancy Rate</h3>
              <strong>{occupancyRate}%</strong>
            </div>
          </section>

          <section className="card">
            <h2>Central Garage</h2>
            <p>
              Live operational overview of the parking facility.
            </p>

            <div className="status">
              <div>
                <h3>Facility</h3>
                <strong>Central Garage</strong>
              </div>

              <div>
                <h3>Status</h3>
                <strong>Live</strong>
              </div>

              <div>
                <h3>Availability</h3>
                <strong>{available} spaces</strong>
              </div>
            </div>
          </section>
        </>
      )}
    </Page>
  );
}
