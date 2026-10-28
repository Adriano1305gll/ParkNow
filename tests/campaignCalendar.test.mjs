import test from "node:test";
import assert from "node:assert/strict";
import { campaignDays, audienceLabels } from "../lib/campaignCalendar.mjs";

const fields = ["day", "platform", "audience", "format", "objective", "message", "cta", "href", "contentRef"];

test("calendar has 14 consecutive days", () => {
  assert.equal(campaignDays.length, 14);
  campaignDays.forEach((d, i) => assert.equal(d.day, i + 1));
});

test("every entry has all required fields filled in", () => {
  for (const d of campaignDays) {
    for (const f of fields) {
      assert.ok(d[f] !== undefined && String(d[f]).trim() !== "", `day ${d.day} missing ${f}`);
    }
  }
});

test("audiences are valid and labelled free vs paid", () => {
  assert.equal(audienceLabels.driver, "Drivers (free)");
  assert.equal(audienceLabels.owner, "Lot owners (paid)");
  for (const d of campaignDays) assert.ok(audienceLabels[d.audience], `day ${d.day} bad audience`);
});

test("campaign is balanced between drivers and owners", () => {
  const count = (a) => campaignDays.filter((d) => d.audience === a).length;
  assert.ok(count("driver") >= 5);
  assert.ok(count("owner") >= 5);
  assert.ok(Math.abs(count("driver") - count("owner")) <= 1);
});

test("CTAs link to existing routes and no entry claims real results", () => {
  const routes = ["/parking", "/product", "/pricing", "/marketing"];
  for (const d of campaignDays) {
    assert.ok(routes.includes(d.href), `day ${d.day} bad href`);
    assert.doesNotMatch(d.message, /guarantee(d)? (live|results)|\d+% /i);
  }
});
