/* Teacher Corner — LEARNING EVIDENCE CORNER (BEFORE / AFTER). Client-side only; students are Roll Numbers, no names. */
window.TEACHER=(function(){
const Q=TQ,CFG=Q.CFG,SK='bme.teacher',DK='bme.tdraft';
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ss={get(k){try{return sessionStorage.getItem(k)}catch(e){return null}},set(k,v){try{sessionStorage.setItem(k,v)}catch(e){}},del(k){try{sessionStorage.removeItem(k)}catch(e){}}};
const T={grade:0,view:'home',mode:null,form:null,a:null,base:null,roll:0,qi:0,exported:true,msg:'',err:'',ack:false,th:{...CFG.thresholds},an:null,imp:null};
const defForm=()=>({school:'',code:'',year:CFG.years[1],section:'A',students:30,includeDK:false,topics:[],typeMode:'mixed',total:10,mapShare:CFG.defaultMapShare,lang:'en',strong:80,practice:60});
let el=null;
const save=()=>{if(T.a)ss.set(DK,JSON.stringify({mode:T.mode,a:T.a,base:T.base,view:T.view,roll:T.roll,qi:T.qi,exported:T.exported}));};
addEventListener('beforeunload',e=>{if(T.a&&!T.exported){e.preventDefault();e.returnValue='';}});
const logged=()=>ss.get(SK)==='1';
function dl(blob,name){try{const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove();},1500);return true;}catch(e){return false;}}
const fname=(k,ext)=>`BharatMapExplorer_${k}_Class${T.a.class}${T.a.section}_${T.a.academicYear.replace(/[^0-9A-Za-z]+/g,'-')}.${ext}`;
function exportXlsx(sheets,name){try{if(dl(XLSX_LITE.build(sheets),name))return 'xlsx';}catch(e){}
  let n=0;sheets.forEach(s=>{if(dl(new Blob(['\ufeff'+XLSX_LITE.csv(s.rows)],{type:'text/csv'}),name.replace('.xlsx','_'+s.name.replace(/\W+/g,'_')+'.csv')))n++;});return n?'csv':null;}
function note(m,e){T.msg=e?'':m;T.err=e?m:'';render();}
/* ---------- screens ---------- */
const hdr=()=>`<div class="tbar"><b>👩‍🏫 TEACHER CORNER</b><span><a class="tbh" href="#/thelp">❓ Help</a> <button class="tb" data-t="logout">Logout</button></span></div>`;
const banner=()=>(T.msg?`<p class="tmsg ok">${esc(T.msg)}</p>`:'')+(T.err?`<p class="tmsg no">${esc(T.err)}</p>`:'');
function login(){el.innerHTML=`<div class="tcard narrow"><h2>👩‍🏫 Teacher Corner</h2><p class="small">Enter the teacher username and password.</p>
 <form id="lf"><label>Username<input id="lu" autocomplete="username" autocapitalize="characters"></label>
 <label>Password<span class="pw"><input id="lp" type="password" autocomplete="current-password"><button type="button" class="tb2" data-t="showpw">Show</button></span></label>
 ${T.err?`<p class="tmsg no">${esc(T.err)}</p>`:''}<button class="act" type="submit">Login</button></form>
 <a class="helpbtn" href="#/thelp">❓ Teacher Corner Help</a>
 <p class="small">This is a simple convenience gate, not strong security: the username and password can be read in the public JavaScript of the website.</p></div>`;}
function home(){const dr=ss.get(DK);let drTxt='';try{if(dr&&!T.a){const d=JSON.parse(dr);drTxt=`${d.mode.toUpperCase()} · Class ${d.a.class}-${d.a.section} · ${Q.counts(d.a).completed}/${d.a.students} completed`;}}catch(e){}
  el.innerHTML=`${hdr()}<div class="tcard"><h2>LEARNING EVIDENCE CORNER</h2><p class="small">Before Assessment • Learning Period • After Assessment • Learning Outcome Report</p>${banner()}
  ${drTxt?`<div class="tmsg warn">Unsaved session found in this tab: <b>${esc(drTxt)}</b> <button class="tb2" data-t="resumeDraft">Resume</button> <button class="tb2" data-t="discardDraft">Discard</button></div>`:''}
  <div class="two"><button class="big1" data-t="startBefore"><span>1</span><b>BEFORE</b><em>Previous Knowledge Assessment</em></button>
  <button class="big2" data-t="startAfter"><span>2</span><b>AFTER</b><em>Post-Learning Assessment</em></button></div>
  <p class="small">Class stopped halfway or continuing on another day? <button class="tb2" data-t="loadjson">Resume from a saved JSON file</button></p>
  <input type="file" id="fjson" accept=".json,application/json" hidden>
  <p class="small">No online database is used. Downloaded files contain educational records: store them responsibly.</p></div>`;}
