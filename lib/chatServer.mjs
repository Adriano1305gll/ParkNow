import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const MAX_COMMENT_LENGTH = 500;
export const OWNER_COOKIE = 'parknow_chat_owner';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v) => typeof v === 'string' && UUID_RE.test(v);
export const newId = () => randomUUID();
export const newOwnerToken = () => randomBytes(32).toString('hex');
export const hashOwner = (token) => createHash('sha256').update(token).digest('hex');

export function validateFeedback(body) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' };
  const { messageId, conversationId, rating } = body;
  if (!isUuid(messageId) || !isUuid(conversationId)) return { ok: false, error: 'Invalid message.' };
  if (rating !== 'up' && rating !== 'down') return { ok: false, error: 'Rating must be up or down.' };
  let comment = null;
  if (body.comment !== undefined && body.comment !== null) {
    if (typeof body.comment !== 'string') return { ok: false, error: 'Invalid comment.' };
    comment = body.comment.trim() || null;
    if (comment && comment.length > MAX_COMMENT_LENGTH) {
      return { ok: false, error: `Please keep feedback under ${MAX_COMMENT_LENGTH} characters.` };
    }
  }
  return { ok: true, value: { messageId, conversationId, rating, comment } };
}

// Server-only: uses the service-role key, which must never be exposed to the client.
export function getAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
