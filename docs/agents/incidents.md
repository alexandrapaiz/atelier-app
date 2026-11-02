# Incident Register — Atelier

Blameless, exo-owned. Inherited law from alexandria's register applies
from day zero: judge runs by artifacts never conclusions; ship first,
then work; secret first, schedules last; caps from evidence (see
docs/standards/lessons.md). An incident is closed when the fix is in
the tree.

Format: number, one-line title, date. Then what happened with the
evidence that shows it, the fix, and whether the fix has landed. An
incident stays open until its fix is in the tree.

## The index — read this before reading the file (added 2026-10-25, I23)

Twenty-eight entries, **eighteen open** — I4, I5, I6, I7, I10, I11,
I13, I15, I19, I20, I21, I22, I23, I24, I25, I26, I27, I28. Two closed
during the hook run of 2026-10-25 (I16, I18), both on the verification
the entry itself demanded rather than on the fix's line being present;
the message run after it closed none and added three; the message run
after *that* added I27 and I28 and moved **I21 to half closed** — the first
blocked fix ever addressed to whoever holds the resident runtime to
move in any part. **Seven of the eighteen open entries — I4, I5, I6,
I7, I10, I11, I13 — resolve only on a surface this repository cannot
reach**, which is a routing problem wearing seven faces (L32).

**This file is now the index and the entries and nothing else.** The
1,689 lines of previous runs' homework — answered lists, caps tables,
per-run accounts and next-run lists, formerly interleaved with the
incidents — moved to `docs/agents/run-notes.md` on 2026-10-25 under
I23, so a memoryless run opening this file top-down meets what is
still broken instead of hundreds of lines of answered questions. One
line per entry, newest last, status asserted from each entry's own
`**Status.**` paragraph.
**A run that changes a status updates this line in the same commit**;
an index that drifts is worse than no index, because a reader who
checks it gets an answer.

| # | one line | status |
|---|---|---|
| I1 | Two charters claim `docs/agents/pending.md` | CLOSED 2026-09-19 |
| I2 | ADR-015 open routing configured but not in effect | CLOSED 2026-09-19, reopened in substance by I5 |
| I3 | The workflow prompt overrides the pm charter's branch name | CLOSED 2026-09-19 |
| I4 | Every seat run for a month happened on a surface none of this repo's fixes reach | **OPEN** |
| I5 | A step reported success while its own artifact said it failed | **OPEN** |
| I6 | The branch-convention defect recurred on the surface that replaced I3's | **OPEN** |
| I7 | The seat cannot tell the owner's comments from its own | **OPEN** (comments only; commits closed by I9) |
| I8 | One pull request carried two merge tiers | CLOSED 2026-10-24 |
| I9 | I7 claimed a distinction the surfaces do make | CLOSED 2026-10-24 |
| I10 | The board is in every seat's environment; no seat workflow can be woken by it | **OPEN**, routed |
| I11 | Four measured findings died when the pull request carrying them was closed | **OPEN** |
| I12 | The draft check's false-positive guard cannot fire where the seats run | CLOSED 2026-10-24 |
| I13 | This repository's fixes and this company's runs are on different surfaces | **OPEN** — the root of I4, I6, I10, I15 |
| I14 | The draft check's strongest verdict aims at the case it cannot see | CLOSED 2026-10-24 |
| I15 | A merger cannot see that a seat is still running | **OPEN** as a signal defect; seat half closed by L18 |
| I16 | The ship check passes on any abbreviated base sha | CLOSED 2026-10-25 by this run's own two calls |
| I17 | A handoff about a live branch was true for seventy-two seconds | CLOSED on L14; its sweep residual confirmed on live evidence 2026-10-25, routed at entry 18 |
| I18 | The freshness guard can be switched off and the clean line does not say so | CLOSED 2026-10-25 by this run's own call |
| I19 | The vendored standard's enforced-rule list is short two rules | **OPEN**, HQ's lane |
| I20 | `carries=work` cannot see a sibling pull request carrying the same work | **OPEN**, entry 19 |
| I21 | The field that tells a refusal from a defect was null on a proven refusal | **HALF CLOSED 2026-10-25** — the column is populated, including backwards over history; the `report` clause is not |
| I22 | Two seats met one capacity wall and resumed two different ways | **OPEN** on the charter clause, now routed at entry 24; draft half closed |
| I23 | The registers this seat must read have outgrown the run that reads them | **OPEN**; the index below is its first fix |
| I24 | L22 failed to bind one run after it was written, because it only bound the reader | **OPEN** as a binding question; L29 is the fix, in the tree |
| I25 | The lease flag that protects a force-push is inert on the runtime's clone | **OPEN**, entry 22; seat half in L30 |
| I26 | The documented test for a broken filter now fires on a filter that works | **OPEN**, entry 23; seat half in L31 |
| I27 | A conflict claim named three files the branch it addressed does not contain | **OPEN** as a binding question; L33 and L34 are the fix, in the tree; sender half routed at entry 25 |
| I28 | L21's wake budget failed to bind the run that was writing about rules failing to bind | **OPEN** — L21 now carries the check; closes when a run that did not write this entry sends untruncated and says it ran it |

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

**Amended 2026-10-24, same day, later run — the fallback is the
owner's design, and the residue is cost.** This entry says "the
fallback works, the design holds", and a surface this seat had not yet
read confirms it in her own hand. Commit `257e92e`, 2026-09-23,
authored `alexandrapaizdelgado@gmail.com`, touching only
`.github/workflows/agent-pm.yml`:

```
Open routing is best-effort: fall back to the Claude step when the
Kimi step fails (HQ Incident 4: Moonshot concurrency)
```

So `continue-on-error: true` on that step is a deliberate instruction
and not a defect, and L5 is a rule about how to *read* such a step,
never a complaint about its presence. What remains a defect is the
price of best-effort as currently built: the failing attempt ran to
**21m 30s, 50 turns and $0.78** before the fallback started, because
nothing caps the open-routed attempt — it is bounded only by the seat's
own turn cap, which is the cap for doing the work rather than for
probing a route. A best-effort route needs a ceiling, not only a
fallback. That is L11, from her words, and it is the part PR #11 does
not reach: #11 adds a switch, which turns the route off, and no
ceiling for when it is on.

**Status.** OPEN. I2 is reopened in substance: ADR-015 is active and
failing, which is neither of the two endings I2 offered. The failing
route is deliberate and bounded by nothing.

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

### I7 — The seat cannot tell the owner's comments from its own (2026-10-24)

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

**Amended 2026-10-24 by I9, same day, later run.** The claim above is
correct for pull request comments and wrong for commits, and this entry
tested only comments. Git's author field does identify the owner: her
commits carry `alexandrapaizdelgado@gmail.com`, seats carry
`<seat>@agents.epito.me`, and the account's
`users.noreply.github.com` address appears on merge commits only. The
harvest command is in I9 and in L9. The title of this entry has been
narrowed from "corrections" to "comments" to match its evidence; the
original text is left standing above rather than rewritten.

**Status.** OPEN, as to pull request comments only. Nine seat comments
in this repository's queue are posted under her login, including HQ's
YC and MBA seats' advisories, and nothing in the API distinguishes
them from hers. Closes when her comments arrive under an authorship a
reader can test, as her commits already do.

### I8 — One pull request carried two merge tiers, and the cheap half was stranded by the expensive one (2026-10-24)

**What happened.** PR #40, the previous run of this seat, carried five
commits: one that adds a step to `.github/workflows/agent-*.yml`, and
four that write `docs/agents/incidents.md`, `lessons.md` and the
"Blocked fixes (exo)" section of `pending.md`. The workflow commit
makes the whole pull request Tier B under docs/standards/pm.md §21, so
no exo run may merge it. The four register commits are Tier A
knowledge surfaces that the pm seat merges routinely. Bundled, they
inherited the workflow commit's merger.

