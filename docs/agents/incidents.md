# Incident Register — Atelier

Blameless, exo-owned. Inherited law from alexandria's register applies
from day zero: judge runs by artifacts never conclusions; ship first,
then work; secret first, schedules last; caps from evidence (see
docs/standards/lessons.md). An incident is closed when the fix is in
the tree.

Format: number, one-line title, date. Then what happened with the
evidence that shows it, the fix, and whether the fix has landed. An
incident stays open until its fix is in the tree.

### I1 — Two charters claim docs/agents/pending.md (2026-09-19)

**What happened.** The pm seat's first supervised run (run
35463415653, PR #1) created `docs/agents/pending.md` as a tracker of
what each seat owes and what waits on the owner. The exo seat's first
supervised run started to create the same path as a register of fixes
it cannot reach, with ready-to-paste content. Two seats wrote the same
file in the same hour, and the two PRs would have conflicted on merge.

**Evidence.** `prompts/pm-agent.md` step 3: "Maintain
docs/agents/pending.md: what each seat owes, open PRs awaiting the
owner, owner-only actions". Its boundaries then exclude only lessons
and incidents from the pm lane, so it reads as owning pending.
`prompts/exo-agent.md` step 2: "What you cannot reach ... record in
docs/agents/pending.md with exact ready-to-paste content." Its
boundaries claim "docs/agents/ (lessons, incidents, pending)". Both
readings are correct, which makes this a charter defect rather than a
seat error.

**What this run did.** Yielded the file. The exo seat dropped its
version so PR #1 merges clean, because the exo seat adjudicating an
ownership dispute in its own favor while auditing that dispute is the
wrong shape. Blocked fixes are recorded here until the owner rules.

**The fix, for the owner to apply.** Charter edits merge only by the
owner, so this seat cannot land it. The smaller of the two options is
to keep pending as the pm seat's file and give the exo seat a named
section inside it. In `prompts/exo-agent.md`, step 2, replace "record
in docs/agents/pending.md with exact ready-to-paste content" with:

```
record in docs/agents/pending.md under the "Blocked fixes (exo)"
heading, with exact ready-to-paste content. The pm seat owns the rest
of that file and must not edit or reorder your section.
```

And in `prompts/exo-agent.md`, Boundaries, replace "You write
docs/agents/ (lessons, incidents, pending)" with:

```
You write docs/agents/lessons.md and docs/agents/incidents.md in full,
plus the "Blocked fixes (exo)" section of docs/agents/pending.md.
```

And in `prompts/pm-agent.md`, Boundaries, after "docs/agents/pending.md"
add:

```
(except its "Blocked fixes (exo)" section, which the exo seat owns)
```

**Status.** CLOSED 2026-09-19: ownership rule applied to both charters
by the chair on the owner's autonomy directive (revert = reopen).

### I2 — ADR-015 open routing is configured but not in effect (2026-09-19)

**What happened.** Commit 89bbf8e added open-source routing for the pm
seat. In the seat's first real run, the open-routed step did not
execute and the seat ran on Claude.

**Evidence.** Run 35463415653 step list: step 3 "Seat run
(open-routed)" conclusion `skipped`, step 4 "Seat run (Claude)"
conclusion `success`. The step is gated on `env.OPENROUTE != ''`, which
is fed by `secrets.OPENROUTE_API_KEY`, so the skip means that secret is
unset. The run's own result block asserts what actually served the
turns:

```
"modelUsage": {
  "claude-haiku-4-5-20251001": { ... },
  "claude-sonnet-5":           { ... }
}
```

Reading the workflow alone would tell you the pm seat runs on an open
model. The log says otherwise. This is L-X3's "assert models from run
logs, never from config intent" catching its first case here.

**Assessment.** The fallback behaved exactly as designed, so this is
not a broken run. It is a live gap between what the repo's config
implies and what is true, and it stays a gap until the secret is set.

**The fix.** Owner-only, because seats never touch secrets. Set
`OPENROUTE_API_KEY` and `OPENROUTE_BASE_URL` in the repository secrets
to activate ADR-015, or leave them unset deliberately and note in
`docs/decisions.md` that ADR-015 is accepted but dormant. Either
closes this. Silence does not.

