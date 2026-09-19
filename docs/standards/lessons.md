<!-- Vendored from alexandrapaiz/alexandra-systems standards/lessons.md @ 721127d (2026-09-19). Kept current by the exo centralizer's autonomous sync PRs — never edit locally. -->

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
- *Pending harvest: the owner reports substantial engineer corrections
  in Ursa chair sessions not yet captured in any register. First
  centralizer task: harvest them with the owner.*

## pm

- **L-P1 — Product outranks plumbing.** When triage competes, the
  product-facing item wins; plumbing serves shipping. (alexandria
  incident 12 / ADR-26.)
- **L-P2 — Respect lived-in documents.** Where a product already has a
  working planning artifact (Atelier's SPRINTS.md), the seat adopts its
  format and voice; the standard bends, recorded as a deviation.
  (Atelier bootstrap, 2026-09-19.)

## exo

- **L-X1 — Implement, don't archive.** An incident is closed when the
  fix is in the tree, never when it is written down. (alexandria
  incident 13.)
- **L-X2 — Secret first, schedules last.** No cron until the seat
  passes a supervised dispatch with a verified token. (Ursa incident 1:
  scheduled seats with an invalid token produced 0 successful runs.)
- **L-X3 — Caps from evidence.** Turn caps at 2× highest observed
  `num_turns`, floor 100; models asserted from run logs' `modelUsage`,
  never from config intent. (alexandria incidents 9 and 10.)
