import test from "node:test";
import assert from "node:assert/strict";
import { experiments, RESULTS_NOTICE } from "../lib/abExperiments.mjs";

test("there are exactly two experiments, A for drivers and B for owners", () => {
  assert.equal(experiments.length, 2);
  assert.equal(experiments[0].id, "exp-a");
  assert.equal(experiments[0].audience, "driver");
  assert.equal(experiments[1].id, "exp-b");
  assert.equal(experiments[1].audience, "owner");
});

test("each experiment defines hypothesis, metric, and two distinct variants", () => {
  for (const e of experiments) {
    assert.ok(e.hypothesis.trim());
    assert.ok(e.successMetric.trim());
    assert.ok(e.audienceLabel.trim());
    assert.ok(e.variants.A.text.trim());
    assert.ok(e.variants.B.text.trim());
    assert.notEqual(e.variants.A.text, e.variants.B.text);
  }
});

test("results notice says results are hypothetical and no data exists", () => {
  assert.match(RESULTS_NOTICE, /hypothetical until actual testing/i);
  for (const e of experiments) {
    assert.doesNotMatch(JSON.stringify(e), /\d+(\.\d+)?\s?%/, "no fabricated percentages");
  }
});
