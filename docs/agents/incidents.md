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

**Status.** OPEN, routed to the engineer seat. Verification: a seat run
on the resident runtime whose own draft prints `LIVE` and whose check
exits 0 when nothing else is stranded.

## The 2026-09-19 list, answered by the run of 2026-10-24 (PR #40)

Kept as written. The list was made on 2026-09-19 by this seat's first
run, and no run answered it for five weeks. Each item, with what was
true when PR #40 read it.

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

## PR #40's list, answered (charter step 5)

PR #40 was opened earlier the same day by the previous run of this
seat. Its seven items, each with the evidence read this run.

1. **Did PR #40 merge?** No. It is open, `MERGEABLE`, not a draft. The
   pm seat's sweep declined it in PR #43 along with #11 and #19,
   correctly and for a stated reason. So the stranded-draft step is
   still not in effect and I4 part 2 has not started. **But the item
   was the wrong question**, because it assumed the pull request was
   one indivisible thing. Four of its five commits never needed the
   merger it was waiting for. That is I8, and it is fixed.
2. **Does the step actually report?** Still never executed.
   `gh run list --limit 300` returns five runs of
   `agent-{pm,exo,engineer}` in this repository's entire history, the
   most recent `36023458176` on 2026-09-24. Thirty days, unchanged
   from PR #40's measurement. I10 now records one documented reason
   why, which is not that nobody tried to wake them.
3. **PRs #11 and #19.** Both still open, both still ready, `#11` since
   2026-09-30 and `#19` since 2026-10-14. As instructed, this run did
   not re-measure the merge order and says the thing the item told it
   to say: this is a nobody-merges-this problem and not a merge-order
   problem. One fact was added rather than re-derived — neither of them
   adds `repository_dispatch` (I10), checked with `git diff`, so
   merging both still leaves every seat here unwakeable by the board.
4. **I5's verification, actually performed this time.** `vars` and
   `secrets` are both `403 Resource not accessible by personal access
   token` under this run's credentials, which is the correct answer for
   a seat and not a finding. The log half was performed: the most
   recent pm run is still `36023458176`, the same run PR #40 already
   read, so there is **no new evidence** and I5 stays OPEN unchanged on
   that axis. What did change came from a different surface — the
   owner's commit `257e92e` — and it is appended to I5 as an
   amendment: the fallback is her deliberate design, and the open
   defect is that the attempt has no cost ceiling. I5 was not closed on
   a future verification, which is the trap it names.
5. **I4, I6 and I7 as one question at HQ.** No board tool was available
   to this run, so the thread could not be read and nothing was
   re-derived from scratch. I7 was answered from inside the repository
   instead, and half of it was wrong (I9). I4 and I6 stand as written.
6. **PR #37 and any sibling re-vendor PR.** Both merged —
   `#37` at 2026-10-24T18:22:04Z and `#38` the same hour. `gh pr list
   --state open` shows **no** `distribution/*` or vendored-standard
   pull request open as of this run. The merge-or-close rule has
   nothing outstanding in this seat's lane. The one residue is in I11:
   the manifest's `standards: pm:` pointer still names `f2f0561` while
   the file #38 landed says `fb114f4`.
7. **Did an owner correction arrive in an identifiable form?** Yes,
   three, and the previous run could have found them. `8ca0f7a`
   (2026-09-20), `257e92e` (2026-09-23) and `a1418c3` (2026-09-27),
   all non-merge commits authored `alexandrapaizdelgado@gmail.com`.
   `257e92e` overrides a seat's own open-routing work and is captured
   as **L11 with her words verbatim** — the first lesson since L1 to
   carry "Owner said" rather than "Evidence". I7 is narrowed to
   comments accordingly.

**What the shape of this answer says.** PR #40's list was written four
hours before this run read it, and it still caught two things: the
unperformed I5 verification got performed, and item 7 turned up three
owner commits by sending a run to look for them. It also shows the
cost of a question phrased around an artifact rather than a defect —
item 1 asked whether a pull request merged, and the answer that
mattered was that it should never have been one pull request.

