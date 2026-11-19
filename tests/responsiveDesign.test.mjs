import { test } from 'node:test';
import * as assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

const demoPagePath = path.join(process.cwd(), 'app/demo/page.js');
const globalsCssPath = path.join(process.cwd(), 'app/globals.css');
const pageComponentPath = path.join(process.cwd(), 'components/Page.js');

const demoPageContent = fs.readFileSync(demoPagePath, 'utf-8');
const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf-8');
const pageComponentContent = fs.readFileSync(pageComponentPath, 'utf-8');

test('Form inputs use responsive grid classes for mobile', () => {
  // Trip request fieldset should have responsive grid for small screens
  assert.match(
    demoPageContent,
    /grid gap-4 sm:grid-cols-2|grid gap-4.*grid-cols-1.*sm:grid-cols-2|grid.*sm:grid-cols-2/,
    'Trip request form should use sm: breakpoint for 2-column layout',
  );
});

test('Form inputs break to single column on mobile', () => {
  // Should default to full-width/single-column on small screens
  assert.match(
    demoPageContent,
    /md:grid-cols-2/,
    'Main form fieldset uses md: (768px) breakpoint ensuring single column on mobile',
  );
});

test('Agent result cards have responsive columns', () => {
  // Agent results should use responsive grid with single column default
  assert.match(
    demoPageContent,
    /grid gap-4 lg:grid-cols-3/,
    'Agent result cards should stack to single column by default and reach 3 columns at lg (1024px)',
  );
});

test('Card padding is responsive', () => {
  // Should have smaller padding on mobile
  assert.match(
    globalsCssContent,
    /\.card\s*{[^}]*padding:/,
    'Card component should define padding',
  );
});

test('Page component uses responsive padding', () => {
  // Page wrapper should use responsive horizontal padding
  assert.match(
    pageComponentContent,
    /px-6/,
    'Page component should use px-6 (1.5rem) padding for mobile-friendly horizontal spacing',
  );
});

test('Navigation uses responsive grid on mobile', () => {
  // Nav-shell should stack on mobile
  assert.match(
    globalsCssContent,
    /@media.*\(max-width:\s*800px\).*\.nav-shell\s*{.*grid/s,
    'Navigation shell should use grid layout on screens 800px or smaller',
  );
});

test('Parking grid is responsive at mobile breakpoint', () => {
  // Parking grid should reduce columns on small screens
  assert.match(
    globalsCssContent,
    /\.parking-grid\s*{[^}]*grid-template-columns: repeat\(6, 1fr\)/,
    'Parking grid should start with 6 columns on desktop',
  );
  assert.match(
    globalsCssContent,
    /@media.*\(max-width:\s*800px\).*\.parking-grid\s*{[^}]*grid-template-columns: repeat\(3, 1fr\)/s,
    'Parking grid should reduce to 3 columns at 800px breakpoint',
  );
});

test('Form error messages are readable on mobile', () => {
  // Error messages should use text-sm and have proper aria attributes
  assert.match(
    demoPageContent,
    /className="text-sm text-red-200"/,
    'Error messages should use small font size for mobile readability',
  );
});

test('Button wrapping preserves functionality on mobile', () => {
  // Submit button section uses flex-wrap to allow wrapping on mobile
  assert.match(
    demoPageContent,
    /flex flex-wrap items-center gap-4/,
    'Button section should use flex-wrap to stack on mobile screens',
  );
});

test('Form fieldsets stack vertically on all screen sizes', () => {
  // Fieldsets should use grid gap to separate vertically
  assert.match(
    demoPageContent,
    /fieldset className="grid gap-/g,
    'All fieldsets should use grid with gap for vertical stacking',
  );
});

test('Responsive text sizing for headings', () => {
  // H1 uses clamp for fluid scaling
  assert.match(
    globalsCssContent,
    /h1\s*{[^}]*font-size:\s*clamp\(/,
    'H1 should use clamp() for fluid responsive sizing',
  );
});

test('Agent card header layout is responsive', () => {
  // Agent card header should flex-wrap to prevent overflow
  assert.match(
    demoPageContent,
    /flex flex-wrap items-center justify-between gap-3/,
    'Agent card header should use flex-wrap for mobile responsiveness',
  );
});

test('Two-column sections have responsive breakpoint', () => {
  // md:grid-cols-2 for sections that should be 2 columns on medium+ screens
  assert.match(
    demoPageContent,
    /grid gap-5 md:grid-cols-2/,
    'Two-column sections should use md: (768px) breakpoint',
  );
});

test('Feature list grid is responsive', () => {
  // Features should start single column, then 2 on sm, then 4 on lg
  assert.match(
    demoPageContent,
    /grid gap-3 sm:grid-cols-2 lg:grid-cols-4/,
    'Feature list should be responsive: 1 column on mobile, 2 on sm (640px), 4 on lg (1024px)',
  );
});

test('Form width does not exceed viewport at minimum width', () => {
  // Page wrapper max-width and percentage width should prevent overflow
  assert.match(
    globalsCssContent,
    /main\s*{[^}]*width:\s*min\(1180px, 92%\)/,
    'Main content width should use min() to prevent overflow on small screens',
  );
  assert.match(
    globalsCssContent,
    /nav-shell\s*{[^}]*width:\s*min\(1180px, 92%\)/,
    'Navigation width should also use min() for consistent mobile handling',
  );
});

test('Input fields are full width in forms', () => {
  // All form inputs should use w-full for consistent mobile display
  assert.match(
    demoPageContent,
    /input.*className="w-full/g,
    'Input elements should use w-full class for full-width display on all screen sizes',
  );
});

test('Textarea is full width for question input', () => {
  // Question textarea should be full width
  assert.match(
    demoPageContent,
    /textarea.*className="w-full/,
    'Question textarea should use w-full for full-width display on mobile',
  );
});

test('Select dropdown is full width for accessibility need', () => {
  // Select should be full width
  assert.match(
    demoPageContent,
    /select.*className="w-full/,
    'Select dropdown should use w-full for full-width display on mobile',
  );
});
