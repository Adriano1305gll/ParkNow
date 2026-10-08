
import Link from "next/link";
import Page from "../../components/Page";

const features = [
  {
    icon: "🅿️",
    title: "Real-Time Availability",
    description: "Find available parking spaces quickly."
  },
  {
    icon: "🗺️",
    title: "Interactive Parking Map",
    description: "See parking spaces on a simple visual map."
  },
  {
    icon: "📊",
    title: "Analytics and Reports",
    description: "Track occupancy and parking lot activity."
  },
  {
    icon: "🏢",
    title: "Multiple Locations",
    description: "Manage different parking lots in one platform."
  }
];

export default function Product() {
  return (
    <Page
      eyebrow="ParkNow Product"
      title="Parking should be simple."
    >
      <section className="space-y-6">
        <p className="max-w-3xl text-lg text-slate-300">
          ParkNow helps drivers find available parking
          spaces and gives parking lot owners the tools
          to manage their operations efficiently.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/parking"
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
          >
            Explore Parking
          </Link>

          <Link
            href="/pricing"
            className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            See Pricing
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Two Customer Segments, One Solution
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-emerald-400">
              Drivers
            </h3>

            <p className="mt-3 text-slate-300">
              Find parking spaces faster, reduce time
              searching, and view parking availability.
            </p>

            <p className="mt-4 font-semibold text-white">
              Free to use
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-bold text-emerald-400">
              Parking Lot Owners
            </h3>

            <p className="mt-3 text-slate-300">
              Monitor parking occupancy, analyze usage,
              and manage parking operations.
            </p>

            <p className="mt-4 font-semibold text-white">
              Monthly subscription plans
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-6 text-2xl font-bold text-white">
          Key Features
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-3xl">
                {feature.icon}
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">
                {feature.title}
              </h3>

              <p className="mt-2 text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-8">
        <h2 className="text-2xl font-bold text-white">
          Make Your Parking Lot Smarter
        </h2>

        <p className="mt-3 text-slate-300">
          Explore our subscription plans and discover
          how ParkNow can support your business.
        </p>

        <Link
          href="/pricing"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
        >
          View Subscription Plans
        </Link>
      </section>
    </Page>
  );
}
