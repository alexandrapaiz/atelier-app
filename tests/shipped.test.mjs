// tests/shipped.test.mjs — the decision table of tools/check-shipped.sh, plus
// the one case that needs a real remote to be real.
//
// The tool is a port of the no-ship tripwire out of the three seat workflows
// and into tools/, because those workflow files last executed a seat on
// 2026-09-24 and every seat run since has been a host window on the resident
// runtime, which never reads .github/ (docs/agents/lessons.md L4, incident
// I13). A check that moves surfaces has to arrive with its readings pinned,
// because the live surface can only ever produce one of these eleven rows at a
// time and most of them are failures nobody wants to stage on purpose
// (L-A95: construct the branch today's traffic cannot reach).
//
// Two kinds of test here, and the second kind is the point:
//   --fixture serves every reading from files, so the decision table is
//   exercised without a network, a credential or a forge.
//   the refspec tests below build an actual bare remote and an actual clone
//   whose fetch refspec is the mainline alone, which is the shape that caused
//   the defect. A fixture cannot prove that `git branch -r --contains HEAD`
//   answers empty where `git ls-remote` answers; only a real clone can.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// A fixture may carry an `args` file with the flags its case needs, so the case
// and its arguments stay in one place rather than in the harness.
function shipped(fixture, extra = []) {
  const dir = path.join(root, 'tests/fixtures/shipped', fixture);
  const argFile = path.join(dir, 'args');
  const args = fs.existsSync(argFile)
    ? fs.readFileSync(argFile, 'utf8').trim().split(/\s+/)
    : [];
  const r = spawnSync(
    'bash',
    ['tools/check-shipped.sh', '--fixture', `tests/fixtures/shipped/${fixture}`, ...args, ...extra],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(r.error, undefined, `could not run the check: ${r.error}`);
  // A reading the harness itself could not take is not a failing check. Say
  // which, so a red here is never mistaken for a finding about the tool.
  assert.notEqual(r.status, null, `the check was killed by ${r.signal}`);
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

// --- shipped ----------------------------------------------------------------

// The measured case. On 2026-10-24 the live reading on the resident runtime was
// empty from `git branch -r --contains HEAD` for a branch the remote was
// holding at that exact HEAD, and the workflow step failed the run for it.
test('SHIPPED and exit 0 when the remote holds this branch at this HEAD', () => {
  const { code, out } = shipped('shipped-remote-head');
  assert.match(out, /^SHIPPED {4}branch=atelier-engineer\/2026-10-24-message-2 source=remote-head/m);
  assert.match(out, /pushed to a seat branch \(asked of the remote\): origin\//);
  assert.equal(code, 0, out);
});

// L-E11's case, and the reason --base-sha exists. After a Tier A self-merge
// HEAD never leaves the base, the seat branch is deleted and no pull request
// ever had head branch `main`, so all three of the step's shipped-ness signals
// read empty on the cleanest ship path the company has.
test('SHIPPED from the base advancing when the run self-merged', () => {
  const { code, out } = shipped('self-merge');
  assert.match(out, /^SHIPPED {4}branch=main source=base-advanced/m);
  assert.match(out, /origin\/main moved from 1111eeee to ffff6666/);
  // Named weak in the line itself: the base moving cannot tell this run's
  // merge from a concurrent one.
  assert.match(out, /weak/);
  assert.equal(code, 0, out);
});

test('SHIPPED from a pull request that may predate the run, and says so', () => {
  const { code, out } = shipped('pr-predates');
  assert.match(out, /^SHIPPED {4}.*source=pull-request pr=47/m);
  assert.match(out, /weak: the pull request may predate this run/);
  assert.equal(code, 0, out);
});

// --- did not ship -----------------------------------------------------------

test('ORPHANED and exit 1 when the remote holds the branch at an older tip', () => {
  const { code, out } = shipped('orphaned');
  assert.match(out, /^ORPHANED {3}branch=atelier-exo\/2026-10-24-message source=remote-head/m);
  // Both shas, because "push again" is only actionable if you can see the gap.
  assert.match(out, /is at cccc3333 but HEAD is bbbb2222/);
  assert.equal(code, 1, out);
});

test('UNPUSHED and exit 1 when there are commits and no remote branch', () => {
  const { code, out } = shipped('unpushed');
  assert.match(out, /^UNPUSHED {3}branch=atelier-pm\/2026-10-24-message .*commits=3/m);
  assert.equal(code, 1, out);
});

// The step printed the warning that these changes are lost at teardown and then
// exited zero one screen below it.
test('UNPUSHED and exit 1 when the only product is an uncommitted diff', () => {
  const { code, out } = shipped('uncommitted-only');
  assert.match(out, /^UNPUSHED {3}.*source=uncommitted-only/m);
  assert.match(out, /Uncommitted changes were left in the sandbox/);
  assert.equal(code, 1, out);
});

test('NOTHING and exit 1 when no signal fired and the base did not move', () => {
  const { code, out } = shipped('nothing');
  assert.match(out, /^NOTHING {4}branch=main source=base-unmoved commits=0 pr=none dirty=none/m);
  assert.equal(code, 1, out);
});

// --- could not run ----------------------------------------------------------
//
// Every one of these is exit 2. The whole argument of the file they live in is
// that a check which could not run is not a pass (L6), and for a ship check the
// conservative answer is still to fail the caller, which a 2 does.

test('INCONCLUSIVE and exit 2 when the remote could not be asked', () => {
  const { code, out } = shipped('unasked');
  assert.match(out, /^INCONCLUSIVE {2}.*source=remote-unreadable/m);
  assert.match(out, /could not read from remote repository/);
  assert.equal(code, 2, out);
});

test('INCONCLUSIVE and exit 2 when the commit count could not be read', () => {
  const { code, out } = shipped('commits-unreadable');
  assert.match(out, /^INCONCLUSIVE {2}.*source=commits-unreadable/m);
  // The step read `|| echo 0` here, and a zero is an input to NOTHING.
  assert.doesNotMatch(out, /^NOTHING/m);
  assert.equal(code, 2, out);
});

test('INCONCLUSIVE and exit 2 when the pull request field could not be read', () => {
  const { code, out } = shipped('pr-unreadable');
  assert.match(out, /^INCONCLUSIVE {2}.*source=pr-unreadable/m);
  assert.equal(code, 2, out);
});

// The pair that matters most: these last two fixtures leave identical wreckage,
// and the only thing that tells them apart is a fact captured before the run.
test('INCONCLUSIVE rather than NOTHING when no pre-run base tip was given', () => {
  const { code, out } = shipped('no-pre-run-state');
  assert.match(out, /^INCONCLUSIVE {2}branch=main source=no-pre-run-state/m);
  assert.match(out, /a Tier A self-merge looks exactly like this/);
  assert.doesNotMatch(out, /^NOTHING/m);
  assert.equal(code, 2, out);
});

// --- the port's own contract ------------------------------------------------

test('the readings reach stdout with no step summary in the environment', () => {
  const { out } = shipped('shipped-remote-head');
  assert.match(out, /### Did this run ship anything\?/);
  assert.match(out, /- pull request: 52/);
});

test('the step summary is written when the runner names one, and is optional', () => {
  const summary = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'shipped-')), 'summary.md');
  const r = spawnSync(
    'bash',
    ['tools/check-shipped.sh', '--fixture', 'tests/fixtures/shipped/shipped-remote-head'],
    { cwd: root, encoding: 'utf8', env: { ...process.env, GITHUB_STEP_SUMMARY: summary } },
  );
  assert.equal(r.status, 0, `${r.stdout}${r.stderr}`);
  assert.match(fs.readFileSync(summary, 'utf8'), /### Did this run ship anything\?/);
});

test('an unknown argument is exit 2 and never a verdict', () => {
  const r = spawnSync('bash', ['tools/check-shipped.sh', '--nonsense'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(`${r.stdout}${r.stderr}`, /unknown argument/);
});

test('a --fixture that is not a directory is exit 2', () => {
  const r = spawnSync('bash', ['tools/check-shipped.sh', '--fixture', 'tests/nope'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 2);
});

// --- the refspec, against a real remote -------------------------------------
//
// This is the defect itself rather than a model of it. The clone below carries
// `+refs/heads/main:refs/remotes/origin/main`, which is what the resident
// runtime hands a seat, and the assertions are that the old reading answers
// empty on a branch the remote is holding and the tool answers SHIPPED.

function git(cwd, ...args) {
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...process.env,
      GIT_AUTHOR_NAME: 'test', GIT_AUTHOR_EMAIL: 'test@example.com',
      GIT_COMMITTER_NAME: 'test', GIT_COMMITTER_EMAIL: 'test@example.com',
      GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null',
    },
  });
  assert.equal(r.status, 0, `git ${args.join(' ')} failed: ${r.stdout}${r.stderr}`);
  return r.stdout.trim();
}

// A clone shaped like the one a seat run gets: one remote, mainline-only fetch.
function mainlineOnlyClone() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'refspec-'));
  const remote = path.join(tmp, 'remote.git');
  const seed = path.join(tmp, 'seed');
  const work = path.join(tmp, 'work');
  git(tmp, 'init', '--bare', '-b', 'main', remote);
  git(tmp, 'init', '-b', 'main', seed);
  fs.writeFileSync(path.join(seed, 'README.md'), 'seed\n');
  git(seed, 'add', '-A');
  git(seed, 'commit', '-m', 'seed');
  git(seed, 'push', remote, 'main');
  git(tmp, 'clone', '--origin', 'origin', remote, work);
  // The line this whole fix is about.
  git(work, 'config', 'remote.origin.fetch', '+refs/heads/main:refs/remotes/origin/main');
  return { tmp, work };
}

