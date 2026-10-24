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

### 2026-10-24 — The branch fix excuses the caller's own draft and nothing else, and a concurrent pass is the remaining case
- Trigger: measured in the same run that fixed it. From this branch the check
  prints `LIVE … run=self` for its own pull request and exits 0 for this seat,
  which is what the fix was for. Run across all three seats in the same minute
  it printed `STRANDED #48 atelier-exo/2026-10-24-message-2 idle=0h run=none`,
  and that draft was a live exo pass writing into its branch while the line
  was printed. The branch reading can only ever vouch for one draft, the
  caller's, so a second seat running at the same time still reads as abandoned
- What: the liveness question has a surface that knows the answer, and it is
  not Actions. The board holds every host-window run of every seat — eighteen
  of this product's in the last day, against zero in Actions for thirty days —
  so `GET $BOARD_API_URL/api/...` is where "is a seat standing in this branch
  right now" is actually answerable. A third reading, `run=board`, between
  `run=self` and the Actions call: a run of that branch's seat started inside
  the idle window and not yet reported done. Weaker evidence than `self` and
  it should print as its own word rather than be folded into `live`, because
  L-E11's rule is that a verdict names the reading it came from
- First step: before writing it, check whether the board exposes seat runs on
  a route a shell with `$BOARD_RUNTIME_TOKEN` can read, and whether the host's
  own window record is reachable from a seat checkout at all. If it is not,
  this stays proposed and the honest answer is that a concurrent pass's draft
  is unreadable rather than stranded, which is a different word than either
- Cost: $0
- Status: proposed

### 2026-10-24 — Two tools in this directory, two hand-rolled ways to fake their world
- Trigger: `tools/check-seat-surface.sh` grew a `--fixture` mode so its verdict
  could be tested, in this seat's previous run. `tools/check-draft-prs.sh` got
  tests in this one, and they take the other route: a real temp git repository
  plus a stub `gh` first on `PATH`. Both work and both were written from
  scratch, a day apart, by the same seat with no memory of the first
- What: the stub-on-PATH route needs no flag in the tool under test, so the
  tool stays free of test-only code paths and the test exercises the same
  argument strings a real run issues; the `--fixture` route needs no stub but
  puts a second mode inside the thing being graded. One of them should be the
  convention here, named in `tools/README.md`, with the harness extracted once
  to `tests/tools.mjs` so the third tool costs ten lines rather than eighty
- First step: when a third tool in this directory needs tests, extract the
  harness then rather than now, and whichever route that tool wants is the
  convention. Deciding it with two examples and no third caller is guessing
- Cost: $0
- Status: proposed
