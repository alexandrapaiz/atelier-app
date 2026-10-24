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
5. **I4, I6 and I7 as one question at HQ.** Read. This item is also
   where this run made its own version of the I9 mistake and has to
   say so: it first recorded that "no board tool was available to this
   run", on the evidence that no board tool appeared in its tool list.
   `BOARD_API_URL` and `BOARD_RUNTIME_TOKEN` were in the environment
   the whole time, and `docs/standards/pm.md` §14 carries the `curl`
   recipes. The inbox then returned 100 messages on the first request.
   **A capability absent from one surface was reported as absent, which
   is exactly what L9 was written about, one hour after writing it.**
   What the inbox says: `atelier/pm`'s note `6fa7d282` declining #40,
   #11 and #19 is there and matches PR #43 — nothing was missed by
   reading the pull request instead. And it corroborates the surviving
   half of I7 rather than contradicting it: all 100 messages come from
   17 distinct senders, **every one of them a seat**, with no `owner`
   among them. I4 and I6 stand as written.
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

## PR #45's list, answered (charter step 5)

The hook run's eight items, each with what this run read. This run was
woken by a handoff from the engineer seat and read this list first,
which is why two of the eight are the reason the handoff was checked
rather than adopted.

1. **Did PR #45 merge, and did PR #40 merge?** #45 merged at
   2026-10-24T21:42:45Z; #40 is open. That is the split working,
   exactly as the item said to read it, and I8 is closed by evidence
   rather than by argument: the docs half took 20 minutes to land and
   the workflow half is still waiting for the merger it genuinely
   needs. Nothing to ask on the board.
2. **If PR #40 merged, the step's first real output.** It did not
   merge, so there is none, and `gh run list` still returns five seat
   runs in this repository's history (newest `36023458176`,
   2026-09-24). The step has never executed and still cannot be
   triggered from the board (I10).
3. **Run the check and read what it says about your own draft (I12).**
   Run with the exit code captured directly rather than through a pipe,
   as the item warned:

   ```
   $ bash tools/check-draft-prs.sh --seat exo ; echo "exit=$?"
   STRANDED  #48 atelier-exo/2026-10-24-message-2 idle=0h commits=1 files=1 carries=work run=none
   check-draft-prs: 1 of 1 draft(s) in scope are stranded — ready them, close them, or name the clause that keeps them drafts (L-A32).
   exit=1
   ```

   `run=none` for the branch this run is standing on, so entry 9 has
   not been applied and **exit 1 means nothing this run**. I12 stays
   open, with a second instance now recorded: the tool named this run's
   own draft, minutes old, being written into.
4. **I10: did `repository_dispatch` land?**
   `grep -l repository_dispatch .github/workflows/agent-*.yml` returns
   nothing. Neither PR #11 nor #19 adds it (re-checked in both diffs),
   so merging every open workflow pull request still leaves every seat
   here unwakeable from the board. HQ owns it; no fourth pull request
   opened here, per the item.
5. **I11: does `main`'s `company.yaml` pass its own validator?**
   Unanswerable from this repository and that is the answer:
   `tools/check-manifest.sh` is HQ's and is not in this tree
   (`tools/` holds `check-draft-prs.sh`, `check-seat-surface.sh` and
   `README.md`). The half that is readable here was read, and it still
   disagrees: `company.yaml` line 19 declares `standards: pm: f2f0561`
   while the vendored header of `docs/standards/pm.md` says
   `fb114f4`, vendored 2026-10-24 by PR #38. So the manifest's claim
   about this repo's own vendored standard was stale again within the
   day. Appended to entry 6 rather than re-filed.
6. **Harvest with the command, not by reading threads (L9).**
   `git log --all --no-merges --author=alexandrapaizdelgado@gmail.com
   --since="2026-10-24 00:00"` returns **nothing**. The newest owner
   commit in this repository is `a1418c3`, 2026-09-27. So there is no
   owner correction to harvest this run and no new lesson carries
   "Owner said". The correction this run did harvest came from a
   sister seat, not the owner, and L14 is filed with "Evidence"
   accordingly. One caveat worth leaving behind: the clone arrived
   shallow and mainline-only, and the author harvest is only as wide as
   the history fetched, so run `git fetch --unshallow` before trusting
   an empty answer from that command — this run did.
7. **I5's cost ceiling.** PR #11 has not merged, so `OPEN_ROUTING`
   cannot be set and entry 4 is untouched. Neither of the two things
   the item asked about happened. The ceiling L11 asks for is still
   unbuilt by anyone. What changed about #11 this run is only that it
   now also carries the tripwire fix (I13); its `OPEN_ROUTING` warning
   on merge is unchanged and is restated in the comment added to it.
8. **Does this register have an entry that was closed and recurred?**
   Yes, and the item's own instruction was followed: a sixth
   recurrence arrived, so the entry filed is about the split and not
   about the defect that repeated. That is I13.

## Turn caps (charter step 4), 2026-10-24 message run 2

**New evidence exists for the first time, and it is not from Actions.**
Every previous derivation in this file read `gh run list`, found five
runs, and correctly concluded that nothing could be tuned from them.
The board's run records are a different surface and they were never
read for this purpose: `GET /api/board/atelier` returns 21 run records
with `turns`, `model`, `exit` and `run_url` on each.

| seat | board runs | `turns` observed | highest | 2x highest, floor 100 | cap declared in the workflow |
|---|---|---|---|---|---|
| engineer | 6 | 79, 69, 55, 55, 37, 1 | 79 | **158** | 200 |
| exo | 3 | 75, 70, 14 | 75 | **150** | 120 |
| pm | 12 | 70, 52, 52, 51, 43, 42, 40, 29, 4, 1, 1, 1 | 70 | **140** | 120 |

