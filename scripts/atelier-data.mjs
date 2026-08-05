// Claude's direct line to Atelier's database (replaces the old file/embed handoffs).
// Reads keys from .env.local (never committed). Node 18+.
//
//   node scripts/atelier-data.mjs get           → prints the full document (JSON)
//   node scripts/atelier-data.mjs set doc.json  → replaces the document with the file's contents
//
// The document is the app's whole state: meta, masterColumns, boards, goals,
// tasks, plan, priCols, stars, rewards, claude{notes,inbox}. Edit conservatively:
// get → modify → set. Deletions must go through meta.tomb (tombstones) or they
// will resurrect on the next device merge.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const env = Object.fromEntries(
  fs.readFileSync(path.join(root, ".env.local"), "utf8")
    .split("\n").filter(l => l.includes("="))
    .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const url = `${env.SUPABASE_URL}/rest/v1/atelier_state?user_id=eq.${env.ATELIER_USER_ID}`;
const headers = {
  apikey: env.SUPABASE_SECRET_KEY,
  Authorization: `Bearer ${env.SUPABASE_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const cmd = process.argv[2];
if (cmd === "get") {
  const r = await fetch(`${url}&select=doc,updated_at`, { headers });
  const rows = await r.json();
  if (!rows.length) { console.error("no row"); process.exit(1); }
  console.log(JSON.stringify(rows[0].doc, null, 1));
} else if (cmd === "set") {
  const doc = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
  if (!doc || !doc.meta) { console.error("that is not an Atelier document"); process.exit(1); }
  doc.meta.updatedAt = Date.now();
  const r = await fetch(url, {
    method: "PATCH",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify({ doc, updated_at: new Date().toISOString() }),
  });
  const rows = await r.json();
  if (!r.ok || !rows.length) { console.error("update failed", r.status, rows); process.exit(1); }
  console.log("ok — tasks:", rows[0].doc.tasks.length, "boards:", rows[0].doc.boards.length);
} else {
  console.error("usage: node scripts/atelier-data.mjs get | set <file.json>");
  process.exit(1);
}
