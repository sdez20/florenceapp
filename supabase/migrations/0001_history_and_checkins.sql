-- Florence history storage.
--
-- Run this once in your Supabase project: Dashboard -> SQL Editor -> paste ->
-- Run (or `supabase db push` if you use the CLI).
--
-- PRIVACY: every table has Row Level Security ON, and every policy is scoped to
-- `auth.uid() = user_id`. A signed-in user can only ever read or write their OWN
-- rows. Because access is enforced by RLS on the database, the public
-- (publishable) key in the browser can never reach another person's data.
-- Supabase encrypts data at rest, and all traffic is over HTTPS.

-- ---------------------------------------------------------------------------
-- Chat messages (her conversations with Florence)
-- ---------------------------------------------------------------------------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  role       text not null check (role in ('user', 'assistant')),
  content    text not null,
  focus      text,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select using (auth.uid() = user_id);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages
  for insert with check (auth.uid() = user_id);

drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own" on public.messages
  for delete using (auth.uid() = user_id);

create index if not exists messages_user_created_idx
  on public.messages (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Daily check-ins (her logged patterns — qualitative feeling words, no scores)
-- ---------------------------------------------------------------------------
create table if not exists public.checkins (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid()
             references auth.users (id) on delete cascade,
  day        date not null default current_date,
  mental     text,
  emotional  text,
  nutrition  text,
  created_at timestamptz not null default now(),
  unique (user_id, day)
);

alter table public.checkins enable row level security;

drop policy if exists "checkins_all_own" on public.checkins;
create policy "checkins_all_own" on public.checkins
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists checkins_user_day_idx
  on public.checkins (user_id, day desc);
