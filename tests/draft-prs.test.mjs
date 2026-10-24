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

  const defaults = { base: "main", "prs.tsv": "", runs: "0", compare: "4\t1", commitdate: "2026-10-24T00:00:00Z" };
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

test("--help prints the whole header, including the fields a reader greps", () => {
  const r = run({ args: ["--help"] });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /run=self/, "the help truncated before the field list");
  assert.match(r.stdout, /Requires: git, gh/, "the help truncated before its last line");
});
