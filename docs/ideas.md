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
