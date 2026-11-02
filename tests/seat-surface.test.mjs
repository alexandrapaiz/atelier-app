// tests/seat-surface.test.mjs — the decision table of tools/check-seat-surface.sh.
//
// This file exists because of the one verdict the live portfolio cannot produce.
// Every seat in every company runs on the resident host, so AGREE is reachable
// by no reading anyone can take today, and a check whose clean answer nothing
// can produce is measuring its own assumption rather than the company
// (docs/standards/lessons.md L-A101). The prescription for a branch today's
// traffic cannot reach is a test that constructs it, not a sentence predicting
// it will not happen (L-A95). So the fixtures below construct all eleven
// readings, AGREE first.
//
// Nothing here touches the network, the forge or a credential: --fixture serves
// every input from tests/fixtures/seat-surface/<case>/.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function surface(fixture) {
  const r = spawnSync(
    'bash',
    ['tools/check-seat-surface.sh', '--fixture', `tests/fixtures/seat-surface/${fixture}`],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(r.error, undefined, `could not run the check: ${r.error}`);
  // A reading the test harness itself could not take is not a failing check.
  // Say which, so a red here is never mistaken for a finding about the tool.
  assert.notEqual(r.status, null, `the check was killed by ${r.signal}`);
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
}

// The clean case, and the whole reason this file exists. The seat's newest
// recorded run is on github.com, so the workflow company.yaml declares is the
// thing that ran it, and an edit to that file reaches the next run.
test('AGREE and exit 0 when the newest run is on the declared workflow', () => {
  const { code, out } = surface('agree-board');
  assert.match(out, /^AGREE {5}seat=engineer /m);
  assert.match(out, /source=board/);
  assert.equal(code, 0, out);
});

test('AGREE from Actions when the board holds no run for the seat', () => {
  const { code, out } = surface('agree-actions');
  assert.match(out, /^AGREE {5}seat=engineer /m);
  assert.match(out, /source=actions/);
  // The window the board actually answered for, never an unqualified silence.
  assert.match(out, /board_window_from=2026-10-24/);
  assert.equal(code, 0, out);
});

// The live finding's shape: the declaration names a file that has not run the
// seat in a month, so an edit to it reaches nothing.
test('ELSEWHERE and exit 1 when the board records the run on another host', () => {
  const { code, out } = surface('elsewhere-board');
  assert.match(out, /^ELSEWHERE seat=engineer /m);
  assert.match(out, /actual_surface=host\.alexandra-systems-company\.com/);
  assert.match(out, /gap=34d/);
  assert.equal(code, 1, out);
});

