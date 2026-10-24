# Pending — Atelier

What every seat owes, what's waiting on the owner, and what's an
owner-only action. Maintained by the pm seat (prompts/pm-agent.md).
Each line is dated to when it was last true; stale lines get a note
instead of a silent delete.

## This run (2026-10-24, message wake)

A handoff from `exo-centralizer` (company `alexandra-systems`) addressed
to this seat reported our vendored `docs/standards/lessons.md` twenty-one
rules behind HQ, with a one-file re-vendor PR opened ready for the merge.
I merged it (PR #29, now `main`): it was not a draft, carried no label or
comment, its single check was green, and its whole diff was that one
file. The centralizer's own charter grants it this merge, but the
runtime it runs under forbids any seat from merging its own work, so it
fell to this seat per standards/pm.md §21 — confirmed as the live
convention, not a one-off call, by two sibling companies' PM seats
(Ursa, epitome) answering the identical handoff the same way within the
same hour. Replied on the board in first person; see `board.messages`.

I also ran the merge-or-close sweep this run owes regardless of posture.
Closed as superseded or stale, each with a reason on the PR: **#13**
("Add company.yaml") — `company.yaml` already exists on `main` with
different, newer content the HQ chair wrote 2026-10-16; **#17** and
**#18** — a stale duplicate pair re-vendoring `docs/standards/pm.md`
from a commit `main` has long since passed (current `pm.md` already
carries section 22, dated 2026-10-16). **#11** and **#19** both edit
`.github/workflows/*` — real, apparently unapplied fixes, but workflow
files are not this run's to touch or merge, so both stay named here for
the owner or a chair. **#28** is this seat's own prior-day PR (the
2026-10-23 message run): a Tier B PR of the PM's own waits for another
merger — the owner, or HQ's PM — so it is named, not merged, and not
redone; it already carries the fuller "atelier is asleep" rewrite of
this file, SPRINTS.md, and the org chart. Where that causes a docs-only
conflict with this PR, either may land first and the PM resolves the
conflict (standards/pm.md §10).

Posture check (repeating 2026-10-23's finding, nothing has changed):
`company.yaml` still carries `posture: asleep` since the HQ chair's
2026-10-16 rewrite, and the company board's current sprint for atelier
is still "Asleep by decision." No retro or new sprint drafted this run
either, for the same reason as yesterday.

## Open PRs awaiting the owner

- **#28** (2026-10-23, pm's own) — the fuller posture-confirmation
  rewrite of this file, SPRINTS.md, and the org chart, plus yesterday's
  merge-or-close findings. Waits on the owner or HQ's PM, per Tier B.
- **#11** (2026-09-30) — workflow fix (no-ship tripwire, L-E8), tests
  green. Recommend merge; waits on the owner or a chair (workflow file).
- **#19** (2026-10-14) — workflow fix (dispatch guards), its own body
  asks the PM to merge it under standards/pm.md §21. Recommend merge;
  waits on the owner or a chair (workflow file).

## Owner-only actions

**Note (2026-10-24):** every line below predates `company.yaml`'s
2026-10-16 move to `posture: asleep`. They are the state the product
was in when it went to sleep, not live commitments; the owner's
wake-up conversation is what makes any of them current again. Kept
dated rather than deleted, per this file's own rule.

- **PROJECTS_TOKEN is set but not working for the company board** (2026-09-24):
  the secret now exists in the pm-agent workflow env (it did not on the last
  ceremony), but `gh api user` and `gh project item-list 5 --owner
  alexandrapaiz` both return `403 Resource not accessible by integration`
  under it. Per docs/standards/pm.md §2b, user-level Projects v2 needs a
  **classic** PAT with the `project` scope — a fine-grained PAT or an
  installation token gives exactly this error. Board mirroring stays
  deferred (commands queued in PR #8) until the secret is replaced with a
  classic PAT.
- **Supabase redirect allowlist** (2026-09-24): the password reset page
  shipped in PR #3, but the recovery link only works once Supabase Auth →
  URL Configuration → Redirect URLs includes
  `https://alexandrapaiz.github.io/atelier-app/reset.html`. Without it
  the link lands on the app instead of `reset.html`. Engineer PR #3
  called this out; it is dashboard/secrets territory, so it waits on
  Alexandra.
- **The worthiness gate** (2026-09-24): the $99 Apple Developer Program
  enrollment waits on Alexandra judging the product worthy of deployment,
  per SPRINTS.md and lessons.md L1. No date, no seat schedules it.
- **On-device test on the real iPhone** (2026-09-24): SPRINTS.md Sprint
  2, due Sep 27. Claude builds, Alexandra tests on the cable install.
- **Google Calendar decision** (2026-09-24): SPRINTS.md Sprint 3, due
  Sep 30. Google verification vs a "beta" label for v1.
- **Privacy policy + App Privacy answers** (2026-09-24): SPRINTS.md
  Sprint 3, due Oct 2. Claude drafts, Alexandra approves.
- **Listing approval** (2026-09-24): SPRINTS.md Sprint 3, due Oct 4.
  Claude drafts name, subtitle, keywords, description, screenshots;
  Alexandra approves.
- **Submit from App Store Connect** (2026-09-24): SPRINTS.md Sprint 4,
  gated on the worthiness call plus enrollment and a TestFlight pass.

## Ledger items awaiting a verdict

- **Atelier company mode** (2026-09-24): docs/ideas.md, status
  `proposed`. Its own first step defers discovery until after the App
  Store ship, so it needs no verdict yet. Flagged here so it does not go
  stale unnoticed.
- **Browser checks for what the node harness cannot reach** (2026-09-24):
  docs/ideas.md, status `proposed`. Triggered by the password reset work
  and the new `scripts/reset-page-test.mjs`. First step is to reuse it
  for Sprint 2's account deletion item before generalizing.
