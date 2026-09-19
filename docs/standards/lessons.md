<!-- Vendored from alexandrapaiz/alexandra-systems standards/lessons.md @ 08e67e4 (2026-09-19). Kept current by the exo centralizer's autonomous sync PRs — never edit locally. -->

# Company Lessons Register

The owner's corrections, generalized into standing law and distributed
to every product. Maintained ONLY by the exo centralizer
(prompts/exo-centralizer.md); products receive it as a vendored copy at
`docs/standards/lessons.md` via autonomous sync PRs. Every seat in
every product reads its role's section before working. Sources: each
product's `docs/agents/lessons.md` entries marked `portable: yes`.

Format: rule, then provenance (product, date, owner's words where
captured).

## any (all seats, all products)

- **L-A1 — Mechanism over marketing-speak.** Explain by naming the
  actual mechanism; never gloss. (epitome L1, 2026-09-18: owner
  rejected marketing language in technical artifacts.)
- **L-A2 — "Architecture" means system design.** When the owner asks
  for architecture, she means components, data flow, and boundaries,
  not vision prose. (epitome L2, 2026-09-18.)
- **L-A3 — "Comprehensive" means an engineer could start from it.**
  A comprehensive document is one a fresh engineer could execute
  without asking questions. (epitome L3, 2026-09-18.)
- **L-A4 — A repeated correction is a register defect.** If the owner
  corrects the same thing twice, the failure belongs to this register
  and the charter that failed to bind it, not to the artifact.
  (epitome L4, 2026-09-18.)
- **L-A5 — House voice in owner-facing prose.** Plain sentences,
  transition words, no stylistic em dashes, no semicolon joins, no
  flourish. (alexandria house rule; owner-set, portfolio-wide.)
- **L-A6 — Judge a run by its artifacts, never its conclusion.**
  (alexandria incidents 8 and 11.)
- **L-A7 — Exemplar first, feedback loop second.** When the owner has
  approved an artifact of the same genre anywhere in the portfolio, a
  new artifact starts from reading that exemplar in full, before the
  first draft; iterating on described feedback converges on the
  description, never on what she approved. The known exemplar for
  plans and their decks: Ursa docs/design/product-plan.md and
  docs/presentations/product-plan/. (epitome incident 1, 2026-09-19:
  "highly dissatisfied with the presentation still we will abandon for
  now. ursa did a much better job" — five revisions each fixed the
  named gap and the artifact was abandoned anyway.)
- **L-A8 — Presentations: seat-authored content, alexandria register,
  direction at the end.** A presentation belongs to the seat whose
  work it presents: that seat authors the content document in Copy /
  Speaker notes / Visual direction form and the chair renders, never
  authors. Copy is one declarative statement or one real quote per
  slide, jargon-free (ADR numbers, tier names, protocol verbs live in
  notes only), sources cited in notes by file-line or link,
  confidence levels carried into the Copy; the deck ends with
  recommendations the owner can accept or reject one by one. The
  named portfolio exemplar for presentations is alexandria
  docs/sales/pitch-deck.md — the durable rule is render the exemplar
  the owner loves, because this is the fourth register correction and
  each prior fix encoded the previous failure instead of that
  exemplar. (epitome L8, 2026-09-19: "i am big fan of alexandria
  presentations, i hate almost all presentations by epitome"; full
  verbatim quote in epitome L8; codified in documents.md §2b and
  checklist items 10-12.)
- **L-A9 — Recording a rule is not enforcing it.** A ruling written to
  a register changes nothing by itself. Whoever produces an artifact
  checks it against the governing register line by line before the
  artifact reaches the owner, and that check is the first gate in the
  producing seat's own grading, never a later review step. (alexandria
  incident 20, 2026-09-19: a heading ruling was recorded in
  docs/voice/taste.md the same hour it was given, the next sample
  still printed the banned framework labels, and the owner had to
  repeat herself with "AGAIN". Companion to L-A4 and L-X1: L-A4 names
  the repeat as a register defect, L-X1 closes the loop in the tree,
  and this rule places the check before delivery.)
- **L-A10 — One file, one owning charter.** Every file a seat writes
  names exactly one owning charter. When two seats need the same file,
  it is split by named section with an owner recorded in both charters.
  A seat that finds itself in contested territory yields and files the
  conflict rather than winning the race. (Atelier L3, 2026-09-19,
  `portable: yes`: prompts/pm-agent.md and prompts/exo-agent.md both
  told their seat to write docs/agents/pending.md and both seats did so
  within the same hour of their first runs.)
- **L-A11 — A defect that recurs across products belongs to HQ.**
  L-A4 makes a repeated correction a register defect inside one
  product. One level up: when the same defect appears in a second
  product, the fix is owed to this register and to the standard it
  governs, not to the second product's copy. Fixing it per product a
  second time is the same failure L-A4 names. (epitome L5, 2026-09-19,
  owner on a presentation carrying a defect already corrected in Ursa:
  "i believe alexandra sys. company should be doing agent hqs because i
  have the same dissatisfaction with this presenattion." This rule is
  the centralizer's own reason for existing, and HQ incident 1 is the
  case where its absence cost her the same correction twice.)

## engineer

- **L-E1 — No UI annotations.** Never append explanatory subtitles to
  headings in her interfaces: bare nouns, units in note slots.
  (owner law, portfolio-wide, predates the company.)
- **L-E2 — Real files, real commands, real tradeoffs.** Technical
  artifacts show actual paths, commands, and the tradeoff taken, never
  process-speak. (owner correction pattern, 2026-09.)
