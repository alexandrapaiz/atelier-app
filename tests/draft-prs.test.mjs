/* tools/check-draft-prs.sh — the seat-facing gate whose exit status three seat
   workflows now paste. Every case here is a reading the gate once got wrong, or
   one the conservative default has to keep getting right.

   The method: a real git repository in a temp directory, so the branch the
   script reads is a branch git actually reports, and a stub `gh` first on PATH
   serving fixture files. Nothing here touches the network or this checkout. */
import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const TOOL = resolve("tools/check-draft-prs.sh");

/* The stub answers the calls the script makes, from files, so a test says what
   GitHub said. A fixture value of "fail" makes that call exit non-zero, which
   is how the unreadable readings are reached.

   There is deliberately no case for `gh run list`. The liveness reading moved
   to the Actions runs API on 2026-10-24 to get each in-flight run's workflow
   path, and a stub that still answered the old call would let a revert to the
   count pass green. With the case gone, a revert reaches `*)` and every
   liveness test fails loudly. */
/* The two `gh pr list` calls take the same --json fields and are told apart by
   their --jq, which is the only thing that differs: the drafts the check judges
   (`select(.isDraft)`) and the ready pull requests a merger could merge instead
   (`select(.isDraft | not)`). Matching on the jq is deliberate rather than
   convenient — change either filter and the call falls through to `*)` and the
   suite says so, where a looser pattern would quietly serve the wrong list.

   `commits/<ref>` is the tree reading and `commits?sha=` is the commit date.
   A ref with no row in the `trees` fixture answers with a tree derived from its
   own name, so the default across unrelated branches is "every tree differs",
   which is the case a containment check must not fire on. */
const STUB = `#!/usr/bin/env bash
F="$GH_FIXTURE"
emit() { # fixture file; "fail" means the call itself failed
  [ -f "$F/$1" ] || exit 7
  [ "$(cat "$F/$1")" = fail ] && exit 7
  cat "$F/$1"
}
all="$*"
case "$all" in
  "auth status"*)      exit 0 ;;
  "repo view"*)        emit base ;;
  *"isDraft | not"*)   emit siblings.tsv ;;
  "pr list"*)          emit prs.tsv ;;
  *actions/runs*)      emit runs ;;
  *compare*)           emit compare ;;
  *commits/*)
    ref="\${all#*commits/}"; ref="\${ref%% *}"
    t=""
    [ -f "$F/trees" ] && t=$(awk -F'\t' -v r="$ref" '$1 == r { print $2; exit }' "$F/trees")
    [ "$t" = fail ] && exit 7
    [ -n "$t" ] || t="tree-of-$ref"
    echo "$t" ;;
  *commits*)           emit commitdate ;;
  *) echo "stub gh: no fixture for: $all" >&2; exit 9 ;;
esac
`;

/* An ISO timestamp this many minutes before now. The idle field is computed
   against the real clock, so a fixture that encodes "old" as a literal date
   stops meaning "old" the moment the clock passes it — and since 2026-10-24
   the check has a verdict that turns on that number, which makes the literal a
   test that quietly changes what it asserts. Every age below is a distance
   from now instead. */
const minutesAgo = n => new Date(Date.now() - n * 60_000).toISOString();

/* One run of the check. `files` are the fixture's contents; `branch` is the
   branch the repository is standing on; `args` go to the script. */
