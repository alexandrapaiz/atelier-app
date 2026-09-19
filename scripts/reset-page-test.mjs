// Sprint 2 verification helper — drives the password reset flow in a real browser.
//   node scripts/reset-page-test.mjs
// Serves the repo over http, launches headless Chrome, and runs the shipped
// index.html and reset.html through Chrome DevTools Protocol. The Supabase SDK
// is the only thing faked: its CDN module is fulfilled with a stub that records
// what the pages ask of it, so the assertions are about our code, not theirs.
// No dependencies — node's WebSocket and Chrome's own protocol do the work.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = 8129, DEBUG_PORT = 9223;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".png": "image/png" };

/* ---- the stub Supabase module, served in place of the jsdelivr import ---- */
const STUB = `
window.__sb = { setSession: null, exchange: null, updated: null, reset: null };
export function createClient(url, key, opts) {
  window.__sb.url = url; window.__sb.key = key; window.__sb.opts = opts;
  return { auth: {
    setSession: async (s) => { window.__sb.setSession = s;
      return s.access_token === "GOOD-TOKEN" ? { data: {}, error: null } : { data: {}, error: { message: "invalid claim" } }; },
    exchangeCodeForSession: async (c) => { window.__sb.exchange = c; return { data: {}, error: null }; },
    updateUser: async (u) => { window.__sb.updated = u; return { data: {}, error: null }; },
    resetPasswordForEmail: async (e, o) => { window.__sb.reset = [e, o]; return { data: {}, error: null }; },
  } };
}`;

/* ---- static server ---- */
const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "") || "index.html");
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404).end(); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(PORT, r));

/* ---- chrome ---- */
const profile = fs.mkdtempSync("/tmp/atelier-chrome-");
const chrome = spawn("google-chrome", [
  "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run", "--disable-dev-shm-usage",
  `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });

async function browserSocket() {
  for (let i = 0; i < 60; i++) {
    try { return (await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`)).json()).webSocketDebuggerUrl; }
    catch { await new Promise(r => setTimeout(r, 250)); }
  }
  throw new Error("chrome never came up");
}

