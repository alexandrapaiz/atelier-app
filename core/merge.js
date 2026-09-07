/* Atelier core — the sync merge: graves first, then per-item, freshest touch wins. */
function mergeStates(loc,rem){
  if(!rem||!rem.meta)return loc;
  const preferRem=(rem.meta.updatedAt||0)>(loc.meta.updatedAt||0);
  /* graves first — every side's deletions, newest wins, before anything is let back in */
  loc.meta.tomb=loc.meta.tomb||{};
  if(rem.meta.tomb)Object.keys(rem.meta.tomb).forEach(k=>{
    if(!loc.meta.tomb[k]||rem.meta.tomb[k]>loc.meta.tomb[k])loc.meta.tomb[k]=rem.meta.tomb[k];
  });
  const tomb=loc.meta.tomb;
  const buried=x=>!!(x&&x.id&&tomb[x.id]);
  const merge=(la,ra)=>{
    if(!la||!ra)return la||ra||[];
    const m=new Map(la.map((x,i)=>[x.id,i]));
    ra.forEach(x=>{
      if(buried(x))return;                       // it was deleted on purpose; don't resurrect it
      if(!m.has(x.id))la.push(x);
      else if(preferRem)la[m.get(x.id)]=x;
    });
    return la;
  };
  /* per-item: the freshest touch wins, no matter which side's document is globally newer —
     a stale device editing one task must not drag the whole compass back with it */
  const mergeT=(la,ra)=>{
    if(!la||!ra)return la||ra||[];
    const m=new Map(la.map((x,i)=>[x.id,i]));
    ra.forEach(x=>{
      if(buried(x))return;
      if(!m.has(x.id)){la.push(x);return;}
      const i=m.get(x.id), l=la[i];
      const xs=x.touchedAt||x.createdAt||0, ls=l.touchedAt||l.createdAt||0;
      if(xs>ls||(xs===ls&&preferRem))la[i]=x;
    });
    return la;
  };
  mergeT(loc.masterColumns,rem.masterColumns);
  mergeT(loc.boards,rem.boards);
  mergeT(loc.stars=loc.stars||[],rem.stars);
  mergeT(loc.goals,rem.goals);
  merge(loc.imports=loc.imports||[],rem.imports);   // the tray travels too; resolved items stay buried
  /* tasks resolve per-item: newer touch wins, regardless of which side is globally newer */
  {
    const m=new Map(loc.tasks.map((x,i)=>[x.id,i]));
    (rem.tasks||[]).forEach(x=>{
      if(buried(x))return;
      if(!m.has(x.id))loc.tasks.push(x);
      else{
        const i=m.get(x.id), l=loc.tasks[i];
        if((x.touchedAt||x.createdAt||0)>(l.touchedAt||l.createdAt||0))loc.tasks[i]=x;
      }
    });
  }
  merge(loc.priCols,rem.priCols);
  merge(loc.rewards=loc.rewards||[],rem.rewards);
  const em=new Map((loc.plan||[]).map(e=>[e.id,e]));
  (rem.plan||[]).forEach(e=>{
    if(buried(e))return;
    if(!em.has(e.id)){loc.plan.push(e);return;}
    const le=em.get(e.id);
    if((e.touchedAt||0)>(le.touchedAt||0)||(!le.touchedAt&&!e.touchedAt&&preferRem))le.era=e.era;
    if((e.touchedAt||0)>(le.touchedAt||0))le.touchedAt=e.touchedAt;
    merge(le.items,e.items);
  });
  /* board columns live one level down: the winning board keeps its columns,
     but columns born on the other side are still let in */
  {
    const bm=new Map(loc.boards.map(b=>[b.id,b]));
    (rem.boards||[]).forEach(rb=>{
      const lb=bm.get(rb.id);
      if(lb&&rb.columns)rb.columns.forEach(c=>{
        if(!buried(c)&&!lb.columns.some(x=>x.id===c.id))lb.columns.push(c);
      });
    });
  }
  if(rem.gcal&&rem.gcal.length&&(preferRem||!(loc.gcal||[]).length))loc.gcal=rem.gcal;
  if(rem.claude){
    if(!loc.claude)loc.claude={notes:[],inbox:[]};
    const sticky=(la,ra,flag)=>{
      if(!ra)return;
      const m=new Map(la.map((x,i)=>[x.id,i]));
      ra.forEach(x=>{
        if(!m.has(x.id))la.push(x);
        else{const l=la[m.get(x.id)]; if(x[flag]&&!l[flag])l[flag]=x[flag];}
      });
    };
    sticky(loc.claude.notes=loc.claude.notes||[],rem.claude.notes,'resolved');
    sticky(loc.claude.inbox=loc.claude.inbox||[],rem.claude.inbox,'processed');
  }
  if(preferRem&&rem.meta.mission)loc.meta.mission=rem.meta.mission;
  /* a reset always travels, newest wins, whichever side is globally newer */
  if(rem.meta.reset&&(rem.meta.reset.at||0)>((loc.meta.reset&&loc.meta.reset.at)||0))
    loc.meta.reset=rem.meta.reset;
  resigAll(loc);   // merged-in objects are not local edits
  return loc;
}
