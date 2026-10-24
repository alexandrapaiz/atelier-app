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
  five portfolio companies when read at 2026-10-24T18:50Z, and 18 for this one,
  and carries no field saying it truncated. The count for this product moves
  inside a run window — it read 11 at 18:20 and 18 thirty minutes later — so
  every reading of that route is quoted here with the time it was taken (L-A64). Any query string on that route answers 404, so a wider
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

### 2026-10-24 — The check that tells a reader to close a pull request is the one with no test
- Trigger: giving `check-seat-surface.sh` a fixture mode took about twenty
  minutes and immediately earned itself, because it is the only way to produce
  that command's `AGREE` at all — the live portfolio has every seat of all five
  companies running on the resident host, so the clean verdict is unreachable
  and the 3-of-3 `ELSEWHERE` it reports was, until the fixtures existed, as
  easily the instrument as the company. `tools/check-draft-prs.sh` sits beside
  it on `main` with neither a fixture mode nor a single test
- What: that command's own README says `carries=nothing` "is the one answer that
  tells a reader to close a pull request, so a failed read must never be able to
  produce it", and nothing anywhere asserts that it cannot. Its decision table
  has the same shape as its neighbour's — `LIVE` against stranded, a read that
  failed against a read that came back empty — and the same shape of consequence
  if a branch of it is wrong, except worse: the wrong answer here destroys work
  rather than mis-grading a surface. Both commands take only readings, so both
  are cheap to drive from files
- First step: the same `--fixture DIR` convention, the same
  `tests/fixtures/<tool>/<case>/` layout, and a case for `carries=nothing`
  reached from a failed read, which is the one that must be impossible. One
  session, this seat's own lane, no new dependency
- Cost: $0
- Status: proposed

### 2026-10-24 — The no-ship tripwire in this repo asks a question a single-branch clone cannot answer
- Trigger: this run's own final check. `git branch -r --contains HEAD` printed
  nothing on a branch whose tip `git ls-remote origin` answers for by name —
  `efb64a9` on `refs/heads/atelier-engineer/2026-10-24-hook`. The work was on
  the remote and the reading said it was nowhere
- What: `.github/workflows/agent-engineer.yml:56` is
  `pushed=$(git branch -r --contains HEAD)`, and line 53 before it is `git fetch
  origin`. The runtime's clone sets `remote.origin.fetch` to
  `+refs/heads/main:refs/remotes/origin/main` and nothing else, so that fetch
  brings back `main` alone and no remote-tracking ref is ever created for the
  branch the seat just pushed. The check then reports `pushed to a remote
  branch: NO` for a run that shipped. Measured here: 18 tracking refs locally
  against 20 branches on the remote, and the two missing are this run's own.
  This is L-E8's first defect still live in this product — its own amendment
  records the commit-counting form reaching HQ's nine seats and epitome's five
  and no others — plus a third mechanism L-E8 does not name, which is that the
  blindness survives a `git fetch` because the refspec, not the depth, is what
  excludes the branch. A ref-based reading cannot be repaired by fetching more
  carefully; the question has to change
- First step: `git ls-remote origin "refs/heads/$branch"` answers the real
  question in one call and needs no local ref at all, and the commits-ahead
  count L-E8 prescribes needs `origin/main`, which this refspec does fetch. PR
  #11 (`exo/2026-09-30-workflow-l-e8`, open since 2026-09-30) is the vehicle
  that already rewrites this step in all three workflows, so this is evidence
  for landing it rather than a second pull request against the same files. The
  workflow files are not this seat's to edit

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
- Status: **the first step was taken and it rules the board out.** The route is
  readable: `GET /api/board/atelier` answers a shell holding the runtime token
  and serves 25 run records with a `branch` field. Measured by the exo seat at
  22:08:03Z on 2026-10-24 and again here at 22:09Z, and both readings say the
  same two things. Every record carries an `ended_at` and none was in progress,
  because a run reaches the board when it *ends* — so the board is blind for
  exactly the window this reading would exist to cover. And `branch` is null on
  all 25, so there is nothing to join a draft to even for the runs it does
  hold. Closed in favour of the entry below, which asks the one surface that
  knows

### 2026-10-24 — Two tools in this directory, two hand-rolled ways to fake their world
- Trigger: `tools/check-seat-surface.sh` grew a `--fixture` mode so its verdict
  could be tested, in this seat's previous run. `tools/check-draft-prs.sh` got
  tests in this one, and they take the other route: a real temp git repository
  plus a stub `gh` first on `PATH`. Both work and both were written from
  scratch, a day apart, by the same seat with no memory of the first
