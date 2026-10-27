/* MODULE 1 + 2 — Explore Map: map on one side, the state's details and quiz on the other, so a panel screen shows everything at once. */
MODE_VIEWS.explore=function(el,c){
  const {t,name,esc,lang}=c, other=r=>lang==='hi'?r.en:r.hi;
  el.innerHTML=`<div class="xsplit"><div class="xmap card"><div class="maparea" id="mapArea"><p class="load">${t('mapLoading')}</p></div></div>
  <aside class="xside card" id="xside"><label class="pick"><span>${t('pickOne')}</span><select id="xsel"><option value="">—</option>${REGIONS.map(r=>`<option value="${r.id}">${esc(name(r))}</option>`).join('')}</select></label>
  <p class="small">${t('small')}</p><div id="xbody" class="xbody"><p class="hint">${t('tapHint')}</p></div></aside></div>`;
  const body=el.querySelector('#xbody'),sel=el.querySelector('#xsel');let cur=null;
  const show=id=>{const r=regionById(id);if(!r)return;cur=id;try{BMap.mark(id,'selected');}catch(e){}sel.value=id;
    const sh=(BMap.info()||{}).shared||{},mk=Object.keys(sh).find(k=>sh[k]===id),mate=sh[id]?regionById(sh[id]):(mk?regionById(mk):null);
    body.innerHTML=`<h3 class="xt">${esc(name(r))} ${spk(name(r))}</h3><p class="kind ${r.type}">${t(r.type)}</p> <span class="alt">${t('alsoCalled')}: <b>${esc(other(r))}</b></span>`+(mate?`<p class="note">${t('sharedNote')}: <b>${esc(name(mate))}</b></p>`:'')+renderCard(r,c);body.scrollTop=0;};
  sel.onchange=()=>show(sel.value);
  el.querySelector('#xside').addEventListener('click',e=>{const q=e.target.closest&&e.target.closest('a.quizbtn');if(q&&cur){e.preventDefault();STATEQUIZ.render(body,c,cur);return;}
    const b=e.target.closest&&e.target.closest('a[href^="#/state/"]');if(b&&cur){e.preventDefault();show(cur);}});
  BMap.load().then(()=>{BMap.draw(el.querySelector('#mapArea'),{onTap:show});if(cur)BMap.mark(cur,'selected');})
   .catch(e=>{console.error(e);el.querySelector('#mapArea').innerHTML=`<p class="fail">${t('mapFail')}<br><small>${esc(e.message||e)}</small></p>`;});
};
