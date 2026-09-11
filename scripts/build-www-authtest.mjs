// THROWAWAY test bundle: the normal www build plus a self-driving auth+sync
// probe for the native shell. Never committed (www/ is gitignored); the clean
// build must be re-run after. Credentials come from .env.local (untracked).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
execSync("node " + JSON.stringify(path.join(root, "scripts/build-www.mjs")), { stdio: "inherit" });

const env = Object.fromEntries(
  fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n").filter(l => l.includes("="))
    .map(l => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
if (!env.TEST_SHELL_PASS) throw new Error("run scripts/shell-test.mjs setup first");

const hook = `
<script>
/* AUTHTEST HOOK - throwaway build only */
(function(){
  if(!window.ATELIER_NATIVE)return;
  const stage=()=>localStorage.getItem('authtest.stage')||'signin';
  const wait=(fn,cb,tries)=>{const t=setInterval(()=>{if(fn()){clearInterval(t);cb();}else if(--tries<=0)clearInterval(t);},500);};
  if(stage()==='signin'){
    wait(()=>{try{return typeof SB!=='undefined'&&SB.client}catch(e){return false}},async()=>{
      const r=await SB.client.auth.signInWithPassword({email:'shelltest@atelier-app.test',password:${JSON.stringify(env.TEST_SHELL_PASS)}});
      if(r.error){document.title='AUTHTEST-FAIL-'+r.error.message;return;}
      localStorage.setItem('authtest.stage','push');
      location.reload();
    },40);
  }else if(stage()==='push'){
    wait(()=>{try{return typeof SB!=='undefined'&&SB.user&&typeof save==='function'}catch(e){return false}},()=>{
      setTimeout(()=>{
        if(!S.masterColumns.length)S.masterColumns=[{id:'atest-m',name:'Boards'}];
        if(!S.boards.length)S.boards=[{id:'atest-b',name:'Shell Test',accent:'#8a9b7e',masterCol:S.masterColumns[0].id,columns:[{id:'atest-c',name:'To do'}]}];
        S.tasks.push({id:'atest-t'+Date.now(),boardId:S.boards[0].id,colId:S.boards[0].columns[0].id,
          title:'SHELL-SYNC-PROOF '+new Date().toISOString(),done:false,createdAt:Date.now(),touchedAt:Date.now()});
        save();
        localStorage.setItem('authtest.stage','done');
      },4000);
    },40);
  }
})();
<\/script>`;
const p = path.join(root, "www/index.html");
fs.writeFileSync(p, fs.readFileSync(p, "utf8") + hook);
console.log("authtest bundle assembled - remember to rebuild clean afterward");
