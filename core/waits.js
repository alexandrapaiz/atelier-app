/* Atelier core — waits, dependencies, priority order. */
const blockerOf=t=>t&&t.after?S.tasks.find(x=>x.id===t.after&&!x.done):null;
const isWaiting=t=>!!(t&&(blockerOf(t)||t.waitWho));
const priEligible=t=>{const b=board(t.boardId);return !(b&&b.noPri);};
const taskAgeDays=t=>Math.floor((Date.now()-(t.createdAt||Date.now()))/864e5);
function depCycle(id,after){let cur=after,g=0;while(cur&&g++<100){if(cur===id)return true;const n=S.tasks.find(x=>x.id===cur);cur=n&&n.after;}return false;}
const byUrgent=a=>[...a].sort((x,z)=>{
  const k=t=>isWaiting(t)?2:(t.urgent?0:1);   // waiting sinks: it isn't yours to do right now
  return k(x)-k(z);
});
function resolveWait(tok,bid,selfId){
  const q=String(tok).toLowerCase();
  const people=new Set(S.tasks.map(x=>x.waitWho&&x.waitWho.toLowerCase()).filter(Boolean));
  if(people.has(q)){const known=S.tasks.find(x=>x.waitWho&&x.waitWho.toLowerCase()===q);return {who:known.waitWho};}
  const rec=x=>Math.max(x.touchedAt||0,x.createdAt||0);
  const cand=S.tasks.filter(x=>!x.done&&!isRoutine(x)&&x.id!==selfId&&!depCycle(selfId||'',x.id)
    &&x.title.toLowerCase().includes(q));
  if(cand.length){
    const same=cand.filter(x=>x.boardId===bid).sort((a,b)=>rec(b)-rec(a));
    return {after:(same[0]||cand.sort((a,b)=>rec(b)-rec(a))[0]).id};
  }
  return {who:tok};
}
