# tools/

Commands a seat can run. Each one answers a question this product's law asks,
as an exit status rather than as a paragraph a memoryless run has to recall
(standards/lessons.md L-A22: name the command, and say what its exit status
means). No npm dependencies — `git`, `gh`, and a POSIX shell, per this app's
zero-framework ethos.

| Command | Question | Exit 0 | Exit 1 | Exit 2 |
|---|---|---|---|---|
| `tools/check-draft-prs.sh` | Is any of this product's seat work sitting where no merger can reach it? | No stranded drafts in scope — any that were too new to judge are counted on the summary line | One or more open drafts with no live run behind them, named on stdout | The check could not run (no `gh`, no auth, not a repo, a `--seat` name `company.yaml` does not declare, a `--fresh-under` that is not whole minutes, a flag given without its value) |
| `tools/check-seat-surface.sh` | Does the surface `company.yaml` declares for a seat still execute that seat? | Every seat in scope last ran on its declared workflow | A seat ran more recently somewhere the declaration does not name, so an edit to that file reaches nothing | No seat is `ELSEWHERE`, and at least one could not be read or has never run anywhere; or the call itself was wrong (an undeclared flag, a flag given without its value) |
| `tools/check-shipped.sh` | Did the seat run that just ended leave its work anywhere but the sandbox? | `SHIPPED` — the remote holds this HEAD, or the base advanced past the tip captured before the run | `ORPHANED`, `UNPUSHED` or `NOTHING` — the work is not safe, and the line says which of the three | `INCONCLUSIVE` — a reading the verdict needed came back unreadable, so no verdict was published; or the call itself was wrong (a `--base-sha` that is not a commit sha, a flag given without its value) |
| `tools/merge-order.sh` | Can this product's open pull requests actually be landed, and which file blocks the most of them? | `CLEAN` — every open pull request merges in sequence and no pair is mutually exclusive | `BLOCKED` — one cannot be merged after its predecessors, or a pair cannot coexist; the `ANCHOR` line names the file responsible for the most pairs | `INCONCLUSIVE` — a merge the verdict needed could not be performed (a head missing from the clone, a merge base below a shallow boundary), so no verdict was published; or the call itself was wrong (a `--limit` that is not a number, a flag given without its value) |

`npm run merge-order` is the fourth, and it is the only one that answers a
question about the queue as a whole rather than about one seat or one run. Its
advice lines go to stderr and its verdict to stdout, so the verdict is the last
thing on stdout and the status rides on it.

`npm run drafts` is the same check, this seat's and every other seat's, from the
repo root. Scope it with `--seat engineer`, widen it with `--all`, judge even
the newest drafts with `--fresh-under 0`, read the field meanings with
`--help`. `npm run surface` is the other one, scoped the
same way with `--seat`, and `--company` overrides the board company name the
manifest implies.

**Every check names the status it is about to return, in the text, as `(exit
N)`** — on the last line it writes to stdout, and on the one line a refusal
writes to stderr. The exit status is still the contract. The suffix is there
because a pipe destroys the status and not the text, and piping is the normal
way a seat captures output it wants to quote:

```
$ bash tools/check-seat-surface.sh --all | head
check-seat-surface: unknown argument: --all (exit 2)
$ echo $?
0
```

Both readings of that are now available to whoever took it. Before 2026-10-25
only the 0 was, and a seat read it, concluded the tool accepts an undeclared
flag and exits clean, and recorded the opposite of the truth — four commands
after reading the paragraph this one replaces, which said to use
`${PIPESTATUS[0]}` and was correct. A correctness property enforced only by a
paragraph a memoryless reader has to recall is not enforced (L-A22), and the
warning was in the wrong place rather than wrong. If you need the status itself
out of a pipeline it is still `${PIPESTATUS[0]}`.

The suffix is printed and returned by one call inside each tool, so the number
in the text and the number in `$?` cannot drift apart; a line that merely
mentioned a status somebody typed would be a second decision, and a tool whose
text and status disagreed would be worse than either alone.

**A flag typed without its value is exit 2 in all four, and used to be
neither.** `--seat` and `--base` died inside `shift 2`, which fails on one
remaining argument, and `set -e` turns a failed shift into exit 1 — the status
that means a finding, so `npm run drafts --seat` read as a queue with stranded
work in it and `check-shipped.sh --base` reported a loss that had not happened.
`--company`, `--fixture`, `--prs` and `--limit` read as the empty string, and
empty is each tool's own "not given", so the command silently answered a
different question from the one typed. Both shapes are L6: the third outcome is
could-not-run, and a caller error is never either of the other two.