function topicBox(f){const P=Q.prof(T.grade),cap=Q.capacity(Q.TOPICS.map(t=>t.id),f.includeDK,T.grade);
  return Q.TOPICS.map(t=>{const c=cap[t.id],ok=P.rec.includes(t.id),off=!ok||c<1;return `<label class="chk ${off?'dim':''}"><input type="checkbox" name="topic" value="${t.id}" ${f.topics.includes(t.id)?'checked':''} ${off?'disabled':''}> ${esc(t.en)} <small>(${ok?c+' facts'+(c<1?' — none with an official source; tick "also use items reviewed by DK"':''):'not part of the Class '+T.grade+' list'})</small></label>`;}).join('');}
function setup(){const f=T.form,m=T.mode;T.lastLive=liveHtml(f);
  el.innerHTML=`${hdr()}<div class="tcard"><h2>${m.toUpperCase()} — Assessment setup</h2>${banner()}
  <div class="tmsg warn">Is the class big, or did you stop halfway? <button class="tb2" data-t="resBefore">Resume BEFORE from backup JSON</button><input type="file" id="fresB" accept=".json,application/json" hidden></div>
  <fieldset><legend>School</legend><label>School Name / Kendriya Vidyalaya Name *<input name="school" value="${esc(f.school)}" placeholder="Kendriya Vidyalaya …"></label>
  <label>KV Code (optional)<input name="code" value="${esc(f.code)}"></label>
  <label>Academic Year<select name="year">${CFG.years.map(y=>`<option ${y===f.year?'selected':''}>${y}</option>`).join('')}</select></label>
  <label>Assessment Type<input value="${m.toUpperCase()}" disabled></label></fieldset>
  <fieldset><legend>Class</legend>${T.grade?`<p class="classro">Class <b>${T.grade}</b> <small>(taken from the main class selector; to change it, choose another class on the <a href="#/home">Home page</a> and come back)</small></p>`:`<p class="tmsg no">Choose Class 1–5 on the <a href="#/home">Home page</a> first, then open Teacher Corner again.</p>`}
  <p class="small">Topics, word length, number of options and language follow the Class ${T.grade||'?'} rules (NCERT EVS based). See <a href="#/thelp">Help</a>.</p>
  <label>Section<select name="section">${CFG.sections.map(c=>`<option ${c===f.section?'selected':''}>${c}</option>`).join('')}</select></label>
  <label>Number of Students (1–${CFG.maxStudents})<input name="students" type="number" min="1" max="${CFG.maxStudents}" value="${f.students}"></label>
  <p class="small">Roll Numbers 1 to ${esc(f.students)} are created automatically. No student names are needed.</p></fieldset>
  <fieldset><legend>Topics</legend><div class="rowbtn"><button class="tb2" data-t="allTopics">Select All Topics for this class</button><button class="tb2" data-t="noTopics">Clear Selection</button></div>
  <label class="chk"><input type="checkbox" name="includeDK" ${f.includeDK?'checked':''}> Also use items marked (reviewed by DK)</label>${topicBox(f)}</fieldset>
  <fieldset><legend>Questions</legend>${[['mcq','MCQ'],['tf','True / False'],['mixed','Mixed']].map(([v,l])=>`<label class="chk"><input type="radio" name="typeMode" value="${v}" ${f.typeMode===v?'checked':''}> ${l}</label>`).join('')}
  <label>Question language<select name="lang">${[['en','English'],['hi','Hindi'],['both','Hindi + English']].map(([v,l])=>`<option value="${v}" ${f.lang===v?'selected':''}>${l}</option>`).join('')}</select></label>
  <label>Questions per student<select name="total">${CFG.counts.map(n=>`<option ${n===f.total?'selected':''}>${n}</option>`).join('')}</select></label>
  <label>Map questions (share of the questions)<select name="mapShare"><option value="0" ${f.mapShare===0?'selected':''}>None</option>${CFG.mapShares.map(n=>`<option value="${n}" ${n===f.mapShare?'selected':''}>${n}%</option>`).join('')}</select></label>
  <p class="small">Map questions ask the student to tap a state on the real map. The map needs the internet the first time. Each roll gets its own set of questions with the same mix.</p></fieldset>
  <fieldset><legend>Interpretation thresholds (editable)</legend><label>Strong performance at or above (%)<input name="strong" type="number" value="${f.strong}"></label><label>Guided practice at or above (%) — below this: priority practice<input name="practice" type="number" value="${f.practice}"></label></fieldset>
  <div id="live">${T.lastLive}</div></div>`;}
