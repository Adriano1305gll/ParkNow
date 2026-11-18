import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getChatReply, validateMessage } from './chatRules.mjs';
import { buildPlan, isPositiveNumber } from './parkingPlanner.mjs';
import {
  MAX_CUSTOMERS,
  calculateRevenue,
  parseCustomers,
} from './pricingScenarios.mjs';

const ACCESSIBILITY_OPTIONS = new Set([
  'None',
  'Step-free access',
  'Accessible parking space',
]);
const CUSTOMER_PLANS = ['Basic', 'Pro', 'Enterprise'];
export const MAX_DEMO_REQUEST_BYTES = 8 * 1024;

export class DemoInputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DemoInputError';
  }
}

export function validateDemoInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new DemoInputError('Provide a JSON object with trip, question, and ownerScenario.');
  }

  if (new TextEncoder().encode(JSON.stringify(input)).byteLength > MAX_DEMO_REQUEST_BYTES) {
    throw new DemoInputError('Request must be 8 KB or smaller.');
  }

  const trip = input.trip;
  if (!trip || typeof trip !== 'object' || Array.isArray(trip)) {
    throw new DemoInputError('Provide trip details.');
  }

  const destination = typeof trip.destination === 'string' ? trip.destination.trim() : '';
  const arrivalTime = typeof trip.arrivalTime === 'string' ? trip.arrivalTime.trim() : '';
  if (!destination || destination.length > 120 || !arrivalTime) {
    throw new DemoInputError('Enter a destination (up to 120 characters) and arrival time.');
  }
  if (
    !isPositiveNumber(trip.duration) ||
    !isPositiveNumber(trip.walkingTime) ||
    !isPositiveNumber(trip.budget)
  ) {
    throw new DemoInputError('Duration, walking time, and budget must be positive numbers.');
  }
  if (!ACCESSIBILITY_OPTIONS.has(trip.accessibility)) {
    throw new DemoInputError('Choose a supported accessibility option.');
  }

  const chat = validateMessage(input.question);
  if (!chat.ok) throw new DemoInputError(chat.error);

  const ownerScenario = input.ownerScenario;
  if (!ownerScenario || typeof ownerScenario !== 'object' || Array.isArray(ownerScenario)) {
    throw new DemoInputError('Provide Basic, Pro, and Enterprise customer counts.');
  }
  const counts = {};
  for (const plan of CUSTOMER_PLANS) {
    const count = parseCustomers(ownerScenario[plan]);
    if (count === null || count > MAX_CUSTOMERS) {
      throw new DemoInputError(
        `Customer counts must be whole numbers between 0 and ${MAX_CUSTOMERS}.`,
      );
    }
    counts[plan] = count;
  }

  return {
    trip: {
      destination,
      arrivalTime,
      duration: Number(trip.duration),
      walkingTime: Number(trip.walkingTime),
      budget: Number(trip.budget),
      accessibility: trip.accessibility,
    },
    question: chat.text,
    ownerScenario: counts,
  };
}

export function summarizeOccupancyRows(rows) {
  if (!Array.isArray(rows)) {
    return { sourceStatus: 'error', provenance: 'simulated_or_unverified' };
  }
  if (rows.length === 0) {
    return { sourceStatus: 'empty', provenance: 'simulated_or_unverified' };
  }

  let available = 0;
  let occupied = 0;
  for (const row of rows) {
    if (row?.status === 'available') {
      available += 1;
    } else if (row?.status === 'occupied') {
      occupied += 1;
    } else {
      return { sourceStatus: 'error', provenance: 'simulated_or_unverified' };
    }
  }

  return {
    sourceStatus: 'loaded',
    counts: { available, occupied, total: rows.length },
    provenance: 'simulated_or_unverified',
  };
}

export async function readParkingOccupancy() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return {
      sourceStatus: 'not_configured',
      provenance: 'simulated_or_unverified',
    };
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('id, space_number, status')
      .eq('parking_lot_id', 1)
      .order('space_number', { ascending: true });

    if (error) {
      return {
        sourceStatus: 'error',
        message: 'Occupancy snapshot query failed.',
        provenance: 'simulated_or_unverified',
      };
    }
    return summarizeOccupancyRows(data);
  } catch {
    return {
      sourceStatus: 'error',
      message: 'Occupancy snapshot query failed.',
      provenance: 'simulated_or_unverified',
    };
  }
}

