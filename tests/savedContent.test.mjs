import test from "node:test";
import assert from "node:assert/strict";
import {
  STORAGE_KEY,
  loadContent,
  saveContent,
  getContent,
  deleteContent,
  formatText,
  formatCsv,
} from "../lib/savedContent.mjs";
import { posts, scripts } from "../lib/marketingContent.mjs";
import { campaignDays, audienceLabels } from "../lib/campaignCalendar.mjs";

function memoryStorage(initial = {}) {
  const data = { ...initial };
  return {
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
  };
}

const item = { id: "ig-1", type: "post", title: "Circling is optional", audience: "Drivers (free)", platform: "Instagram", text: "Line one\nLine two" };
const fixedNow = () => "2026-10-28T00:00:00.000Z";

test("save then load returns the saved item with a timestamp", () => {
  const s = memoryStorage();
  const res = saveContent(s, item, fixedNow);
  assert.equal(res.error, null);
  const loaded = loadContent(s);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].title, item.title);
  assert.equal(loaded[0].savedAt, "2026-10-28T00:00:00.000Z");
  assert.equal(getContent(s, "ig-1").text, item.text);
});

test("saving the same id replaces instead of duplicating", () => {
  const s = memoryStorage();
  saveContent(s, item, fixedNow);
  saveContent(s, { ...item, text: "updated" }, fixedNow);
  const loaded = loadContent(s);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].text, "updated");
});

test("invalid items are rejected and not stored", () => {
  const s = memoryStorage();
  assert.ok(saveContent(s, { ...item, text: "  " }).error);
  assert.ok(saveContent(s, { ...item, type: "bogus" }).error);
  assert.ok(saveContent(s, { ...item, id: "" }).error);
  assert.deepEqual(loadContent(s), []);
});

test("delete removes only the chosen item", () => {
  const s = memoryStorage();
  saveContent(s, item, fixedNow);
  saveContent(s, { ...item, id: "ig-2", title: "Other" }, fixedNow);
  const res = deleteContent(s, "ig-1");
  assert.equal(res.error, null);
  assert.deepEqual(loadContent(s).map((i) => i.id), ["ig-2"]);
  assert.equal(getContent(s, "ig-1"), null);
});

test("corrupt or non-array storage loads as empty", () => {
  assert.deepEqual(loadContent(memoryStorage({ [STORAGE_KEY]: "{not json" })), []);
  assert.deepEqual(loadContent(memoryStorage({ [STORAGE_KEY]: '{"a":1}' })), []);
});

test("storage write failure is reported", () => {
  const s = { getItem: () => null, setItem: () => { throw new Error("quota"); } };
  assert.ok(saveContent(s, item, fixedNow).error);
});

test("text export includes every field and handles empty list", () => {
  const out = formatText([{ ...item, savedAt: fixedNow() }]);
  assert.match(out, /\[POST\] Circling is optional/);
  assert.match(out, /Audience: Drivers \(free\)/);
  assert.match(out, /Line one\nLine two/);
  assert.match(formatText([]), /nothing saved/);
});

test("CSV export has header, quotes, escapes, and blocks formulas", () => {
  const out = formatCsv([
    { ...item, title: 'Say "hi", ok', text: "=SUM(A1)\nnext", savedAt: fixedNow() },
  ]);
  const [header, ...rest] = out.split("\r\n");
  assert.equal(header, "id,type,title,audience,platform,savedAt,text");
  const row = rest.join("\r\n");
  assert.match(row, /"Say ""hi"", ok"/);
  assert.match(row, /"'=SUM\(A1\)\nnext"/);
  assert.ok(out.endsWith("\r\n"));
});

test("existing content data is intact: 10 posts, 3 scripts, unique ids", () => {
  assert.equal(posts.length, 10);
  assert.equal(scripts.length, 3);
  const ids = [...posts, ...scripts].map((x) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const p of posts) assert.ok(p.title && p.body && p.platform && audienceLabels[p.audience]);
  for (const s of scripts) assert.ok(s.hook && s.narration && s.cta && s.scenes.length >= 3 && audienceLabels[s.audience]);
  assert.deepEqual([...new Set(posts.map((p) => p.platform))].sort(), ["Facebook", "Instagram", "LinkedIn", "TikTok"]);
});

test("every campaign day references existing content", () => {
  const ids = new Set([...posts, ...scripts].map((x) => x.id));
  assert.equal(campaignDays.length, 14);
  for (const d of campaignDays) assert.ok(ids.has(d.contentRef), `day ${d.day} has unknown contentRef`);
});