function liveHtml(f){const sel=f.topics.length,caps=Q.capacity(f.topics,f.includeDK,T.grade),sum=Object.values(caps).reduce((a,b)=>a+b,0),errs=chk(f),mapN=Math.round(f.total*f.mapShare/100),R=f.total-mapN,per=sel?Math.floor(R/sel):0;
  return `${sel&&per<CFG.minTopicQ?`<p class="tmsg warn">About ${per} non-map question(s) per topic: a topic needs at least ${CFG.minTopicQ} questions for a reliable remedial suggestion. Select fewer topics or more questions.</p>`:''}
  <div class="tsum"><b>Summary</b><br>${esc(f.school||'(school name needed)')} · ${esc(f.year)} · Class ${T.grade||'?'}-${f.section} · ${f.students} students<br>${sel} topic(s) · ${f.typeMode==='mixed'?'Mixed MCQ + True/False':f.typeMode==='mcq'?'MCQ':'True/False'} · ${f.lang==='both'?'Hindi + English':f.lang==='hi'?'Hindi':'English'} · ${f.total} questions each (${mapN} map, ${R} other) · ${sum} facts available</div>
  ${errs.map(e=>`<p class="tmsg no">${esc(e)}</p>`).join('')}
  <div class="rowbtn"><button class="tb2" data-t="home">← Back</button><button class="act" data-t="toWarn" ${errs.length?'disabled':''}>Continue</button></div>`;}
function chk(f){const e=[];
  if(!T.grade)e.push('Choose a class on the Home page first.');if(!f.school.trim())e.push('School name is required.');if(!(f.students>=1&&f.students<=CFG.maxStudents))e.push(`Number of students must be 1 to ${CFG.maxStudents}.`);
  if(!f.topics.length)e.push('Select at least one topic.');if(f.topics.some(t=>!Q.prof(T.grade).rec.includes(t)))e.push('A selected topic is not part of the list for this class.');
  if(!(f.strong>f.practice&&f.practice>=0&&f.strong<=100))e.push('Thresholds must satisfy 0 ≤ practise < strong ≤ 100.');
  const mapN=Math.round(f.total*f.mapShare/100),R=f.total-mapN;
  if(f.topics.length&&R>=1){const mix=f.typeMode==='mcq'?[R,0]:f.typeMode==='tf'?[0,R]:[Math.ceil(R/2),R-Math.ceil(R/2)],p=Q.makePlan({topics:f.topics,includeDK:f.includeDK,grade:T.grade,mcq:mix[0],tf:mix[1]});if(p.shortfall>0)e.push(`The data bank has only ${R-p.shortfall} non-map questions for these topics. Reduce the number of questions or add topics.`);}
  if(f.topics.length&&R<1)e.push('Map share leaves no questions for the chosen topics. Lower the map share.');
  return e;}
const mkSettings=f=>({topics:f.topics.slice(),typeMode:f.typeMode,total:f.total,mapShare:f.mapShare,includeDK:f.includeDK,lang:f.lang,nopt:Q.prof(T.grade).opts,thresholds:{strong:f.strong,practice:f.practice}});
function warn(){el.innerHTML=`${hdr()}<div class="tcard"><div class="tmsg no big"><h3>IMPORTANT — READ BEFORE STARTING</h3>
 <p>This application does not use an online database. Assessment records are temporarily held in your browser until you download the report and backup files.</p>
 <p>Complete the planned assessment and download the files before refreshing, closing or navigating away from this page.</p><p>Do not depend on browser storage as your only permanent backup.</p>
 <p>Once the assessment is completed, download both the report and JSON backup. Keep the JSON backup safely for the next stage.</p></div>
 <label class="chk"><input type="checkbox" id="ack" ${T.ack?'checked':''}> I have read this and understand.</label>
 ${T.err?`<p class="tmsg no">${esc(T.err)}</p>`:''}<div class="rowbtn"><button class="tb2" data-t="${T.mode==='after'?'impConfirm':'toSetup'}">← Back</button><button class="act" data-t="begin">Start assessment</button></div></div>`;}
