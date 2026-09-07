/* The natural-language parser — the single most bug-fertile code in the app.
   Every case here is a behavior a real session once got wrong or almost lost. */
import test from "node:test";
import assert from "node:assert/strict";
import A from "./harness.mjs";

const { nlParse, urgentStrip } = A;

test("plain title parses to itself, nothing extracted", () => {
  const p = nlParse("Buy new plants");
  assert.equal(p.title, "Buy new plants");
  assert.equal(p.due, null);
  assert.equal(p.start, null);
  assert.equal(p.urgent, false);
});

test("weekday + hour extract; words leave the title", () => {
  const p = nlParse("Prepare agenda friday 3pm");
  assert.ok(p.due, "a due date is set");
  assert.equal(p.start, "15:00");
  assert.match(p.title, /^Prepare agenda$/i);
});

test("any ! marks urgent and is stripped", () => {
  const p = nlParse("Call the bank!");
  assert.equal(p.urgent, true);
  assert.ok(!p.title.includes("!"));
});

test("urgente / asap words mark urgent", () => {
  assert.equal(nlParse("pagar la luz urgente").urgent, true);
  assert.equal(nlParse("send it asap").urgent, true);
});

test("backslash shields one token from date parsing", () => {
  const p = nlParse("Prepare \\friday agenda");
  assert.equal(p.due, null);
  assert.match(p.title, /friday/i);
});

test("shielded token coexists with live parsing next to it", () => {
  const p = nlParse("Send report monday \\3pm");
  assert.ok(p.due, "monday parsed");
  assert.equal(p.start, null, "3pm shielded");
  assert.match(p.title, /3pm/);
});

test("\\! keeps a literal bang without urgency", () => {
  const p = nlParse("\\Fix \\everything \\monday\\!");
  assert.equal(p.urgent, false);
  assert.equal(p.due, null);
  assert.match(p.title, /monday!/i);
});

test("a bare hour implies an appointment today", () => {
  const p = nlParse("dinner 8:30pm");
  assert.equal(p.start, "20:30");
  assert.equal(p.appt, true);
});

test("@name is captured as a wait token and leaves the title", () => {
  const p = nlParse("Chase the invoice @Zuzu");
  assert.equal(p.at, "Zuzu");
  assert.equal(p.title, "Chase the invoice");
});

test('@"a few words" captures multi-word tokens', () => {
  const p = nlParse('Follow up @"night photo"');
  assert.equal(p.at, "night photo");
});

test("urgentStrip: detects and strips, shields survive", () => {
  const u = urgentStrip("do it now!");
  assert.equal(u.has, true); assert.equal(u.title, "do it now");
  const s = urgentStrip("keep \\urgent\\! words");
  assert.equal(s.has, false);
  assert.equal(s.title, "keep urgent! words");
});
