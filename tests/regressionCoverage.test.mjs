import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import {
  buildPlan,
  getEstimatedCost,
  isPositiveNumber,
} from '../lib/parkingPlanner.mjs';
import {
  validateMessage,
  getChatReply,
  STARTER_QUESTIONS,
  MAX_MESSAGE_LENGTH,
} from '../lib/chatRules.mjs';
import {
  prices,
  scenarios,
  parseCustomers,
  calculateRevenue,
  validateScenario,
  MAX_CUSTOMERS,
} from '../lib/pricingScenarios.mjs';
import { posts, scripts, audiences } from '../lib/marketingContent.mjs';
import { campaignDays, audienceLabels } from '../lib/campaignCalendar.mjs';

// ============================================================================
// REGRESSION TESTS: Parking Planner core business logic
// ============================================================================

test('parking planner: buildPlan filters by walking time constraint', () => {
  const form = {
    destination: 'Downtown',
    arrivalTime: '10:00',
    duration: 60,
    walkingTime: 10,
    budget: 100,
    accessibility: 'None',
  };

  const plan = buildPlan(form);
  assert(plan.bestOption, 'Should recommend a parking option');
  assert(
    plan.walkingMinutes <= 10,
    'Recommended option should respect walking time constraint'
  );
});

test('parking planner: buildPlan filters by budget constraint', () => {
  const form = {
    destination: 'Downtown',
    arrivalTime: '10:00',
    duration: 60,
    walkingTime: 30,
    budget: 2,
    accessibility: 'None',
  };

  const plan = buildPlan(form);
  assert(plan.estimatedCost <= 2, 'Recommended option cost should respect budget constraint');
});

test('parking planner: buildPlan respects accessibility requirement', () => {
  const form = {
    destination: 'Downtown',
    arrivalTime: '10:00',
    duration: 60,
    walkingTime: 30,
    budget: 100,
    accessibility: 'Mobility',
  };

  const plan = buildPlan(form);
  assert(
    plan.bestOption && plan.bestOption.accessible === true,
    'Recommended option must be accessible when required'
  );
});

test('parking planner: buildPlan returns unavailable when no option matches', () => {
  const form = {
    destination: 'Downtown',
    arrivalTime: '10:00',
    duration: 60,
    walkingTime: 1,
    budget: 1,
    accessibility: 'None',
  };

  const plan = buildPlan(form);
  assert(plan.unavailable === true, 'Should report unavailable when no option matches');
  assert(plan.risks, 'Should provide reasons why unavailable');
});

test('parking planner: getEstimatedCost rounds up correctly', () => {
  const cost1Hour = getEstimatedCost({ costPerHour: 3 }, 60);
  assert.equal(cost1Hour, 3, '60 minutes should cost 1 hour rate');
  
  const costRoundUp = getEstimatedCost({ costPerHour: 3 }, 61);
  assert.equal(costRoundUp, 6, '61 minutes should round up to 2 hours');
});

test('parking planner: isPositiveNumber validates correctly', () => {
  assert.equal(isPositiveNumber(1), true, 'Should accept positive number');
  assert.equal(isPositiveNumber(0), false, 'Should reject zero');
  assert.equal(isPositiveNumber(-5), false, 'Should reject negative');
  assert.equal(isPositiveNumber('abc'), false, 'Should reject non-numeric');
});

// ============================================================================
// REGRESSION TESTS: Chat Rules and Message Validation
// ============================================================================

test('chat rules: validateMessage accepts valid input', () => {
  const result = validateMessage('How much is parking downtown?');
  assert.equal(result.ok, true, 'Valid message should pass validation');
});

test('chat rules: validateMessage rejects empty input', () => {
  const result = validateMessage('');
  assert.equal(result.ok, false, 'Empty message should fail validation');
  assert(result.error, 'Should provide error message');
});

test('chat rules: validateMessage rejects oversized input', () => {
  const oversized = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
  const result = validateMessage(oversized);
  assert.equal(result.ok, false, 'Oversized message should fail');
  assert(result.error.includes('under'), 'Error should mention character limit');
});

