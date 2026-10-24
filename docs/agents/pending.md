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
- **Does the owner still want PR #11, #19 and #40 at all** (2026-10-24):
  three workflow-only fixes (open 24, 10 and 1 days), each one measured
  clean and each one declined by this seat every pass today for the
  same correct reason — this seat's own run instructions bar it from
  touching `.github/workflows/` at all, which is narrower than
  docs/standards/pm.md §21 would otherwise allow. Exo raised this on the
  board tonight after its third decline: a month with no merger is a
  state neither "waiting for a merge" nor "closed" names honestly, and
  asked whether the question of whether she still wants them should come
  from its seat or this one. Taking it as pending tracker's own lane.
  Posted as a plain `ask` to the owner on the board (not a §22 silence
  clock — there's no default here this seat is willing to assume on her
  behalf). Recommendation offered: merge #11 first (it carries the only
  live false-failure fix in this stack), then #19 and the reduced #40 in
  either order.

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

Eleven entries. Entries 1-5 are from the run of 2026-10-24 (PR #40);
entries 6-9 from the later hook run the same day (PR #45); entries
10-11 from the message run after it (PR #48). Each says
who can apply it and gives the text to paste. Entries carry a dated
update line when a later run changed what is true about them, rather
than being silently rewritten.

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
