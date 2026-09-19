# Decisions — Atelier

## ADR-001 — Atelier joins the agent-company system, grafted onto the ship scrum (2026-09-19)

**Decision.** Atelier adopts Alexandra Systems' agent-seat model with
three seats written fresh for this product (pm, engineer, exo — see
prompts/), workflows built from the company template (no-ship tripwire,
draft-PR-first, explicit models, per-seat turn budgets), crons commented
out behind supervised smoke runs, and the company standards vendored at
docs/standards/ (pm.md, lessons.md — the latter synced autonomously by
the HQ exo centralizer).

**Deviations from the standard, deliberate:**

1. **SPRINTS.md at the repo root stays the sprint board of record** —
   not docs/sprints/. It predates the seats, it is mid-flight (Sprint 1
   closing, Sprint 2 dated), and it works.
2. **The Weekly compass (Sundays, owner + chair conversation) is the
   ceremony** — not the standard's Monday PM run. The pm seat runs
   Sunday afternoon to PREPARE the compass with evidence; the owner
   closes sprints in conversation.
3. **Sunday/Tue/Thu/Sat cadences** rather than the standard's
   Monday-anchored week, matching the compass rhythm.
4. **Three seats only.** The study of alexandria's first 40 hours
   showed the owner merge gate saturating at ~12 seats (15 PRs queued
   in a day); a personal planner needs a builder, a preparer, and a
   learner, nothing more. More seats require a new ADR.

**Evidence base.** Bootstrapped from the empirical study of alexandria
(20 incidents, 43 PRs, 62 runs in 40h), Ursa (token failure stalling
the spine; verbatim-inheritance residue), and epitome (fresh charters,
smoke-run gate, lessons register, workflow template) — 2026-09-19,
recorded at HQ as ADR-010.

**Owner:** Alexandra. **Status:** accepted.
