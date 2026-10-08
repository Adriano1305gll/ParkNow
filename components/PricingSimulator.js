
"use client";

import { useEffect, useState } from "react";
import {
  prices,
  scenarios,
  MAX_CUSTOMERS,
  parseCustomers,
  calculateRevenue,
  saveScenario,
  loadSaved,
  deleteScenario,
  getScenario
} from "../lib/pricingScenarios.mjs";

const formatMoney = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);

export default function PricingSimulator() {
  const [customers, setCustomers] = useState({
    ...scenarios.Expected
  });

  const [scenario, setScenario] = useState("Expected");
  const [saved, setSaved] = useState([]);
  const [name, setName] = useState("");
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    setSaved(loadSaved(window.localStorage));
  }, []);

  function handleSave() {
    const result = saveScenario(window.localStorage, name, customers);
    setSaveError(result.error);
    setSaved(result.saved);
    if (!result.error) setName("");
  }

  function handleLoad(id) {
    const item = getScenario(window.localStorage, id);
    if (!item) return;
    setCustomers({ ...item.customers });
    setScenario(item.name);
    setSaveError(null);
  }

  function handleDelete(id) {
    setSaved(deleteScenario(window.localStorage, id));
  }

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
          Saved Scenarios
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">
          <input
            type="text"
            aria-label="Scenario name"
            placeholder="Scenario name"
            maxLength={60}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="flex-1 rounded-xl border border-white/20 bg-slate-900 p-3 text-white"
          />
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
          >
            Save Scenario
          </button>
        </div>

        {saveError && (
          <p className="mt-2 text-sm text-red-400">{saveError}</p>
        )}

        {saved.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No saved scenarios yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {saved.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 p-4 text-sm text-slate-300"
              >
                <div>
                  <p className="font-semibold text-white">
                    {item.name}
                  </p>
                  <p>
                    Basic {item.customers.Basic} / Pro{" "}
                    {item.customers.Pro} / Enterprise{" "}
                    {item.customers.Enterprise}
                  </p>
                  <p>
                    Monthly {formatMoney(item.monthlyRevenue)} ·
                    Annual {formatMoney(item.annualRevenue)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoad(item.id)}
                    className="rounded-xl border border-white/20 px-4 py-2 text-slate-300"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-xl border border-red-400/40 px-4 py-2 text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
