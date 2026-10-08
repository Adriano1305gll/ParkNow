
"use client";

import { useState } from "react";

const prices = {
  Basic: 499,
  Pro: 1499,
  Enterprise: 3999
};

const scenarios = {
  Conservative: { Basic: 10, Pro: 5, Enterprise: 1 },
  Expected: { Basic: 20, Pro: 10, Enterprise: 3 },
  Optimistic: { Basic: 50, Pro: 25, Enterprise: 10 }
};

const formatMoney = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);

const MAX_CUSTOMERS = 100000;

function parseCustomers(value) {
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return null;
  const number = Number(text);
  return number <= MAX_CUSTOMERS ? number : null;
}

function calculateRevenue(customers) {
  return Object.keys(prices).reduce(
    (total, plan) =>
      total + (parseCustomers(customers[plan]) ?? 0) * prices[plan],
    0
  );
}

export default function PricingSimulator() {
  const [customers, setCustomers] = useState({
    ...scenarios.Expected
  });

  const [scenario, setScenario] = useState("Expected");

  const monthlyRevenue = calculateRevenue(customers);
  const annualRevenue = monthlyRevenue * 12;

  function updateCustomers(plan, value) {
    setCustomers((previous) => ({
      ...previous,
      [plan]: value
    }));

    setScenario("Custom");
  }

  function selectScenario(name) {
    setScenario(name);
    setCustomers({ ...scenarios[name] });
  }

  return (
    <section className="mt-12 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">
          ParkNow Revenue Simulator
        </h2>

        <p className="mt-3 text-slate-300">
          Estimate potential subscription revenue
          by changing the number of customers.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {Object.keys(scenarios).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => selectScenario(name)}
            className={`rounded-xl px-5 py-3 font-semibold ${
              scenario === name
                ? "bg-emerald-600 text-white"
                : "border border-white/20 text-slate-300"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {Object.keys(prices).map((plan) => (
          <div
            key={plan}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <label
              htmlFor={`customers-${plan}`}
              className="font-semibold text-white"
            >
              {plan} Customers
            </label>

            <p className="mt-2 text-sm text-slate-400">
              {formatMoney(prices[plan])} / month
            </p>

            <input
              id={`customers-${plan}`}
              type="number"
              min="0"
              step="1"
              value={customers[plan]}
              onChange={(event) =>
                updateCustomers(plan, event.target.value)
              }
              aria-invalid={parseCustomers(customers[plan]) === null}
              className="mt-4 w-full rounded-xl border border-white/20 bg-slate-900 p-3 text-white"
            />

            {parseCustomers(customers[plan]) === null && (
              <p className="mt-2 text-sm text-red-400">
                Enter a whole number between 0 and{" "}
                {MAX_CUSTOMERS.toLocaleString("es-MX")}.
                Counted as 0 until fixed.
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-slate-300">
            Monthly Revenue
          </p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {formatMoney(monthlyRevenue)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
          <p className="text-slate-300">
            Annual Revenue
          </p>

          <p className="mt-3 text-3xl font-bold text-emerald-400">
            {formatMoney(annualRevenue)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-xl font-bold text-white">
          Revenue Assumptions
        </h3>

        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>Basic subscription: $499 MXN/month</p>
          <p>Pro subscription: $1,499 MXN/month</p>
          <p>Enterprise subscription: $3,999 MXN/month</p>
          <p>
            Monthly revenue = sum of customers
            multiplied by their plan prices.
          </p>
          <p>Annual revenue = monthly revenue × 12.</p>
          <p>
            Scenarios (Basic / Pro / Enterprise):
            Conservative 10 / 5 / 1, Expected
            20 / 10 / 3, Optimistic 50 / 25 / 10.
          </p>
          <p>
            Estimates exclude operating costs,
            taxes, discounts, and cancellations.
          </p>
        </div>
      </div>
    </section>
  );
}