function dash(){const a=T.a,c=Q.counts(a),fin=c.completed+c.absent===c.total;
  el.innerHTML=`${hdr()}<div class="tcard"><h2>${a.kind.toUpperCase()} · Class ${a.class}-${a.section} · ${esc(a.academicYear)}</h2><p class="small">${esc(a.school.name)} · ${Object.values(a.forms)[0].length} questions per student (${a.settings.mapN||0} map) · ID ${esc(a.assessmentId)}</p>${banner()}
  <div class="prog"><b>Completed: ${c.completed} of ${c.total} students</b> · Absent: ${c.absent} · In progress: ${c.inProgress} · Not started: ${c.pending}<div class="bar"><i style="width:${100*(c.completed+c.absent)/c.total}%"></i></div></div>
  <div class="rolls">${Object.values(a.records).map(r=>`<button class="roll ${r.status}" data-t="open" data-r="${r.roll}" title="${r.status}">${r.roll}</button>`).join('')}</div>
  <p class="small"><span class="lg completed"></span>Completed <span class="lg in-progress"></span>Incomplete <span class="lg absent"></span>Absent <span class="lg pending"></span>Not started</p>
  <div class="rowbtn"><button class="act" data-t="nextPending" ${fin?'disabled':''}>▶ Next roll number</button><button class="tb2" data-t="savejson">💾 Download progress backup (JSON)</button><button class="tb2" data-t="finishAll">Finish and get reports</button></div></div>`;}
function student(){const a=T.a,r=a.records[T.roll],qs=Q.formQs(a,T.roll),q=qs[T.qi],locked=r.status==='completed'||r.status==='absent',sel=r.answers[q.id];
  el.innerHTML=`${hdr()}<div class="tcard"><div class="rollbig">Roll Number <b>${T.roll}</b></div><p class="small">Question ${T.qi+1} of ${qs.length} · Answered ${Object.keys(r.answers).length}/${qs.length}${locked?` · <b>${r.status==='absent'?'Marked absent':'Finished'}</b>`:''}</p>
  <div class="dots">${qs.map((x,i)=>`<button class="dot ${r.answers[x.id]!==undefined?'a':''} ${i===T.qi?'c':''}" data-t="goq" data-i="${i}">${i+1}</button>`).join('')}</div>
  <h3 class="qt">${esc(q.text)}</h3>${q.type==='map'?`<div class="quizmap" id="qm"><p class="small">Loading the map…</p></div>`:`<div class="opts">${q.options.map(o=>`<button class="opt ${sel===o?'right':''}" data-t="ans" data-o="${esc(o)}" ${locked?'disabled':''}>${esc(o)}</button>`).join('')}</div>`}
  <div class="rowbtn"><button class="tb2" data-t="prevq" ${T.qi===0?'disabled':''}>← Previous</button>${T.qi<qs.length-1?`<button class="tb2" data-t="nextq">Next →</button>`:''}
  <button class="act" data-t="finishRoll" ${locked?'disabled':''}>Finish Roll ${T.roll}</button><button class="tb2" data-t="absent" ${locked?'disabled':''}>Mark Roll Absent</button><button class="tb2" data-t="dash">Class overview</button></div></div>`;
  if(q.type==='map')BMap.load().then(()=>{const m=el.querySelector('#qm');if(!m)return;BMap.draw(m,{onTap:id=>{if(locked)return;if(Q.setAnswer(T.a,T.roll,q.id,id)){T.exported=false;save();render();}}});if(sel)BMap.mark(sel,'selected');}).catch(()=>{const m=el.querySelector('#qm');if(m)m.innerHTML='<p class="tmsg no">The map could not load. Connect to the internet once, or use a saved offline map file.</p>';});}
function rollDone(){const a=T.a,s=Q.score(a,T.roll),c=Q.counts(a);
  el.innerHTML=`${hdr()}<div class="tcard"><h2>Roll Number ${T.roll} completed ✔</h2><p class="score">Score: <b>${s.correct} / ${s.max}</b> (${s.acc}%)${s.unanswered?` · Unanswered: ${s.unanswered}`:''}</p>
  <p class="small">${Object.keys(s.topic).map(t=>`${esc(Q.tname(t))}: ${s.topic[t].correct}/${s.topic[t].n}`).join(' · ')}</p><p><b>Completed: ${c.completed} of ${c.total} students</b></p>
  <div class="rowbtn"><button class="act" data-t="nextPending" ${c.completed+c.absent===c.total?'disabled':''}>Next Roll Number →</button><button class="tb2" data-t="dash">Class overview</button>${c.completed+c.absent===c.total?`<button class="act" data-t="finishAll">All done: get reports</button>`:''}</div>
  ${c.completed%10===0&&c.completed>0&&c.completed<c.total?`<p class="tmsg no">${c.completed} rolls done. Please tap <b>Class overview → Download progress backup (JSON)</b> now, in case this page closes.</p>`:''}
  <p class="tmsg warn">Remember to download your report and JSON backup when the class is finished. If you run out of time, download the progress backup and resume later.</p></div>`;}
