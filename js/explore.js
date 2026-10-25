/* MODULE 1 — Explore Map */
window.MODE_VIEWS=window.MODE_VIEWS||{};
MODE_VIEWS.explore=function(el,c){
  const {t,name,esc,lang}=c, other=r=>lang==='hi'?r.en:r.hi;
  el.innerHTML=`<div class="explore"><div class="card"><p class="hint">${t('tapHint')}</p><div class="maparea" id="mapArea"><p class="load">${t('mapLoading')}</p></div></div>
  <aside class="card side"><div id="stateInfo" class="stateinfo"><h3>${t('pickOne')}</h3></div><p class="hint">${t('small')}</p>
  <ul class="chips mini">${REGIONS.map(r=>`<li><button class="chip ${r.type}" data-id="${r.id}">${esc(name(r))}</button></li>`).join('')}</ul></aside></div><section class="card statecard" id="stateCard" hidden></section><p class="diag" id="diag"></p>`;
  const show=id=>{
    const r=regionById(id); if(!r)return;
    BMap.mark(id,'selected');
    el.querySelectorAll('.chip').forEach(b=>b.classList.toggle('on',b.dataset.id===id));
    const sc=el.querySelector('#stateCard');sc.hidden=false;sc.innerHTML=`<h3>${esc(name(r))}</h3>`+renderCard(r,c);
    const sh=(BMap.info()||{}).shared||{};
    const mate=sh[id]?regionById(sh[id]):(Object.keys(sh).find(k=>sh[k]===id)?regionById(Object.keys(sh).find(k=>sh[k]===id)):null);
    el.querySelector('#stateInfo').innerHTML=`<h3>${esc(name(r))} ${spk(name(r))}</h3><p class="kind ${r.type}">${t(r.type)}</p><p class="alt">${t('alsoCalled')}: <b>${esc(other(r))}</b></p>`+(mate?`<p class="note">${t('sharedNote')}: <b>${esc(name(mate))}</b></p>`:'');
  };
  el.querySelectorAll('.chip').forEach(b=>b.onclick=()=>show(b.dataset.id));
  BMap.load().then(d=>{
    BMap.draw(el.querySelector('#mapArea'),{onTap:show});
    const bad=d.missing.length||d.unknown.length||Object.keys(d.shared).length;
    el.querySelector('#diag').textContent=`Map check: ${REGIONS.length-d.missing.length}/${REGIONS.length} regions linked`+(d.missing.length?` · ${t('mapMissing')}: ${d.missing.join(', ')}`:'')+(Object.keys(d.shared).length?` · Shared shape: ${Object.keys(d.shared).map(k=>regionById(k).en+' → '+regionById(d.shared[k]).en).join(', ')}`:'')+(d.unknown.length?` · Unknown shapes: ${d.unknown.join(', ')}`:'');
    if(!bad)el.querySelector('#diag').classList.add('ok');
  }).catch(e=>{console.error(e);el.querySelector('#mapArea').innerHTML=`<p class="fail">${t('mapFail')}<br><small>${esc(e.message||e)}</small></p>`;});
};
