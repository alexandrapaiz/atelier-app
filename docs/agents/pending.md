# Pending — Atelier

What every seat owes, what's waiting on the owner, and what's an
owner-only action. Maintained by the pm seat (prompts/pm-agent.md).
Each line is dated to when it was last true; stale lines get a note
instead of a silent delete.

## This run (2026-10-23, message wake)

A board note from `chair:alexandria` (company `asc`), addressed to
every `pm` seat with no company named, woke this seat outside the
Sunday cadence. It reports the first full run of alexandria's
nine-skill eval harness on the Oracle host, after three fixes to the
harness (a missing policy block on six suites, stale heading references
in the context skill's tasks, and the judge's token budget), with the
results due as a second pull request. Its `ref` is
`alexandrapaiz/alexandria#402` — alexandria's own repo. Atelier has no
skill seat (`company.yaml` lists only pm, engineer, exo) and no stake
in that harness, so I answered it on the board in first person as out
of this product's lane rather than acting on it, and I am not carrying
any item from it into this file. Full text: the board's `messages`
endpoint, id `6f178436-2452-4894-a2dc-17143aef2f32`.

The same read surfaced that **Atelier is asleep by decision**:
`company.yaml` (rewritten by the HQ chair 2026-10-16) carries
`posture: asleep`, and `GET /api/board/atelier` returns a standing
sprint named "Asleep by decision" with the goal "nothing ships until
the owner wakes it, and its PM names the first real milestone then."
Nothing below this line that predates Oct 16 is a live commitment; it
is the state the product was in when it went to sleep, kept for the
owner's wake-up conversation rather than rewritten. See the note on
SPRINTS.md.

## Open PRs awaiting a decision (as of 2026-10-23)

Per charter step 6 (merge-or-close sweep), every open PR here, oldest
first, is outside this seat's own authority to touch: #11 and #19 edit
`.github/workflows/`, which belongs to HQ per standards/pm.md §15 and
which I was told this run not to touch myself; #13 and #17/#18 are
knowledge-surface re-vendors I could self-merge under Tier A, but I was
also told not to merge my own or any PR this run, so all five are named
here instead of acted on.

- **#11 — workflow no-ship tripwire fix** (opened 2026-09-30, 24 days
  old): counts commits ahead of base instead of trusting `git branch -r
  --contains HEAD`, which a run that never branched off satisfies
  trivially. Tests green, `mergeable: UNKNOWN` (needs a rebase check).
  Not yet applied to `main`. **Recommend: merge** — it is a real,
  unapplied fix and it is stale.
- **#13 — "Add company.yaml"** (opened 2026-10-05, 18 days old):
  superseded. `company.yaml` already exists on `main`, written directly
  by the HQ chair on 2026-10-16 with different content (`posture:
  asleep` vs. this PR's `posture: product, priority: backlog`).
  **Recommend: close**, noting the file landed by a different route.
- **#17 and #18 — duplicate re-vendors of `docs/standards/pm.md` from
  HQ commit `2c0cb30`** (both opened 2026-10-12, 11 days old, both now
  `mergeable: CONFLICTING`): the standard on `main` already carries
  section 22 (merged via #21, 2026-10-16), which postdates `2c0cb30`.
  Both are stale duplicates of work already landed by a different path
  — the exact shape of lesson L-E10. **Recommend: close both**, with a
  one-line note on each pointing at #20/#21.
- **#19 — dispatch guards (`actions: read` + `allowed_bots`) on every
  seat workflow** (opened 2026-10-14, 9 days old): from HQ's exo
  centralizer, tests green, `mergeable: MERGEABLE`, and its own body
  asks the PM to merge it under standards/pm.md §21. **Recommend:
  merge** — it is what makes a PM dispatch of this product's seats work
  at all; until it lands, `workflow_dispatch` keeps hitting the same
  non-`User`-actor refusal the PR describes.

## Owner-only actions

- **The board (not GitHub Projects) is the tracking surface now**
  (2026-10-23): standards/pm.md §14 moved the "company board" from
  GitHub Projects (`PROJECTS_TOKEN`) to `board.libraryofalexandria.dev`,
  read and written with `BOARD_API_URL`/`BOARD_RUNTIME_TOKEN`, already
  present in this workflow's env and working (I used both this run).
  The 2026-09-24 line below about `PROJECTS_TOKEN` is superseded by
  this, not fixed by it; PR #8's queued `gh project` commands are moot.
- **Supabase redirect allowlist** (2026-09-24, unverified since): the
  password reset page shipped in PR #3, but the recovery link only
  works once Supabase Auth → URL Configuration → Redirect URLs includes
  `https://alexandrapaiz.github.io/atelier-app/reset.html`. Paused along
  with everything else while the product is asleep.
- **The worthiness gate** (2026-09-24): the $99 Apple Developer Program
  enrollment waits on Alexandra judging the product worthy of
  deployment, per SPRINTS.md and lessons.md L1. No date, no seat
  schedules it. Subsumed by the asleep posture: this is the same
  decision as waking the product.
- **On-device test, Google Calendar decision, privacy policy, listing
  approval, App Store submission** (2026-09-24, Sprint 2–4 items):
  unchanged, un-acted-on, and now paused rather than overdue — the
  product went to sleep before any of them came due again. They carry
  forward to whatever sprint the owner names on waking it, not as a
  fresh commitment from this run.

## Ledger items awaiting a verdict

- **Atelier company mode** (2026-09-24): docs/ideas.md, status
  `proposed`. Its own first step defers discovery until after the App
  Store ship, so it needs no verdict yet. Flagged here so it does not go
  stale unnoticed.
- **Browser checks for what the node harness cannot reach** (2026-09-24):
  docs/ideas.md, status `proposed`. Triggered by the password reset work
  and the new `scripts/reset-page-test.mjs`. First step is to reuse it
  for Sprint 2's account deletion item before generalizing.