- **L-E3 — Ship first, then work.** Draft PR in the first turns, commit
  as you go; a died run must still ship its partial work. (alexandria
  incident 3; encoded in standards/workflow-template.yml.)
- **L-E4 — Systems architecture covers the full stack, and the
  connective stack is part of it.** A product's systems architecture
  means "actually everything from infrastructure to data storage to
  cloud to containers," with actual named tooling proposals, and it
  includes distribution, because "distribution is a part of
  engineering": the integrations (Vercel, Supabase, Clerk, Linear,
  Claude, OpenAI, and the rest of the stack) are mapped as both system
  components and distribution surfaces — the stack you build on is
  the stack you distribute through. Full requirements:
  standards/engineering-artifacts.md items 7 and 8. (Owner fine-tune,
  taught once pre-HQ, re-taught 2026-09-19 on epitome; full verbatim
  quote in engineering-artifacts.md provenance and epitome L6; HQ
  incident 1.)
- **L-E5 — A plan is grounded in one real case with real numbers.**
  What separates the approved Ursa plan from the abandoned epito one,
  beyond the standard's letter: a single real dogfood case threaded
  through every section, actual payloads from a real run ("no
  invented figure"), verbatim user quotes as evidence, a "Done when
  <observable event>" condition on every milestone, and diagrams
  specified node by node with typed edge labels. Schemas with no
  filled example and phases with no done-condition read as marketing
  no matter how many tables surround them. (Ursa
  docs/design/product-plan.md §4/§5/§11 vs epitome
  docs/architecture.md, 2026-09-19; the abandoned artifact literally
  missed engineering-artifacts.md requirements 1 and 3 — the standard
  needed adherence, not amendment.)
- *Pending harvest: the owner reports substantial engineer corrections
  in Ursa chair sessions not yet captured in any register (partially
  harvested: Incident 3 → engineering-artifacts.md, L-E4, L-E5). First
  centralizer task: finish the harvest with the owner.*

## pm

- **L-P1 — Product outranks plumbing.** When triage competes, the
  product-facing item wins; plumbing serves shipping. (alexandria
  incident 12 / ADR-26.)
- **L-P2 — Respect lived-in documents.** Where a product already has a
  working planning artifact (Atelier's SPRINTS.md), the seat adopts its
  format and voice; the standard bends, recorded as a deviation.
  (Atelier bootstrap, 2026-09-19.)

- **L-P3 — The PM seat must relieve the owner, not just run
  ceremonies.** Owner, 2026-09-19: "pm feels quite dormant across all
  the projects. im basically doing its job in the creative direction
  and synchronous agent guidance aspect." Rule: a PM seat's output is
  measured by owner relief — it prepares direction as choices (decision
  memos, options with a recommendation, briefs before she has to
  think), and it carries synchronous-mode guidance of working agents
  (orientation notes, mid-sprint steering) rather than leaving that to
  the owner by default. Async ceremonies alone do not discharge the
  seat. (Portfolio-wide observation; charters due for revision against
  this rule.)

- **L-P4 — Purchases wait on the worthiness gate.** Spending queues
  behind the owner's judgment that the product has earned it, carried
  as a dependency chain, never as a dated task. No seat schedules her
  money. (Atelier L1, 2026-09-19: "the $99 waits for the product to
  earn it".)

## exo

- **L-X1 — Implement, don't archive.** An incident is closed when the
  fix is in the tree, never when it is written down. (alexandria
  incident 13.)
- **L-X2 — Secret first, schedules last.** No cron until the seat
  passes a supervised dispatch with a verified token. (Ursa incident 1:
  scheduled seats with an invalid token produced 0 successful runs.)
- **L-X3 — Caps from evidence, and only from representative
  evidence.** Turn caps at 2× highest observed `num_turns`, floor 100;
  models asserted from run logs' `modelUsage`, never from config
  intent. The evidence only counts when the run executed the seat's
  full duties. A smoke run's `num_turns` shows that the plumbing works
  and nothing more, so it never lowers a cap; until a representative
  run exists the cap stands untouched and the PR says plainly that it
  rests on no evidence yet. (alexandria incidents 9 and 10 for the
  rule; Atelier L2, 2026-09-19, `portable: yes`, for the
  qualification: run 35463415653 was a pm smoke run reporting
  `num_turns` 13, and applying the rule literally would have cut pm and
  exo from 120 to the floor on the strength of a run that did no pm
  work.)
- **L-X4 — Reach is proven by a write, never by a read.** A credential
  check that only reads proves nothing, because public repositories
  read anonymously and a token with no grant at all returns the same
  200. Reach is verified by a write the seat then undoes: create a
  throwaway ref at the default branch head and delete it, never
  touching a protected branch. A repository that reads but does not
  write is recorded as unreachable. (HQ incident 2, 2026-09-19: the
  first centralizer run read three portfolio repos successfully with a
  token that had `pull: false, push: false` on all three, and the
  supervised re-run reproduced it as a negative control, where
  atelier-app returned `main` to a read and 403 to a write on the same
  token in the same job.)
- **L-X5 — Secrets: presence and length, never the value.** A seat
  checks that a secret exists with `${VAR:+set}` and `${#VAR}` and
  never prints, echoes, or pipes the value, including through a
  redaction filter. Redaction is not a safety layer, it is a guess
  about a format. (HQ incident 3, 2026-09-19: the centralizer printed
  `EXO_TOKEN` into its own run log because its `sed` pattern covered
  `ghp_` and the classic prefixes but not the fine-grained
  `github_pat_` this PAT uses. The check it actually wanted never
  needed the value.)
