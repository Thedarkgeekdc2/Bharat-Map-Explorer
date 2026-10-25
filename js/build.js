/* MODULE 4 — Build India. Drag a state piece onto the map (it snaps in when correct) or tap the piece, then tap its place.
   Class 1-2: piece shows its name. Class 3-5: shape only (challenge). Hint = pulse on the right place (auto after 2 wrong tries). */
MODE_VIEWS.build=function(el,c){
  const {t,esc,name,lang,grade}=c, g=grade||1, COL=['#f6c177','#9ccfd8','#c4a7e7','#a8d8a0','#f4a6a6','#9bb8f0','#e8d28a'];
  let set='south',queue=[],idx=0,placed=0,total=0,cur=null,sel=false,wrong=0,mist=0,hints=0,busy=false;
  const $=s=>el.querySelector(s), keys=['south',...Object.keys(REGION_GROUPS).filter(k=>k!=='south'),'all'];
  el.innerHTML=`<div class="build"><div class="tabs" id="bset"></div><p class="bmsg" id="bmsg">${t('mapLoading')}</p>
   <div class="buildmap" id="bmap"></div><div class="tray"><div class="piece" id="piece"></div>
   <div class="tbtn"><button id="bhint">💡 ${t('bldHint')}</button><button id="bskip">⏭ ${t('bldSkip')}</button><button id="brest">🔄 ${t('bldRestart')}</button></div></div></div>`;
  const msg=(h,cls)=>{const m=$('#bmsg');m.innerHTML=h;m.className='bmsg '+(cls||'');};
  const pname=id=>{const r=regionById(id),sh=(BMap.info().shared)||{};const l=Object.keys(sh).find(k=>sh[k]===id);return name(r)+(l?' + '+name(regionById(l)):'');};
  const shape=id=>{const d=BMap.info(),paths=d.groups[id].map(p=>`<path d="${p}"/>`).join('');
    const w=document.createElement('div');w.style.cssText='position:absolute;visibility:hidden;left:0;top:0';
    w.innerHTML=`<svg viewBox="${d.viewBox}" width="300"><g>${paths}</g></svg>`;document.body.appendChild(w);
    let b={x:0,y:0,width:100,height:100};try{b=w.querySelector('g').getBBox();}catch(e){}w.remove();
    return `<svg class="pshape" viewBox="${b.x-3} ${b.y-3} ${b.width+6} ${b.height+6}">${paths}</svg>`;};
  const tabs=()=>{$('#bset').innerHTML=keys.map(k=>`<button class="tab${k===set?' on':''}" data-k="${k}">${k==='all'?t('tAll'):t('rg_'+k)}</button>`).join('');};
  function start(){
    const d=BMap.info(),ids=(set==='all'?REGIONS.map(r=>r.id):REGION_GROUPS[set]).filter(id=>d.groups[id]);
    queue=ids.slice().sort(()=>Math.random()-.5);total=queue.length;idx=0;placed=0;wrong=0;mist=0;hints=0;sel=false;busy=false;
    el.querySelectorAll('.region').forEach(r=>{r.classList.remove('placed','hint');r.style.removeProperty('--pc');
      const inSet=ids.includes(r.dataset.id);r.classList.toggle('slot',inSet);r.classList.toggle('ctx',!inSet);});
    tabs();next();
  }
  function next(){
    if(placed>=total){$('#piece').innerHTML=`<div class="done">🎉 ${t('bldDone')}</div>`;
      msg(`🎉 <b>${t('bldDone')}</b> ${t('bldMistakes')}: ${mist} · ${t('bldHints')}: ${hints}`,'ok');return;}
    cur=queue[idx%queue.length];wrong=0;sel=false;
    $('#piece').innerHTML=shape(cur)+(g<=2?`<b>${esc(pname(cur))}</b>`:'');$('#piece').classList.remove('sel');
    msg(`${t('bldTap')} (${placed}/${total})`);
  }
  function hint(auto){hints+=auto?0:1;const s=el.querySelector(`.region[data-id="${cur}"]`);if(!s)return;
    s.classList.add('hint');let m=null;try{const b=s.getBBox(),svg=s.ownerSVGElement;m=document.createElementNS('http://www.w3.org/2000/svg','circle');
      m.setAttribute('cx',b.x+b.width/2);m.setAttribute('cy',b.y+b.height/2);m.setAttribute('r',Math.max(14,Math.min(b.width,b.height)));m.setAttribute('class','ping');svg.appendChild(m);}catch(e){}
    setTimeout(()=>{s.classList.remove('hint');if(m)m.remove();},2600);}
  function check(id){
    if(busy||!cur)return;const s=el.querySelector(`.region[data-id="${id}"]`);
    if(id===cur){busy=true;s.classList.remove('slot','hint');s.classList.add('placed');s.style.setProperty('--pc',COL[placed%COL.length]);placed++;idx++;
      const cp=CAPITALS[id];msg(`✔ <b>${esc(pname(id))}</b> · ${t('capital')}: ${esc(cp[lang]||cp.en)}`,'ok');
      setTimeout(()=>{busy=false;next();},1100);}
    else{mist++;wrong++;s.classList.add('shake');setTimeout(()=>s.classList.remove('shake'),500);msg(`✖ ${t('bldNo')}`,'no');if(wrong>=2)hint(true);}
  }
  /* drag + tap on the piece */
  const P=$('#piece');let drag=null;
  P.addEventListener('pointerdown',e=>{if(!cur||busy)return;e.preventDefault();drag={x:e.clientX,y:e.clientY,moved:false,ghost:null};});
  addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)>8){drag.moved=true;const gh=document.createElement('div');gh.className='ghost';gh.innerHTML=P.querySelector('svg').outerHTML;document.body.appendChild(gh);drag.ghost=gh;}
    if(drag.ghost){drag.ghost.style.left=(e.clientX-60)+'px';drag.ghost.style.top=(e.clientY-60)+'px';}});
  addEventListener('pointerup',e=>{if(!drag)return;const d=drag;drag=null;
    if(d.ghost){d.ghost.remove();const tg=document.elementFromPoint(e.clientX,e.clientY),sl=tg&&tg.closest&&tg.closest('.region.slot');if(sl)check(sl.dataset.id);else msg(`✖ ${t('bldNo')}`,'no');}
    else{sel=!sel;P.classList.toggle('sel',sel);msg(sel?t('bldPickPlace'):t('bldTap'));}});
  el.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;
    if(b.dataset.k){set=b.dataset.k;start();}else if(b.id==='bhint')hint(false);
    else if(b.id==='bskip'&&cur&&!busy&&placed<total){idx++;next();}else if(b.id==='brest')start();});
  BMap.load().then(()=>{BMap.draw($('#bmap'),{onTap:id=>{const s=el.querySelector(`.region[data-id="${id}"]`);
      if(!s||!s.classList.contains('slot'))return;if(!sel){msg(t('bldPickFirst'),'no');return;}check(id);}});
    el.querySelector('#bmap').classList.add('ready');start();})
   .catch(e=>{console.error(e);msg(`${t('mapFail')} <small>${esc(e.message||e)}</small>`,'no');});
};
