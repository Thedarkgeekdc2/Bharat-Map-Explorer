/* Learning Evidence Corner — engine: question generation from the existing data bank, scoring, BEFORE/AFTER comparison, report rows.
   No server, no database. */
window.TQ=(function(){
const CFG={auth:{user:'KV2KGP',pass:'1261'},classes:[1,2,3,4,5],sections:['A','B','C','D'],maxStudents:50,years:['2025–26','2026–27','2027–28','2028–29'],
  thresholds:{strong:80,practice:60},minTopicQ:2,version:2,counts:[5,10,15,20],mapShares:[20,30,40,50],defaultMapShare:40};
const TOPICS=[{id:'identity',en:'State and Union Territory identity'},{id:'capital',en:'Capitals'},{id:'dance',en:'Classical dance'},{id:'folk',en:'Folk arts and traditions'},
  {id:'festival',en:'Festivals'},{id:'food',en:'Foods'},{id:'animal',en:'State animals'},{id:'wildlife',en:'Notable wildlife'},{id:'places',en:'Famous places, crafts and other documented facts'}];
const PRACTICE={identity:'State / UT identity practice (Explore Map, tap and name the place)',capital:'Capital identification practice (Play Quiz → Capital Match)',dance:'Classical dance and state matching practice (Discover → Classical Dance)',
  folk:'Folk arts and traditions practice (Discover → All, search a tradition)',festival:'Festival and state matching practice (Discover → Festival Calendar)',food:'Famous food and state matching practice (Discover → Famous Food)',
  animal:'State animal practice (Learn cards, Class 1–2 style)',wildlife:'State wildlife and habitat practice (Discover → All)',places:'Famous places practice (Discover → Places)',map:'Map skills practice (Explore Map, Find the State, Build India)'};
/* Class rules: topics, word length, option count and language by class. Based on the NCERT EVS (Looking Around) expectations seen in official syllabus documents:
   Class 1-2: no state-wise lists were found, so only simple topics; Class 3: states and capitals, festivals, food; Class 4-5: location of states, capital, food, festival, famous places, dance/art, national parks. */
const PROFILE={1:{rec:['animal','festival','food'],maxWords:3,opts:3,lang:'both'},2:{rec:['animal','festival','food'],maxWords:3,opts:3,lang:'both'},
  3:{rec:['capital','animal','festival','food'],maxWords:4,opts:4,lang:'both'},4:{rec:['identity','capital','dance','folk','festival','food','animal','places'],maxWords:7,opts:4,lang:'en'},
  5:{rec:['identity','capital','dance','folk','festival','food','animal','wildlife','places'],maxWords:99,opts:4,lang:'en'}};
const prof=g=>PROFILE[g]||PROFILE[5];
const tname=id=>id==='map'?'Map skills':(TOPICS.find(t=>t.id===id)||{en:id}).en;
const shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
const lab=s=>s.replace(/\s*\(.*?\)\s*/g,' ').trim();
const cap=r=>CAPITALS[r.id].en;
/* ---------- candidate bases (one per fact) ---------- */
function items(useDK){const it=[];REGIONS.forEach(r=>{const D=CONTENT[r.id],K=useDK?(D.dk||{}):{};
  const add=(cat,a)=>(a||[]).forEach(x=>it.push({cat,r,text:x.en,hi:x.hi,key:itemKey(x.en)}));
  add('dance',D.classical);add('folk',D.traditions);add('folk',K.folk);add('festival',D.festivals);add('festival',K.festivals);add('food',D.foods);add('food',K.foods);
  add('animal',D.animal?[D.animal]:[]);add('wildlife',K.wildlife);add('places',D.famous);add('places',K.famous);});
  const n={};it.forEach(i=>n[i.key]=(n[i.key]||0)+1);return it.filter(i=>n[i.key]===1&&!/shared|maratha/i.test(i.text));}
function bases(topic,useDK,grade){
  if(topic==='identity')return REGIONS.map(r=>({base:'identity|'+r.id,topic,r}));
  if(topic==='capital')return REGIONS.filter(r=>!['chandigarh','puducherry'].includes(r.id)).map(r=>({base:'capital|'+r.id,topic,r}));
  const mw=prof(grade).maxWords;return items(useDK).filter(i=>i.cat===topic&&lab(i.text).split(/\s+/).length<=mw).map(i=>({base:topic+'|'+i.key,topic,r:i.r,label:lab(i.text),hi:i.hi}));}
const capacity=(topics,useDK,grade)=>Object.fromEntries(topics.map(t=>[t,bases(t,useDK,grade).length]));
/* ---------- question construction ---------- */
const PH={dance:l=>`${l} is a classical dance of`,festival:l=>`the festival ${l} is known in`,food:l=>`${l} is famous in`,animal:l=>`the ${l} is the Official State Animal of`,wildlife:l=>`${l} is notable wildlife of`,folk:l=>`the tradition ${l} belongs to`,places:l=>`${l} is in`};
const PHH={dance:l=>`${l} किस राज्य का शास्त्रीय नृत्य है?`,festival:l=>`त्योहार ${l} किस राज्य में प्रसिद्ध है?`,food:l=>`${l} किस राज्य में प्रसिद्ध है?`,animal:l=>`${l} किस राज्य का राज्य पशु है?`,wildlife:l=>`${l} किस राज्य या केंद्रशासित प्रदेश का प्रमुख वन्यजीव है?`,folk:l=>`${l} किस राज्य की कला या परंपरा है?`,places:l=>`${l} किस राज्य में है?`};
/* language helpers: 'en', 'hi' or 'both' (Hindi + English) */
const tx=(lg,e,h)=>lg==='en'?e:lg==='hi'?h:h+'\n'+e;
const SN=(r,lg)=>lg==='en'?r.en:lg==='hi'?r.hi:`${r.hi} (${r.en})`;
const CN=(r,lg)=>{const c=CAPITALS[r.id];return lg==='en'||c.hi===c.en?c.en:lg==='hi'?c.hi:`${c.hi} (${c.en})`;};
const TFO=lg=>lg==='en'?['True','False']:lg==='hi'?['सही','गलत']:['True / सही','False / गलत'];
const KN=(ut,lg)=>{const e=ut?'Union Territory':'State',h=ut?'केंद्रशासित प्रदेश':'राज्य';return lg==='en'?e:lg==='hi'?h:`${h} (${e})`;};
function make(b,type,o){o=o||{};const lg=o.lg||'en',sp=!!o.sp,np=o.nopt||4,r=b.r,id0=b.base,tfo=TFO(lg);
  const tf=(t,text,expl)=>({id:id0+'|tf|'+(t?'T':'F'),topic:b.topic,type:'tf',difficulty:'easy',text,options:tfo,correct:t?tfo[0]:tfo[1],explanation:expl,base:id0});
  const mc=(text,opts,correct,expl)=>({id:id0+'|mcq',topic:b.topic,type:'mcq',difficulty:'medium',text,options:shuf(opts),correct,explanation:expl,base:id0});
  if(b.topic==='identity'){const ut=r.type==='ut';
    if(type==='mcq')return mc(tx(lg,`${r.en} is a ...`,`${r.hi} एक ... है।`),[KN(false,lg),KN(true,lg)],KN(ut,lg),tx(lg,`${r.en} is a ${ut?'Union Territory':'State'}.`,`${r.hi} एक ${ut?'केंद्रशासित प्रदेश':'राज्य'} है।`));
    const t=Math.random()<.5,u2=t?ut:!ut;return tf(t,tx(lg,`True or False: ${r.en} is a ${u2?'Union Territory':'State'}.`,`सही या गलत: ${r.hi} एक ${u2?'केंद्रशासित प्रदेश':'राज्य'} है।`),tx(lg,`${r.en} is a ${ut?'Union Territory':'State'}.`,`${r.hi} एक ${ut?'केंद्रशासित प्रदेश':'राज्य'} है।`));}
  if(b.topic==='capital'){const c=CAPITALS[r.id],ex=tx(lg,`The capital of ${r.en} is ${c.en}.`,`${r.hi} की राजधानी ${c.hi} है।`);
    if(type==='mcq'){const o2=[CN(r,lg)];shuf(REGIONS).forEach(x=>{if(o2.length<np&&x.id!==r.id&&CAPITALS[x.id].en!==c.en&&!o2.includes(CN(x,lg)))o2.push(CN(x,lg));});
      return mc(tx(lg,sp?`Capital of ${r.en}?`:`What is the capital of ${r.en}?`,`${r.hi} की राजधानी क्या है?`),o2,CN(r,lg),ex);}
    const t=Math.random()<.5;let sh=c;if(!t){const x=shuf(REGIONS).find(x=>CAPITALS[x.id].en!==c.en);sh=CAPITALS[x.id];}
    return tf(t,tx(lg,`True or False: The capital of ${r.en} is ${sh.en}.`,`सही या गलत: ${r.hi} की राजधानी ${sh.hi} है।`),ex);}
  const lh=lab(b.hi||b.label),ex=tx(lg,`${b.label} — ${r.en}.`,`${lh} — ${r.hi}।`);
  if(type==='mcq'){const o2=[SN(r,lg)];shuf(REGIONS).forEach(x=>{if(o2.length<np&&x.id!==r.id)o2.push(SN(x,lg));});
    return mc(tx(lg,sp?`Which state: ${b.label}?`:`Which state or UT: ${PH[b.topic](b.label)} ...?`,PHH[b.topic](lh)),o2,SN(r,lg),ex);}
  const t=Math.random()<.5,x2=t?r:shuf(REGIONS.filter(x=>x.id!==r.id))[0];
  return tf(t,tx(lg,sp?`${b.label} is from ${x2.en}. True or False?`:`True or False: ${PH[b.topic](b.label)} ${x2.en}.`,`सही या गलत: ${lh} का संबंध ${x2.hi} से है।`),ex);}
/* ---------- map questions (use the real clickable map) ---------- */
const TINY=['delhi','chandigarh','goa','dadra-and-nagar-haveli-and-daman-and-diu','lakshadweep','puducherry'];
function mapTargets(grade){const d=window.BMap&&BMap.info&&BMap.info();if(!d)return null;return REGIONS.filter(r=>r.id!=='ladakh'&&d.groups[r.id]&&(grade>=4||!TINY.includes(r.id)));}
const mapQ=(r,lg)=>({id:'map|'+r.id+'|map',topic:'map',type:'map',difficulty:'medium',text:tx(lg||'en',`Tap ${r.en} on the map.`,`नक्शे पर ${r.hi} को छुओ।`),options:[],correct:r.id,explanation:`${r.en} on the map.`,base:'map|'+r.id,target:r.id});
/* ---------- generation: each roll gets its own form with the same topic / type / map mix ---------- */
function makePlanFor(s,R){const mcq=s.typeMode==='mcq'?R:s.typeMode==='tf'?0:Math.ceil(R/2);return{mcq,tf:R-mcq};}
function makePlan(s){const caps=capacity(s.topics,s.includeDK,s.grade),total=s.mcq+s.tf,q={};s.topics.forEach(t=>q[t]=0);
  let left=total,prog=true;while(left>0&&prog){prog=false;for(const t of s.topics){if(left>0&&q[t]<caps[t]){q[t]++;left--;prog=true;}}}
  const plan={};let mLeft=s.mcq;s.topics.forEach((t,i)=>{const n=q[t];let m=i===s.topics.length-1?mLeft:Math.min(n,Math.round(n*s.mcq/Math.max(total,1)));m=Math.max(0,Math.min(n,m,mLeft));mLeft-=m;plan[t]={mcq:m,tf:n-m};});
  let rem=mLeft;for(const t of s.topics){while(rem>0&&plan[t].tf>0){plan[t].tf--;plan[t].mcq++;rem--;}}
  return{plan,shortfall:left,caps};}
function generate(s,o){o=o||{};const sp=(o.grade||0)<=2,N=s.students,reg={},forms={},reused={};
  const mt=s.mapShare>0||o.mapN>0?mapTargets(o.grade):[];
  const mapN=o.mapN!==undefined?o.mapN:(s.mapShare>0?Math.round(s.total*s.mapShare/100):0);
  if(mapN>0&&(!mt||!mt.length))return{error:'The map is not available (it needs the internet the first time). Connect once, or set the map share to 0.'};
  const R=s.total-mapN,mix=makePlanFor(s,R);let plan=o.plan;
  if(!plan){const p=makePlan({topics:s.topics,includeDK:s.includeDK,grade:o.grade,mcq:mix.mcq,tf:mix.tf});if(p.shortfall>0)return{error:`Only ${R-p.shortfall} non-map questions can be made from the selected topics. Reduce the number of questions or add topics.`};plan=p.plan;}
  const ord={};let among=false;
  for(const t of s.topics){const need=plan[t]||{mcq:0,tf:0},n=need.mcq+need.tf;ord[t]=shuf(bases(t,s.includeDK,o.grade));if(n&&ord[t].length<n)return{error:`Not enough data for topic "${tname(t)}" (${ord[t].length} facts, ${n} needed).`};if(n&&ord[t].length<n*N)among=true;}
  const lg=s.lang||'en',nopt=s.nopt||prof(o.grade).opts,mord=shuf(mt||[]);const getQ=(b,type)=>{const k=b.base+'|'+type;return reg[k]||(reg[k]=make(b,type,{lg,sp,nopt}));};
  for(let r=1;r<=N;r++){const av=(o.avoid&&o.avoid[r])||new Set(),ids=[],re=[];
    for(const t of s.topics){const need=plan[t]||{mcq:0,tf:0},n=need.mcq+need.tf;if(!n)continue;const L=ord[t],off=((r-1)*n)%L.length,rot=[...L.slice(off),...L.slice(0,off)];
      const pick=[...rot.filter(b=>!av.has(b.base)),...rot.filter(b=>av.has(b.base))].slice(0,n);
      pick.forEach((b,i)=>{const q=getQ(b,i<need.mcq?'mcq':'tf');ids.push(q.id);if(av.has(b.base))re.push(q.id);});}
    if(mapN){const off=((r-1)*mapN)%mord.length,rot=[...mord.slice(off),...mord.slice(0,off)],pick=[...rot.filter(x=>!av.has('map|'+x.id)),...rot.filter(x=>av.has('map|'+x.id))].slice(0,mapN);
      pick.forEach(x=>{const k='map|'+x.id+'|map';reg[k]=reg[k]||mapQ(x,lg);ids.push(k);if(av.has('map|'+x.id))re.push(k);});
      if(pick.length<mapN)return{error:'There are not enough map targets for the map share chosen. Reduce the map share.'};if(mord.length<mapN*N)among=true;}
    forms[r]=shuf(ids);if(re.length)reused[r]=re;}
  const nre=Object.values(reused).reduce((a,x)=>a+x.length,0),warnings=[];
  if(nre)warnings.push(`${nre} question(s) across the class repeat a fact the same student met in BEFORE, because the data bank has no unused alternative (flagged in the Question Details sheet).`);
  if(among)warnings.push('The data bank is smaller than the class needs, so some students will receive the same questions as others.');
  return{questions:Object.values(reg),forms,reused,plan,mapN,warnings};}
/* ---------- assessment records ---------- */
const uid=()=>'BMX-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
function create({kind,school,code,year,cls,section,students,settings,gen,baseline}){
  const records={};for(let i=1;i<=students;i++)records[i]={roll:i,status:'pending',answers:{},startedAt:null,finishedAt:null};
  return{app:'BharatMapExplorer',schema:CFG.version,kind,assessmentId:uid(),createdAt:new Date().toISOString(),completedAt:null,
    school:{name:school,code:code||''},academicYear:year,class:cls,section,students,settings:{...settings,plan:gen.plan,mapN:gen.mapN},questions:gen.questions,forms:gen.forms,reused:gen.reused,records,
    baseline:baseline?{assessmentId:baseline.assessmentId,createdAt:baseline.createdAt,data:baseline}:null};}
const QM=new WeakMap();
function formQs(a,roll){let m=QM.get(a);if(!m||m.n!==a.questions.length){m={n:a.questions.length,o:Object.fromEntries(a.questions.map(q=>[q.id,q]))};QM.set(a,m);}return(a.forms[roll]||[]).map(id=>m.o[id]).filter(Boolean);}
function normalize(o){if(o&&!o.forms&&Array.isArray(o.questions)&&o.records){o.forms={};Object.keys(o.records).forEach(r=>{o.forms[r]=o.questions.map(q=>q.id);});o.reused={};o.schema=2;o.settings=o.settings||{};if(o.settings.mapN===undefined)o.settings.mapN=0;if(!o.settings.total)o.settings.total=o.questions.length;}return o;}
const done=r=>r.status==='completed'||r.status==='absent';
function setAnswer(a,roll,qid,sel){const r=a.records[roll];if(r.status==='completed'||r.status==='absent')return false;if(!r.startedAt){r.startedAt=new Date().toISOString();}r.status='in-progress';r.answers[qid]=sel;return true;}
function finish(a,roll){const r=a.records[roll];if(r.status==='completed'||r.status==='absent')return false;if(!r.startedAt)r.startedAt=new Date().toISOString();r.status='completed';r.finishedAt=new Date().toISOString();
  if(Object.values(a.records).every(done))a.completedAt=new Date().toISOString();return true;}
function markAbsent(a,roll){const r=a.records[roll];if(r.status==='completed')return false;r.status='absent';r.answers={};r.finishedAt=new Date().toISOString();if(Object.values(a.records).every(done))a.completedAt=new Date().toISOString();return true;}
function score(a,roll){const r=a.records[roll],topic={},qs=formQs(a,roll);let c=0,att=0;
  qs.forEach(q=>{const t=topic[q.topic]||(topic[q.topic]={n:0,correct:0,attempted:0,missed:[]});t.n++;const s=r.answers[q.id];if(s!==undefined&&s!==null){att++;t.attempted++;if(s===q.correct){c++;t.correct++;}else if(q.type==='map')t.missed.push(q.target);}else if(q.type==='map')t.missed.push(q.target);});
  const max=qs.length;Object.values(topic).forEach(t=>t.acc=t.n?Math.round(1000*t.correct/t.n)/10:null);
  return{attempted:att,correct:c,incorrect:att-c,unanswered:max-att,max,acc:max?Math.round(1000*c/max)/10:0,topic,status:r.status};}
const counts=a=>{let c=0,i=0,p=0,ab=0;Object.values(a.records).forEach(r=>{if(r.status==='completed')c++;else if(r.status==='absent')ab++;else if(r.status==='in-progress')i++;else p++;});return{completed:c,absent:ab,inProgress:i,pending:p,total:a.students,incomplete:i+p};};
/* ---------- validation / compatibility ---------- */
function validate(o,kind){const e=[];if(!o||typeof o!=='object')return['The file is not a valid JSON object.'];
  if(o.app!=='BharatMapExplorer')e.push('This file was not created by Bharat Map Explorer.');
  if(kind&&o.kind!==kind)e.push(`Expected a ${kind.toUpperCase()} file but this is "${o.kind}".`);
  ['school','academicYear','class','section','students','settings','questions','records'].forEach(k=>{if(o[k]===undefined)e.push('Missing field: '+k);});
  if(!e.length){normalize(o);if(!Array.isArray(o.questions)||!o.questions.length)e.push('The file has no questions.');
    if(!o.records||Object.keys(o.records).length!==o.students)e.push('The number of student records does not match the student count.');
    if(!o.settings||!Array.isArray(o.settings.topics)||!o.settings.plan)e.push('The assessment settings are incomplete.');}
  return e;}
function compat(b,a){const w=[];const same=(x,y,n)=>{if(x!==y)w.push(`${n} differs: BEFORE "${x}" vs AFTER "${y}".`);};
  same(b.school.name,a.school.name,'School name');same(b.school.code,a.school.code,'KV code');same(b.academicYear,a.academicYear,'Academic year');same(b.class,a.class,'Class');same(b.section,a.section,'Section');same(b.students,a.students,'Student count');
  same(JSON.stringify(b.settings.topics),JSON.stringify(a.settings.topics),'Topics');same(b.settings.typeMode,a.settings.typeMode,'Question type');same(b.questions.length>0&&Object.values(b.forms)[0].length,Object.values(a.forms)[0].length,'Questions per student');same(b.settings.mapN||0,a.settings.mapN||0,'Map questions');same(b.settings.lang||'en',a.settings.lang||'en','Question language');return w;}
/* ---------- remedial analysis (rules in the Teacher Guide) ---------- */
function band(acc,th){return acc>=th.strong?'Strong performance; consider extension questions.':acc>=th.practice?'Guided practice recommended.':'Priority practice recommended.';}
function remedial(a,roll,th,b){const sc=score(a,roll),sb=b?score(b,roll):null,out=[];
  Object.keys(sc.topic).forEach(t=>{const x=sc.topic[t],y=sb&&sb.topic[t];let lvl,act;
    if(x.n<CFG.minTopicQ){lvl='Recheck (small sample)';act='Ask a few more questions on this topic before deciding.';}
    else if(x.acc<th.practice){lvl='Priority practice';act=PRACTICE[t];}else if(x.acc<th.strong){lvl='Guided practice';act=PRACTICE[t];}else{lvl='Enrichment';act='Extension questions on '+tname(t)+'.';}
    out.push({topic:t,acc:x.acc,n:x.n,level:lvl,activity:act,evidence:`${x.correct} of ${x.n} correct (${x.acc}%) in ${tname(t)}`+(y?`; BEFORE ${y.correct} of ${y.n}`:'')});});return out;}
function analyse(b,a,th){th=th||b.settings.thresholds||CFG.thresholds;
  const rows=[],topicAgg={};let mb=0,ma=0,m=0,imp=0,same=0,dec=0,skipped=0;
  for(let i=1;i<=a.students;i++){const rb=b.records[i],ra=a.records[i],row={roll:i};
    if(!rb||!ra||rb.status!=='completed'||ra.status!=='completed'){const ab=(rb&&rb.status==='absent')||(ra&&ra.status==='absent');row.status=ab?'Insufficient evidence (absent)':!rb||rb.status!=='completed'?'Insufficient data (BEFORE incomplete)':'Insufficient data (AFTER incomplete)';row.sug=[];skipped++;rows.push(row);continue;}
    const sb=score(b,i),sa=score(a,i);row.before=sb.correct;row.after=sa.correct;row.maxB=sb.max;row.max=sa.max;row.bAcc=sb.acc;row.aAcc=sa.acc;row.delta=Math.round((sa.acc-sb.acc)*10)/10;
    row.status=row.delta>0?'Score improved':row.delta<0?'Score decreased':'Score unchanged';row.band=band(sa.acc,th);row.topics={};
    Object.keys(sa.topic).forEach(t=>{const x=sa.topic[t],y=sb.topic[t]||{n:0,correct:0};row.topics[t]={before:y.n?Math.round(1000*y.correct/y.n)/10:null,after:x.acc,n:x.n};
      const g=topicAgg[t]||(topicAgg[t]={bc:0,bn:0,ac:0,an:0});g.bc+=y.correct;g.bn+=y.n;g.ac+=x.correct;g.an+=x.n;});
    row.sug=remedial(a,i,th,b);m++;mb+=sb.acc;ma+=sa.acc;if(row.delta>0)imp++;else if(row.delta<0)dec++;else same++;rows.push(row);}
  const topics=Object.keys(topicAgg).map(t=>{const g=topicAgg[t],bA=g.bn?Math.round(1000*g.bc/g.bn)/10:null,aA=g.an?Math.round(1000*g.ac/g.an)/10:null;
    return{topic:t,before:bA,after:aA,delta:bA!==null&&aA!==null?Math.round((aA-bA)*10)/10:null,practice:aA!==null&&aA<th.strong?PRACTICE[t]:'No extra practice needed; extension questions can be used.'};});
  return{rows,topics,matched:m,skipped,avgBefore:m?Math.round(10*mb/m)/10:null,avgAfter:m?Math.round(10*ma/m)/10:null,avgDelta:m?Math.round(10*(ma-mb)/m)/10:null,improved:imp,unchanged:same,decreased:dec,thresholds:th};}
/* ---------- reports: the same six sheets for BEFORE and AFTER ---------- */
const d=s=>s?String(s).slice(0,10):'';
const sel=(a,q,s)=>q.type==='map'?(s?(regionById(s)||{en:s}).en:''):s;
const cor=q=>q.type==='map'?(regionById(q.correct)||{en:q.correct}).en:q.correct;
const mix=a=>a.settings.typeMode==='mixed'?'Mixed MCQ + True/False':a.settings.typeMode==='mcq'?'MCQ only':'True/False only';
const stLab={completed:'Completed',absent:'Absent','in-progress':'Incomplete (in progress)',pending:'Incomplete (not started)'};
function qdet(a,tag){const rows=[];for(let i=1;i<=a.students;i++){const r=a.records[i],re=(a.reused&&a.reused[i])||[];formQs(a,i).forEach(q=>{const s=r.answers[q.id];
  rows.push([tag,i,q.id,tname(q.topic),q.type==='mcq'?'MCQ':q.type==='tf'?'True/False':'Map',q.type==='map'?'Yes':'No',q.text,q.options.join(' | '),s===undefined?'':sel(a,q,s),cor(q),r.status==='absent'?'Absent':s===undefined?'Unanswered':s===q.correct?'Correct':'Incorrect',re.includes(q.id)?'Yes':'No']);});}return rows;}
const QH=['Assessment','Roll Number','Question ID','Topic','Type','Map Question','Question','Options','Selected Answer','Correct Answer','Result','Reused Fallback Target'];
function sheets(a,b,an){const isA=a.kind==='after',c=counts(a),th=(an&&an.thresholds)||a.settings.thresholds||CFG.thresholds,S=a.settings,done=[];
  for(let i=1;i<=a.students;i++)if(a.records[i].status==='completed')done.push(i);
  const avg=done.length?Math.round(10*done.reduce((x,i)=>x+score(a,i).acc,0)/done.length)/10:'';
  let mA=0,mN=0;done.forEach(i=>{const t=score(a,i).topic.map;if(t){mA+=t.correct;mN+=t.n;}});
  const sum=[['Field','Value'],['School Name',a.school.name],['KV Code',a.school.code],['Academic Year',a.academicYear],['Assessment Type',a.kind.toUpperCase()],['Assessment ID',a.assessmentId],['Assessment Date',d(a.createdAt)],['Class',a.class],['Section',a.section],
   ['Total Students',a.students],['Completed',c.completed],['Absent',c.absent],['Incomplete',c.incomplete],['Topics',S.topics.map(tname).join('; ')],['Question Type',mix(a)],['Questions per student',S.total||Object.values(a.forms)[0].length],['Map questions per student',S.mapN||0],
   ['Average Accuracy of completed rolls (%)',avg],['Map accuracy (%)',mN?Math.round(1000*mA/mN)/10:''],['Thresholds (strong / practise %)',`${th.strong} / ${th.practice}`],['Includes items still under Review',S.includeDK?'Yes':'No']];
  if(isA)sum.push(['BEFORE Assessment ID',b.assessmentId],['BEFORE Assessment Date',d(b.createdAt)],['Matched completed rolls',an.matched],['Average BEFORE Accuracy (%)',an.avgBefore],['Average AFTER Accuracy (%)',an.avgAfter],['Average Improvement (percentage points)',an.avgDelta],['Rolls improved',an.improved],['Rolls unchanged',an.unchanged],['Rolls reduced',an.decreased],['Insufficient evidence (absent, incomplete or unmatched)',an.skipped]);
  sum.push(['Note','Absent or incomplete rolls are insufficient evidence, not zero scores. Parallel forms are topic-matched, not perfectly equivalent.']);
  const ip=[['Student Name','Roll Number','Status','Attempted','Correct','Incorrect','Unanswered','Score','Maximum Score','Accuracy (%)','Map Accuracy (%)',...(isA?['BEFORE Score','BEFORE Accuracy (%)','Improvement (percentage points)','Comparison Status']:[]),'Summary Recommendation']];
  for(let i=1;i<=a.students;i++){const r=a.records[i],ok=r.status==='completed',s=score(a,i),mp=s.topic.map,row=an&&an.rows[i-1];
    ip.push(['',i,stLab[r.status],ok?s.attempted:'',ok?s.correct:'',ok?s.incorrect:'',ok?s.unanswered:'',ok?s.correct:'',ok?s.max:'',ok?s.acc:'',ok&&mp?mp.acc:'',...(isA?[row&&row.before!==undefined?row.before:'',row&&row.bAcc!==undefined?row.bAcc:'',row&&row.delta!==undefined?row.delta:'',row?row.status:'']:[]),ok?band(s.acc,th):'Insufficient evidence']);}
  const tp=[['Roll Number','Topic','Questions','Correct','Accuracy (%)',...(isA?['BEFORE Accuracy (%)','Change (percentage points)']:[])]];
  done.forEach(i=>{const s=score(a,i),row=an&&an.rows[i-1];Object.keys(s.topic).forEach(t=>{const x=s.topic[t],y=row&&row.topics&&row.topics[t];tp.push([i,tname(t),x.n,x.correct,x.acc,...(isA?[y&&y.before!==null?y.before:'',y&&y.before!==null?Math.round((x.acc-y.before)*10)/10:'']:[])]);});});
  const rp=[['Roll Number','Topic','Evidence','Priority','Suggested Practice','Follow-up Status (teacher to fill)']];
  done.forEach(i=>remedial(a,i,th,isA?b:null).forEach(x=>rp.push([i,tname(x.topic),x.evidence,x.level,x.activity,''])));
  const ms=[['Roll Number','Map Questions Attempted','Correct Map Answers','Map Accuracy (%)','Missed Map Targets']];
  done.forEach(i=>{const t=score(a,i).topic.map;if(t)ms.push([i,t.attempted,t.correct,t.acc,t.missed.map(id=>(regionById(id)||{en:id}).en).join('; ')]);});
  const qd=[QH,...(isA?qdet(b,'BEFORE'):[]),...qdet(a,a.kind.toUpperCase())];
  return[{name:'Class Summary',rows:sum},{name:'Individual Progress',rows:ip},{name:'Topic-wise Progress',rows:tp},{name:'Remedial Plan',rows:rp},{name:'Map Skills',rows:ms},{name:'Question Details',rows:qd}];}
return{PROFILE,prof,CFG,TOPICS,tname,capacity,makePlan,generate,create,setAnswer,finish,markAbsent,score,counts,formQs,validate,normalize,compat,analyse,remedial,sheets,band,PRACTICE,mapTargets};
})();