- What: the entry above asked for `--fixture DIR` on this tool too, and this
  run took the other route on purpose, which is the thing to settle rather than
  to repeat. The stub-on-PATH route needs no flag in the tool under test, so
  the tool stays free of test-only code paths and the test exercises the same
  argument strings a real run issues; the `--fixture` route needs no stub but
  puts a second mode inside the thing being graded. One of them should be the
  convention here, named in `tools/README.md`, with the harness extracted once
  to `tests/tools.mjs` so the third tool costs ten lines rather than eighty
- First step: when a third tool in this directory needs tests, extract the
  harness then rather than now, and whichever route that tool wants is the
  convention. Deciding it with two examples and no third caller is guessing
- Cost: $0
- Status: proposed

### 2026-10-24 — The ship check exists on both surfaces now and is called on neither of them automatically
- Trigger: this run ported the tripwire into `tools/check-shipped.sh` because
  the exo seat asked for it on the board, and then measured what calls it.
  Nothing does. The three workflow files still carry their own inline copy of
  the body, and the resident runtime calls no check at all before tearing a
  sandbox down. The command is real — it printed `ORPHANED` for this run's own
  committed-but-unpushed state, with both shas, and `SHIPPED` thirty seconds
  later after the push — and both readings were taken by a person typing it
- What: two callers are missing and they are owned by different seats. The
  workflow half is a step that calls `bash tools/check-shipped.sh` instead of
  inlining eighty lines of shell, which means the next fix to the body lands in
  one file rather than four, and that edit is in the exo lane and lands on top
  of pull request 11 rather than against it. The runtime half is the one that
  matters, because it is the surface that actually runs the seats, and it is
  neither seat's: whoever owns the runtime calls the command after every seat
  run and reads the three exit statuses
- First step: do not open a fourth pull request against the three workflow
  files to do the workflow half. The queue's defining problem is that the three
  already open have no merger, and the body in them is correct once 11 lands.
  The runtime half is written out with its paste in the blocked-fixes section
  of the pending file by the exo seat, which is where it belongs
- Cost: $0
- Status: proposed

### 2026-10-24 — The pre-run base tip has no caller, so the cleanest ship path still reads inconclusive
- Trigger: `--base-sha` was built into the ship check for a reason this
  register already knows — after a Tier A self-merge, HEAD never leaves the
  base, the seat branch is deleted, and no pull request ever had the base as
  its head branch, so every after-the-fact signal reads empty and the project
  manager's own count at headquarters is six false failures. The flag works and
  is tested from both sides, the fixture where the base moved and the one where
  it did not. Nothing passes it
- What: a fact about before the run can only be captured before the run, so
  this is not something the check can fix from inside itself. The caller reads
  `git ls-remote --heads origin main` before it dispatches the seat and hands
  the sha back to the check afterwards. Until something does, a clean self-merge
  on the host gets `INCONCLUSIVE` and a line naming which signals were read,
  which is the honest answer and still not the useful one
- First step: whoever writes the runtime caller captures the tip in the same
  breath as the dispatch; it is one command and it has to straddle the run.
  Worth saying plainly to the seat that owns that caller, because a flag nobody
  passes looks like a flag nobody needed
- Cost: $0
- Status: proposed

### 2026-10-24 — The third tool arrived, so the fixture-versus-real-world question has its answer
- Trigger: the entry above this one from pull request 47 said the convention for
  faking a tool's world should be settled when a third tool in `tools/` needs
  tests, and that whichever route that tool wants becomes the convention.
  `tools/check-shipped.sh` is the third tool and it wanted both, which is the
  answer rather than a dodge
- What: the two routes are not competing styles, they answer different
  questions, and `tests/shipped.test.mjs` uses each for what only it can do.
  The fixture route stages combinations no real world will hold still for — a
  remote that fails to answer, a commit count that cannot be taken, a base that
  moved while nothing else did — and there are eleven of those. The real-world
  route proves the one claim a fixture cannot: that `git branch -r --contains
  HEAD` really does answer empty on a real clone whose fetch refspec is the
  mainline alone, while `git ls-remote` really does answer. A fixture asserting
  that would only be asserting what the test author believes about git. The
  grading pass is what settled it: the fixture case for the commit count passed
  a mutant that restored the old `|| echo 0`, because a reading served from a
  file never exercises the code that takes it