function exportView(){const a=T.a,c=Q.counts(a),isA=a.kind==='after';
  if(isA&&!T.an)T.an=Q.analyse(a.baseline.data,a,T.th);
  const an=T.an;
  el.innerHTML=`${hdr()}<div class="tcard"><h2>${a.kind.toUpperCase()} — Reports and backup</h2>${banner()}
  <p><b>Completed ${c.completed} of ${c.total}</b> · Absent ${c.absent}${c.incomplete?` — <span class="no">${c.incomplete} incomplete record(s) are marked incomplete and are not included in averages.</span>`:''}</p>
  <p class="tmsg warn">⚠ Download BOTH files now. ${isA?'':'Keep the JSON backup safely: it is required for the AFTER assessment.'} Files contain educational records (roll numbers and answers).</p>
  ${isA?afterSummary(an,a):''}
  <div class="rowbtn"><button class="act" data-t="dlx">⬇ Download ${isA?'After':'Before'} Excel Report</button><button class="act" data-t="dlj">⬇ Download ${isA?'After':'Before'} JSON Backup</button></div>
  <div class="rowbtn"><button class="tb2" data-t="dash">← Class overview</button><button class="tb2" data-t="endSession">Close this assessment…</button></div></div>`;}
function afterSummary(an,a){const b=a.baseline.data,tn=Q.tname;
  if(!an.matched)return `<p class="tmsg warn">No student has both a completed BEFORE and AFTER assessment yet, so no comparison is shown.</p>`;
  return `<div class="tsum"><b>Before vs After</b><br>Matched students: ${an.matched} of ${a.students} · Average BEFORE ${an.avgBefore}% → AFTER ${an.avgAfter}% (${an.avgDelta>=0?'+':''}${an.avgDelta} percentage points)<br>Improved: ${an.improved} · Unchanged: ${an.unchanged} · Reduced: ${an.decreased} · Insufficient data: ${an.skipped}</div>
  <div class="tscroll"><table class="tt"><tr><th>Topic</th><th>BEFORE %</th><th>AFTER %</th><th>Change (pp)</th><th>Remedial Practice Suggestion</th></tr>${an.topics.map(t=>`<tr><td>${esc(tn(t.topic))}</td><td>${t.before??'–'}</td><td>${t.after??'–'}</td><td>${t.delta??'–'}</td><td>${esc(t.practice)}</td></tr>`).join('')}</table></div>
  <div class="tscroll"><table class="tt"><tr><th>Roll</th><th>BEFORE</th><th>AFTER</th><th>Change (pp)</th><th>Status</th></tr>${an.rows.map(r=>`<tr><td>${r.roll}</td><td>${r.before===undefined?'–':r.before+'/'+r.max}</td><td>${r.after===undefined?'–':r.after+'/'+r.max}</td><td>${r.delta===undefined?'–':r.delta}</td><td>${esc(r.status)}</td></tr>`).join('')}</table></div>
  <div class="tsum">Thresholds (editable): strong ≥ <input id="th1" type="number" value="${T.th.strong}" style="width:70px"> % · practise ≥ <input id="th2" type="number" value="${T.th.practice}" style="width:70px"> % <button class="tb2" data-t="reth">Recalculate</button></div>
  <p class="small">These are Remedial Practice Suggestions based on topic-wise evidence, not a judgement of any child's ability. Topic suggestions appear only where a topic had at least ${CFG.minTopicQ} questions.</p>`;}
function afterImport(){const i=T.imp;
  el.innerHTML=`${hdr()}<div class="tcard"><h2>AFTER — Post-Learning Assessment</h2>${banner()}<p>Import the BEFORE JSON backup saved earlier. The BEFORE browser session does not need to be open.</p>
  <div class="tmsg warn">Already started the AFTER assessment and stopped halfway? <button class="tb2" data-t="resAfter">Resume AFTER from backup JSON</button><input type="file" id="fresA" accept=".json,application/json" hidden></div>
  <button class="act" data-t="pickBefore">Import Previous BEFORE Assessment JSON</button><input type="file" id="fbefore" accept=".json,application/json" hidden>
  ${i?`<div class="tsum"><b>BEFORE file read successfully</b><br>${esc(i.school.name)} ${i.school.code?'('+esc(i.school.code)+')':''} · ${esc(i.academicYear)} · Class ${i.class}-${i.section} · ${i.students} students<br>Language: ${i.settings.lang==='both'?'Hindi + English':i.settings.lang==='hi'?'Hindi':'English'} · BEFORE date ${esc(String(i.createdAt).slice(0,10))} · Topics: ${esc(i.settings.topics.map(Q.tname).join('; '))}<br>Questions per student: ${Object.values(i.forms)[0].length} (${i.settings.mapN||0} map) · Completed students: ${Q.counts(i).completed} of ${i.students}</div>
  ${i._warn.map(w=>`<p class="tmsg warn">${esc(w)}</p>`).join('')}<div class="rowbtn"><button class="act" data-t="impConfirm2">Confirm and continue</button></div>`:''}
  <div class="rowbtn"><button class="tb2" data-t="home">← Back</button></div></div>`;}
