import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getChatReply } from '../../../../lib/chatRules.mjs';
import { OWNER_COOKIE, getAdminClient, hashOwner, isUuid, newId, newOwnerToken } from '../../../../lib/chatServer.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const reply = getChatReply(body?.text);
  if (!reply.ok) return NextResponse.json({ error: reply.error }, { status: 400 });
  const { ok, ...answer } = reply;
  const unsaved = (reason) => NextResponse.json({ ...answer, saved: false, saveError: reason });

  const db = getAdminClient();
  if (!db) return unsaved('Chat history is not configured, so this conversation was not saved.');

  const jar = await cookies();
  let token = jar.get(OWNER_COOKIE)?.value;
  const newToken = !token || !/^[0-9a-f]{64}$/.test(token);
  if (newToken) token = newOwnerToken();
  const ownerHash = hashOwner(token);

  let conversationId = body.conversationId;
  if (conversationId !== undefined && conversationId !== null && !isUuid(conversationId)) {
    return NextResponse.json({ error: 'Invalid conversation.' }, { status: 400 });
  }

  try {
    if (conversationId) {
      const { data, error } = await db
        .from('chat_conversations').select('id').eq('id', conversationId).eq('owner_hash', ownerHash).maybeSingle();
      if (error) throw error;
      if (!data) return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
    } else {
      conversationId = newId();
      const { error } = await db.from('chat_conversations').insert({ id: conversationId, owner_hash: ownerHash });
      if (error) throw error;
    }

    const now = Date.now();
    const userMessageId = newId();
    const messageId = newId();
    const { error } = await db.from('chat_messages').insert([
      { id: userMessageId, conversation_id: conversationId, role: 'user', content: String(body.text).trim(), created_at: new Date(now).toISOString() },
      { id: messageId, conversation_id: conversationId, role: 'assistant', content: answer.answer, intent: answer.intent, created_at: new Date(now + 1).toISOString() },
    ]);
    if (error) throw error;

    const res = NextResponse.json({ ...answer, saved: true, conversationId, messageId });
    if (newToken) {
      res.cookies.set(OWNER_COOKIE, token, {
        httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 30,
      });
    }
    return res;
  } catch {
    return unsaved('Could not save this conversation. Feedback is unavailable for this answer.');
  }
}
