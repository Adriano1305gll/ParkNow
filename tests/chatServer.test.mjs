import test from 'node:test';
import assert from 'node:assert/strict';
import { validateFeedback, hashOwner, newId } from '../lib/chatServer.mjs';

const ids = { messageId: newId(), conversationId: newId() };

test('accepts valid feedback and trims comment', () => {
  const r = validateFeedback({ ...ids, rating: 'up', comment: '  nice ' });
  assert.equal(r.ok, true);
  assert.equal(r.value.comment, 'nice');
});
test('rejects bad rating, ids, and long comments', () => {
  assert.equal(validateFeedback({ ...ids, rating: 'meh' }).ok, false);
  assert.equal(validateFeedback({ ...ids, messageId: 'x', rating: 'up' }).ok, false);
  assert.equal(validateFeedback({ ...ids, rating: 'up', comment: 'a'.repeat(501) }).ok, false);
  assert.equal(validateFeedback(null).ok, false);
});
test('owner hash is 64 hex chars', () => {
  assert.match(hashOwner('abc'), /^[0-9a-f]{64}$/);
});