export async function runParkingPlanner(trip, { readOccupancy = readParkingOccupancy } = {}) {
  const plan = buildPlan(trip);
  const occupancyContext = await readOccupancy();
  return {
    plan,
    occupancyContext: {
      ...occupancyContext,
      facilityRelation: 'unverified_to_plan',
    },
  };
}

export function runChatGuide(question, parkingOutput) {
  const reply = getChatReply(question);
  if (!reply.ok) throw new DemoInputError(reply.error);

  return {
    intent: reply.intent,
    answer: reply.answer,
    humanHelp: reply.humanHelp,
    relatedPlan: {
      plan: parkingOutput.plan,
      occupancyContext: parkingOutput.occupancyContext,
    },
    dataNotice:
      'Parking recommendations are simulated. Occupancy context is unverified and is not mapped to the recommendation.',
  };
}

export function runVentureViability(ownerScenario, parkingOutput, chatOutput) {
  const counts = Object.fromEntries(
    CUSTOMER_PLANS.map((plan) => [plan, parseCustomers(ownerScenario[plan])]),
  );
  const monthlyRevenueMxn = calculateRevenue(counts);
  return {
    counts,
    monthlyRevenueMxn,
    annualRevenueMxn: monthlyRevenueMxn * 12,
    assumptions: [
      'Customer counts are hypothetical inputs, not observed customers.',
      'Pricing uses the existing illustrative monthly plan prices.',
    ],
    dataBasis:
      `Parking snapshot status: ${parkingOutput.occupancyContext.sourceStatus}; ` +
      `chat intent: ${chatOutput.intent}. Neither is evidence of customers, ` +
      'bookings, validated demand, or willingness to pay.',
  };
}

function agentRecord(agentId, status, output, consumedFrom = []) {
  return { agentId, status, output, consumedFrom };
}

function blockedRecord(agentId, consumedFrom) {
  return agentRecord(
    agentId,
    'blocked',
    { message: 'A required upstream agent did not complete.' },
    consumedFrom,
  );
}

export async function orchestrateDemo(
  input,
  {
    readOccupancy = readParkingOccupancy,
    runParking = (trip) => runParkingPlanner(trip, { readOccupancy }),
    runChat = runChatGuide,
    runViability = runVentureViability,
    runId = randomUUID,
  } = {},
) {
  const validated = validateDemoInput(input);
  const id = runId();
  const agents = [];

  let parkingOutput;
  try {
    parkingOutput = await runParking(validated.trip);
    agents.push(agentRecord('parking-planner', 'completed', parkingOutput));
  } catch {
    agents.push(agentRecord('parking-planner', 'failed', {
      message: 'Parking Planner Agent failed.',
    }));
    agents.push(blockedRecord('chat-guide', ['parking-planner']));
    agents.push(blockedRecord('venture-viability', ['parking-planner', 'chat-guide']));
    return { runId: id, status: 'failed', agents };
  }

  let chatOutput;
  try {
    chatOutput = await runChat(validated.question, parkingOutput);
    agents.push(agentRecord('chat-guide', 'completed', chatOutput, ['parking-planner']));
  } catch {
    agents.push(agentRecord('chat-guide', 'failed', {
      message: 'Chat Guide Agent failed.',
    }, ['parking-planner']));
    agents.push(blockedRecord('venture-viability', ['parking-planner', 'chat-guide']));
    return { runId: id, status: 'failed', agents };
  }

  try {
    const viabilityOutput = await runViability(
      validated.ownerScenario,
      parkingOutput,
      chatOutput,
    );
    agents.push(agentRecord(
      'venture-viability',
      'completed',
      viabilityOutput,
      ['parking-planner', 'chat-guide'],
    ));
  } catch {
    agents.push(agentRecord('venture-viability', 'failed', {
      message: 'Venture Viability Agent failed.',
    }, ['parking-planner', 'chat-guide']));
    return { runId: id, status: 'failed', agents };
  }

  return { runId: id, status: 'completed', agents };
}
