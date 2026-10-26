# Pending — Atelier

What every seat owes, what's waiting on the owner, and what's an
owner-only action. Maintained by the pm seat (prompts/pm-agent.md).
Each line is dated to when it was last true; stale lines get a note
instead of a silent delete.

## Open PRs awaiting the owner

Re-measured 2026-10-25 (message run 6); the line above was stale by a
month and said "none" while three were open the whole time.

- **#11** (`exo/2026-09-30-workflow-l-e8`, open 26 days) and **#19**
  (`exo-centralizer/2026-10-14-dispatch-guards`, open 12 days): both
  Tier B (`.github/workflows/`), both measured clean against `main` in
  either order (blocked-fixes entry 5 above). Recommendation: **merge**,
  by a chair or the owner — no pm or exo run can touch `.github/`.
- **#40** (`atelier-exo/2026-10-24-message`, open 2 days): the third of
  the same stack, same recommendation, same blocker.
- **#78** (`atelier-exo/2026-10-25-message-3`, draft): the exo seat's
  own open draft, stacked on its own ready #74. Named here for
  visibility; not this seat's to ready, close, or merge.

## Owner-only actions

- **The product is asleep (ADR-002, since 2026-10-16)** (2026-10-25):
  this is the actual blocker behind every item below. Nothing in
  Sprints 2-4 is live work for any seat until the owner wakes the
  product; the items stay recorded because sleeping does not clear
  them (docs/decisions.md ADR-002), not because they are due.
- **PROJECTS_TOKEN / GitHub Projects board mirroring — superseded, not
  fixed** (re-measured 2026-10-25): the company board moved off GitHub
  Projects to `board.libraryofalexandria.dev` (pm.md §14, replacing §2b),
  reached with `BOARD_API_URL`/`BOARD_RUNTIME_TOKEN`. Both are present
  and working this run: `GET /api/board/atelier` answered with the real
  sprint ("Asleep by decision") and run history. There is nothing to
  mirror onto it right now — `items: []`, because the sprint is empty
  while asleep — so this stops being an owner-only action until the
  product wakes and the pm seat has sprint items to write. The
  `gh project item-list 5` / classic-PAT problem below this line is the
  old mechanism and no longer applies to anything; left struck rather
  than deleted per this file's own stale-line rule.
  ~~`gh api user` and `gh project item-list 5 --owner alexandrapaiz` both
  returned `403 Resource not accessible by integration`; needs a classic
  PAT with the `project` scope.~~
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

- **Atelier company mode** (2026-09-19, re-flagged 2026-10-25): docs/ideas.md,
  status `proposed` for five weeks. Its own first step defers discovery
  until after the App Store ship, so the lack of a verdict has cost
  nothing yet — flagged again because five weeks without one is the
  threshold docs/standards/pm.md §2 names, not because it is urgent.
- **Browser checks for what the node harness cannot reach** (2026-09-19,
  re-flagged 2026-10-25): docs/ideas.md, status `proposed` for five
  weeks, same reason. First step is still to reuse
  `scripts/reset-page-test.mjs` for the account-deletion item once the
  product wakes and that item is live again.
- The dozen-plus ideas.md entries dated 2026-10-24 and 2026-10-25 (tool
  fixtures, the merge-order sweep, the liveness file, etc.) are all
  under two weeks old and not flagged here yet; §2's threshold hasn't
  run on them.

## Blocked fixes (exo)

Owned by the exo seat (prompts/exo-agent.md step 2). The pm seat must
not edit or reorder this section. Each entry carries exact
ready-to-paste content so the owner or a seat with the right surface
can apply it without rediscovering it.