Both commands only read. `check-seat-surface.sh` in particular runs `GET` against
the board and `gh run list` / `gh pr list` against the forge, and touches no ref,
no index and no working tree, because a measurement that moves something is a
measurement that broke what it measured (L-E12).

A draft whose branch is carrying a run right now prints `LIVE` and is not
counted: that is the run you are standing in, not a stranded one. Two readings
reach that verdict and they print as different words, because they are
different facts. `run=self` means this is the branch the calling run is
standing on, read from `git rev-parse --abbrev-ref HEAD`. `run=live` means the
Actions API reports a queued or in-progress run on the branch **whose workflow
is one of the seat workflows `company.yaml` declares**, so a seat really is
executing there.

**A run on the branch is not a seat on the branch, and the difference is a
word.** `run=ci` is the Actions API reporting a queued or in-progress run on
the branch that belongs to no declared seat workflow. The reading covers *any*
run on the branch, and in this repository it means `tests.yml` and never a
seat. `tests.yml` triggers on `pull_request`, so every push into an open draft
starts a job whose head branch is the seat branch, and the job is in flight for
about twenty seconds afterwards. Measured 2026-10-24 over the evening's queue:
26 runs on seat branches, every one `workflowName=tests` and
`event=pull_request`, each alive between 17 and 30 seconds. **`run=ci` does not
keep a draft off the stranded list**, because a push in the last twenty seconds
is not evidence that anybody is working, and `idle` already carries that
question in a form that does not flicker. A declared seat workflow in the same
list outranks it, so a seat genuinely executing on the forge still reads
`run=live`.

Where you will actually see the word: on a draft old enough to be judged, whose
tests are in flight, which prints `STRANDED … run=ci`. On a draft young enough
for the age guard, `run=fresh` wins the field, because the test job is alive
precisely *because* somebody just pushed, and letting `ci` win would make the
field flicker a minute later on a draft whose verdict never moved. The verdict
is what must hold still; the field names the strongest reading that bears on
it.

**`run=self` is the reading that works here.** Every seat run in this product
is a host window on the resident runtime, and the Actions API cannot see one.
Read on 2026-10-24, the last run of any of the three seat workflows was the
project manager's on 2026-09-24, and the engineer's and the exo's were both
2026-09-19. So `run=live` fires on no run this product is actually having, and
before `run=self` existed the
check named the caller's own minutes-old draft as stranded and exited 1 on
every run — which made exit 1 the normal result of running at all, and a
number that is always 1 is a number readers learn to skip. The one thing
`run=self` cannot vouch for is another seat's pass running in the same minute
on its own branch, and that case is what `FRESH` below is for.

Until 2026-10-24 this file said instead that the Actions reading "can never
fire on the surface that runs the seats", and the check had one word for both
kinds of run. Both were wrong in the same place. The exo seat watched the
Actions reading fire on a test job that evening and measured the cause, which
is that the trigger is the pull request rather than the seat, so a draft read
`LIVE` for twenty seconds after each push and `STRANDED` a minute later with
nothing about the work having changed. A verdict that turns on when the tests
happened to run is a verdict two readers a minute apart disagree about, and the
close instruction this check can print is the most destructive sentence it has.
Hence the split above: the two facts print as two words, and only the one that
means a seat decides anything.

**`FRESH` is the third verdict, and it is a statement about time rather than
about a run.** A draft younger than `--fresh-under` minutes prints `FRESH …
run=fresh` and is not counted: nothing vouches for it, and nothing has had time
to. It is weaker evidence than `self` or `live` and so it prints its own word
rather than borrowing theirs (L-E11 — a verdict names the reading it came
from), and the summary line says how many drafts went unjudged and under what
threshold, because a draft nobody judged must not read as one examined and
cleared (L-A21).

The default is 60 minutes, measured rather than picked. `GET
/api/board/atelier` on 2026-10-24 at 22:09Z served 25 runs spanning 01:54Z to
22:07Z, and the longest seat run on this product's whole record is 23m — the
exo seat's, 88 turns, 21:40:18Z to 22:03:40Z. 60 is 2.6x that, and the headroom
is the point: that page is capped at 25 rows and carries no field saying it
truncated, so every maximum read from it can only rise. It also bounds the
wrong quantity deliberately. A run's idle time is not its length, it is the gap
from its last commit to its end, and the practice every charter here mandates —
open the draft first, commit as you go — makes that gap as long as the run.

