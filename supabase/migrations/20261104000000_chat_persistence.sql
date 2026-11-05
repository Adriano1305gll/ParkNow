-- Chat conversations, messages, and feedback.
-- Access is only through server-side API routes using the service-role key.
-- Ownership: each browser gets a random secret (httpOnly cookie); only its SHA-256 hash is stored.
create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),
  owner_hash text not null check (char_length(owner_hash) = 64),
  created_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 2000),
  intent text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_feedback (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null unique references public.chat_messages (id) on delete cascade,
  conversation_id uuid not null references public.chat_conversations (id) on delete cascade,
  rating text not null check (rating in ('up', 'down')),
  comment text check (comment is null or char_length(comment) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_conversation_idx
  on public.chat_messages (conversation_id, created_at);
create index if not exists chat_conversations_owner_idx
  on public.chat_conversations (owner_hash);

-- RLS on with no policies for anon/authenticated: the public (publishable) key cannot read or write
-- any chat data, so users cannot see other users' conversations. The service role bypasses RLS.
alter table public.chat_conversations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_feedback enable row level security;

revoke all on public.chat_conversations, public.chat_messages, public.chat_feedback from anon, authenticated;