**Evidence.** PR #43, the pm seat's run four hours later, swept the
queue and declined #40 along with #11 and #19: "All three touch
`.github/workflows/`, which this run's own instructions bar it from
touching at all, so I named a chair or the owner as the merger to
expect." The same sweep merged three other pull requests the same
hour (#31, #34, #39) and self-describes the rule it was applying:
"#33, #35, #36, #41 — every changed file is a knowledge surface, which
standards/pm.md §10 Tier A would let this seat self-merge." So the pm
seat had the authority to land #40's register half and could not reach
it, because the register half was not a pull request.

The same sweep also records #40 as "green, clean, **workflow-only**",
which it was not. A bundled pull request is also read at its highest
tier, so the register content was invisible to the reader deciding its
fate.

**The fix, in the tree.** This run split them. PR #45 carries the four
register commits, cherry-picked onto `main`, docs-only. PR #40's branch
received four `git revert` commits and a merge of `main`, so its net
diff is now exactly `+108/-0` across the three workflow files and
nothing else — verified with `gh pr diff 40 --name-only`. Nothing was
rewritten and no history was forced: both halves remain reversible, and
if PR #45 is closed unmerged the reverts on #40 can themselves be
reverted.

**Status.** CLOSED 2026-10-24: the split is in the tree as PR #45 and
the reduced PR #40. The rule it leaves behind is L8.

### I9 — I7 claimed a distinction the surfaces do make, on the one surface that does not make it (2026-10-24)

**What happened.** I7, filed by the previous run hours earlier, says
this seat "cannot tell the owner's corrections from its own" because
"every seat in this company pushes and comments under the
`alexandrapaiz` GitHub account". That is true of pull request comments
and false of commits, and I7 tested only the first.

**Evidence.** Git's author field partitions this repository's history
cleanly. Seats author as `<seat>@agents.epito.me`:

```
$ git log --all --format='%an <%ae>' | sort | uniq -c | sort -rn
     13 atelier-engineer <atelier-engineer@agents.epito.me>
     12 exo-centralizer  <exo-centralizer@agents.epito.me>
     11 atelier-pm       <atelier-pm@agents.epito.me>
      9 atelier-exo      <atelier-exo@agents.epito.me>
     71 alexandrapaiz    <alexandrapaizdelgado@gmail.com>
      2 alexandrapaiz    <alexandra.paiz@grupopdc.com>
     28 alexandrapaiz    <111912770+alexandrapaiz@users.noreply.github.com>
```

The three `alexandrapaiz` addresses are not interchangeable. All 28 of
the `users.noreply.github.com` commits are merges or squash-merges —
the account's token acting for whichever seat pressed the button, which
is the ambiguity I7 described. The `gmail.com` commits are **all
non-merge**, and the proof that they are hers rather than a seat's is
already in this repository's own register: L1 captures the owner's
verbatim words as "the $99 waits for the product to earn it", and

```
$ git log --all --no-merges --author=alexandrapaizdelgado@gmail.com \
      --format='%s' | grep worthiness
The worthiness gate: the $99 waits for the product to earn it
```

is that sentence, as a commit subject, under that address. A lesson
this register already treats as owner-verbatim traces to this exact
surface, so the surface identifies her.

**What this run found with it.** Three owner commits in the harvest
window since the last exo run: `8ca0f7a` (2026-09-20, the PM seat's
Working Backwards duty), `257e92e` (2026-09-23, open routing is
best-effort), `a1418c3` (2026-09-27, the board in every seat's
environment). `257e92e` is an override of a seat's own work and becomes
L11. I7's honest half survives: on pull request comments there is still
no discriminator, and this run read nine seat comments posted under her
login — HQ's YC and MBA seats among them — none of them hers.

**Assessment.** The register defect is not that I7 was wrong about
comments. It is that I7 generalized from one surface to all of them and
filed the generalization as the finding, which made a tractable harvest
look impossible and would have told every future run not to bother
looking. A claim about what cannot be known has to name the surface it
tested.

**The fix, in the tree.** I7's text is amended in place with a dated
correction rather than rewritten, its status narrowed to comments, and
the harvest command is named so a memoryless run can run it instead of
rediscovering it:

```
git log --all --no-merges --author=alexandrapaizdelgado@gmail.com \
    --since=<last exo run> --format='===== %h %ad%n%B' --date=short
```

**Status.** CLOSED 2026-10-24 as to commits; I7 remains OPEN as to
comments, narrowed to what its evidence supports. L9 is the rule.

### I10 — The owner put the board in every seat's environment; no seat workflow can be woken by it (2026-10-24)

**What happened.** On 2026-09-27 the owner added `BOARD_API_URL` and
`BOARD_RUNTIME_TOKEN` to all three seat workflows, with the commit
subject "Every seat run gets the board ... pm.md §14 the board is a
tool every seat uses". None of the three workflows listens for
`repository_dispatch`, so a board message addressed to a seat in this
repository wakes nothing and records no error.

**Evidence.** Her commit `a1418c3` touches
`.github/workflows/agent-{engineer,exo,pm}.yml` (+2 lines each) and
`docs/standards/pm.md`. Against that, every trigger on `main` today:

```
$ grep -A3 '^on:' .github/workflows/agent-*.yml
agent-engineer.yml:  # schedule: ... (commented)   workflow_dispatch:
agent-exo.yml:       # schedule: ... (commented)   workflow_dispatch:
agent-pm.yml:        # schedule: ... (commented)   workflow_dispatch:
```

`workflow_dispatch` only, in all three. HQ's YC seat measured the same
thing portfolio-wide on 2026-10-18 and posted it on PR #13: "None of
this repository's three seat workflows listens for its own event ...
Across the portfolio that is 4 of 32 agent workflows, and three of the
four are this repository's entire roster ... A board message addressed
to a seat here wakes nothing and records no error, which is the failure
mode `standards/pm.md` §17's 2026-10-05 revision wrote down in
advance." Six days later it is still true.

Neither open workflow pull request fixes it, which this run checked
rather than assumed:

```
$ git diff main..pr/11 -- .github/ | grep -c repository_dispatch   # 0
$ git diff main..pr/19 -- .github/ | grep -c repository_dispatch   # 0
```

**Assessment.** This is I4 from the other direction. I4 says the
workflows have carried no seat run in thirty days; this says one
documented reason why, and it is not that nobody tried. The owner's
own commit records the intent that the board wakes seats, and the
intent has been defeated for four weeks by two missing lines per file.
Credentials for a channel are not a subscription to it.

**Whose it is.** Not this seat's, and this is deliberate restraint
rather than reach: standards/pm.md §15 gives workflow files in every
product repo to HQ, the YC seat has already handed this to the exo
centralizer with an idempotent tool (`tools/event-bus-workflows.py`),
and adding the trigger here would make a fourth Tier B pull request in
a queue whose defining problem is that nobody merges the three already
open (I8, and entry 5 under "Blocked fixes (exo)"). Recorded, with the
measurement, so whoever holds HQ's hand does not re-derive it.

**Status.** OPEN, routed. Verification when it lands: a board message
to a seat here produces an Actions run whose `event` is
`repository_dispatch`, read from `gh run list --json event`, never from
the workflow file.

### I11 — Four measured findings died when the pull request carrying them was closed (2026-10-24)

**What happened.** HQ's YC seat posted three advisory comments on PR
#13 between 2026-10-18 01:30Z and 08:36Z. The third one is a
measurement of four defects in `company.yaml` **as it stands on
`main`**, not in the pull request. On 2026-10-24 00:35Z a seat closed
#13 with "Closing as superseded: company.yaml already exists on main,
rewritten by the HQ chair 2026-10-16 with different, newer content".
That sentence is true and answers the branch. It answers none of the
four findings, and closing the thread took them out of every queue.

**Evidence.** The four, in the YC seat's own words and still true in
`main`'s `company.yaml` as of this run:

1. `posture: asleep` is not a value in
   `standards/company.schema.json` — the enum is `flagship, product,
   internal, private-rd, legacy, infrastructure, holding`. Reported
   twice, with `tools/check-manifest.sh` output: "4 finding(s)".
2. `cadence: on-dispatch` on all three seats, where "this company's
   token is `dispatch-only`". Three of the four findings are this one
   slip, repeated per seat.
3. No `pending:` key under `surfaces:`, and HQ's sync resolves that
   surface only from the manifest with no default. The consequence was
   measured: "The first green sync after `main`'s current manifest will
   render eight fewer rows and print no line saying why" — the eight
   being the owner-only items in `docs/agents/pending.md`, the
   worthiness gate among them.
4. No `sprints:` key, "which is where this repository actually plans
   and which HQ therefore cannot currently read either".

A fifth drift, found by this run and not by the YC seat:
`company.yaml` records `standards: pm: f2f0561`, while
`docs/standards/pm.md`'s own vendored header reads
`fb114f478e31396ed6b70cc496713379334289a4`, re-vendored by PR #38 on
2026-10-24. The manifest's pointer to the standard it has adopted is
two revisions stale.

**Assessment.** The YC seat said plainly what act it wanted — "the act
is a reconciliation onto main, not a merge and not a close" — and the
one act it ruled out is the one that happened. No seat did anything
wrong by its own lights: the closer checked whether the branch was
superseded, which it was. The defect is that a pull request thread is
the only place those four findings lived, and a thread is deleted from
view by a legitimate close. Findings posted on a pull request outlive
it; they belong in a register before the thread can be closed, and
that is this seat's register.

**The fix.** `company.yaml` is HQ's file, written by the chair, and not
in this seat's write lane, so the correction is recorded as entry 6
under "Blocked fixes (exo)" with the exact replacement content — which
is now its home regardless of what happens to PR #13.

**Status.** OPEN. Closes when `main`'s `company.yaml` passes
`tools/check-manifest.sh` with zero findings and declares `pending:`
and `sprints:`. The verification is the validator's output, not the
file's existence.

### I12 — The stranded-draft check's one false-positive guard cannot fire on the surface that runs the seats (2026-10-24)

**What happened.** `tools/check-draft-prs.sh` landed on `main` in PR
#39, and PR #40 wired it into all three seat workflows. Its one guard
against naming the caller's own work is `run=live`. The guard reads
GitHub Actions runs. Every seat run in this company for thirty days has
happened on the resident runtime, which Actions cannot see, so the
guard never fires there and a run's own in-flight draft is always
reported `STRANDED`.

**Evidence.** Run from inside this run, against the live queue:

```
$ bash tools/check-draft-prs.sh --seat exo ; echo "exit=$?"
STRANDED  #45 atelier-exo/2026-10-24-hook idle=0h commits=4 files=3 carries=work run=none
check-draft-prs: 1 of 1 draft(s) in scope are stranded — ...
exit=1
```

`#45` is this run's own pull request, open minutes earlier, being
written into at the moment the check ran. The mechanism is at
`tools/check-draft-prs.sh:112`, `[ "$live" -gt 0 ] && run=live ||
run=none`, where `$live` comes from `gh run list` filtered to the
branch. The tool's own header comment makes the point without meaning
to: its worked example of a stranded draft, at line 17, is
`STRANDED #31 atelier-engineer/2026-10-24-message ... run=none` — the
engineer seat's own draft, in flight on the runtime when that example
was written.

**Assessment.** The check is correct and the documentation describing
it is correct — "a draft whose branch is carrying a run right now
prints `LIVE` and is not counted: that is the run you are standing in"
— on the surface it was designed against. This is I4 again, one layer
down: not a fix that does not reach the running surface, but a fix
whose *correctness condition* does not hold there. Its cost is
specific. Entry 1 under "Blocked fixes (exo)" asks every seat to put
this check's output in its pull request and reads exit 1 as "pull
requests on your seat that no merger can reach". If exit 1 is also the
normal result of running at all, the number stops carrying information
and a reader learns to skip it — which is the failure the whole check
exists to prevent, relocated into the check.

**The fix.** Cheap, and in the engineer's lane rather than this seat's,
because `tools/` is product surface. Treat the branch the check is
standing on as live regardless of what Actions knows:

```sh
self=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
# ... in the loop, before the run=live test:
[ -n "$self" ] && [ "$branch" = "$self" ] && run=live
```

That keeps the conservative default everywhere else — an unreadable
field still counts as stranded (L-A44) — and removes the one case the
tool already intends to exclude. Recorded as entry 9 under "Blocked
fixes (exo)" with the paste, and routed to the engineer rather than
applied here.

**Status.** CLOSED 2026-10-24 (message run 3), on its own
verification and not on the fix being present in the file. The engineer
seat applied it in `0a66c7a`, merged in PR #47. Run from inside this
run, against the live queue, with this run's own draft open:

```
$ bash tools/check-draft-prs.sh --seat exo ; echo "exit=$?"
LIVE      #53 atelier-exo/2026-10-24-message-3 idle=0h commits=1 files=1 carries=work run=self
check-draft-prs: 1 draft(s) in scope, 1 out of scope, none stranded.
exit=0
```

The fix is also covered by fifteen tests in
`tests/draft-prs.test.mjs`, including the case that matters — the
caller's own live draft printing beside somebody else's stranded one,
both readings shown, exit 1 — so the guard excludes the caller without
hiding anything else. That reading, and the detail that the fix merged
at 21:59:32Z, are taken from a commit of this seat's own previous run
that never reached a pull request; see I15.

Two things in that output are not what this incident asked for, and
both are improvements this seat confirms rather than merely accepts.
The field word is `run=self`, not the `run=live` the fix above
proposed: the engineer's reasoning is L-E11's, that a verdict names the
reading it came from, and a branch read and an Actions read are
different facts that should not print the same word. The engineer
asked this seat to confirm or reject it. **Confirmed**, and the paste
in entry 9 and the charter bullet in entry 1 now say `run=self`, so
that no seat copies a word no reader can get. Second, the summary line
now prints both counts, which closes the blind-pass half of L-A21 on
this tool: `0 draft(s) in scope, 1 out of scope` and `1 draft(s) in
scope, 1 out of scope` are different sentences, and before this run the
first could not be told from a clean scope that had examined
everything.

**What this closure does not cover.** The guard is a branch read, so it
vouches for exactly one draft, the caller's. A second seat running in
the same minute on its own branch is the case left over, and this run
measured what the check actually says about one. That is I14, not a
footnote here.

### I13 — Five entries and now a sixth are one defect: this repository's fixes and this company's runs are on different surfaces (2026-10-24)

**Why this entry is about the split rather than about the check that
broke.** The previous run's list, item 8, set the condition for it:
"I4 has now recurred twice in different clothes, as I10 (a surface that
cannot be woken) and I12 (a guard whose correctness condition does not
hold there) ... If a sixth recurs, the finding to file is about that
split, not about the defect that repeated." A sixth recurred, inside
twelve hours, and was handed to this seat by another seat. So this is
that entry, and the tripwire defect is recorded inside it as the
instance rather than as its own number.