function runTool(cwd, ...args) {
  const r = spawnSync('bash', [path.join(root, 'tools/check-shipped.sh'), ...args], {
    cwd, encoding: 'utf8',
  });
  assert.notEqual(r.status, null, `the check was killed by ${r.signal}`);
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

test('on a mainline-only clone, the old reading is empty where the tool says SHIPPED', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  git(work, 'checkout', '-b', 'atelier-engineer/2026-10-24-message-2');
  fs.writeFileSync(path.join(work, 'tool.sh'), '#!/bin/sh\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'the run did some work');
  git(work, 'push', 'origin', 'HEAD:refs/heads/atelier-engineer/2026-10-24-message-2');

  // The defect, measured and not asserted: the remote has this exact HEAD and
  // the local tracking refs cannot see it, because the refspec never made one.
  const head = git(work, 'rev-parse', 'HEAD');
  const containing = git(work, 'branch', '-r', '--contains', 'HEAD');
  assert.equal(containing, '', 'the old reading was expected to answer empty here');
  assert.match(git(work, 'ls-remote', '--heads', 'origin', 'atelier-engineer/2026-10-24-message-2'), new RegExp(head));

  const { code, out } = runTool(work);
  assert.match(out, /^SHIPPED {4}branch=atelier-engineer\/2026-10-24-message-2 source=remote-head/m);
  assert.equal(code, 0, out);
  // With no forge behind it the base name is a convention and the line says so,
  // rather than reading $GITHUB_REF_NAME, which exists on one surface only.
  assert.match(out, /base named by convention/);
});

test('on the same clone, a commit above the pushed tip is ORPHANED', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  git(work, 'checkout', '-b', 'atelier-engineer/late-commit');
  fs.writeFileSync(path.join(work, 'a'), 'a\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'pushed');
  git(work, 'push', 'origin', 'HEAD:refs/heads/atelier-engineer/late-commit');
  const pushedSha = git(work, 'rev-parse', 'HEAD');
  fs.writeFileSync(path.join(work, 'b'), 'b\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'the trailing commit that dies with the sandbox');

  const { code, out } = runTool(work);
  assert.match(out, /^ORPHANED {3}branch=atelier-engineer\/late-commit/m);
  assert.match(out, new RegExp(`is at ${pushedSha} but HEAD is ${git(work, 'rev-parse', 'HEAD')}`));
  assert.equal(code, 1, out);
});

test('on the same clone, a branch never pushed is UNPUSHED', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  git(work, 'checkout', '-b', 'atelier-engineer/never-pushed');
  fs.writeFileSync(path.join(work, 'a'), 'a\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'work that never left the sandbox');

  const { code, out } = runTool(work);
  assert.match(out, /^UNPUSHED {3}branch=atelier-engineer\/never-pushed/m);
  assert.match(out, /commits=1/);
  assert.equal(code, 1, out);
});

// Port change 5, and L-E12's own prescription: a measurement that runs inside a
// directory somebody else is standing in may only ask questions, and that is
// pinned by a test rather than by the absence of a fetch in the source. The step
// ran `git fetch origin`, which writes to the refs of whatever checkout it is
// standing in; `git ls-remote` needs no local ref at all.
test('the check writes nothing into the caller checkout', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  git(work, 'checkout', '-b', 'atelier-engineer/read-only');
  fs.writeFileSync(path.join(work, 'a'), 'a\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'work');
  git(work, 'push', 'origin', 'HEAD:refs/heads/atelier-engineer/read-only');

  const refsBefore = git(work, 'for-each-ref', '--format=%(refname) %(objectname)');
  const shallowBefore = fs.existsSync(path.join(work, '.git/shallow'));
  const headBefore = git(work, 'rev-parse', 'HEAD');

  const { code } = runTool(work);
  assert.equal(code, 0);

  assert.equal(git(work, 'for-each-ref', '--format=%(refname) %(objectname)'), refsBefore,
    'the check moved a ref in the caller checkout');
  assert.equal(fs.existsSync(path.join(work, '.git/shallow')), shallowBefore,
    'the check left the caller checkout shallow');
  assert.equal(git(work, 'rev-parse', 'HEAD'), headBefore,
    'the check moved the caller HEAD');
  assert.equal(fs.existsSync(path.join(work, '.git/FETCH_HEAD')), false,
    'the check fetched into the caller checkout');
});

// Port change 4, on the live path rather than through the fixture reader. The
// step counted commits with `|| echo 0`, and a zero is an input to the loudest
// verdict in the file, so a clone with no `origin/<base>` ref at all could have
// a failed count reported as "this run produced nothing". Written because the
// fixture case for this row passed a mutant that restored the `echo 0`: the
// fixture serves the count from a file and never exercises the counting.
test('a clone with no origin ref for the base says so instead of counting zero', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  git(work, 'checkout', '-b', 'atelier-engineer/no-base-ref');
  fs.writeFileSync(path.join(work, 'a'), 'a\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'work the count cannot be taken against');
  // The refspec made exactly one tracking ref. Remove it and the count has
  // nothing to compare to, which is a failed reading and not a zero.
  git(work, 'update-ref', '-d', 'refs/remotes/origin/main');

  const { code, out } = runTool(work);
  assert.match(out, /^INCONCLUSIVE {2}.*source=commits-unreadable/m);
  assert.match(out, /\(unreadable commit\(s\) ahead of main/);
  assert.doesNotMatch(out, /^NOTHING/m);
  assert.equal(code, 2, out);
});

// The run that never branched: HEAD sits on the base, which is what the old
// `git branch -r --contains HEAD` reading passed trivially — epitome run
// 35956231272 died at turn one, produced nothing, and the tripwire was green.
//
// In a scratch repository there is no forge, so the pull request reading really
// does fail, and the verdict is INCONCLUSIVE rather than NOTHING. That is the
// tool's contract and not a gap in this test: a verdict is not published from a
// reading that failed. The property under test is the one that matters either
// way, which is that a run in this state does not get a zero. The NOTHING row
// itself is pinned by the `nothing` fixture above, where the pull request field
// is readable and empty.
test('a run that never branched and produced nothing does not pass', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  const baseSha = git(work, 'rev-parse', 'HEAD');
  const { code, out } = runTool(work, '--base-sha', baseSha);
  assert.match(out, /^INCONCLUSIVE {2}branch=main source=pr-unreadable/m);
  assert.notEqual(code, 0, `a run that shipped nothing must not exit 0: ${out}`);
  assert.equal(code, 2, out);
});

// --- the base tip's spelling ------------------------------------------------
//
// Every one of the eleven fixtures above sets --base-sha and base_now to
// *different* commits, so all of them only ever exercise `advanced` being
// right. The reading nothing reached: the same commit, spelled two ways.
// `base_now` is a full sha the tool reads from `git ls-remote`; `--base-sha` is
// whatever the caller captured, and compared as plain strings an abbreviation
// read as the base having *moved* — the passing branch, tested above ORPHANED,
// UNPUSHED and NOTHING, so one short sha masked every failing verdict here.
// Measured by atelier/exo on one unchanged tree, seconds apart: full sha
// ORPHANED exit 1, its own abbreviation SHIPPED exit 0 (I16).

test('an abbreviated base tip is the same commit, not an advance', () => {
  const { code, out } = shipped('base-abbreviated');
  // The fixture is the self-merge shape with the base standing still: HEAD on
  // the base, nothing committed, and the caller passing the first seven
  // characters of the sha the tool reads for itself.
  assert.doesNotMatch(out, /source=base-advanced/);
  assert.match(out, /^NOTHING {4}branch=main source=base-unmoved/m);
  assert.equal(code, 1, out);
});

test('the base tip is read case-insensitively, since a spelling is not a move', () => {
  const { code, out } = shipped('base-abbreviated', ['--base-sha', '641AD2843606E3D8F5BE60949AD7CB3163008AC6']);
  assert.doesNotMatch(out, /source=base-advanced/);
  assert.equal(code, 1, out);
});

// The fixture that exo's first draft of this fix broke, kept here as the
// guard it was: resolving both sides against the object store would report an
// unresolvable pre-run tip as INCONCLUSIVE, and on a shallow clone the pre-run
// tip of a base that really did advance is not an object the checkout holds —
// which is the one case --base-sha exists for. So the normal form is lexical,
// and two shas that are neither equal nor one another's prefix still mean the
// base moved.
test('two different shas still read as the base having advanced', () => {
  const { code, out } = shipped('self-merge');
  assert.match(out, /^SHIPPED {4}branch=main source=base-advanced/m);
  assert.equal(code, 0, out);
});

test('a --base-sha that is not a sha exits 2 and names the argument', () => {
  for (const bad of ['main', 'HEAD', 'dea', 'origin/main']) {
    const r = spawnSync('bash', ['tools/check-shipped.sh', '--base-sha', bad], { cwd: root, encoding: 'utf8' });
    const out = `${r.stdout}${r.stderr}`;
    assert.equal(r.status, 2, `--base-sha ${bad}: ${out}`);
    assert.match(out, new RegExp(`got: ${bad.replace('/', '\\/')}`));
    // A caller error must never be able to publish a verdict, least of all the
    // passing one.
    assert.doesNotMatch(out, /^SHIPPED/m);
  }
});

// The case the resident runtime will actually hit, on a real clone rather than
// through the fixture reader: a run that committed and never pushed, with the
// base tip captured the way a shell captures one.
test('on a real clone, a short base tip does not pass a run that pushed nothing', (t) => {
  const { tmp, work } = mainlineOnlyClone();
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  const baseShort = git(work, 'rev-parse', '--short', 'HEAD');
  const baseFull = git(work, 'rev-parse', 'HEAD');
  assert.ok(baseShort.length >= 4 && baseShort.length < baseFull.length,
    `the point of this test is an abbreviation: got ${baseShort}`);

  git(work, 'checkout', '-b', 'atelier-engineer/short-base-sha');
  fs.writeFileSync(path.join(work, 'a'), 'a\n');
  git(work, 'add', '-A');
  git(work, 'commit', '-m', 'work that never left the sandbox');

  const abbreviated = runTool(work, '--base-sha', baseShort);
  assert.match(abbreviated.out, /^UNPUSHED {3}branch=atelier-engineer\/short-base-sha/m);
  assert.equal(abbreviated.code, 1, abbreviated.out);

  // The two calls that disagreed in I16, made against one unchanged base,
  // agreeing: same verdict, same exit status, same tree.
  const full = runTool(work, '--base-sha', baseFull);
  assert.equal(full.code, abbreviated.code, full.out);
  assert.match(full.out, /^UNPUSHED {3}/m);
});
