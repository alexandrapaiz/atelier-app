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

-- ============ account deletion (App Store guideline 5.1.1(v)) ============
-- The app must be able to delete the account from inside itself, and the
-- publishable key that ships in the page cannot touch auth.users. So the
-- delete runs here, as the user who asked for it: security definer, scoped
-- to auth.uid(), no arguments to get wrong.
--
-- Deleting the auth row is the whole deletion. public.atelier_state goes with
-- it through its own `on delete cascade`, and Supabase's auth schema cascades
-- auth.sessions, auth.refresh_tokens and auth.identities the same way — which
-- is what revokes the tokens the Claude connector holds. One statement, no
-- orphans.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not signed in';
  end if;
  delete from auth.users where id = uid;
end;
$$;

-- Only a signed-in caller may reach it, and it can only ever delete the caller.
revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