function run({ files = {}, branch = "atelier-engineer/2026-10-24-message", args = [], seats = ["engineer", "exo", "pm"], detach = false, workflows = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "drafts-"));
  const bin = join(dir, "bin");
  const fixture = join(dir, "fixture");
  mkdirSync(bin);
  mkdirSync(fixture);
  mkdirSync(join(dir, "repo", "tools"), { recursive: true });
  const repo = join(dir, "repo");

  writeFileSync(join(bin, "gh"), STUB);
  chmodSync(join(bin, "gh"), 0o755);

  /* `runs` is the workflow path of every run in flight on the branch, one per
     line, which is what the script's own --jq produces. Empty means nothing is
     in flight; absent means the call failed. */
  /* `siblings.tsv` empty is a reading — the queue holds no ready pull request —
     and "fail" is the read itself failing. The two must not print the same
     thing, which is why it is a default rather than an absence. */
  const defaults = { base: "main", "prs.tsv": "", "siblings.tsv": "", runs: "", compare: "4\t1", commitdate: minutesAgo(25 * 60) };
  for (const [name, body] of Object.entries({ ...defaults, ...files })) {
    writeFileSync(join(fixture, name), body);
  }

  copyFileSync(TOOL, join(repo, "tools", "check-draft-prs.sh"));
  /* The declared workflow path is load-bearing now, not filler: it is the
     string an in-flight run's own path is compared against. `workflows: false`
     declares the seats with no workflow at all, which is the case where
     nothing can read run=live. */
  writeFileSync(join(repo, "company.yaml"),
    "seats:\n" + seats.map(s => workflows
      ? `  - { name: ${s}, workflow: .github/workflows/agent-${s}.yml, cadence: on-dispatch, status: dormant }\n`
      : `  - { name: ${s}, cadence: on-dispatch, status: dormant }\n`).join(""));

  const git = (...a) => execFileSync("git", a, { cwd: repo, stdio: "pipe" });
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  git("add", "-A");
  git("commit", "-qm", "fixture");
  if (detach) git("checkout", "-q", "--detach", "HEAD");
  else git("checkout", "-qb", branch);

  try {
    const stdout = execFileSync("bash", ["tools/check-draft-prs.sh", ...args], {
      cwd: repo,
      encoding: "utf8",
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, GH_FIXTURE: fixture },
    });
    return { status: 0, stdout };
  } catch (e) {
    return { status: e.status, stdout: e.stdout ?? "", stderr: e.stderr ?? "" };
  }
}

const prs = rows => rows.map(([n, b]) => `${n}\t${b}`).join("\n") + "\n";
/* The ready pull requests, same shape, and the ref -> tree table the stub
   serves. A branch absent from `trees` gets a tree of its own, so a pair only
   collides when a test says it does. */
const siblings = prs;
const trees = rows => rows.map(([ref, t]) => `${ref}\t${t}`).join("\n") + "\n";

test("the branch this run is standing in reads live, not stranded", () => {
  const r = run({ files: { "prs.tsv": prs([[47, "atelier-engineer/2026-10-24-message"]]) } });
  assert.match(r.stdout, /^LIVE +#47 atelier-engineer\/2026-10-24-message .*run=self$/m);
  assert.equal(r.status, 0, "a pass's own draft is not a finding against it");
});

test("another seat's idle draft is still stranded, and still exits 1", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
  assert.match(r.stdout, /^STRANDED +#28 atelier-pm\/2026-10-21-message .*run=none$/m);
  assert.equal(r.status, 1);
});

test("own draft live beside a stranded one: both readings print, exit is 1", () => {
  const r = run({ files: { "prs.tsv": prs([[47, "atelier-engineer/2026-10-24-message"], [28, "atelier-pm/2026-10-21-message"]]) } });
  assert.match(r.stdout, /^LIVE +#47 .*run=self$/m);
  assert.match(r.stdout, /^STRANDED +#28 .*run=none$/m);
  assert.equal(r.status, 1, "one stranded draft is a finding even when the caller's own is live");
});

test("a detached HEAD has no own branch, so nothing is excused", () => {
  const r = run({ detach: true, files: { "prs.tsv": prs([[47, "atelier-engineer/2026-10-24-message"]]) } });
  assert.match(r.stdout, /^STRANDED +#47 .*run=none$/m);
  assert.match(r.stdout, /no own branch \(detached HEAD\)/);
  assert.equal(r.status, 1, "the conservative default survives the fix");
});

test("a seat workflow in progress still reads live for a branch that is not ours", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs: ".github/workflows/agent-pm.yml" } });
  assert.match(r.stdout, /^LIVE +#28 .*run=live$/m);
  assert.equal(r.status, 0);
});

/* 2026-10-24, the exo seat's second finding of the evening. The check counted
   in-flight runs on the branch and called any of them a live seat. The only
   workflow that runs on a seat branch in this repository is tests.yml, which
   fires on pull_request, so every push into an open draft bought the draft
   about twenty seconds of LIVE and the verdict depended on when the tests
   happened to run. Measured that evening: 26 runs on seat branches, every one
   tests.yml on pull_request, alive 17 to 30 seconds. */
test("a test job in flight is not a live seat, and does not excuse an idle draft", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs: ".github/workflows/tests.yml" } });
  assert.match(r.stdout, /^STRANDED +#28 .*run=ci$/m);
  assert.equal(r.status, 1, "a job on the branch is not a seat on the branch");
});