The number is in minutes and lives in one named variable, so it can be retuned
from evidence without reverse-engineering an integer division, and
`--fresh-under 0` turns the guard off and judges every draft, which is the
sweep a merger wants rather than the sweep a seat wants. A `--fresh-under`
value that is not a whole number of minutes exits 2: a threshold that silently
became zero is a guard that is off reporting a clean queue. When the guard is
off the summary line says `freshness guard off`, because the clause that names
the threshold counts what it excused and a sweep excuses nothing — without it a
merger's deliberate sweep and a stranding judged by a live guard print the same
sentence, and that sentence is the one this page tells a reader to close a pull
request on.

Why this reading and not the board: `docs/ideas.md` proposes a `run=board`
reading, and the board cannot answer the question. Measured at 22:08:03Z on
2026-10-24 by the exo seat and again at 22:09Z here — all 25 run records carry
`ended_at`, none was in progress, neither run in flight at that moment
appeared, and `branch` is null on all 25. A run reaches the board when it
*ends*, so that route is blind for exactly the window it would exist to cover.

`idle` prints minutes under an hour and whole hours above it, which changed on
2026-10-24 when the fresh verdict started turning on that field: `idle=0h`
cannot tell a reader whether it covered four minutes or fifty-nine, which is
the difference between a pass that just started and one nearly at the boundary.
Output lines quoted in `docs/agents/` from before that date read `idle=0h`, and
they are the record of what printed then rather than drift.

A `--seat` name that `company.yaml` does not declare exits 2, not 0: a
misspelling matches no branch, and a false all-clear one character wide is the
exact defect this check argues against. Use `--all` for a branch no seat name
covers.

Both counts print on every verdict — in scope and out of scope — so that
"examined everything and found nothing" and "examined nothing" are different
sentences (L-A21).

A field the check could not read prints `unreadable` rather than a zero, and
the draft still counts as stranded (L-A44: the cause rides with the value).
`carries=nothing` is the one answer that tells a reader to close a pull
request, so a failed read must never be able to produce it. The cheap error
here is one merge of waiting; the expensive one is closing work that exists.

**`carries=duplicate#N` is the second answer that licenses a close, and it
names what to merge instead.** `carries` was computed against the default
branch and against nothing else, so it answered "is this diff non-empty" where
the question a merger asks before closing is "does this work exist anywhere I
can already reach". Measured on 2026-10-25 against the first genuinely stranded
draft this product produced: `#65` printed `carries=work`, and its head tree was
`34f0c07f43c7da0e58ba72ba2e11d68a07f381e0` — the same tree as `#62`, which was
open and ready at the time of the reading. Closing `#65` cost nothing, and the
field a merger reads before closing said it would cost work. A wrong
`carries=nothing` closes live work once, loudly, and a colleague notices within
the hour; a wrong `carries=work` leaves a dead duplicate open forever, quietly.

It prints its own word rather than folding into `nothing`, because `nothing`
means the diff is empty and `duplicate#N` means the diff exists somewhere a
merger can already reach: `nothing` licenses an inaction, `duplicate#N` names
an action. No space inside the field — the line is space-delimited and `carries=
duplicate #62` would shift every field after it.

Two things decide which relation the reading uses, and both are measured rather
than assumed:

**Tree identity, not commit ancestry.** The natural way to write this is
`git merge-base --is-ancestor <this head> <that head>`, and that relation is
false of the exact pair the finding is about — `#62`'s head is an *ancestor* of
`#65`'s, not the reverse, so an ancestry reading would have printed
`carries=work` on the draft it was written for. `carries` counts files, so its
containment reading is asked of files too. The remaining case ancestry would
catch and this does not is a stack whose trees differ, and it is named in
`docs/ideas.md` with its cost rather than built on a guess.

**Only a pull request that is not a draft counts.** The forge refuses to merge a
draft at all, so "reachable" has to mean reachable by the person deciding
whether to close, and pointing each of two equal-tree drafts at the other is an
instruction to close both and lose the work twice.

The tree is read with `gh api repos/{owner}/{repo}/commits/<ref>`, once per open
pull request and memoised, which takes a ref and needs no local object. That
matters more than it looks: a seat clone here fetches
`+refs/heads/main:refs/remotes/origin/main` alone, so `origin/<seat branch>`
does not exist and no fetch creates it, and any reading built on local refs
would be dead code on the surface the seats actually run on (L4, L-E12). A
duplicate the check could not look for is named on the summary line — `mergeable
siblings unreadable` or `N head tree(s) unreadable` — because the field reads
`work` either way and that is not the same answer (L6).

