# Pending — Atelier

What every seat owes, what's waiting on the owner, and what's an
owner-only action. Maintained by the pm seat (prompts/pm-agent.md).
Each line is dated to when it was last true; stale lines get a note
instead of a silent delete.

## Open PRs awaiting the owner

None as of 2026-09-24.

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

## Blocked fixes (exo)

Owned by the exo seat (prompts/exo-agent.md step 2). The pm seat must
not edit or reorder this section. Each entry carries exact
ready-to-paste content so the owner or a seat with the right surface
can apply it without rediscovering it.

Five entries, all from the run of 2026-10-24 (PR #40), newest first.
Each says who can apply it and gives the text to paste.

### 1. The stranded-draft check belongs in the three charters too (I4)

**Who.** The owner, by merge. Charter edits merge only by the owner.

**Why it cannot wait on the workflow fix.** PR #40 puts the check in
`.github/workflows/agent-*.yml`, which is correct and is the half this
seat owns. Those three workflows have not carried a seat run since
2026-09-24; every seat run for the last thirty days has been a
host-window run on the resident runtime, which reads `prompts/` and
never reads `.github/`. The charter is the only file in this repository
that a host-window run actually reads.

**Paste.** In each of `prompts/engineer-agent.md`, `prompts/pm-agent.md`
and `prompts/exo-agent.md`, as the last bullet of the Boundaries
section:

```
- Before you finish, run `npm run drafts -- --seat <your seat>` and put
  its output in your PR description. Exit 1 names pull requests on your
  seat that no merger can reach; exit 0 means every one of them is
  reachable; any other exit means the check could not run, which is not
  a pass. If it names your own draft, ready it or write into the draft
  which clause keeps it one, naming an authority a reader can open.
```

Replace `<your seat>` with `engineer`, `pm` and `exo` respectively.
The command arrives with engineer PR #39; until that merges the step
and this bullet both report that the question went unasked, which is
the correct output.

### 2. Which surface names a seat's branch (I6, and I3 before it)

**Who.** The owner, by merge, for the charter half. HQ for the runtime
half, already routed on the board.

**Why.** I3 ruled in September that the workflow prompt must stop
naming the branch and defer to the charter, and that was applied. The
resident runtime's wake prompt now names the branch directly, so every
branch in this repository this month is `atelier-<seat>/...` while all
three charters still say `<seat>/...`. The same defect, on the surface
that replaced the one I3 fixed. The charters should stop implying they
are the only source rather than lose the argument silently a second
time.

**Paste.** In `prompts/exo-agent.md`, Boundaries, replace:

```
One PR per run on branch exo/YYYY-MM-DD, draft-first.
```

with:

```
One PR per run, draft-first. The branch is named by whoever woke you if
the wake names one, and by this convention when it does not:
exo/YYYY-MM-DD. Two surfaces may state this rule and the dispatcher
wins, so a branch that does not match this line is not by itself a
defect; a run that cannot tell which surface named it is.
```

In `prompts/engineer-agent.md`, Act, replace:

```
- Branch engineer/YYYY-MM-DD-slug; within your first turns open a
```

with:

```
- Branch as your wake names it, or engineer/YYYY-MM-DD-slug when it
  names nothing; within your first turns open a
```

In `prompts/pm-agent.md`, Boundaries, replace:

```
One PR per run on branch pm/sprint-YYYY-MM-DD, draft-first (ship first,
```

with:

```
One PR per run, draft-first, on the branch your wake names or
pm/sprint-YYYY-MM-DD when it names none (ship first,
```

### 3. What a run does when it cannot find the owner's words (I7)

**Who.** The owner, by merge — and the better fix is hers to choose
rather than to paste, because the real repair is upstream of the text.

**Why.** Step 1 of `prompts/exo-agent.md` says every owner correction
becomes a lesson with her words verbatim. Every seat in this company
pushes and comments under the `alexandrapaiz` account, and no board
message addressed to this company is owner-authored, so this run could
not tell her corrections from a seat's own. The upstream fix is a
surface that carries her as the author — the board already models an
`owner` sender. The charter text below is only what a run should do
until that exists.

**Paste.** In `prompts/exo-agent.md`, step 1, after "and that
meta-failure is itself an incident.":

```
   If you cannot identify which words are hers — every seat in this
   company writes under her account — say "no owner correction was
   identifiable this week" and never the stronger "the owner made no
   corrections". Those are different claims and only the first one is
   yours to make.
```

### 4. `OPEN_ROUTING` is a variable, not a secret (I5)

**Who.** Anyone with write access, after PR #11 merges — including the
pm. It is a repository *variable*, so it is not secrets territory and
is not owner-only, but it does nothing until #11 lands the `if:`
condition that reads it.

**Why.** The open-routed pm step burned 50 turns, 21 minutes and $0.78
on 2026-09-24 and ended `is_error: true`; the fallback then did the
work. Today the route is gated on the mere presence of a key, so
turning it off means deleting a secret. #11 moves it behind a flag and
defaults it off.

**Paste, in this order:**

```
# only after PR #11 merges — before that, this sets a variable nothing reads
gh variable set OPEN_ROUTING --body off --repo alexandrapaiz/atelier-app
gh variable list --repo alexandrapaiz/atelier-app     # verify it took
```

Turning it back on later is `--body on`, and the verification is the
next pm run's `modelUsage` read out of the log, never the step's
conclusion (L5).

### 5. Three exo-lane workflow PRs and nobody who merges them

**Who.** The pm seat, or a chair under docs/standards/pm.md §21.

**Why.** PR #11 (open since 2026-09-30) and PR #19 (since 2026-10-14)
are both exo-lane fixes to the same three workflow files, both ready,
neither merged. PR #40 is this run's. All three are Tier B because
they touch `.github/`, so no exo run can merge any of them, and two
prior exo runs' fixes have therefore sat outside the tree for weeks —
which is this seat's own definition of an incident that is not closed.

**Measured this run, so nobody re-measures it:** #11, #19 and #40 merge
clean against `main` in either order, verified by replaying both
orders with real `git merge`, and the `actions: read` line that #19 and
#40 both add is byte-identical, so it lands exactly once. There is no
merge-order problem here. There is only the question of who merges
them.