/* ---------- render + events ---------- */
function render(){if(!el)return;if(!logged()){login();return;}
  ({home,setup,warn,dash,student,rollDone,export:exportView,afterImport}[T.view]||home)();}
function openRoll(r){T.roll=r;const rec=T.a.records[r];const un=Q.formQs(T.a,r).findIndex(q=>rec.answers[q.id]===undefined);T.qi=rec.status==='completed'||rec.status==='absent'||un<0?0:un;T.view='student';save();render();}
function nextPending(){const a=T.a,p=Object.values(a.records).find(r=>!['completed','absent'].includes(r.status)&&r.roll>T.roll)||Object.values(a.records).find(r=>!['completed','absent'].includes(r.status));if(p)openRoll(p.roll);else{note('All roll numbers are completed.');}}
function readFile(file,cb){const fr=new FileReader();fr.onload=()=>{try{cb(JSON.parse(fr.result));}catch(e){note('This file could not be read: it is not valid JSON.',1);}};fr.onerror=()=>note('The file could not be opened.',1);fr.readAsText(file);}
function loadAny(o,expect){const e=Q.validate(o);if(e.length)return note(e.join(' '),1);
  if(expect&&o.kind!==expect)return note(expect==='after'?'This is a BEFORE file. To start the AFTER assessment, use "Import Previous BEFORE Assessment JSON". To resume AFTER, choose your AFTER backup file.':'This is an AFTER file. To resume it, open AFTER and use "Resume AFTER from backup JSON".',1);
  if(o.kind==='after'){if(!o.baseline||!o.baseline.data)return note('This AFTER file has no BEFORE baseline inside, so it cannot be resumed.',1);}
  if(o.kind==='after')Q.normalize(o.baseline.data);T.roll=0;T.mode=o.kind;T.a=o;T.base=o.kind==='after'?o.baseline.data:null;T.exported=true;T.th={...(o.settings.thresholds||CFG.thresholds)};T.an=null;T.view='dash';T.msg=`Loaded ${o.kind.toUpperCase()} file for Class ${o.class}-${o.section}.`;T.err='';save();render();}
