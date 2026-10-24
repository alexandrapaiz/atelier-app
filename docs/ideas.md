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
