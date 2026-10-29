/* Bharat Map Explorer service worker: installable app and offline assets. */
const CACHE='__CACHE__',RUNTIME='bme-runtime',FILES=__FILES__;
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k!==RUNTIME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
const swr=(req,name)=>caches.open(name).then(async c=>{
  const hit=await c.match(req,{ignoreSearch:name===CACHE});
  const net=fetch(req).then(async r=>{if(r&&(r.ok||r.type==='opaque'))await c.put(req,r.clone());return r;}).catch(()=>hit);
  return hit||net;
});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(CACHE).then(c=>c.put('index.html',y));return x;}).catch(()=>caches.match('index.html',{ignoreSearch:true})));return;}
    e.respondWith(swr(r,CACHE));return;}
  if(u.hostname==='livingatlas.esri.in' && u.pathname.includes('/LivingAtlas/IND_AdminBoundary/MapServer/1/query') && u.searchParams.get('f')==='geojson'){e.respondWith(swr(r,RUNTIME));return;} // cache official India state polygons for offline use after first load
});