## Turn caps, re-derived by PR #40 (charter step 4), 2026-10-24

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

## Turn caps (charter step 4), 2026-10-24 hook run

Not re-derived, on instruction. PR #40's table below is the complete
set of seat Actions runs in this repository's history, and
`gh run list --limit 300` returns the same five runs today with the
same conclusions. There is no new `num_turns` and no new `modelUsage`
to read, so there is no new arithmetic and no cap changes. The caps
remain 200 (engineer), 120 (exo) and 120 (pm), still resting on no
representative evidence, and still governing nothing that runs — the
caps that bind the runs actually happening belong to the resident
runtime (I4).

**No run whose artifacts contradict its conclusion was found beyond the
one already recorded** (`36023458176`, in I5 and L5).

## Next run must check

1. **Did PR #45 merge, and did PR #40 merge?** They are now one pull
   request each for one merge tier (I8). #45 is docs-only and the pm
   seat merges that tier routinely; #40 is `.github/`-only and needs a
   chair or the owner. **If #45 merged and #40 did not, that is the
   split working**, not a new problem. If #45 is still open, ask on the
   board why a Tier A docs pull request from this seat did not move,
   because the tier excuse is gone and the answer will be a different
   defect.
2. **If PR #40 merged, the step's first real output.** Read the step
   *summary*, never its conclusion — it exits 0 by design (L6). The
   tool is on `main` now (PR #39 merged), so expect a real verdict
   rather than `NOT CHECKED (tool absent)`. And it only runs on a
   dispatch, which I10 says cannot currently be triggered by the board.
3. **Run the check and read what it says about your own draft (I12).**
   `bash tools/check-draft-prs.sh --seat exo`. If it prints `STRANDED`
   with `run=none` for the branch you are standing on, entry 9 has not
   been applied and **exit 1 means nothing this run** — say so instead
   of reporting a stranded-draft count. If it prints `LIVE` for your
   own branch, the fix landed and exit 1 is information again. Note
   that `$?` after a pipe is the pipe's status, not the check's; this
   run read `exit=0` once that way before measuring it properly.
4. **I10: did `repository_dispatch` land?** Check
   `grep -l repository_dispatch .github/workflows/agent-*.yml`. If it
   has, verify with `gh run list --json event` that a board message
   produced a run whose event is `repository_dispatch` — the trigger
   being present in the file is the config claim, not the evidence
   (L5). HQ owns this; do not open a fourth Tier B pull request here.
5. **I11: does `main`'s `company.yaml` pass its own validator?** The
   closing condition is zero findings from `tools/check-manifest.sh`
   plus a declared `pending:` and `sprints:`, not the file existing.
   Also check `standards: pm:` against the vendored header of
   `docs/standards/pm.md`; they disagreed this run.
6. **Harvest with the command, not by reading threads** (L9):
   `git log --all --no-merges
   --author=alexandrapaizdelgado@gmail.com --since=<last exo run>`.
   This run found three owner commits that two previous runs missed.
   Anything new there is a lesson with "Owner said" and her words
   verbatim. Her pull request comments remain indistinguishable from a
   seat's (I7), so do not substitute one.
7. **I5's cost ceiling.** If PR #11 merged, `OPEN_ROUTING` can be set
   (entry 4 under "Blocked fixes (exo)"). Setting it `off` stops the
   bleeding; it does not add the ceiling L11 asks for, and the ceiling
   is still unbuilt by anyone. Say which of the two happened.
8. **Does this register have an entry that was closed and recurred?**
   I3 recurred as I6; I2 recurred as I5; I7 was amended by I9 within
   hours; and I4 has now recurred twice in different clothes, as I10
   (a surface that cannot be woken) and I12 (a guard whose correctness
   condition does not hold there). Five of twelve entries are repeats
   or restatements, which is high enough that the pattern is the thing
   to watch rather than each instance. The common root in four of the
   five is that this repository's fixes and this company's runs live on
   different surfaces. If a sixth recurs, the finding to file is about
   that split, not about the defect that repeated.
