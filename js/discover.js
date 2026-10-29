/* Discover: the Classical Dance tab is intentionally limited to the 8 canonical school-facing forms;
   other folk/regional dance traditions remain searchable under Folk & Traditional. */
window.DISCOVER=(function(){
  const TABS=['all','festivals','calendar','dance','food','places','languages'], TAB_CAT={festivals:'festival',calendar:'festival',dance:'dance',food:'food',places:'place'},TAB_CATS={languages:['offlang']};
  const TAB_KEY={all:'tAll',festivals:'tFestivals',calendar:'tCalendar',dance:'tDance',food:'tFood',places:'tPlaces',languages:'tLanguages'};
  const CAT_KEY={dance:'catDance',dance2:'catFolk',festival:'catFestival',food:'catFood',place:'catPlace',animal:'catAnimal',language:'catLanguage',offlang:'catOffLang'};
  const MON={en:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],hi:['जन॰','फ़र॰','मार्च','अप्रैल','मई','जून','जुला॰','अग॰','सित॰','अक्टू॰','नव॰','दिस॰']};
  let IDX=null,Q='',MONTH=new Date().getMonth()+1;
  const norm=s=>String(s||'').toLowerCase();
  function build(){
    IDX=[];
    REGIONS.forEach(r=>{
      const c=CONTENT[r.id],k=c.dk||{};
      const add=(cat,arr)=>(arr||[]).forEach(x=>IDX.push({en:x.en,hi:x.hi,detail:x.detail,detailHi:x.detailHi,cat,r,dk:!!x.dk,info:(window.INFO||{})[itemKey(x.en)]||null,sourceUrl:x.sourceUrl,sourceLabel:x.sourceLabel}));
      // Only the dedicated canonical array feeds the Classical Dance index.
      add('dance2',c.traditions);add('dance2',k.folk);
      add('festival',c.festivals);add('festival',k.festivals);
      add('food',c.foods);add('food',k.foods);
      add('place',c.famous);add('place',k.famous);
      add('animal',c.animal?[c.animal]:[]);add('animal',c.wildlife);add('animal',k.wildlife);add('animal',k.animalCandidate);
    });
    (window.CLASSICAL_DANCES||[]).forEach(d=>{const r=regionById(d.stateId);if(r)IDX.push({...d,cat:'dance',r,dk:false,officialClassical:true,info:null});});
    (window.OFFICIAL_LANGUAGES||[]).forEach(x=>IDX.push({...x,cat:'offlang',r:null,dk:false,officialLanguage:true,info:null}));
  }
  function search(q,tab,lang,t,month){
    if(!IDX)build(); q=norm(q).trim();
    return IDX.filter(it=>(tab==='all'||(TAB_CATS[tab]||[TAB_CAT[tab]]).includes(it.cat))&&(tab!=='calendar'||(it.info&&it.info.m.includes(month)))&&
      (!q||norm(it.en+' '+(it.hi||'')+' '+(it.r?(it.r.en+' '+it.r.hi):'India')+' '+((it.detail||it.detailHi)||'')+' '+((it.info&&it.info.d)||'')+' '+t(CAT_KEY[it.cat])).includes(q)))
      .sort((a,b)=>tab==='dance'?(a.order||0)-(b.order||0):tab==='languages'?(a.number||0)-(b.number||0):(a.r?a.r.en:'India').localeCompare(b.r?b.r.en:'India')||a.en.localeCompare(b.en));
  }
  function render(el,c,tab){
    const {t,esc,name,lang}=c; if(!TABS.includes(tab))tab='all';
    try{const pre=sessionStorage.getItem('bme.q');if(pre!==null){Q=pre;sessionStorage.removeItem('bme.q');}}catch(e){}
    const cal=tab==='calendar';
    const resultTarget=tab==='dance'?'<div class="classical-grid" id="classicalList"></div>':tab==='languages'?'<div class="official-language-grid" id="officialLanguageList"></div><p class="small lang-source"><a href="https://rajbhasha.gov.in/languages_included_in_the_eighth_schedule" target="_blank" rel="noopener noreferrer">'+t('languageSource')+' ↗</a></p>':'<ul class="res" id="rl"></ul>';
    el.innerHTML=`<form class="sbar" id="sf"><input id="sq" type="search" value="${esc(Q)}" placeholder="${t('searchPh')}" aria-label="${t('searchBtn')}"><button>${t('searchBtn')}</button></form>
    <div class="tabs">${TABS.map(x=>`<a class="tab${x===tab?' on':''}" href="#/discover/${x}">${t(TAB_KEY[x])}</a>`).join('')}</div>
    ${tab==='languages'?`<div class="tsum">${t('langFacts')}</div>`:''}${tab==='dance'?`<div class="tsum dance-intro">${t('danceFacts')}</div>`:''}${cal?`<div class="tabs months">${MON[lang].map((m,i)=>`<button class="tab${i+1===MONTH?' on':''}" data-m="${i+1}">${m}</button>`).join('')}</div><p class="small">${t('calNote')}</p>`:''}${resultTarget}`;
    const list=()=>{
      const r=search(Q,tab,lang,t,MONTH);
      if(tab==='dance'){
        const target=el.querySelector('#classicalList');
        target.innerHTML=r.length?r.filter(it=>it.officialClassical).map((it,i)=>`<a class="classical-card dance-c${i%4}" href="#/state/${it.r.id}">
          <div class="dance-card-top"><span class="dance-emoji" aria-hidden="true">💃</span><span class="dance-count">${String(i+1).padStart(2,'0')} / 08</span></div>
          <div class="dance-card-body"><span class="dance-kicker">${t('classicalBadge')}</span><b class="dance-name">${esc((lang==='hi'&&it.hi)||it.en)}</b>
          <strong class="dance-state">📍 ${esc(name(it.r))}</strong><p class="dance-detail">${esc((lang==='hi'&&it.detailHi)||it.detail)}</p>
          <span class="dance-explore">${t('exploreState')} →</span></div></a>`).join(''):`<p class="none">${t('noResult')}</p>`;
      } else if(tab==='languages'){
        const target=el.querySelector('#officialLanguageList');
        target.innerHTML=r.length?r.map((it,i)=>`<article class="official-language-card"><span class="language-letter">${esc(((lang==='hi'&&it.hi)||it.en).slice(0,1))}</span><span class="language-names"><b>${esc((lang==='hi'&&it.hi)||it.en)}</b><small>${esc((lang==='hi'?it.en:it.hi)||'')}</small></span><span class="language-number">${String(it.number||i+1).padStart(2,'0')}</span></article>`).join(''):`<p class="none">${t('noResult')}</p>`;
      } else {
        el.querySelector('#rl').innerHTML=r.length?r.map(it=>`<li><a href="${it.r?`#/state/${it.r.id}`:'#/discover/languages'}">${thumb(it.en)}<span><b>${esc((lang==='hi'&&it.hi)||it.en)}</b>${it.dk?reviewTag({en:it.en},it.r?it.r.en:'',lang):''}${it.info&&descOf(it.info,lang)?`<i class="desc">${esc(descOf(it.info,lang))}</i>`:((lang==='hi'&&it.detailHi)||it.detail)?`<i class="desc">${esc((lang==='hi'&&it.detailHi)||it.detail)}</i>`:''}${it.sourceUrl?`<small>${lang==='hi'?'आधिकारिक स्रोत दर्ज है':'Official source recorded'}</small>`:''}<small>${esc(it.r?name(it.r):'India')} · ${t(CAT_KEY[it.cat])}</small></span></a></li>`).join(''):`<li class="none">${t(cal?'noFestMonth':'noResult')}</li>`;
      }
    };
    const inp=el.querySelector('#sq');inp.oninput=()=>{Q=inp.value;list();};
    el.querySelector('#sf').onsubmit=e=>{e.preventDefault();Q=inp.value;list();};
    el.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{MONTH=+b.dataset.m;el.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('on',+x.dataset.m===MONTH));list();});
    list();
  }
  return{render,search,setQuery:q=>{Q=q;}};
})();
