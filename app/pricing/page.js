
import Page from "../../components/Page";
import PricingSimulator from "../../components/PricingSimulator";

const plans = [
  {
    name: "Basic",
    price: 499,
    description: "For small parking lots",
    features: [
      "Parking availability map",
      "Parking space monitoring",
      "Basic management dashboard"
    ]
  },
  {
    name: "Pro",
    price: 1499,
    description: "For medium parking lots",
    features: [
      "Everything in Basic",
      "Occupancy statistics",
      "Reports and alerts"
    ]
  },
  {
    name: "Enterprise",
    price: 3999,
    description: "For large parking facilities",
    features: [
      "Everything in Pro",
      "Multiple parking locations",
      "Advanced reports"
    ]
  }
];

export default function Pricing() {
  return (
    <Page
      eyebrow="ParkNow Pricing"
      title="Choose the right plan for your parking lot."
    >
      <p className="mb-8 text-lg text-slate-300">
        Simple monthly subscriptions for parking lot
        owners. Drivers can use ParkNow for free.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-2xl border border-emerald-500/20 bg-white/5 p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              {plan.name}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {plan.description}
            </p>

            <p className="mt-6 text-4xl font-bold text-emerald-400">
              ${plan.price.toLocaleString("es-MX")}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              MXN / month
            </p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="text-sm text-slate-300"
                >
                  <span className="mr-2 text-emerald-400">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-400">
        Prices are illustrative for the ParkNow
        university project. No real payments
        are processed.
      </p>

      <PricingSimulator />
    </Page>
  );
}
