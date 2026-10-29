/* Official India state/UT boundary map engine.
   Source: Survey of India / Esri India state polygon layer.
   The GeoJSON is cached by the service worker (and localStorage fallback) after one
   successful online load, then reused offline. Jammu & Kashmir and Ladakh are separate features. */
window.BMap=(function(){
let cache=null,drawn=null;
const STORAGE_KEY='bme_official_india_state_map_v1';
const OFFICIAL_QUERY='https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1/query?where=1%3D1&outFields=state&returnGeometry=true&outSR=4326&f=geojson';
const slug=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/&/g,'and').replace(/[^a-z]+/g,'-').replace(/^-|-$/g,'');
const DNHDIUID='dadra-and-nagar-haveli-and-daman-and-diu';
const ALIAS={orissa:'odisha',uttaranchal:'uttarakhand',pondicherry:'puducherry','nct-of-delhi':'delhi','delhi-nct':'delhi','jammu-kashmir':'jammu-and-kashmir','jammu-and-kashmir-ut':'jammu-and-kashmir','union-territory-of-jammu-and-kashmir':'jammu-and-kashmir','union-territory-of-ladakh':'ladakh','andaman-and-nicobar':'andaman-and-nicobar-islands','andaman-and-nicobar-island':'andaman-and-nicobar-islands','chattisgarh':'chhattisgarh','chhatisgarh':'chhattisgarh','dadra-nagar-haveli-daman-diu':DNHDIUID,'dadra-and-nagar-haveli-daman-and-diu':DNHDIUID,'dadra-and-nagar-haveli-daman-diu':DNHDIUID,'dadra-nagar-haveli-and-daman-diu':DNHDIUID,'dadra-and-nagar-haveli-and-daman-diu':DNHDIUID,'dnh-dd':DNHDIUID,'dnh-and-dd':DNHDIUID};
function toId(name){
  const k=slug(name);
  /* Some boundary releases still expose the UT's two former areas as separate features.
     Merge both geometries into the single current UT region so all its territory is drawn. */
  if((k.includes('dadra')&&k.includes('haveli'))||(k.includes('daman')&&k.includes('diu'))||/^dnh(?:-|$)/.test(k)||/^dd(?:-|$)/.test(k))return DNHDIUID;
  return ALIAS[k]||k;
}
function readStored(){try{const s=localStorage.getItem(STORAGE_KEY);return s?JSON.parse(s):null;}catch(_){return null;}}
function persistStored(gj){try{const s=JSON.stringify(gj);if(s.length<4500000)localStorage.setItem(STORAGE_KEY,s);}catch(_){/* Service-worker Cache API remains the main offline cache. */}}
async function getGeoJSON(){
  let responseError=null;
  try{
    const res=await fetch(OFFICIAL_QUERY,{mode:'cors',credentials:'omit'});
    if(!res.ok)throw new Error('Map service HTTP '+res.status);
    const gj=await res.json();
    if(!gj||!Array.isArray(gj.features)||!gj.features.length)throw new Error('Official map service returned no features');
    persistStored(gj);
    return gj;
  }catch(e){responseError=e;}
  const saved=readStored();
  if(saved&&Array.isArray(saved.features)&&saved.features.length)return saved;
  throw new Error('Official map data is not cached yet. Connect to the internet once, open the map successfully, and it will then work offline. '+(responseError&&responseError.message?responseError.message:''));
}
function polygonsOf(geometry){
  if(!geometry||!geometry.coordinates)return [];
  if(geometry.type==='Polygon')return [geometry.coordinates];
  if(geometry.type==='MultiPolygon')return geometry.coordinates;
  return [];
}
function mercator(point){
  const lon=Number(point&&point[0]),lat=Number(point&&point[1]);
  if(!Number.isFinite(lon)||!Number.isFinite(lat))return null;
  const r=Math.max(-85,Math.min(85,lat))*Math.PI/180;
  return [lon*Math.PI/180,Math.log(Math.tan(Math.PI/4+r/2))];
}
function geoJSONToMap(gj){
  const features=[],groups={},unknown=[];let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for(const ft of gj.features){
    const props=ft.properties||{};
    const raw=props.state||props.State||props.STATE||props.name||props.NAME||props.region||props.Region||'';
    const id=toId(raw);
    if(!raw||!regionById(id)){if(raw)unknown.push(String(raw));continue;}
    const polygons=polygonsOf(ft.geometry);
    if(!polygons.length)continue;
    const projected=polygons.map(poly=>poly.map(ring=>ring.map(mercator).filter(Boolean))).filter(poly=>poly.some(r=>r.length>=3));
    for(const poly of projected)for(const ring of poly)for(const p of ring){minX=Math.min(minX,p[0]);maxX=Math.max(maxX,p[0]);minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1]);}
    features.push({id,polygons:projected});
  }
  if(!features.length||![minX,maxX,minY,maxY].every(Number.isFinite))throw new Error('Official map geometry could not be projected');
  const targetH=1000,pad=14,scale=targetH/(maxY-minY||1),width=(maxX-minX)*scale;
  const pathOf=ring=>ring.map((p,i)=>{const x=pad+(p[0]-minX)*scale,y=pad+(maxY-p[1])*scale;return (i?'L':'M')+x.toFixed(2)+','+y.toFixed(2);}).join(' ')+' Z';
  for(const ft of features){
    const arr=groups[ft.id]||(groups[ft.id]=[]);
    for(const poly of ft.polygons){const d=poly.map(pathOf).join(' ');if(d)arr.push(d);}
  }
  const missing=REGIONS.filter(r=>!groups[r.id]||!groups[r.id].length).map(r=>r.en);
  if(missing.length){
    throw new Error('Official boundary layer is missing expected States/UTs: '+missing.join(', '));
  }
  return {viewBox:`0 0 ${(width+pad*2).toFixed(2)} ${(targetH+pad*2).toFixed(2)}`,groups,unknown:[...new Set(unknown)],missing:[],shared:{},source:'Survey of India / Esri India',featureCount:features.length};
}
async function load(){
  if(cache)return cache;
  /* Permit a future fully-bundled official map asset without changing the renderer. */
  if(window.INDIA_MAP&&window.INDIA_MAP.features){cache=geoJSONToMap(window.INDIA_MAP);return cache;}
  const gj=await getGeoJSON();
  cache=geoJSONToMap(gj);
  return cache;
}
function draw(el,opt){
  const d=cache;if(!d)throw new Error('Map data has not loaded');
  el.innerHTML=`<svg viewBox="${d.viewBox}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="India map">`+
   Object.entries(d.groups).map(([id,ps])=>{const r=regionById(id);return `<g class="region" data-id="${id}" tabindex="0" role="button" aria-label="${r.en}">${ps.map(p=>`<path d="${p}" fill-rule="evenodd"/>`).join('')}</g>`}).join('')+`</svg>`;
  el.querySelectorAll('.region').forEach(g=>{
    g.addEventListener('click',()=>opt.onTap(g.dataset.id));
    g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();opt.onTap(g.dataset.id);}});
  });
  drawn=el;
}
function mark(id,cls){clear(cls);if(!drawn||!id)return;const g=drawn.querySelector(`.region[data-id="${id}"]`);if(g)g.classList.add(cls);}
function clear(cls){if(drawn)drawn.querySelectorAll('.region.'+cls).forEach(g=>g.classList.remove(cls));}
return{load,draw,mark,clear,info:()=>cache};
})();