Twenty-four entries, of which **five are applied and closed**
(entries 9, 12, 14, 15 and 16 — the last three during the hook run of
2026-10-25).
Entries 1-5 are from the run of 2026-10-24 (PR #40); entries 6-9 from
the later hook run the same day (PR #45); entries 10-11 from the
message run after it (PR #48); entry 12 from the message run after that
(PR #53); entries 13-15 from the message run after that (PR #58);
entries 16-18 from the message run after that (PR #62); entries 19-21
from the hook run of 2026-10-25 (PR #68); entries 22-23 from the
message run after that (PR #71), which also added entry 24 because it
found I22 pointing at a paste no entry held. Each says who
can apply it and gives the text to paste.
Counted by the hand each one names: seven are the engineer seat's (9,
12, 14, 15, 16, 19, 21), **four** are the owner's by merge (1, 2, 3,
24),
**five** are whoever holds the resident runtime (10, 11, 18, 20, 22),
two are HQ's centralizer (17, 23), and the remaining six name a chair,
the pm seat, or anyone with write access to a surface this seat may
not touch.

**Is this section being read? Measured 2026-10-25, because item 10 of
the previous run's list required it before a nineteenth entry was
written.** Yes, and the rate doubled during this run. Two entries were
applied before tonight (9, 12). Two more — 14 and 15, both the engineer
seat's — merged to `main` at 02:27:08Z and 02:27:15Z, twelve minutes
into this run, and entry 16 followed at 02:44Z from the same seat. So
five of twenty-one are applied, three of the engineer
seat's five open asks moved inside a day, and the condition item 10 set
for writing about the handoff instead of about more defects — "if the
answer is close to zero" — is not met. The handoff that works is the
one with a named seat and a graded paste; the entries that have never
moved are the three the owner must merge (1, 2, 3) and the four
addressed to whoever holds the resident runtime (10, 11, 18, 20), which
is a hand this repository has no way to reach and has never heard
from.

**Re-measured 2026-10-25 (message run), and the measurement is now a
lesson rather than a count.** Still five of twenty-three applied, no
entry moved in the four hours since, and entry 19 is unapplied after
one engineer wake — young rather than stale, and recorded that way.
The split the count hides has not moved either: **every entry that has
ever been applied is the engineer seat's, and the nine addressed to
the owner or to whoever holds the resident runtime have never moved**
(1, 2, 3 at 25, 11 and 1 days; 10, 11, 18, 20 never). That is L32, and
it is the reason entry 22 below is written with its own futility
stated on its face instead of being filed as if the hand would read
it. The honest rule going forward: before a sixth entry is addressed
to the resident runtime, the next run writes down that the first five
never moved, and considers whether a seat that *does* wake here can
carry the fix instead.
Entries carry a dated update line when a later run changed what is true
about them, rather than being silently rewritten. A closed entry stays
here with its closure rather than being deleted, so that a later run
reading "the caller's own draft is reported stranded" knows it was
fixed and when, and does not paste it a second time.

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
  a pass — including a `--seat` name `company.yaml` does not declare,
  which exits 2 rather than reporting a clean scope. The draft you are
  writing into prints `LIVE ... run=self` and is not counted against
  you, so any draft it does name is one to ready, or to annotate with
  the clause that keeps it a draft, naming an authority a reader can
  open. Read the status, not a pipe's.
```

Replace `<your seat>` with `engineer`, `pm` and `exo` respectively.

**Update 2026-10-24 (message run 3).** This paste described the output
the tool had before entry 9 was applied, where the caller's own draft
read `STRANDED ... run=none`. The engineer seat fixed that in `0a66c7a`
the same evening and the wording above is now the output a reader
actually gets, verified by running the command inside this run and not
by the lines being present. The field word is `run=self`, not the
`run=live` entry 9 proposed: this seat asked for the fix, the engineer
seat chose the better word, and the paste follows what shipped.

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

**Updated 2026-10-24, hook run.** Still worth pasting, and its
premise is now half wrong. The paste above says "every seat in this
company writes under her account", which is true of comments and false
of commits: the owner authors as `alexandrapaizdelgado@gmail.com` and
seats as `<seat>@agents.epito.me`, so a harvest can find her words
with one command (I9, L9). Three owner commits were sitting in this
run's harvest window, and L11 came out of one of them. If the charter
text above is pasted, paste this sentence with it, as the line before
the one quoted:

```
   Harvest her commits first, which do carry her authorship:
   `git log --all --no-merges --author=alexandrapaizdelgado@gmail.com
   --since=<the last exo run>`. The sentence below applies to pull
   request and board comments, where no discriminator exists yet.
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

**Updated 2026-10-24, hook run.** Entry 5's premise changed and the
three pull requests are no longer the same shape. PR #40 was carrying
four `docs/agents/*` commits as well, which made the register half of
the previous run wait on a Tier B merger that could never come (I8).
Those four commits are now PR #45, docs-only, which the pm seat merges
routinely under §10 Tier A, and PR #40's net diff is now exactly
`+108/-0` across the three workflow files and nothing else. **What is
left here is genuinely only #11, #19 and the reduced #40**, all three
Tier B, all three still needing a chair or the owner. The pm seat
declined all three on 2026-10-24 (PR #43) because that run's own
instructions barred it from touching workflows at all — a narrower
grant than §21's, named rather than overridden, which is correct. So
the merger to expect is a chair or the owner.

**Updated 2026-10-24, message run 2.** Two things changed, neither of
them the merger. **One**, PR #11 now carries a second fix: the engineer
seat measured that the tripwire #11 rewrites asks a local tracking ref
this runtime's clone never creates, and commit `e53e810` makes it ask
the remote instead (I13, L13). So #11 is no longer a five-week-old
nicety — it is the only place a measured false-failure is fixed, and it
is still Tier B. **Two**, the merge-order measurement was redone rather
than quoted, because the branch changed: #11, #19 and #40 merge clean
against today's `main` in all three orders tried, the combined tree
parses as YAML and every tripwire body passes `bash -n`, the five
fixture paths pass on the combined result, and `actions: read` still
lands exactly once. The merger to expect is unchanged, and the cost of
the wait is now a defect rather than a tidiness.

### 6. `company.yaml` on `main` fails the company's own validator (I11)

**Who.** The HQ chair, who wrote the file, or whoever holds HQ's hand
for this repository. `company.yaml` is not in this seat's write lane.

**Why.** HQ's YC seat measured four findings on 2026-10-18 and posted
them on PR #13's thread; PR #13 was closed as superseded on 2026-10-24
without answering any of them, so this entry is now their only home
(L10). One has a live consequence today: `main` declares no `pending:`
surface, HQ's sync resolves that surface only from the manifest with no
default, and the first green sync therefore renders **eight fewer
owner-only rows** — the worthiness gate among them — with no line
saying why.

**Paste.** Replace `main`'s `company.yaml` body below the comment
header with:

```yaml
company: alexandra-systems
product: atelier-app
posture: legacy
priority: 5
owner: alexandrapaiz
surfaces:
  incidents: docs/agents/incidents.md
  decisions: docs/decisions.md
  ideas: docs/ideas.md
  prfaq: docs/prfaq/
  lessons: docs/agents/lessons.md
  pending: docs/agents/pending.md
  sprints: SPRINTS.md
  # no okrs surface exists in this repo, so HQ reads a gap here, not a 404
standards:
  pm: fb114f4
seats:
  - { name: engineer, workflow: .github/workflows/agent-engineer.yml, cadence: dispatch-only, status: backlogged }
  - { name: exo, workflow: .github/workflows/agent-exo.yml, cadence: dispatch-only, status: backlogged }
  - { name: pm, workflow: .github/workflows/agent-pm.yml, cadence: dispatch-only, status: backlogged }
```

**Four of the changes are the YC seat's findings and two are this
seat's, so the applier can weigh them separately.** Theirs:
`product: atelier-app` (the schema asks for the repository name as
GitHub spells it), `cadence: dispatch-only` on all three (`on-dispatch`
is not this company's token), and the added `pending:` and `sprints:`
surfaces. Ours: `standards: pm: fb114f4`, because the file on `main`
says `f2f0561` while `docs/standards/pm.md`'s own vendored header reads
`fb114f4` after PR #38 — the manifest's pointer to the standard it has
adopted is stale. And `status: backlogged`, which ADR-007 amendment 2
prescribes and which the YC seat argued for at length.

**The one word this seat will not choose.** `posture: asleep` is not in
`standards/company.schema.json`'s enum, which is `flagship, product,
internal, private-rd, legacy, infrastructure, holding`. `legacy` is
written above as the nearest valid word, and it is a guess about the
owner's intent, not a reading of it — "asleep" may well mean a product
she intends to wake, which `legacy` does not say. **Pick the word
before pasting.** The validator's complaint is real either way: an
undefined posture passes straight through `tools/sync-company.sh` into
HQ's portfolio table, because that script never calls the validator.

**Verification.** `bash tools/check-manifest.sh company.yaml` from a
clone with the workflows present, expecting `Valid manifest. This repo
is in the company.` and zero findings. The file existing is not the
check (I11).

**Updated 2026-10-24, message run 2.** The half of this entry readable
from inside this repository was re-read, and it has already drifted
again: `company.yaml` line 19 declares `standards: pm: f2f0561`, while
the vendored header of `docs/standards/pm.md` says `fb114f4`, vendored
earlier the same day by PR #38. A manifest field that describes this
repo's own file went stale within hours of that file changing, which
suggests the field needs to be derived from the header rather than
maintained beside it. The validator half is still unanswerable here:
`tools/check-manifest.sh` is HQ's and is not in this tree.

### 7. No seat workflow listens for the board that every seat carries (I10)

**Who.** HQ, under docs/standards/pm.md §15. Already routed: the YC
seat handed it to the exo centralizer on 2026-10-18 with an idempotent
tool, `tools/event-bus-workflows.py`, and all three files here carry
the `workflow_dispatch:` anchor it needs.

**Why.** The owner put `BOARD_API_URL` and `BOARD_RUNTIME_TOKEN` into
all three seat workflows on 2026-09-27, commit `a1418c3`, subject
"Every seat run gets the board ... the board is a tool every seat
uses". No workflow here declares `repository_dispatch`, so a board
message addressed to a seat in this repository wakes nothing and
records no error. Neither PR #11 nor PR #19 adds it, checked with `git
diff` rather than assumed.

**Why it is not fixed here even though this seat can reach workflows.**
It would be a fourth Tier B pull request in a queue whose defining
problem is that the three already open have no merger (entry 5). The
tool at HQ does all four of the portfolio's deaf repositories at once
and this one is three of the four.

**Paste**, if whoever reads this would rather do it by hand — in each
of `.github/workflows/agent-{engineer,exo,pm}.yml`, immediately after
the `on:` key and before `workflow_dispatch:`:

```yaml
  repository_dispatch:
    types: [seat-message]
```

**Verification.** Not the trigger's presence in the file, which is the
config claim (L5). Send a board message to a seat here and read
`gh run list --json event,name` for a run whose event is
`repository_dispatch`.

### 8. The open route has no ceiling, only a fallback (L11, I5)

**Who.** Anyone with write access to `.github/`, so a chair, the pm
under §21, or the owner. One line.

**Why.** The owner made open routing best-effort in commit `257e92e`:
"fall back to the Claude step when the Kimi step fails". The fallback
works. What it costs is unbounded — on 2026-09-24 the open-routed
attempt ran 21m 30s and 50 turns and $0.78 before failing, and
`.github/workflows/agent-pm.yml:60` gives that step
`--max-turns 120`, the identical budget the fallback gets at line 79.
The probe is funded like the work. PR #11's `OPEN_ROUTING` switch does
not fix this: a switch decides whether to try, and says nothing about
what a try may spend.

**Paste.** In `.github/workflows/agent-pm.yml`, in the
`Seat run (open-routed)` step, after `continue-on-error: true`:

```yaml
        timeout-minutes: 10
```

The job's own `timeout-minutes: 60` is the only bound on it today, so
this is the difference between a failed probe costing ten minutes and
costing most of the run's wall clock. Ten is chosen as under half the
21m 30s actually observed; if a later run has evidence of a successful
open-routed run, re-derive it from that instead.

**Verification.** The next pm dispatch where the open-routed step
fails: its duration in `gh run view --json jobs` should be at or under
ten minutes, and the fallback should still produce the work with
`is_error: false`. Read `modelUsage` from the log, never the step
conclusion (L5).

### 9. The stranded-draft check always flags the caller's own draft (I12)

**Who.** The engineer seat. `tools/` is product surface, not this
seat's, and the fix is four lines in a file that seat owns.

**Why.** The check's only guard against naming the run's own work asks
GitHub Actions whether a run is live on the branch. No seat run has
happened in Actions for thirty days (I4), so on the resident runtime
the guard never fires: this run's own pull request #45, minutes old and
being written into, reported `STRANDED ... run=none` and the check
exited 1. Entry 1 above asks every seat to paste this check's output
into its pull request and to read exit 1 as "work no merger can
reach". If exit 1 is also what running normally produces, the signal
is a constant.

**Paste.** In `tools/check-draft-prs.sh`, once near the top:

```sh
self=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")
```

and inside the per-draft loop, immediately before the
`if [ "$run" = live ]` test at line 117:

```sh
  [ -n "$self" ] && [ "$branch" = "$self" ] && run=live
```

This changes nothing about the conservative default the tool argues for
in its own README — an unreadable field still counts as stranded
(L-A44) — and removes only the case the tool already means to exclude.

**Verification.** A seat run on the resident runtime where the check
prints `LIVE` for the branch it is standing on, and exits 0 when
nothing else on that seat is stranded. Not the file containing the
line: run it.

**APPLIED and CLOSED 2026-10-24 (message run 3).** The engineer seat
applied it in `0a66c7a`, merged in PR #47. Verified the way this entry
demanded — by running it, inside a run, with this run's own draft open:
`bash tools/check-draft-prs.sh --seat exo` printed `LIVE #53
atelier-exo/2026-10-24-message-3 idle=0h commits=1 files=1
carries=work run=self` and exited 0.

**One word differs from the paste above, deliberately, and this seat
confirms it.** The shipped field reads `run=self`, not `run=live`. The
engineer's reason is L-E11's: a branch read and an Actions read are
different facts and must not print the same word. That is better than
what this entry asked for, so the paste is left standing as the record
of what was asked and this line is the record of what shipped; a reader
wanting the literal text should take `run=self`. Entry 1 above, which
quotes this tool's output inside a charter bullet, was corrected in the
same run for the same reason.

**Do not paste this entry again.** If a later run finds its own draft
reported `STRANDED`, that is a regression and a new incident, not this
one reopening. What the fix does *not* cover is entry 12 below.

### 10. Nothing checks whether a seat run shipped, on the surface every seat runs on (I13)

**Who.** The owner, or whoever holds the resident runtime. This is the
one entry in this section that no seat in this repository can apply,
because the thing to change is not in this repository.

**Why.** Every ship check this repo owns lives in
`.github/workflows/agent-*.yml`, and those three files last executed a
seat on 2026-09-19 and 2026-09-24 while all 21 seat runs on the board
ran on `host.alexandra-systems-company.com`
(`tools/check-seat-surface.sh`: 3 of 3 ELSEWHERE, gaps 35d/35d/30d).
So the no-ship tripwire I3 built, the stranded-draft step PR #40 adds
and the tripwire fix PR #11 now carries all guard a dispatch path that
has not carried a seat in a month. A seat run on the host that commits
and never pushes still loses everything silently, which is the incident
the tripwire exists for, untouched since September.

**Option 1, the cheaper one: the runtime calls this repo's checks.**
The pattern is already on `main` twice — `tools/check-draft-prs.sh`
behind `npm run drafts`, and `tools/check-seat-surface.sh`. A ship
check in the same shape is a few lines, and one fix would then bind on
both surfaces instead of one. This seat did not write it, deliberately:
`tools/` is the engineer seat's lane (I12 states this in its own fix),
and L3 says a seat in contested territory yields and files rather than
races. **So the ask has two halves**: the engineer seat writes
`tools/check-shipped.sh`, taking the body from the tripwire step as PR
#11 leaves it (it is already a standalone shell script with no Actions
dependency except `$GITHUB_STEP_SUMMARY`, which should become optional
in the port); and whoever owns the runtime calls it after each seat run
and puts its output in the run report.

**Option 2: dispatch the seats through Actions**, so the declared
surface is the real one. Entry 7 and I10 record that no seat workflow
can currently be woken from the board, so this option needs that
first, and it is HQ's.

**Verification.** A seat run whose `run_url` is on
`host.alexandra-systems-company.com` and whose own output says whether
it pushed. Not a merged workflow pull request, and not a green workflow
file.

**Update 2026-10-24 (message run 3): the first half of option 1 is
delivered, on a branch.** The engineer seat took the ask and wrote
`tools/check-shipped.sh` in PR #52 — the tripwire body from PR #11 at
`e53e810`, four verdicts (`SHIPPED`, `ORPHANED`, `UNPUSHED`,
`NOTHING`), a `--fixture` mode, 367 lines of tests over 20 fixtures,
and no Actions dependency. Read at the branch tip rather than taken
from the pull request title (L14). **The second half is untouched and
is the whole of what remains here**: the resident runtime has to call
it after each seat run and put its verdict in the run report. Until
something calls it, this entry stays open, because a tool nothing calls
is not a check — and the next run's test is not whether `#52` merged
but whether anything calls what it added.

**Update 2026-10-24 (message run 4): the first half is on `main`, and
the remaining ask is now one exact line.** PR #52 merged at 22:24Z.
Nothing calls it: 0 of 25 board run reports mention a ship verdict and
the report template has no slot for one.

**What to add to the post-run step, for whoever owns the runtime.**
Capture the base tip *before* dispatching the seat, then after the run,
in the seat's checkout:

```sh
base_before=$(git ls-remote --heads origin main | cut -f1)   # BEFORE the run
...
bash tools/check-shipped.sh --base main --base-sha "$base_before"
```

and put the last two lines of its output into the run report. Exit 0 is
shipped, 1 is lost work, 2 is a reading that failed and is not a pass.

Three conditions on that line, each measured rather than assumed.
`git ls-remote` and not `git rev-parse --short`: with an abbreviated
sha the tool reports every run as shipped, which is I16, and **entry 14
must land before this line is worth writing**. The capture has to
happen before the run or the Tier A self-merge path reads as a run that
did nothing. And the tool must be called from the seat's own checkout,
because it asks the remote about the branch that checkout is standing
on; it writes nothing and fetches nothing, so it is safe to call in
somebody else's tree.

**What this run can now vouch for that no previous run could.** The
tool was called by hand twice on the resident runtime, on a
committed-and-unpushed HEAD and again after the push, and read
`ORPHANED` with both shas and then `SHIPPED source=remote-head`
through a mainline-only clone — the exact condition that broke the
workflow version. So the remaining risk in this entry is not whether
the tool works on the surface. It is that nothing calls it, and one
defect in how it will be called.

**Update 2026-10-24 (message run 5): re-measured in a later window,
unchanged, and the liveness file is deliberately *not* folded in
here.** The board's 25 records at 22:52Z span 18:07:24 to 22:38:18 --
an entirely later window than the one this entry was last measured
against -- and **0 of 25 carry a ship verdict** in any field. The
report template still has no slot for one. That is the third
consecutive measurement finding the second half of option 1 untouched,
and it is the fact that decides the question the engineer seat put to
this seat tonight: see **entry 18**, which stands on its own rather
than being appended here, and which names this entry's pre-run hook so
that whoever edits one edits both in a single pass.

### 11. The turn caps the evidence now asks for, for whoever owns the runtime

**Who.** Whoever owns the resident runtime's per-seat turn budget. The
caps in `.github/workflows/agent-*.yml` are not it (I13), which is why
this is a paste and not a diff.

**Why.** Charter step 4 says re-derive at 2x the highest observed with
a floor of 100, from runs that executed the seat's full duties (L2).
Until this run the only readable runs were five Actions runs from
September, four of them smoke or failed routes, so every previous
derivation correctly concluded that nothing could be tuned. The board's
run records are a surface no previous derivation had read: 21 runs with
`turns` on each, all on the resident host.

| seat | highest `turns` observed | 2x, floor 100 | declared in the workflow |
|---|---|---|---|
| engineer | 79 | **158** | 200 |
| exo | 75 | **150** | 120 |
| pm | 70 | **140** | 120 |

**Read the caveats before using the numbers.** The board route returns
at most 25 rows and does not say whether it truncated, so this is a
~27-hour window and each maximum is a lower bound — a wider window can
only raise them. The pm figure of 70 is from a run that exited 1; its
highest clean run is 52, which would give 104 instead. And no run in
the window came near any declared cap, so there is no evidence that any
cap has ever bound anything here; these are headroom numbers, not
observed limits.

**Verification.** A seat run seen stopping at exactly its declared cap
would be the first evidence that a cap binds anything in this company.
Until then this entry is a recommendation with its own uncertainty
attached, which is the honest shape for it.

**Update 2026-10-24 (message run 3): re-derived, and the caveat above
was right.** The window moved — the board's 25 records now span 01:35
to 22:03 on 2026-10-24, four of them new — so the numbers were taken
again rather than restated. **Use this table, not the one above.**

| seat | runs | highest `turns` | 2x, floor 100 | what this entry said yesterday |
|---|---|---|---|---|
| engineer | 7 | 79 | **158** | 158 |
| exo | 4 | 88 | **176** | 150 |
| pm | 14 | 70 (highest clean 63) | **140** (clean: 126) | 140 (clean: 104) |

The exo figure rose by 26 turns in one day, because the new maximum is
this seat's own previous run at 88 turns — the longest seat run on this
product's record. That is the lower-bound caveat proving itself inside
24 hours, so read these three numbers as headroom with the same caveat
still attached, not as a measurement of what a seat needs. The page is
still capped at 25 rows with no truncation flag, so the window is ~20
hours and every maximum can still only rise. Models asserted from the
artifact: `claude-opus-5` on every engineer and exo record,
`claude-sonnet-5` on every pm record.

**Update 2026-10-24 (message run 5): the exo maximum moved again, by
ten turns, in under an hour.** Read at 22:52Z; the board's 25 records
now span 18:07:24 to 22:38:18 on 2026-10-24, a 4.5-hour window, which
is the page filling faster as the night goes on. **Use this table.**

| seat | runs | highest `turns` | 2x, floor 100 | what this entry said an hour ago |
|---|---|---|---|---|
| engineer | 6 | 79 | **158** | 158 |
| exo | 6 | **98** | **196** | 176 |
| pm | 13 | 70 | **140** | 140 (clean: 126) |

Only one number changed and it is the same number that changed last
time: the exo maximum, now this seat's 22:25:23-22:48:09 run at 98
turns. Two consecutive re-derivations have raised it and no other, by
26 then 10, which is a pattern rather than noise -- it is the seat
whose work is reading and writing four registers, and it is the seat
whose declared cap is the lowest of the three (120). The "clean"
qualifier is retired for the pm row in this window: the only pm runs
that exited 1 in it are four session-limit refusals at `turns=1`, so
the highest pm run and the highest clean pm run are the same run.

Models asserted from the artifact again, and they are consistent:
`claude-opus-5` on all 6 engineer and all 6 exo records,
`claude-sonnet-5` on all 13 pm records. No run in this window stopped
at a declared cap, so the verification condition on this entry is still
unmet and these are still headroom numbers.

**Update 2026-10-25 (message run): two maxima moved and the exo row
held for the first time in four derivations.** Read at 02:49Z; the
board's 25 records span 2026-10-24T21:40:18.930Z to
2026-10-25T02:38:35.468Z. **Use this table.**

| seat | runs | highest `turns` | 2x, floor 100 | declared in the workflow | what this entry said four hours ago |
|---|---|---|---|---|---|
| engineer | 6 | **109** | **218** | 200 | 158 |
| exo | 7 | 98 | **196** | 120 | 196 |
| pm | 12 | **88** | **176** | 120 | 140 |

Both increases come from **one event**: the three-seat wake at
2026-10-25T02:20:32Z, where engineer, exo and pm started in the same
second and ran 109, 85 and 88 turns, all exit 0. The engineer figure
rose 38% and the pm figure 26% in that single wake; the exo figure did
not move. So the sentence this entry owed about a trend is answered by
the trend ending — two consecutive derivations had raised only the exo
row, and the reading that it was "the seat whose work is reading and
writing four registers" does not survive a wake where the other two
seats did full runs and passed it. **What the maxima track is the wake
shape, not the seat.** The number to watch next is whether another
simultaneous dispatch raises all three again.

A running maximum, never the page's: the page is 25 rows and slides,
so a lower figure on a later page is not evidence. Taking the page
maximum instead would have dropped the exo row from 196 to 170 here on
no new evidence.

Models asserted from the artifacts for the fourth consecutive reading:
`claude-opus-5` on all 6 engineer and all 7 exo records,
`claude-sonnet-5` on all 12 pm records. The verification condition on
this entry — a run seen stopping at its declared cap — is **still
unmet**, so these remain headroom numbers. What is new is that the
margin has closed: exo's observed 98 and pm's observed 88 sit under
declared caps of 120, where a year of headroom used to be.

### 12. The draft check aims its close instruction at a colleague's live run (I14)

**Who.** The engineer seat. `tools/` and `tests/` are both that seat's
lane (I12 and I13 ruled the same way, and L3 says a seat in contested
territory yields and files rather than races), and this is a guard of
about ten lines plus its tests.

**Why.** Entry 9 fixed the caller's own draft. The case left over is
another seat's pass running in the same minute, and what the check
prints for one is not a missing `LIVE`:

```
STRANDED  #52 atelier-engineer/2026-10-24-message-2 idle=0h commits=1 files=0 carries=nothing run=none
```

`carries=nothing` is, by this tool's own README, *the* reading that
tells a reader to close a pull request, and that README says why it
matters: "the cheap error here is one merge of waiting; the expensive
one is closing work that exists." `#52` was four minutes old when that
line printed, opened draft-first with an empty commit — the practice
every charter here mandates — and three minutes later it received
`tools/check-shipped.sh`, the fix for the largest open entry in this
register. The refutation is printed on the same line, `idle=0h`, and
the verdict never consults it: only `run` decides `LIVE` versus
`STRANDED`.

**Do not fix this with the board.** `docs/ideas.md` proposes a
`run=board` reading. Measured at 22:08:03Z on 2026-10-24: all 25 board
records carried `ended_at`, **none** was in progress, neither run in
flight at that moment appeared, and `branch` is null on all 25. A run
reaches the board when it ends, so that route is blind for exactly the
window it would exist to cover (L16, I14).

**Paste.** Four edits in `tools/check-draft-prs.sh`. Keep the numeric
idle alongside the printed one, at the `idle=` block (line 144):

```sh
    idle_h=$(( (now - last_epoch) / 3600 ))
    idle="${idle_h}h"
  else
    idle=unreadable; idle_h=""
  fi
```

After the `run=` chain closes (line 156), before the verdict:

```sh
  # A draft minutes old is not a draft no merger can reach: stranding is time
  # without a merger, and the longest seat run this product has on record is 23
  # minutes. So a draft whose newest commit is under an hour old — 2.6x that —
  # is reported as fresh rather than stranded, and prints its own word, because
  # a weaker reading must not borrow a stronger one's name (L-E11). An
  # unreadable idle field can never reach this test, so a failed read still
  # counts as stranded (L-A44).
  if [ "$run" = none ] && [ -n "$idle_h" ] && [ "$idle_h" -lt 1 ]; then
    run=fresh
  fi
```

A third branch in the verdict (before the `else` at line 161), with
`fresh=0` initialised beside `stranded=0`:

```sh
  elif [ "$run" = fresh ]; then
    fresh=$((fresh + 1))
    printf 'FRESH     #%s %s idle=%s commits=%s files=%s carries=%s run=%s\n' \
      "$number" "$branch" "$idle" "$commits" "$files" "$carries" "$run"
```

And the count in the summary, after `read_note` is set (line 173), so
that a draft left unjudged never reads as one examined and cleared
(L-A21):

```sh
[ "$fresh" -gt 0 ] && read_note="$read_note, $fresh too fresh to judge"
```

**Already verified, in a scratch copy, so this is not an untested
claim about a file (L14).** Applied to `/tmp/cdp-fresh.sh` — outside
the repository, so `tools/` was never written to by this seat — and run
against the same live queue:

```
$ bash /tmp/cdp-fresh.sh --all ; echo "exit=$?"
LIVE      #53 atelier-exo/2026-10-24-message-3 idle=0h commits=3 files=3 carries=work run=self
FRESH     #52 atelier-engineer/2026-10-24-message-2 idle=0h commits=3 files=64 carries=work run=fresh
check-draft-prs: 2 draft(s) in scope, 0 out of scope, 1 too fresh to judge, none stranded.
exit=0
```

Graded against the tool it fixes, as L-A21 asks: unpatched, `#52`
prints `STRANDED ... run=none` and the run exits 1; patched, it prints
`FRESH ... run=fresh` and exits 0; nothing else in the output moves.
`bash -n` passes.

**What the engineer seat owes on top of the paste.** Tests, in
`tests/draft-prs.test.mjs`, for three readings: a fresh draft is
`FRESH` and not counted; a draft with an unreadable idle field is still
`STRANDED`, because a failed read must never reach the fresh test; and
a draft one hour and one minute old is `STRANDED`, so the boundary is
graded rather than assumed. And one judgement call that is the
engineer's rather than this seat's: whether the threshold stays an hour
— chosen because `idle` is already computed in whole hours, so the
guard needs no new read — or becomes a named constant in minutes, which
would cost one more field but let the number be derived from the board
instead of rounded from it.

**One line of documentation goes with it.** `tools/README.md` says
"`run=live` can never fire on the surface that runs the seats", and
this run watched it fire: a pm draft read `run=live` because this
repository's own `tests` workflow was in flight on the branch from the
push (`gh run list --branch ... → tests, event=pull_request`). The
reading is coincidental rather than dead — `live` for the seconds CI
runs, `none` before and after, with nothing about the work changing —
so the sentence should say that `run=live` reads *any* Actions run on
the branch, which here means CI and never a seat. It is also the second
argument for this entry: a draft's age does not flicker.

**Verification.** `bash tools/check-draft-prs.sh --all` run while a
second seat has a draft open that is minutes old, printing a third word
for it that is neither `self` nor `live`, and exiting 0 with the fresh
count named on the summary line. Not the lines being present: run it.

**CLOSED 2026-10-24 (message run 5), on this entry's own verification
rather than on the fix being reported.** The engineer seat took it in
PR #56, which merged into `main` at 22:42:45Z. Read in the file on
`main`, not in the pull request's description (L14):
`fresh_under_min=60` at line 90 as a named constant in minutes, a
`--fresh-under` flag whose non-integer values exit 2 rather than
silently defaulting to nothing, a `fresh_under_min -gt 0` conjunct so a
zero turns the guard off, the `FRESH` branch in the verdict, `idle`
rendered in minutes under the hour, and the threshold named in the
summary count.

The verification this entry asked for, performed, with a real second
seat's draft rather than a fixture -- the engineer seat's own next run,
open for one minute at the time of the reading:

```
$ bash tools/check-draft-prs.sh --all ; echo "exit=$?"
LIVE      #62 atelier-exo/2026-10-24-message-5 idle=0m commits=16 files=3 carries=work run=self
FRESH     #60 atelier-engineer/2026-10-24-message-5 idle=1m commits=5 files=4 carries=work run=fresh
check-draft-prs: 2 draft(s) in scope, 0 out of scope, 1 too fresh to judge (under 60m), none stranded.
exit=0

$ bash tools/check-draft-prs.sh --all --fresh-under 0 ; echo "exit=$?"
LIVE      #62 atelier-exo/2026-10-24-message-5 idle=0m commits=16 files=3 carries=work run=self
STRANDED  #60 atelier-engineer/2026-10-24-message-5 idle=1m commits=5 files=4 carries=work run=none
check-draft-prs: 1 of 2 draft(s) in scope are stranded (0 out of scope) -- ready them, close them, or name the clause that keeps them drafts (L-A32).
exit=1

$ bash tools/check-draft-prs.sh --all --fresh-under 1.5 ; echo "exit=$?"
check-draft-prs: --fresh-under needs a whole number of minutes, got: 1.5
exit=2
```

Three verdicts, three exit statuses, and the third word printed for a
draft that a colleague's live run was writing into as the line printed.
`npm test` is 83/83 on `main`.

**The judgement this entry handed to the engineer seat went the other
way, and the reason is better than the one this entry offered.** This
entry argued for keeping the hour because `idle` was already computed
in whole hours and the guard would then need no new read, which is an
argument about the cost of the change. The engineer's answer is that
whole-hour arithmetic was already exact, so precision was never the
defect -- the defect was that the number was invisible, and nobody can
find, change or disagree with a threshold they have to
reverse-engineer out of an integer division. That is the better
argument and it is written here so the next seat reading this entry
does not learn the weaker one.

**One reading this entry did not anticipate is now I18 and blocked fix
16.** The zero that turns the guard off leaves no trace on the summary
line, so a merger's sweep and a judged stranding print the same
sentence.

**APPLIED and CLOSED 2026-10-24 (message run 4).** Applied by the
engineer seat in PR #56, merged at 22:42:45Z, and verified by running
it rather than by the lines being present: with a colleague's
four-minute-old draft open, `bash tools/check-draft-prs.sh --all`
printed `FRESH #60 atelier-engineer/2026-10-24-message-5 idle=4m …
run=fresh` beside this run's own `LIVE … run=self`, summarised as
`2 draft(s) in scope, 0 out of scope, 1 too fresh to judge (under
60m), none stranded`, and exited 0. **Do not paste this entry again.** The shipped word is `run=fresh` with
its own verdict `FRESH`, not the `run=none`-with-an-age this entry
sketched, and the threshold is `--fresh-under <minutes>` defaulting to
60 with the derivation beside it rather than a rounded hour. Both are
better than what was asked and both are confirmed. **The one line of
documentation this entry also asked for did not land**: `tools/README.md`
still says "`run=live` can never fire on the surface that runs the
seats", in `#56`'s own copy, read from the branch and not from the
description. That residual is entry 15.

### 13. The three workflows should call the tool, not inline eighty lines (I13, and the engineer seat's ask)

**Who.** A seat that may write `.github/workflows/`, on PR #11's
branch `exo/2026-09-30-workflow-l-e8`. **Not this run**: its own
instructions bar it from the workflow directory entirely, which is why
this is a paste and not a commit. It is the exo lane otherwise, so no
fourth pull request should be opened against those three files — the
engineer seat deliberately did not open one for exactly that reason
and asked this seat to land it on top of its own.

**Why.** `tools/check-shipped.sh` is on `main` as of PR #52, and it is
the same body as the tripwire step with eight deliberate divergences.
The three workflows still inline their own copy, so there are now two
implementations of one guard and the next fix lands in four files
instead of one. The engineer seat named this as the workflow half it
wants and left it to this lane.

**The paste.** In each of `.github/workflows/agent-engineer.yml`,
`agent-exo.yml` and `agent-pm.yml`, replace the whole `No-ship
tripwire` step body with a call. Two steps, because the base tip has
to be captured **before** the seat runs:

```yaml
      # Before the seat run step. The base tip as it was, so that a clean
      # self-merge is not read as a run that did nothing (I13, L-E11).
      - name: Base tip before the run
        id: basetip
        run: echo "sha=$(git ls-remote --heads origin main | cut -f1)" >> "$GITHUB_OUTPUT"
```

```yaml
      # Incident 3 and I13 (docs/agents/incidents.md): a run that worked for
      # dozens of turns, reported success and pushed nothing loses everything
      # at teardown. One implementation, called from both surfaces.
      - name: No-ship tripwire
        if: always()
        run: bash tools/check-shipped.sh --base main --base-sha "${{ steps.basetip.outputs.sha }}"
```

`git ls-remote` is deliberate on both sides and gives the **full**
forty-hex sha. Do not write `git rev-parse --short`, and do not land
this at all until entry 14 is fixed: with an abbreviated sha the tool
reports every run as shipped (I16). That ordering is the whole reason
these are two entries.

**What this changes besides the line count.** The tool writes to
`$GITHUB_STEP_SUMMARY` when the variable is set, so the job summary is
unchanged. Exit 2 becomes reachable where the old step only had 0 and
1, which is the point (L6): a reading that failed stops being reported
as a finding about the run.

**Verification.** A workflow run — which is itself the problem, since
these three files have not executed a seat since 2026-09-24 (I13). So
the honest verification is the smaller one: `bash -n` on each step
body, and `bash tools/check-shipped.sh --base main --base-sha $(git
ls-remote --heads origin main | cut -f1)` run by hand from a seat
checkout, agreeing with the same call made with the abbreviated sha.

### 14. The ship check passes on any abbreviated base sha (I16)

**Who.** The engineer seat. `tools/` and `tests/` are that lane (I12,
L3), and this is a one-line change plus two test cases.

**Why.** `tools/check-shipped.sh:202` compares a sha the tool reads
from `git ls-remote` against whatever string the caller passed to
`--base-sha`, with `!=`. Any difference in spelling reads as the base
having moved, and `base-advanced` is tested above `ORPHANED`,
`UNPUSHED` and `NOTHING`, so a false `advanced` masks every failure
verdict the check has. Measured in this run on one unchanged tree with
a commit sitting unpushed: the full sha gives `ORPHANED … exit=1`, its
own abbreviation gives `SHIPPED source=base-advanced … exit=0`. The
first caller this tool will ever have is the resident runtime, and
`git rev-parse --short HEAD` is the ordinary way to capture a base tip.

**The paste.** Two changes. First, reject a `--base-sha` that is not a
sha at all, in the argument loop beside the existing flags:

```sh
    # A --base-sha that is not hexadecimal is a caller error, not a base tip:
    # `--base-sha main` or a typo would otherwise be compared as a string and
    # read as the base having moved, which is the passing branch (I16).
    --base-sha)
      base_sha="${2:-}"
      case "$base_sha" in
        ''|*[!0-9a-fA-F]*) echo "check-shipped: --base-sha needs a commit sha, got: ${2:-<nothing>}" >&2; exit 2 ;;
      esac
      shift 2 ;;
```

Second, replace the comparison at line 202:

```sh
  if [ -n "$base_now" ] && [ "$base_now" != "$base_sha" ]; then
    advanced="origin/$base moved from $base_sha to $base_now"
  fi
```

with one that puts both sides into one normal form before comparing:

```sh
  # One normal form before comparing. $base_now is always a full forty-hex sha
  # read from git ls-remote; $base_sha is whatever string the caller typed, and
  # the abbreviation of a commit must not read as that commit having moved --
  # the inequality branch here is the *passing* one, so a representation
  # difference would pass a run that shipped nothing (I16, L19). Resolution is
  # tried first and may legitimately fail: on a shallow clone the pre-run tip
  # of an advanced base is not an object this checkout holds, which is the
  # self-merge case --base-sha exists for. So the fallback is a prefix test in
  # whichever direction is unambiguous, and anything that is neither is movement.
  if [ -n "$base_now" ] && [ -n "$base_sha" ]; then
    same=
    a=$(git rev-parse --verify --quiet "${base_sha}^{commit}" 2>/dev/null || true)
    b=$(git rev-parse --verify --quiet "${base_now}^{commit}" 2>/dev/null || true)
    if [ -n "$a" ] && [ -n "$b" ]; then
      [ "$a" = "$b" ] && same=1
    elif [ ${#base_sha} -ge 7 ] && [ "${base_now#"$base_sha"}" != "$base_now" ]; then
      same=1          # base_now starts with what the caller wrote: one commit
    elif [ ${#base_now} -ge 7 ] && [ "${base_sha#"$base_now"}" != "$base_sha" ]; then
      same=1
    else
      [ "$base_now" = "$base_sha" ] && same=1
    fi
    [ -z "$same" ] && advanced="origin/$base moved from $base_sha to $base_now"
  fi
```

**What this deliberately does not do, after a first draft that did.**
The first version of this paste reported an unresolvable `--base-sha`
as `INCONCLUSIVE`, on the L6 reasoning that a reading which failed is
not a pass. Graded against the existing fixtures, it turned the
`self-merge` fixture from `SHIPPED source=base-advanced` into
`INCONCLUSIVE` and broke the test that pins the one case `--base-sha`
exists for. The reason is real and not an artefact of the fixture: on
a shallow clone, the pre-run tip of a base that genuinely advanced is
not an object the checkout holds, so resolution failing is the normal
state of the case this flag serves. Hence the prefix fallback, and
hence two hex strings that are neither resolvable nor a prefix of one
another still read as movement — which is what the tool does today and
what its fixtures assert. The caller error that *is* catchable is
caught at parse time instead, by the hex check above.

**Graded, because a remedy is a claim about a file (L14).** Patched
into a scratch copy outside this repository, so `tools/` stayed the
engineer's:

| call, against a base that had not moved, one commit unpushed | today | with the paste |
|---|---|---|
| `--base-sha 641ad2843606e3d8f5be60949ad7cb3163008ac6` | `ORPHANED` exit 1 | `ORPHANED` exit 1 |
| `--base-sha 641ad28` (same commit, abbreviated) | **`SHIPPED` exit 0** | `ORPHANED` exit 1 |
| `--base-sha main` | **`SHIPPED` exit 0** | exit 2, names the argument |
| `--base-sha deadbeef` | `SHIPPED` exit 0 | `SHIPPED` exit 0 (unchanged, see above) |
| `--fixture self-merge --base-sha 1111eeee` | `SHIPPED base-advanced` | `SHIPPED base-advanced` |

`bash -n` passes, and the full suite is **74/74 before and 74/74
after** in a scratch copy of the repository with only this file
changed.

**The two test cases it owes**, because the eleven existing fixtures
all set `--base-sha` and `base_now` to *different* commits and so only
ever exercise `advanced` being right:

- a fixture whose `base_now` is a full sha and whose `args` pass the
  first seven characters of that same sha, asserting the verdict is
  **not** `SHIPPED source=base-advanced`;
- a live case on the `mainlineOnlyClone` helper: commit without
  pushing, call with `--base-sha "$(git rev-parse --short HEAD)"` of
  the unchanged base, and assert exit is not 0. This is the one the
  runtime will actually hit.

**Verification.** The two calls that disagree in I16, made against one
unchanged base, agreeing. Not the line being present: run it both ways.

**APPLIED and CLOSED 2026-10-25 (hook run). Do not paste this again.**
The engineer seat shipped it in PR #64, merged to `main` at 02:27:08Z —
`1b306d8` for the clause, `4186958` for the README, plus the fixture
`tests/fixtures/shipped/base-abbreviated/` and the live `mainlineOnlyClone`
case this entry asked for. The fix is lexical rather than resolved, which
the engineer seat flagged in its own handoff and this entry had graded
as acceptable. Verified by the method this entry demanded and not by
reading the line: both calls, one unchanged base
`fa7c2514e083e70572ff270513fddf4524e2cec1`, one commit made and not
pushed, both `ORPHANED` and both exit 1, and the abbreviated call no
longer appends `(advanced)` to a base that did not move. `npm test` on
the merged tree: 0 failures. Oldest unapplied paste in this section for
three runs; applied on the fourth, twelve minutes into it.

### 15. One sentence in the tools README is false about this repository (I14 item 10)

**Who.** The engineer seat, one line, alongside or after PR #56.

**Why.** `tools/README.md` says "`run=live` can never fire on the
surface that runs the seats." It fires routinely. `.github/workflows/tests.yml`
runs on pushes, so every seat branch carries Actions runs even though
no seat runs through Actions: `gh run list --branch
atelier-exo/2026-10-24-message-4` returned three completed `tests` runs
during this run. PR #56 does not touch the sentence — read in the
branch's own copy of the file, not in its description. The reading is
coincidental rather than dead: `live` for the seconds CI is in flight,
`none` before and after, with nothing about the work changing.

**The paste.** Replace:

> So `run=live` can never fire on the surface that runs the seats,

with:

> So `run=live` never means a seat here. It still fires, because
> `tests.yml` runs on every push and `gh run list` reports it, which
> makes the reading flicker on CI timing: `live` for the seconds the
> suite is in flight, `none` before and after, with nothing about the
> work having changed. Two readers a minute apart will disagree about
> the same draft, which is the second argument for judging a draft by
> its age.

**Verification.** `gh run list --branch <any seat branch pushed in the
last hour>` returning a `tests` run, read against the sentence.

**APPLIED and CLOSED 2026-10-25 (hook run). Do not paste this again.**
Shipped in PR #60, merged to `main` at 02:27:15Z. `grep -n "can never
fire" tools/README.md` on the merged tree returns nothing; line 67 now
reads "So `run=live` fires on no run this product is actually having".
The engineer seat did not take the paste verbatim and the sentence it
wrote is better — it leads with what the reading *means* rather than
with the mechanism — so this entry closes on the defect being gone, not
on its own wording being adopted. Three runs asked for one line; the
note that it was "buried inside an entry about something else" (item 7
of PR #62's list) can now be read as answered rather than as a
complaint: it landed the run after the shape was named.

### 16. The freshness guard can be switched off and the clean line does not say so (I18)

**Who.** The engineer seat. `tools/` and `tests/` are that seat's lane
(I12 and I13 ruled the same way), and this is one line plus one test.

**Why.** `--fresh-under 0` is a documented, deliberate off-switch: the
sweep a merger wants rather than the sweep a seat wants. The threshold
is named on the summary line only by the clause that counts what it
excused, so the one call where it excused nothing by instruction is the
one call whose output never mentions it. A merger's zero-sweep and a
stranding judged by a live guard print the same sentence, and the
verdict involved is the one the README says tells a reader to close a
pull request.

**Paste.** One line in `tools/check-draft-prs.sh`, immediately after
`read_note="$skipped out of scope"`:

```sh
# A sweep with the freshness guard off judges drafts that nothing vouches for
# and nothing had time to vouch for, so the line it prints has to say the guard
# was off. Otherwise a zero-sweep's STRANDED reads exactly like a judged one,
# which is L-A21's defect with its sign reversed: not a draft nobody examined
# reading as cleared, but a draft nobody could clear reading as examined. The
# threshold is only named today when it excused something, so the one run where
# it excused nothing on purpose is the one run that says nothing about it.
[ "$fresh_under_min" -eq 0 ] && read_note="$read_note, freshness guard off"
```

**Graded, both ways, against the file on `main`, before being asked
for (L14 and L-A21).** Applied to `/tmp/cdp-guardoff.sh` — outside the
repository, so `tools/` was never written to by this seat — and run
against a deterministic queue through this tool's own stub harness: a
real git repository, a stub `gh` first on `PATH`, one draft whose
newest commit is five minutes old. Both copies therefore read the same
queue rather than the live one, which moved twice during this run.

```
--- check-draft-prs.sh      (the file on main)
  args=''                exit=0
    FRESH     #91 atelier-engineer/fresh-one idle=5m commits=4 files=1 carries=work run=fresh
    check-draft-prs: 1 draft(s) in scope, 0 out of scope, 1 too fresh to judge (under 60m), none stranded.
  args='--fresh-under 0' exit=1
    STRANDED  #91 atelier-engineer/fresh-one idle=5m commits=4 files=1 carries=work run=none
    check-draft-prs: 1 of 1 draft(s) in scope are stranded (0 out of scope) — ready them, close them, or name the clause that keeps them drafts (L-A32).

--- cdp-guardoff.sh         (the paste applied)
  args=''                exit=0
    FRESH     #91 atelier-engineer/fresh-one idle=5m commits=4 files=1 carries=work run=fresh
    check-draft-prs: 1 draft(s) in scope, 0 out of scope, 1 too fresh to judge (under 60m), none stranded.
  args='--fresh-under 0' exit=1
    STRANDED  #91 atelier-engineer/fresh-one idle=5m commits=4 files=1 carries=work run=none
    check-draft-prs: 1 of 1 draft(s) in scope are stranded (0 out of scope, freshness guard off) — ready them, close them, or name the clause that keeps them drafts (L-A32).
```

The default output is byte-identical and both exit statuses are
unchanged. One clause appears, in one call, and it is the call the flag
exists for. `bash -n` passes.

**What the engineer seat owes on top of the paste.** One test in
`tests/draft-prs.test.mjs`: a draft inside the window, run with
`--fresh-under 0`, asserting both that it prints `STRANDED` and that
the summary says the guard was off. The first half of that assertion
already passes on `main` — it is the boundary case the fresh suite
added — so the test has to be written to fail on `main` before it is
trusted, which means asserting the summary text and not only the
verdict.

**A second line of documentation goes with it**, in the paragraph of
`tools/README.md` that introduces the flag: say that the zero-sweep
names itself on the summary line, because the reader of that paragraph
is the merger who will type the flag.

**Verification.** `bash tools/check-draft-prs.sh --all --fresh-under 0`
naming the guard as off on its summary line, beside the same command
without the flag not naming it. Not the line being present: run it both
ways.

**APPLIED and CLOSED 2026-10-25 (hook run). Do not paste this again.**
PR #66 merged at 02:44Z. Verified by running the command and not by
reading the clause: `bash tools/check-draft-prs.sh --all --fresh-under
0` now ends its summary `(0 out of scope, freshness guard off)`, and
`npm test` on the merged tree is 95 passing. The engineer seat graded
the test both ways itself before handing it over — `not ok 1 - the
caller turned the guard off and the verdict does not say so` on the
trunk copy, passing on its own — which is why this entry closes without
this seat re-grading it. Three of this seat's five asks to the engineer
seat are now applied, all within a day of being written.

### 17. The vendored standard's enforced-rule list is short two rules, and the authority is at HQ (I19)

**Who.** `alexandra-systems/exo-centralizer`, by handoff. Section 15
of `docs/standards/pm.md` is vendored here and arrives by sync; this
seat does not edit it, the same rule that governs
`docs/standards/lessons.md`. The second half is whoever owns
`runtime/board/store.py`.

**Why.** The paragraph in question exists to spare a seat the cost of
learning a store rule by being refused, and two refusals tonight were
on rules it does not contain (I19). One of the two is confirmable from
the vendored file at no cost: the accepted reason words are printed
there and a bare `so` is absent from them, one character from `so
that`, which is on the list. The other is confirmable only by paying
for it again, and L15 forbids that, so the engineer seat's quoted `400`
body is the evidence this entry carries.

**Paste, half one: two sentences into section 15's enforced-rules
paragraph**, after "And **no codes in the prose**: a pull request
number, an `ADR-`, a lesson or incident code goes in `data`.":

> A **`data` field named `files` must be a list of paths**, because the
> seat's work timeline draws one entry per path and a count is not one;
> the refusal names `files_count` as the field a count belongs under.
> And the accepted reason words are the exact strings above: a bare
> **`so`** is not one of them even though **`so that`** is, which is
> one character between a message and a refusal, and the rule binds a
> `note` exactly as it binds a `done`.

**Paste, half two: the provenance stamp the list needs in order to stay
checkable** (L23), replacing "The authority is `runtime/board/store.py`,
`prose_violation` and `conversation_violation`; this paragraph was
written by reading them, not by inferring them from refusals.":

> The authority is `runtime/board/store.py`, `prose_violation` and
> `conversation_violation`. **This list was read from that file at
> `<revision>` on `<date>`, and it is a claim about that moment rather
> than a property of the store**, because a list that merely says it
> was derived by reading the source stops being load-bearing the day
> the source changes and a reader cannot tell the difference. A seat
> refused on a rule that is not here should treat the omission as the
> defect and say so upward, rather than assume it misread the list.

**Half three, and it is the only one that reduces the cost to zero: a
dry-run route on the store.** A validate route taking the same body and
writing nothing, answering the same refusals. The store is the one
write surface in this company with no dry run and no delete, so every
rule it does not document is learned in public and permanently, in
somebody else's inbox. This is not this repository's to build, and a
local copy of the validator is worse than none in the long run because
it drifts from the store the day the store changes (L-A35). The
engineer seat has filed the local advisory version as an idea in
`docs/ideas.md`; this seat's position, recorded there and here, is that
it is worth having only if its own output says it is advisory and names
the rules it could not check.

**Verification.** Section 15 of a re-vendored `docs/standards/pm.md`
carrying six rules and a revision stamp, or a validate route a seat can
call. Not a copy of the rules in this repository, and not this entry
being read.

**Update 2026-10-25 (hook run): a third missing rule, learned in public
exactly as this entry predicts, and here is its verbatim text.** This
run's first post to the engineer seat was refused:

> `prose must be scannable: one thought per line, a blank line between
> thoughts; a block over 420 characters is not`

The body it refused had one sentence per line with no blank lines
between them — which satisfies the rule section 15 **does** document,
one whole sentence per line, and violates a blank-line and 420-character
rule it does not. So the count in this entry's title moves from two to
**three**, and the pattern it names is now measured rather than
argued: a seat that reads the vendored list, writes to it exactly, and
is refused anyway. Add to the paste's rule list:

> Blocks are separated by a blank line and no single block exceeds 420
> characters. One sentence per line satisfies the sentence rule and not
> this one; a twelve-sentence body with no blank lines is one block and
> is refused.

The cost this time was one wasted call and no inbox pollution, because
the refusal arrived before delivery and the retry was addressed to the
same seat. That is the cheap version. The expensive version is L15's,
and the reason it was cheap is that the probe was already paid for by
an earlier run.

### 18. The runtime knows which seat is standing in which branch, and nothing writes it down

**Who.** Whoever owns the resident runtime. The same hand as entry 10,
and deliberately a different entry — the ruling at the end of this one
is why it is numbered 18, because an engineer seat asked this seat to
choose and that is the choice.

**Why.** The stranded-draft check has three readings and none of them
answers the question it exists to ask. `run=self` vouches for exactly
one draft, the caller's. `run=live` reads any Actions run on the
branch, which on this surface means this repository's own `tests`
workflow and never a seat (entry 15), so it flickers on CI timing.
`run=fresh` is a bound on time rather than a reading of a run: it
excuses a draft a dead run really did abandon four minutes before
teardown, and it excuses nothing at all once an hour has passed under a
run that is still working. Measured live at 22:33Z on 2026-10-24: a pm
draft printed `STRANDED ... run=none` while a pm run was writing into
it.

**The board cannot answer it, and that is measured rather than
assumed.** Three readings now agree — 22:08:03Z and 22:09Z by two
seats, and again at 22:52Z by this run. All 25 records carry an
`ended_at`, **none** is in progress, and `branch` is **null on all
25**. A run reaches the board when it *ends*, so the board is blind for
exactly the window this reading would cover, and even for the runs it
does hold there is no field to join a draft to.

**The one surface that knows is the one that starts the runs.** Every
seat run in this product is a host window on the resident runtime: the
runtime chooses the branch name, hands it to the seat in the wake, and
tears the window down. It holds the fact for the whole of the interval
in which nothing else can.

**The ask: one file, written at dispatch and cleared at teardown.** Not
an API and not a second service that has to be watching — the file is
the contract, which is the shape L12 asked for after the
Actions-dependent exclusion failed.

```
# $ASC_LIVE_RUNS — one line per seat run currently in flight.
# Appended by the runtime at dispatch, the line removed at teardown.
# TSV, because every consumer here is a POSIX shell check with no npm
# dependencies, which is this repository's stated ethos.
#
# started_at           company  seat      branch                                 run_id
2026-10-24T22:25:23Z   atelier  exo       atelier-exo/2026-10-24-message-5       0f3c...
2026-10-24T22:16:43Z   atelier  engineer  atelier-engineer/2026-10-24-message-5  7b91...
```

**Three conditions on it, each of them a defect this register already
paid for.**

1. **The path arrives in the seat's environment**, exported the way
   `BOARD_API_URL` and `BOARD_RUNTIME_TOKEN` already are, under a name
   like `ASC_LIVE_RUNS`. A memoryless run cannot find a file whose
   location lives only in a document, and this register's whole
   argument for `tools/` is that a rule enforced at the reliability of
   reading is not enforced (L-A22).
2. **A crashed run must not vouch forever.** A line left behind by a
   window that died is a dead run claiming to be live, which is worse
   than the defect this fixes because it makes the loud verdict
   unreachable. The line carries `started_at` for that reason and the
   reader applies its own ceiling to it — which is exactly what
   `--fresh-under` already is, so the two readings compose rather than
   compete: `run=runtime` inside the bound, nothing outside it.
3. **It prints as its own word.** `run=runtime`, never folded into
   `live`, because a verdict names the reading it came from (L-E11) and
   this is stronger evidence than `fresh` and weaker than `self`.

**The same pre-run hook that entry 10 already waits on.** Entry 10 asks
the runtime to capture `base_before=$(git ls-remote --heads origin main
| cut -f1)` before dispatching the seat. This entry asks for one append
in the same place and one removal after the teardown. Whoever opens
that file to do either should do both in one pass.

**Why this is its own entry and not a third bullet in entry 10 — the
judgement an engineer seat handed this seat tonight, and the reason.**
That seat put both answers honestly: folding in means one handoff
instead of two, and standing alone means two asks nobody has to accept
together. Standing alone, for three reasons, in order of weight.

The first is measured. Entry 10's second half has now been found
untouched on three separate readings, the latest in a window entirely
later than the one before it — 0 of 25 board run reports carry a ship
verdict, and the report template has no slot for one. An ask folded
into an entry that has already failed to be applied three times
inherits that entry's stall, and the holder of the runtime would have
to accept the expensive half in order to accept the cheap one.

The second is about closing. An entry is closed when its fix is in the
tree, and these two have different tests: entry 10's is a run report
carrying a ship verdict, this one's is a file on disk that
`check-draft-prs.sh` can read. One entry with two tests cannot be
closed, only half-closed, which is the state entry 10 is in right now
and the reason it is the largest open thing in this section.

The third is the engineer seat's own, and it would settle the question
alone: someone could decline these separately, and a merged ask takes
the other down with it when they do.

**What the saving was for is preserved without the bundling.** The two
entries name the same pre-run hook, in both directions, so a reader who
opens either is told the other is in the same edit. A cross-reference
buys the one handoff; a merge buys the handoff and sells the ability to
say no to half of it.

**Verification.** `bash tools/check-draft-prs.sh --all` printing
`run=runtime` for a draft whose seat is mid-run and `run=none` for the
same branch after that run ends, with the file read from
`$ASC_LIVE_RUNS` and no network call involved. Until the file exists,
`run=fresh` is the honest ceiling and the threshold stays a number
anyone can retune from evidence, which is the state this entry leaves
the tool in rather than pretending otherwise.

**Update 2026-10-25 (message run): this entry's premise now has live
evidence instead of a reconstruction.** Taken at 03:12Z with an
engineer run in flight:

```
$ bash tools/check-draft-prs.sh --all --fresh-under 0
STRANDED  #72 atelier-engineer/2026-10-25-message idle=10m commits=1 files=0 carries=nothing run=none
LIVE      #71 atelier-exo/2026-10-25-message       idle=1m  commits=8 files=3 carries=work    run=self
check-draft-prs: 1 of 2 draft(s) in scope are stranded (0 out of scope, freshness guard off) …
exit 1
```

`#72` was a live run ten minutes old. The default sweep classes it
correctly as `FRESH … run=fresh`; the guard-off sweep — the one a
merger clearing a queue is told to run — says to close it, and the
field that should have stopped that is `run`, which reads `none`.
Four runs of this register have described this case from fixtures and
from reasoning; this is the first time it has been printed by the live
tool against a real colleague's real run, and it is the strongest
argument the entry has. **Nothing else about the entry changes**, and
the `run=runtime` reading above is still the fix.

### 19. `carries=work` cannot see that a sibling pull request carries the same work (I20)

**Who.** The engineer seat. `tools/` and `tests/` are that seat's lane.
One clause, one helper, two tests.

**Why.** By this tool's own README, `carries` exists so a merger can
tell whether closing a draft throws away a measurement, and
`carries=nothing` is the single reading that tells a reader to close.
It is computed against the base and against nothing else, so it answers
"is this diff non-empty" when the question is "does this diff exist
anywhere a merger can already reach". Measured live at 02:23Z on
2026-10-25 against the first genuinely stranded draft this product has
produced:

```
STRANDED  #65 atelier-exo/2026-10-24-message-6 idle=3h commits=28 files=4 carries=work run=none
```

`#65`'s tree is byte-identical to PR #62's, which was open and ready at
the time of the reading — `git diff --stat
origin/atelier-exo/2026-10-24-message-5
origin/atelier-exo/2026-10-24-message-6` is empty. Closing `#65` cost
nothing, and the field a merger reads before closing said it would cost
work.

**The asymmetry runs the other way from I17's.** A wrong
`carries=nothing` closes live work once, loudly, and a colleague
notices within the hour — that is I17, and it was fixed in a day. A
wrong `carries=work` leaves a dead duplicate open forever, quietly, and
the only evidence it was wrong is a `git diff --stat` nobody is told to
run. This section exists because quiet defects are the ones that
survive.

**The paste.** In `tools/check-draft-prs.sh`, where `carries` is
assigned, after the existing work/nothing decision:

```sh
# carries=duplicate: this draft's head is already contained in another
# open pull request, so closing it loses nothing a merger cannot reach.
# Measured against heads, not diffs: containment is the question, and
# `git merge-base --is-ancestor` answers it without fetching a tree.
dup_pr=""
if [ "$carries" = "work" ]; then
  while IFS=$'\t' read -r other_num other_head; do
    [ "$other_num" = "$pr_num" ] && continue
    git rev-parse --verify --quiet "origin/$other_head" >/dev/null || continue
    if git merge-base --is-ancestor "origin/$head_ref" "origin/$other_head" 2>/dev/null; then
      dup_pr="$other_num"
      break
    fi
  done <<EOF
$open_pr_heads
EOF
fi
[ -n "$dup_pr" ] && carries="duplicate #$dup_pr"
```

`$open_pr_heads` is one `gh pr list --state open --json
number,headRefName --jq '.[] | [.number, .headRefName] | @tsv'` taken
once per invocation, the same shape the check already uses to enumerate
drafts. The pair count on this product has never exceeded single
digits, so the loop is bounded by the queue and not by history.

**It prints as its own word, never folded into `nothing`** (L-E11, and
the reason the engineer seat's `run=self` was right). `nothing` means
the diff is empty; `duplicate #62` means the diff is non-empty and
reachable elsewhere. A reader deciding whether to close needs to know
which, and `duplicate` additionally names the pull request to merge
instead — which is the action, where `nothing` only licenses an
inaction.

**The two tests it owes.** Both are fixtures; neither needs the forge.

- two open drafts where one branch is an ancestor of the other,
  asserting the ancestor prints `carries=duplicate #<n>` and the
  descendant still prints `carries=work`;
- two open drafts with unrelated heads, asserting neither prints
  `duplicate` — because a containment check that fires on everything is
  the same defect as one that fires on nothing, and the eleven fixtures
  behind entry 14 all passed for three runs while the clause they
  covered was wrong.

**Verification.** Run the check with a draft whose head is an ancestor
of another open pull request's head and read the ancestor's `carries`
field. This run supplies the pair: `#65` is an ancestor of `#68`. If a
merger clears the queue first, the fixtures are the standing case.

**Update 2026-10-25 (message run): unapplied, and the verification
pair this entry named is gone.** `grep -n duplicate
tools/check-draft-prs.sh` returns nothing and `tests/fixtures/draft-prs/`
does not exist. The entry had offered `#65` as an ancestor of `#68` for
a live check; `#65` is closed, so **the fixtures are now the only
case** and the negative one is the one that matters. Recorded as young
rather than stale: the engineer seat has had exactly one wake since
this was written and spent it on a merge-order tool. If it is still
unapplied after three wakes, the thing to write about is the routing
and not the fixture.

### 20. The board has a `refusal` column and it was null on a proven refusal (I21)

**Who.** Whoever holds the resident runtime — the same hand as entries
10, 11 and 18. Nothing in this repository can reach it.

**Why.** This run was woken with a sentence only the runtime could have
written: *"capacity returned: the provider limit that refused your last
run has reset."* The runtime therefore knows which run it refused and
why. `GET /api/board/atelier` at 02:24Z, 25 records spanning
2026-10-24T21:20:10.905Z to 23:22:07.580Z, carries `refusal` **non-null
on 0 of 25** — including the record of that very run: `seat: exo,
started_at: 2026-10-24T23:22:03.476Z, turns: 1, exit: 1, pr_url: null,
refusal: null`. Its `report` is a paragraph about where a pull request
was looked for and says nothing about the refusal that made looking
pointless.

Three records in the window carry the signature — one turn, zero
minutes, exit 1, no pull request — within ten seconds of each other
(pm 23:21:58, exo 23:22:03, pm 23:22:07), and all three are null.

**This contradicts a reading this register closed one run ago**, which
is why the entry exists rather than a line. The run of 2026-10-24
(message run 5) measured four refusals at 18:25 all carrying `refusal:
"You've hit your session limit · resets 9:20pm (UTC)"` and concluded
"the field already exists and the board already serves it: no fix
here". Either the field is written for one class of refusal and not
another, or it stopped being written five hours later. The ask is the
same under both readings.

**What the gap costs, measured.** The pm seat broadcast the same triage
four times in one evening — 22:11:17Z, 22:12:55Z, 22:13:20Z, 22:18:50Z,
all variants of *"today's refusals are capacity, not a defect"* — a
seat re-deriving from turn counts a fact the runtime already held. And
`exit: 1` alone is carried here by a run that never started and by two
runs that worked eleven and ten minutes and left PRs #65 and #66, so
any reader grading seats by exit status scores them the same.

**The ask, in two parts, the first of which is one assignment.**

1. **Write the refusal text into the column that exists.** Whatever
   string the wake composes — the one this run was handed — belongs in
   `refusal` on the run record, for every refusal and not only for the
   session-limit class. One field, already in the schema, already
   served by the route, already read by at least two seats.
2. **Name it in the `report` sentence.** The report is what a seat
   actually reads; today it describes a pull-request search. One
   clause: `… It exited 1 (refused: <refusal>).` A reader who sees
   `turns: 1` and no reason has to guess, and this register's standing
   law is that a run is judged by its artifacts.

**Verification.** The next refusal of any seat in this company carries
a non-null `refusal` on its board record, and the `report` for that
record names it. Until then this entry is the standing answer to "is
this exit 1 a defect?", and the answer is: the board cannot tell you,
read `turns` and `ended_at - started_at`.

### 21. Every check should print the status it is about to return (L26, and the README's own warning)

**Who.** The engineer seat. Three summary lines across the three tools
in `tools/`, plus the README paragraph this replaces.

**Why.** `tools/README.md` warns, correctly: "Read the status, never a
pipe's: `npm run drafts | tail` reports the tail's 0 whatever the check
found, so pipe either command and you want `${PIPESTATUS[0]}`." This
run read that paragraph and then, four commands later, ran `bash
tools/check-seat-surface.sh --all | head` and recorded `exit=0`,
concluding that the tool accepts an undeclared flag and exits clean.
Without the pipe it exits **2**, exactly as the README's table says. The
tool was right; the measurement was wrong; the warning that would have
prevented it had been read minutes earlier by the same run.

That is the shape this register keeps finding: a correctness property
enforced only by a paragraph a memoryless reader has to recall is not
enforced (L-A22, and the whole argument for `tools/` existing). The
warning is not wrong, it is in the wrong place.

**The paste.** Append the status to each summary line, in parentheses,
as the last thing on it.

```
check-draft-prs: 1 of 3 draft(s) in scope are stranded (0 out of scope, 1 too fresh to judge (under 60m)) — ready them, close them, or name the clause that keeps them drafts (L-A32). (exit 1)
check-seat-surface: 3 of 3 seat(s) run somewhere company.yaml does not name — an edit to the declared workflow reaches nothing (L-A16). 0 unclear. (exit 1)
check-shipped: the remote holds atelier-exo/… but not this run's HEAD, so every commit above the remote tip dies with the sandbox. Push again. (exit 1)
```

Mechanically it is one variable: each tool already computes its exit
code before printing its summary, so the summary interpolates it rather
than a second decision being made. The argument-error paths exit 2
before any summary and should gain the same suffix on their one-line
error, which is the case that misled this run:
`check-seat-surface: unknown argument: --all (exit 2)`.

**Why this is the fix and not "read more carefully".** A piped read is
the normal way a seat captures output it wants to quote in a register —
this run piped because it wanted the first twenty lines — and the
status is the one thing a pipe destroys. Printing it in the text makes
the quoted output self-describing: a register entry that pastes a
summary line then carries the verdict with it, and a future reader
cannot quote the finding and lose the status, which has now happened
once in this file's own evidence.

**Keep the README warning**, reworded to point at the printed status
rather than at `${PIPESTATUS[0]}` alone: the suffix is a convenience,
the exit status is still the contract, and a tool whose text and status
disagreed would be worse than either.

**Verification.** `bash tools/check-draft-prs.sh --all | tail -1` and
read the verdict out of the line, with no access to `$?`. Today that
is impossible; it is the whole point.

### 22. The clone the runtime hands out makes `--force-with-lease` refuse instead of protect (I25)

**Who.** Whoever holds the resident runtime — the fifth entry
addressed to that hand, and **L32 says to write down that the first
four never moved before adding a fifth, so: entries 10, 11, 18 and 20
have never moved, and this entry is filed knowing that.** It is filed
anyway for two reasons. It is one line of configuration rather than a
feature, and unlike the other four it has a seat-side workaround that
is already in the tree (L30), so nothing is blocked on it — only made
sharper-edged than it needs to be.

**Why.** Measured on this run's own first push, three commands:

```
$ git push --force-with-lease origin atelier-exo/2026-10-25-message
 ! [rejected]  atelier-exo/2026-10-25-message -> ... (stale info)

$ git fetch origin atelier-exo/2026-10-25-message   # succeeds, writes FETCH_HEAD only
$ git push --force-with-lease origin atelier-exo/2026-10-25-message
 ! [rejected]  atelier-exo/2026-10-25-message -> ... (stale info)

$ git config --get remote.origin.fetch
+refs/heads/main:refs/remotes/origin/main
```

The refspec is mainline-only, so `refs/remotes/origin/<branch>` exists
for `main` and for nothing else, and the bare lease form has no ref to
lease against. It does not fall back to a safe default; it refuses the
push. The seat is then one search away from plain `--force`, which is
precisely the thing the lease exists to prevent — a safety flag whose
failure mode teaches you to remove it.

Every seat in this company works on this clone shape. It is the same
narrow refspec the engineer seat used to reproduce I16 ("a clone
shaped the way the runtime hands one out"), so this is the standard
checkout and not an accident of one run.

**The paste.** One line, wherever the runtime clones a product repo
for a seat run. Either form works:

```sh
# at clone time
git clone --filter=blob:none <url> <dir>            # keep whatever flags exist
git -C <dir> config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'

# or, equivalently, on an existing checkout before handing it to the seat
git config --replace-all remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
git fetch origin
```

There is no cost at fetch time: nothing fetches more than it asks for,
the refspec only decides where a fetched ref is written.

**The seat-side form, which needs nobody** and is already L30: read
the remote tip explicitly and lease against it.

```sh
remote_tip=$(git ls-remote origin "refs/heads/$BRANCH" | cut -f1)
git push --force-with-lease="$BRANCH:$remote_tip" origin "$BRANCH"
```

**Verification.** `git config --get remote.origin.fetch` on a fresh
seat checkout returns `+refs/heads/*:refs/remotes/origin/*`, and
`git push --force-with-lease origin <branch>` after a rebase either
succeeds or is rejected **naming the ref it leased against** rather
than reporting `stale info`.

### 23. The vendored standard teaches a filter test that now fires on a working filter (I26)

**Who.** HQ's centralizer, `alexandra-systems`, `standards/pm.md` §15 —
the same hand as entry 17, and the second entry to it. This is the
authority copy; `docs/standards/pm.md` here is vendored and arrives by
sync PR, so this seat does not edit it (charter step 3).

**Why.** §15 currently teaches the diagnostic that caught the endpoint
ignoring its filters:

> Ursa's exo measured it: with no parameters the read returned 179
> messages, with the addressee set it returned 207, and with a sender
> that cannot exist it returned 179 again. A filter on an impossible
> value returning the unfiltered count is the proof that nothing
> filtered.

Run against the live store at 02:49Z on 2026-10-25, the addressee half
of that test now produces a false alarm, because broadcasts are
unioned into every `to_seat` read by default:

| query | rows | `saturated` |
|---|---|---|
| `limit=400` | 400 | **true** |
| `to_seat=zzzznotaseat&limit=400` | **287** | false |
| `to_seat=zzzznotaseat&everyone=0&limit=400` | **0** | false |
| `to_seat=owner&limit=400` | 366 | false |
| `to_seat=owner&everyone=0&limit=400` | **79** | false |
| `to_seat=exo&to_company=atelier&limit=400` | 321 | false |
| `to_seat=exo&to_company=atelier&everyone=0&limit=400` | **34** | false |
| `from_seat=zzzznotaseat&limit=400` | 0 | false |

A seat that cannot exist has 287 messages and the filter is exact. The
`from_seat` half still behaves as the standard describes, because
there is no broadcast analogue on the sender side — which is why the
defect stays invisible until someone runs the addressee half, and why
the paragraph reads as correct.

**What the gap costs, in this register's own numbers.** Every count of
the owner's queue published here is the `everyone=0` figure, and the
raw one is four and a half times larger — 366 against 79. One run ago
this register corrected "100 messages to the owner" to 77 by finding a
page cap; the same sentence carried a second error the page-cap
correction did not touch. A seat that publishes 366 is publishing the
portfolio's broadcast volume and calling it her queue depth.

**The paste.** Replace the last sentence of that passage and append
two:

```
A filter on an impossible value returning the *unfiltered* count is
the proof that nothing filtered — but take that comparison with
`everyone=0`, because broadcasts are unioned into every `to_seat`
read by default and an impossible seat will otherwise come back with
every broadcast in the store. Measured 2026-10-25 against the live
store: `to_seat=<impossible>` returns 287 rows and
`to_seat=<impossible>&everyone=0` returns 0, which is the filter
working. **Every count taken from this route carries `everyone=0`**,
and a count without it is a count of broadcast volume with a few
addressed messages in it: `to_seat=owner` returns 366 where the
number that means anything is 79.
```

**Verification.** A sync PR lands the amended §15 in this repository's
`docs/standards/pm.md`, and the next seat here that publishes a
message count says whether it carried `everyone=0`. Until then, L31 is
the local rule and this register states the parameter beside every
number it takes from that route.

### 24. The charter clause for a run that wakes because capacity returned (I22, L25)

**Who.** The owner. Charter edits merge only by her hand, which is why
this is a paste in this file and not a diff against
`prompts/exo-agent.md`. Keeping it out of the diff also keeps this
seat's weekly pull request docs-only and mergeable by a seat, so the
register does not sit behind a decision.

**Why this entry exists at all, and it is an admission.** I22 was
written during the hook run of 2026-10-25 and its own text says the
clause is "carried in entry 21 of `docs/agents/pending.md` with the
exact text". It was not. Entry 21 is about printing exit statuses, and
`grep -n "woken because capacity" docs/agents/pending.md` returned
nothing until this entry. The incident recorded a routing that did not
happen, which is the exact failure mode this register keeps naming in
other people's work: an incident is closed when the fix is in the
tree, and a fix routed to an entry number that does not hold it is not
routed. Found by the next run reading its own predecessor's
cross-references, and it is the cheapest audit in this file.

**Why the clause.** One capacity wall at 23:22Z on 2026-10-24 cut two
seats and refused three wakes at one turn each. The engineer seat
resumed onto its own branch and its own pull request and finished the
work. This seat was dispatched onto a new branch, obeyed the
one-pull-request rule as written, and left `#65` behind — a draft
whose tree was byte-identical to an open, ready sibling, idle three
hours, the first genuinely stranded draft on this product's record.
Both seats obeyed correctly. The charter says "One PR per run on
branch `exo/YYYY-MM-DD`, draft-first" and says nothing about a run
that is the second half of a cut one; read literally a resumed run is
a new run and owes a new branch, and read by intent one wake's work
should land once.

**The paste.** Add to `prompts/exo-agent.md` under **Boundaries**,
after the sentence beginning "One PR per run":

```
A run woken because capacity returned continues the refused run's
branch and pull request rather than opening its own. The refused run
left a draft; finishing it is this run's one pull request, and the
one-per-run rule is satisfied by the pull request that already
exists. If the branch cannot be reused — a name the dispatch fixed, a
push that is refused — the new run's first act is to close the
refused run's draft with a one-line reason naming the pull request
that replaces it, so no stranded draft outlives the wake that made
it.
```

The same three sentences apply verbatim to `prompts/pm-agent.md` and
`prompts/engineer-agent.md`, which carry the same one-pull-request
rule and the same silence about resumption; the engineer seat reached
the right answer without the clause, so for that charter it is a
confirmation rather than a change.

**The half that needs nobody is already honoured.** The second
sentence — close the refused draft first — was carried out by the hook
run of 2026-10-25 against `#65`, and it is L25 in
`docs/agents/lessons.md`, `portable: yes`. So the cost of this entry
sitting unmerged is bounded: a future cut run will still be told by
the lessons register to clean up after itself, it just will not be
told by its charter.

**Verification.** The next run of any seat here that is woken with a
capacity-returned message either continues the refused run's pull
request, or closes the refused draft in its first act and says so. If
a third stranded draft appears after a capacity wall, the clause is
needed and unmerged, and that is the sentence to put in front of the
owner rather than this one.
