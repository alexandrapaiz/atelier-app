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

*Provenance note for the centralizer: L1 carries the owner's verbatim
words under "Owner said". L2 and L3 were derived by the exo seat from
run evidence and carry "Evidence" instead, because no owner correction
sits behind them. Both kinds keep the `role` and `portable` fields the
harvest depends on.*
