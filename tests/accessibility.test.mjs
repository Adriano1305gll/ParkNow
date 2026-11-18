import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs/promises';

test('Demo page form fields have accessible names', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check accessibility need select has aria-label
  assert.match(demoPage, /aria-label="Accessibility need"/, 
    'Accessibility need select should have aria-label');
  
  // Check customer count inputs have aria-label
  assert.match(demoPage, /aria-label=\{`\$\{plan\} customers`\}/, 
    'Customer count inputs should have aria-label for each plan');
});

test('Demo page form fields have proper IDs and associations', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check all required form fields have IDs
  const requiredFields = ['destination', 'arrivalTime', 'duration', 'walkingTime', 'budget', 'accessibility', 'question'];
  for (const field of requiredFields) {
    assert.match(demoPage, new RegExp(`id="${field}"`), 
      `Form field ${field} should have an id attribute`);
  }
});

test('Demo page error messages are properly associated', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check that FieldError component has role="alert"
  assert.match(demoPage, /role="alert".*className="text-sm text-red-200"/, 
    'Error messages should have role="alert" for screen readers');
  
  // Check aria-invalid and aria-describedby are paired
  assert.match(demoPage, /aria-invalid=\{Boolean\(errors\.destination\)\}/, 
    'destination input should have aria-invalid');
  
  assert.match(demoPage, /aria-describedby="destination-error"/, 
    'destination input should have aria-describedby');
});

test('Demo page form has live region for status updates', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check for role="status" with aria-live for running workflow
  assert.match(demoPage, /role="status"/, 
    'Should have role="status" for running workflow status');
  
  assert.match(demoPage, /aria-live="polite"/, 
    'Should have aria-live="polite" for async updates');
});

test('Navigation component uses semantic HTML', async () => {
  const nav = await fs.readFile('./components/Nav.js', 'utf-8');
  
  // Check for header element
  assert.match(nav, /className="site-header"/, 
    'Navigation should be in a header element');
  
  // Check for navigation semantic role
  assert.match(nav, /role="navigation"/, 
    'Navigation should have role="navigation"');
  
  // Check brand link has aria-label
  assert.match(nav, /aria-label="Park Now home"/, 
    'Brand link should have aria-label for home page');
});

test('Layout provides skip-to-content link', async () => {
  const layout = await fs.readFile('./app/layout.js', 'utf-8');
  
  // Check for skip link
  assert.match(layout, /skip-link/, 
    'Layout should include skip-to-main-content link');
  
  // Check for main element with id
  assert.match(layout, /id="main-content"/, 
    'Layout should have main element with id="main-content"');
  
  // Check lang attribute
  assert.match(layout, /lang="en"/, 
    'HTML element should have lang attribute');
});

test('Global styles include focus-visible handling', async () => {
  const globals = await fs.readFile('./app/globals.css', 'utf-8');
  
  // Check for focus-visible styles
  assert.match(globals, /:focus-visible/, 
    'Global styles should include focus-visible styles');
  
  // Check skip link focus behavior
  assert.match(globals, /\.skip-link:focus/, 
    'Skip link should have focus styles');
});

test('Demo page fieldsets have legends', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check fieldset elements have legend
  assert.match(demoPage, /<fieldset.*?<legend.*?Trip request/s, 
    'Trip request fieldset should have legend');
  
  assert.match(demoPage, /<fieldset.*?<legend.*?Parking question/s, 
    'Parking question fieldset should have legend');
  
  assert.match(demoPage, /<fieldset.*?<legend.*?Owner scenario/s, 
    'Owner scenario fieldset should have legend');
});

test('Form buttons have clear, descriptive text', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check submit button text
  assert.match(demoPage, /Run three-agent demo/, 
    'Submit button should have clear, descriptive text');
  
  // Check button disabled state indicates loading
  assert.match(demoPage, /disabled=\{running\}/, 
    'Submit button should be disabled during execution');
});

test('Demo page sections have proper headings', async () => {
  const demoPage = await fs.readFile('./app/demo/page.js', 'utf-8');
  
  // Check for h2 headings in major sections
  const h2Headings = demoPage.match(/<h2[^>]*>/g) || [];
  assert.ok(h2Headings.length >= 4, 'Demo page should have multiple h2 headings');
  
  // Check for h3 headings for subsections
  const h3Headings = demoPage.match(/<h3[^>]*>/g) || [];
  assert.ok(h3Headings.length >= 1, 'Demo page should have h3 headings for subsections');
});