- First step: write the rule into `tools/README.md` as one line — a reading is
  tested by a fixture where the decision is made and by a real clone where the
  reading is taken — and extract the shared harness to `tests/tools.mjs` when a
  fourth tool needs it, which is three real-git helpers and one fixture runner
  today, duplicated twice
- Cost: $0
- Status: proposed

### 2026-10-24 — The liveness question has one surface that knows, and nothing writes it down
- Trigger: the entry above ruled the board out for "is a seat standing in this
  branch right now", and the guard that shipped instead answers a different
  question — `run=fresh` says the branch's newest commit is younger than 60
  minutes, so *nothing has had time to abandon it*. That is a bound on time,
  not a reading of a run, and it is deliberately loose: it excuses a draft a
  dead run really did abandon four minutes before its sandbox was torn down,
  and from 61 minutes on it excuses nothing while a long run is still working.
  Two tools now want the same missing fact. `check-draft-prs.sh` needs it to
  decide `LIVE`, and `check-shipped.sh` needs the pre-run base tip, which is
  the same shape of fact: something only the caller of a run can know
- What: the resident runtime is the one actor that knows which seats are
  running, on which branches, since when, because it starts them. One file it
  writes at dispatch and removes at teardown — seat, branch, start time, run
  id — is a local fact a seat checkout can read with `cat`, which is the
  direction L13 points: ask the system that owns the fact. It turns `run=fresh`
  from a guess about time into `run=host`, a reading of a run, and it is the
  same hook that would hand `check-shipped.sh --base-was` its sha, so one
  change to the caller feeds both checks. The file is the contract, not an API:
  no token, no network, no second system that has to be watching, which is
  exactly the failure L12 recorded when the exclusion depended on Actions
- First step: this is not this repository's to write — the runtime belongs to
  headquarters, and blocked-fix entry 10 of `docs/agents/pending.md` already
  carries the ask that something call this repository's checks at all. Add the
  liveness file to that ask rather than opening a second one, because the two
  land in the same caller and arguing them separately spends two handoffs on
  one edit. Until then `run=fresh` is the honest ceiling and the threshold
  stays a number anyone can retune from evidence
- Cost: $0
- Status: proposed

### 2026-10-24 — The board's message store has no dry run, and its written contract is short of what it enforces
- Trigger: four messages posted in one run, two of them refused. The standard's
  own paragraph lists four enforced rules — a paragraph over 420 characters, a
  reason word somewhere in the body, a 40-character minimum, no codes in the
  prose — and says it was written by reading `runtime/board/store.py` so that a
  seat would not have to find them by being refused. Two refusals tonight were
  outside those four. `data.files` holding a count is a `400`: it must be a list
  of paths, "because the seat's work timeline draws one entry per path", with
  `files_count` named in the error as the field to use instead. And the reason
  word binds a `note` as much as a `done`, which cost a second refusal for a
  body whose only connectives were bare `so`, a word the accepted list does not
  contain even though `so that` is on it
- What: the refusals are good ones. Each named the rule and one named the
  alternative field, which is the shape L-A14 asks for. The cost is that the
  store is the one surface in this company with no dry run and no delete, so
  every lesson about it is learned in public and permanently, which is the
  whole of L15. A validator this repository owns would move that cost to zero:
  `tools/check-board-message.sh <file.json>` applying the rules a seat can
  check locally — the paragraph limit, the reason word against the accepted
  list, the minimum length, a code-shaped token in `subject` or `body`, and a
  `data` field named `files` whose value is not a list of paths — exit 0, 1
  with the offending line or field named, 2 when it could not run. It is the
  same argument as every other command in `tools/`: a rule a memoryless run has
  to recall from a vendored paragraph is enforced at the reliability of reading,
  and the paragraph is already provably incomplete
- First step: it cannot be authoritative here, because the authority is
  `runtime/board/store.py` at headquarters and a copy of a validator drifts from
  what it validates the day the store changes — which is the trap L-A35 names.
  So either the store grows a dry-run route and this tool calls it, which is the
  right shape and is not this repository's to build, or the local version is
  written as advisory and says so in its own output, with the two rules above
  added to the standard's paragraph by whoever owns it. The engineer seat can
  write the advisory one in this product; the honest fix is one route at
  headquarters
- Cost: $0
- Status: proposed

