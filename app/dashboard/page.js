'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Page from '../../components/Page';

export default function Dashboard() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configurationError, setConfigurationError] = useState(false);
  const [researchRecords, setResearchRecords] = useState([]);
  const [researchLoading, setResearchLoading] = useState(true);
  const [researchError, setResearchError] = useState('');

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

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ) {
      setResearchError('Supabase is not configured. Research summary is unavailable.');
      setResearchLoading(false);
      return;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    );

    async function loadResearch() {
      const { data, error } = await supabase
        .from('research_records')
        .select('id, market, facility_type, research_question, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        setResearchError(error.message || 'Unable to load saved research.');
      } else {
        setResearchRecords(data || []);
      }

      setResearchLoading(false);
    }

    loadResearch();
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
      {configurationError ? (
        <div className="card" role="alert">
          <h2>Dashboard data unavailable</h2>
          <p>Supabase is not configured. Add the required environment variables to load facility metrics.</p>
        </div>
      ) : loading ? (
        <p className="card" role="status">Loading dashboard data...</p>
      ) : spots.length === 0 ? (
        <div className="card" role="status">
          <h2>No occupancy data available</h2>
          <p>The dashboard has no parking-space records to summarize yet.</p>
        </div>
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

      <ResearchSummary
        records={researchRecords}
        loading={researchLoading}
        error={researchError}
      />
    </Page>
  );
}

function ResearchSummary({ records, loading, error }) {
  const latest = records[0];

  return (
    <section className="card mt-8" aria-live="polite">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2>Research Summary</h2>
          <p>Saved research records kept separate from parking occupancy analytics.</p>
        </div>
        <a className="text-emerald-300 underline decoration-emerald-400/40 underline-offset-4 hover:text-emerald-200" href="/research">
          View research
        </a>
      </div>

      {error ? (
        <p className="mt-5 text-red-300" role="alert">{error}</p>
      ) : loading ? (
        <p className="mt-5" role="status">Loading research summary...</p>
      ) : !latest ? (
        <p className="mt-5" role="status">No saved research records yet.</p>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Saved records</p>
            <strong className="text-white">{records.length}</strong>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Latest market</p>
            <strong className="text-white">{latest.market}</strong>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Facility type</p>
            <strong className="text-white">{latest.facility_type.replaceAll('-', ' ')}</strong>
          </div>
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">Latest research question</p>
            <strong className="text-white">{latest.research_question}</strong>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Latest saved</p>
            <time className="font-semibold text-white" dateTime={latest.created_at}>{new Date(latest.created_at).toLocaleString()}</time>
          </div>
        </div>
      )}
    </section>
  );
}
