/* MODULE 3 — Class-wise Learning. Same data, different depth per class:
   Class 1-2: picture + capital + state animal | Class 3: + dance and festival | Class 4: full card | Class 5: clues first, then reveal the state. */
(function(){
const G={
 north:['jammu-and-kashmir','ladakh','himachal-pradesh','punjab','haryana','uttarakhand','uttar-pradesh','delhi','chandigarh'],
 west:['rajasthan','gujarat','maharashtra','goa','dadra-and-nagar-haveli-and-daman-and-diu'],
 south:['andhra-pradesh','telangana','karnataka','kerala','tamil-nadu','puducherry'],
 east:['bihar','jharkhand','odisha','west-bengal','madhya-pradesh','chhattisgarh'],
 northeast:['arunachal-pradesh','assam','manipur','meghalaya','mizoram','nagaland','tripura','sikkim'],
 islands:['andaman-and-nicobar-islands','lakshadweep']};
window.REGION_GROUPS=G;
const EMO=[['lion','🦁'],['rhinoceros','🦏'],['elephant','🐘'],['buffalo','🐃'],['gaur','🐂'],['mithun','🐂'],['squirrel','🐿️'],['leopard','🐆'],['cat','🐈'],['deer','🦌'],['barasingha','🦌'],['sambar','🦌'],['hangul','🦌'],['sangai','🦌'],['blackbuck','🦌'],['chinkara','🦌'],['antelope','🦌'],['tahr','🐐'],['serow','🐐'],['langur','🐒'],['gibbon','🐒'],['fish','🐠'],['dugong','🐬'],['panda','🐼']];
const emo=r=>{const a=((CONTENT[r.id].animal||{}).en||'').toLowerCase();const m=EMO.find(x=>a.includes(x[0]));return m?m[1]:(a?'🐾':'🗺️');};
MODE_VIEWS.learn=function(el,c){
  const {t,esc,name,lang,grade}=c, g=grade||1, L=o=>esc(o[lang]||o.en);
  el.innerHTML=`<div class="xsplit lsplit"><div class="xmap card"><div class="maparea" id="lmapArea"></div></div><div class="xside" id="lui"></div></div>`;
  const ui=el.querySelector('#lui');
  const S={reg:'all',i:0,open:false};
  const deck=()=>REGIONS.filter(r=>S.reg==='all'||G[S.reg].includes(r.id));
  const tag=x=>x&&x.dk?reviewTag(x,'',lang):'';
  const first=(r,key)=>{const D=CONTENT[r.id],K=D.dk||{};const v=key==='dance'?[...D.classical,...D.traditions,...(K.folk||[])]:key==='fest'?[...D.festivals,...(K.festivals||[])]:key==='place'?[...D.famous,...(K.famous||[])]:[];return v[0]||null;};
  const row=(lab,x)=>x?`<li><span>${lab}</span><b>${L(x)}${tag(x)}</b></li>`:'';
  const facts=r=>{const D=CONTENT[r.id],cap=CAPITALS[r.id];
    let h=`<li><span>${t('capital')}</span><b>${L(cap)} ${spk(cap[lang]||cap.en)}</b></li>`+row(t('stateAnimal'),D.animal);
    if(g>=3)h+=row(t('dances'),first(r,'dance'))+row(t('festivals'),first(r,'fest'));
    return `<ul class="facts">${h}</ul>`;};
  function view(){
    const d=deck(); if(S.i>=d.length)S.i=0; const r=d[S.i];
    const chips=['all',...Object.keys(G)].map(k=>`<button class="tab${k===S.reg?' on':''}" data-a="reg" data-v="${k}">${k==='all'?t('tAll'):t('rg_'+k)}</button>`).join('');
    let card;
    if(g>=5){
      const D=CONTENT[r.id],cl=[`${t('capital')}: ${L(CAPITALS[r.id])}`];
      const p=first(r,'place'),f=first(r,'fest');if(p)cl.push(`${t('famous')}: ${L(p)}`);if(f)cl.push(`${t('festivals')}: ${L(f)}`);if(D.animal)cl.push(`${t('stateAnimal')}: ${L(D.animal)}`);
      card=S.open?`<h3 class="big">${esc(name(r))} ${spk(name(r))}</h3>${renderCard(r,c)}`:`<p class="q">${t('whichState')}</p><ul class="clues">${cl.map(x=>`<li>${x}</li>`).join('')}</ul><button class="act" data-a="open">${t('showState')}</button>`;
    }else if(g===4){card=`<h3 class="big">${esc(name(r))} ${spk(name(r))}</h3>${renderCard(r,c)}`;}
    else card=`<div class="emo">${emo(r)}</div><h3 class="big">${esc(name(r))} ${spk(name(r))}</h3>`+(S.open?facts(r):`<button class="act" data-a="open">${t('tapReveal')}</button>`);
    ui.innerHTML=`<div class="learn lv${g<=2?'12':g}"><p class="small">${t('acts')[g]}</p><div class="tabs">${chips}</div>
    <div class="lcard">${card}</div><div class="nav"><button data-a="prev">← ${t('prev')}</button><span>${S.i+1} / ${d.length}</span><button data-a="next">${t('next')} →</button></div></div>`;fitUI();
  }
  const fitUI=()=>{ui.style.zoom='';if(!(document.body.classList.contains('fill')&&matchMedia('(min-width:1200px) and (min-height:640px)').matches))return;let lo=1,hi=Math.max(1,Math.min(2.6,innerWidth/1700));const ok=z=>{ui.style.zoom=z;return ui.scrollHeight<=ui.clientHeight+2;};if(ok(hi))return;for(let i=0;i<7;i++){const mid=(lo+hi)/2;if(ok(mid))lo=mid;else hi=mid;}ui.style.zoom=lo;};
  addEventListener('resize',()=>{if(ui.isConnected)fitUI();});
  const mapMark=()=>{try{if(BMap.info())BMap.mark(deck()[S.i].id,'selected');}catch(e){}};
  ui.onclick=e=>{const b=e.target.closest&&e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,n=deck().length;
    if(a==='reg'){S.reg=b.dataset.v;S.i=0;S.open=false;}else if(a==='open')S.open=true;
    else if(a==='next'){S.i=(S.i+1)%n;S.open=false;}else if(a==='prev'){S.i=(S.i-1+n)%n;S.open=false;}
    view();mapMark();};
  view();
  BMap.load().then(()=>{BMap.draw(el.querySelector('#lmapArea'),{onTap:id=>{S.reg='all';S.i=Math.max(0,REGIONS.findIndex(r=>r.id===id));S.open=false;view();mapMark();}});mapMark();}).catch(()=>{});
};
})();
