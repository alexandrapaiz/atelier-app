# Incident Register — Atelier

Blameless, exo-owned. Inherited law from alexandria's register applies
from day zero: judge runs by artifacts never conclusions; ship first,
then work; secret first, schedules last; caps from evidence (see
docs/standards/lessons.md). An incident is closed when the fix is in
the tree.

Format: number, one-line title, date. Then what happened with the
evidence that shows it, the fix, and whether the fix has landed. An
incident stays open until its fix is in the tree.

### I1 — Two charters claim docs/agents/pending.md (2026-09-19)

**What happened.** The pm seat's first supervised run (run
35463415653, PR #1) created `docs/agents/pending.md` as a tracker of
what each seat owes and what waits on the owner. The exo seat's first
supervised run started to create the same path as a register of fixes
it cannot reach, with ready-to-paste content. Two seats wrote the same
file in the same hour, and the two PRs would have conflicted on merge.

**Evidence.** `prompts/pm-agent.md` step 3: "Maintain
docs/agents/pending.md: what each seat owes, open PRs awaiting the
owner, owner-only actions". Its boundaries then exclude only lessons
and incidents from the pm lane, so it reads as owning pending.
`prompts/exo-agent.md` step 2: "What you cannot reach ... record in
docs/agents/pending.md with exact ready-to-paste content." Its
boundaries claim "docs/agents/ (lessons, incidents, pending)". Both
readings are correct, which makes this a charter defect rather than a
seat error.

**What this run did.** Yielded the file. The exo seat dropped its
version so PR #1 merges clean, because the exo seat adjudicating an
ownership dispute in its own favor while auditing that dispute is the
wrong shape. Blocked fixes are recorded here until the owner rules.

**The fix, for the owner to apply.** Charter edits merge only by the
owner, so this seat cannot land it. The smaller of the two options is
to keep pending as the pm seat's file and give the exo seat a named
section inside it. In `prompts/exo-agent.md`, step 2, replace "record
in docs/agents/pending.md with exact ready-to-paste content" with:

```
record in docs/agents/pending.md under the "Blocked fixes (exo)"
heading, with exact ready-to-paste content. The pm seat owns the rest
of that file and must not edit or reorder your section.
```

And in `prompts/exo-agent.md`, Boundaries, replace "You write
docs/agents/ (lessons, incidents, pending)" with:

```
You write docs/agents/lessons.md and docs/agents/incidents.md in full,
plus the "Blocked fixes (exo)" section of docs/agents/pending.md.
```

And in `prompts/pm-agent.md`, Boundaries, after "docs/agents/pending.md"
add:

```
(except its "Blocked fixes (exo)" section, which the exo seat owns)
```

**Status.** CLOSED 2026-09-19: ownership rule applied to both charters
by the chair on the owner's autonomy directive (revert = reopen).

### I2 — ADR-015 open routing is configured but not in effect (2026-09-19)

**What happened.** Commit 89bbf8e added open-source routing for the pm
seat. In the seat's first real run, the open-routed step did not
execute and the seat ran on Claude.

**Evidence.** Run 35463415653 step list: step 3 "Seat run
(open-routed)" conclusion `skipped`, step 4 "Seat run (Claude)"
conclusion `success`. The step is gated on `env.OPENROUTE != ''`, which
is fed by `secrets.OPENROUTE_API_KEY`, so the skip means that secret is
unset. The run's own result block asserts what actually served the
turns:

```
"modelUsage": {
  "claude-haiku-4-5-20251001": { ... },
  "claude-sonnet-5":           { ... }
}
```

Reading the workflow alone would tell you the pm seat runs on an open
model. The log says otherwise. This is L-X3's "assert models from run
logs, never from config intent" catching its first case here.

**Assessment.** The fallback behaved exactly as designed, so this is
not a broken run. It is a live gap between what the repo's config
implies and what is true, and it stays a gap until the secret is set.

**The fix.** Owner-only, because seats never touch secrets. Set
`OPENROUTE_API_KEY` and `OPENROUTE_BASE_URL` in the repository secrets
to activate ADR-015, or leave them unset deliberately and note in
`docs/decisions.md` that ADR-015 is accepted but dormant. Either
closes this. Silence does not.

**Status.** CLOSED 2026-09-19: OPENROUTE secrets set by the owner
(Moonshot/Kimi); next pm run's modelUsage is the verification.

### I3 — The workflow prompt overrides the pm charter's branch name (2026-09-19)

**What happened.** The pm charter fixes the branch convention at
`pm/sprint-YYYY-MM-DD`. The dispatch prompt embedded in the workflow
tells the seat to use `pm/YYYY-MM-DD-slug`. The seat followed the
prompt and branched `pm/2026-09-19-pending-tracker`.

**Evidence.** `prompts/pm-agent.md`, Boundaries: "One PR per run on
branch pm/sprint-YYYY-MM-DD". `.github/workflows/agent-pm.yml`, both
prompt blocks: "create a branch pm/YYYY-MM-DD-slug". Actual branch on
PR #1: `pm/2026-09-19-pending-tracker`.

**Why it matters beyond cosmetics.** The workflow prompt and the
charter are two sources of truth for the same rule, and the prompt
silently wins because the seat reads it first. Any future rule that
lands in only one of them binds or fails to bind depending on which
file a seat happens to trust. The branch name is the cheap instance of
that problem showing up early.

**The fix.** One of the two must stop specifying it. The charter is
the durable document, so the workflow prompt should defer. In all
three of `.github/workflows/agent-pm.yml`,
`.github/workflows/agent-engineer.yml` and
`.github/workflows/agent-exo.yml`, replace the branch sentence with:

```
Within your first turns, create a branch named by your charter's
branch convention and open a DRAFT pull request with
`gh pr create --draft`, committing into it as you work — a died
run must still ship its partial work.
```

This seat can reach workflow files, but the dispatch for this run
scoped it to one small deliverable, and rewriting the prompt block of
all three seat workflows mid-smoke-run would change how the engineer
and exo seats boot before anyone has watched them boot once. Deferred
deliberately, not forgotten.

**Status.** CLOSED 2026-09-19: workflow prompts now defer to each
charter's branch convention (chair-applied).

## Next run must check

The charter requires each run to check the previous run's list first.
This is the first exo run, so this list starts here.

1. Did the owner rule on I1? If pending.md now has a "Blocked fixes
   (exo)" section, use it and close I1. If not, keep recording blocked
   fixes in this file and raise I1 again, because a repeated collision
   is a register defect under L-A4.
2. Is `OPENROUTE_API_KEY` set? Check the pm seat's most recent run for
   whether step "Seat run (open-routed)" still skips. Assert the model
   from `modelUsage` in the log, never from the workflow file.
3. Apply I3 if no seat workflow has changed shape since. Verify each
   seat's actual branch name against its charter afterward.
4. Re-derive turn caps once a seat has run its full duties rather than
   a smoke run. See L2. The current caps of 120, 120 and 200 have no
   representative evidence under them yet.
5. Check whether PR #1 and PR #2 both merged. Two open seat PRs
   touching docs/agents/ is the condition that produced I1.
