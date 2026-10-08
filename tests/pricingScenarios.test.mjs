import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateRevenue,
  parseCustomers,
  saveScenario,
  loadSaved,
  deleteScenario,
  getScenario,
  scenarios,
  STORAGE_KEY
} from "../lib/pricingScenarios.mjs";

function memoryStorage() {
  const data = {};
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    }
  };
}

test("calculateRevenue uses approved prices", () => {
  assert.equal(calculateRevenue({ Basic: 1, Pro: 1, Enterprise: 1 }), 5997);
  assert.equal(calculateRevenue(scenarios.Expected), 20 * 499 + 10 * 1499 + 3 * 3999);
});

test("calculateRevenue treats invalid counts as 0", () => {
  assert.equal(calculateRevenue({ Basic: -5, Pro: "abc", Enterprise: 1 }), 3999);
});

test("parseCustomers rejects negative, decimal, empty and huge values", () => {
  assert.equal(parseCustomers("12"), 12);
  assert.equal(parseCustomers("0"), 0);
  for (const bad of ["-1", "1.5", "", "abc", "1e3", "100001", null, undefined]) {
    assert.equal(parseCustomers(bad), null, String(bad));
  }
});

test("saveScenario stores name, counts and revenues", () => {
  const storage = memoryStorage();
  const { error, saved } = saveScenario(storage, " Plan A ", {
    Basic: "2",
    Pro: 1,
    Enterprise: 0
  });
  assert.equal(error, null);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].name, "Plan A");
  assert.deepEqual(saved[0].customers, { Basic: 2, Pro: 1, Enterprise: 0 });
  assert.equal(saved[0].monthlyRevenue, 2497);
  assert.equal(saved[0].annualRevenue, 2497 * 12);
  assert.deepEqual(loadSaved(storage), saved);
});

test("saveScenario rejects invalid input without saving", () => {
  const storage = memoryStorage();
  assert.ok(saveScenario(storage, "", scenarios.Expected).error);
  assert.ok(saveScenario(storage, "X", { Basic: -1, Pro: 1, Enterprise: 1 }).error);
  assert.ok(saveScenario(storage, "X", { Basic: 1.5, Pro: 1, Enterprise: 1 }).error);
  assert.deepEqual(loadSaved(storage), []);
});

test("getScenario loads a saved scenario by id", () => {
  const storage = memoryStorage();
  const { saved } = saveScenario(storage, "A", scenarios.Optimistic);
  assert.deepEqual(getScenario(storage, saved[0].id).customers, scenarios.Optimistic);
  assert.equal(getScenario(storage, "missing"), null);
});

test("deleteScenario removes only the selected scenario", () => {
  const storage = memoryStorage();
  saveScenario(storage, "A", scenarios.Expected);
  const { saved } = saveScenario(storage, "B", scenarios.Optimistic);
  const remaining = deleteScenario(storage, saved[0].id);
  assert.deepEqual(remaining.map((s) => s.name), ["B"]);
  assert.equal(loadSaved(storage).length, 1);
});

test("loadSaved tolerates corrupt storage", () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, "{not json");
  assert.deepEqual(loadSaved(storage), []);
  storage.setItem(STORAGE_KEY, '{"a":1}');
  assert.deepEqual(loadSaved(storage), []);
});
