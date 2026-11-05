import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { OWNER_COOKIE, getAdminClient, hashOwner, validateFeedback } from '../../../../lib/chatServer.mjs';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const check = validateFeedback(body);
  if (!check.ok) return NextResponse.json({ error: check.error }, { status: 400 });
  const { messageId, conversationId, rating, comment } = check.value;

  const db = getAdminClient();
  if (!db) return NextResponse.json({ error: 'Feedback storage is not configured. Feedback was not saved.' }, { status: 503 });

  const token = (await cookies()).get(OWNER_COOKIE)?.value;
  if (!token || !/^[0-9a-f]{64}$/.test(token)) {
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
  }

  try {
    // The message must be an assistant reply in a conversation owned by this browser.
    const { data: msg, error: msgErr } = await db
      .from('chat_messages')
      .select('id, chat_conversations!inner(owner_hash)')
      .eq('id', messageId).eq('conversation_id', conversationId).eq('role', 'assistant')
      .eq('chat_conversations.owner_hash', hashOwner(token))
      .maybeSingle();
    if (msgErr) throw msgErr;
    if (!msg) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });

    const { error } = await db
      .from('chat_feedback')
      .insert({ message_id: messageId, conversation_id: conversationId, rating, comment });
    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Feedback was already submitted for this answer.' }, { status: 409 });
      throw error;
    }
    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: 'Feedback could not be saved. Please try again.' }, { status: 500 });
  }
}
