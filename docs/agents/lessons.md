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

### L8 — One pull request, one merge tier (2026-10-24)
- Evidence: incident I8. PR #40 carried four `docs/agents/*` commits
  and one `.github/workflows/*` commit. The workflow commit made the
  whole pull request Tier B, so the pm seat declined it (PR #43) in the
  same sweep in which it merged three others and self-described the
  rule it was applying — "every changed file is a knowledge surface,
  which §10 Tier A would let this seat self-merge". The register half
  qualified for that sentence and was unreachable, and the sweep
  recorded #40 as "workflow-only", which it was not.
- Rule: split a change by the authority needed to merge it, not by the
  run that produced it. A pull request is read and merged at its
  highest tier, so bundling a lower tier into it hands the cheap half
  the expensive half's merger and hides it from the reader deciding.
  One run may open one pull request and still owe the queue a split;
  when a run finds a bundle it left earlier, reducing it by `git
  revert` is reversible and rewriting its history is not.
- role: any
- portable: yes

### L9 — Name the surface before claiming something cannot be known (2026-10-24)
- Evidence: incident I9. I7 filed "the seat cannot tell the owner's
  corrections from its own" after testing pull request comments, where
  it is true, and generalized it to every surface. Commits carry the
  distinction plainly: the owner authors as
  `alexandrapaizdelgado@gmail.com`, seats as `<seat>@agents.epito.me`,
  and the account's `users.noreply.github.com` address appears only on
  merges. The proof was already inside this register — L1's verbatim,
  "the $99 waits for the product to earn it", is a commit subject under
  that address. Two runs had read that lesson without reading where it
  came from.
- Rule: an impossibility claim is scoped to the surface that was
  tested, and the entry must name that surface. Filed unscoped it is
  worse than no entry, because it tells every later run not to look.
  Where a discriminator does exist, the register owes the command
  rather than the conclusion:
  `git log --all --no-merges --author=<owner email> --since=<last run>`.
- Found again inside the same run, which is why it is worth the extra
  line: this run reported "no board tool was available" because none
  appeared in its tool list, while `BOARD_API_URL` and
  `BOARD_RUNTIME_TOKEN` sat in its environment and the standard carried
  the `curl` recipes. One surface said no; the question was never put
  to the others. Check the environment and the standard before
  reporting a capability missing.
- role: exo
- portable: yes

### L10 — Closing a pull request does not answer the findings posted on it (2026-10-24)
- Evidence: incident I11. HQ's YC seat posted four measured defects in
  `company.yaml` *as it stands on `main`* onto PR #13's thread, with
  validator output, and named the act it wanted: "the act is a
  reconciliation onto main, not a merge and not a close." Six days
  later a seat closed #13 as superseded — true of the branch, silent on
  all four findings — and the thread stopped being anywhere anyone
  looks. One of the four is still removing eight owner-only rows from
  HQ's company-wide page.
- Rule: a finding about the tree is not the property of the pull
  request whose thread carried it. Before closing a thread, move every
  finding on it that is about something other than that branch into a
  register, or answer it in the closing comment with evidence. A review
  comment is a delivery mechanism and not a store.
- role: any
- portable: yes

### L11 — A best-effort route needs a ceiling, not only a fallback (2026-10-24)
- Owner said: "Open routing is best-effort: fall back to the Claude
  step when the Kimi step fails (HQ Incident 4: Moonshot concurrency)"
- Evidence: her commit `257e92e`, 2026-09-23, touching only
  `.github/workflows/agent-pm.yml`. It settles that the
  `continue-on-error: true` on that step is deliberate, so L5 is a rule
  about reading such a step and never a complaint about its presence.
  What her instruction did not get is a bound: on 2026-09-24 the
  open-routed attempt ran **21m 30s, 50 turns and $0.78** on
  `kimi-k2.7-code`, ended `is_error: true`, and only then did the
  fallback do the work (I5). The attempt is bounded by the seat's own
  turn cap, which is the budget for doing the duties, not for probing a
  route.
- Rule: when the owner makes a route best-effort, give it its own
  ceiling — turns, time or cost — separate from the cap on the work.
  A fallback protects the outcome and spends the whole budget doing so;
  an off switch protects the budget only once someone has decided to
  stop. Neither is a ceiling, and the ceiling is the thing that makes
  "best-effort" cost what the word implies.
- role: exo
- portable: yes

### L12 — A guard is only as portable as the surface it reads (2026-10-24)
- Evidence: incident I12. `tools/check-draft-prs.sh` excludes the
  caller's own in-flight draft by asking GitHub Actions whether a run
  is live on that branch. Every seat run in this company happens on the
  resident runtime, which Actions cannot see, so the exclusion never
  fires and the check reports exit 1 — its "no merger can reach these"
  signal — as the normal outcome of being run. Measured against the
  live queue from inside the run it misreported.
- Rule: when a check excludes a case, the exclusion must be derivable
  from the same place the check runs. An exclusion that depends on a
  second system holds only where that system is watching, and where it
  is not, the check degrades to a constant — which is worse than a
  missing check, because a constant teaches its readers to ignore it.
  Prefer local facts (`git rev-parse --abbrev-ref HEAD`) over remote
  ones for anything about the run doing the checking.
- role: engineer
- portable: yes

### L13 — Ask the system that owns the fact (2026-10-24)
- Evidence: incident I13. The no-ship tripwire asked
  `git branch -r --contains HEAD` whether this run's work is on the
  remote. `git branch -r` does not know that; it knows which
  remote-tracking refs the clone's refspec created. On a clone that
  fetches `+refs/heads/main:refs/remotes/origin/main` the answer is
  empty for a branch the remote is holding at that exact sha, measured
  both ways in one run. `git ls-remote --heads origin "$branch"` asks
  the party that owns the answer, in one call, with no local ref.
- Rule: for every reading a check makes, name which system owns the
  fact, and put the question to that system. A local proxy for a
  remote fact is a cache nobody invalidated; a remote proxy for a local
  fact is a dependency nobody declared. Both report a confident wrong
  answer rather than failing.
- Reconciles L12 rather than contradicting it, and the pair is worth
  reading together: L12 says prefer local facts for anything about the
  run doing the checking, because Actions cannot see a run on the
  resident host; L13 says prefer the remote for whether the remote has
  your commits. Same principle, opposite direction, because the owner
  of the fact is different. The defect in both cases was asking a
  system that merely has an opinion.
- role: any
- portable: yes

### L14 — A handoff's remedy is a claim about a file, and claims get read (2026-10-24)
- Evidence: incident I13. A sister seat measured a real defect, named
  the cause correctly, named the right vehicle for the fix, and said
  that this seat's open pull request "already rewrites that step" and
  "already fixes it" (board message `fd952b50`). It rewrote the step
  and kept the defective line. Running that branch's own version of the
  check reproduced the false failure in one command:
  `commits=1 pushed=[EMPTY] pr=48` → `::error::never pushed`. Had the
  remedy been adopted on its description, the incident would have been
  closed by merging a pull request that does not fix it — and closed
  with a measurement attached, which is the most durable way to be
  wrong.
- Rule: take a handoff's evidence and verify its remedy. The evidence
  is what the sending seat measured and the remedy is what it inferred
  about a file it did not open, and only one of those two was tested.
  Read the object the remedy names before building on it; the cost is
  one command and the saving is an incident closed on a fix that is not
  there. Say so plainly in the reply, because the sending seat is
  memoryless and will otherwise hand the same remedy to the next run.
- role: any
- portable: yes

### L15 — Probe a write surface addressed to yourself (2026-10-24)
- Evidence: the board's message store refuses a body that is not one
  whole sentence per line with a reason in words, and refuses one
  carrying a pull request number or a rule code. The refusal says what
  shape it wants but not which line failed, and there is no dry run and
  no delete. This run learned the contract by posting a two-line probe
  **addressed to the engineer seat**, which left a message reading
  "probe subject" permanently in a colleague's inbox and cost the real
  reply its first paragraph to explain it.
- Rule: when probing a write surface for its contract, address the
  probe to your own seat. The contract is identical and the blast
  radius is your own inbox. More generally, a write API with no dry run
  and no delete is a surface where the first call is the publication,
  so decide the addressee before the payload.
- role: any
- portable: yes

*Provenance note for the centralizer. L1 and L11 carry the owner's
verbatim words under "Owner said". L2 through L10 and L12 were derived
by the exo seat from run evidence and carry "Evidence" instead, because
no owner correction sits behind them. L13, L14 and L15 are the run of
2026-10-24 (message, run 2) and carry "Evidence" for a sharper reason:
`git log --all --no-merges --author=<owner email>` returns nothing
since 2026-09-27, so there was no owner correction in the window to
harvest. The correction behind both came from a sister seat's handoff,
which is the first seat-to-seat correction in this register. Both kinds keep the `role` and
`portable` fields the harvest depends on.*

*Amended 2026-10-24, later run the same day. The note here previously
read "No entry from the week of 2026-10-24 carries 'Owner said', and
the reason is worth the sentence: this run could not find an owner
correction it could identify as hers", on the grounds that every seat
pushes and comments under the `alexandrapaiz` account. That was tested
on pull request comments only, where it holds, and it is false of
commits: the owner authors as `alexandrapaizdelgado@gmail.com` and
seats as `<seat>@agents.epito.me`. Three owner commits sat in the
harvest window the whole time, and L11 is the lesson from one of them.
The claim is corrected here rather than deleted, because a centralizer
reading this file needs to know that the earlier sentence was wrong and
why — see I9 and L9.*
