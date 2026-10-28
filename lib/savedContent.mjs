export const STORAGE_KEY = "parknow.savedMarketingContent";
export const TYPES = ["post", "script", "campaign", "experiment"];

export function loadContent(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i.id === "string" && typeof i.text === "string" && typeof i.title === "string");
  } catch {
    return [];
  }
}

function write(storage, items) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(items));
    return null;
  } catch {
    return "Could not save to browser storage.";
  }
}

// Saving the same id again replaces the earlier copy.
export function saveContent(storage, item, now = () => new Date().toISOString()) {
  const title = String(item?.title ?? "").trim();
  const text = String(item?.text ?? "").trim();
  const id = String(item?.id ?? "").trim();
  if (!id || !title || !text) return { items: loadContent(storage), error: "Content needs an id, title, and text." };
  if (!TYPES.includes(item.type)) return { items: loadContent(storage), error: "Unknown content type." };
  const entry = {
    id,
    type: item.type,
    title,
    audience: String(item.audience ?? ""),
    platform: String(item.platform ?? ""),
    text,
    savedAt: now(),
  };
  const items = [...loadContent(storage).filter((i) => i.id !== id), entry];
  return { items, error: write(storage, items) };
}

export function getContent(storage, id) {
  return loadContent(storage).find((i) => i.id === id) || null;
}

export function deleteContent(storage, id) {
  const items = loadContent(storage).filter((i) => i.id !== id);
  return { items, error: write(storage, items) };
}

export function formatText(items) {
  if (items.length === 0) return "ParkNow saved marketing content\n\n(nothing saved)\n";
  const blocks = items.map(
    (i) =>
      `[${i.type.toUpperCase()}] ${i.title}\nAudience: ${i.audience}\nPlatform: ${i.platform}\nSaved: ${i.savedAt}\n\n${i.text}`
  );
  return `ParkNow saved marketing content\n\n${blocks.join("\n\n---\n\n")}\n`;
}

// Cells starting with = + - @ are prefixed with ' so spreadsheets do not run them as formulas.
function csvCell(value) {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function formatCsv(items) {
  const header = ["id", "type", "title", "audience", "platform", "savedAt", "text"];
  const rows = items.map((i) => header.map((h) => csvCell(i[h])).join(","));
  return [header.join(","), ...rows].join("\r\n") + "\r\n";
}
