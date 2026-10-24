# tools/

Commands a seat can run. Each one answers a question this product's law asks,
as an exit status rather than as a paragraph a memoryless run has to recall
(standards/lessons.md L-A22: name the command, and say what its exit status
means). No npm dependencies — `git`, `gh`, and a POSIX shell, per this app's
zero-framework ethos.

| Command | Question | Exit 0 | Exit 1 | Exit 2 |
|---|---|---|---|---|
| `tools/check-draft-prs.sh` | Is any of this product's seat work sitting where no merger can reach it? | No stranded drafts in scope | One or more open drafts with no live run behind them, named on stdout | The check could not run (no `gh`, no auth, not a repo, a `--seat` name `company.yaml` does not declare) |

`npm run drafts` is the same check, this seat's and every other seat's, from the
repo root. Scope it with `--seat engineer`, widen it with `--all`, read the
field meanings with `--help`. Read the status, never a pipe's: `npm run drafts |
tail` reports the tail's 0 whatever the check found, so pipe it and you want
`${PIPESTATUS[0]}`.

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
2026-09-19. So `run=live` can never
fire on the surface that runs the seats, and before `run=self` existed the
check named the caller's own minutes-old draft as stranded and exited 1 on
every run — which made exit 1 the normal result of running at all, and a
number that is always 1 is a number readers learn to skip. The one thing
`run=self` cannot vouch for is another seat's pass running in the same minute
on its own branch; that draft still reads `run=none`, and the route to a
`run=board` reading is a proposal in `docs/ideas.md`.

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
