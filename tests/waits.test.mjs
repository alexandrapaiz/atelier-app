/* Waits, dependencies, seasons, rhythm — the newer machinery. */
import test from "node:test";
import assert from "node:assert/strict";
import A from "./harness.mjs";

const { depCycle, resolveWait, isWaiting, blockerOf, byUrgent, krSeason, adherence, taskAgeDays } = A;

function world() {
  A.S.masterColumns = [{ id: "m1", name: "Boards" }];
  A.S.boards = [{ id: "b1", name: "Life", accent: "#888", masterCol: "m1",
    columns: [{ id: "c1", name: "To do" }, { id: "cr", name: "Practices", kind: "routine" }] }];
  A.S.tasks = [];
  A.S.goals = [];
  A.S.meta = A.S.meta || {}; A.S.meta.tomb = {};
}
const task = (id, extra) => ({ id, boardId: "b1", colId: "c1", title: id, done: false, createdAt: Date.now(), ...extra });

test("dependency cycles are refused", () => {
  world();
  A.S.tasks.push(task("a", { after: "b" }), task("b"));
  assert.equal(depCycle("b", "a"), true, "b→a would loop");
  assert.equal(depCycle("c", "a"), false);
});

test("isWaiting covers both kinds of wait", () => {
  world();
  A.S.tasks.push(task("blocked", { after: "open" }), task("open"), task("person", { waitWho: "Papá" }), task("free"));
  assert.equal(isWaiting(A.S.tasks[0]), true);
  assert.equal(isWaiting(A.S.tasks[2]), true);
  assert.equal(isWaiting(A.S.tasks[3]), false);
});

test("a finished blocker no longer blocks", () => {
  world();
  A.S.tasks.push(task("t", { after: "d" }), task("d", { done: true }));
  assert.equal(blockerOf(A.S.tasks[0]), undefined ?? null ?? blockerOf(A.S.tasks[0]));
  assert.ok(!isWaiting(A.S.tasks[0]));
});

test("byUrgent: urgent, then normal, then waiting — waiting sinks even when urgent", () => {
  world();
  A.S.tasks.push(task("w", { urgent: true, waitWho: "X" }), task("n"), task("u", { urgent: true }));
  const order = byUrgent(A.S.tasks).map(t => t.id);
  assert.equal(order.join(","), "u,n,w");
});

test("resolveWait: known person beats a title match; open task beats a stranger", () => {
  world();
  A.S.tasks.push(
    task("hist", { waitWho: "Papá", done: true }),
    task("open1", { title: "Ver carros con papá" }),
    task("photo", { title: "Take night photo" })
  );
  assert.equal(resolveWait("papá", "b1", "zzz").who, "Papá", "history wins");
  assert.equal(resolveWait("night", "b1", "zzz").after, "photo", "open task matched");
  assert.equal(resolveWait("Consulate", "b1", "zzz").who, "Consulate", "unknown becomes a person");
});

test("krSeason grades by the window and freezes at its end", () => {
  world();
  const day = 864e5;
  A.S.tasks.push(task("r", { colId: "cr", pulse: [
    { at: Date.now() - 21 * day, v: "kept" },
    { at: Date.now() - 14 * day, v: "kept" },
    { at: Date.now() - 7 * day, v: "wobbly" },
    { at: Date.now(), v: "slipped" },        // after the season — must not count
  ] }));
  const until = new Date(Date.now() - 2 * day).toISOString().slice(0, 10);
  const kr = { link: { kind: "routine", taskId: "r", since: Date.now() - 30 * day, until } };
  const a = krSeason(kr);
  assert.ok(Math.abs(a - (1 + 1 + 0.5) / 3) < 1e-9, "average of the in-window words only");
});

test("adherence weighs recent words more", () => {
  world();
  const day = 864e5;
  A.S.tasks.push(task("r2", { colId: "cr", pulse: [
    { at: Date.now() - 21 * day, v: "slipped" },
    { at: Date.now(), v: "kept" },
  ] }));
  const a = adherence(A.S.tasks[0]);
  assert.ok(a > 0.5, "the recent 'kept' outweighs the old 'slipped'");
});

test("taskAgeDays counts from creation", () => {
  const t = { createdAt: Date.now() - 34.5 * 864e5 };
  assert.equal(taskAgeDays(t), 34);
});
