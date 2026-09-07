/* Atelier core — the natural-language layer. Plain globals, loaded before the app. */
const todayStr=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dstr=d=>{const p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate());};
function nlParse(raw){
  /* the escape: \word shields that token — invisible to date, time, and urgency parsing,
     it lands in the title verbatim.  "Prepare \friday agenda 3pm" keeps the word, takes the hour. */
  const guards=[];
  raw=String(raw).replace(/\\+([^\s\\]+)/g,(m,w)=>{guards.push(w);return '\u0001'+(guards.length-1)+'\u0001';});
  const unguard=x=>String(x).replace(/\u0001(\d+)\u0001/g,(m,i)=>guards[+i]);
  let atTok=null;
  raw=raw.replace(/(^|\s)@(?:"([^"]+)"|\u201c([^\u201d]+)\u201d|([^\s@]+))/,(m,sp,q1,q2,w)=>{atTok=(q1||q2||w).trim();return sp;});
  let s=' '+raw+' ';
  const out={due:null,start:null,end:null,urgent:false,title:raw};
  const pad=n=>String(n).padStart(2,'0');
  const ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  const now=new Date();
  const eat=re=>{const m=s.match(re); if(m)s=s.replace(m[0],' '); return m;};
  const hm=(h,mn,mer)=>{
    h=+h; mn=mn?+mn:0;
    if(mer){mer=mer.toLowerCase();
      if(/^p/.test(mer)&&h<12)h+=12;
      if(/^a/.test(mer)&&h===12)h=0;
    }
    if(h>23||mn>59)return null;
    return pad(h)+':'+pad(mn);
  };
  /* urgency — the words, or any exclamation mark at all */
  if(/(^|\s)(urgent|urgente|asap)\b/i.test(s)||s.includes('!')){
    out.urgent=true;
    s=s.replace(/(^|\s)(urgent|urgente|asap)\b[:,;\-\s]*/gi,' ').replace(/!+/g,' ');
  }
  /* spanish meridiem phrases → am/pm markers */
  s=s.replace(/\s(?:de|por)\s+la\s+(mañana|manana)\b/gi,' am')
     .replace(/\s(?:de|por)\s+la\s+(tarde|noche)\b/gi,' pm')
     .replace(/\bp\.?\s?m\.?\b/gi,'pm').replace(/\ba\.?\s?m\.?\b/gi,'am');
  const T='(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm)?';
  /* time range: 8:30-10pm · 5 to 6pm · de 5 a 6pm */
  let m=eat(new RegExp('\\s(?:from|de|desde)?\\s*'+T+'\\s*(?:-|–|—|to|a|hasta|until)\\s*'+T+'\\s','i'));
  if(m&&(m[3]||m[6]||m[2]||m[5])){
    const a=hm(m[1],m[2],m[3]||m[6]), b=hm(m[4],m[5],m[6]);
    if(a&&b){out.start=a;out.end=b;}
  }
  /* single time — needs am/pm, a colon, or an "at / a las / @" cue */
  if(!out.start){
    m=eat(new RegExp('\\s(?:at|@|a\\s+las?|para\\s+las?)\\s*'+T+'\\s','i'))
     ||eat(/\s(\d{1,2}):(\d{2})\s*(am|pm)?\s/i)
     ||eat(/\s(\d{1,2})()\s*(am|pm)\s/i);
    if(m){const a=hm(m[1],m[2],m[3]); if(a)out.start=a;}
  }
  if(eat(/\s(noon|mediod[ií]a)\s/i))out.start=out.start||'12:00';
  if(eat(/\s(midnight|medianoche)\s/i))out.start=out.start||'00:00';
  /* dates, most explicit first */
  const setD=d=>{out.due=ymd(d);};
  if(eat(/\s(today|hoy|tonight|esta\s+noche)\s/i))setD(now);
  else if(eat(/\s(tomorrow|mañana|manana)\s/i)){const d=new Date(now);d.setDate(d.getDate()+1);setD(d);}
  else if((m=eat(/\s(?:in|en)\s+(\d{1,2})\s+(days?|d[ií]as?)\s/i))){const d=new Date(now);d.setDate(d.getDate()+ +m[1]);setD(d);}
  else if(eat(/\s(next\s+week|pr[óo]xima\s+semana)\s/i)){const d=new Date(now);d.setDate(d.getDate()+7);setD(d);}
  else if((m=eat(new RegExp('\\s(next\\s+|pr[óo]ximo\\s+|este\\s+|this\\s+)?('+Object.keys(NL_DOWS).join('|')+')\\s','i')))){
    const target=NL_DOWS[m[2].toLowerCase()], d=new Date(now);
    let diff=(target-d.getDay()+7)%7;
    if(/next|próximo|proximo/i.test(m[1]||''))diff=diff||7,diff+= (diff<7&&/next|próximo|proximo/i.test(m[1])&&diff!==7)?7-diff>0?0:0:0;
    if(/next|próximo|proximo/i.test(m[1]||'')&&diff===0)diff=7;
    d.setDate(d.getDate()+diff);setD(d);
  }
  else if((m=eat(new RegExp('\\s('+Object.keys(NL_MONTHS).join('|')+')\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?\\s','i')))){
    const d=new Date(now.getFullYear(),NL_MONTHS[m[1].toLowerCase()],+m[2]);
    if(d<new Date(now.getFullYear(),now.getMonth(),now.getDate()))d.setFullYear(d.getFullYear()+1);
    setD(d);
  }
  else if((m=eat(new RegExp('\\s(\\d{1,2})(?:st|nd|rd|th)?\\s+(?:de\\s+)?('+Object.keys(NL_MONTHS).join('|')+')\\.?\\s','i')))){
    const d=new Date(now.getFullYear(),NL_MONTHS[m[2].toLowerCase()],+m[1]);
    if(d<new Date(now.getFullYear(),now.getMonth(),now.getDate()))d.setFullYear(d.getFullYear()+1);
    setD(d);
  }
  else if((m=eat(/\s(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\s/))){   // d/m — the way you write dates
    let a=+m[1],b=+m[2],yr=m[3]?(+m[3]<100?2000+ +m[3]:+m[3]):now.getFullYear();
    if(a>12&&b<=12){}else if(b>12&&a<=12){const t=a;a=b;b=t;}   // swap if clearly m/d
    const d=new Date(yr,b-1,a);
    if(!m[3]&&d<new Date(now.getFullYear(),now.getMonth(),now.getDate()))d.setFullYear(d.getFullYear()+1);
    if(!isNaN(d))setD(d);
  }
  if(out.start&&!out.due)out.due=ymd(now);          // a time implies today
  out.appt=!!out.start||NL_APPT.test(raw);          // an hour, or a word that means "be there"
  /* tidy the leftover title */
  let t=s.replace(/\s+/g,' ').trim()
     .replace(/\s+(?:at|on|el|de|a|para|from|desde|@)[\s,;·—–-]*$/i,'')
     .replace(/^[\s,;·—–-]+|[\s,;·—–-]+$/g,'').replace(/\s{2,}/g,' ');
  if(t)out.title=t.charAt(0).toUpperCase()+t.slice(1);
  out.title=unguard(out.title);
  if(atTok)out.at=atTok;
  return out;
}
/* social & scheduled-by-nature words — these are commitments, not chores */
const NL_APPT=/\b(lunch|dinner|breakfast|brunch|coffee|caf[ée]|drinks|dinner|almuerzo|cena|desayuno|comida|cafecito|meeting|reuni[óo]n|junta|appointment|cita|consulta|call|llamada|interview|entrevista|class|clase|church|iglesia|misa|party|fiesta|birthday|cumplea[ñn]os|date|flight|vuelo|doctor|dentist|dentista|session|sesi[óo]n|retiro|retreat|wedding|boda)\b/i;
/* typing "urgent" / "urgente" / "asap" — or any ! — anywhere in a title IS the urgent tag */
function urgentStrip(v){
  const g=[];
  v=String(v).replace(/\\+([^\s\\]+)/g,(m,w)=>{g.push(w);return '\u0001'+(g.length-1)+'\u0001';});
  const has=/(^|\s)(urgent|urgente|asap)\b/i.test(v)||v.includes('!');
  const title=v.replace(/(^|\s)(urgent|urgente|asap)\b[:,;\-\s]*/gi,' ').replace(/!+/g,'').replace(/\s+/g,' ').trim()
    .replace(/\u0001(\d+)\u0001/g,(m,i)=>g[+i]);
  return {has,title};
}
