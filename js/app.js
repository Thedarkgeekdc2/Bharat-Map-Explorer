(function(){
const app=document.getElementById('app');
const ls={get(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
/* Only class + language are stored. No personal data. */
const S={lang:ls.get('bme.lang','en'),grade:Number(ls.get('bme.grade','0'))};
const t=k=>I18N[S.lang][k];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const name=r=>S.lang==='hi'?r.hi:r.en;
const ctx=()=>({lang:S.lang,t,name,esc,grade:S.grade});
/* Each ready module registers MODE_VIEWS[id]=(el,ctx)=>{...} in its own file. */
window.MODE_VIEWS=window.MODE_VIEWS||{};
const THEMES=[['festivals','🎉','tFestivals','green'],['calendar','📅','tCalendar','blue'],['dance','💃','tDance','plum'],['food','🍛','tFood','saffron'],['places','🏛️','tPlaces','blue']];
function home(){
  app.innerHTML=`<section class="hero"><h1>${t('hello')}</h1><p>${t('glance')}</p></section>
  <h2 class="sec">${t('pick')}</h2>
  <div class="classes">${[1,2,3,4,5].map(n=>`<a class="cls c${n}" href="#/class/${n}"><b>${n}</b><span>${t('cls')} ${n}</span></a>`).join('')}</div>
  <h2 class="sec">${t('themeTitle')}</h2>
  <form class="sbar" id="hs"><input id="hq" type="search" placeholder="${t('searchPh')}" aria-label="${t('searchBtn')}"><button>${t('searchBtn')}</button></form>
  <div class="themes">${THEMES.map(([id,ico,k,col])=>`<a class="theme ${col}" href="#/discover/${id}"><span>${ico}</span>${t(k)}</a>`).join('')}</div>
  <div class="homenote"><b>📝 ${t('homeNote')}</b><br><a href="https://wa.me/918126956997" target="_blank" rel="noopener">💬 ${t('homeNoteNo')}</a></div>`;
  document.getElementById('hs').onsubmit=e=>{e.preventDefault();try{sessionStorage.setItem('bme.q',document.getElementById('hq').value);}catch(x){}location.hash='#/discover/all';};
}
function modes(){
  app.innerHTML=`<p class="level">${t('levels')[S.grade]}</p><h2 class="sec">${t('modesTitle')}</h2>
  <div class="modes">${MODES.map(m=>`<a class="mode ${m.color}" href="#/mode/${m.id}"><span class="ico">${m.icon}</span>
  <strong>${t(m.id)}</strong><em>${t(m.id+'D')}</em>${m.status==='soon'?`<span class="tag">${t('soon')}</span>`:''}</a>`).join('')}</div>
  <div class="tcbottom"><a class="theme plum" href="#/teacher"><span>👩‍🏫</span>${t('teacherCorner')}</a></div>`;
}
function mode(id){
  const m=MODES.find(x=>x.id===id); if(!m){location.hash='#/class/'+S.grade;return;}
  const view=MODE_VIEWS[id];
  app.innerHTML=`<h2 class="sec">${m.icon} ${t(id)}</h2>`+
    (m.status==='soon'||!view?`<div class="soon"><b>${t('soon')}</b><p>${t('soonMsg')}</p></div>`:'<div id="view"></div>');
  if(view&&m.status==='ready')view(document.getElementById('view'),ctx());
}
function discover(tab){app.innerHTML=`<h2 class="sec">🔎 ${t('discover')}</h2><div id="dv"></div>`;DISCOVER.render(document.getElementById('dv'),ctx(),tab);}
function stateView(id){
  const r=regionById(id); if(!r){location.hash='#/discover/all';return;}
  app.innerHTML=`<section class="card statecard"><h3>${esc(name(r))} ${spk(name(r))}</h3>${renderCard(r,ctx())}</section>`;
}
function route(){
  const [,a,b]=(location.hash||'#/home').split('/');
  if(a==='class'){const n=Number(b); if(n>=1&&n<=5){S.grade=n;ls.set('bme.grade',n);} else {location.hash='#/home';return;}}
  if(a==='mode'&&!S.grade){location.hash='#/home';return;}
  app.onclick=app.oninput=app.onchange=app.onsubmit=app.onkeydown=null;
  if(a==='teacher'){app.innerHTML='';TEACHER.render(app,ctx());} else if(a==='thelp'){app.innerHTML=THELP.html();} else if(a==='squiz'){const r=regionById(b);app.innerHTML=`<h2 class="sec">🎯 ${r?esc(name(r)):''}</h2><div id="sqv"></div>`;STATEQUIZ.render(document.getElementById('sqv'),ctx(),b);}
  else if(a==='class') modes(); else if(a==='mode') mode(b); else if(a==='discover') discover(b); else if(a==='state') stateView(b); else home();
  document.body.classList.toggle('fill',a==='mode'&&['explore','learn'].includes(b));
  chrome(a||'home'); app.focus({preventScroll:true}); window.scrollTo(0,0);
}
function chrome(a){
  document.documentElement.lang=S.lang;
  document.getElementById('brandName').textContent=t('brand');
  document.getElementById('langBtn').textContent=t('lang');
  document.getElementById('footNote').textContent=t('foot');
  const back=document.getElementById('backBtn'); back.hidden=!['class','mode','discover','state','teacher','squiz','thelp'].includes(a); back.setAttribute('aria-label',t('back'));
  const g=document.getElementById('gradeBadge'); g.hidden=!(a==='class'||a==='mode'); g.textContent=`${t('cls')} ${S.grade}`;
  document.title=t('brand')+' | Classes I–V';
}
document.getElementById('backBtn').onclick=()=>{const a=location.hash.split('/')[1];
  if(a==='mode')location.hash='#/class/'+S.grade; else if(a==='thelp')location.hash='#/teacher'; else if(a==='teacher')location.hash=S.grade?'#/class/'+S.grade:'#/home'; else if((a==='state'||a==='squiz')&&history.length>1)history.back(); else location.hash='#/home';};
document.getElementById('langBtn').onclick=()=>{S.lang=S.lang==='en'?'hi':'en';ls.set('bme.lang',S.lang);route();};
addEventListener('hashchange',route); route();
})();
