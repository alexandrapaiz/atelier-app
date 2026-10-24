# tools/

Commands a seat can run. Each one answers a question this product's law asks,
as an exit status rather than as a paragraph a memoryless run has to recall
(standards/lessons.md L-A22: name the command, and say what its exit status
means). No npm dependencies — `git`, `gh`, and a POSIX shell, per this app's
zero-framework ethos.

| Command | Question | Exit 0 | Exit 1 | Exit 2 |
|---|---|---|---|---|
| `tools/check-draft-prs.sh` | Is any of this product's seat work sitting where no merger can reach it? | No stranded drafts in scope — any that were too new to judge are counted on the summary line | One or more open drafts with no live run behind them, named on stdout | The check could not run (no `gh`, no auth, not a repo, a `--seat` name `company.yaml` does not declare, a `--fresh-under` that is not whole minutes) |
| `tools/check-seat-surface.sh` | Does the surface `company.yaml` declares for a seat still execute that seat? | Every seat in scope last ran on its declared workflow | A seat ran more recently somewhere the declaration does not name, so an edit to that file reaches nothing | No seat is `ELSEWHERE`, and at least one could not be read or has never run anywhere |
| `tools/check-shipped.sh` | Did the seat run that just ended leave its work anywhere but the sandbox? | `SHIPPED` — the remote holds this HEAD, or the base advanced past the tip captured before the run | `ORPHANED`, `UNPUSHED` or `NOTHING` — the work is not safe, and the line says which of the three | `INCONCLUSIVE` — a reading the verdict needed came back unreadable, so no verdict was published |

`npm run drafts` is the same check, this seat's and every other seat's, from the
repo root. Scope it with `--seat engineer`, widen it with `--all`, judge even
the newest drafts with `--fresh-under 0`, read the field meanings with
`--help`. `npm run surface` is the other one, scoped the
same way with `--seat`, and `--company` overrides the board company name the
manifest implies.

Read the status, never a pipe's: `npm run drafts | tail` reports the tail's 0
whatever the check found, so pipe either command and you want
`${PIPESTATUS[0]}`.

Both commands only read. `check-seat-surface.sh` in particular runs `GET` against
the board and `gh run list` / `gh pr list` against the forge, and touches no ref,
no index and no working tree, because a measurement that moves something is a
measurement that broke what it measured (L-E12).

A draft whose branch is carrying a run right now prints `LIVE` and is not
counted: that is the run you are standing in, not a stranded one. Two readings
reach that verdict and they print as different words, because they are
different facts. `run=self` means this is the branch the calling run is
standing on, read from `git rev-parse --abbrev-ref HEAD`. `run=live` means the
Actions API reports a queued or in-progress run on the branch.

**`run=self` is the reading that works here.** Every seat run in this product
is a host window on the resident runtime, and the Actions API cannot see one.
Read on 2026-10-24, the last run of any of the three seat workflows was the
project manager's on 2026-09-24, and the engineer's and the exo's were both
2026-09-19. So `run=live` can never fire on the surface that runs the seats,
and before `run=self` existed the
check named the caller's own minutes-old draft as stranded and exited 1 on
every run — which made exit 1 the normal result of running at all, and a
number that is always 1 is a number readers learn to skip. The one thing
`run=self` cannot vouch for is another seat's pass running in the same minute
on its own branch, and that case is what `FRESH` below is for.

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
became zero is a guard that is off reporting a clean queue.

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
with the flags its case needs. `tests/shipped.test.mjs` runs eleven fixtures
and then does the thing a fixture cannot do: it builds a real bare remote and a
real clone whose fetch refspec is `+refs/heads/main:refs/remotes/origin/main`,
which is the shape that caused the defect, and asserts that `git branch -r
--contains HEAD` answers empty for a branch the remote is holding at that exact
HEAD while the command answers `SHIPPED`.

The suite was graded by mutation, not by being green: restoring the old
local-ref reading turns two tests red, dropping the pre-run-state guard turns
one red, and putting the `git fetch` back turns two red. The first attempt at
the commit-count test passed a mutant that restored `|| echo 0`, because the
fixture serves that count from a file and never exercises the counting, so a
live-clone case was added for it — a reading served by a fixture is tested
where it is read and not where it is taken.
