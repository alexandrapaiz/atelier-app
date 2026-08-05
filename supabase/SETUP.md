# Hooking Atelier up to Supabase — one-time setup

The app is done; it just needs your database's keys. Five minutes, once.

1. **Open your Supabase project** at [supabase.com/dashboard](https://supabase.com/dashboard).
   You can reuse the existing `corpus` project (`amxakgexxuaztaiddbfz`) — Atelier keeps
   to its own table — or make a fresh project just for Atelier. Either works.

2. **Run the schema.** SQL Editor → New query → paste all of `schema.sql` → Run.
   It creates one table (`atelier_state`), locks it down so only you can read it,
   and turns on realtime.

3. **(Recommended) Skip email confirmation.** Authentication → Sign In / Providers →
   Email → turn **off** "Confirm email". It's a single-person app; the confirmation
   dance adds nothing. If you leave it on, you'll just have to click one link in
   your inbox the first time.

4. **Copy the anon key.** Project Settings → API Keys → copy the `anon` / `public`
   key (the long one starting `eyJ…` or `sb_publishable_…`). This key is safe in a
   public page — row-level security is what protects the data.

5. **In Atelier** (https://alexandrapaiz.github.io/atelier-app/), footer →
   **Connect database** → paste the project URL and the anon key → then sign in
   with your email and a password of your choosing. The first sign-in creates
   your account; the first device seeds the database with everything it has.

6. **On every other device** (phone, iPad): footer → Connect database → same URL,
   same key, same email + password. Done — edits flow both ways within seconds.

Once connected you can disconnect the old GitHub sync (the × next to it in the
footer) — the database replaces it. Export backup still works anytime.
