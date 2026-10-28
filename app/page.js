import Link from 'next/link';

const occupied = [1, 4, 7, 8, 12, 13, 17, 20, 22];

const driverBenefits = [
  'Always free for drivers. No account fees, no paywall.',
  'See available and occupied spaces on a lot map before you arrive.',
  'Spend less time circling and make faster parking decisions.',
];

const ownerBenefits = [
  'Give drivers a clear view of your lot and keep spaces in use.',
  'Test pricing scenarios with the pricing simulator before changing rates.',
  'Use the owner dashboard to review lot activity in one place.',
];

const personas = [
  {
    tag: 'Driver persona',
    name: 'Maya, the commuter',
    role: 'Drives downtown several days a week',
    need: 'Wants to know whether a lot has space before she commits to it.',
    pain: 'Loses time circling full lots and worrying about being late.',
    cta: ['/parking', 'View Parking'],
    cost: 'Free',
  },
  {
    tag: 'Owner persona',
    name: 'Daniel, the lot owner',
    role: 'Runs a small paid parking lot',
    need: 'Wants to fill more spaces and set prices with confidence.',
    pain: 'Sets rates by guesswork and has little visibility into lot usage.',
    cta: ['/pricing', 'See Owner Pricing'],
    cost: 'Paying customer',
  },
];

export default function Home() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[.2em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> ParkNow
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find Parking. <span className="text-emerald-400">Grow Your Business.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300">
            ParkNow is free for drivers who want to find a space faster, and a pricing and visibility tool for
            parking-lot owners who want to run a better business.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/parking" className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
              Find Parking
            </Link>
            <Link href="/pricing" className="rounded-xl border border-emerald-400/50 px-5 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-400/10">
              For Lot Owners
            </Link>
            <Link href="/product" className="rounded-xl border border-white/15 px-5 py-3 font-semibold transition hover:bg-white/5">
              How It Works
            </Link>
            <Link href="/marketing" className="rounded-xl border border-white/15 px-5 py-3 font-semibold transition hover:bg-white/5">
              Marketing Plan
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            Capstone prototype: parking occupancy shown here is simulated unless connected to physical sensors.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5" aria-label="Simulated parking lot preview">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">Sample lot: Central Garage</p>
              <p className="text-2xl font-bold">{24 - occupied.length} spaces free</p>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
              SIMULATED DATA
            </span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`flex aspect-[1/1.5] items-center justify-center rounded-lg border text-xs font-bold ${
                  occupied.includes(i)
                    ? 'border-rose-400/50 bg-rose-400/15 text-rose-200'
                    : 'border-emerald-400/50 bg-emerald-400/15 text-emerald-200'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold tracking-tight">Built for both sides of the lot</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">For drivers: free</p>
            <ul className="mt-4 space-y-3 text-slate-300">
              {driverBenefits.map((b) => (
                <li key={b} className="flex gap-3"><span className="text-emerald-400">✓</span>{b}</li>
              ))}
            </ul>
            <Link href="/parking" className="mt-6 inline-block rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">
              Find Parking
            </Link>
          </article>
          <article className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">For lot owners: paid plans</p>
            <ul className="mt-4 space-y-3 text-slate-300">
              {ownerBenefits.map((b) => (
                <li key={b} className="flex gap-3"><span className="text-emerald-400">✓</span>{b}</li>
              ))}
            </ul>
            <Link href="/pricing" className="mt-6 inline-block rounded-xl border border-emerald-400/50 px-5 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-400/10">
              View Pricing
            </Link>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-bold tracking-tight">Who ParkNow is for</h2>
        <p className="mt-2 text-sm text-slate-400">Illustrative personas used for design, not real customers.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {personas.map((p) => (
            <article key={p.name} className="flex flex-col rounded-2xl border border-white/10 bg-[#0b1b30] p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">{p.tag}</p>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">{p.cost}</span>
              </div>
              <h3 className="mt-3 text-2xl font-bold">{p.name}</h3>
              <p className="text-sm text-slate-400">{p.role}</p>
              <p className="mt-4 text-slate-300"><strong className="text-white">Needs:</strong> {p.need}</p>
              <p className="mt-2 text-slate-300"><strong className="text-white">Pain:</strong> {p.pain}</p>
              <Link href={p.cta[0]} className="mt-6 self-start rounded-xl border border-emerald-400/50 px-5 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-400/10">
                {p.cta[1]}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 pt-12">
        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-8 text-center">
          <h2 className="text-3xl font-bold">Ready to try ParkNow?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Drivers park free. Lot owners explore pricing and how the product works.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/parking" className="rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300">Find Parking</Link>
            <Link href="/product" className="rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:bg-white/5">Product</Link>
            <Link href="/pricing" className="rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:bg-white/5">Pricing</Link>
            <Link href="/marketing" className="rounded-xl border border-white/20 px-5 py-3 font-semibold transition hover:bg-white/5">Marketing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