**The sixth instance.** The engineer seat measured a defect in the
no-ship tripwire and addressed it to this seat on the board (message
`fd952b50`, ref PR #44), because workflows are not that seat's lane.
The tripwire asked whether a remote branch contains the head:

```sh
pushed=$(git branch -r --contains HEAD 2>/dev/null | tr -d ' ')
```

`git branch -r` answers only from the remote-tracking refs the clone's
refspec creates. The resident runtime's clone fetches the mainline
alone, so no tracking ref is ever created for the branch the seat just
pushed, and the reading is empty for work that is safely on the remote.
Re-measured in this run against this run's own pushed branch:

```
$ git config --get remote.origin.fetch
+refs/heads/main:refs/remotes/origin/main
$ git rev-parse --is-shallow-repository
true
$ git branch -r
  origin/HEAD -> origin/main
  origin/main
$ git branch -r --contains HEAD
                                        (empty)
$ git ls-remote --heads origin atelier-exo/2026-10-24-message-2
19ecc88e725a602f82e2e6154bf4dc3c0e879d56  refs/heads/atelier-exo/2026-10-24-message-2
$ git rev-parse HEAD
19ecc88e725a602f82e2e6154bf4dc3c0e879d56
```

Same sha from the remote, nothing from the local refs. A run that had
shipped would have been failed as a run that shipped nothing, which is
the exact inverse of what I3 built the tripwire to catch. The cause is
the refspec and not the depth, so the `git fetch origin` on the line
above the check cannot repair it however carefully it is written; a
question put to the remote needs no local ref at all.

**What the handoff got right, and the one thing it got wrong.** It was
right about the cause (the refspec, not the depth), right about the fix
shape (ask the remote; one call), and right about the vehicle — PR #11,
this seat's open workflow pull request from 2026-09-30, so that no
second pull request is opened against the same three files for somebody
to resolve. It was wrong that PR #11 already fixed it. That branch
rewrote the step *around* the line and kept the line. Running its own
version of the tripwire in this run's clone:

```
PR#11 version: commits=1 pushed=[EMPTY] pr=48 dirty=[clean]
VERDICT: ::error:: never pushed -> exit 1   (false: the remote has it, sha matches)
```

Checking that cost one command, and the handoff is better for having
been checked rather than adopted. The generalized rule is L14.

**The fix, and that it is only half a fix.** Commit `e53e810` on
`exo/2026-09-30-workflow-l-e8` (PR #11), one commit added to the
existing pull request rather than a fourth one against those files. The
check now asks `git ls-remote --heads origin "$branch"` and compares to
`git rev-parse HEAD`, and reports three outcomes instead of two (L6):
the remote has this HEAD, the remote has the branch at another tip
(failure, naming both shas, because the commits above the remote tip
still die with the sandbox), or the remote could not be asked (failure,
named as could-not-run rather than as a finding). Smoke-tested on a git
fixture whose clone carries the mainline-only refspec:

| case | expected | result |
|---|---|---|
| seat branch pushed, mainline-only refspec | pass | exit 0, `origin/<branch>`; the old reading answered `[]` here |
| run never branched, nothing produced | fail | `::error::produced nothing at all`, exit 1 |
| commits made, never pushed | fail | `::error::never pushed`, exit 1 |
| remote holds the branch at an older tip | fail | `::error::` naming both shas, exit 1 |
| remote unreachable | fail, as could-not-run | `::error::could not be asked`, exit 1 |

All three workflows parse as YAML and every tripwire body passes
`bash -n`, before and after the merge with PR #40. Merge order was
measured rather than assumed: #11, #19 and #40 merge clean against
today's `main` in all three orders tried, the combined tree parses and
passes all five fixture paths, and `actions: read` lands exactly once.

**Why the fix does not close the incident.** None of it fires on
anything. The surface measurement, from the instrument the engineer
seat landed on `main` hours earlier:

```
$ bash tools/check-seat-surface.sh
ELSEWHERE seat=engineer declared=.github/workflows/agent-engineer.yml declared_last=2026-09-19 actual_last=2026-10-24 gap=35d actual_surface=host.alexandra-systems-company.com source=board board_runs=6
ELSEWHERE seat=exo      declared=.github/workflows/agent-exo.yml      declared_last=2026-09-19 actual_last=2026-10-24 gap=35d actual_surface=host.alexandra-systems-company.com source=board board_runs=3
ELSEWHERE seat=pm       declared=.github/workflows/agent-pm.yml       declared_last=2026-09-24 actual_last=2026-10-24 gap=30d actual_surface=host.alexandra-systems-company.com source=board board_runs=13
check-seat-surface: 3 of 3 seat(s) run somewhere company.yaml does not name — an edit to the declared workflow reaches nothing (L-A16). 0 unclear.
```

`GET /api/board/atelier` carries 21 run records, 20 of them inside the
last day, and every one has a `run_url` on
`host.alexandra-systems-company.com`. `gh run list` returns five seat
runs in this repository's entire history, the newest on 2026-09-24.
Stated plainly: **this run was not protected by a no-ship tripwire at
all**, because on the surface that executed it there is none. The
protection I3 built in September guards a dispatch path that has not
carried a seat in a month.

**The roll-up, which is the actual finding.** Six entries in a register
of thirteen are one defect wearing different clothes:

| entry | the instance |
|---|---|
| I4 | a fix landed in a file that does not execute |
| I6 | a rule fixed on the declared surface, re-broken by the real one |
| I10 | the declared surface cannot be woken by the board every seat carries |
| I12 | a guard whose correctness condition does not hold on the real surface |
| I13 | a check whose *question* is unanswerable on the real surface |
| I5/I2 | open routing configured on the declared surface, never in effect |

The common root is one sentence: **everything this repository can write
is read by a surface that does not run the seats, and everything that
runs the seats is configured somewhere this repository cannot write.**
Every seat here is memoryless by design, reads `prompts/` and `docs/`
for its law, and ships fixes into `.github/`; the first two are read by
the runtime and the third is not. That is why the fixes keep being
correct and keep not binding.

**What closes it, and it is not this seat's to do.** Two options, both
outside this repository's write lane, written out as entry 10 under
"Blocked fixes (exo)":

1. The resident runtime runs this repository's checks. The pattern
   already exists twice on `main` — `tools/check-draft-prs.sh` behind
   `npm run drafts`, and `tools/check-seat-surface.sh` — so the ship
   check becomes a repo-level script the runtime calls after a seat
   run, and then one fix binds on both surfaces at once.
2. Or the seats are dispatched through Actions, so the declared surface
   is the real one again. I10 records that nothing can currently wake
   them from the board, so this option needs that first.

**What this seat deliberately did not do.** Writing the ship check as
`tools/check-shipped.sh` would have made it callable by the runtime
today. `tools/` is the engineer seat's lane — I12 says so in its own
fix ("in the engineer's lane rather than this seat's, because `tools/`
is product surface") — and L3 says a seat that finds itself in
contested territory yields and files the conflict rather than winning
the race. So it is an ask to the engineer seat on the board and entry
10 here, not a file this run wrote. Two seats racing the same path is
I1, and this register does not need it twice.

**Status.** OPEN, and it is the one entry in this register that cannot
be closed from inside this repository. Verification, for whichever run
reads this next: a seat run whose *own* ship check ran on the surface
that executed it. Not a merged pull request, and not a green workflow
file.

**Update 2026-10-24 (message run 3), measured, one line as the previous
list asked.** Unchanged, and the gap was not re-measured with
`tools/check-seat-surface.sh` because that measurement is already this
entry. The test the previous list set was one sentence — did a seat run
on the resident host produce output saying whether it pushed — and the
answer is no: `tools/` on `main` holds `check-draft-prs.sh`,
`check-seat-surface.sh` and `README.md` and no ship check, and all 25
run reports on the board read "Host window run of atelier-<seat> on
<trigger>: N turns in M min, pull request ..." with no ship verdict in
any of them.

What *did* move is the first half, and it moved in the right lane,
while this run was writing. The engineer seat's PR #52 is entry 10's
option 1 being taken up by the seat it was addressed to, and because
this run read the object twice rather than the claim once (L14), the
register can state its timeline instead of its title:

| 22:00:35Z | `#52` opened draft-first, one empty commit, `+0/-0` |
| 22:07:18Z | `check-shipped: the no-ship tripwire as a tool, so it binds on the surface that runs the seats` |
| 22:12:56Z | 65 files, `+884`: `tools/check-shipped.sh` (316 lines), `tests/shipped.test.mjs` (367), 20 fixture directories, `tools/README.md`, `package.json` |

Read at `FETCH_HEAD`, the tool is the tripwire body from PR #11 at
`e53e810` with four verdicts — `SHIPPED`, `ORPHANED`, `UNPUSHED`,
`NOTHING` — a `--fixture` mode, and no Actions dependency. That is
exactly the ask: a repository-level script either surface can call.

**It changes nothing about this entry's status, and the reason is the
half that is left.** The tool is on a branch, not on `main`, and a tool
nothing calls is not a check. The remaining half is unchanged and is
not this repository's to write: the resident runtime must call it after
each seat run and put its verdict in the run report. Entry 10 keeps
both halves, with the first marked delivered-on-a-branch. The test the
previous list set — a seat run on the host whose own output says
whether it pushed — is still unmet, and the next run's test is not
whether `check-shipped.sh` merged but whether anything *calls* it.

**One reading this entry has never had: the port executes on the real
surface, and its verdict is right.** This run called it by hand, from
inside a host-window run on `host.alexandra-systems-company.com`, from
the engineer's branch tip and without writing to `tools/`:

```
$ bash /tmp/check-shipped.sh ; echo "exit=$?"
- branch: `atelier-exo/2026-10-24-message-3` (6 commit(s) ahead of main, base named by read)
- pushed to a seat branch (asked of the remote): origin/atelier-exo/2026-10-24-message-3
- base before this run: not given, so a merge onto main is not a reading this run can take
- pull request: 53
SHIPPED    branch=atelier-exo/2026-10-24-message-3 source=remote-head sha=1c49196 pr=53
exit=0
```

That is the first time anything in this company has produced a ship
verdict on the surface that runs the seats, and it answers the one
doubt a runtime owner would reasonably have about entry 10 option 1:
the port is not merely written, it runs there and reads the right
answer through a mainline-only clone, which is the exact condition that
broke the workflow version (PR #11, `e53e810`). **It does not close
anything**, because a seat choosing to run its own ship check is not a
guard — the run that forgets is the run the guard exists for, and
nothing but the runtime can call it unconditionally. What it does is
reduce what remains to one line in whoever owns the runtime's
post-run step.

One correction this run owes its own register: the paragraph above
first read "as of 22:05 the pull request carries `+0/-0` and no files",
which was true when it was written and false eight minutes later. The
sentence is corrected rather than deleted because the stale version is
the evidence for I14 — a register that reports a live colleague's run
by a single snapshot will keep calling delivered work empty.

**Update 2026-10-24 (message run 4): the first half is on `main`, and
nothing calls it.** PR #52 merged at 22:24Z, so `tools/check-shipped.sh`
is now in the tree of the branch every seat clones, not on a branch.
That is entry 10 option 1's engineer half, delivered to the surface
that runs the seats.

The remaining half is unchanged and is the one that matters. The
previous list set the test as one sentence — did a seat run on the
resident host produce output saying whether it pushed — and the answer
is still no. `GET /api/board/atelier` returns 25 run records and
**0 of 25 reports mention shipping, pushing or any of the tool's four
verdicts**; every one reads "Host window run of atelier-<seat> on
<trigger>: N turns in M min, pull request <url>." The template has no
slot for a verdict, so the runtime is not calling the tool and would
have nowhere to put the answer if it did.

Two things this run can add that are not a re-measurement of the gap.
First, the tool was run on this surface for the second time and on a
state it had never been given: a committed-and-unpushed HEAD, where it
printed `ORPHANED` with both shas and exited 1, and `SHIPPED` with
`source=remote-head` after the push. It reads the real surface
correctly, which is the doubt a runtime owner would reasonably have.
Second, and against that, **the version on `main` has a false pass in
it** that no previous reading could have found because no previous
reading passed `--base-sha`: see I16. Entry 10's remaining ask is
therefore no longer only "call it" but "call it, and not with
`git rev-parse --short`".

**Status.** Unchanged: OPEN, and still the one entry here that cannot
be closed from inside this repository. What moved is that the half that
*was* inside it is now done and merged, so what is left is one line in
whoever owns the runtime's post-run step, plus the one-line fix in I16
before that line is worth writing.

### I14 — The draft check's strongest verdict is the one it aims at the case it cannot see (2026-10-24)

**What happened.** I12 is closed: a run's own draft now reads `LIVE
... run=self`. The case the branch read cannot reach is another seat's
pass, running in the same minute on its own branch, and the engineer
seat named that residual in its own handoff rather than leaving it to
be found. This run ran the check across all three seats to see what the
residual actually prints, and it is worse than a missing `LIVE`.

**Evidence.** Run from inside this run, at 22:05 on 2026-10-24:

```
$ bash tools/check-draft-prs.sh --all ; echo "exit=$?"
LIVE      #53 atelier-exo/2026-10-24-message-3 idle=0h commits=1 files=1 carries=work run=self
STRANDED  #52 atelier-engineer/2026-10-24-message-2 idle=0h commits=1 files=0 carries=nothing run=none
check-draft-prs: 1 of 2 draft(s) in scope are stranded (0 out of scope) — ready them, close them, or name the clause that keeps them drafts (L-A32).
exit=1
```

`#52` was created at 22:00:35Z, four minutes before that line, by the
engineer seat's second message run of the evening, which opened its
pull request draft-first with one empty commit — the same practice
every charter in this repository mandates, including this one, and the
practice this run followed to open `#53`. `gh pr view 52` confirms the
read was accurate and not a failure: `+0/-0`, `files=0`, one commit.

**What that draft turned out to be.** Three minutes after the check
said to close it, at 22:07:18Z, it received the commit
`check-shipped: the no-ship tripwire as a tool`, and by 22:12:56Z it
carried 65 files and `+884` lines: `tools/check-shipped.sh`, its test
file, twenty fixtures. It is the delivery of entry 10 option 1 — the
largest open ask in this register, the one I13 calls the only entry
that cannot be closed from inside this repository, routed to that seat
by this one. **The single most destructive instruction this tool can
print was aimed, correctly by its own rules, at the fix for this
register's biggest open defect, three minutes before it arrived.** The
README's sentence about the cheap error and the expensive one is not a
hypothetical, and this is what it looks like from the inside.

**Assessment.** `carries=nothing` is not one field among several. The
tool's own README says it is *the* answer that tells a reader to close a
pull request, and says why that matters: "the cheap error here is one
merge of waiting; the expensive one is closing work that exists."
`run=none` and `carries=nothing` compose, and they composed here into
the most destructive instruction in the tool's vocabulary, aimed at a
colleague's run that was four minutes old and about to write its diff.
The same line carries the refutation — `idle=0h` — and the verdict
never consults it. `idle` is printed and then dropped; only `run`
decides `LIVE` versus `STRANDED`.

**The surface the ledger proposes for the fix cannot answer the
question.** `docs/ideas.md` (2026-10-24, "The branch fix excuses the
caller's own draft and nothing else") proposes a third reading,
`run=board`: ask the board, which holds every host-window run, whether
a run of that branch's seat is in flight. Its own first step is to
check the route before building it. This run checked, and the premise
fails twice:

| What the proposal needs | What `GET /api/board/atelier` returned at 22:08:03Z |
|---|---|
| a run that has started and not finished | 25 of 25 records carry `ended_at`; **none** in progress |
| this run, in flight as the read was made | absent — newest `exo` record is the 21:40 run that ended 22:03:40 |
| `#52`'s engineer run, in flight | absent — newest `engineer` record ended 21:51 |
| a join from a run to a branch | `branch` is **null** on 25 of 25 records |

A run reaches the board when it **ends** — `tools/README.md` already
records this, measured by the other tool a few hours earlier, and the
ledger entry was written without it. So a liveness reading sourced from
the board is blind for exactly the window it exists to cover, which is
I12's defect with the surfaces swapped. The one usable join is
`pr_url`, which the tool already holds as the number it is printing,
and which is null on 10 of 25 records.

**The fix, and whose it is.** `tools/` is the engineer seat's lane (L3,
and I12 ruled the same way), so this is a paste and not a diff: entry
12 under "Blocked fixes (exo)". It does not need the board. A draft
younger than the longest seat run on record cannot be stranded in the
sense this tool means — stranding is time with no merger, and four
minutes is not time — so a fresh draft prints its own word and is not
counted, and `carries=nothing` on a fresh draft stops reading as
"close this". The reading is weaker than `self` and prints as its own
word, per L-E11 and the same reasoning the engineer used for `run=self`.

**One more reading, taken at 22:33 while this pull request was being
finished, which corrects a claim this repository makes in two places.**
`tools/README.md` says "`run=live` can never fire on the surface that
runs the seats", and I12 above reasons the same way. It fired:

```
LIVE      #57 atelier-pm/2026-10-24-message-11 idle=0h commits=1 files=1 carries=work run=live
STRANDED  #56 atelier-engineer/2026-10-24-message-3 idle=0h commits=1 files=0 carries=nothing run=none
```

`gh run list --branch atelier-pm/2026-10-24-message-11` resolves it:
the in-progress run was **`tests`, `event=pull_request`** — this
repository's own CI, triggered by the push, not a seat run. So the
Actions reading is not dead on this surface; it is *coincidental*. For
the twenty to sixty seconds CI is in flight on a freshly pushed branch
it says `live`, and before and after it says `none`, with nothing about
the work having changed. Two readers a minute apart get opposite
verdicts on the same draft, and the word `live` is claiming a live seat
when its evidence is a live test job.

That makes the `carries=nothing` composition in this incident worse
rather than better, because which drafts get the close instruction
depends on CI timing, and it is a second reason the fresh guard in
entry 12 is the right shape: a draft's age is a fact about the draft,
and does not flicker. The README's sentence should be corrected to say
that `run=live` reads *any* Actions run on the branch, which on this
surface means CI and never a seat — that is one line in the engineer's
lane and is named in entry 12's verification rather than pasted
separately.

**The fix is verified, not just written.** A paste handed over
untested is a claim about a file, which is what L14 is about, so this
run applied entry 12 to a scratch copy outside the repository
(`/tmp/cdp-fresh.sh`, so that `tools/` was never written to) and ran
it against the same live queue minutes later:

```
$ bash /tmp/cdp-fresh.sh --all ; echo "exit=$?"
LIVE      #53 atelier-exo/2026-10-24-message-3 idle=0h commits=3 files=3 carries=work run=self
FRESH     #52 atelier-engineer/2026-10-24-message-2 idle=0h commits=3 files=64 carries=work run=fresh
check-draft-prs: 2 draft(s) in scope, 0 out of scope, 1 too fresh to judge, none stranded.
exit=0
```

Graded the way L-A21 asks: the unpatched tool on `main` prints
`STRANDED ... run=none` and exits 1 for `#52`, the patched copy prints
`FRESH ... run=fresh` and exits 0, and the difference is exactly the
case this incident is about and nothing else. `bash -n` passes. The
summary line names the fresh count, so a reader is told a draft was
*not judged* rather than left to read it as judged and cleared. Tests
belong with the fix and `tests/` is not this seat's lane either, so the
paste asks the engineer seat for them rather than shipping an untested
behaviour.

**Update 2026-10-24 (message run 4): the paste landed, with a better
word, and it has not merged.** The engineer seat applied entry 12 in PR
#56, readied and `MERGEABLE` and open at the time of this reading. The
previous list's test for this item was to read the word and check it is
neither `self` nor `live`, because a weaker reading must not borrow a
stronger one's name (L-E11). It is **`run=fresh`**, with its own verdict
word `FRESH` and its own summary count, so all three readings are
distinguishable in the output. Confirmed, as the engineer asked.

Two things in the port this seat did not ask for and endorses. The
threshold is a flag, `--fresh-under <minutes>`, defaulting to 60 with
the derivation written beside it — 2.6x the longest seat run on this
product's record (23m) — and `--fresh-under 0` turns the guard off for
a merger sweeping the queue, which is the reading a merger wants and
this seat had not thought to provide. And `idle` now prints minutes
under the hour, because `idle=0h` cannot tell a reader whether it
covered four minutes or fifty-nine, and the fresh verdict turns on
exactly that difference.

**What this run could not do, and says rather than implies.** The
live exercise is unavailable: the queue held exactly one draft at the
time of the read, this run's own, so both the tool on `main` and the
patched copy from `#56` print one `LIVE ... run=self` line and exit 0,
and neither can reach the `FRESH` branch. The reading that would settle
it needs a second seat's minutes-old draft open at the same moment,
which is not a condition a run can arrange. The engineer's fixtures
cover the logic; the surface is covered by the measurement already in
this entry, taken when `#52` was four minutes old.

**Then both halves arrived, twenty minutes later, while this run was
still writing.** `#56` merged at 22:42:45Z, and the condition that was
unavailable above made itself available: the engineer seat opened a
new draft. The verification this entry asked for, performed rather
than deferred:

```
$ bash tools/check-draft-prs.sh --all ; echo "exit=$?"
FRESH     #60 atelier-engineer/2026-10-24-message-5 idle=4m commits=2 files=2 carries=work run=fresh
LIVE      #58 atelier-exo/2026-10-24-message-4 idle=1m commits=12 files=68 carries=work run=self
check-draft-prs: 2 draft(s) in scope, 0 out of scope, 1 too fresh to judge (under 60m), none stranded.
exit=0
```

A colleague's four-minute-old draft, named as unjudged, counted
separately on the summary line so a reader cannot mistake it for one
examined and cleared, and exit 0 — where the tool as it stood this
morning would have printed `STRANDED ... run=none` and told a reader
to close live work. The paragraph above is kept as written rather than
rewritten, because "the condition was unavailable" was true when it
was measured and the twenty minutes between the two readings is the
same fact this incident is about.

**Status.** CLOSED 2026-10-24 (message run 4), on its own verification
and not on the fix being in the file. One residual is carried
separately and is not this entry: `tools/README.md` on `main` still
says `run=live` can never fire on the surface that runs the seats, and
it fires on every push from this repository's own `tests` workflow.
That is entry 15 under "Blocked fixes (exo)", one line.

### I15 — A merger cannot see that a seat is still running either, and this time it cost a commit (2026-10-24)

**What happened.** This seat's previous run — message run 2, PR #48 —
readied its pull request, and the pm seat merged it at 22:00:48Z. The
run did not end until 22:03:40Z. In those three minutes it learned
something worth writing: the engineer's fix for I12 had landed on
`main` at 21:59:32Z, so it wrote `10bc19a`, closing I12 on the tree
criterion and marking entry 9 APPLIED. **That commit had no vehicle.**
Its branch's pull request was already merged, and the charter's
one-pull-request-per-run rule meant the run could not open another. It
survived only because the run handed it to the pm seat on the board,
which verified it was genuinely missing from `main`
(`git merge-base --is-ancestor 10bc19a origin/main` → not an ancestor),
cherry-picked it unchanged, and carried it in as PR #54 while naming
itself a conduit rather than the author.

**Assessment: this is I14's root, with the cost realised instead of
narrowly avoided.** I14 is about a tool telling a reader to close a
live run's draft. This is a merger merging a live run's pull request.
The common cause is the same sentence: **nothing on any surface tells
anyone that a seat run is in flight.** The draft check cannot see it
(I12, I14); the board cannot see it (25 of 25 records carry `ended_at`,
L16); and a merger reading `gh pr list` sees `ready` and merges, which
is correct behaviour on the evidence available. Two seats behaved
correctly and a commit was still orphaned.

Nothing here is a complaint about the pm seat's merge. Merging a ready,
green, docs-only pull request inside two minutes is the behaviour this
register has been asking that seat for all week, and the recovery it
then performed — verify, cherry-pick unchanged, declare itself a
conduit, leave the authorship alone — is the correct handling of
another seat's lane. The defect is in the signal, not in either seat.

**The part that is this seat's own to fix, and it needs no one else.**
`ready` is the only thing a merger can read, and this seat spends it
too early. A run that readies its pull request and then keeps writing
is asserting "done" while not being done, and the orphaning follows
from that rather than from the merge. So: **ready the pull request when
the run is ending, not when the first draft of the body is written.**
Drafts exist for the open-early practice every charter here mandates,
and a draft is unmergeable by construction, which is exactly the
protection the window needs. The cost of readying late is one merge of
waiting; the cost of readying early is a commit that needs another seat
to rescue it. That asymmetry is the same one `tools/README.md` names
about `carries=nothing`, and the trade should be read the same way.

This run followed that rule only by accident of timing, and says so:
it readied `#53` and then wrote this entry, which is the same exposure,
with the same three-minute window open. The rule is in L18 so the next
run does it on purpose.

**Status.** OPEN as a signal defect, which is I14's and I13's root and
closes with them. **The seat-side half is closed by L18** and binds on
this seat from now. Verification for the signal half: any surface a
merger reads that says a run is in flight — the board gaining
in-progress records would do it, and L16 records that it has none.

### I16 — The ship check passes on any abbreviated base sha, and the pass hides a lost commit (2026-10-24)

**What happened.** `tools/check-shipped.sh` merged to `main` in PR #52
at 22:24Z, the engineer seat's port of the no-ship tripwire into a tool
either surface can call — entry 10 option 1, taken up by the seat it
was addressed to, and the first half of I13 to land anywhere that
executes. This run called it on itself, which is what the previous
run's list asked for, and the second call disagreed with the first
about the same tree.

**Evidence.** Both calls made from inside this run, seconds apart, on
one unchanged working tree with one commit made and not yet pushed.
The only difference is how the caller wrote `--base-sha`:

```
$ bash tools/check-shipped.sh --base-sha 641ad2843606e3d8f5be60949ad7cb3163008ac6
- base before this run: 641ad2843606e3d8f5be60949ad7cb3163008ac6; base now: 641ad2843606e3d8f5be60949ad7cb3163008ac6
ORPHANED   branch=atelier-exo/2026-10-24-message-4 source=remote-head origin/... is at 0c235d4 but HEAD is 9ecb31b
check-shipped: the remote holds atelier-exo/2026-10-24-message-4 but not this run's HEAD, so every commit above the remote tip dies with the sandbox. Push again.
exit=1

$ bash tools/check-shipped.sh --base-sha 641ad28
- base before this run: 641ad28; base now: 641ad2843606e3d8f5be60949ad7cb3163008ac6 (advanced)
SHIPPED    branch=atelier-exo/2026-10-24-message-4 source=base-advanced origin/main moved from 641ad28 to 641ad2843606e3d8f5be60949ad7cb3163008ac6 (weak: a concurrent merge reads the same)
exit=0
```

`641ad28` is the abbreviation of `641ad2843606e3d8f5be60949ad7cb3163008ac6`.
The base had not moved by a single commit. The second call reports that
it moved, concludes the run shipped, and exits 0 over the top of a real
`ORPHANED` — a commit that was about to die in the sandbox.

**The line.** `tools/check-shipped.sh:202`:

```sh
if [ -n "$base_now" ] && [ "$base_now" != "$base_sha" ]; then
```

`base_now` is read by the tool from `git ls-remote`, so it is always a
full forty-hex sha. `base_sha` is whatever string the caller typed.
Compared with `!=`, any difference in *representation* reads as a
difference in *state*, and the branch that inequality selects is the
passing one. The verdict order makes it worse rather than better: the
tool reads evidence of shipping before any absence of it, deliberately
and correctly, so `base-advanced` is tested second — above `ORPHANED`,
`UNPUSHED` and `NOTHING`. A false `advanced` therefore masks every
failure verdict the check has.

**Why this is reachable and not theoretical.** The caller this entry
exists for does not exist yet: it is the resident runtime, which entry
10 asks to call this tool after each seat run with the base tip it read
before dispatching. `git rev-parse --short HEAD` is the ordinary way to
capture that, it is what appears in almost every run report and commit
subject in this company, and it produces exactly the argument that
breaks this. The defect is positioned precisely where the first caller
will step.

**Why no test caught it.** Eleven fixtures in `tests/shipped.test.mjs`,
graded by mutation. Four set `base_now`, and in every one the fixture's
`base_now` and the fixture's `--base-sha` are different commits, so the
`advanced` branch is only ever exercised when it is right. The one live
case (`a run that never branched and produced nothing does not pass`)
passes `git rev-parse HEAD`, the full sha, so it only ever exercises the
branch not being taken. No case passes two spellings of one commit,
which is the single input that separates "the base moved" from "the
caller abbreviated". This is not a gap in diligence — the suite is the
most thorough in this repository — it is a gap in the *shape* of the
cases, and the generalized rule is L19.

**The fix, and whose it is.** `tools/` is the engineer seat's lane
(I12, L3), and this run's instructions additionally bar it from
`.github/workflows/` entirely, so this is routed rather than applied:
entry 14 under "Blocked fixes (exo)" carries the paste, its grading and
the two test cases it owes. The shape is: resolve both sides through
`git rev-parse` where the clone holds them, fall back to a prefix test
in whichever direction is unambiguous, and reject a `--base-sha` that
is not hexadecimal at parse time.

**The first draft of that paste was wrong, and the grading is what
said so.** It reported an unresolvable `--base-sha` as `INCONCLUSIVE`,
on L6's reasoning that a reading which failed is not a pass. Applied
to a scratch copy, it turned the `self-merge` fixture from `SHIPPED
source=base-advanced` into `INCONCLUSIVE` and broke the one test that
pins the case `--base-sha` exists for — and for a real reason, not a
fixture artefact: on a shallow clone the pre-run tip of a base that
genuinely advanced is not an object the checkout holds, so resolution
failing is the *normal* state of that case. A fix is graded against
the cases that already pass and not only against the defect it
targets; the paste in entry 14 is the version that is, at 74/74 before
and after.

**Status.** **CLOSED 2026-10-25 (hook run), on the verification this
entry demanded and not on the line being present.** The engineer seat's
fix landed in PR #64, merged at 02:27:08Z — `1b306d8` "The ship check
reads an abbreviated base tip as the same commit" and `4186958` for the
README — twelve minutes into this run, which merged `origin/main` and
re-measured rather than read line 202. Both calls, one unchanged base
`fa7c2514e083e70572ff270513fddf4524e2cec1`, one commit made and not
pushed:

```
$ bash tools/check-shipped.sh --base main --base-sha fa7c2514e083e70572ff270513fddf4524e2cec1
- base before this run: fa7c2514...; base now: fa7c2514...
ORPHANED   branch=atelier-exo/2026-10-25-hook source=remote-head origin/... is at 951862d but HEAD is 224ed48
exit=1

$ bash tools/check-shipped.sh --base main --base-sha fa7c251
- base before this run: fa7c251; base now: fa7c2514e083e70572ff270513fddf4524e2cec1
ORPHANED   branch=atelier-exo/2026-10-25-hook source=remote-head origin/... is at 951862d but HEAD is 224ed48
exit=1
```

Same verdict, same exit, and the abbreviated call no longer appends
`(advanced)` to a base that did not move — which was the whole defect.
`npm test` on the merged tree: 0 failures. Four runs asked for this
check; this is the one that could make it. Entry 14 of
`docs/agents/pending.md` is marked APPLIED and must not be pasted
again.

### I17 — A handoff about a live branch was true for seventy-two seconds, and the remedy it named would have rewritten this register (2026-10-24)

**What happened.** The pm seat merged PR #53 and PR #56 into `main`,
read this seat's open draft immediately afterwards, found it
conflicting, and handed the rebase back to this seat as the owner of
the three files it touches. The handoff is correct about the lane and
was correct about the conflict at the moment it was read. It was wrong
by the time its recipient woke, because the branch it describes was
carrying a live run that fixed the same thing 72 seconds later.

**Evidence.** One timeline, every entry read rather than inferred:

| Clock (UTC) | What happened | Read from |
|---|---|---|
| 22:42:45 | `b534f26`, the merge of #56, lands on `main` | `git log -1 origin/main` |
| 22:44:33 | `3be17c0`, the live exo run's previous commit | branch log |
| 22:44:38 | the handoff posted: "it needs a rebase onto main before it can be readied" | board message |
| 22:45:50 | `8930dba`, that run merging `main` into its own branch | branch log |
| 22:47:22 | the forge recomputes: `MERGEABLE` / `CLEAN` | `gh pr view 58 --json updatedAt` |
| 22:52:50 | this run reads `MERGEABLE` / `CLEAN` | `gh pr view 58` |

And the reading that needs no service at all:

```
$ git merge-base --is-ancestor origin/main origin/atelier-exo/2026-10-24-message-4
$ echo $?
0
```

`origin/main` is an **ancestor** of that head. There is no rebase to
run: the branch is strictly ahead of the base it would be rebased onto.
`git diff --stat origin/main...` is three files, 786 insertions, all of
them `docs/agents/`. Carrying out the instruction as written would have
rewritten the whole of two nights of this register to resolve a
conflict that had already been resolved by the seat that owned it.

**What it is actually about.** Not the pm seat's reading, which was
accurate and timestamped in its own `reasoning`. Two things:

1. **`mergeable` is a cache with no staleness field.** GitHub computes
   it asynchronously after any change to either side, and `gh pr view`
   serves whatever the last computation said with nothing that
   distinguishes "recomputed just now" from "computed before the last
   three pushes". The one reading in this story that could not be
   stale is ancestry, and it is local. This is L13 — ask the system
   that owns the fact — with a clock attached: git owns merge-base, and
   the forge is a cache of it.
2. **A branch under a live run changes faster than a handoff travels.**
   This is I15's family. There, a merger could not see that a seat was
   still running and it cost a commit; here, a merger could see the
   branch perfectly and the cost was a stale instruction. The window
   measured in this instance is 72 seconds, which is shorter than the
   time it takes a wake to be delivered and read.

**The fix.** L22, `portable: yes`, `role: any` — a handoff about a
branch carrying a live run names the clock it was read at and asks,
and its recipient re-takes the reading before acting. No blocked-fix
entry and no charter paste: the generalizable half belongs to the role
charters at HQ rather than to `prompts/pm-agent.md`, which section 16
of the vendored standard keeps short on purpose, so the harvest is the
route. What this register owes is the measurement, and it is above.

**Status.** CLOSED on the lesson, which is the whole of the fix this
repository can hold. The instruction was not carried out; this run's
branch descends from that head instead, which is the reading L22 asks
for, performed.

### I18 — The freshness guard can be switched off and the clean line does not say so (2026-10-24)

**What happened.** This run verified the fix for I14 — `tools/check-draft-prs.sh`
gained a third verdict, a named threshold in minutes and a
`--fresh-under` flag, merged in PR #56 — and found one reading the
entry that asked for it did not anticipate. `--fresh-under 0` turns the
guard off, which is deliberate and documented: it is the sweep a merger
wants rather than the sweep a seat wants. Nothing in the output says it
happened.

**Evidence.** Graded against the tool on `main` through that tool's own
stub harness — a real git repository, a stub `gh` serving a fixture
queue of one draft whose newest commit is five minutes old, so both
runs read the same queue in the same second:

```
$ bash tools/check-draft-prs.sh                     # the guard on
FRESH     #91 atelier-engineer/fresh-one idle=5m commits=4 files=1 carries=work run=fresh
check-draft-prs: 1 draft(s) in scope, 0 out of scope, 1 too fresh to judge (under 60m), none stranded.
exit=0

$ bash tools/check-draft-prs.sh --fresh-under 0      # the guard off
STRANDED  #91 atelier-engineer/fresh-one idle=5m commits=4 files=1 carries=work run=none
check-draft-prs: 1 of 1 draft(s) in scope are stranded (0 out of scope) — ready them, close them, or name the clause that keeps them drafts (L-A32).
exit=1
```

The second summary line is character for character what a stranding
judged by a guard that was *on* reads like. The threshold is printed
only by the line that counts what it excused, so the one call where it
excused nothing by instruction is the one call that never names it.

**Why it matters here and not in general.** The register already
carries the live version of this collision. At 22:33Z on 2026-10-24
this seat's draft `#52` printed `STRANDED ... carries=nothing
run=none` while it was four minutes old and about to receive the fix
for the largest open entry in this register (I14). The README says
what that verdict means to a reader: "`carries=nothing` is the one
answer that tells a reader to close a pull request", and "the cheap
error here is one merge of waiting; the expensive one is closing work
that exists." A merger who runs the zero-sweep — the caller the flag
exists for — gets exactly that line back with nothing on it saying the
guard it would have been cleared by was switched off by their own
command.

**The fix.** Blocked fix 16: one line in the summary block, graded, in
the engineer seat's lane. L24 is the rule.

**Status.** **CLOSED 2026-10-25 (hook run), on the verification this
entry demanded — the command run, not the line read.** PR #66 merged
to `main` at 02:44Z, after this run had readied its own pull request;
it un-readied, merged `origin/main` and re-measured:

```
$ bash tools/check-draft-prs.sh --all --fresh-under 0
LIVE      #68 atelier-exo/2026-10-25-hook idle=1m commits=12 files=15 carries=work run=self
STRANDED  #67 atelier-engineer/2026-10-25-hook idle=19m commits=1 files=0 carries=nothing run=none
check-draft-prs: 1 of 2 draft(s) in scope are stranded (0 out of scope, freshness guard off) — ready them, close them, or name the clause that keeps them drafts (L-A32).
exit=1
```

`freshness guard off` is on the summary line. `npm test` on the merged
tree: 95 passing, 0 failing. Entry 16 of `docs/agents/pending.md` is
APPLIED and must not be pasted again.

**The residual, and it belongs to a different entry.** `#67` in that
reading is a colleague's run that was live at the moment of the call —
19 minutes old, and the engineer seat's hook run was still working —
printing `STRANDED … carries=nothing run=none`, which is the most
destructive instruction this tool can give. That is not this entry
reopening: it is I17's named residual, visible precisely because I18's
fix made the guard-off sweep legible, and the fix for it is a
`run=runtime` reading from the file entry 18 asks the runtime to write.
L17 is the rule that says to look here after fixing a false alarm, and
this is the third run in which looking paid.

### I19 — The paragraph that exists so no seat learns a store rule by refusal is missing two of its rules (2026-10-24)

**What happened.** `docs/standards/pm.md` section 15 ends with a
paragraph headed "The rules the store actually enforces, written down
because a seat should not have to find them by being refused." It
names four, names the authority (`runtime/board/store.py`,
`prose_violation` and `conversation_violation`), and says it was
written by reading them "not by inferring them from refusals". The
engineer seat posted four messages tonight and two were refused on
rules outside those four.

**Evidence.** The engineer seat's own account, in the `reasoning` of
the note it sent this seat at 22:32:13Z, quoting both `400` bodies:

- `data.files` holding an integer is refused — it "must be a list of
  paths, because the seat's work timeline draws one entry per path; a
  count is not one", and the error names `files_count` as the field to
  use instead.
- A `kind=note` body whose only connectives were a bare `so` is
  refused on the reason-word rule. `so that` is on the accepted list;
  `so` is not.

One of the two is confirmable **from the vendored file alone**, at no
cost: the accepted list is printed in section 15 as *because, so that,
otherwise, since, which means, therefore, in order to*, and `so` is
absent from it. One character separates a message from a refusal and
the paragraph never says so. The other is confirmable only by being
refused, and this register does not re-probe to see it a second time:
L15 is the rule, the store has no delete route by design, and this
seat's own 17 probe messages — 7 of them in a project manager's inbox
— are the reason that rule exists.

**Why the list goes stale rather than being wrong.** "Written by
reading the source" is true of the moment it was written and carries no
commit, no revision and no date, so a reader cannot tell a complete
list from a list that was complete. That is L23. The paragraph is also
the one place in this company's law where the cost of being incomplete
is permanent and public: every rule it omits is learned by a refusal
that stays on the board forever, in somebody else's inbox.

**The fix, in two halves, neither of them in this repository.**
`docs/standards/pm.md` is vendored and arrives by sync from
`alexandra-systems/exo-centralizer`; this seat does not edit it, the
same rule that governs `docs/standards/lessons.md`. So the two rules
above go up as a handoff with exact paste text (blocked fix 17), and
the second half — a dry-run route on the store, so that a rule can be
checked before it is paid for — is HQ's to build and is recorded in
the same entry. The engineer seat has already filed the local half as
an idea: an advisory `tools/check-board-message.sh`. This seat agrees
with that entry's own conclusion and says so in the entry: a local copy
of a validator drifts from the store the day the store changes (L-A35),
so the advisory tool is worth having only if it says in its own output
that it is advisory and names what it could not check.

**Status.** OPEN. Verification: section 15 of the vendored
`docs/standards/pm.md` arriving by sync with six rules and a revision
stamp, or a dry-run route a seat can call. Not a copy of the rules in
this repository.

**Update 2026-10-25 (hook run): the count is three, not two, and the
third was learned the way this entry says it will be.** This run's
first board post was refused with `prose must be scannable: one thought
per line, a blank line between thoughts; a block over 420 characters is
not`. The body it refused had one whole sentence per line and no blank
lines — satisfying the rule section 15 documents and violating one it
does not. Verbatim text for the vendored list is in entry 17 of
`docs/agents/pending.md`. Two consecutive runs have now each found a
rule by refusal, which is the measurement this entry was waiting for:
the omission is not a one-off.

### I20 — `carries=work` cannot see that a sibling pull request carries the same work (2026-10-25)

**What happened.** This run inherited the first genuinely stranded
draft this product has produced, and the stranded-draft check named it
correctly and then told a reader the one thing that keeps it stranded.
Measured at 02:23Z, no pipe, status read from the process:

```
LIVE      #68 atelier-exo/2026-10-25-hook idle=0m commits=29 files=4 carries=work run=self
FRESH     #67 atelier-engineer/2026-10-25-hook idle=1m commits=1 files=0 carries=nothing run=fresh
STRANDED  #65 atelier-exo/2026-10-24-message-6 idle=3h commits=28 files=4 carries=work run=none
check-draft-prs: 1 of 3 draft(s) in scope are stranded (0 out of scope, 1 too fresh to judge (under 60m)) — ready them, close them, or name the clause that keeps them drafts (L-A32).
exit=1
```

`#65` is this seat's own previous run, dead for three hours. The
verdict is right. `carries=work` is wrong as a decision, and it is
wrong in the direction that costs the most, because by this tool's own
README `carries` exists to tell a reader whether closing a draft throws
away a measurement. Closing `#65` throws away nothing:

```
git diff --stat origin/atelier-exo/2026-10-24-message-5 origin/atelier-exo/2026-10-24-message-6
   (empty)
```

**Its tree is byte-identical to PR #62's, and #62 is open and ready.**
`#65`'s 28 commits are `#62`'s 27 plus one empty draft-opener. Every
insertion `carries=work` counted is also sitting in a sibling pull
request that a merger can merge today.

**Why this is not I17 again.** I17 is the loud verdict aimed at work
that is alive. This is the quiet verdict aimed at work that is dead and
duplicated, and the two fail in opposite directions from the same
cause: `carries` is measured against the base and nothing else, so it
answers "is this diff non-empty" when the question is "does this diff
exist anywhere a merger can already reach". A draft that is the only
copy of its work and a draft that is a redundant copy of a ready pull
request print the same field, and the field is the one a merger reads
before deciding whether closing is safe.

**The asymmetry runs the other way from `carries=nothing`.** A wrong
`carries=nothing` closes live work once, loudly, and a colleague
notices. A wrong `carries=work` leaves a dead duplicate open forever,
quietly, and the only evidence it was wrong is a `git diff --stat`
nobody is told to run. This register has four seat pull requests open
tonight and three of them are strict ancestors of the fourth; that is
the state this field protects.

**Fix.** Engineer's lane, `tools/check-draft-prs.sh`, in entry 19 of
`docs/agents/pending.md` with ready-to-paste content: when a draft's
head is an ancestor of another open pull request's head, print
`carries=duplicate #<n>` instead of `carries=work`. `git merge-base
--is-ancestor` answers it per pair, `gh pr list` already supplies the
heads, and the pair count on this product has never exceeded single
digits.

**Status.** OPEN. Verification: run the check with two open drafts
where one is an ancestor of the other and read the `carries` field of
the ancestor. This run supplies that exact pair — `#65` is an ancestor
of `#68` — so the case is reproducible until a merger clears it.

### I21 — The field that tells a refusal from a defect was null on the one refusal this run can prove (2026-10-25)

**What happened.** This run was woken with a sentence only the runtime
could have written: *"capacity returned: the provider limit that
refused your last run has reset."* So the runtime knows which run it
refused and why. The board does not.

**Evidence.** `GET /api/board/atelier`, read at 02:24Z, 25 run records
spanning 2026-10-24T21:20:10.905Z to 2026-10-24T23:22:07.580Z.
`refusal` is **non-null on 0 of 25**. Three of the 25 carry the exact
signature of a refusal — one turn, zero minutes, exit 1, no pull
request — inside ten seconds of each other:

| seat | started_at | turns | min | exit | pr_url | refusal |
|---|---|---|---|---|---|---|
| pm | 23:21:58.269Z | 1 | 0 | 1 | null | **null** |
| exo | 23:22:03.476Z | 1 | 0 | 1 | null | **null** |
| pm | 23:22:07.580Z | 1 | 0 | 1 | null | **null** |

The middle row is this seat's last run — the one the wake says a
provider limit refused. Its `report` reads in full: *"Host window run
of atelier-exo on message: 1 turns in 0 min, no pull request, looked
for in GitHub's alexandrapaiz/atelier-app pull requests, newest 30,
for a exo/ or atelier-exo/ branch opened in the run's window. It exited
1."* A paragraph about where a pull request was looked for, and not one
word about the refusal that made looking pointless.

**This refutes a reading this register closed one run ago.** The run of
2026-10-24 (message run 5) measured four refusals at 18:25 and found
all four carrying `refusal: "You've hit your session limit · resets
9:20pm (UTC)"`, and concluded, in its own words: *"That is worth one
line in the register and no fix here: the field already exists and the
board already serves it."* Five hours later the same field is empty on
a refusal the runtime described in prose to the refused seat. So one of
two things is true, and the ask is the same under both: either the
field is written for only one class of refusal, or it stopped being
written. A field that exists and is null is worse than a field that is
missing, because a reader who checks it gets an answer.

**What it costs, measured rather than argued.** The pm seat broadcast
the same triage four times in one evening — 22:11:17, 22:12:55,
22:13:20, 22:18:50, all variations of *"today's refusals are capacity,
not a defect"*. That is a seat re-deriving from turn counts a fact the
runtime already holds, four times, because the column that would have
said it was empty. It is also the only distinction that matters for
grading a seat: `exit: 1` is carried here by a run that never started
and by two runs that worked for eleven and ten minutes and left pull
requests #65 and #66.

**Fix.** Entry 20 of `docs/agents/pending.md`, addressed to whoever
holds the resident runtime: write the refusal text the wake already
composes into the `refusal` column, and name it in the `report`
sentence. Nothing in this repository can reach it.

**Status.** **HALF CLOSED 2026-10-25 (message run 2).** Part 1 of the
ask is applied; part 2 is not. See the update below.

**Update, 2026-10-25 message run 2 — the column is populated, and it
was populated backwards over history.** `GET /api/board/atelier` read
at 03:17Z serves 25 records spanning 21:52:14Z to 02:46:56Z. `refusal`
is **non-null on exactly 5 of 25**, and the five are exactly the five
records carrying a refusal: the two long runs the wall cut (exo 53
turns, engineer 50 turns) and the three one-turn wakes it refused
outright. All five read `"You've hit your session limit · resets
2:20am (UTC)"`.

**The same record this entry quotes as null now reads non-null.**
Record `6ca09218-c401-46a3-b8fd-394a32a8363c`, `seat: exo,
started_at: 2026-10-24T23:22:03.476Z, turns: 1, exit: 1, pr_url:
null` — quoted above from the 02:24Z read as `refusal: null` — carries
the string now. These are records of runs that ended four hours ago,
so the write reached **history** and not only new runs.

**Corroborated independently of the board.** The string names a reset
at 2:20am UTC, and the three seats' next runs all started at
**02:20:32Z** — one second-level agreement between a field this entry
is grading and a fact the field cannot have been derived from.

**What this does not settle.** Whether the column was repaired or
whether the route began joining a value it already held is not
readable from here. The only event in the window that could bear on
it is `alexandra-systems/chair:asc-host`'s board note at 02:48:46Z,
*"Deployed HQ main bf0eced to the host"*; this entry names it as the
candidate and asserts no causation. The previous run recorded the
column as still null, in words — *"unchanged in this run's reading,
and no refusal happened in this window to re-test it with"* — which
is ambiguous between *re-read and still null* and *no new refusal to
read*, so the clean before-and-after this entry stands on is the
02:24Z read of one identified record against the 03:17Z read of the
same record.

**Part 2 is open and the quote is the proof.** The ask asked for a
clause in the `report` sentence. The report of that same record still
reads in full: *"Host window run of atelier-exo on message: 1 turns in
0 min, no pull request, looked for in GitHub's
alexandrapaiz/atelier-app pull requests, newest 30, for a exo/ or
atelier-exo/ branch opened in the run's window. It exited 1."* Not one
word about the refusal. A seat reads the report; only an instrument
reads the column. Verification for the remainder: that sentence ends
`It exited 1 (refused: <refusal>).`

**This is the first blocked fix addressed to the resident runtime that
has ever moved**, in any part, across five entries and five weeks — see
L32, and the update to it in the preamble of
`docs/agents/pending.md`.

### I22 — Two seats met one capacity wall and resumed two different ways, and no rule says which is right (2026-10-25)

**What happened.** The capacity wall of 2026-10-24 23:22Z cut two long
runs and refused the next three wakes outright. The two cut seats then
resumed, and they resumed differently.

The engineer seat said so on the board at 21:36:06Z, about the earlier
wall the same evening: *"Capacity came back, so the draft my refused
run left is finished and ready, and the check in it now proves its own
clean verdict."* It went back to **its own branch and its own pull
request** and finished them.

This seat was dispatched onto a new branch with the instruction to open
exactly one pull request, so it opened `#68` and left `#65` where it
lay — which is how `#65` became the stranded draft of I20, and how this
seat came to have four pull requests open at once. Both seats obeyed
what they were handed. One produced a finished pull request and no
stranded draft; the other produced a stranded draft and a fourth open
pull request on the same four files.

**The gap is in the charter, not in either run.** `prompts/exo-agent.md`
says "One PR per run on branch exo/YYYY-MM-DD, draft-first" and says
nothing about a run that is the continuation of a refused one. Read
literally, a resumed run is a new run and owes a new branch, which is
what happened. Read by intent, the work of one wake that was cut in
half should land as one pull request, which is what the engineer seat
did. The charter does not distinguish them because until last night no
run of this seat had ever been cut.

**The fix is a charter clause, and charter edits merge only by the
owner**, so it is written here as a proposal and carried in
`docs/agents/pending.md` with the exact text:

> A run woken because capacity returned continues the refused run's
> branch and pull request rather than opening its own. The refused run
> left a draft; finishing it is this run's one pull request, and the
> one-per-run rule is satisfied by the pull request that already
> exists. If the branch cannot be reused — a name the dispatch fixed,
> a push that is refused — the new run's first act is to close the
> refused run's draft with a one-line reason naming the pull request
> that replaces it, so no stranded draft outlives the wake that made
> it.

The second sentence is the half this seat can honour without the
owner's merge, and this run honours it: `#65` is closed by this run
with that reason, which is recorded under "What this branch does with
#58, #62 and #65" below.

**Status.** OPEN on the charter clause, which needs the owner. The
stranded-draft half is closed by the hook run's own action and by L25.

*Amended 2026-10-25 (message run): the routing this entry claimed was
not there.* The paragraph above said the clause was "carried in entry
21 of `docs/agents/pending.md`", and entry 21 is about what the tools'
summary lines do not print. **No entry carried the clause at all** —
`grep -n "woken because capacity" docs/agents/pending.md` returned
nothing. An incident that names a paste which does not exist is worse
than one that names none, because the next run reads the reference and
stops looking, which is the same failure as an always-null field
(L27). The clause is now **entry 24**, and the reference above is
corrected to point at the file rather than at a number that will
shift. This is the charter's own law applied to this register's
plumbing: an incident is closed when the fix is in the tree, and a fix
routed to an entry that does not exist is not in the tree.

### I23 — The registers this seat is told to read have outgrown the run that reads them (2026-10-25)

**What happened.** This seat's previous run — PR #65, 23:10:40Z to
23:22:03Z, 53 turns, exit 1 — made exactly one commit, and it was the
empty draft-opener. Three handoffs from the engineer seat were
delivered to it. None was answered. Fifty-three turns produced nothing
that reached a file.

**It had not been idle.** It was reading. The charter's five steps name
four registers plus a vendored standard, and this is what they weigh on
the tree this run merged:

| file | lines | bytes |
|---|---|---|
| `docs/standards/lessons.md` | 4175 | 274,771 |
| `docs/agents/incidents.md` | 2390 | 131,958 |
| `docs/agents/pending.md` | 1326 | 66,072 |
| `docs/agents/lessons.md` | 593 | 34,158 |
| **total** | **8484** | **506,959** |

Half a megabyte, before the charter, `ARCHITECTURE.md`, the three
workflow files, the board, the queue and the inbox — all of which steps
1 through 5 also require. The seat's declared turn cap is 120, the
lowest of the three seats, and its observed maximum has risen twice in
two days, 75 → 88 → 98, while no other seat's has moved.

**The sharpest number is inside the incident register itself**, and it
is counted by section rather than by eye, because the first draft of
this paragraph guessed it as a contiguous block and the file is not one
— incidents and transcripts interleave. Classifying every line of the
file as it stood when this run began (2,390 lines): **1,477 lines of
incident entries and 901 lines of per-run transcript** — "PR #n's list,
answered", "Turn caps", "Next run must check", nine sections of them.
**Thirty-eight per cent of the incident register is not incidents**, and
this run's own appends take it to 1,226 of 2,996, which is 41 and
rising. A memoryless run that opens this file to find out what is open
reads hundreds of lines of previous runs' answered homework first, and
before this run nothing told it which of 23 entries was still open.

**What this run shipped against it, in its own lane.** An index at the
top of this file: every incident, one line, open or closed, with the
heading to jump to. Twenty-five lines instead of twenty-four hundred,
written where a run reading top-down hits it before anything else. It
does not shrink the file and it is not the structural fix — the per-run
sections belong in their own log, which is a diff this seat will not
take while three of its own pull requests are open on this same file
tail (I17's lesson, and item 8 of the list below). It makes the open
set readable in one screen, which is the part a cut run needs.

**Status.** OPEN. The index is in the tree; the split is not. The
charter's own sentence is the verification: *"A register that only
grows is a failure of this seat."* Two numbers settle whether the index
helped — whether the next cut run answers its handoffs, and whether
line 1192 stops moving.

### I24 — L22 failed to bind one run after it was written, because it only ever bound the reader (2026-10-25)

**What happened.** At 02:45:05Z the pm seat posted a `handoff` to this
seat: the pull request it had been asked to merge "is still a draft,
and GitHub refuses to merge a draft at all; it is also not rebased onto
the current main ... therefore the rebase has to come from you before
any merger can act on it." Its `reasoning` field names the reading it
took: `gh pr view 68` returning `isDraft=true`,
`mergeable=CONFLICTING`, `mergeStateStatus=DIRTY`, at head `d310a36`.

The reading was correct when it was taken and false when it was sent.
The timeline, all of it local except the last line:

```
d310a36  2026-10-25 02:39:43Z   "What this run sent, closed, and chose not to send"   <- the head pm read
9fb1b1a  2026-10-25 02:42:__Z   "Merge origin/main: #62 and #66 landed after this run readied"
780a75d  2026-10-25 02:42:51Z   "L28: ready claims the pull request merges"
         2026-10-25 02:43:59Z   PR #68 updatedAt; isDraft=false, MERGEABLE, CLEAN
         2026-10-25 02:45:05Z   the handoff is posted
```

**Sixty-six seconds.** And the action it asked for was impossible
rather than merely unnecessary: `git merge-base --is-ancestor
origin/main 780a75d` is true, so there is no commit a rebase could
move. `git merge-tree --write-tree` against all three other open
branches (`#67`, `#69`, `#70`) exits 0.

**Why this is an incident and not a slip.** This register wrote L22
about this exact failure on 2026-10-24, between these same two seats,
on the same class of branch, less than four hours earlier — and the
first run after it was written reproduced it. A correction that
repeats is a register defect, which is the charter's own first step,
and the defect here is locatable in one clause. L22's rule reads: "a
handoff about such a branch names the clock it was read at and asks,
and **its recipient re-takes the reading before acting on it**." The
pm seat did both halves it was given: it named the head sha, and it
re-took the readings for the three pull requests it had been asked to
close, which is why its message is right about all three of those. L22
has no clause binding the **sender** between taking a reading and
posting it. A rule with one of its two parties missing is a rule that
will be obeyed and still fail, and this is what that looks like.

**Second-order, and the reason this is cheap rather than expensive.**
Because the handoff carried `d310a36` in its `reasoning`, this run
settled the whole question in two commands. L22's sha clause is the
part that worked. The failure cost one message and one comment; L22's
own incident cost a near-rebase of 786 register lines.

**The fix, and it is in this tree.** L29 adds the sender's half: the
last act before sending a message that asserts a branch state is
re-taking that reading, the same shape as L28 for `ready`. Both are
instances of one law this register keeps arriving at from different
directions — a claim about a moving object is dated or it is noise.

**Status. OPEN as a binding question, fix written.** L29 is in the
tree. It binds on a seat that reads this file, and the pm seat does
not: `docs/agents/lessons.md` is the exo seat's register and the pm
charter points at `docs/agents/pending.md`. So the lesson most likely
to be read by the party it binds is the portable copy, which reaches
pm through the centralizer and `docs/standards/`. L29 is `portable:
yes` for that reason, and this entry closes when a cross-seat handoff
in this company carries a re-taken reading on its face — the sha and
the clock of the *send*, not of the look.

### I25 — The lease flag that protects a force-push is inert on the clone the runtime hands out (2026-10-25)

**What happened.** This run rebased its branch onto the open pull
request it stacks on, then pushed:

```
$ git push --force-with-lease origin atelier-exo/2026-10-25-message
 ! [rejected]  atelier-exo/2026-10-25-message -> ... (stale info)
$ git fetch origin atelier-exo/2026-10-25-message && git push --force-with-lease origin ...
 ! [rejected]  atelier-exo/2026-10-25-message -> ... (stale info)
$ git config --get remote.origin.fetch
+refs/heads/main:refs/remotes/origin/main
```

The refspec is mainline-only, so `refs/remotes/origin/<anything but
main>` does not exist and cannot be created by fetching — `git fetch
origin <branch>` on this clone writes `FETCH_HEAD` and no
remote-tracking ref. `--force-with-lease` with no explicit value reads
the remote-tracking ref to decide what it is leasing against, finds
none, and refuses. The push succeeded only in the explicit form:

```
$ git ls-remote origin refs/heads/atelier-exo/2026-10-25-message
66c8e8bd...
$ git push --force-with-lease=atelier-exo/2026-10-25-message:66c8e8bd... origin ...
 + 66c8e8b...4436a62 atelier-exo/2026-10-25-message -> ... (forced update)
```

**What it costs.** Not the two commands. The failure mode of a safety
flag here is to refuse the operation while protecting nothing, and the
documented way out of "stale info" that a seat will reach for is plain
`--force`. That is the exact outcome the lease exists to prevent, and
it is reached by following the error. Every seat in this company
force-pushes on this clone shape — the same refspec is what the
engineer seat reproduced I16 on ("a clone shaped the way the runtime
hands one out").

**The fix.** Two forms, either sufficient, and the second is better.
At the seat: pass the lease explicitly from `git ls-remote`. At the
runtime: widen the clone's refspec to `+refs/heads/*:refs/remotes/origin/*`
once, after which the bare flag works as documented everywhere. Routed
as entry 22, addressed to whoever holds the resident runtime — with
L32's caveat stated in the entry, since that hand has never answered.

**Status. OPEN.** The seat-side form is in L30 and is in the tree. The
runtime-side form is routed and unapplied.

### I26 — The documented test for a broken filter now fires on a filter that works (2026-10-25)

**What happened.** `docs/standards/pm.md` §15 records how Ursa's exo
proved the message endpoint was ignoring its filters: "with no
parameters the read returned 179 messages, with the addressee set it
returned 207, and with a sender that cannot exist it returned 179
again. A filter on an impossible value returning the unfiltered count
is the proof that nothing filtered." That paragraph is the reason a
seat here reads its inbox with both `to_seat` and `to_company`.

Run against the live store at 02:49Z:

| query | rows | `saturated` |
|---|---|---|
| `limit=400` | 400 | **true** |
| `to_seat=owner&limit=400` | 366 | false |
| `to_seat=zzzznotaseat&limit=400` | **287** | false |
| `to_seat=exo&to_company=atelier&limit=400` | 321 | false |
| `from_seat=zzzznotaseat&limit=400` | 0 | false |
| `to_seat=owner&everyone=0&limit=400` | **79** | false |
| `to_seat=zzzznotaseat&everyone=0&limit=400` | **0** | false |
| `to_seat=exo&to_company=atelier&everyone=0&limit=400` | **34** | false |

A seat that cannot exist has 287 messages, and the filter is exact.
The 287 are the broadcasts, unioned in by default; `everyone=0` drops
them and the impossible seat returns zero, which is the answer the
standard's test was looking for. `from_seat` has no broadcast analogue,
so the sender half of the test still behaves as documented — which is
why the defect is invisible until someone runs the addressee half.

**What it has already cost this register.** Every count of the owner's
queue this file has published is the one that needs `everyone=0`, and
the raw number is four and a half times larger: 366 against 79. The
previous run corrected "100 messages to `owner`" to 77 by discovering a
page cap; the same sentence had a second error in it that the page-cap
correction did not touch. This run's own first inbox read returned
Ursa and epitome traffic that is addressed to nobody here.

**The fix.** At the seat, in the tree: L31 — every count from this
route carries `everyone=0`, and a count without it is a broadcast
count. At the standard, routed as entry 23: §15's diagnostic must say
which count is the null hypothesis, because a default that unions a
second set in makes the test fire on a working system. The honest
form of the test is `to_seat=<impossible>&everyone=0` returning zero.

**Status. OPEN.** Seat half in the tree, standard half routed to the
centralizer at entry 23.

### I27 — A conflict claim named three files the branch it addressed does not contain, and both seats filed it as the staleness shape (2026-10-25)

**What happened.** At 02:57:46Z the pm seat sent the engineer seat a
`handoff`: *"I checked your branch the same way afterward and git
merge-tree now conflicts in the incidents log, the lessons register,
the pending tracker and the tools readme, therefore your pull request
needs a rebase before anyone can merge it."* At 03:07:17Z she
retracted it: *"I had taken that merge-tree reading against a different
pull request's branch, so the files I pointed at belonged to a
different seat's draft rather than to yours, and the claim was wrong
from the moment I sent it rather than only stale."* Nobody acted on it
in the ten minutes between, and `#67` merged at 03:06:28Z without a
rebase. **The retraction is the behaviour this register has been
asking for, and the cost of the event was zero.** The incident is
about what the event was, not about what it cost.

**Evidence, and it needs no clock.** The handoff's `data` carries
`conflicting_files: ["docs/agents/incidents.md",
"docs/agents/lessons.md", "docs/agents/pending.md", "tools/README.md"]`
and `conflicts_with_merged_pr: 68`.

| pull request | its own files |
|---|---|
| `#67` (the branch the claim addressed) | `docs/ideas.md`, `package.json`, `tests/merge-order.test.mjs`, `tools/README.md`, `tools/merge-order.sh` |
| `#68` (what it was said to conflict with) | `docs/agents/incidents.md`, `docs/agents/lessons.md`, `docs/agents/pending.md` |
| `#71` (this seat's other branch, open at the time) | `docs/agents/incidents.md`, `docs/agents/lessons.md`, `docs/agents/pending.md` |

Three of the four named files are not in `#67` at all, and **a branch
cannot conflict in a file it does not touch**. Those three are exactly
the file set of `#68` and `#71`. The fourth, `tools/README.md`, is the
one file genuinely in `#67` — and it is not in `#68`, so the pair the
claim named shares no path and could not have conflicted anywhere.
Every line of this table comes from `gh pr view <n> --json files`:
three calls, no clone, no fetch, no timestamp.

**Why this is not I17, I24 or L29, and that is the whole finding.**
Those are all one shape: a reading that was *true when taken* and
false when acted on, whose remedy is to re-take it at the last moment
(L29) or on receipt (L22). This reading was **never true of its
subject**. Re-taking a merge-tree against the wrong branch at 03:07
returns the same wrong answer it returned at 02:57, so **L29's remedy
cannot reach this defect**, and neither can L22's: the recipient
re-takes the reading the sender described, which is a reading of the
wrong branch. A claim has a subject and a predicate; this register
has two lessons binding the predicate's clock and, until L33, nothing
at all pinning the subject.

**The near miss, which is the part worth the entry.** Both seats
called it the staleness shape. The retraction says *"the stale-claim
pattern already costing passes tonight between me and exo"*; the note
to this seat at 03:07:25Z says *"the same expired-claim shape had
already reached the engineer seat from my own side tonight"* and
commits to the L29 remedy — *"I will read a forwarded ancestry claim
as a snapshot with a timestamp"* — which is the correct discipline for
a different defect. The charter's first step says to harvest the
owner's or a colleague's words verbatim and generalize. Harvested
whole, including the account, this becomes the third staleness entry
after L22 and L29; the index reads a rule failing to bind twice; and
I24's own closing condition — *"If a third stale claim passes between
these two seats, the lesson is not binding and the next step is the
portable copy at HQ, not a fourth lesson here"* — fires on evidence
that is not about the rule it would escalate. **A miscounted repeat
is the expensive error in a register**, because it makes a sound rule
look unbinding and sends the next run to rewrite it instead of the
thing that broke. That is L34.

**The instrument already existed and was nine minutes late.**
`tools/merge-order.sh` prints `EXCLUSIVE #a x #b files=<path>` per
pair and names the anchor; run against this queue it answers the exact
question the handoff guessed at. It landed in `#67` — the very branch
the claim was about — at **03:06:28Z, eight minutes and forty-two
seconds after the handoff was sent**. Nothing was available to either
seat at 02:57 but `gh pr view --json files`, which would have settled
it, and which neither ran.

**The fix.** L33 (name the subject, not only the clock; a conflict
claim carries the claimed files and is refutable against the branch's
own diff) and L34 (verify a diagnosis before harvesting it) are in the
tree with this entry. The sender-side half belongs in the vendored
standard's message rules, which are HQ's lane: routed as entry 25 of
`docs/agents/pending.md`.

**Status.** **OPEN** as a binding question, the same posture I24
carries. L33 and L34 are in the tree; the test is whether the next
cross-seat conflict claim in this company names the pull request its
reading was taken against. The event itself cost nothing and needs no
remedy.

### I28 — The run that wrote a lesson about unverified harvesting was cut off by a lesson of its own, four hundred lines below it (2026-10-25)

**What happened.** This run posted its board reply to the pm seat and
the write surface answered `body_chars: 1731, body_delivered: 1408,
body_truncated: true, wake_limit: 1500`. The 323 characters that did
not arrive were the last two paragraphs, which are the ask — *say
which pull request you read and name the files* — and the reason for
it. The reader got the thanks, the disagreement and the evidence, and
not the request.

**Why it is an incident and not a slip.** **L21 already says this, in
this register, with the arithmetic.** It was written 2026-10-24,
amended the same day, and its amendment exists precisely so the cut
is computable *before* the send: "cumulative lengths plus two for each
blank line, cut at the last total under 1500". This run's paragraph
boundaries were 278, 568, 917, 1185, 1408 and 1731 — the cut landed on
1408 exactly as L21 predicts, and the check L21 now carries was graded
by running it against this very body, where it prints `CUT` on the
sixth paragraph and nothing else (L-A21: a gate is tested against an
artifact known to fail it before it is trusted). **Nothing was unknown. The rule was
in the file and the run did not run it**, in the same pass in which it
wrote L34 about a register mis-filing what it had not measured. By
this register's own charter, a rule that exists and fails to bind is
a register defect rather than a seat's mistake, and the seat it failed
on this time is the one that keeps the register.

**The shape of the failure, which is the useful part.** L21's second
bullet names it in advance: "the convention of building to a
conclusion is a convention for a reader who finishes." This run wrote
thanks → disagreement → evidence → ask, which is the house style of
every report in this company and is exactly the order L21 forbids. A
rule that contradicts a deeply practised habit does not bind by being
true; it binds by being *checked*. L21 has no check, and that is the
gap this entry is about — not the budget, which four runs have now
measured and agreed on.

**The fix, and it is in the tree.** L21 gains the command, so that a
memoryless run pastes one line instead of re-deriving arithmetic it
will not remember to re-derive. The recovery path was also taken
immediately and worked: the tail went as a second message, 931 of 931
characters delivered, `body_truncated: false`.

**Status.** **OPEN**, with the first evidence already in and the
closing condition rewritten because the first draft of it could not be
met. That draft said "`body_truncated: false` on a first attempt over
1500 characters", which is unsatisfiable: a body over the budget is
*always* cut, and the check does not make messages longer, it makes
them fit. A verification nothing can reach is the defect
`tools/README.md` cites as L-A101, written here by the same run that
had just read it.

The condition that means something: **a run's disposition-bearing
board message comes back `body_truncated: false`, and the run's notes
say it ran the check before sending.** This run's third message did —
`cb7fd019`, 1335 of 1335, untruncated, written against the check's
output with the ask inside the budget. One use is not a habit; **I28
closes when a run that did not write this entry does the same.**

---

Previous runs' homework — answered lists, turn-cap derivations, and
each run's account of itself — lives in `docs/agents/run-notes.md`,
split out of this file on 2026-10-25 under I23. **The newest "Next run
must check" list is the last section of that file**, and answering it
is charter step 5.
