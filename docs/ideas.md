# The Ledger — Atelier

Contract: docs/standards/pm.md §4. Statuses proposed / accepted /
rejected / built / urgent; only the owner moves proposed.

### 2026-09-19 — Atelier company mode
- Trigger: HQ ledger, board-layer decision (ADR-008 at HQ): the owner
  would gladly run her company on Atelier, but it was designed for
  personal use
- What: a workspace concept — boards per product, seat-aware
  assignments, an executive view over a portfolio; the company would
  dogfood it
- First step: include as a question in this product's next discovery
  pass, after the App Store ship completes; not before
- Cost: $0
- Status: proposed

### 2026-09-19 — Browser checks for what the node harness cannot reach
- Trigger: the password reset work (Sprint 2, item 1). tests/harness.mjs runs
  the app's real script against a DOM stub, which covers logic but not pages,
  forms, or anything that renders. reset.html had no reachable surface in it
- What: scripts/reset-page-test.mjs, written for this item, already drives the
  shipped files in headless Chrome over the DevTools Protocol with no
  dependencies. Generalizing it would give the sign-in, deletion, and
  first-run flows the same kind of check
- First step: reuse it as-is for Sprint 2's account deletion item and see
  whether the shape holds before making anything generic
- Cost: $0
- Status: proposed

### 2026-10-24 — The engineer charter reads no file that carries this company's posture
- Trigger: woken by a board note, I opened SPRINTS.md as my charter tells me
  to and found Sprint 2 live with two Claude-owned items unfinished, so I
  started building one. company.yaml has said `posture: asleep` since
  2026-10-16, and the board's current sprint for atelier is "Asleep by
  decision — nothing ships until the owner wakes it, and its PM names the
  first real milestone then." I found that by accident, four turns in, and
  reverted the commit I had already made
- What: prompts/engineer-agent.md sends this seat to SPRINTS.md, README.md,
  ARCHITECTURE.md, docs/decisions.md, docs/ideas.md and the two lessons
  files. Posture lives in none of them. SPRINTS.md still carries Sprint 2
  dated Sep 21 → Sep 27 and its newest status note is Thu Sep 24, so the
  only board of record this seat is pointed at is a month expired and reads
  as live. The PM sees the posture because the PM reads company.yaml and the
  board; this seat has no such instruction. L-A20 clause four is the rule
  this trips: the seats whose behaviour changes are told in their charter or
  in a file their charter already reads, and a parent decision that governs
  silently is the failure the clause names
- First step: the PM adds the posture line to SPRINTS.md, where this seat
  already looks, and proposes the one-line charter patch as a §22 ask — both
  are its surfaces, not this seat's. Handed to it on the board today. The
  shape of the fix already exists: PR #32, opened by the exo centralizer
  while this run was measuring, adds to prompts/pm-agent.md the pointer to
  the lessons register that charter had never carried. Same disease, the
  other charter. Until one of those lands, every stateless engineer run
  reaches the same wrong conclusion from the same files
- Cost: $0
- Status: proposed

### 2026-10-24 — The two registers that collide here are the PM's, not the two a driver would be pointed at
- Trigger: Ursa/exo sent the engineer inbox a note about append-only
  registers colliding by construction, addressed to seat `engineer` with no
  company, naming `tools/ledger/ledger.mjs`, `docs/agents/incidents.md` and
  pull requests 301 and 302. None of those is in this repository. Taking the
  finding seriously rather than only the address, I measured whether atelier
  has the property it describes. It does, and not where the note would look
- What: `git merge-tree` over all six open pull requests, fifteen pairs, run
  from a complete clone and re-run after #32 opened mid-pass. One pair is
  mutually exclusive: #28 × #30, two consecutive PM passes. They conflict in exactly two files, both Markdown
  registers — SPRINTS.md and docs/agents/pending.md — and both passes insert
  at the identical anchor, SPRINTS.md line 108 and pending.md line 5. Each
  is individually MERGEABLE and CLEAN against main, which is the only
  question GitHub asks. Zero conflicts in product code. Neither
  docs/ideas.md nor docs/agents/incidents.md is in contention, because
  nothing has appended to either lately — so a merge driver pointed at this
  product's two named registers, the shape the note proposes, would have
  seen neither of the two files that actually collided. That is L-A21's
  test: name the change that would break what the gate governs, then ask
  whether the gate would have seen it
- First step: no driver and no `.gitattributes` — L-A49 measured that route
  and it is wrong, and this repository has neither today, which is the one
  piece of luck in the finding. The fix is L-A48's file layout, applied to
  the PM's two surfaces rather than to the ledger: a dated file per pass
  under a directory, with the shared table generated from them or appended
  to by exactly one writer. That is the PM's lane to design and the owner's
  to accept, so it enters here as a proposal and goes no further this run
- Cost: $0
- Status: proposed

### 2026-10-24 — A wake message was the only thing that remembered two stranded drafts
- Trigger: this seat's third run was woken with a sentence listing #31 and
  #34 as drafts idle sixteen and fifteen hours with no live run behind them.
  The sentence was right, and it was written by hand in a message whose
  own body was about another company's pull request. Two runs on this seat
  had each ended by leaving its artifact where no merger could reach it,
  and neither of them could see the other's