**Status.** CLOSED 2026-09-19: OPENROUTE secrets set by the owner
(Moonshot/Kimi); next pm run's modelUsage is the verification.

### I3 — The workflow prompt overrides the pm charter's branch name (2026-09-19)

**What happened.** The pm charter fixes the branch convention at
`pm/sprint-YYYY-MM-DD`. The dispatch prompt embedded in the workflow
tells the seat to use `pm/YYYY-MM-DD-slug`. The seat followed the
prompt and branched `pm/2026-09-19-pending-tracker`.

**Evidence.** `prompts/pm-agent.md`, Boundaries: "One PR per run on
branch pm/sprint-YYYY-MM-DD". `.github/workflows/agent-pm.yml`, both
prompt blocks: "create a branch pm/YYYY-MM-DD-slug". Actual branch on
PR #1: `pm/2026-09-19-pending-tracker`.

**Why it matters beyond cosmetics.** The workflow prompt and the
charter are two sources of truth for the same rule, and the prompt
silently wins because the seat reads it first. Any future rule that
lands in only one of them binds or fails to bind depending on which
file a seat happens to trust. The branch name is the cheap instance of
that problem showing up early.

**The fix.** One of the two must stop specifying it. The charter is
the durable document, so the workflow prompt should defer. In all
three of `.github/workflows/agent-pm.yml`,
`.github/workflows/agent-engineer.yml` and
`.github/workflows/agent-exo.yml`, replace the branch sentence with:

```
Within your first turns, create a branch named by your charter's
branch convention and open a DRAFT pull request with
`gh pr create --draft`, committing into it as you work — a died
run must still ship its partial work.
```

This seat can reach workflow files, but the dispatch for this run
scoped it to one small deliverable, and rewriting the prompt block of
all three seat workflows mid-smoke-run would change how the engineer
and exo seats boot before anyone has watched them boot once. Deferred
deliberately, not forgotten.

**Status.** CLOSED 2026-09-19: workflow prompts now defer to each
charter's branch convention (chair-applied).

### I4 — Every seat run for a month happened on a surface none of this repo's fixes reach (2026-10-24)

**What happened.** This repository's three seat workflows have executed
five times in their life, all between 2026-09-19 and 2026-09-24. Every
seat run since then — the engineer's and the pm's, daily, through
today, and this exo run — happened on the resident runtime, which
checks the repository out, reads `prompts/`, and never executes
`.github/workflows/agent-*.yml`.

**Evidence.**

```
$ gh run list --limit 200 --json name --jq '.[].name' | sort | uniq -c
      1 engineer-agent          <- 2026-09-19
      1 exo-agent               <- 2026-09-19
      3 pm-agent                <- 2026-09-19, 2026-09-24 x2
    100 pages build and deployment
     95 tests
```

Against that: `atelier-engineer/2026-10-24-message`,
`-message-2`, `-message-3`, `atelier-pm/2026-10-24-message`,
`-message-3`, `-message-handoff`, `-hook`, `-message-4`, and this
branch — nine seat runs today, none of them an Actions run of a seat
workflow.

**Why it matters.** Everything this repository has built to make a seat
run honest lives in those three files: the no-ship tripwire, the turn
caps, the dispatch guards waiting in PR #19, the open-routing switch
waiting in PR #11, and the stranded-draft step this run shipped. All of
it binds the dispatch path, and the dispatch path has not carried a
seat run in thirty days. A fix on a surface that does not run is a fix
that is in the tree and not in effect, which is the distinction L4 now
names.

**This is the limit on this run's own deliverable.** The engineer asked
for the stranded-draft step in the three seat workflows, and that was
the right ask and the right half: it is correct, it is tested, and it
will bite the moment a seat is dispatched through Actions. It will not
bite on a host-window run, which is every seat run that has actually
happened for a month. The engineer had already read the wider half
correctly and routed it to HQ's product manager — one call in the
runtime that wakes seats would serve every product. This seat agrees
and has said the same on the board from its own side, so the ask
carries two products' worth of evidence rather than one seat's.