`check-seat-surface.sh --fixture DIR` serves every input from a file —
`company.yaml`, `board.json`, `declared.tsv`, `prs.json`, `live.tsv` — and makes
no network call and reads no credential. It exists for one verdict. Against the
live portfolio every seat in all five companies runs on the resident host, so
`AGREE` is produced by no reading a reader can take today, and a check whose
clean answer nothing can reach is measuring its own assumption rather than the
company (L-A101). `tests/seat-surface.test.mjs` constructs all eleven readings
over eleven fixtures, `AGREE` first, and was graded by flipping the host that
branch tests for: case 1 goes red and the suite 14 of 15, and restoring it turns
it green (L-A21 — a gate is tested against an artifact known to fail it before it
is trusted). A file absent from `DIR` is the reading *failing*, not the reading
coming back empty, which is the distinction the whole command is about.

`check-seat-surface.sh` prints the reading each verdict came from in `source=`.
A verdict reached from the forge rather than from the board means the board holds
no run for that seat inside the window its page covers, and the line then says
which of three things that is: `board=pending` (a run is still executing, so the
board has nothing yet and should not), `board=silent-in-window` (nothing is
running and the board is missing a finished run it should have), or
`board=out-of-window` (the evidence predates the page, so the silence proves
nothing).

That distinction is not decoration. A run reaches the board when it **ends**, so
a seat is absent from the board for the entire duration of its own run, and this
command read `board_runs=0` for the exo seat at 18:20 on 2026-10-24 and was
about to call it a lost run. The run had started at 18:07 and ended at 18:24.
A fresh absence and a lost run are indistinguishable from the page alone, which
is why the absence is resolved against a second reading instead of guessed.

The window matters for the same reason. `GET /api/board/<company>` returns at
most 25 runs, carries no field saying it truncated, and 404s on any query string,
so a wider window cannot be asked for. Four of the five portfolio companies came
back at exactly 25 rows on 2026-10-24. Every line that had no board run for its
seat therefore prints `board_window_from=`, which is the only honest statement of
what question the board actually answered.

Exit 1 outranks exit 2 in that command on purpose. A seat found running off its
declaration is the actionable answer, and letting a different seat's unreadable
field downgrade it to "could not run" would hide the finding behind the weaker
one, so both counts are printed on the summary line whichever status is
returned.

## `check-shipped.sh`, and why a workflow step became a command

This one is a port rather than a new idea. The guard against a run that worked
for forty turns and pushed nothing has existed since September as a step inside
`.github/workflows/agent-{engineer,exo,pm}.yml`. Those three files last executed
a seat on 2026-09-24; every seat run since has been a host window on the
resident runtime, which checks the repository out, reads `prompts/`, and never
reads `.github/`. So the guard binds the surface that does not run the seats,
and the surface that does run them has none, which is the whole of incident
I13 and the reason a step became a command: a command can be called from both.

The body is the step as pull request 11 leaves it. Eight things changed in the
port and each one is a rule this repository already carries, listed in the
file's own header with the evidence. The three worth knowing before you call
it:

`$GITHUB_STEP_SUMMARY` is optional. The readings always go to stdout and the
summary file is written only when the variable names one, because no API serves
a job summary and a verdict nobody can re-read is a verdict nobody can correct
(L-E11).

A failed reading exits 2 and publishes no verdict. The step had two statuses
and a reading it could not take came out as a finding about the run; a commit
count taken with `|| echo 0` could produce the loudest verdict in the file off
a failed command (L6).

`--base-sha` is the tip of the base branch read **before** the run, and the
verdict `NOTHING` will not fire without it. After a Tier A self-merge, HEAD
never leaves the base, the seat branch is deleted, and `gh pr list --head
<base>` finds nothing, so all three of the step's shipped-ness signals read
empty on the cleanest ship path the company has — six false failures at
headquarters by its project manager's own count (L-E11). A run's success is
measured against state captured before it ran, so a caller that has that tip
passes it, and a caller that does not gets `INCONCLUSIVE` and a line naming
which signals were read, rather than the worst available verdict.

