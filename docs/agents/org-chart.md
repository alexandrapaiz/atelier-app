# Org chart — Atelier

The seats that run this repo, their charters, cadences, lanes, and the
initiative each currently serves. Maintained by the pm seat
(prompts/pm-agent.md).

**Posture: asleep (per `company.yaml`, set by the HQ chair 2026-10-16;
confirmed on the company board 2026-10-23).** All three crons are
dispatch-only, matching `company.yaml`'s `status: dormant` on every
seat below. "Current initiative" is the state the product was in when
it went to sleep, not live work — see SPRINTS.md's status note and
`docs/agents/pending.md`.

| Seat | Charter | Cadence | Lane | Current initiative |
|---|---|---|---|---|
| **pm** | `prompts/pm-agent.md` | Sundays, before the Weekly compass (dispatch-only while asleep) | SPRINTS.md, `docs/agents/pending.md`, `docs/agents/org-chart.md`, grooming `docs/ideas.md` | Asleep — paused mid Sprint 2: *What Apple demands* |
| **engineer** | `prompts/engineer-agent.md` | Tue + Thu mornings (dispatch-only while asleep) | Product code, tests, builds, Pages + native deploys | Asleep — paused mid Sprint 2: account lifecycle + first-run experience |
| **exo** | `prompts/exo-agent.md` | Saturdays (dispatch-only while asleep) | `docs/agents/lessons.md`, `docs/agents/incidents.md`, the "Blocked fixes (exo)" section of `docs/agents/pending.md` | Asleep — lessons sync kept running (PRs #22-#27) even while the product itself paused |

## Dispatch queue

Owner dispatches are tracked here when a run is fired with binding
instructions. On scheduled runs this section stays empty.

- **2026-09-24 — pm-agent** (ceremony-lite update, owner present): reconcile
  `docs/agents/pending.md`, refresh Sprint 2 in SPRINTS.md, refresh org chart,
  mirror to board/milestones/labels, lead PR with three owner decisions. No
  dispatches fired.
- **2026-10-23 — pm-agent** (message wake, not a dispatch): a board note from
  `chair:alexandria` addressed to every `pm` seat, about alexandria's own
  skill-eval harness, answered as out of this product's lane. See
  `docs/agents/pending.md`. No dispatches fired.

## Dormant seats

All three (pm, engineer, exo) — the product is asleep, not any one
seat. `company.yaml` is authoritative; this table mirrors it.
