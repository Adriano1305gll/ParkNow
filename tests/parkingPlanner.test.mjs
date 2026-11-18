import test from 'node:test';
import assert from 'node:assert/strict';
import { buildPlan, getEstimatedCost, isPositiveNumber } from '../lib/parkingPlanner.mjs';

test('buildPlan preserves the existing sample recommendation and backup', () => {
  const plan = buildPlan({
    destination: 'City Hall',
    arrivalTime: '2026-11-19T10:00',
    duration: '90',
    walkingTime: '15',
    budget: '10',
    accessibility: 'None',
  });

  assert.equal(plan.bestOption.name, 'Central Garage');
  assert.equal(plan.estimatedCost, 6);
  assert.equal(plan.walkingMinutes, 6);
  assert.equal(plan.backupOption.name, 'Market Street Lot');
  assert.match(plan.why, /6 minutes/);
  assert.equal(plan.risks.length, 2);
});

test('buildPlan retains no-match and accessibility behavior', () => {
  const inaccessible = buildPlan({
    duration: 90,
    walkingTime: 30,
    budget: 10,
    accessibility: 'Accessible parking space',
  });
  assert.equal(inaccessible.bestOption.name, 'Central Garage');
  assert.match(inaccessible.why, /accessibility requirement/);

  const noMatch = buildPlan({
    duration: 90,
    walkingTime: 1,
    budget: 1,
    accessibility: 'None',
  });
  assert.equal(noMatch.unavailable, true);
  assert.equal(noMatch.bestOption, undefined);
});

test('shared validation helper retains positive finite number behavior', () => {
  assert.equal(isPositiveNumber('2.5'), true);
  assert.equal(isPositiveNumber('0'), false);
  assert.equal(isPositiveNumber('Infinity'), false);
  assert.equal(getEstimatedCost({ costPerHour: 3 }, 90), 6);
});