function onClick(e){const b=e.target.closest&&e.target.closest('[data-t]');if(!b)return;const a=b.dataset.t;T.msg=T.msg&&a==='x'?'':T.msg;
  if(a==='showpw'){const p=el.querySelector('#lp');p.type=p.type==='password'?'text':'password';b.textContent=p.type==='password'?'Show':'Hide';return;}
  if(a==='logout'){if(T.a&&!T.exported&&!confirm('You have assessment data that has not been downloaded. Logout anyway? (The data stays in this tab only until it is closed.)'))return;ss.del(SK);T.view='home';render();return;}
  if(a==='startBefore'){T.mode='before';T.form=defForm();{const P=Q.prof(T.grade);T.form.lang=P.lang;T.form.topics=P.rec.filter(t=>Q.capacity([t],false,T.grade)[t]>0);}T.a=null;T.view='setup';T.msg=T.err='';render();return;}
  if(a==='startAfter'){T.mode='after';T.imp=null;T.view='afterImport';T.msg=T.err='';render();return;}
  if(a==='resBefore'){el.querySelector('#fresB').click();return;}
  if(a==='resAfter'){el.querySelector('#fresA').click();return;}
  if(a==='loadjson'){el.querySelector('#fjson').click();return;}
  if(a==='resumeDraft'){try{const d=JSON.parse(ss.get(DK));T.roll=0;T.mode=d.mode;T.a=d.a;T.base=d.base;T.exported=d.exported;T.view=d.view==='student'?'dash':d.view;T.th={...(d.a.settings.thresholds||CFG.thresholds)};T.msg='Session restored from this tab.';render();}catch(x){note('The saved session could not be restored.',1);}return;}
  if(a==='discardDraft'){if(confirm('Discard the unsaved session in this tab? This cannot be undone.')){ss.del(DK);render();}return;}
  if(a==='home'){if(T.a&&!T.exported&&!confirm('Go to the start? Un-downloaded assessment data stays in this tab, use "Resume".'))return;T.view='home';T.a=null;T.msg=T.err='';render();return;}
  if(a==='toSetup'){T.view='setup';render();return;}
  if(a==='allTopics'){T.form.topics=Q.prof(T.grade).rec.filter(t=>Q.capacity([t],T.form.includeDK,T.grade)[t]>0);render();return;}
  if(a==='noTopics'){T.form.topics=[];render();return;}
  if(a==='toWarn'){if(chk(T.form).length)return;T.view='warn';T.ack=false;T.err='';render();return;}
  if(a==='pickBefore'){el.querySelector('#fbefore').click();return;}
  if(a==='impConfirm2'){T.view='warn';T.ack=false;T.err='';render();return;}
  if(a==='impConfirm'){T.view='afterImport';render();return;}
  if(a==='begin'){if(!el.querySelector('#ack').checked){T.err='Please tick the box to confirm you have read the warning.';render();return;}T.err='';startAssessment();return;}
  if(a==='open'){openRoll(+b.dataset.r);return;}
  if(a==='nextPending'){nextPending();return;}
  if(a==='dash'){T.view='dash';save();render();return;}
  if(a==='goq'){T.qi=+b.dataset.i;render();return;}
  if(a==='prevq'){T.qi--;render();return;}if(a==='nextq'){T.qi++;render();return;}
  if(a==='absent'){if(!confirm(`Mark Roll ${T.roll} as absent? Absent is treated as insufficient evidence, not a zero score.`))return;if(Q.markAbsent(T.a,T.roll)){T.exported=false;save();T.view='dash';T.msg=`Roll ${T.roll} marked absent.`;render();}return;}
  if(a==='ans'){const q=Q.formQs(T.a,T.roll)[T.qi];if(Q.setAnswer(T.a,T.roll,q.id,b.dataset.o)){T.exported=false;save();if(T.qi<T.a.questions.length-1){render();}else render();}return;}
  if(a==='finishRoll'){const s=Q.score(T.a,T.roll);if(s.unanswered&&!confirm(`${s.unanswered} question(s) are unanswered. Finish Roll ${T.roll} anyway? Unanswered questions will be counted separately.`))return;
    if(Q.finish(T.a,T.roll)){T.exported=false;save();T.view='rollDone';render();}return;}
  if(a==='savejson'){const ok=dl(new Blob([JSON.stringify(T.a,null,1)],{type:'application/json'}),fname(T.a.kind.toUpperCase()+'_PROGRESS','json'));note(ok?'Progress backup download started. Check your Downloads folder.':'The download could not be started. Try another browser.',!ok);return;}
  if(a==='finishAll'){const c=Q.counts(T.a);if(c.incomplete&&!confirm(`${c.incomplete} student(s) are not completed. Their records will be marked incomplete. Continue to the reports?`))return;T.view='export';T.msg=T.err='';render();return;}
  if(a==='reth'){const s=+el.querySelector('#th1').value,p=+el.querySelector('#th2').value;if(!(s>p&&p>=0&&s<=100)){note('Thresholds must satisfy 0 ≤ practise < strong ≤ 100.',1);return;}T.th={strong:s,practice:p};T.an=null;T.a.settings.thresholds=T.th;T.msg='Recalculated.';render();return;}
  if(a==='dlx'){const k=T.a.kind;if(k==='after'&&!T.an)T.an=Q.analyse(T.base,T.a,T.th);const sheets=Q.sheets(T.a,T.base,T.an);const r=exportXlsx(sheets,fname(k.toUpperCase(),'xlsx'));
    if(r==='xlsx'){note('Excel download started. Check your Downloads folder.');}else if(r==='csv'){note('Excel export was not possible here, so CSV files were downloaded instead (one per sheet).');}else note('The download could not be started.',1);return;}
  if(a==='dlj'){const ok=dl(new Blob([JSON.stringify(T.a,null,1)],{type:'application/json'}),fname(T.a.kind.toUpperCase(),'json'));if(ok)T.exported=true;note(ok?'JSON backup download started. Keep this file safely'+(T.a.kind==='before'?' for the AFTER assessment.':'.'):'The download could not be started.',!ok);return;}
  if(a==='endSession'){if(!T.exported&&!confirm('The JSON backup has not been downloaded in this session. Close anyway? The data will be removed from this page.'))return;if(!confirm('Close this assessment and remove its data from this page?'))return;T.a=null;T.base=null;ss.del(DK);T.exported=true;T.view='home';render();return;}}