test('chat rules: getChatReply handles starter questions', () => {
  const starterQuestion = STARTER_QUESTIONS[0];
  const reply = getChatReply(starterQuestion);
  assert(reply && reply.answer, 'Should handle starter question successfully');
  assert(reply.ok === true, 'Should return ok status');
});

test('chat rules: getChatReply handles unsupported questions gracefully', () => {
  const reply = getChatReply('xyzqeufhsjdkfhskdjfh');
  assert(reply.ok, 'Should still return ok for unsupported questions');
  assert(reply.humanHelp === true, 'Should indicate human help needed');
  assert(reply.answer, 'Should provide answer text');
});

// ============================================================================
// REGRESSION TESTS: Pricing Scenarios (Core Business Logic)
// ============================================================================

test('pricing: price constants are intact', () => {
  assert.deepEqual(prices, { Basic: 499, Pro: 1499, Enterprise: 3999 });
});

test('pricing: pre-built scenarios are intact', () => {
  assert.deepEqual(scenarios.Conservative, { Basic: 10, Pro: 5, Enterprise: 1 });
  assert.deepEqual(scenarios.Expected, { Basic: 20, Pro: 10, Enterprise: 3 });
  assert.deepEqual(scenarios.Optimistic, {
    Basic: 50,
    Pro: 25,
    Enterprise: 10,
  });
});

test('pricing: parseCustomers accepts valid whole numbers', () => {
  assert.equal(parseCustomers('100'), 100);
  assert.equal(parseCustomers('0'), 0);
  assert.equal(parseCustomers(50000), 50000);
});

test('pricing: parseCustomers rejects negative and decimal numbers', () => {
  assert.equal(parseCustomers('-1'), null);
  assert.equal(parseCustomers('50.5'), null);
});

test('pricing: parseCustomers respects MAX_CUSTOMERS limit', () => {
  assert.equal(parseCustomers(MAX_CUSTOMERS), MAX_CUSTOMERS);
  assert.equal(parseCustomers(MAX_CUSTOMERS + 1), null);
});

test('pricing: calculateRevenue returns correct monthly total', () => {
  const customers = { Basic: 10, Pro: 5, Enterprise: 1 };
  const revenue = calculateRevenue(customers);
  const expected = 10 * 499 + 5 * 1499 + 1 * 3999;
  assert.equal(revenue, expected);
});

test('pricing: calculateRevenue treats invalid counts as zero', () => {
  const customers = { Basic: null, Pro: 'invalid', Enterprise: undefined };
  const revenue = calculateRevenue(customers);
  assert.equal(revenue, 0);
});

test('pricing: validateScenario rejects empty name and invalid counts', () => {
  assert(validateScenario('', { Basic: 10, Pro: 5, Enterprise: 1 }), 'Should reject empty name');
  assert(validateScenario('Test', { Basic: 'abc', Pro: 5, Enterprise: 1 }), 'Should reject invalid counts');
});

test('pricing: validateScenario accepts valid scenario', () => {
  const error = validateScenario('Valid', { Basic: 10, Pro: 5, Enterprise: 1 });
  assert.equal(error, null, 'Should accept valid scenario');
});

// ============================================================================
// REGRESSION TESTS: Marketing Content Data Integrity
// ============================================================================

test('marketing: posts have required fields', () => {
  assert(Array.isArray(posts) && posts.length > 0, 'Posts should be non-empty array');
  posts.forEach((post) => {
    assert(post.id && post.title && post.body && post.platform && post.audience, 
      'Post should have id, title, body, platform, and audience');
  });
});

test('marketing: scripts have required fields', () => {
  assert(Array.isArray(scripts) && scripts.length > 0, 'Scripts should be non-empty array');
  scripts.forEach((script) => {
    assert(script.id && script.title && script.hook && script.narration && script.cta,
      'Script should have id, title, hook, narration, and cta');
  });
});

