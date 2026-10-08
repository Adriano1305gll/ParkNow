export const prices = { Basic: 499, Pro: 1499, Enterprise: 3999 };

export const scenarios = {
  Conservative: { Basic: 10, Pro: 5, Enterprise: 1 },
  Expected: { Basic: 20, Pro: 10, Enterprise: 3 },
  Optimistic: { Basic: 50, Pro: 25, Enterprise: 10 }
};

export const MAX_CUSTOMERS = 100000;
export const STORAGE_KEY = "parknow.savedScenarios";

export function parseCustomers(value) {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return null;
  const number = Number(text);
  return number <= MAX_CUSTOMERS ? number : null;
}

export function calculateRevenue(customers) {
  return Object.keys(prices).reduce(
    (total, plan) =>
      total + (parseCustomers(customers[plan]) ?? 0) * prices[plan],
    0
  );
}

export function validateScenario(name, customers) {
  if (!String(name ?? "").trim()) return "Enter a scenario name.";
  const invalid = Object.keys(prices).some(
    (plan) => parseCustomers(customers[plan]) === null
  );
  return invalid
    ? `Customer counts must be whole numbers between 0 and ${MAX_CUSTOMERS}.`
    : null;
}

export function loadSaved(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(storage, list) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage full or blocked; the in-memory list is still returned.
  }
  return list;
}

export function saveScenario(storage, name, customers) {
  const error = validateScenario(name, customers);
  if (error) return { error, saved: loadSaved(storage) };

  const counts = {};
  for (const plan of Object.keys(prices)) {
    counts[plan] = parseCustomers(customers[plan]);
  }
  const monthlyRevenue = calculateRevenue(counts);
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: String(name).trim(),
    customers: counts,
    monthlyRevenue,
    annualRevenue: monthlyRevenue * 12
  };
  return { error: null, saved: persist(storage, [...loadSaved(storage), entry]) };
}

export function deleteScenario(storage, id) {
  return persist(storage, loadSaved(storage).filter((item) => item.id !== id));
}

export function getScenario(storage, id) {
  return loadSaved(storage).find((item) => item.id === id) ?? null;
}
