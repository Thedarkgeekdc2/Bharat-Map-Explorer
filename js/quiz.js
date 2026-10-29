/* MODULE 5 — Map Games & Quiz: Find the State, Capital Match, Festival/Food/Place/Animal/Dance, and a Mixed India Challenge.
   Questions use only items with an official source unless "include reviewed-by-DK items" is ticked. Items that belong to more than one state are never asked. */
MODE_VIEWS.quiz=function(el,c){
  const {t,esc,name,lang,grade}=c, g=grade||1, N=g<=2?5:10, NOPT=g<=2?3:4, TINY=['delhi','chandigarh','goa','dadra-and-nagar-haveli-and-daman-and-diu','lakshadweep','puducherry'];
  let game='',Q=[],qi=0,score=0,missed=[],useDK=false,answered=false,mapOk=false;
  const shuf=a=>a.slice().sort(()=>Math.random()-.5), pick=(a,n)=>shuf(a).slice(0,n), lab=s=>s.replace(/\s*\(.*?\)\s*/g,' ').trim();
  const cap=r=>CAPITALS[r.id][lang]||CAPITALS[r.id].en, tpl=(k,x)=>t(k).replace('{x}',x);
  BMap.load().then(()=>{mapOk=true;}).catch(()=>{});
  function pool(){const items=[];REGIONS.forEach(r=>{const D=CONTENT[r.id],K=useDK?(D.dk||{}):{};
    const add=(cat,a)=>(a||[]).forEach(x=>items.push({cat,r,text:x.en,hi:x.hi,key:itemKey(x.en)}));
    add('dance',[...D.classical,...(K.classical||[])]);add('festival',[...D.festivals,...(K.festivals||[])]);add('food',[...(D.foods||[]),...(K.foods||[])]);
    add('place',[...D.famous,...(K.famous||[])]);add('animal',D.animal?[D.animal]:[]);});
    const n={};items.forEach(i=>n[i.key]=(n[i.key]||0)+1);return items.filter(i=>n[i.key]===1&&!/shared|maratha/i.test(i.text));}
  const stateOpts=(r)=>shuf([r,...pick(REGIONS.filter(x=>x.id!==r.id),NOPT-1)]).map(x=>({k:x.id,l:name(x)}));
  const mkItem=(cat,P)=>{const L=P.filter(i=>i.cat===cat);if(!L.length)return null;const i=pick(L,1)[0];
    return{text:tpl({dance:'qdance',festival:'qfest',food:'qfood',place:'qplace',animal:'qanimal'}[cat],(lang==='hi'&&i.hi?lab(i.hi):lab(i.text))),opts:stateOpts(i.r),ans:i.r.id,info:`${name(i.r)} · ${t('capital')}: ${cap(i.r)}`};};
  function mk(type,P){
    if(type==='cap'){const r=pick(REGIONS.filter(x=>!['chandigarh','puducherry'].includes(x.id)),1)[0];
      const o=[r];shuf(REGIONS).forEach(x=>{if(o.length<NOPT&&x.id!==r.id&&cap(x)!==cap(r)&&!o.some(y=>cap(y)===cap(x)))o.push(x);});
      return{text:tpl('qcap',name(r)),opts:shuf(o).map(x=>({k:x.id,l:cap(x)})),ans:r.id,info:`${name(r)} → ${cap(r)}`};}
    if(type==='capRev'){const L=REGIONS.filter(x=>!['chandigarh','haryana','punjab','jammu-and-kashmir','ladakh'].includes(x.id)),r=pick(L,1)[0];
      return{text:tpl('qcapRev',cap(r)),opts:stateOpts(r),ans:r.id,info:`${cap(r)} → ${name(r)}`};}
    if(type==='find'){const L=REGIONS.filter(x=>x.id!=='ladakh'&&(g>=4||!TINY.includes(x.id))&&BMap.info()&&BMap.info().groups[x.id]),r=pick(L,1)[0];
      return{map:true,text:tpl('qfind',name(r)),ans:r.id,info:name(r)};}
    return mkItem(type,P);}
  const types=()=>{const base=['cap','animal'];if(mapOk)base.push('find');if(g>=3)base.push('dance','festival','food','place');if(g>=4)base.push('capRev');return base;};
  function start(gm){game=gm;qi=0;score=0;missed=[];const P=pool();Q=[];let guard=0;
    const T=gm==='mixed'?types():{find:['find'],capital:g>=4?['cap','capRev']:['cap'],culture:['festival','food','place','dance','animal']}[gm];
    while(Q.length<N&&guard++<200){const q=mk(T[Q.length%T.length],P);if(q&&!Q.some(x=>x.text===q.text))Q.push(q);}
    show();}
  function menu(){game='';el.innerHTML=`<div class="quiz"><p class="small">${t('qintro')}</p><div class="games">${[['find','🗺️','gFind','gFindD'],['capital','🏛️','gCap','gCapD'],['culture','🎉','gCult','gCultD'],['mixed','🏆','gMix','gMixD']].map(([k,i,a,b])=>
      `<button class="game" data-g="${k}"><span>${i}</span><b>${t(a)}</b><em>${t(b)}</em></button>`).join('')}</div>
      <label class="dkopt"><input type="checkbox" id="dk" ${useDK?'checked':''}> ${t('qDK')}</label></div>`;}
  function show(){
    if(qi>=Q.length){const pct=Math.round(100*score/Q.length),st=pct>=80?'⭐⭐⭐':pct>=50?'⭐⭐':'⭐';
      el.innerHTML=`<div class="quiz res"><h3>${st}</h3><p class="score">${t('qScore')}: <b>${score} / ${Q.length}</b></p>${missed.length?`<h4>${t('qMissed')}</h4><ul class="miss">${missed.map(m=>`<li>${esc(m.text)}<br><b>✔ ${esc(m.info)}</b></li>`).join('')}</ul>`:`<p>🎉 ${t('qPerfect')}</p>`}
      <div class="tbtn"><button data-g="${game}">🔄 ${t('qAgain')}</button><button data-a="menu">☰ ${t('qMenu')}</button></div></div>`;return;}
    const q=Q[qi];answered=false;
    el.innerHTML=`<div class="quiz"><div class="qtop"><span>${t('qQ')} ${qi+1}/${Q.length}</span><span>⭐ ${score}</span></div><h3 class="qt">${esc(q.text)} ${spk(q.text)}</h3>
      ${q.map?`<div class="quizmap" id="qm"></div>`:`<div class="opts">${q.opts.map(o=>`<button class="opt" data-k="${o.k}">${esc(o.l)}</button>`).join('')}</div>`}<p class="fb" id="fb"></p><div class="tbtn"><button data-a="menu">☰ ${t('qMenu')}</button></div></div>`;
    if(q.map)BMap.draw(el.querySelector('#qm'),{onTap:id=>answer(id)});}
  function answer(k){if(answered)return;answered=true;const q=Q[qi],ok=k===q.ans,fb=el.querySelector('#fb');
    if(ok)score++;else missed.push(q);
    if(q.map){BMap.mark(q.ans,'correct');if(!ok)BMap.mark(k,'wrong');}
    else el.querySelectorAll('.opt').forEach(b=>{b.disabled=true;if(b.dataset.k===q.ans)b.classList.add('right');else if(b.dataset.k===k)b.classList.add('bad');});
    fb.className='fb '+(ok?'ok':'no');fb.innerHTML=(ok?'✔ '+t('qRight'):'✖ '+t('qWrong'))+` <b>${esc(q.info)}</b> <button class="act" data-a="next">${t('next')} →</button>`;}
  el.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;
    if(b.dataset.g){const d=el.querySelector('#dk');if(d)useDK=d.checked;if(b.dataset.g==='find'&&!mapOk)BMap.load().then(()=>{mapOk=true;start('find');}).catch(()=>{el.insertAdjacentHTML('afterbegin',`<p class="fail">${t('mapFail')}</p>`);});else start(b.dataset.g);}
    else if(b.dataset.a==='menu')menu();else if(b.dataset.a==='next'){qi++;show();}else if(b.classList.contains('opt'))answer(b.dataset.k);});
  menu();
};