test("the verdict for an idle draft is the same whether or not its tests are running", () => {
  const quiet = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs: "" } });
  const testing = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs: ".github/workflows/tests.yml" } });
  assert.equal(quiet.status, testing.status, "two readers a minute apart must agree about the same draft");
  assert.match(quiet.stdout, /^STRANDED +#28 /m);
  assert.match(testing.stdout, /^STRANDED +#28 /m);
  /* The readings differ and say so, because a verdict names the reading it came
     from (L-E11). It is the verdict that must not flicker, not the field. */
  assert.match(quiet.stdout, /run=none$/m);
  assert.match(testing.stdout, /run=ci$/m);
});

/* Both orderings, because the list comes back newest first and a seat run and
   its branch's test job are in flight together whenever a seat pushes from the
   forge. Asserting one order grades nothing: it passes whether the loop stops
   at the seat workflow or merely happens to read it last. */
for (const [label, runs] of [
  ["a test job listed first", ".github/workflows/tests.yml\n.github/workflows/agent-pm.yml"],
  ["a test job listed after", ".github/workflows/agent-pm.yml\n.github/workflows/tests.yml"],
]) {
  test(`a seat workflow outranks ${label} in the same list`, () => {
    const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs } });
    assert.match(r.stdout, /^LIVE +#28 .*run=live$/m);
    assert.equal(r.status, 0, "a seat really executing there outranks the noise beside it");
  });
}

test("a fresh draft whose tests are running prints the statement about time, so the whole line holds still", () => {
  const r = run({ files: {
    "prs.tsv": prs([[52, "atelier-engineer/2026-10-24-message-2"]]),
    runs: ".github/workflows/tests.yml",
    commitdate: minutesAgo(4),
  } });
  /* Age outranks the CI reading in the field as well as in the verdict. The
     test job is alive precisely because somebody just pushed, so the draft is
     fresh in the same breath, and letting `ci` win the field would make the
     line flicker a minute later for a draft whose verdict never moved. */
  assert.match(r.stdout, /^FRESH +#52 .*run=fresh$/m);
  assert.equal(r.status, 0);
});

test("seats declared with no workflow can reach no live reading, and the summary says so", () => {
  const r = run({ workflows: false, files: {
    "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]),
    runs: ".github/workflows/agent-pm.yml",
  } });
  assert.match(r.stdout, /^STRANDED +#28 .*run=ci$/m);
  assert.match(r.stdout, /no seat workflow declared \(run=live unreachable\)/);
  assert.equal(r.status, 1, "a reading nothing can reach is named, not assumed clean");
});

test("an unreadable liveness reading is stranded, not excused", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs: "fail" } });
  assert.match(r.stdout, /^STRANDED +#28 .*run=unreadable$/m);
  assert.equal(r.status, 1);
});

test("an unreadable compare never reports carries=nothing", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), compare: "fail" } });
  assert.match(r.stdout, /^STRANDED +#28 .*carries=unreadable/m);
  assert.doesNotMatch(r.stdout, /carries=nothing/, "a failed read must not tell a reader to close a pull request");
  assert.equal(r.status, 1);
});

