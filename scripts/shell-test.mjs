// Sprint 1 verification helper — runs against the project's own Supabase.
// Modes:
//   node scripts/shell-test.mjs setup    → ensure the disposable shell-test user exists
//                                          (password minted once, kept in .env.local)
//   node scripts/shell-test.mjs check    → did the native shell's push land? prints the verdict
//   node scripts/shell-test.mjs teardown → remove the test user's state row marker
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const envPath = path.join(root, ".env.local");
const env = Object.fromEntries(
  fs.readFileSync(envPath, "utf8").split("\n").filter(l => l.includes("="))
    .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const H = { apikey: env.SUPABASE_SECRET_KEY, Authorization: "Bearer " + env.SUPABASE_SECRET_KEY, "Content-Type": "application/json" };
const EMAIL = "shelltest@atelier-app.test";
const mode = process.argv[2] || "setup";

async function findUser() {
  const r = await fetch(env.SUPABASE_URL + "/auth/v1/admin/users?page=1&per_page=200", { headers: H });
  const j = await r.json();
  return (j.users || []).find(u => u.email === EMAIL);
}

if (mode === "setup") {
  let pass = env.TEST_SHELL_PASS;
  if (!pass) {
    pass = "shell-" + crypto.randomBytes(9).toString("hex");
    fs.appendFileSync(envPath, `\nTEST_SHELL_PASS=${pass}\n`);
  }
  const existing = await findUser();
  if (existing) {
    // keep the stored password authoritative
    await fetch(env.SUPABASE_URL + "/auth/v1/admin/users/" + existing.id, {
      method: "PUT", headers: H, body: JSON.stringify({ password: pass }),
    });
    console.log("shell-test user ready (existing):", existing.id);
  } else {
    const r = await fetch(env.SUPABASE_URL + "/auth/v1/admin/users", {
      method: "POST", headers: H,
      body: JSON.stringify({ email: EMAIL, password: pass, email_confirm: true }),
    });
    const j = await r.json();
    if (!r.ok) { console.error("create failed:", r.status, j.msg || j.message); process.exit(1); }
    console.log("shell-test user created:", j.id);
  }
} else if (mode === "check") {
  const u = await findUser();
  if (!u) { console.log("VERDICT: no test user"); process.exit(1); }
  const r = await fetch(env.SUPABASE_URL + `/rest/v1/atelier_state?user_id=eq.${u.id}&select=doc,updated_at`, { headers: H });
  const rows = await r.json();
  if (!rows.length) { console.log("VERDICT: no state row — the shell never pushed"); process.exit(1); }
  const doc = rows[0].doc;
  const marker = (doc.tasks || []).find(t => /SHELL-SYNC-PROOF/.test(t.title));
  const ageS = Math.round((Date.now() - new Date(rows[0].updated_at).getTime()) / 1000);
  console.log(marker
    ? `VERDICT: OK — marker task present, row updated ${ageS}s ago, ${doc.tasks.length} task(s)`
    : `VERDICT: row exists (updated ${ageS}s ago) but no marker task`);
} else if (mode === "teardown") {
  const u = await findUser();
  if (u) {
    await fetch(env.SUPABASE_URL + `/rest/v1/atelier_state?user_id=eq.${u.id}`, { method: "DELETE", headers: H });
    console.log("test state row removed");
  }
}
