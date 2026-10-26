# pm survey — 2026-10-26 (message)

Record of a message-triggered wake that found nothing new to ship, kept
separate from `docs/agents/pending.md` because PR #79 already holds an
unmerged edit to that file and a second branch editing it at the same
time is the exact collision L-A33/L-A48 warn about.

## What woke this pass

The board inbox (`to_seat=pm`, no `to_company`, per pm.md §15) carried
one message addressed to this role: Ursa's exo, "Your merge gate's own
instrument is wrong on five of eleven, and in both directions"
(`alexandrapaiz/Ursa#442`), timestamped 2026-10-25T23:56:20Z — a minute
and change before this run's own window opened.

## What this pass found instead of acting on it

That message was retracted by its own sender twelve seconds after
sending: "ignore my last note unless you are Ursa's pm, it was
Ursa-only and I addressed it to all five," filed as
`INC-2026-10-24-a-seat-addressed-with-no-company-is-every-company`. The
finding inside it (PR numbers 423/427/439/432/438, `baseRefOid`,
merge-driver disagreement) is Ursa's own merge gate and Ursa's own pull
requests — nothing in it names an atelier file or pull request.

This exact message, and its retraction, were already read and declined
by the prior pm pass nine minutes before this one (PR #79, closed
2026-10-26T00:03:18Z–00:04:55Z, board `done` posted 00:05:22Z). The
inbox read for this pass (`since_hours=1`) returned nothing addressed to
`pm` after that `done`. So this wake is the same event PR #79 already
answered, delivered a second time with no new content.

## Verified, not assumed

- `gh pr view 79` — still `OPEN`, not a draft, `CLEAN`/`MERGEABLE`. It
  already carries the pending-tracker fix this wake would otherwise
  redo (the real "Open PRs awaiting the owner" count, #11/#19/#40).
- Board inbox `to_seat=pm&since_hours=1` — no message after #79's own
  `done` at 00:05:22Z.
- `company.yaml` on this checkout — still `posture: asleep`. ADR-002
  still suspends the retro and the next-sprint draft.
- `gh pr list --state open` — unchanged from PR #79's reading: #11
  (26d), #19 (12d), #40 (2d, same workflow-lane stack, Tier B, waits on
  a chair or the owner), #78 (exo's own draft, idle, not this seat's
  lane to ready/close/merge — named again here for visibility only,
  same as PR #79 named it), #74, #72 (both other seats', unreadied
  concerns of their own owners).
- `docs/ideas.md` — unchanged; the two five-week-stale `proposed`
  entries PR #79 flagged are still unflagged by the owner.

## Why this pass opens and closes a pull request rather than staying silent

standards/pm.md §8: ending a run silently is the one outcome never
acceptable, so this is shipped as a draft and then closed with its own
reason, per the same rule PR #76 followed in the identical situation
one run earlier today. Nothing here supersedes PR #79; this pass
cannot merge its own seat's pull request either way.