test("a branch that changes no file carries nothing", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), compare: "1\t0" } });
  assert.match(r.stdout, /^STRANDED +#28 .*carries=nothing/m);
  assert.equal(r.status, 1);
});

test("a seat name company.yaml does not declare is an unasked question, not a pass", () => {
  const r = run({ args: ["--seat", "enginer"], files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
  assert.equal(r.status, 2, "a false all-clear must not be one character away");
  assert.match(r.stderr, /no seat named enginer/);
});

test("a declared seat with no drafts of its own is a real clean pass", () => {
  const r = run({ args: ["--seat", "engineer"], files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /0 draft\(s\) in scope, 1 out of scope, none stranded/);
});

test("--all reads a branch no seat name matches", () => {
  const r = run({ args: ["--all"], files: { "prs.tsv": prs([[19, "exo-centralizer/2026-10-14-dispatch-guards"]]) } });
  assert.match(r.stdout, /^STRANDED +#19 exo-centralizer/m);
  assert.equal(r.status, 1);
});

test("both live seat-branch conventions are in scope", () => {
  const r = run({ files: { "prs.tsv": prs([[11, "exo/2026-09-30-workflow-l-e8"], [40, "atelier-exo/2026-10-24-message"]]) } });
  assert.match(r.stdout, /^STRANDED +#11 exo\//m);
  assert.match(r.stdout, /^STRANDED +#40 atelier-exo\//m);
  assert.equal(r.status, 1);
});

test("a company.yaml naming no seats cannot be answered", () => {
  const r = run({ seats: [], files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /named no seats/);
});

/* The freshness guard. Before it, the only readings that could keep a draft off
   the stranded list were run=self (the caller's own branch) and run=live (an
   Actions run). Neither can see another seat's host window running in the same
   minute, so a colleague's four-minute-old draft — opened empty and draft-first,
   which is what every charter here mandates — printed
   `STRANDED ... carries=nothing`, and carries=nothing is by this tool's own
   README the one reading that tells a reader to close a pull request. */

test("a draft minutes old is too fresh to judge, not stranded", () => {
  const r = run({
    files: {
      "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]),
      commitdate: minutesAgo(4),
      compare: "1\t0",
    },
  });
  assert.match(r.stdout, /^FRESH +#52 atelier-pm\/2026-10-24-message-2 idle=4m .*carries=nothing run=fresh$/m);
  assert.equal(r.status, 0, "a draft nothing has had time to abandon is not a finding");
  assert.match(r.stdout, /1 too fresh to judge \(under 60m\)/,
    "a draft left unjudged must not read as one examined and cleared");
});

test("a draft one minute past the threshold is stranded, so the boundary is graded", () => {
  const r = run({ files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: minutesAgo(61) } });
  assert.match(r.stdout, /^STRANDED +#52 .*idle=1h .*run=none$/m);
  assert.equal(r.status, 1);
});

test("a draft at exactly the threshold is stranded: the window is open at its far end", () => {
  const r = run({ files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: minutesAgo(60) } });
  assert.match(r.stdout, /^STRANDED +#52 .*run=none$/m);
  assert.equal(r.status, 1, "60 minutes is not under 60 minutes");
});

test("an unreadable idle field cannot reach the fresh test, so it is still stranded", () => {
  const r = run({ files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: "fail" } });
  assert.match(r.stdout, /^STRANDED +#52 .*idle=unreadable .*run=none$/m);
  assert.doesNotMatch(r.stdout, /run=fresh/, "a failed read must never buy a draft an excuse");
  assert.equal(r.status, 1);
});

test("--fresh-under 0 judges every draft, which is the sweep a merger wants", () => {
  const r = run({
    args: ["--fresh-under", "0"],
    files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: minutesAgo(4) },
  });
  assert.match(r.stdout, /^STRANDED +#52 .*idle=4m .*run=none$/m);
  assert.equal(r.status, 1);
  assert.doesNotMatch(r.stdout, /too fresh to judge/);
});

/* The guard's own off switch left no trace. `--fresh-under 0` holds the fresh
   counter at zero, so the clause that names the threshold cannot fire, and the
   one call that excused nothing by instruction was the one whose output never
   mentioned the setting. The summary line is what a reader is told to close a
   pull request on, so the two sweeps have to be distinguishable there and not
   only in the arguments the reader cannot see. */

test("a swept queue and a guarded one do not print the same summary line", () => {
  const swept = run({
    args: ["--fresh-under", "0"],
    files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: minutesAgo(4) },
  });
  const guarded = run({
    files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: minutesAgo(90) },
  });
  const summary = r => r.stdout.split("\n").find(l => l.startsWith("check-draft-prs:"));

  assert.equal(swept.status, 1);
  assert.equal(guarded.status, 1);
  assert.match(swept.stdout, /freshness guard off/,
    "the caller turned the guard off and the verdict does not say so");
  assert.doesNotMatch(guarded.stdout, /freshness guard off/,
    "a guard that was on must not report itself off");
  assert.notEqual(summary(swept), summary(guarded),
    "one stranded draft under a sweep and one under a live guard are different findings");
});

test("--fresh-under is only honoured as whole minutes, never silently defaulted", () => {
  for (const bad of ["an-hour", "1.5", "-5", ""]) {
    const r = run({ args: ["--fresh-under", bad], files: { "prs.tsv": prs([[52, "atelier-pm/x"]]) } });
    assert.equal(r.status, 2, `--fresh-under ${JSON.stringify(bad)} must be an unasked question`);
    assert.match(r.stderr, /whole number of minutes/);
  }
});

test("--fresh-under widens the window, and the summary names the number it used", () => {
  const r = run({
    args: ["--fresh-under", "180"],
    files: { "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]), commitdate: minutesAgo(90) },
  });
  assert.match(r.stdout, /^FRESH +#52 .*idle=1h .*run=fresh$/m);
  assert.match(r.stdout, /1 too fresh to judge \(under 180m\)/);
  assert.equal(r.status, 0);
});

test("a fresh draft beside a stranded one: both readings print, exit is 1", () => {
  const r = run({
    files: {
      "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"], [28, "atelier-pm/2026-10-21-message"]]),
      commitdate: minutesAgo(4),
    },
    args: ["--all"],
  });
  /* Both drafts share one commitdate fixture, so the stranded one is reached by
     the flag rather than by age: the point of the case is that a fresh reading
     never suppresses a stranded one in the same output. */
  const strict = run({
    args: ["--fresh-under", "0", "--all"],
    files: {
      "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"], [28, "atelier-pm/2026-10-21-message"]]),
      commitdate: minutesAgo(4),
    },
  });
  assert.equal(r.status, 0, "two fresh drafts are two unjudged readings, not two findings");
  assert.match(r.stdout, /2 too fresh to judge/);
  assert.equal(strict.status, 1);
  assert.match(strict.stdout, /^STRANDED +#52/m);
  assert.match(strict.stdout, /^STRANDED +#28/m);
});

test("idle prints minutes under an hour and whole hours above it", () => {
  const m = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), commitdate: minutesAgo(47) } });
  assert.match(m.stdout, /idle=47m/, "idle=0h cannot tell four minutes from fifty-nine");
  const h = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), commitdate: minutesAgo(71 * 60) } });
  assert.match(h.stdout, /idle=71h/);
});