**The fix.** Two parts, neither of them reachable from this repository
alone.

1. *HQ, the real one:* the runtime that wakes seats runs the
   stranded-draft check after the run and puts the result in the wake
   record, the way Actions will now put it in the step summary.
   Routed: engineer board message to `alexandra-systems/pm`, and this
   seat's reply on the same thread.
2. *This repository, the half in reach:* the charter is the only file a
   host-window run reads that this repository owns, so the check
   belongs in each seat's charter as a closing step. Charter edits
   merge only by the owner, so the exact text sits under "Blocked
   fixes (exo)" in `docs/agents/pending.md`.

**Status.** OPEN. The Actions half is in this PR. The charter half is
written and waiting on the owner. The runtime half is HQ's.

### I5 — A step reported success while its own artifact said it failed, and I2 was closed on a verification nobody performed (2026-10-24)

**What happened.** I2 was closed on 2026-09-19 with "OPENROUTE secrets
set by the owner (Moonshot/Kimi); next pm run's modelUsage is the
verification." The next pm run is 36023458176, on 2026-09-24. Nobody
read it. Read now, it says ADR-015 is configured, reached, and
failing.

**Evidence.** The step list reports step 3 "Seat run (open-routed)" as
`success`. Its own result block, in the same run's log:

```
{ "type": "result", "subtype": "success", "is_error": true,
  "duration_ms": 1289778, "num_turns": 50, "total_cost_usd": 0.7834832,
  "modelUsage": { "kimi-k2.7-code": { ... } } }
##[error]Claude result reported subtype success with is_error:true
##[end-action id=openrouted.run;outcome=failure;conclusion=failure
```

Twenty-one and a half minutes and fifty turns on Kimi, ending in an
error. The work was then done by the fallback, 29 turns, `is_error:
false`, `modelUsage` `claude-sonnet-5` and `claude-haiku-4-5-20251001`.
The step's `continue-on-error: true` is what promotes
`outcome=failure` to the `conclusion=success` that the step list
shows, which is L5.

**Assessment.** Two failures, and the second is the register's. The
first is ordinary: open routing is reached and fails, the fallback
works, the design holds. The second is that an incident was marked
CLOSED with its verification named as a future act, and the future act
never happened, so for a month the register asserted something it had
not checked. Under this seat's charter a closed incident means the fix
is in the tree. "The next run verifies it" is not a closure, it is a
deferral wearing one.

**The fix.** Three things, two of them already in flight.

1. An incident is not closed by a verification that has not been
   performed. If the check is in the future, the incident stays OPEN
   with the check named, and the next run's "must check" list carries
   it. Applied below.
2. PR #11 moves open routing behind the `OPEN_ROUTING` repository
   variable, so turning a failing paid route off costs a flag rather
   than a deleted secret, and it is off by default. That is the right
   fix and it has been open since 2026-09-30.
3. `vars.OPEN_ROUTING` is a repository variable and not a secret, so
   setting it is not this seat's to do but is also not owner-only.
   Recorded under "Blocked fixes (exo)".

**Status.** OPEN. I2 is reopened in substance: ADR-015 is active and
failing, which is neither of the two endings I2 offered.

### I6 — The branch-convention defect recurred on the surface that replaced the one I3 fixed (2026-10-24)

**What happened.** I3 (2026-09-19) found the workflow dispatch prompt
overriding each charter's branch convention, and fixed it by making all
three workflow prompts defer to the charter. Today every seat branch in
this repository is named by a third source of truth that I3 never
looked at.

**Evidence.** The charters: `prompts/exo-agent.md` "branch
exo/YYYY-MM-DD", `prompts/engineer-agent.md` "Branch
engineer/YYYY-MM-DD-slug", `prompts/pm-agent.md` "branch
pm/sprint-YYYY-MM-DD". The branches actually opened:
`atelier-engineer/2026-10-24-message`,
`atelier-pm/2026-10-24-hook`, and this run's own
`atelier-exo/2026-10-24-message`, which the resident runtime's wake
message named for this seat in the same sentence that told it to read
its charter. The workflow prompts I3 fixed are not wrong and are not
being read; the fix landed on the surface that stopped being used, so
it is I4's shape as well as I3's.

