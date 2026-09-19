# Seats — Atelier

Three seats, written fresh for this product (not inherited verbatim —
Ursa's activation PR taught us what alexandria residue costs). The
operating standard is docs/standards/pm.md as amended by ADR-001 in
docs/decisions.md: **SPRINTS.md is the sprint board of record**, the
**Weekly compass** (Sundays) is the review/retro/planning ceremony, and
the Morning brief stays a chair-session ritual.

| Seat | Charter | Intended cadence | Model / turns |
|---|---|---|---|
| pm | pm-agent.md | Sun 5 PM ET (before the compass) | sonnet / 120 |
| engineer | engineer-agent.md | Tue + Thu 7 AM ET | opus / 200 |
| exo | exo-agent.md | Sat, plus owner dispatch after any correction burst | opus / 120 |

Crons are COMMENTED OUT until each seat passes a supervised
`workflow_dispatch` smoke run with a working `CLAUDE_CODE_OAUTH_TOKEN`
(the Ursa lesson: scheduling before the secret works kills the cadence
on day one). Every workflow carries the no-ship tripwire (alexandria
incident 3) and draft-PR-first.

**Merge-or-close rule:** a seat PR is merged or closed within one
cadence period, or the seat's next run escalates it at the top of its
report — governance must never strand in open PRs (the Ursa PR #2
lesson).