test("--help prints the whole header, including the fields a reader greps", () => {
  const r = run({ args: ["--help"] });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /run=self/, "the help truncated before the field list");
  assert.match(r.stdout, /run=fresh/, "the help does not document the third verdict");
  assert.match(r.stdout, /--fresh-under/, "the help does not document the threshold flag");
  assert.match(r.stdout, /Requires: git, gh/, "the help truncated before its last line");
});

/* The duplicate reading, 2026-10-25 (I20). `carries` is computed against the
   base and against nothing else, so it answers "is this diff non-empty" where
   the question a merger asks before closing is "does this work exist anywhere I
   can already reach". Measured on the first genuinely stranded draft this
   product produced: #65 printed `carries=work`, and its head tree was
   34f0c07f43c7da0e58ba72ba2e11d68a07f381e0 — the same tree as #62, which was
   open and ready at that moment. Closing #65 cost nothing and the field a
   merger reads before closing said it would cost work.

   The relation is tree identity and not commit ancestry, which is the other way
   to write this and the way that does not work here: #62's head is an *ancestor*
   of #65's, so "is this draft's head contained in another open head" is false of
   the exact pair the finding is about. `carries` counts files, so its containment
   reading is asked of files too. */

test("a draft whose tree a ready pull request already holds carries a duplicate, not work", () => {
  const r = run({
    files: {
      "prs.tsv": prs([[65, "atelier-exo/2026-10-24-message-6"]]),
      "siblings.tsv": siblings([[62, "atelier-exo/2026-10-24-message-5"]]),
      trees: trees([
        ["atelier-exo/2026-10-24-message-6", "34f0c07f"],
        ["atelier-exo/2026-10-24-message-5", "34f0c07f"],
      ]),
    },
  });
  assert.match(r.stdout, /^STRANDED +#65 .*carries=duplicate#62 run=none/m);
  assert.doesNotMatch(r.stdout, /carries=work/,
    "the work is reachable through #62, so calling it unfinished work is the defect");
  assert.equal(r.status, 1, "a reachable duplicate is still a draft nobody can merge");
});

/* The negative case, and the one that matters. Eleven fixtures behind the
   previous entry in this file all passed for three runs while the clause they
   covered was wrong, so a containment check is graded on what it declines to
   say: one that fires on everything is the same defect as one that fires on
   nothing. */
test("two unrelated open drafts: neither carries a duplicate of the other", () => {
  const r = run({
    args: ["--all"],
    files: {
      "prs.tsv": prs([[40, "atelier-exo/2026-10-24-message"], [28, "atelier-pm/2026-10-21-message"]]),
      "siblings.tsv": siblings([[67, "atelier-engineer/2026-10-25-hook"]]),
    },
  });
  assert.match(r.stdout, /^STRANDED +#40 .*carries=work /m);
  assert.match(r.stdout, /^STRANDED +#28 .*carries=work /m);
  assert.doesNotMatch(r.stdout, /duplicate/, "no two of these three branches share a tree");
  assert.equal(r.status, 1);
});

test("a ready sibling with a different tree is not a duplicate", () => {
  const r = run({
    files: {
      "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]),
      "siblings.tsv": siblings([[62, "atelier-exo/2026-10-24-message-5"]]),
      trees: trees([
        ["atelier-pm/2026-10-21-message", "aaaa1111"],
        ["atelier-exo/2026-10-24-message-5", "bbbb2222"],
      ]),
    },
  });
  assert.match(r.stdout, /^STRANDED +#28 .*carries=work /m);
  assert.equal(r.status, 1);
});

/* Two drafts with one tree is the case where firing would be the defect. The
   forge refuses to merge a draft at all, so "reachable" has to mean reachable
   by the person deciding whether to close, and pointing each of a pair at the
   other invites a reader to close both and lose the work twice. */
test("a draft sharing its tree with another draft is not a duplicate, because nobody can merge a draft", () => {
  const r = run({
    args: ["--all"],
    files: {
      "prs.tsv": prs([[65, "atelier-exo/a"], [66, "atelier-exo/b"]]),
      "siblings.tsv": "",
      trees: trees([["atelier-exo/a", "same0000"], ["atelier-exo/b", "same0000"]]),
    },
  });
  assert.match(r.stdout, /^STRANDED +#65 .*carries=work /m);
  assert.match(r.stdout, /^STRANDED +#66 .*carries=work /m);
  assert.doesNotMatch(r.stdout, /duplicate/,
    "either of a pair of drafts pointing at the other is an instruction to lose the work");
  assert.equal(r.status, 1);
});

test("carries=nothing is never upgraded to a duplicate: an empty diff is a different fact", () => {
  const r = run({
    files: {
      "prs.tsv": prs([[52, "atelier-pm/2026-10-24-message-2"]]),
      "siblings.tsv": siblings([[62, "atelier-exo/2026-10-24-message-5"]]),
      compare: "1\t0",
      trees: trees([
        ["atelier-pm/2026-10-24-message-2", "cccc3333"],
        ["atelier-exo/2026-10-24-message-5", "cccc3333"],
      ]),
    },
  });
  assert.match(r.stdout, /^STRANDED +#52 .*carries=nothing /m);
  assert.equal(r.status, 1);
});

test("a duplicate reading nobody could take is named on the summary line, not assumed absent", () => {
  const unreadable = run({
    files: {
      "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]),
      "siblings.tsv": "fail",
    },
  });
  assert.match(unreadable.stdout, /^STRANDED +#28 .*carries=work /m);
  assert.match(unreadable.stdout, /mergeable siblings unreadable \(no duplicate reading\)/,
    "a duplicate this check could not look for is not a draft with no duplicate");
  assert.equal(unreadable.status, 1);

  const partial = run({
    files: {
      "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]),
      "siblings.tsv": siblings([[62, "atelier-exo/2026-10-24-message-5"]]),
      trees: trees([["atelier-exo/2026-10-24-message-5", "fail"]]),
    },
  });
  assert.match(partial.stdout, /1 head tree\(s\) unreadable \(a duplicate could be missed\)/);
  assert.equal(partial.status, 1);
});

/* Entry 21, 2026-10-25. The exo seat read this file's own warning about pipes
   and then four commands later ran `check-seat-surface.sh --all | head`, read
   exit 0 out of the pipe, and recorded that the tool accepts an undeclared
   flag. Unpiped it exits 2, as the header says. The warning was right and its
   placement was the defect: a correctness property enforced only by a paragraph
   a memoryless reader has to recall is not enforced. So the status is in the
   text of the last line, where a pipe cannot reach it. */

test("the summary line names the status it is about to return", () => {
  const stranded = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
  assert.equal(stranded.status, 1);
  assert.match(stranded.stdout, /none stranded|are stranded/);
  assert.match(stranded.stdout.trimEnd().split("\n").pop(), /\(exit 1\)$/,
    "a reader who piped the output has only the text to read");

  const clean = run({ args: ["--seat", "engineer"], files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
  assert.equal(clean.status, 0);
  assert.match(clean.stdout.trimEnd().split("\n").pop(), /\(exit 0\)$/);
});

test("the argument error paths name their status too, which is where the lost measurement happened", () => {
  for (const args of [["--nonesuch"], ["--seat", "enginer"], ["--fresh-under", "1.5"], ["--seat"]]) {
    const r = run({ args, files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } });
    assert.equal(r.status, 2, `${args.join(" ")} must be an unasked question`);
    assert.match(r.stderr.trimEnd().split("\n").pop(), /\(exit 2\)$/,
      `${args.join(" ")} exits before any summary and still owes the reader its status`);
  }
});

test("the status in the text is the status returned, on every path this suite can reach", () => {
  const cases = [
    { files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]) } },
    { files: { "prs.tsv": prs([[47, "atelier-engineer/2026-10-24-message"]]) } },
    { files: { "prs.tsv": prs([[52, "atelier-pm/x"]]), commitdate: minutesAgo(4) } },
    { args: ["--fresh-under", "0"], files: { "prs.tsv": prs([[52, "atelier-pm/x"]]), commitdate: minutesAgo(4) } },
    { args: ["--all"], files: { "prs.tsv": "" } },
  ];
  for (const c of cases) {
    const r = run(c);
    const last = `${r.stdout}${r.stderr ?? ""}`.trimEnd().split("\n").pop();
    assert.match(last, new RegExp(`\\(exit ${r.status}\\)$`),
      `the line said something other than ${r.status}: ${last}`);
  }
});
