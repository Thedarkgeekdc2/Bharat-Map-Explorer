/* MODULE 2 — State information card (returns HTML). Verified items carry their source in brackets;
   items from cards-dk.js show a Review button (or the reviewing teacher's name). Empty sections are hidden. */
window.renderCard=function(r,c){
  const {t,esc,lang}=c, L=o=>esc(o[lang]||o.en), data=(window.CONTENT||{})[r.id], cap=(window.CAPITALS||{})[r.id];
  const li=x=>{const f=(window.INFO||{})[itemKey(x.en)];return `<li class="it">${thumb(x.en)}<span>${L(x)} ${spk((x[lang]||x.en))}${x.dk?reviewTag(x,r.en,lang):''}${f&&descOf(f,lang)?`<i class="desc">${esc(descOf(f,lang))}</i>`:''}</span></li>`;};
  const sec=(ico,title,a)=>a.length?`<section class="cat"><h4><span>${ico}</span>${title}</h4><ul>${a.map(li).join('')}</ul></section>`:'';
  let h=`<div class="cap"><span>${t('capital')}</span><b>${cap?L(cap):'—'}</b>${cap?spk(cap[lang]||cap.en):''}</div>`;
  if(!data)return h;
  const k=data.dk||{folk:[],festivals:[],foods:[],wildlife:[],famous:[]};
  const dances=[...data.classical.map(x=>({en:x.en+' ('+t('classicalTag')+')',hi:x.hi?x.hi+' ('+t('classicalTag')+')':undefined})),...data.traditions,...k.folk];
  const lg=data.langs?`<section class="cat"><h4><span>🗣️</span>${t('languages')}</h4><p class="langs">${esc((lang==='hi'?data.langs.hi:data.langs.en).join(' · '))}${reviewTag({en:'Languages of '+r.en},r.en,lang)}</p></section>`:'';
  h+=`<div class="cats">`+lg+sec('💃',t('dances'),dances)+sec('🎉',t('festivals'),[...data.festivals,...k.festivals])+
     sec('🍛',t('foods'),[...(data.foods||[]),...k.foods])+sec('🐾',t('stateAnimal'),data.animal?[data.animal]:[])+sec('🦌',t('wildlife'),k.wildlife)+
     sec('🏛️',t('famous'),[...data.famous,...k.famous])+`</div>`;
  return h+`<p class="small review">${t('sources')}</p><a class="quizbtn on" href="#/squiz/${r.id}">🎯 ${t('playQuiz')}</a>`;
};
