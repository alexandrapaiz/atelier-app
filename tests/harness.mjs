/* Phase 2 safety net: run the app's REAL script (extracted from index.html)
   inside Node with a minimal DOM stub, and hand its functions to the tests.
   No copies, no drift — the code under test is the code that ships. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

/* the main application script is the last inline <script> block */
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const main = blocks[blocks.length - 1];
if (!main || main.length < 100000) throw new Error("could not locate the main script block");

/* ---- a DOM just deep enough to boot ---- */
function el() {
  return new Proxy(function () {}, {
    get(t, k) {
      if (k === "classList") return { add() {}, remove() {}, toggle() {}, contains: () => false };
      if (k === "style") return new Proxy({}, { get: () => "", set: () => true });
      if (k === "dataset") return {};
      if (k === "children" || k === "childNodes") return [];
      if (k === "addEventListener" || k === "removeEventListener" || k === "appendChild"
        || k === "removeChild" || k === "remove" || k === "focus" || k === "blur"
        || k === "click" || k === "select" || k === "setAttribute" || k === "removeAttribute"
        || k === "insertBefore" || k === "dispatchEvent" || k === "scrollTo" || k === "setSelectionRange")
        return () => {};
      if (k === "getAttribute") return () => null;
      if (k === "querySelector") return () => null;
      if (k === "querySelectorAll") return () => [];
      if (k === "closest") return () => null;
      if (k === "getBoundingClientRect") return () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 });
      if (k === "textContent" || k === "innerHTML" || k === "value" || k === "id" || k === "className") return "";
      if (k === "matches") return () => false;
      return undefined;
    },
    set: () => true,
  });
}

const storage = new Map();
const sandbox = {
  console, setTimeout, clearTimeout, setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => 0, cancelAnimationFrame: () => {},
  Date, Math, JSON, Object, Array, String, Number, Boolean, RegExp, Map, Set, Promise,
  isFinite, parseInt, parseFloat, encodeURIComponent, decodeURIComponent, escape, unescape,
  Event: class { constructor(t) { this.type = t; } }, KeyboardEvent: class { constructor(t, o) { Object.assign(this, o, { type: t }); } },
  HTMLElement: function () {}, MouseEvent: class {},
  localStorage: {
    getItem: k => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    removeItem: k => storage.delete(k),
  },
  navigator: { clipboard: { writeText: async () => {} } },
  location: { hash: "", pathname: "/", reload() {} },
  history: { replaceState() {} },
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  fetch: async () => { throw new Error("offline test sandbox"); },
  confirm: () => true, alert: () => {}, prompt: () => null,
  innerWidth: 1280, innerHeight: 800, scrollY: 0,
  addEventListener: () => {}, removeEventListener: () => {},
  google: undefined,
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.document = new Proxy({}, {
  get(t, k) {
    if (k === "getElementById") return () => el();
    if (k === "querySelector") return () => null;
    if (k === "querySelectorAll") return () => [];
    if (k === "createElement") return () => el();
    if (k === "addEventListener" || k === "removeEventListener") return () => {};
    if (k === "dispatchEvent") return () => true;
    if (k === "body") return el();
    if (k === "documentElement") return el();
    if (k === "activeElement") return null;
    if (k === "lastModified") return "01/01/2026 00:00:00";
    if (k === "hidden") return false;
    if (k === "elementFromPoint") return () => null;
    return undefined;
  },
  set: () => true,
});

vm.createContext(sandbox);
/* core files load first, in the same order the browser sees them */
for (const m of html.matchAll(/<script src="(core\/[^"]+)"><\/script>/g)) {
  const src = fs.readFileSync(path.join(root, m[1]), "utf8");
  vm.runInContext(src, sandbox, { filename: m[1] });
}
vm.runInContext(main, sandbox, { filename: "index.html<main script>" });

/* const/let top-level bindings live in the script scope, not on the context —
   bridge the ones the tests need */
const bridged = vm.runInContext(
  "({ taskAgeDays, isWaiting, priEligible, blockerOf, byUrgent, isRoutine, isAppt, lastPulse, _getS:()=>S, _setS:v=>{S=v} })",
  sandbox
);
Object.assign(sandbox, bridged);
Object.defineProperty(sandbox, "S", { get: () => bridged._getS(), set: v => bridged._setS(v) });

export default sandbox;
