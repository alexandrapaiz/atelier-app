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

`check-seat-surface.sh` prints the reading each verdict came from in `source=`,
and `board_runs=` beside it. A verdict reached from the forge rather than from
the board means the board holds no run for that seat, which is a finding in its
own right rather than a detail: the board is the instrument the company reads,
and a seat that runs without appearing in it is invisible to every other
instrument built on top of it.

Exit 1 outranks exit 2 in that command on purpose. A seat found running off its
declaration is the actionable answer, and letting a different seat's unreadable
field downgrade it to "could not run" would hide the finding behind the weaker
one, so both counts are printed on the summary line whichever status is
returned.
