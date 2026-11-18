import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DemoInputError,
  MAX_DEMO_REQUEST_BYTES,
  orchestrateDemo,
  runChatGuide,
  runParkingPlanner,
  runVentureViability,
  summarizeOccupancyRows,
  validateDemoInput,
} from '../lib/demoOrchestrator.mjs';
import { POST } from '../app/api/demo/orchestrate/route.js';

const validInput = {
  trip: {
    destination: 'City Hall',
    arrivalTime: '2026-11-18T19:00',
    duration: 90,
    walkingTime: 15,
    budget: 10,
    accessibility: 'None',
  },
  question: 'Is there parking available right now?',
  ownerScenario: { Basic: 20, Pro: 10, Enterprise: 3 },
};

test('parking agent separates an explicitly unverified occupancy snapshot from its plan', async () => {
  const output = await runParkingPlanner(validInput.trip, {
    readOccupancy: async () => ({
      sourceStatus: 'loaded',
      counts: { available: 2, occupied: 3, total: 5 },
      provenance: 'simulated_or_unverified',
    }),
  });

  assert.equal(output.plan.bestOption.name, 'Central Garage');
  assert.equal(output.plan.estimatedCost, 6);
  assert.equal(output.occupancyContext.counts.available, 2);
  assert.equal(output.occupancyContext.facilityRelation, 'unverified_to_plan');
  assert.equal(output.occupancyContext.provenance, 'simulated_or_unverified');
});

