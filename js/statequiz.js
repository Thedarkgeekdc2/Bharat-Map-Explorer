/* "Play a Quiz" on a state card: a short quiz (up to 5 questions) about that one state, from its verified items first. */
window.STATEQUIZ={render(el,c,id){
  const {t,esc,name,lang}=c,r=regionById(id);if(!r){el.innerHTML='';return;}
  const lab=s=>s.replace(/\s*\(.*?\)\s*/g,' ').trim(),show=x=>lab((lang==='hi'&&x.hi)||x.en),shuf=a=>a.slice().sort(()=>Math.random()-.5);
  const cats=['classical','traditions','festivals','foods','famous'];
  const own=(R,dk)=>{const D=CONTENT[R.id],K=dk?(D.dk||{}):{},o={classical:[...D.classical],traditions:[...D.traditions,...(K.folk||[])],festivals:[...D.festivals,...(K.festivals||[])],foods:[...(D.foods||[]),...(K.foods||[])],famous:[...D.famous,...(K.famous||[])]};
    if(D.animal)o.animal=[D.animal];return o;};
  let mine=own(r,false);const n0=Object.values(mine).reduce((a,x)=>a+x.length,0);if(n0<3)mine=own(r,true);
  const mineKeys=new Set();Object.values(mine).forEach(a=>a.forEach(x=>mineKeys.add(itemKey(x.en))));
  const pool=cat=>{const o=[];REGIONS.forEach(R=>{if(R.id===r.id)return;(own(R,false)[cat]||[]).forEach(x=>{if(!mineKeys.has(itemKey(x.en)))o.push(x);});});return o;};
  const Qs=[];const cp=CAPITALS[r.id],capL=x=>x[lang]||x.en;
  const co=[capL(cp)];shuf(REGIONS).forEach(x=>{const v=capL(CAPITALS[x.id]);if(co.length<4&&!co.includes(v))co.push(v);});
  Qs.push({text:t('sqCap').replace('{x}',name(r)),opts:shuf(co),ans:capL(cp)});
  const ph={classical:'sqDance',traditions:'sqTrad',festivals:'sqFest',foods:'sqFood',famous:'sqPlace',animal:'sqAnimal'};
  shuf(Object.keys(mine).filter(k=>mine[k].length)).forEach(k=>{if(Qs.length>=5)return;const ok=shuf(mine[k])[0],d=shuf(pool(k).filter((x,i,a)=>a.findIndex(y=>show(y)===show(x))===i)).filter(x=>show(x)!==show(ok)).slice(0,3);
    if(d.length<3)return;Qs.push({text:t(ph[k]).replace('{x}',name(r)),opts:shuf([ok,...d]).map(show),ans:show(ok)});});
  let i=0,sc=0,done=false;const miss=[];
  function view(){if(i>=Qs.length){el.innerHTML=`<div class="quiz res"><h3>${sc===Qs.length?'⭐⭐⭐':sc>=Qs.length/2?'⭐⭐':'⭐'}</h3><p class="score">${t('qScore')}: <b>${sc} / ${Qs.length}</b></p>${miss.length?`<h4>${t('qMissed')}</h4><ul class="miss">${miss.map(m=>`<li>${esc(m.text)}<br><b>✔ ${esc(m.ans)}</b></li>`).join('')}</ul>`:`<p>🎉 ${t('qPerfect')}</p>`}
      <div class="tbtn"><button data-q="again">🔄 ${t('qAgain')}</button><a class="act" href="#/state/${r.id}">← ${esc(name(r))}</a></div></div>`;return;}
    const q=Qs[i];done=false;el.innerHTML=`<div class="quiz"><div class="qtop"><span>${t('qQ')} ${i+1}/${Qs.length}</span><span>⭐ ${sc}</span></div><h3 class="qt">${esc(q.text)} ${spk(q.text)}</h3><div class="opts">${q.opts.map(o=>`<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}</div><p class="fb" id="fb"></p></div>`;}
  el.onclick=e=>{const b=e.target.closest&&e.target.closest('button');if(!b)return;
    if(b.dataset.q==='again'){i=0;sc=0;miss.length=0;view();return;}
    if(b.dataset.q==='next'){i++;view();return;}
    if(b.dataset.o===undefined||done)return;done=true;const q=Qs[i],ok=b.dataset.o===q.ans;if(ok)sc++;else miss.push(q);
    el.querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(x.dataset.o===q.ans)x.classList.add('right');else if(x===b)x.classList.add('bad');});
    el.querySelector('#fb').className='fb '+(ok?'ok':'no');el.querySelector('#fb').innerHTML=(ok?'✔ '+t('qRight'):'✖ '+t('qWrong'))+` <b>${esc(q.ans)}</b> <button class="act" data-q="next">${t('next')} →</button>`;};
  view();}};
