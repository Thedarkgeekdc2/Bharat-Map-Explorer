/* MODULE 1 + 2 — Explore Map: map on one side, the state's details and quiz on the other, so a panel screen shows everything at once. */
MODE_VIEWS.explore=function(el,c){
  const {t,name,esc,lang}=c, other=r=>lang==='hi'?r.en:r.hi;
  el.innerHTML=`<div class="xsplit"><div class="xmap card"><div class="maparea" id="mapArea"><p class="load">${t('mapLoading')}</p></div></div>
  <aside class="xside card" id="xside"><label class="pick"><span>${t('pickOne')}</span><select id="xsel"><option value="">—</option>${REGIONS.map(r=>`<option value="${r.id}">${esc(name(r))}</option>`).join('')}</select></label>
  <p class="small">${t('small')}</p><div id="xbody" class="xbody"><p class="hint">${t('tapHint')}</p></div></aside></div>`;
  const body=el.querySelector('#xbody'),sel=el.querySelector('#xsel');let cur=null;
  /* Interactive panel: make the details text as large as possible while everything still fits inside the box (no scrolling). */
  const panel=()=>document.body.classList.contains('fill')&&matchMedia('(min-width:1200px) and (min-height:640px)').matches;
  const fit=()=>{body.style.fontSize='';if(!panel()||!body.querySelector('.cats'))return;let lo=13,hi=Math.max(lo,Math.min(72,Math.round(innerWidth/46)));
    const ok=px=>{body.style.fontSize=px+'px';return body.scrollHeight<=body.clientHeight+1;};
    if(ok(hi))return;while(hi-lo>1){const m=(lo+hi)>>1;if(ok(m))lo=m;else hi=m;}body.style.fontSize=lo+'px';};
  addEventListener('resize',()=>{if(cur&&body.querySelector('.cats'))fit();});
  const show=id=>{const r=regionById(id);if(!r)return;cur=id;try{BMap.mark(id,'selected');}catch(e){}sel.value=id;
    const sh=(BMap.info()||{}).shared||{},mk=Object.keys(sh).find(k=>sh[k]===id),mate=sh[id]?regionById(sh[id]):(mk?regionById(mk):null);
    body.innerHTML=`<h3 class="xt">${esc(name(r))} ${spk(name(r))}</h3><p class="kind ${r.type}">${t(r.type)}</p> <span class="alt">${t('alsoCalled')}: <b>${esc(other(r))}</b></span>`+(mate?`<p class="note">${t('sharedNote')}: <b>${esc(name(mate))}</b></p>`:'')+renderCard(r,c);body.scrollTop=0;fit();};
  sel.onchange=()=>show(sel.value);
  el.querySelector('#xside').addEventListener('click',e=>{const q=e.target.closest&&e.target.closest('a.quizbtn');if(q&&cur){e.preventDefault();body.style.fontSize='';STATEQUIZ.render(body,c,cur);return;}
    const b=e.target.closest&&e.target.closest('a[href^="#/state/"]');if(b&&cur){e.preventDefault();show(cur);}});
  BMap.load().then(()=>{BMap.draw(el.querySelector('#mapArea'),{onTap:show});if(cur)BMap.mark(cur,'selected');})
   .catch(e=>{console.error(e);el.querySelector('#mapArea').innerHTML=`<p class="fail">${t('mapFail')}<br><small>${esc(e.message||e)}</small></p>`;});
};
