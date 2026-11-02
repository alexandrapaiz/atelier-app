/* tests/tools-contract.test.mjs — the one rule every command in tools/ owes,
   asserted by enumerating the directory rather than by listing the commands.

   Blocked-fix entry 21 asked for the status suffix on "the three tools in
   tools/". There were four by the time it was read, because merge-order.sh
   landed on `main` in between, and a rule applied to the callers an entry
   happened to name is not a fix to the rule (docs/agents/lessons.md L7). The
   fifth tool is the one this file exists for: it cannot ship without the
   suffix, and nobody has to remember to come back here.

   Every check is driven through its own argument parser with a flag no tool
   declares, because that is the one path every command in here shares and the
   one that needs no network, no credential, no fixture and no clean queue. It
   is also the path that produced the finding: a seat piped a check, read the
   pipe's 0, and recorded that an undeclared flag exits clean. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tools = readdirSync(path.join(root, 'tools')).filter(f => f.endsWith('.sh')).sort();

test('tools/ holds the commands this file thinks it does', () => {
  /* A guard on the enumeration itself: if the glob ever came back empty every
     assertion below would pass by vacuity, which is the shape of a check that
     measures nothing and reports a clean run (L-A21). */
  assert.ok(tools.length >= 4, `tools/ returned ${tools.length} commands: ${tools.join(", ")}`);
});

for (const tool of tools) {
  test(`${tool} refuses an undeclared flag with its status in the text`, () => {
    const r = spawnSync('bash', [`tools/${tool}`, '--no-such-flag-exists'], { cwd: root, encoding: 'utf8' });
    const out = `${r.stdout}${r.stderr}`;
    assert.equal(r.status, 2, `an undeclared flag is could-not-run, never a finding: ${out}`);
    const last = out.trimEnd().split('\n').pop();
    assert.match(last, /\(exit 2\)$/, `${tool} said: ${last}`);
    /* And the status in the text is the status returned, which is the whole
       point: a number printed from a second decision can drift from the first. */
    assert.match(last, new RegExp(`\\(exit ${r.status}\\)$`));
  });

  test(`${tool} prints its own whole header for --help`, () => {
    const r = spawnSync('bash', [`tools/${tool}`, '--help'], { cwd: root, encoding: 'utf8' });
    assert.equal(r.status, 0, `${r.stdout}${r.stderr}`);
    /* Found by where the comments stop, never by a line range. A hardcoded
       range truncates the help the next time somebody edits the header, which
       had already happened to check-seat-surface.sh: its `sed -n '2,99p'` was
       cutting off inside the exit-status table the help exists to print. So the
       assertion is that the last line of the header block arrived. */
    assert.match(r.stdout, /ethos\./,
      `${tool}'s help truncated before the last line of its header`);
    assert.match(r.stdout, /Exit status:/, `${tool}'s help has no exit-status section`);
  });
}