test('three agents execute in order and exchange actual upstream outputs', async () => {
  const result = await orchestrateDemo(validInput, {
    runId: () => 'test-run-1',
    readOccupancy: async () => ({
      sourceStatus: 'loaded',
      counts: { available: 2, occupied: 3, total: 5 },
      provenance: 'simulated_or_unverified',
    }),
  });

  assert.equal(result.runId, 'test-run-1');
  assert.equal(result.status, 'completed');
  assert.deepEqual(result.agents.map((agent) => agent.agentId), [
    'parking-planner',
    'chat-guide',
    'venture-viability',
  ]);
  assert.ok(result.agents.every((agent) => agent.status === 'completed'));
  assert.equal(result.agents[1].consumedFrom[0], 'parking-planner');
  assert.equal(
    result.agents[1].output.relatedPlan.plan.bestOption.name,
    result.agents[0].output.plan.bestOption.name,
  );
  assert.equal(result.agents[1].output.intent, 'availability');
  assert.match(result.agents[1].output.answer, /can't confirm real-time/i);
  assert.deepEqual(result.agents[2].consumedFrom, ['parking-planner', 'chat-guide']);
  assert.equal(result.agents[2].output.monthlyRevenueMxn, 36967);
  assert.equal(result.agents[2].output.annualRevenueMxn, 443604);
  assert.match(result.agents[2].output.dataBasis, /snapshot status: loaded/);
  assert.match(result.agents[2].output.dataBasis, /chat intent: availability/);
});

test('downstream inputs reflect changed planner and chat outputs', () => {
  const parking = {
    plan: { bestOption: { name: 'Test Garage' } },
    occupancyContext: { sourceStatus: 'empty', provenance: 'simulated_or_unverified' },
  };
  const chat = runChatGuide('Is there parking available?', parking);
  const viability = runVentureViability(validInput.ownerScenario, parking, chat);

  assert.equal(chat.relatedPlan.plan.bestOption.name, 'Test Garage');
  assert.equal(viability.dataBasis.includes('snapshot status: empty'), true);
  assert.equal(viability.dataBasis.includes('chat intent: availability'), true);
});

test('unsupported chat preserves the existing human-help boundary', async () => {
  const result = await orchestrateDemo({
    ...validInput,
    question: 'Can you guarantee a place for my event?',
  }, {
    runId: () => 'unsupported-run',
    readOccupancy: async () => ({
      sourceStatus: 'not_configured',
      provenance: 'simulated_or_unverified',
    }),
  });

  const chat = result.agents.find((agent) => agent.agentId === 'chat-guide');
  assert.equal(chat.output.intent, 'unsupported');
  assert.equal(chat.output.humanHelp, true);
  assert.match(chat.output.answer, /contact the ParkNow team/i);
  assert.equal(result.agents[2].status, 'completed');
});

test('unknown occupancy statuses never produce counts', () => {
  const result = summarizeOccupancyRows([
    { status: 'available' },
    { status: 'maintenance' },
  ]);
  assert.equal(result.sourceStatus, 'error');
  assert.equal(result.counts, undefined);
  assert.equal(summarizeOccupancyRows([]).sourceStatus, 'empty');
  assert.equal(summarizeOccupancyRows([{ status: 'occupied' }]).sourceStatus, 'loaded');
});

test('request validation rejects invalid message, unsupported accessibility, and counts', () => {
  for (const mutate of [
    (input) => { input.question = '   '; },
    (input) => { input.question = 'x'.repeat(301); },
    (input) => { input.trip.accessibility = 'Elevator'; },
    (input) => { input.ownerScenario.Pro = 1.5; },
    (input) => { input.ownerScenario.Basic = 100001; },
    (input) => { input.trip.duration = 0; },
  ]) {
    const input = structuredClone(validInput);
    mutate(input);
    assert.throws(() => validateDemoInput(input), DemoInputError);
  }
});

test('invalid request is rejected before any agents run', async () => {
  let calls = 0;
  await assert.rejects(
    orchestrateDemo({ ...validInput, question: '' }, {
      runParking: async () => { calls += 1; },
      runChat: async () => { calls += 1; },
      runViability: async () => { calls += 1; },
    }),
    DemoInputError,
  );
  assert.equal(calls, 0);
});

test('a failed upstream agent is visible and blocks dependent agents', async () => {
  const result = await orchestrateDemo(validInput, {
    runId: () => 'failed-run',
    runParking: async () => { throw new Error('injected failure'); },
  });
  assert.equal(result.status, 'failed');
  assert.deepEqual(result.agents.map((agent) => agent.status), ['failed', 'blocked', 'blocked']);
});

test('a failed Chat Guide blocks Venture Viability after Parking Planner completes', async () => {
  const result = await orchestrateDemo(validInput, {
    runId: () => 'chat-failed-run',
    readOccupancy: async () => ({
      sourceStatus: 'empty',
      provenance: 'simulated_or_unverified',
    }),
    runChat: async () => { throw new Error('injected chat failure'); },
  });

  assert.equal(result.status, 'failed');
  assert.deepEqual(result.agents.map((agent) => agent.status), [
    'completed',
    'failed',
    'blocked',
  ]);
  assert.deepEqual(result.agents[2].consumedFrom, ['parking-planner', 'chat-guide']);
});

test('a failed final agent is reported without changing completed upstream results', async () => {
  const result = await orchestrateDemo(validInput, {
    runId: () => 'viability-failed-run',
    readOccupancy: async () => ({
      sourceStatus: 'empty',
      provenance: 'simulated_or_unverified',
    }),
    runViability: async () => { throw new Error('injected viability failure'); },
  });

  assert.equal(result.status, 'failed');
  assert.deepEqual(result.agents.map((agent) => agent.status), [
    'completed',
    'completed',
    'failed',
  ]);
  assert.equal(result.agents[2].output.message, 'Venture Viability Agent failed.');
});

test('orchestration endpoint rejects malformed and oversized request bodies', async () => {
  const malformed = await POST(new Request('http://localhost/api/demo/orchestrate', {
    method: 'POST',
    body: '{',
  }));
  assert.equal(malformed.status, 400);

  const oversized = await POST(new Request('http://localhost/api/demo/orchestrate', {
    method: 'POST',
    body: 'x'.repeat(MAX_DEMO_REQUEST_BYTES + 1),
  }));
  assert.equal(oversized.status, 413);
});
