# Pending — Atelier

What every seat owes, what's waiting on the owner, and what's an
owner-only action. Maintained by the pm seat (prompts/pm-agent.md).
Each line is dated to when it was last true; stale lines get a note
instead of a silent delete.

**Layout (2026-10-24, L-A48):** this file holds only the current state,
updated in place every pass. A pass's own narrative — what woke it, what
it found, what it did — goes in its own dated file under
`docs/agents/pending/`, never appended here. Two passes editing the same
anchor in this file is exactly how PR #28 and PR #30 became mutually
exclusive while each was individually clean against `main`; see
`docs/agents/pending/2026-10-24-pm.md` for that finding and the fix.

## Open PRs awaiting the owner

- **#11** (2026-09-30) — workflow fix (no-ship tripwire, L-E8), tests
  green, `MERGEABLE`. Recommend merge; waits on the owner or a chair
  (workflow file, not this seat's to merge).
- **#19** (2026-10-14) — workflow fix (dispatch guards), its own body
  asks the PM to merge it under standards/pm.md §21. Recommend merge;
  same reason as #11.
- **#31** (2026-10-24, engineer, draft) — a reverted commit and two
  `docs/ideas.md` proposals. Not marked ready while the product is
  asleep; nothing owed back to it. Next pass grooms its two ledger
  entries once it merges.

## Owner-only actions

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
- **Two more entries, not yet on `main`** (2026-10-24): PR #31 (draft)
  carries the engineer's write-up of the file-layout fix below and of
  its own charter's posture blind spot, both status `proposed`. Grooms
  into this list once that PR merges.