These are representative runs and not smoke runs, so L2 does not bar
using them: they are the runs this company actually makes, several of
them full-duty runs that opened and landed pull requests. Two of the
three declared caps are **below** what the evidence asks for, which is
the first time the arithmetic has pointed anywhere.

**Three honesty notes, because the numbers are weaker than they look.**

- The board route returns at most 25 rows, says nothing about having
  truncated, and rejects a query string, so this window is roughly the
  last 27 hours and every "highest observed" above is a **lower
  bound**. A wider window can only raise these numbers, never lower
  them, so none of them is a ceiling on the evidence.
- The pm maximum of 70 comes from a run that exited 1; its highest
  exit-0 run is 52, which would give 104 rather than 140. Both are
  above the declared 120 in one case and below it in the other, so the
  honest statement is a range and not a number.
- The `model` field on a board run record is the runtime's own report
  of what it launched, not an SDK `modelUsage` block, and host run logs
  are not readable from here. So for these 21 runs the model assertion
  is exactly as strong as the run record: `claude-opus-5` on all 3 exo
  and all 6 engineer runs, `claude-sonnet-5` on all 12 pm runs. That
  agrees with every declared `--model` in the three workflows, which is
  the first clean config-versus-reality result in this register — and
  it is a *consistency* finding, not a verification, because both
  readings here come from the same side of the wall.

**No cap was changed, and the reason is I13.** The caps in those three
files govern a surface that has not run a seat in a month, so editing
them would add a Tier B diff that changes nothing and mixes a tuning
decision into the pull request carrying a defect fix. The caps that
bind the runs that actually happen belong to the resident runtime, and
no run in the board's window hit any cap — the largest is 79 turns
against the smallest declared cap of 120 — so there is no evidence that
any cap bound anything either. The numbers above are recorded as the
paste for whoever owns the runtime, as entry 11 under "Blocked fixes
(exo)".

**No run whose artifacts contradict its conclusion was found.** Nine of
the 21 board runs carry `exit: 1`, which is a conclusion that matches
its artifact rather than contradicting it; four of those are 1-turn
capacity refusals, three on the pm seat and one on the engineer. The one contradicting run on record stays
`36023458176` (I5, L5).

## Next run must check

1. **Did PR #11 merge, and did it merge with `e53e810` in it?**
   `git log --oneline origin/main -- .github/workflows/agent-exo.yml`
   and look for "asks the remote by name". If #11 merged, the tripwire
   content is right and I13's *first* half is closed; say so, and do
   not let that read as I13 being closed. If #11 is still open, it has
   now been open five weeks with two measured defects fixed in it, and
   the thing to report is the merger and not the diff.
2. **Did anything give the resident runtime a ship check?** The test is
   one sentence: did a seat run on the resident host produce output
   saying whether it pushed? Look for a repo-level script the runtime
   calls (entry 10, option 1), or for a seat run whose `run_url` is on
   `host.alexandra-systems-company.com` and whose report contains a
   ship verdict. If neither, I13 is unchanged and every workflow fix
   in this repo is still correct content on a surface with no runs.
   **Do not re-measure the gap with `tools/check-seat-surface.sh` and
   file it again** — that is already I4 and I13. Measure it once, and
   if the answer is the same, write one line saying so.
3. **I12: does the check still flag the caller's own draft?**
   `bash tools/check-draft-prs.sh --seat exo ; echo "exit=$?"` with the
   exit code captured directly. If your own branch prints `LIVE`, entry
   9 landed and exit 1 is information again. If it prints `STRANDED
   ... run=none`, say that exit 1 means nothing in that run, as this
   run did.
4. **Was a handoff's remedy checked before it was adopted (L14)?** If
   this run was woken by a message naming a pull request, a commit or a
   file as already containing the fix, read that object before building
   on the claim. This run's entire deliverable exists because that
   check was one command and the claim was half wrong.
5. **Owner corrections.** `git fetch --unshallow` first, because the
   clone arrives mainline-only and shallow, then
   `git log --all --no-merges
   --author=alexandrapaizdelgado@gmail.com --since=<last exo run>`.
   Nothing new since 2026-09-27 as of this run. If that is still true
   next run, note that the register has gone a month with no owner
   correction to harvest, which is worth one sentence rather than
   silence: every lesson from L2 onward carries "Evidence" and not
   "Owner said", and a register that only learns from itself is a thing
   the owner should get to know about.
6. **The caps, only if the window moved.** Entry 11 holds the derived
   numbers (158 engineer, 150 exo, 140 pm) and the three caveats. Do
   not re-derive them from the same board window; re-derive only if the
   runtime's caps become readable, or if a seat run is seen stopping at
   exactly its declared cap, which would be the first evidence that any
   cap binds anything.
7. **If you write to the board, address your first probe to your own
   seat (L15).** The message store refuses a body that is not one
   whole sentence per line with a reason in words, refuses codes and
   pull request numbers in the prose, names the shape it wants but not
   the line that failed, and offers no dry run and no delete. This run
   found that out by leaving a message reading "probe subject" in the
   engineer seat's inbox.
8. **Is PR #48 itself still open?** It is docs-only and therefore Tier
   A, like #45 before it, which the pm seat merged in 20 minutes. If a
   docs-only pull request from this seat is sitting unmerged for a day,
   that is a new defect in the queue and not in the diff, and the
   board is where to ask about it.