test('marketing: audiences are defined and labeled', () => {
  assert(audiences && Object.keys(audiences).length > 0, 'Audiences should be defined');
  assert(audienceLabels && Object.keys(audienceLabels).length > 0, 'Audience labels should be defined');
});

test('marketing: campaign calendar has 14 consecutive days', () => {
  assert(Array.isArray(campaignDays) && campaignDays.length === 14, 
    'Should have exactly 14 campaign days');
  campaignDays.forEach((day) => {
    assert(day.day && day.audience && day.platform && day.message,
      'Each day should have day, audience, platform, and message');
  });
});

// ============================================================================
// REGRESSION TESTS: Route file existence (all 12 routes)
// ============================================================================

test('routes: all 12 required routes exist and export components', () => {
  const routes = [
    '/',
    '/parking',
    '/core',
    '/chat',
    '/assistant',
    '/dashboard',
    '/pricing',
    '/research',
    '/marketing',
    '/product',
    '/docs',
    '/demo',
  ];

  routes.forEach((route) => {
    const path = route === '/' 
      ? '/workspaces/ParkNow/app/page.js' 
      : `/workspaces/ParkNow/app${route}/page.js`;
    
    try {
      const content = readFileSync(path, 'utf-8');
      assert(
        content.includes('export default') || content.includes('export function'),
        `Route ${route} should export a default or named function`
      );
    } catch (err) {
      assert.fail(`Route file for ${route} not found or not readable`);
    }
  });
});

test('routes: home page has personas and benefits content', () => {
  const content = readFileSync('/workspaces/ParkNow/app/page.js', 'utf-8');
  assert(content.includes('driverBenefits'), 'Home should define driver benefits');
  assert(content.includes('ownerBenefits'), 'Home should define owner benefits');
  assert(content.includes('personas'), 'Home should define personas');
});

test('routes: parking page connects to Supabase parking_spaces table', () => {
  const content = readFileSync('/workspaces/ParkNow/app/parking/page.js', 'utf-8');
  assert(content.includes('supabase'), 'Parking page should use Supabase');
  assert(content.includes('parking_spaces'), 'Parking page should query parking_spaces table');
});

test('routes: pricing page includes pricing plans and simulator', () => {
  const content = readFileSync('/workspaces/ParkNow/app/pricing/page.js', 'utf-8');
  assert(content.includes('PricingSimulator'), 'Pricing page should use PricingSimulator component');
  assert(content.includes('plans'), 'Pricing page should define pricing plans');
});

test('routes: dashboard page loads from both parking and research tables', () => {
  const content = readFileSync('/workspaces/ParkNow/app/dashboard/page.js', 'utf-8');
  assert(content.includes('parking_spaces'), 'Dashboard should load parking data');
  assert(content.includes('research_records'), 'Dashboard should load research data');
});

test('routes: demo page includes three-agent orchestration', () => {
  const content = readFileSync('/workspaces/ParkNow/app/demo/page.js', 'utf-8');
  assert(
    content.includes('demoOrchestrator') || content.includes('orchestrat'),
    'Demo page should use orchestration'
  );
  assert(content.includes('Parking'), 'Demo should reference Parking Planner');
  assert(content.includes('Chat'), 'Demo should reference Chat Guide');
  assert(content.includes('Venture'), 'Demo should reference Venture Viability');
});

test('routes: chat page validates messages using chatRules', () => {
  const content = readFileSync('/workspaces/ParkNow/app/chat/page.js', 'utf-8');
  assert(
    content.includes('validateMessage') || content.includes('chatRules'),
    'Chat page should validate messages'
  );
});

test('routes: research page stores to research_records table', () => {
  const content = readFileSync('/workspaces/ParkNow/app/research/page.js', 'utf-8');
  assert(content.includes('research_records'), 'Research page should use research_records table');
});

test('routes: core page demonstrates buildPlan from parking planner', () => {
  const content = readFileSync('/workspaces/ParkNow/app/core/page.js', 'utf-8');
  assert(
    content.includes('buildPlan') || content.includes('parkingPlanner'),
    'Core page should demonstrate buildPlan function'
  );
});
