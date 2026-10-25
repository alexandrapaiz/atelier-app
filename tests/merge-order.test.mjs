// tests/merge-order.test.mjs — the decision table of tools/merge-order.sh, over
// real git history rather than over fixtures.
//
// The other three tools in tools/ are tested against files, because what they
// read is a forge and a board and a fixture is the honest way to pin those. This
// one is different in kind: the thing under test *is* a merge, so a fixture that
// served merge results would be testing the fixture. Every case below therefore
// builds an actual repository with actual conflicting commits, and only the pull
// request list — the one genuinely remote input — comes from a file, via --prs.
//
// The case that matters most is `shallow`. L-A55: "the clone a seat is given is
// shallow and single-branch: in it `git merge-base --is-ancestor` finds no base
// ... while `git merge-tree` exits fatal and a loop reads that as a conflict."
// A merge-order tool that does not refuse a shallow clone reports a whole queue
// as mutually exclusive and is loudest when it is most wrong. That case cannot
// be faked — it needs a real `git clone --depth 1` — which is the second reason
// this suite is built the way it is.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TOOL = join(root, 'tools/merge-order.sh');

/* A world: a bare origin, a clone of it, and branches built to order.
   `branches` is a list of { name, files } where files is a path->content map
   applied as one commit on top of main. */
function world({ branches = [], mainExtra = null } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'merge-order-'));
  const origin = join(dir, 'origin.git');
  const work = join(dir, 'work');

  execFileSync('git', ['init', '-q', '--bare', '-b', 'main', origin]);
  execFileSync('git', ['init', '-q', '-b', 'main', work]);
  const git = (...a) => execFileSync('git', a, { cwd: work, stdio: 'pipe', encoding: 'utf8' });
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  git('remote', 'add', 'origin', origin);

  // main carries the shared register every pass appends to.
  writeFileSync(join(work, 'register.md'), '# register\n\n- seed\n');
  writeFileSync(join(work, 'untouched.txt'), 'quiet\n');
  git('add', '-A');
  git('commit', '-qm', 'seed');
  git('push', '-q', 'origin', 'main');

  const mainSha = git('rev-parse', 'HEAD').trim();
  const tips = {};
  for (const b of branches) {
    git('checkout', '-q', '-B', b.name, 'main');
    for (const [p, body] of Object.entries(b.files)) {
      mkdirSync(dirname(join(work, p)), { recursive: true });
      writeFileSync(join(work, p), body);
    }
    git('add', '-A');
    git('commit', '-qm', `${b.name}`);
    tips[b.name] = git('rev-parse', 'HEAD').trim();
    git('push', '-q', 'origin', b.name);
  }
  git('checkout', '-q', 'main');

  // A commit that lands on origin/main after the clone is made, for the
  // stale-base case.
  if (mainExtra) {
    writeFileSync(join(work, 'late.txt'), mainExtra);
    git('add', '-A');
    git('commit', '-qm', 'late on main');
    git('push', '-q', 'origin', 'main');
  }

  return { dir, origin, work, git, mainSha, tips };
}

/* Run the tool inside `cwd`, with the queue served from a file. Rows are
   [number, branch, oid]; an oid of null means "let the tool resolve the
   branch", and a literal sha means "this is the head the forge reported". */
