# tools/

Commands a seat can run. Each one answers a question this product's law asks,
as an exit status rather than as a paragraph a memoryless run has to recall
(standards/lessons.md L-A22: name the command, and say what its exit status
means). No npm dependencies — `git`, `gh`, and a POSIX shell, per this app's
zero-framework ethos.

| Command | Question | Exit 0 | Exit 1 | Exit 2 |
|---|---|---|---|---|
| `tools/check-draft-prs.sh` | Is any of this product's seat work sitting where no merger can reach it? | No stranded drafts in scope | One or more open drafts with no live run behind them, named on stdout | The check could not run (no `gh`, no auth, not a repo) |
| `tools/check-seat-surface.sh` | Does the surface `company.yaml` declares for a seat still execute that seat? | Every seat in scope last ran on its declared workflow | A seat ran more recently somewhere the declaration does not name, so an edit to that file reaches nothing | No seat is `ELSEWHERE`, and at least one could not be read or has never run anywhere |

`npm run drafts` is the same check, this seat's and every other seat's, from the
repo root. Scope it with `--seat engineer`, widen it with `--all`, read the
field meanings with `--help`. `npm run surface` is the other one, scoped the
same way with `--seat`, and `--company` overrides the board company name the
manifest implies.

Both commands only read. `check-seat-surface.sh` in particular runs `GET` against
the board and `gh run list` / `gh pr list` against the forge, and touches no ref,
no index and no working tree, because a measurement that moves something is a
measurement that broke what it measured (L-E12).

A draft whose branch is carrying a run right now prints `LIVE` and is not
counted: that is the run you are standing in, not a stranded one.

A field the check could not read prints `unreadable` rather than a zero, and
the draft still counts as stranded (L-A44: the cause rides with the value).
`carries=nothing` is the one answer that tells a reader to close a pull
request, so a failed read must never be able to produce it. The cheap error
here is one merge of waiting; the expensive one is closing work that exists.

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
