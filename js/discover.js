/* Discover: Festivals / Festival Calendar / Classical Dance / Famous Food / Places + overall search. */
window.DISCOVER=(function(){
  const TABS=['all','festivals','calendar','dance','food','places'], TAB_CAT={festivals:'festival',calendar:'festival',dance:'dance',food:'food',places:'place'};
  const TAB_KEY={all:'tAll',festivals:'tFestivals',calendar:'tCalendar',dance:'tDance',food:'tFood',places:'tPlaces'};
  const CAT_KEY={dance:'catDance',dance2:'catDance',festival:'catFestival',food:'catFood',place:'catPlace',animal:'catAnimal'};
  const MON={en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],hi:['जन॰','फ़र॰','मार्च','अप्रैल','मई','जून','जुला॰','अग॰','सित॰','अक्टू॰','नव॰','दिस॰']};
  let IDX=null,Q='',MONTH=new Date().getMonth()+1;
  function build(){IDX=[];REGIONS.forEach(r=>{const c=CONTENT[r.id],k=c.dk||{};
    const add=(cat,arr)=>(arr||[]).forEach(x=>IDX.push({en:x.en,hi:x.hi,cat,r,dk:!!x.dk,info:(window.INFO||{})[itemKey(x.en)]||null}));
    add('dance',c.classical);add('dance2',c.traditions);add('dance2',k.folk);add('festival',c.festivals);add('festival',k.festivals);
    add('food',c.foods);add('food',k.foods);add('place',c.famous);add('place',k.famous);add('animal',c.animal?[c.animal]:[]);add('animal',k.wildlife);});}
  const norm=s=>String(s).toLowerCase();
  function search(q,tab,lang,t,month){
    if(!IDX)build(); q=norm(q).trim();
    return IDX.filter(it=>(tab==='all'||it.cat===TAB_CAT[tab])&&(tab!=='calendar'||(it.info&&it.info.m.includes(month)))&&
      (!q||norm(it.en+' '+(it.hi||'')+' '+it.r.en+' '+it.r.hi+' '+((it.info&&it.info.d)||'')+' '+t(CAT_KEY[it.cat])).includes(q)))
      .sort((a,b)=>a.r.en.localeCompare(b.r.en)||a.en.localeCompare(b.en));
  }
  function render(el,c,tab){
    const {t,esc,name,lang}=c; if(!TABS.includes(tab))tab='all';
    try{const pre=sessionStorage.getItem('bme.q');if(pre!==null){Q=pre;sessionStorage.removeItem('bme.q');}}catch(e){}
    const cal=tab==='calendar';
    el.innerHTML=`<form class="sbar" id="sf"><input id="sq" type="search" value="${esc(Q)}" placeholder="${t('searchPh')}" aria-label="${t('searchBtn')}"><button>${t('searchBtn')}</button></form>
    <div class="tabs">${TABS.map(x=>`<a class="tab${x===tab?' on':''}" href="#/discover/${x}">${t(TAB_KEY[x])}</a>`).join('')}</div>
    ${cal?`<div class="tabs months">${MON[lang].map((m,i)=>`<button class="tab${i+1===MONTH?' on':''}" data-m="${i+1}">${m}</button>`).join('')}</div><p class="small">${t('calNote')}</p>`:''}<ul class="res" id="rl"></ul>`;
    const list=()=>{const r=search(Q,tab,lang,t,MONTH);
      el.querySelector('#rl').innerHTML=r.length?r.map(it=>`<li><a href="#/state/${it.r.id}">${thumb(it.en)}<span><b>${esc((lang==='hi'&&it.hi)||it.en)}</b>${it.dk?' <span class="dk">(reviewed by DK)</span>':''}${it.info&&descOf(it.info,lang)?`<i class="desc">${esc(descOf(it.info,lang))}</i>`:''}<small>${esc(name(it.r))} · ${t(CAT_KEY[it.cat])}</small></span></a></li>`).join(''):`<li class="none">${t(cal?'noFestMonth':'noResult')}</li>`;};
    const inp=el.querySelector('#sq');inp.oninput=()=>{Q=inp.value;list();};
    el.querySelector('#sf').onsubmit=e=>{e.preventDefault();Q=inp.value;list();};
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{MONTH=+b.dataset.m;el.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('on',+x.dataset.m===MONTH));list();});
    list();
  }
  return{render,search,setQuery:q=>{Q=q;}};
})();
