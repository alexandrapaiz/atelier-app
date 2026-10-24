# Lessons — Atelier

Owner corrections captured verbatim, generalized into rules by the exo
seat (format in prompts/exo-agent.md). Company-wide law lives in
docs/standards/lessons.md (vendored, centralizer-synced); this file
holds Atelier-local rulings and the portable candidates awaiting
harvest.

### L1 — The worthiness gate governs money (2026-09-19)
- Owner said: "the $99 waits for the product to earn it"
- Rule: purchases queue behind the owner's worthiness judgment as
  dependency chains, never as dated tasks; no seat schedules her money.
- role: pm
- portable: yes

### L2 — Turn caps come from representative runs, not smoke runs (2026-09-19)
- Evidence: run 35463415653, the pm seat's supervised smoke run,
  reported `"num_turns": 13`. Applying L-X3 literally would set the cap
  at 2 x 13 with a floor of 100, so 100, against current caps of 120
  for pm and exo and 200 for engineer.
- Rule: derive a turn cap only from runs that executed the seat's full
  duties. A smoke run's `num_turns` is evidence that the plumbing
  works and nothing more, so it never lowers a cap. Until a
  representative run exists, leave the cap alone and say in the PR that
  it rests on no evidence yet.
- role: exo
- portable: yes

### L3 — One file, one owning charter (2026-09-19)
- Evidence: incident I1. `prompts/pm-agent.md` and
  `prompts/exo-agent.md` both instruct their seat to write
  `docs/agents/pending.md`, and both seats did so within the same hour
  on their first runs.
- Rule: every file a seat writes names exactly one owning charter. When
  two seats need the same file, split it by named section and give each
  section an owner in both charters. A seat that finds itself in
  contested territory yields and files the conflict rather than winning
  the race.
- role: any
- portable: yes

### L4 — A fix that lands on a surface nobody runs is not in the tree (2026-10-24)
- Evidence: `.github/workflows/agent-engineer.yml`, `agent-exo.yml` and
  `agent-pm.yml` have executed five times in this repository's life, all
  between 2026-09-19 and 2026-09-24 (`gh run list --workflow`). Every
  seat run since — engineer and pm, daily through 2026-10-24, and this
  exo run — happened on the resident runtime, which checks the repo out
  and reads `prompts/`, and never executes `.github/workflows/agent-*.yml`.
  So the no-ship tripwire, the three turn caps and the step this run
  shipped bind the dispatch path and no other.
- Rule: before shipping a fix into a file, read when that file last
  executed. A fix on a surface that has not run is reported as reaching
  that surface only, and the surface the work actually runs on is named
  as still open. "It is in the tree" and "it binds" are two claims, and
  the register owes the second one.
- role: exo
- portable: yes

### L5 — `continue-on-error` makes a failed step report success (2026-10-24)
- Evidence: run 36023458176, step 3 "Seat run (open-routed)", conclusion
  `success` in the step list. Its own result block says `"subtype":
  "success", "is_error": true` after 50 turns, 21m 30s and $0.78 on
  `kimi-k2.7-code`, and the action logged `##[error]Claude result
  reported subtype success with is_error:true`, then
  `outcome=failure;conclusion=failure` for the inner action. The step's
  `continue-on-error: true` promoted that to `success` at the step
  level, which is the value `gh run view --json jobs` returns.
- Rule: a step carrying `continue-on-error` reports its own conclusion
  as `success` whatever happened, so never read that conclusion as the
  step's result. Assert from the run log's `is_error` and `modelUsage`.
  This is the mechanism behind "judge runs by artifacts never
  conclusions"; the SDK result block itself can carry `subtype:
  success` alongside `is_error: true`, so the subtype is not the answer
  either.
- role: exo
- portable: yes

### L6 — A check that could not run is not a pass (2026-10-24)
- Evidence: `tools/check-draft-prs.sh` (engineer PR #39) is built on
  this — exit 2 for a precondition failure, `unreadable` rather than a
  zero for a failed field read. Wiring it into the three seat workflows
  this run produced two more instances. `npm run drafts` with no such
  script in `package.json` exits **1**, which would have read as
  "stranded drafts found" rather than "never asked", so the step gates
  on the tool's presence first. And `--seat <misspelling>` matches no
  branch and exits **0**, so a typo in the seat name reads as all
  clear — a false pass reachable by one character.
- Rule: every check reports three outcomes and not two: passed, failed,
  and could-not-run. A caller that collapses the third into either of
  the first two is a defect in the caller, and a check whose own
  "nothing matched" is indistinguishable from "nothing wrong" is a
  defect in the check.
- role: any
- portable: yes

### L7 — Moving a rule into one document does not bind the others (2026-10-24)
- Evidence: incident I3 (2026-09-19) ruled that the workflow dispatch
  prompt must stop naming the branch and defer to each charter, and the
  fix was applied to all three workflows. The charters say
  `exo/YYYY-MM-DD`, `engineer/YYYY-MM-DD-slug`,
  `pm/sprint-YYYY-MM-DD`. Every seat branch this month is
  `atelier-<seat>/YYYY-MM-DD-<trigger>` — including this run's,
  `atelier-exo/2026-10-24-message` — because the resident runtime's
  wake prompt names the branch directly. That is I3's defect exactly,
  on the surface that replaced the one I3 fixed. See I6.
- Rule: when a rule is moved into a document so that a second source of
  truth stops overriding it, enumerate every surface that can still
  state that rule and fix each one, or record the ones left unbound.
  A fix applied to one caller is not a fix to the rule.
- role: any
- portable: yes

*Provenance note for the centralizer: L1 carries the owner's verbatim
words under "Owner said". L2 through L7 were derived by the exo seat
from run evidence and carry "Evidence" instead, because no owner
correction sits behind them. No entry from the week of 2026-10-24 carries
"Owner said", and the reason is worth the sentence: this run could not
find an owner correction it could identify as hers. Every seat pushes
and comments under the `alexandrapaiz` GitHub account, so authorship
does not separate her words from a seat's; no board message among the
hundred most recent to this company is owner-authored; and this run's
own dispatch came from a seat. That is a gap in step 1 of
prompts/exo-agent.md, which assumes her corrections are findable, and
it is recorded under "Blocked fixes (exo)" in
docs/agents/pending.md rather than resolved by guessing which comments
were hers. Both kinds keep the `role` and `portable` fields the
harvest depends on.*
