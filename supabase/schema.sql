-- Atelier · Supabase schema
-- Run this once in your project's SQL editor (Dashboard → SQL Editor → New query → paste → Run).
-- Safe to re-run: everything is idempotent.

-- The whole app state travels as one document, exactly the same shape the app
-- keeps in the browser and used to sync through GitHub. One row per user.
create table if not exists public.atelier_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  doc        jsonb not null,
  updated_at timestamptz not null default now()
);

-- The site is public, so the anon key travels with it. Row-level security is
-- what keeps the data private: only the signed-in owner can touch their row.
alter table public.atelier_state enable row level security;

drop policy if exists "own row" on public.atelier_state;
create policy "own row" on public.atelier_state
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Instant cross-device sync: let realtime broadcast changes to this table.
do $$
begin
  alter publication supabase_realtime add table public.atelier_state;
exception
  when duplicate_object then null;
end $$;
