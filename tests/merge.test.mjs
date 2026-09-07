/* The sync merge — source of the compass-revert and zombie-domain bugs.
   These tests pin the per-item, freshest-touch-wins semantics. */
import test from "node:test";
import assert from "node:assert/strict";
import A from "./harness.mjs";

const { mergeStates } = A;

const blank = () => ({
  meta: { updatedAt: 0, tomb: {} },
  masterColumns: [{ id: "m1", name: "Boards" }],
  boards: [{ id: "b1", name: "Life", accent: "#888", masterCol: "m1", columns: [{ id: "c1", name: "To do" }] }],
  goals: [], tasks: [], plan: [], priCols: [], stars: [], rewards: [],
  imports: [], claude: { notes: [], inbox: [] },
});
const clone = x => JSON.parse(JSON.stringify(x));

test("a stale device editing one task cannot revert a fresher goal", () => {
  const base = blank();
  base.goals.push({ id: "g1", title: "Install in Guate", achieved: 111, createdAt: 1, touchedAt: 1 });
  base.tasks.push({ id: "t1", boardId: "b1", colId: "c1", title: "tick me", done: false, createdAt: 1, touchedAt: 1 });

  const remote = clone(base);           // Claude edits the goal on the server
  remote.goals[0].achieved = null;
  remote.goals[0].touchedAt = 2000;
  remote.meta.updatedAt = 2000;

  const local = clone(base);            // the device ticks a task LATER
  local.tasks[0].done = true;
  local.tasks[0].touchedAt = 3000;
  local.meta.updatedAt = 3000;          // local is globally newer — the old bug's trigger

  const merged = mergeStates(local, remote);
  assert.equal(merged.goals[0].achieved, null, "Claude's fresher goal edit survives");
  assert.equal(merged.tasks[0].done, true, "the local task tick also survives");
});

test("tombstones win over resurrection", () => {
  const local = blank();
  local.meta.tomb.zzz = 5000;
  const remote = clone(blank());
  remote.masterColumns.push({ id: "zzz", name: "This season" });
  remote.meta.updatedAt = 9000;
  const merged = mergeStates(local, remote);
  assert.ok(!merged.masterColumns.some(m => m.id === "zzz"), "buried domain stays buried");
});

test("chapter renames propagate by touch", () => {
  const local = blank();
  local.plan.push({ id: "e1", era: "Fall '26", items: [], touchedAt: 1 });
  const remote = clone(local);
  remote.plan[0].era = "Autumn";
  remote.plan[0].touchedAt = 2;
  const merged = mergeStates(local, remote);
  assert.equal(merged.plan[0].era, "Autumn");
});

test("a winning board keeps its columns; new remote columns still arrive", () => {
  const local = blank();
  local.boards[0].touchedAt = 100;
  local.boards[0].columns = [{ id: "c1", name: "Renamed locally" }];
  const remote = clone(blank());
  remote.boards[0].touchedAt = 50;
  remote.boards[0].columns = [{ id: "c1", name: "Stale name" }, { id: "c2", name: "Born remotely" }];
  remote.meta.updatedAt = 9000;
  const merged = mergeStates(local, remote);
  const names = merged.boards[0].columns.map(c => c.name);
  assert.deepEqual(names, ["Renamed locally", "Born remotely"]);
});

test("items unknown locally are adopted", () => {
  const local = blank();
  const remote = clone(blank());
  remote.tasks.push({ id: "tNew", boardId: "b1", colId: "c1", title: "from the phone", done: false, createdAt: 7, touchedAt: 7 });
  const merged = mergeStates(local, remote);
  assert.ok(merged.tasks.some(t => t.id === "tNew"));
});