**Why this is a register defect and not a cosmetic one.** This seat's
charter says a correction that repeats is a register defect, because
the rule existed and failed to bind, and that the meta-failure is
itself an incident. This is that. I3's reasoning — "the workflow
prompt and the charter are two sources of truth for the same rule, and
the prompt silently wins because the seat reads it first" — is true
word for word of the wake prompt, which a host-window seat reads before
it reads anything in this repository.

**Measured cost so far: small, and already paid by somebody else.**
`tools/check-draft-prs.sh` (engineer PR #39) matches a seat branch with
two patterns, `<seat>/*` and `*-<seat>/*`, because both conventions are
live in this repository's queue. That is the engineer compensating in
code for a rule that did not bind, which is the cheap instance showing
up early, exactly as I3 predicted of the first one.

**The fix.** The rule has to state which surface wins rather than be
restated on each one. Charter text, ready to paste, sits under "Blocked
fixes (exo)" in `docs/agents/pending.md`: the dispatcher's branch name
governs when it gives one, the charter's convention governs when it
does not, and the charter stops implying it is the only source. The
runtime-side half — a wake prompt that defers rather than names — is
HQ's, and is the same conversation as I4's part 1.

**Status.** OPEN. No seat in this repository can close it alone.

### I7 — The seat cannot tell the owner's corrections from its own (2026-10-24)

**What happened.** Step 1 of this seat's charter is to harvest the
week's owner corrections and capture her words verbatim. This run
could not identify a single one, and not because there were none.

**Evidence.** Every seat in this company pushes and comments under the
`alexandrapaiz` GitHub account, so `gh pr view --json comments` returns
the owner and every seat under one author login; the comments on PR #31
and #34 are plainly the engineer seat's own voice ("the clause I wrote
to hold it was circular") and carry her name. No board message among
the hundred most recent addressed to this company is owner-authored;
all eighteen distinct senders are seats. This run's dispatch came from
`atelier/engineer`, not from her.

**Assessment.** The charter's first step rests on a distinction the
surfaces do not make. The honest reading of this week is "no owner
correction was identifiable", which is not the same claim as "the owner
made no corrections", and the register must not quietly print the
second when it can only support the first.

**The fix.** Owner-side or HQ-side, not seat-side: either her
corrections arrive on a surface that carries her as the author (a board
message from `owner`, which the board already models, or a distinct
GitHub account), or step 1 of the charter changes to say what a seat
should do when it cannot tell. Ready-to-paste text for the second is
under "Blocked fixes (exo)".

**Status.** OPEN.

## The previous run's list, answered (charter step 5)

The list below it was written on 2026-09-19 by this seat's first run,
and no run since has answered it. Each item, with what is true today.

1. **Did the owner rule on I1?** Yes, and the ruling is in both
   charters. But `docs/agents/pending.md` still had no "Blocked fixes
   (exo)" heading when this run opened, five weeks later, because no
   exo run since has had a blocked fix to put in it. The section now
   exists and carries five entries. I1 stays closed.
2. **Is `OPENROUTE_API_KEY` set?** Yes, and the verification this item
   asked for had never been performed. Performed now, and it says the
   route is reached and failing. That is I5, and the unperformed
   verification is the larger half of it.
3. **Apply I3, then verify each seat's branch against its charter.**
   I3 was applied. The verification was not, and it is the one that
   mattered: no seat branch in this repository matches its charter's
   convention, because a third surface now names them. That is I6.
4. **Re-derive turn caps from a representative run.** Done below. No
   cap changed, for reasons that are not arithmetic.
5. **Did PR #1 and PR #2 both merge?** Both merged. The condition that
   produced I1 — two open seat PRs touching `docs/agents/` — did not
   recur. A different one did: three open PRs touching
   `.github/workflows/`, two of them left by earlier runs of this seat.

**What the shape of this answer says.** Four of the five items were
checks deferred to a later run, and the later run did not come for five
weeks. Three of them turned out to be true findings sitting in plain
sight the whole time. A "next run must check" list is only a register
entry until a run reads it, which is the same failure as closing an
incident on a verification named as a future act (I5). The list below
is written knowing that.

## Turn caps, re-derived 2026-10-24 (charter step 4)

Every seat Actions run in this repository's history, with the model
asserted from each run's log and never from the workflow file:

| run | seat | date | model (from log) | num_turns | is_error |
|---|---|---|---|---|---|
| 35463415653 | pm | 2026-09-19 | `claude-sonnet-5` | 13 | false |
| 35463499825 | exo | 2026-09-19 | `claude-opus-5` | 22 | false |
| 35463727076 | engineer | 2026-09-19 | `claude-opus-5` | 41 | false |
| 35956444221 | pm | 2026-09-24 | `kimi-k2.7-code` | 1 | **true** |
| 36023458176 | pm | 2026-09-24 | `kimi-k2.7-code` | 50 | **true** |
| 36023458176 | pm | 2026-09-24 | `claude-sonnet-5`, `claude-haiku-4-5-20251001` | 29 | false |

**No cap changes, and the reason is not that the arithmetic came out
level.** 2x the highest observed with a floor of 100 gives 100 for
every seat, against current caps of 200 (engineer), 120 (exo) and 120
(pm). Lowering them on this evidence is barred twice over. L2 bars it
once: the 2026-09-19 runs were supervised smoke runs, and a smoke run's
`num_turns` is evidence that the plumbing works and nothing more. The
pm's 50-turn figure bars it again from the other side, because those
fifty turns are a route failing for twenty-one minutes rather than a
seat doing its duties, so the number is large for a reason that has
nothing to do with how much work the seat has.

**And none of the three caps governs anything today.** Per I4, no seat
has run through these workflows in thirty days. The caps that bind the
runs that actually happen are set by the resident runtime, which this
repository does not own and this seat cannot read from here. Recorded
so the next run does not re-derive these six numbers and think it has
tuned something.

## Next run must check

1. **Did this PR merge?** It changes `.github/workflows/`, which is
   Tier B, so this seat cannot merge it and must not. If PR #40 is
   still open, the stranded-draft step is not in effect and I4 part 2
   has not started either.
2. **Does the step actually report?** It has never executed in Actions,
   because no seat workflow has run since 2026-09-24 (I4). The first
   seat dispatch after this merges is the verification. Read the step
   summary, not the step conclusion — the step always exits 0 by
   design, so its conclusion says nothing at all. If engineer PR #39
   has not merged, expect `NOT CHECKED (tool absent)`, which is the
   correct output and not a pass.
3. **PRs #11 and #19.** Both are exo-lane workflow fixes, open since
   2026-09-30 and 2026-10-14, both ready, neither merged. Two prior exo
   runs' fixes are therefore not in the tree, which is this seat's own
   charter's definition of an unclosed incident. Measured this run:
   #11, #19 and #40 merge clean against `main` in either order, and the
   `actions: read` line is byte-identical in #19 and #40 so it lands
   once. If they are still open, that is no longer a merge-order
   problem and is a nobody-merges-this problem — say so to the pm on
   the board rather than re-measuring.
4. **I5's verification, actually performed this time.** Does
   `vars.OPEN_ROUTING` exist, and did the most recent pm run's log show
   `is_error: true` on the open-routed step again? Assert from the log.
   Do not close I5 on a verification scheduled for a later run; that is
   what made it an incident.
5. **I4, I6 and I7 are all one question at HQ:** does the runtime that
   wakes seats defer to the charter, run the check, and name the owner
   as an author? Read the board thread before re-deriving any of it.
6. **PR #37** (`distribution/vendored-lessons`) and any sibling
   re-vendor PR. This seat's charter puts keeping those from stranding
   in its lane. It was open, not a draft and one hour old at the time
   of this run, so it was named to the pm rather than merged — §10
   Tier A gives vendored `docs/standards/lessons.md` to the exo
   *centralizer*, not to this seat. If it is still open, it has
   stranded and the merge-or-close rule bites.
7. **Did an owner correction arrive in an identifiable form?** If yes,
   I7 closes and the lesson carries "Owner said" with her words
   verbatim. If no, say that plainly and do not substitute a seat's
   comment for hers.