- What: `tools/check-draft-prs.sh` now answers that question here as an exit
  code, and nothing runs it. The two places it would have to run to close the
  loop are both outside this seat's lane: the seat workflow, where a post-run
  step reading exit 1 would turn "I left a draft" into a red run the way the
  no-ship tripwire turns "I pushed nothing" into one (L-E8's second clause,
  same shape); and the runtime that wakes seats, which is where this wake's
  hand-written sentence came from and where one call would serve every product
  rather than this one
- First step: exo adds the post-run step to `.github/workflows/agent-*.yml` —
  `npm run drafts -- --seat <seat>`, exit 1 reported and not fatal, since the
  draft it names is usually the run's own and the point is that the next run
  sees it. `.github/` is exo's surface and this entry is the request
- Cost: $0
- Status: proposed

### 2026-10-24 — Both seats recorded the same hold as the other seat's ruling
- Trigger: #31 and #34 each said they stayed drafts because landing a
  governance PR under the asleep posture was the PM's call. The PM's #35 said
  "that's the engineer's own standing ruling about governance PRs while the
  product sleeps, not mine to lift". Neither seat had ruled it; each read its
  own caution back as the other's law, and three artifacts sat unreachable
  for sixteen hours on a condition nobody had set
- What: L-A32 allows a draft to stay a draft if the PR writes which clause
  keeps it one, and prose cannot be checked — this is what a hold on an
  artifact looks like when it is machine-readable instead. One line in the PR
  body, `HOLD: <authority> — <condition that lifts it>`, where the authority
  is a file, a rule ID or a board message id that a reader can open. The draft
  check then prints `hold=<authority>` rather than `STRANDED`, and a hold
  citing nothing, or citing the seat's own run, reads as stranded again
- First step: add `HOLD:` parsing to `tools/check-draft-prs.sh` (it already
  reads the PR body's absence of one — it just does not look), and name the
  convention in `tools/README.md`. One session, this seat's own lane
- Cost: $0
- Status: proposed

### 2026-10-24 — The seat workflows have not run a seat in a month, and they are still the surface everyone edits
- Trigger: the exo seat wired a post-run stranded-draft step into all three
  `.github/workflows/agent-*.yml` files this afternoon. `npm run surface` says
  `agent-engineer.yml` last ran on 2026-09-19 and `agent-pm.yml` on 2026-09-24,
  while the board records three engineer runs and eight pm runs on 2026-10-24
  alone, every one of them served by `host.alexandra-systems-company.com` on a
  `window:message` trigger. So the step is correct and it will fire on no run
- What: `company.yaml` names one workflow file per seat and calls it the seat,
  and everything the company knows about where a seat runs is read off that
  declaration. A drift check greps those files, an exo run edits them, a chair
  reads them to say what a seat does. None of it is evidence that the file ran.
  The repair is not in this repository: the resident host's run wrapper is the
  thing that executes a seat here, so a post-run check belongs there, where one
  call serves every product rather than three files in each
- First step: `company.yaml` records the surface that actually runs each seat
  beside the workflow it declares, so the next seat to edit a workflow can see
  in one read whether its edit reaches anything. That file is HQ's declaration
  to HQ and not this seat's to write, so this entry is the request
- Cost: $0
- Status: proposed

### 2026-10-24 — A seat is invisible to the board for the whole of its own run
- Trigger: `tools/check-seat-surface.sh` read `board_runs=0` for the exo seat at
  18:20 and labelled it a run the board had lost. The run had started at 18:07
  and ended at 18:24, and it appeared on the board four minutes later. The
  reading was true and the conclusion was wrong
- What: a run reaches the board when it ends, so the board cannot answer "is this
  seat running" and nothing it serves distinguishes a fresh absence from a lost
  run. The tool now resolves that absence against the forge and prints which of
  the three it saw, which is a workaround in one product for something the
  instrument could state itself. A row written at start and completed at end
  would make the board answer the question every watcher is actually asking
- First step: HQ's runtime owns the board, so this is handed up rather than
  built here. What this product can offer is the measurement and the three
  labels, both already in `tools/check-seat-surface.sh`
- Cost: $0
- Status: proposed

### 2026-10-24 — The board read is capped at 25 runs and says nothing about it
- Trigger: `GET /api/board/<company>` returned exactly 25 runs for four of the
  five portfolio companies on 2026-10-24, 11 for this one, and carries no field
  saying it truncated. Any query string on that route answers 404, so a wider
  window cannot be asked for. A caller that parses an error body for `runs`
  reads zero runs, which is how this seat first mistook the cap for an empty one
- What: the same defect the company already fixed for `GET /api/messages`, which
  now returns `limit` and `saturated` and accepts `before_hours`. The board route
  needs the same two fields, and the honest workaround until it has them is to
  report the oldest row on the page as the window the answer covers, which is
  what this product's check now prints as `board_window_from=`
- First step: HQ's runtime again, and the rule it is an instance of is already
  law there, so this is one line of evidence rather than a new argument
- Cost: $0
- Status: proposed
