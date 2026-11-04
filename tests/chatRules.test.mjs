import test from "node:test";
import assert from "node:assert/strict";
import { getChatReply, validateMessage, STARTER_QUESTIONS, MAX_MESSAGE_LENGTH } from "../lib/chatRules.mjs";

test("three starter questions all get supported answers", () => {
  assert.equal(STARTER_QUESTIONS.length, 3);
  for (const q of STARTER_QUESTIONS) {
    const r = getChatReply(q);
    assert.equal(r.ok, true);
    assert.equal(r.humanHelp, false);
  }
});

test("availability questions are labelled simulated and never claim live data", () => {
  const r = getChatReply("Is there parking available right now?");
  assert.equal(r.intent, "availability");
  assert.equal(r.simulated, true);
  assert.match(r.answer, /can't confirm real-time/i);
});

test("driver cost answer says free for drivers", () => {
  assert.match(getChatReply("How much does it cost?").answer, /free for drivers/i);
});

test("unsupported questions fall back to human help", () => {
  const r = getChatReply("What is the capital of France?");
  assert.equal(r.humanHelp, true);
  assert.equal(r.intent, "unsupported");
});

test("empty and overlong input is rejected", () => {
  assert.equal(validateMessage("   ").ok, false);
  assert.equal(validateMessage(null).ok, false);
  assert.equal(getChatReply("a".repeat(MAX_MESSAGE_LENGTH + 1)).ok, false);
});