function run(cwd, rows, extra = []) {
  const prs = join(cwd, '.prs.tsv');
  writeFileSync(prs, rows.map(r => r.join('\t')).join('\n') + '\n');
  try {
    const stdout = execFileSync('bash', [TOOL, '--prs', prs, '--base', 'main', ...extra], {
      cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { code: 0, out: stdout };
  } catch (e) {
    // A reading the harness could not take is not a failing check. Say which,
    // so a red here is never mistaken for a finding about the tool.
    assert.notEqual(e.status, null, `the check was killed by ${e.signal}`);
    return { code: e.status, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

// `file://` rather than the bare path on purpose. git ignores --depth on a
// local-path clone and hardlinks the whole object store, so a path clone is
// neither shallow nor missing the objects of the branches it did not fetch —
// both of which are exactly the conditions two cases below exist to build.
function clone(origin, dest, args = []) {
  execFileSync('git', ['clone', '-q', ...args, `file://${origin}`, dest]);
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dest });
  execFileSync('git', ['config', 'user.name', 'test'], { cwd: dest });
  return dest;
}

// --- the precondition this file exists for ----------------------------------

// L-A55's two cases, and the reason this suite needs real clones. The warning
// is that `git merge-tree` "exits fatal and a loop reads that as a conflict".
// Measured, the fatality is conditional, and the tool is judged on both halves:
// a shallow clone whose merge base is inside the fetched depth must still get a
// correct answer (because the seat's clone is always shallow, and a check that
// always exits 2 is a constant — L12), and a shallow clone whose merge base is
// below the boundary must come back unreadable rather than EXCLUSIVE.

test('a shallow clone still answers when the merge base is inside the depth', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'register.md': '# register\n\n- seed\n- entry from a\n' } },
      { name: 'b', files: { 'register.md': '# register\n\n- seed\n- entry from b\n' } },
    ],
  });
  // depth 1 on main, then the branch refs — the exact shape of a seat's clone
  // after it fetches the queue. Both branches fork from the commit main is
  // pinned at, so every merge base is present.
  const c = clone(w.origin, join(w.dir, 'shallow'), ['--depth', '1', '--single-branch', '--branch', 'main']);
  execFileSync('git', ['fetch', '-q', 'origin',
    '+refs/heads/a:refs/remotes/origin/a', '+refs/heads/b:refs/remotes/origin/b'], { cwd: c });
  assert.equal(execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: c, encoding: 'utf8' }).trim(), 'true');

  const r = run(c, [[1, 'a', w.tips.a], [2, 'b', w.tips.b]]);
  assert.match(r.out, /^EXCLUSIVE {2}#1 x #2 files=register\.md$/m);
  assert.match(r.out, /^ANCHOR {2}register\.md pairs=1 prs=2$/m);
  // the depth is reported, because a verdict names the footing it stands on
  assert.match(r.out, /^BLOCKED .*clone=shallow$/m);
  assert.equal(r.code, 1, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// The case the warning is actually about: main advances past the fork point, so
// the true merge base is below a depth-1 boundary. Measured on 2026-10-25,
// `git merge-base` prints nothing here and `git merge-tree` exits 128,
// "refusing to merge unrelated histories" — which must never read as conflict.
test('a merge base below the shallow boundary is unreadable, never EXCLUSIVE', () => {
  const dir = mkdtempSync(join(tmpdir(), 'merge-order-deep-'));
  const origin = join(dir, 'origin.git');
  const work = join(dir, 'work');
  execFileSync('git', ['init', '-q', '--bare', '-b', 'main', origin]);
  execFileSync('git', ['init', '-q', '-b', 'main', work]);
  const git = (...a) => execFileSync('git', a, { cwd: work, stdio: 'pipe', encoding: 'utf8' });
  git('config', 'user.email', 'test@example.com');
  git('config', 'user.name', 'test');
  git('remote', 'add', 'origin', origin);
  writeFileSync(join(work, 'register.md'), '# register\n\n- seed\n');
  git('add', '-A'); git('commit', '-qm', 'c0'); git('push', '-q', 'origin', 'main');

  // the branch forks here, at the commit that will fall below the boundary
  git('checkout', '-q', '-b', 'feat');
  writeFileSync(join(work, 'register.md'), '# register\n\n- seed\n- from feat\n');
  git('add', '-A'); git('commit', '-qm', 'feat'); git('push', '-q', 'origin', 'feat');
  const featSha = git('rev-parse', 'HEAD').trim();

  // main then advances twice, so depth 1 cannot reach the fork point
  git('checkout', '-q', 'main');
  writeFileSync(join(work, 'register.md'), '# register\n\n- seed\n- from main\n');
  git('add', '-A'); git('commit', '-qm', 'c1');
  writeFileSync(join(work, 'extra.txt'), 'x\n');
  git('add', '-A'); git('commit', '-qm', 'c2'); git('push', '-q', 'origin', 'main');

  const c = clone(origin, join(dir, 'shallow'), ['--depth', '1', '--single-branch', '--branch', 'main']);
  execFileSync('git', ['fetch', '-q', 'origin', '+refs/heads/feat:refs/remotes/origin/feat'], { cwd: c });
  // git merge-base exits non-zero when there is no base, so the premise is
  // checked by catching that rather than by reading stdout.
  let baseFound = null;
  try {
    baseFound = execFileSync('git', ['merge-base', 'main', 'refs/remotes/origin/feat'],
      { cwd: c, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch { baseFound = ''; }
  assert.equal(baseFound, '', 'the premise of this case is that there is no reachable merge base');

  const r = run(c, [[1, 'feat', featSha]]);
  // register.md genuinely conflicts between these two, and the tool must still
  // refuse to say so, because it could not perform the merge
  assert.doesNotMatch(r.out, /EXCLUSIVE/);
  assert.doesNotMatch(r.out, /^BLOCKED/m);
  assert.match(r.out, /^SEQ {3}#1 feat unreadable order=1$/m);
  assert.match(r.out, /^INCONCLUSIVE .*clone=shallow$/m);
  assert.match(r.out, /--unshallow/);
  assert.equal(r.code, 2, r.out);

  // and --unshallow is the one flag that turns it into an answer
  const ok = run(c, [[1, 'feat', featSha]], ['--unshallow']);
  assert.match(ok.out, /^SEQ {3}#1 feat blocked order=1 files=register\.md$/m);
  assert.match(ok.out, /clone=complete/);
  assert.equal(ok.code, 1, ok.out);
  rmSync(dir, { recursive: true, force: true });
});

// Measured on this tool's own first live run: two pull requests merged at 02:27Z
// while the run was writing the file, so every merge was being measured against
// a base the remote had already moved past (L-A64, L13).
test('a clone behind the remote base refuses rather than measuring a dead queue', () => {
  const w = world({
    branches: [{ name: 'a', files: { 'register.md': '# register\n\n- seed\n- a\n' } }],
  });
  const c = clone(w.origin, join(w.dir, 'behind'));
  // main moves on the remote after the clone exists
  writeFileSync(join(w.work, 'late.txt'), 'later\n');
  w.git('checkout', '-q', 'main');
  w.git('add', '-A');
  w.git('commit', '-qm', 'late on main');
  w.git('push', '-q', 'origin', 'main');

  const r = run(c, [[1, 'a', w.tips.a]]);
  assert.match(r.out, /^INCONCLUSIVE {2}reason=stale-base base=main local=[0-9a-f]{8} remote=[0-9a-f]{8}$/m);
  assert.equal(r.code, 2, r.out);

  // --fetch is the opt-in that makes it measurable, and then it answers
  const ok = run(c, [[1, 'a', w.tips.a]], ['--fetch']);
  assert.match(ok.out, /^CLEAN .*base=main@[0-9a-f]{8}/m);
  assert.equal(ok.code, 0, ok.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// --- the finding ------------------------------------------------------------

// The shape L-A48 describes: each branch individually fine against the
// mainline, mutually exclusive with its sibling, both appending at the same
// anchor in one register.
test('two passes appending at one anchor are EXCLUSIVE and name the file', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'register.md': '# register\n\n- seed\n- entry from a\n' } },
      { name: 'b', files: { 'register.md': '# register\n\n- seed\n- entry from b\n' } },
    ],
  });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, [[1, 'a', w.tips.a], [2, 'b', w.tips.b]]);

  assert.match(r.out, /^EXCLUSIVE {2}#1 x #2 files=register\.md$/m);
  assert.match(r.out, /^ANCHOR {2}register\.md pairs=1 prs=2$/m);
  assert.match(r.out, /^BLOCKED {2}in-scope=2 out-of-scope=0 sequence=1\/2 exclusive-pairs=1\/1 base=main@[0-9a-f]{8} anchor=register\.md clone=complete$/m);
  assert.equal(r.code, 1, r.out);

  // each one is clean against the mainline on its own, which is the whole point:
  // the per-pull-request question answers yes for both
  const a = run(c, [[1, 'a', w.tips.a]]);
  assert.match(a.out, /^CLEAN /m);
  assert.equal(a.code, 0, a.out);
  const b = run(c, [[2, 'b', w.tips.b]]);
  assert.match(b.out, /^CLEAN /m);
  assert.equal(b.code, 0, b.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// Divergence 5. "33 merge in sequence, 51 cannot" is L-A48's own shape of
// answer, and a loop that stops at the first conflict cannot produce it.
test('the sequential pass continues past a blocked pull request', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'register.md': '# register\n\n- seed\n- entry from a\n' } },
      { name: 'b', files: { 'register.md': '# register\n\n- seed\n- entry from b\n' } },
      { name: 'c', files: { 'other.md': 'unrelated\n' } },
    ],
  });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, [[1, 'a', w.tips.a], [2, 'b', w.tips.b], [3, 'c', w.tips.c]]);

  assert.match(r.out, /^SEQ {3}#1 a merges order=1$/m);
  assert.match(r.out, /^SEQ {3}#2 b blocked order=2 files=register\.md$/m);
  // the third is still reached and still measured
  assert.match(r.out, /^SEQ {3}#3 c merges order=3$/m);
  assert.match(r.out, /sequence=2\/3 exclusive-pairs=1\/3/);
  assert.equal(r.code, 1, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// L-A48 clause 3: "one name at the top of that table is the whole finding". The
// anchor is the file blocking the most pairs, not the first one seen.
test('the anchor is the file that blocks the most pairs', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'register.md': '# register\n\n- seed\n- a\n', 'notes.md': 'from a\n' } },
      { name: 'b', files: { 'register.md': '# register\n\n- seed\n- b\n' } },
      { name: 'c', files: { 'register.md': '# register\n\n- seed\n- c\n' } },
      { name: 'd', files: { 'notes.md': 'from d\n' } },
    ],
  });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, [[1, 'a', w.tips.a], [2, 'b', w.tips.b], [3, 'c', w.tips.c], [4, 'd', w.tips.d]]);

  // register.md makes three pairs exclusive (a-b, a-c, b-c); notes.md makes one (a-d)
  assert.match(r.out, /^ANCHOR {2}register\.md pairs=3 prs=3$/m);
  assert.match(r.out, /^EXCLUSIVE {2}#1 x #4 files=notes\.md$/m);
  assert.equal(r.code, 1, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// --- the three outcomes, not two (L6) ---------------------------------------

test('a queue with no contention is CLEAN and says what it examined', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'one.md': 'a\n' } },
      { name: 'b', files: { 'two.md': 'b\n' } },
    ],
  });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, [[1, 'a', w.tips.a], [2, 'b', w.tips.b]]);
  assert.match(r.out, /^CLEAN {2}in-scope=2 out-of-scope=0 sequence=2\/2 exclusive-pairs=0\/1 base=main@[0-9a-f]{8} anchor=none clone=complete$/m);
  assert.equal(r.code, 0, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// L-A21: "examined the whole queue and found nothing" and "examined nothing"
// must be different sentences. An empty queue has no pairs and says so.
test('an empty queue is CLEAN with in-scope=0, not a clean pairwise pass', () => {
  const w = world({ branches: [] });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, []);
  assert.match(r.out, /^CLEAN {2}in-scope=0 out-of-scope=0 sequence=0\/0 exclusive-pairs=0\/0 /m);
  assert.equal(r.code, 0, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// A head this clone does not hold is a reading that failed, never a pull
// request that merges (L-A44: the cause rides with the value).
test('a head missing from the clone is UNREADABLE and counted out of scope', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'one.md': 'a\n' } },
      { name: 'gone', files: { 'register.md': '# register\n\n- seed\n- gone\n' } },
    ],
  });
  const c = clone(w.origin, join(w.dir, 'full'), ['--single-branch', '--branch', 'main']);
  const r = run(c, [[1, 'a', w.tips.a], [2, 'gone', w.tips.gone]]);
  // neither branch ref came with a single-branch clone, so both are unreadable
  assert.match(r.out, /^UNREADABLE {2}#2 gone head=not-in-this-clone$/m);
  assert.equal(r.code, 2, r.out);
  assert.match(r.out, /re-run with --fetch/);

  // --fetch brings them in and the verdict arrives
  const ok = run(c, [[1, 'a', w.tips.a], [2, 'gone', w.tips.gone]], ['--fetch']);
  assert.match(ok.out, /^CLEAN {2}in-scope=2 out-of-scope=0 /m);
  assert.equal(ok.code, 0, ok.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// Divergence 2, stated as a test. `git merge-tree` exit 1 is a conflict and
// exit >1 is a failed reading; a well-formed sha for an object that is not
// here makes it fatal, and that must never become EXCLUSIVE.
test('a head that is a well-formed sha for an absent object never becomes a conflict', () => {
  const w = world({ branches: [{ name: 'a', files: { 'one.md': 'a\n' } }] });
  const c = clone(w.origin, join(w.dir, 'full'));
  const absent = 'deadbeef'.repeat(5);
  const r = run(c, [[1, 'a', w.tips.a], [2, 'nowhere', absent]]);
  // it is caught at resolution, before any merge, which is the cheaper of the
  // two defences; the shallow case below the fold is where the merge itself
  // would have gone fatal.
  assert.match(r.out, /^UNREADABLE {2}#2 nowhere head=not-in-this-clone$/m);
  assert.doesNotMatch(r.out, /EXCLUSIVE/);
  // and one unreadable head means the queue got no verdict, rather than the
  // readable remainder being certified clean (L6)
  assert.doesNotMatch(r.out, /^CLEAN/m);
  assert.match(r.out, /^INCONCLUSIVE {2}in-scope=1 out-of-scope=1 /m);
  assert.equal(r.code, 2, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// --- the flags ---------------------------------------------------------------

test('--limit wants a whole number, and a non-number exits 2', () => {
  const w = world({ branches: [] });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, [], ['--limit', 'lots']);
  assert.match(r.out, /--limit wants a whole number/);
  assert.equal(r.code, 2, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

test('--help prints the usage block and exits 0', () => {
  const r = execFileSync('bash', [TOOL, '--help'], { cwd: root, encoding: 'utf8' });
  assert.match(r, /which of this product's open pull requests cannot be merged/);
  assert.match(r, /Exit status:/);
  // the help block must carry the verdict names a reader greps for
  for (const v of ['CLEAN', 'BLOCKED', 'INCONCLUSIVE']) assert.match(r, new RegExp(v));
});

test('an unknown argument exits 2 rather than being ignored', () => {
  const w = world({ branches: [] });
  const c = clone(w.origin, join(w.dir, 'full'));
  const r = run(c, [], ['--pairwise-only']);
  assert.match(r.out, /unknown argument: --pairwise-only/);
  assert.equal(r.code, 2, r.out);
  rmSync(w.dir, { recursive: true, force: true });
});

// Nothing here may move a ref, an index or a working tree (L-E12). merge-tree
// adds objects and touches nothing a caller can see; the default path must not
// even fetch.
test('the check moves no ref and leaves the working tree clean', () => {
  const w = world({
    branches: [
      { name: 'a', files: { 'register.md': '# register\n\n- seed\n- a\n' } },
      { name: 'b', files: { 'register.md': '# register\n\n- seed\n- b\n' } },
    ],
  });
  const c = clone(w.origin, join(w.dir, 'full'));
  const refsBefore = execFileSync('git', ['show-ref'], { cwd: c, encoding: 'utf8' });
  const headBefore = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: c, encoding: 'utf8' });

  run(c, [[1, 'a', w.tips.a], [2, 'b', w.tips.b]]);

  assert.equal(execFileSync('git', ['show-ref'], { cwd: c, encoding: 'utf8' }), refsBefore);
  assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: c, encoding: 'utf8' }), headBefore);
  assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: c, encoding: 'utf8' }).trim(), '.prs.tsv'
    ? execFileSync('git', ['status', '--porcelain'], { cwd: c, encoding: 'utf8' }).trim() : '');
  // the only untracked thing is the harness's own queue file
  const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: c, encoding: 'utf8' })
    .split('\n').filter(l => l.trim() && !l.includes('.prs.tsv'));
  assert.deepEqual(dirty, []);
  // and the clone is still complete, which is the L-E12 half that bites later
  assert.equal(execFileSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: c, encoding: 'utf8' }).trim(), 'false');
  rmSync(w.dir, { recursive: true, force: true });
});