test('ELSEWHERE from the forge names the weaker source it decided on', () => {
  const { code, out } = surface('elsewhere-forge');
  assert.match(out, /^ELSEWHERE seat=engineer /m);
  assert.match(out, /source=forge\(pr#44\)/);
  assert.match(out, /actual_surface=unrecorded/);
  assert.equal(code, 1, out);
});

// A run reaches the board when it ends, so a seat is absent from the board for
// the whole duration of its own run. This is the case the tool got wrong on the
// exo seat at 18:20 on 2026-10-24 before the absence was resolved against the
// forge: a fresh absence and a lost run are identical from the page alone.
test('board=pending when a run is still executing on the seat’s branch', () => {
  const { out } = surface('pending');
  assert.match(out, /board=pending/);
});

test('board=silent-in-window when a finished run is missing from the page', () => {
  const { out } = surface('elsewhere-forge');
  assert.match(out, /board=silent-in-window/);
});

test('board=out-of-window when the forge evidence predates the page', () => {
  const { out } = surface('agree-actions');
  assert.match(out, /board=out-of-window/);
});

test('board=unreadable when the liveness read itself failed', () => {
  const { out } = surface('live-unreadable');
  assert.match(out, /board=unreadable/);
});

// Three ways a reading fails, and none of them may read as a pass. "I could not
// look" and "nothing is wrong" are different answers (L-A44, L-A80).
test('an unreadable declared reading is reported, not dropped, and exits 2', () => {
  const { code, out } = surface('unreadable-declared');
  assert.match(out, /^unreadable seat=engineer /m);
  assert.match(out, /declared_last=unreadable/);
  assert.match(out, /declared read=no, board read=yes/);
  assert.equal(code, 2, out);
});

test('an unreadable board is reported as unreadable, not as agreement', () => {
  const { code, out } = surface('unreadable-board');
  assert.match(out, /^unreadable seat=engineer /m);
  assert.match(out, /actual_last=unreadable/);
  assert.match(out, /declared read=yes, board read=no/);
  assert.equal(code, 2, out);
});

test('an unreadable pull request list exits 2 rather than guessing', () => {
  const { code, out } = surface('forge-unreadable');
  assert.match(out, /^unreadable seat=engineer /m);
  assert.match(out, /the pull request list could not be read/);
  assert.equal(code, 2, out);
});

test('QUIET is not a pass: nothing executed the seat anywhere', () => {
  const { code, out } = surface('quiet');
  assert.match(out, /^QUIET {5}seat=engineer /m);
  assert.match(out, /declared_last=none actual_last=none/);
  assert.equal(code, 2, out);
});

// A found defect is never downgraded to "could not run" because a different
// seat was quiet, and the summary names both counts whichever status it returns
// (L-A88: a summary line names every class it counted).
test('exit 1 outranks exit 2, and the summary still names both counts', () => {
  const { code, out } = surface('one-outranks-two');
  assert.match(out, /^ELSEWHERE seat=engineer /m);
  assert.match(out, /^QUIET {5}seat=exo /m);
  assert.match(out, /1 of 2 seat\(s\) run somewhere company\.yaml does not name/);
  assert.match(out, /1 unclear\./);
  assert.equal(code, 1, out);
});

test('an unknown argument is refused rather than ignored', () => {
  const r = spawnSync('bash', ['tools/check-seat-surface.sh', '--nope'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(`${r.stdout}${r.stderr}`, /unknown argument/);
});

test('a fixture directory that does not exist is an error, not an empty pass', () => {
  const r = spawnSync(
    'bash',
    ['tools/check-seat-surface.sh', '--fixture', 'tests/fixtures/seat-surface/no-such-case'],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal(r.status, 2);
  assert.match(`${r.stdout}${r.stderr}`, /is not a directory/);
});

// --- the status in the text (blocked-fix entry 21, 2026-10-25) --------------
//
// This is the command the lost measurement was taken on. On 2026-10-25 a seat
// ran `bash tools/check-seat-surface.sh --all | head`, read exit 0, and
// recorded that the tool accepts an undeclared flag and exits clean. Unpiped it
// exits 2, as its own header says. The tool was right, the measurement was
// wrong, and the warning that would have prevented it had been read by the same
// run minutes earlier — so the status is now in the text of the last line,
// where a pipe cannot destroy it.

test('--all is not a flag this command takes, and the refusal says so with its status', () => {
  const r = spawnSync('bash', ['tools/check-seat-surface.sh', '--all'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 2, 'an undeclared flag is an unasked question');
  const last = `${r.stdout}${r.stderr}`.trimEnd().split('\n').pop();
  assert.match(last, /unknown argument: --all \(exit 2\)$/, last);
});

test('a piped read loses the status and keeps the verdict', () => {
  const r = spawnSync('bash', ['-c', 'tools/check-seat-surface.sh --all 2>&1 | head'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, 'the pipe reports head’s status, which is the whole defect');
  assert.match(`${r.stdout}`, /\(exit 2\)/, 'the text has to carry what the pipe threw away');
});

test('every verdict names the status it returns, on every fixture in the table', () => {
  const cases = fs.readdirSync(path.join(root, 'tests/fixtures/seat-surface')).sort();
  assert.ok(cases.length >= 11, `the table shrank to ${cases.length} cases`);
  for (const fixture of cases) {
    const { code, out } = surface(fixture);
    const last = out.trimEnd().split('\n').pop();
    assert.match(last, new RegExp(`\\(exit ${code}\\)$`),
      `${fixture} returned ${code} and its last line said: ${last}`);
  }
});

// Each of these used to die inside `shift 2` and exit 1 — the status that means
// a seat was found running off its declaration — instead of reaching the
// refusal written for it three lines below.
test('a flag given without its value is a caller error, never a finding', () => {
  for (const flag of ['--seat', '--company', '--fixture']) {
    const r = spawnSync('bash', ['tools/check-seat-surface.sh', flag], { cwd: root, encoding: 'utf8' });
    assert.notEqual(r.status, 1, `${flag} alone must not read as a seat running elsewhere`);
    assert.equal(r.status, 2, `${r.stdout}${r.stderr}`);
  }
});

test('--help prints the whole header, including the exit-status table', () => {
  const r = spawnSync('bash', ['tools/check-seat-surface.sh', '--help'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /board=silent-in-window/, 'the help truncated before the board readings');
  assert.match(r.stdout, /Exit status:/);
  assert.match(r.stdout, /Requires: git, gh/, 'the help truncated before its last line');
});
