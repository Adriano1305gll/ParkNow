import Link from 'next/link';
import Page from '../../components/Page';
import CopyButton from '../../components/CopyButton';
import { audiences, posts, scripts } from '../../lib/marketingContent';
import { campaignDays, audienceLabels } from '../../lib/campaignCalendar.mjs';

function AudienceBadge({ audience }) {
  if (audience === 'both') {
    return (
      <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
        Drivers (free) + Owners (paid)
      </span>
    );
  }
  const a = audiences[audience];
  const isOwner = audience === 'owner';
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
        isOwner
          ? 'border-amber-300/40 bg-amber-300/10 text-amber-200'
          : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
      }`}
    >
      {a.label}: {a.note}
    </span>
  );
}

function scriptText(s) {
  return [
    `${s.title} (${s.length})`,
    `Hook: ${s.hook}`,
    'Scenes:',
    ...s.scenes.map((scene, i) => `${i + 1}. ${scene}`),
    `Narration: ${s.narration}`,
    `CTA: ${s.cta}`,
  ].join('\n');
}

export default function Marketing() {
  return (
    <Page
      eyebrow="Marketing content system"
      title="Ready-to-post content for ParkNow."
      subtitle="Ten social posts and three short video scripts. Copy any card and adapt it for launch."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Audience 1</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Drivers: free</h2>
          <p className="mt-2">People who want to find a parking space faster. They never pay to use ParkNow.</p>
        </div>
        <div className="rounded-2xl border border-amber-300/30 bg-amber-300/5 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-200">Audience 2</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Parking-lot owners: paid</h2>
          <p className="mt-2">Operators who subscribe for lot visibility and pricing tools.</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-400">
        Content is draft copy for a capstone prototype. It contains no customer results, and parking data is simulated unless
        connected to physical sensors.
      </p>

      <h2 className="mt-12 text-3xl font-bold text-white">14-day campaign calendar</h2>
      <p className="mt-2 text-sm text-slate-400">
        Messages are draft plans, not results. Any parking availability shown in campaign content is simulated.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {campaignDays.map((d) => {
          const source = posts.find((p) => p.id === d.contentRef) || scripts.find((s) => s.id === d.contentRef);
          const copyText = source && source.body ? source.body : source ? scriptText(source) : d.message;
          return (
            <article key={d.day} className="flex flex-col rounded-2xl border border-white/10 bg-[#0b1b30] p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-lg bg-emerald-400 px-3 py-1 text-sm font-bold text-slate-950">Day {d.day}</span>
                <span className="text-sm font-semibold text-emerald-300">{d.platform}</span>
              </div>
              <p className={`mt-3 inline-block self-start rounded-full border px-3 py-1 text-xs font-semibold ${d.audience === 'owner' ? 'border-amber-300/40 bg-amber-300/10 text-amber-200' : d.audience === 'driver' ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' : 'border-white/20 bg-white/5 text-slate-200'}`}>
                {audienceLabels[d.audience]}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div><dt className="text-xs font-bold uppercase tracking-widest text-emerald-400">Format</dt><dd>{d.format}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-widest text-emerald-400">Objective</dt><dd>{d.objective}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-widest text-emerald-400">Message</dt><dd className="text-slate-200">{d.message}</dd></div>
                <div><dt className="text-xs font-bold uppercase tracking-widest text-emerald-400">Call to action</dt><dd>{d.cta}</dd></div>
              </dl>
              <div className="mt-4 flex flex-1 items-end gap-2">
                <Link href={d.href} className="rounded-lg bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300">{d.cta}</Link>
                <CopyButton text={copyText} label="Copy content" />
              </div>
            </article>
          );
        })}
      </div>

      <h2 className="mt-14 text-3xl font-bold text-white">Social posts ({posts.length})</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <article key={p.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#0b1b30] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">{p.platform}</span>
              <AudienceBadge audience={p.audience} />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{p.title}</h3>
            <p className="mt-3 flex-1 whitespace-pre-line text-slate-300">{p.body}</p>
            <div className="mt-5">
              <CopyButton text={p.body} label="Copy post" />
            </div>
          </article>
        ))}
      </div>

      <h2 className="mt-14 text-3xl font-bold text-white">Short-form video scripts ({scripts.length})</h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {scripts.map((s) => (
          <article key={s.id} className="flex flex-col rounded-2xl border border-white/10 bg-[#0b1b30] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-slate-400">{s.length}</span>
              <AudienceBadge audience={s.audience} />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">{s.title}</h3>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Hook</p>
            <p className="text-slate-200">{s.hook}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Scenes</p>
            <ol className="list-decimal space-y-1 pl-5">
              {s.scenes.map((scene) => (
                <li key={scene}>{scene}</li>
              ))}
            </ol>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Narration</p>
            <p>{s.narration}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-400">Call to action</p>
            <p className="flex-1 text-slate-200">{s.cta}</p>
            <div className="mt-5">
              <CopyButton text={scriptText(s)} label="Copy script" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-8">
        <h2 className="text-2xl font-bold text-white">Launch channels</h2>
        <p className="mt-3 max-w-3xl">
          Start with controlled locations such as a school campus, private garage, or office lot. Use QR codes at entrances,
          facility websites, and operator partnerships rather than broad consumer advertising.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/parking" className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-300">
            Find Parking
          </Link>
          <Link href="/pricing" className="rounded-xl border border-emerald-400/50 px-5 py-3 font-semibold text-emerald-300 hover:bg-emerald-400/10">
            Owner Pricing
          </Link>
        </div>
      </div>
    </Page>
  );
}
