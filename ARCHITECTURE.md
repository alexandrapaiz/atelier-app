# Atelier — Deployment Architecture & Roadmap

*The plan for taking Atelier multi-user, on the web and in the App Store.
Guiding principle: ship on today's foundation, evolve the foundation behind
stable behavior. Never a big-bang rewrite.*

## The shape: one core, three shells, one spine

```
                    ┌─────────────────────────────┐
                    │   packages/core (TypeScript)│
                    │   domain types · nlParse ·  │
                    │   merge/sync engine · tests │
                    └──────┬──────────┬───────────┘
              ┌────────────┤          ├────────────┐
        apps/web      apps/ios (Capacitor)    apps/mcp (Next.js)
        Vercel        App Store, bundled      atelier-mcp.vercel.app
        (PWA)         build + native storage  agent gateway
              └────────────┴──────────┴────────────┘
                           Supabase
              auth · Postgres+RLS · realtime · storage
```

- **One codebase renders everywhere.** Web and iOS are the same build;
  Capacitor wraps it (bundled locally — Apple requires it, offline demands it).
  No second UI. The MCP server stays its own service: an agent gateway is a
  different concern from the app.
- **Supabase stays the spine**: auth, Postgres with RLS, realtime, storage —
  one user identity shared by the app, the connector's OAuth, and any future
  service. Add later: Sign in with Apple, password reset, an edge function for
  account deletion.

## Data layer — three stages, each earning the next

**Stage 1 — the document model (ships the App Store).**
One jsonb doc per user, whole-doc push with optimistic concurrency, per-item
`touchedAt` merge, tombstones. Correct for a personal planner: one owner,
offline-first, atomic snapshots. Serves thousands of users. Do not touch it
to ship.

**Stage 2 — per-entity rows (when the doc gets heavy or sync gets chatty).**
Tables `tasks`, `boards`, `goals`, `plan`, each row with `user_id`,
`touched_at`, `deleted_at`. The merge semantics already built map 1:1:
newest-touch-wins becomes a guarded upsert; tombstones become `deleted_at`;
sync becomes an outbound dirty-row queue + realtime + `updated_at > cursor`
catch-up. Local state moves to IndexedDB (web) / SQLite (Capacitor) — killing
the storage-eviction bug class permanently. One-time migration script per user.

**Stage 3 — sharing (only when real users ask).**
Accounts are already multi-user (RLS isolation). Collaboration — shared
boards, coach/client views — needs Stage 2 first, then: a `board_members`
table, RLS by membership, a realtime channel per shared board. You cannot
share a slice of a jsonb blob; you can share rows.

## API surface — deliberately thin

- **CRUD**: no API server. Clients talk PostgREST with RLS as authorization.
- **Privileged ops only** get functions (pattern already live for Tray
  uploads): account deletion, OAuth exchanges, future digest crons running on
  each client's own API key.
- **MCP server** remains the one smart service; at Stage 3 its tools gain
  membership awareness for free.

## Engineering discipline

- **Monorepo** (pnpm workspaces). `packages/core` holds everything that has
  ever bitten us — nlParse, merge engine, urgency/escape rules — as pure,
  typed, unit-tested functions. Views split last; they work.
- **Environments**: staging Supabase project + Vercel previews; the in-app
  self-update pill is the release mechanism.
- **Observability**: Sentry (web + MCP), Supabase logs. No invasive analytics.
- **CI**: typecheck + core tests every push; TestFlight builds tagged from main.

## Sequencing — each phase shippable alone

1. **Ship** (weeks): Capacitor shell + native storage + account flows +
   review checklist. Current architecture unmodified.
   *Tracked as the App Store column on Side Hustles.*
2. **Harden** (background): extract `packages/core`, add tests, split the
   monolith into modules. Zero user-visible change.
   *Started 2026-08-25 — tests first, extraction second, so extraction can't
   silently change behavior. `tests/` runs the REAL index.html script in Node
   via a vm harness (`tests/harness.mjs`) — no copied code, no drift. 24 tests
   pin the bug-history layer: nlParse (dates, urgency, backslash shields, @),
   urgentStrip, mergeStates (stale-device revert, tombstones, chapter renames,
   column rescue), depCycle, resolveWait, byUrgent sinking, krSeason windows,
   adherence weighting, taskAgeDays. `npm test` locally; GitHub Actions runs
   it on every push and PR (.github/workflows/tests.yml).*
3. **Scale** (when doc size or user count says so): per-entity schema + sync
   engine + one-time migration.
4. **Share** (when a real second user wants a board): memberships, shared
   channels — the moment Atelier becomes a product.

*The deepest point: there is no architecture problem, only an architecture
schedule. The doc model, Supabase, the merge semantics, the MCP gateway carry
through every stage; what changes is granularity (doc → rows) and audience
(owner → members).*
