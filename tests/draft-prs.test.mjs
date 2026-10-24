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

/* The stub answers the six calls the script makes, from files, so a test says
   what GitHub said. A fixture value of "fail" makes that call exit non-zero,
   which is how the unreadable readings are reached. */
const STUB = `#!/usr/bin/env bash
F="$GH_FIXTURE"
emit() { # fixture file; "fail" means the call itself failed
  [ -f "$F/$1" ] || exit 7
  [ "$(cat "$F/$1")" = fail ] && exit 7
  cat "$F/$1"
}
all="$*"
case "$all" in
  "auth status"*) exit 0 ;;
  "repo view"*)   emit base ;;
  "pr list"*)     emit prs.tsv ;;
  "run list"*)    emit runs ;;
  *compare*)      emit compare ;;
  *commits*)      emit commitdate ;;
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
function run({ files = {}, branch = "atelier-engineer/2026-10-24-message", args = [], seats = ["engineer", "exo", "pm"], detach = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "drafts-"));
  const bin = join(dir, "bin");
  const fixture = join(dir, "fixture");
  mkdirSync(bin);
  mkdirSync(fixture);
  mkdirSync(join(dir, "repo", "tools"), { recursive: true });
  const repo = join(dir, "repo");

  writeFileSync(join(bin, "gh"), STUB);
  chmodSync(join(bin, "gh"), 0o755);

  const defaults = { base: "main", "prs.tsv": "", runs: "0", compare: "4\t1", commitdate: minutesAgo(25 * 60) };
  for (const [name, body] of Object.entries({ ...defaults, ...files })) {
    writeFileSync(join(fixture, name), body);
  }

  copyFileSync(TOOL, join(repo, "tools", "check-draft-prs.sh"));
  writeFileSync(join(repo, "company.yaml"),
    "seats:\n" + seats.map(s => `  - { name: ${s}, workflow: x, cadence: on-dispatch, status: dormant }\n`).join(""));

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

test("an Actions run in progress still reads live for a branch that is not ours", () => {
  const r = run({ files: { "prs.tsv": prs([[28, "atelier-pm/2026-10-21-message"]]), runs: "1" } });
  assert.match(r.stdout, /^LIVE +#28 .*run=live$/m);
  assert.equal(r.status, 0);
});

test("an unreadable run list is stranded, not excused", () => {
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
