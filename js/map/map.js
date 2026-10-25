/* Reusable India map engine (used by Explore now; Build India + Quiz later).
   BMap.load() -> BMap.draw(el,{onTap}) -> BMap.mark(id,'selected'|'correct'|'wrong'|'target'|'placed') */
window.BMap=(function(){
let data=null,cache=null;
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'');
const ALIAS={orissa:'odisha',uttaranchal:'uttarakhand',pondicherry:'puducherry','nct-of-delhi':'delhi','delhi-nct':'delhi','jammu-and-kashmir-ut':'jammu-and-kashmir'};
function toId(name){let k=slug(name);if(/(^|-)dadra(-|$)/.test(k)||/(^|-)daman(-|$)/.test(k))return 'dadra-and-nagar-haveli-and-daman-and-diu';return ALIAS[k]||k;}
async function load(){
  if(cache)return cache;
  let m=window.INDIA_MAP;
  if(!m){
    const base='https://cdn.jsdelivr.net/npm/@svg-maps/india@2.0.0/';
    try{const mod=await import(base+'+esm');m=mod.default||mod.india||mod;}
    catch(e1){ /* fallback: fetch source text and read its default export */
      const txt=await (await fetch(base+'index.js')).text();
      m=new Function(txt.replace(/export\s+default/,'return ')+'')();
    }
  }
  if(!m||!m.locations||!m.viewBox)throw new Error('Map data format not recognised');
  const groups={},unknown=[];
  m.locations.forEach(l=>{const id=toId(l.name||l.id);if(!regionById(id)){unknown.push(l.name||l.id);return;}(groups[id]=groups[id]||[]).push(l.path);});
  /* Old map: one J&K shape covers Ladakh too. Ladakh points to the same shape until newer geometry is added. */
  const shared={};
  if(groups['jammu-and-kashmir']&&!groups['ladakh'])shared['ladakh']='jammu-and-kashmir';
  cache={viewBox:m.viewBox,groups,unknown,shared,missing:REGIONS.filter(r=>!groups[r.id]&&!shared[r.id]).map(r=>r.en)};
  return cache;
}
function draw(el,opt){
  const d=cache;
  el.innerHTML=`<svg viewBox="${d.viewBox}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="India map">`+
   Object.entries(d.groups).map(([id,ps])=>{const r=regionById(id);return `<g class="region" data-id="${id}" tabindex="0" role="button" aria-label="${r.en}">${ps.map(p=>`<path d="${p}"/>`).join('')}</g>`}).join('')+`</svg>`;
  el.querySelectorAll('.region').forEach(g=>{
    g.addEventListener('click',()=>opt.onTap(g.dataset.id));
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onTap(g.dataset.id);}});
  });
  data=el;
}
function mark(id,cls){clear(cls);if(!data||!id)return;const sid=(cache.shared&&cache.shared[id])||id;const g=data.querySelector(`.region[data-id="${sid}"]`);if(g)g.classList.add(cls);}
function clear(cls){if(data)data.querySelectorAll('.region.'+cls).forEach(g=>g.classList.remove(cls));}
return{load,draw,mark,clear,info:()=>cache};
})();
