// Assemble the native web bundle: the same files GitHub Pages serves,
// copied into www/ for Capacitor, plus native-mode markers.
//   node scripts/build-www.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const www = path.join(root, "www");
fs.rmSync(www, { recursive: true, force: true });
fs.mkdirSync(path.join(www, "core"), { recursive: true });

for (const f of ["index.html", "reset.html", "manifest.json", "icon-rounded.png", "icon-padded.png", "apple-touch-icon.png"])
  fs.copyFileSync(path.join(root, f), path.join(www, f));
for (const f of fs.readdirSync(path.join(root, "core")))
  fs.copyFileSync(path.join(root, "core", f), path.join(www, "core", f));

/* native marker: the shell build knows itself (guards: update pill, gcal popups) */
let html = fs.readFileSync(path.join(www, "index.html"), "utf8");
html = html.replace("<script>/* apply saved theme", "<script>window.ATELIER_NATIVE=true;</script>\n<script>/* apply saved theme");
fs.writeFileSync(path.join(www, "index.html"), html);
console.log("www/ assembled");
