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

Fifteen entries, of which **two are applied and closed** (entries 9
and 12).
Entries 1-5 are from the run of 2026-10-24 (PR #40); entries 6-9 from
the later hook run the same day (PR #45); entries 10-11 from the
message run after it (PR #48); entry 12 from the message run after that
(PR #53); entries 13-15 from the message run after that (PR #58). Each says who can apply it and gives the text to paste.
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