function finishStart(w){T.roll=0;T.exported=true;T.an=null;T.view='dash';T.msg=(w&&w.length?w.join(' '):'')||`${T.a.kind.toUpperCase()} assessment created for Roll Numbers 1 to ${T.a.students}.`;save();render();}
function startAssessment(){
  const mapFail=()=>{T.view=T.mode==='after'?'afterImport':'setup';note('The map could not load, so map questions cannot be created. Connect to the internet once (or add the offline map file).',1);};
  if(T.mode==='before'){const f=T.form,set=mkSettings(f),s={...set,students:+f.students};
    const run=()=>{const g=Q.generate(s,{grade:T.grade});if(g.error){T.view='setup';note(g.error,1);return;}
      T.a=Q.create({kind:'before',school:f.school.trim(),code:f.code.trim(),year:f.year,cls:T.grade,section:f.section,students:+f.students,settings:set,gen:g});T.base=null;finishStart(g.warnings);};
    if(f.mapShare>0)BMap.load().then(run).catch(mapFail);else run();return;}
  const b=T.imp,n=b.settings.mapN||0,s={topics:b.settings.topics,typeMode:b.settings.typeMode,total:b.settings.total||Q.formQs(b,1).length,mapShare:b.settings.mapShare||0,includeDK:b.settings.includeDK,lang:b.settings.lang||'en',nopt:b.settings.nopt,students:b.students},avoid={};
  for(let r=1;r<=b.students;r++)avoid[r]=new Set(Q.formQs(b,r).map(q=>q.base));
  const run=()=>{const g=Q.generate(s,{grade:b.class,plan:b.settings.plan,mapN:n,avoid});if(g.error){T.view='afterImport';note(g.error,1);return;}
    T.a=Q.create({kind:'after',school:b.school.name,code:b.school.code,year:b.academicYear,cls:b.class,section:b.section,students:b.students,settings:{...b.settings,thresholds:T.th},gen:g,baseline:b});T.base=b;finishStart(g.warnings);};
  if(n>0)BMap.load().then(run).catch(mapFail);else run();}
function onInput(e){const n=e.target.name,f=T.form;if(!n||!f||T.view!=='setup')return;
  if(n==='topic'){f.topics=[...el.querySelectorAll('input[name=topic]:checked')].map(x=>x.value);render();return;}
  if(n==='includeDK'){f.includeDK=e.target.checked;f.topics=f.topics.filter(t=>Q.capacity([t],f.includeDK,T.grade)[t]>0);render();return;}
  if(n==='typeMode'){f.typeMode=e.target.value;render();return;}
  if(['students','total','mapShare','strong','practice'].includes(n)){f[n]=+e.target.value||0;live();return;}
  f[n]=e.target.value;live();}
function live(){const l=el.querySelector('#live');if(!l)return;const h=liveHtml(T.form);if(h!==T.lastLive){T.lastLive=h;l.innerHTML=h;}}
function onSubmit(e){e.preventDefault();if(e.target.id!=='lf')return;const u=el.querySelector('#lu').value.trim(),p=el.querySelector('#lp').value;
  if(u===CFG.auth.user&&p===CFG.auth.pass){ss.set(SK,'1');T.err='';T.view='home';render();}else{T.err='Incorrect username or password. Please try again.';login();}}
function onChange(e){if(e.target.id==='fjson'&&e.target.files[0])readFile(e.target.files[0],o=>loadAny(o));
  else if(e.target.id==='fresB'&&e.target.files[0])readFile(e.target.files[0],o=>loadAny(o,'before'));
  else if(e.target.id==='fresA'&&e.target.files[0])readFile(e.target.files[0],o=>loadAny(o,'after'));
  else if(e.target.id==='fbefore'&&e.target.files[0])readFile(e.target.files[0],o=>{const er=Q.validate(o,'before');if(er.length){T.imp=null;return note(er.join(' '),1);}
    const w=[],c=Q.counts(o);if(c.completed<o.students)w.push(`${o.students-c.completed} student(s) did not complete the BEFORE assessment. They cannot be compared and will be shown as "Insufficient data".`);
    const caps=Q.capacity(o.settings.topics,o.settings.includeDK,o.class);const tight=o.settings.topics.filter(t=>{const n=(o.settings.plan[t]||{mcq:0,tf:0});return caps[t]<2*(n.mcq+n.tf);});
    if(tight.length)w.push('Some topics have few facts ('+tight.map(Q.tname).join(', ')+'), so an AFTER question may repeat a fact the same student met in BEFORE. This is flagged in the Excel report.');
    if(o.settings.includeDK)w.push('The BEFORE assessment included items marked (reviewed by DK); the same setting is restored.');
    o._warn=w;T.imp=o;T.th={...(o.settings.thresholds||CFG.thresholds)};T.err='';T.msg='';render();});
  else if(e.target.id==='ack'){T.ack=e.target.checked;}
  else onInput(e);}
function mount(root){el=root;el.onclick=onClick;el.oninput=e=>{if(e.target.type!=='checkbox'&&e.target.type!=='radio'&&e.target.tagName!=='SELECT'&&e.target.type!=='file')onInput(e);};el.onchange=onChange;el.onsubmit=onSubmit;
  el.onkeydown=e=>{if(e.key==='Enter'&&e.target.id==='lp'){e.preventDefault();onSubmit({preventDefault(){},target:{id:'lf'}});}};}
return{render(root,ctx){T.grade=(ctx&&ctx.grade)||0;mount(root);render();},T,chk};
})();
