/* Bharat Map Explorer service worker: installable app and offline assets. */
const CACHE='bme-m10-3',RUNTIME='bme-runtime',FILES=["./", "index.html", "manifest.webmanifest", "css/style.css", "js/app.js", "js/build.js", "js/card.js", "js/discover.js", "js/explore.js", "js/i18n.js", "js/learn.js", "js/modules.js", "js/pwa.js", "js/quiz.js", "js/review.js", "js/speak.js", "js/statequiz.js", "js/teacher.js", "js/thelp.js", "js/tq.js", "js/xlsx.js", "js/data/capitals.js", "js/data/cards-dk.js", "js/data/cards.js", "js/data/classical-dances.js", "js/data/hi.js", "js/data/info.js", "js/data/languages.js", "js/data/official-languages.js", "js/data/regions.js", "js/data/reviewed.js", "js/map/india-data.js", "js/map/map.js", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/favicon-64.png", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png"];
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