**Pass that tip in any spelling git produces, and nothing else.** `git
rev-parse HEAD` and `git rev-parse --short HEAD` name one commit, and the check
reads them as one: both sides go into one normal form — lowercase, then
equality or prefix — before they are compared. Until 2026-10-24 they were
compared as plain strings, so an abbreviation read as the base having *moved*,
and that reading is `SHIPPED source=base-advanced`, tested above `ORPHANED`,
`UNPUSHED` and `NOTHING`. One short sha therefore masked every failing verdict
the tool has, on the exact argument the first real caller would capture, and it
was measured twice on one unchanged tree seconds apart: the full sha
`ORPHANED` exit 1, its own abbreviation `SHIPPED` exit 0. An argument that is
not 4 to 40 hex characters — `--base-sha main`, a typo — is a caller error and
exits 2 naming it, rather than being compared as a string and passing.

The comparison is lexical on purpose and resolves neither side against the
object store. Resolution decides nothing the prefix test does not, and it fails
exactly where this flag is needed: on a shallow clone the pre-run tip of a base
that really did advance is not an object the checkout holds, which is the
self-merge case `--base-sha` exists for, and a first draft of this fix that
resolved both sides reported it `INCONCLUSIVE`. What remains is that two hex
strings which are neither equal nor one another's prefix read as movement, so a
caller that passes a *wrong* sha still gets a pass — unchanged by this fix, and
the reason the verdict line calls itself weak.

Nothing in it fetches, and that is pinned by a test rather than by the absence
of a fetch in the source: the caller's refs, `HEAD`, `.git/shallow` and
`.git/FETCH_HEAD` are all asserted unchanged after a run (L-E12). The reading
the fix is actually about needs no local ref at all — `git ls-remote` asks the
remote by name, where `git branch -r --contains HEAD` answers only from the
tracking refs the clone's refspec created, and a seat clone may fetch the
mainline alone.

`npm run shipped` is the same check from the repo root. `--help` prints the
verdict set and the field meanings.

`check-shipped.sh --fixture DIR` serves every reading from a file — `branch`,
`base`, `head`, `commits`, `lsremote`, `base_now`, `dirty`, `pr` — with a file
absent meaning the reading came back *empty* and a file whose first line is
`FAIL` meaning the reading *failed*. A fixture may also carry an `args` file
with the flags its case needs. `tests/shipped.test.mjs` runs twelve fixtures
and then does the thing a fixture cannot do: it builds a real bare remote and a
real clone whose fetch refspec is `+refs/heads/main:refs/remotes/origin/main`,
which is the shape that caused the defect, and asserts that `git branch -r
--contains HEAD` answers empty for a branch the remote is holding at that exact
HEAD while the command answers `SHIPPED`.

The suite was graded by mutation, not by being green: restoring the old
local-ref reading turns two tests red, dropping the pre-run-state guard turns
one red, putting the `git fetch` back turns two red, restoring the plain-string
comparison of the two base tips turns three red, dropping only its prefix
clause turns two red, and dropping the parse check on `--base-sha` turns one
red. The first attempt at
the commit-count test passed a mutant that restored `|| echo 0`, because the
fixture serves that count from a file and never exercises the counting, so a
live-clone case was added for it — a reading served by a fixture is tested
where it is read and not where it is taken.

The base-tip comparison needed the same treatment for a different reason. All
eleven fixtures set `--base-sha` and `base_now` to *different* commits, so
every one of them exercised `advanced` being right and none of them could reach
the case where it is wrong; the twelfth fixture is one commit spelled two ways,
and the live case beside it is the one the resident runtime will actually hit —
commit without pushing, pass `--base-sha "$(git rev-parse --short HEAD)"` of a
base that has not moved, and the two calls that disagreed must agree.

## `merge-order.sh` — the question GitHub does not ask

