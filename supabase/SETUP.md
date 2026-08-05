# Atelier × Supabase — current state

Setup is DONE (2026-08-05). The database lives in the Supabase project
**alexandra-projects** (ref `zzavasgpgprtkepiekda`, owned by
alexandrapaizdelgado@gmail.com — renamed from "classics-library").
`schema.sql` has been run there: table `public.atelier_state`, one jsonb row
per user, RLS owner-only, realtime on.

The app has the project URL and publishable key baked in (`SB_FIXED` in
index.html), so no device ever pastes keys.

## Using it on any device

1. Open https://alexandrapaiz.github.io/atelier-app/
2. Footer → **Connect database** → sign in with your email + password.
   The first sign-in ever creates the account; a device that holds data
   seeds the database with it, an empty device pulls everything down.

## If a device shows an empty app

Its browser storage was cleared — nothing is lost. Connect database → sign in
and everything returns. (Backups also live in `~/Desktop/Atelier/*.json` and
the old `atelier-data` GitHub repo.)

## Re-running the schema

`schema.sql` is idempotent — safe to paste into the SQL editor again anytime.