/* ---- a minimal CDP client ---- */
function connect(url) {
  return new Promise(resolve => {
    const ws = new WebSocket(url);
    let id = 0; const pending = new Map(); const listeners = [];
    ws.onmessage = e => {
      const m = JSON.parse(e.data);
      if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
      else listeners.forEach(l => l(m));
    };
    ws.onopen = () => resolve({
      send: (method, params = {}, sessionId) => new Promise((ok, fail) => {
        const i = ++id;
        pending.set(i, m => m.error ? fail(new Error(`${method}: ${m.error.message}`)) : ok(m.result));
        ws.send(JSON.stringify({ id: i, method, params, sessionId }));
      }),
      on: l => listeners.push(l),
      close: () => ws.close(),
    });
  });
}

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? "ok  " : "FAIL"} ${name}${detail ? `  — ${detail}` : ""}`);
}

const cdp = await connect(await browserSocket());
const { targetId } = await cdp.send("Target.createTarget", { url: "about:blank" });
const { sessionId } = await cdp.send("Target.attachToTarget", { targetId, flatten: true });
const send = (m, p) => cdp.send(m, p, sessionId);

await send("Page.enable");
await send("Runtime.enable");
await send("Fetch.enable", { patterns: [{ urlPattern: "*jsdelivr*", requestStage: "Request" }] });

cdp.on(async m => {
  if (m.method !== "Fetch.requestPaused") return;
  await send("Fetch.fulfillRequest", {
    requestId: m.params.requestId, responseCode: 200,
    responseHeaders: [{ name: "content-type", value: "text/javascript" }, { name: "access-control-allow-origin", value: "*" }],
    body: Buffer.from(STUB).toString("base64"),
  }).catch(() => {});
});

let loaded;
cdp.on(m => { if (m.method === "Page.loadEventFired" && loaded) loaded(); });
async function go(url) {
  /* about:blank first: two URLs differing only by fragment are one document to
     Chrome, and the page under test would never re-run */
  const blank = new Promise(r => { loaded = r; });
  await send("Page.navigate", { url: "about:blank" });
  await Promise.race([blank, new Promise(r => setTimeout(r, 5000))]);
  /* the load event is the signal; a slow font or CDN must not hang the run */
  const wait = new Promise(r => { loaded = r; });
  await send("Page.navigate", { url });
  await Promise.race([wait, new Promise(r => setTimeout(r, 15000))]);
  await new Promise(r => setTimeout(r, 900));   // let the module script settle
  process.stderr.write(`· ${url}\n`);
}
async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || "evaluation threw");
  return r.result.value;
}

const base = `http://127.0.0.1:${PORT}`;
try {
  /* ---------- 1. the app: "forgot?" asks Supabase for the right link ---------- */
  await go(`${base}/index.html`);
  const modal = await evaluate(`
    SB.client = { auth: { resetPasswordForEmail: async (e, o) => { window.__forgot = [e, o]; return { error: null }; } } };
    sbSignIn();
    document.getElementById('sbModal').innerHTML`);
  check("sign-in modal offers forgot?", /onclick="sbForgot\(\)">forgot\?</.test(modal));

  const noEmail = await evaluate(`
    document.getElementById('sbEmail').value = '';
    sbForgot().then(() => document.getElementById('sbMsg').textContent)`);
  check("forgot? with no email asks for one", noEmail === "Your email first.", noEmail);

  const sent = await evaluate(`
    document.getElementById('sbEmail').value = 'alexandra@example.com';
    sbForgot().then(() => ({ msg: document.getElementById('sbMsg').textContent, call: window.__forgot }))`);
  check("forgot? mails the recovery link", sent.call?.[0] === "alexandra@example.com" && sent.msg === "Check your email for the link.",
    `${sent.call?.[0]} / "${sent.msg}"`);
  check("recovery link points at the published reset page",
    sent.call?.[1]?.redirectTo === "https://alexandrapaiz.github.io/atelier-app/reset.html", sent.call?.[1]?.redirectTo);

  /* ---------- 2. the reset page with no token ---------- */
  await go(`${base}/reset.html`);
  const bare = await evaluate(`({ msg: document.getElementById('msg').textContent,
    form: document.getElementById('form').hidden, back: document.getElementById('back').hidden })`);
  check("no token shows the spent-link message", /expired/.test(bare.msg), bare.msg);
  check("no token hides the form", bare.form === true && bare.back === false);

  /* ---------- 3. the reset page with a stale token ---------- */
  await go(`${base}/reset.html#access_token=STALE&refresh_token=r&type=recovery`);
  const stale = await evaluate(`({ msg: document.getElementById('msg').textContent, form: document.getElementById('form').hidden })`);
  check("a refused token shows the spent-link message", /expired/.test(stale.msg) && stale.form === true, stale.msg);

  /* ---------- 4. the reset page with a live token ---------- */
  await go(`${base}/reset.html#access_token=GOOD-TOKEN&refresh_token=r1&type=recovery`);
  const live = await evaluate(`({ form: document.getElementById('form').hidden, hash: location.hash,
    sent: window.__sb.setSession, opts: window.__sb.opts })`);
  check("a live token opens the form", live.form === false);
  check("the token is spent against Supabase", live.sent?.access_token === "GOOD-TOKEN" && live.sent?.refresh_token === "r1");
  check("the token leaves the address bar", live.hash === "", JSON.stringify(live.hash));
  check("the app's stored session is left alone", live.opts?.auth?.persistSession === false);

  const short = await evaluate(`
    document.getElementById('pass').value = 'short12';
    document.getElementById('pass2').value = 'short12';
    document.getElementById('go').click();
    new Promise(r => setTimeout(() => r(document.getElementById('msg').textContent), 120))`);
  check("a short password is refused", short === "Eight characters at least." && await evaluate(`window.__sb.updated === null`), short);

  const mismatch = await evaluate(`
    document.getElementById('pass').value = 'lightandshadow';
    document.getElementById('pass2').value = 'lightandshadoe';
    document.getElementById('go').click();
    new Promise(r => setTimeout(() => r(document.getElementById('msg').textContent), 120))`);
  check("a mismatch is refused", mismatch === "Those two do not match." && await evaluate(`window.__sb.updated === null`), mismatch);

  const saved = await evaluate(`
    document.getElementById('pass2').value = 'lightandshadow';
    document.getElementById('go').click();
    new Promise(r => setTimeout(() => r({ msg: document.getElementById('msg').textContent,
      updated: window.__sb.updated, form: document.getElementById('form').hidden,
      back: document.getElementById('back').hidden }), 200))`);
  check("a good password is saved", saved.updated?.password === "lightandshadow");
  check("the page sends her back to the app", /Password changed/.test(saved.msg) && saved.form === true && saved.back === false, saved.msg);
} finally {
  cdp.close(); chrome.kill(); server.close();
  await new Promise(r => setTimeout(r, 300));   // chrome finishes writing its profile
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

const failed = results.filter(r => !r.pass).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