Company law names this instrument by path. `standards/lessons.md` L-A48 says a
shared append-only register is a mutual-exclusion anchor, that every concurrent
pass is "individually MERGEABLE against main, which is the only question any
per-pull-request check asks, and mutually exclusive with every sibling, which is
the question nobody asks until the merge", and that the way to measure it is
"`tools/merge-order.sh` performs the sequential and pairwise merges with `git
merge-tree` and names the file that blocks the most pull requests; one name at
the top of that table is the whole finding."

It did not exist here until 2026-10-25. The property had been measured by hand
three times instead — `docs/ideas.md`'s entry of 2026-10-24 (six pull requests,
fifteen pairs, #28 x #30 exclusive over SPRINTS.md and `docs/agents/pending.md`)
and `docs/agents/pending.md` entry 5, twice, the second time because the branch
had moved under the first reading.

**Why a tool and not a fourth hand measurement.** The answer perishes. Three
readings were taken during the run that wrote this file, and all three
disagreed, because the queue moved under each one:

| Read against | Open | In sequence | Exclusive pairs | Anchor |
|---|---|---|---|---|
| `main@b534f26b` | 12 | — | #64 x #66 | `docs/ideas.md` |
| `main@fa7c2514` | 11 | 10 of 11 | #59 x #63 (1 of 55) | `docs/agents/pending.md` |
| `main@dfa351cd` | 6 | 6 of 6 | none (0 of 15) | none |

Nothing was fixed between the second row and the third; seven pull requests
merged. That is L-A64 — a measurement of another seat's branch perishes, so the
thing worth shipping is the taking rather than the number — and it is why every
verdict line carries `base=<branch>@<sha>`. A number in a register without that
field cannot be compared to anything.

**The base tip is asked of the remote, and a clone behind it refuses.** L13:
put every reading to the system that owns the fact. The first live run of this
tool measured against a stale `refs/remotes/origin/main` — two of the engineer
seat's own pull requests merged at 02:27Z while the file was being written — and
reported `base=main` without saying which commit that was. Every number in that
run described a queue that no longer existed. So `git ls-remote` is asked for
the base tip, a local ref behind it is `INCONCLUSIVE reason=stale-base`, and
`--fetch` is the opt-in that moves it.

**The clone's depth is reported, not refused.** The first draft of this tool
exited 2 on any shallow clone, on L-A55's warning that `git merge-tree` "exits
fatal and a loop reads that as a conflict". Measured on 2026-10-25, that was
wrong in both directions:

- The clone a seat is handed is *always* shallow, so a blanket refusal makes
  exit 2 the outcome of every ordinary run — a check that degrades to a
  constant, which L12 calls worse than a missing check.
- The fatality is conditional. With the true merge base inside the fetched
  depth, `merge-tree` answers and answers correctly. With the base below the
  boundary, `git merge-base` prints nothing and `merge-tree` exits **128**,
  "refusing to merge unrelated histories" — it never guesses, so there is no
  silently wrong answer to defend against.

128 is greater than 1, so the exit-status split already classes it as a failed
reading rather than a conflict, which is the whole of L-A55's warning and is
handled where the merge happens. The depth therefore prints as
`clone=shallow|complete`, the `INCONCLUSIVE` diagnosis names it when a merge did
come back unreadable, and `--unshallow` turns a partial answer into a full one.

**`git merge-tree` exit 1 is a conflict and exit >1 is a failed reading**, and
the two never share a field (L-A50, L6). Only exit 1 produces `EXCLUSIVE`. This
is graded rather than asserted: collapsing the two in `merge_probe` turns
`tests/merge-order.test.mjs` red on the shallow-boundary case and green again
when it is restored (L-A21 — a gate is tested against an artifact known to fail
it before it is trusted).

**A head the clone cannot resolve withholds the verdict.** One unmeasured member
means the queue cannot be certified landable, so `out-of-scope` greater than zero
forces `INCONCLUSIVE` rather than certifying the readable remainder. The
`UNREADABLE` lines name the pull requests `--fetch` would bring in.

**Nothing here moves a ref, an index or a working tree.** `merge-tree` adds
objects to the store and touches nothing a caller can see, which is why it and
not `git merge` is the verb (L-E12). The three hand measurements before this one
used real `git merge` in the run's own checkout. `--fetch` and `--unshallow` are
the two writes, both opt-in and named in the flags, and neither ever passes
`--depth` — the flag that looks like thrift and leaves somebody else's complete
clone shallow for every later reader.

**The fix a finding here points at is never a merge driver.** L-A49 measured all
three arms on byte-identical commits: GitHub's merge API answered 409 on all of
them, and `merge=union` destroys records where it does run — two appended
entries in, one and a half out, exit 0, no conflict marker, still valid
Markdown. The remedy is L-A48's file layout: a dated file per pass under a
directory, or one writer on the shared table. The tool prints that on the anchor
line so the measured-wrong fix is not proposed a fifth time.

`tests/merge-order.test.mjs` builds real repositories rather than fixtures,
which is a deliberate break from the other three suites here. The thing under
test *is* a merge, so a fixture serving merge results would be testing the
fixture; only the pull request list, the one genuinely remote input, comes from
a file via `--prs`. Two cases also need a real `git clone --depth 1` over
`file://` — git ignores `--depth` on a local-path clone and hardlinks the whole
object store, so a path clone is neither shallow nor missing the objects of the
branches it did not fetch, which are exactly the two conditions those cases
exist to build.
