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

## ADR-002 — Atelier is asleep by HQ's decision, and what that suspends here (2026-10-24)

**Decision (HQ's, recorded here).** Atelier is asleep. Nothing ships
from this repository until the owner wakes the product, and this
product's PM names the first real milestone when she does.

**Where it actually lives, read rather than recalled:**

- `company.yaml` on `main` carries `posture: asleep` and `priority: 5`.
  Its own header says the HQ chair wrote the file on 2026-10-16.
- The company board's current sprint for atelier, read on 2026-10-24
  with `GET $BOARD_API_URL/api/board/atelier`, is named "Asleep by
  decision" with the goal "Atelier is backlogged; nothing ships until
  the owner wakes it, and its PM names the first real milestone then."
  All five of its columns hold zero items.

**Why this entry exists.** A parent decision governs and a product does
not get to refuse it, but it is owed notice, and notice has a form: one
entry in the product's own decisions file naming the parent decision,
the local files it changes, and the local law it touches (company
lessons L-A20, clause 1). A commit subject is not that record, because
nothing reads commit subjects. The posture arrived inside a manifest
rewrite and for eight days no file a seat is sent to read said it.

**What it suspends.**

1. **SPRINTS.md as a live commitment.** ADR-001's first deviation keeps
   SPRINTS.md the sprint board of record and that still holds. What the
   posture overrides is its *liveness*: Sprint 2 is dated Sep 21 to Sep
   27 and expired, so an unfinished Claude-owned card there is not
   today's work for any seat.
2. **The cadence and the ceremony** (ADR-001, deviations 2 and 3). No
   retro and no next sprint until the owner wakes the product.
3. **The build lane.** The engineer seat ships no product code while
   the product sleeps. Picking the next sprint item would be naming the
   first milestone, which the board reserves for the PM after the wake.

**What it does not touch.** A local law's preconditions survive an
override unless the override names them (L-A20, clause 3), and this one
names none of these:

- **The worthiness gate** stands exactly as SPRINTS.md and the local
  lessons register state it. The posture is not a substitute for it and
  does not pre-empt it. Waking the product does not enroll anyone in
  the Apple Developer Program, which stays the owner's call with no
  date.
- **The owner-only blocks** in `docs/agents/pending.md` stay owed:
  the Supabase redirect allowlist that PR #3's reset page needs, the
  on-device test, the Google Calendar decision. Sleeping does not clear
  them.
- **The definition of done** for anything that does land, which is
  still a real surface plus a green suite. Both are green on `main` as
  of 2026-10-24: 24 of 24 locally, tests run 40051692307 and the Pages
  deployment 40051691663.
- **The inbox.** A message addressed to a seat still wakes it and it
  still answers, which is how this entry came to be written.

**What would end it.** The owner wakes the product, and the PM then
names the first milestone on the board. Neither is a seat's call. Until
then a seat woken with nothing addressed to it says so on the board and
stops, per section 17 of the vendored PM standard.

**Where a seat can read the posture.** Two surfaces on `main` today:
`company.yaml`, and this entry. A third is in flight and is cited here
as in flight rather than as law: a standing Posture section at the top
of SPRINTS.md, in PR #33, open and clean at the time of writing.

**Owner:** the HQ chair's decision of 2026-10-16, transcribed by the
engineer seat and not made by it. **Status:** accepted, active.
