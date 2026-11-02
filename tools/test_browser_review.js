/* npm install && npx playwright install chromium && npm run test:browser
   BME_MAP_FILE=/path/to/official.geojson uses a captured real service response.
   Otherwise uses clearly synthetic geometry ONLY for deterministic interaction tests. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;
const root=path.resolve(__dirname,'..');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{let f=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(f===root)f=path.join(root,'index.html');if(!f.startsWith(root+path.sep)){res.writeHead(403);return res.end();}fs.readFile(f,(err,data)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(err?'Not found':data);});});
let browser,passed=0;const check=(label)=>{passed++;console.log('PASS '+label);};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}/`;
 browser=await chromium.launch({headless:true});
 const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width:1440,height:900}}),page=await ctx.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 let mapRequests=0;
 await ctx.route('https://livingatlas.esri.in/**',async route=>{
  mapRequests++;
  let body;
  if(process.env.BME_MAP_FILE)body=fs.readFileSync(process.env.BME_MAP_FILE,'utf8');
  else body=await page.evaluate(()=>JSON.stringify({type:'FeatureCollection',features:REGIONS.map((r,i)=>({type:'Feature',properties:{state:r.en},geometry:{type:'Polygon',coordinates:[[[70+i%6,10+Math.floor(i/6)],[70.8+i%6,10+Math.floor(i/6)],[70.8+i%6,10.8+Math.floor(i/6)],[70+i%6,10.8+Math.floor(i/6)],[70+i%6,10+Math.floor(i/6)]]]}}))}));
  await route.fulfill({status:200,contentType:'application/geo+json',body});
 });
 const go=async route=>{await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(75);};
 await page.goto(base);await go('#/class/5');
 for(const lang of ['en','hi']){
  if(await page.locator('html').getAttribute('lang')!==lang)await page.locator('#langBtn').click();
  for(const route of ['#/home','#/class/5','#/mode/learn','#/mode/explore','#/mode/build','#/mode/quiz','#/discover/all','#/discover/dance','#/discover/languages','#/discover/calendar','#/state/andhra-pradesh','#/squiz/kerala','#/teacher','#/privacy','#/terms']){
   await go(route);assert.ok((await page.locator('#app').innerText()).trim());
  }
 }
 assert.deepEqual(errors,[]);check('30 route/language smoke checks without uncaught browser errors');
 if(await page.locator('html').getAttribute('lang')!=='en')await page.locator('#langBtn').click();
 await go('#/class/1');await go('#/mode/build');await page.waitForSelector('#bmap .region');
 await page.locator('#bskip').click();const placed=[];
 for(let i=0;i<6;i++){
  const name=await page.locator('#piece b').innerText();assert.ok(!placed.includes(name),'A placed puzzle piece repeated');placed.push(name);
  const id=await page.evaluate(name=>REGIONS.find(r=>r.en===name).id,name);
  await page.locator('#piece').focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('#piece').getAttribute('aria-pressed'),'true');
  await page.locator(`#bmap .region[data-id="${id}"]`).dispatchEvent('click');
  await page.waitForTimeout(1150);
 }
 assert.equal(await page.locator('#bmap .placed').count(),6);assert.ok((await page.locator('#piece').innerText()).includes('🎉'));check('Puzzle completes after skipping, with no repeated placed pieces and keyboard selection');
 await page.locator('#brest').click();
 let id=await page.evaluate(()=>REGIONS.find(r=>r.en===document.querySelector('#piece b').textContent).id);
 await page.locator('#piece').focus();await page.keyboard.press('Enter');await page.locator(`#bmap .region[data-id="${id}"]`).dispatchEvent('click');
 await page.locator('#brest').click();await page.waitForTimeout(1300);assert.equal(await page.locator('#bmap .placed').count(),0);assert.ok((await page.locator('#bmsg').innerText()).includes('(0/6)'));check('Restart invalidates delayed callbacks from the previous puzzle round');
 await go('#/mode/explore');await page.waitForSelector('#mapArea .region');await page.locator('#xsel').selectOption('kerala');assert.ok((await page.locator('#xbody').innerText()).includes('Kerala'));check('Map selection renders the requested state card');
 await go('#/mode/quiz');await page.locator('[data-g="capital"]').click();
 for(let i=0;i<5;i++){await page.locator('.opt').first().click();await page.locator('[data-a="next"]').click();}
 assert.ok((await page.locator('.score').innerText()).includes('/ 5'));check('Capital quiz reaches a scored result');
 await go('#/squiz/kerala');for(let i=0;i<5;i++){await page.locator('.opt').first().click();await page.locator('[data-q="next"]').click();}assert.ok((await page.locator('.score').innerText()).includes('/ 5'));check('State-card quiz completes');
 await go('#/discover/dance');await page.locator('#sq').fill('');assert.equal(await page.locator('.classical-card').count(),8);
 await go('#/discover/languages');assert.equal(await page.locator('.official-language-card').count(),22);check('Canonical dance and language lists render correctly');
 await go('#/class/5');await go('#/teacher');
 const auth=await page.evaluate(()=>TQ.CFG.auth);await page.locator('#lu').fill(auth.user);await page.locator('#lp').fill(auth.pass);await page.locator('#lf button[type="submit"]').click();
 await page.locator('[data-t="startBefore"]').click();await page.locator('[name="school"]').fill('Browser Test School');await page.locator('[name="students"]').fill('2');await page.locator('[name="mapShare"]').selectOption('0');await page.locator('[data-t="toWarn"]').click();
 await page.locator('#ack').check();await page.locator('[data-t="begin"]').click();await page.waitForSelector('[data-t="open"]');
 await page.locator('[data-t="open"][data-r="2"]').click();page.once('dialog',d=>d.accept());await page.locator('[data-t="absent"]').click();
 await page.locator('[data-t="open"][data-r="1"]').click();
 for(let i=0;i<10;i++){await page.locator('[data-t="ans"]').first().click();const next=page.locator('[data-t="nextq"]');if(await next.count())await next.click();else break;}
 await page.locator('[data-t="finishRoll"]').click();assert.ok((await page.locator('#app').innerText()).includes('completed'));check('Teacher setup, answer flow, absence and completion work in browser');
 await go('#/home');await page.evaluate(()=>{localStorage.setItem('bme.lang','broken');localStorage.setItem('bme.grade','NaN');});await page.reload();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.ok(await page.locator('.classes').count());assert.deepEqual(errors,[]);check('Corrupted stored preferences recover safely');
 await go('#/class/1.5');await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>location.hash),'#/home');check('Fractional class routes are rejected');
 await go('#/discover/dance');await page.locator('#skipMain').focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>location.hash),'#/discover/dance');assert.equal(await page.evaluate(()=>document.activeElement.id),'app');check('Skip navigation focuses main without changing the current route');
 const overflow=[];
 for(const width of [375,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['#/home','#/class/5','#/mode/explore','#/mode/build','#/discover/dance','#/discover/languages','#/privacy']){await go(route);if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))overflow.push({width,route});}
 }
 assert.deepEqual(overflow,[]);check('21 mobile/tablet/desktop layouts have no horizontal page overflow');
 const axe=[];
 for(const route of ['#/home','#/discover/dance','#/discover/languages','#/mode/explore','#/teacher']){
  await go(route);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  axe.push({route,violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length,examples:v.nodes.slice(0,3).map(n=>n.target)}))});
 }
 console.log('ACCESSIBILITY',JSON.stringify(axe));assert.ok(axe.every(x=>x.violations.length===0),'Automated accessibility findings remain');check('Five sampled screens pass automated WCAG A/AA checks (not a full accessibility certification)');
 if(process.env.BME_ARTIFACTS){fs.mkdirSync(process.env.BME_ARTIFACTS,{recursive:true});await go('#/mode/explore');await page.locator('#xsel').selectOption('kerala');await page.screenshot({path:path.join(process.env.BME_ARTIFACTS,'review-desktop.png'),fullPage:true});await page.setViewportSize({width:390,height:844});await go('#/home');await page.screenshot({path:path.join(process.env.BME_ARTIFACTS,'review-mobile.png'),fullPage:true});fs.writeFileSync(path.join(process.env.BME_ARTIFACTS,'accessibility-results.json'),JSON.stringify(axe,null,2));}
 await page.evaluate(()=>{document.querySelector('#langBtn').focus();const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=async()=>{};e.userChoice=Promise.resolve({outcome:'dismissed'});window.dispatchEvent(e);});
 await page.waitForSelector('#pwaPop');assert.equal(await page.locator('#pwaPop').getAttribute('aria-labelledby'),'pwaTitle');assert.ok(await page.evaluate(()=>document.querySelector('#pwaPop').contains(document.activeElement)));await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'pwaNo');await page.keyboard.press('Escape');assert.equal(await page.locator('#pwaPop').count(),0);assert.equal(await page.evaluate(()=>document.activeElement.id),'langBtn');check('Install dialog is named, traps focus, closes with Escape and restores focus');
 await ctx.route('https://livingatlas.esri.in/**',route=>route.abort());await go('#/mode/explore');await page.reload();await page.waitForSelector('#mapArea .region');assert.equal(await page.locator('#mapArea .region').count(),36);check('Validated local map fallback survives a network failure and reload');
 await ctx.close();
 // Use the real service worker: cache isolation, cold install, offline revisit.
 const swctx=await browser.newContext(),swpage=await swctx.newPage();
 await swpage.goto(base);await swpage.evaluate(async()=>{await caches.open('unrelated-site-cache');await navigator.serviceWorker.ready;});
 await swpage.waitForFunction(()=>!!navigator.serviceWorker.controller);
 assert.ok(await swpage.evaluate(async()=>(await caches.keys()).includes('unrelated-site-cache')));check('Service-worker activation preserves unrelated origin caches');
 await swctx.setOffline(true);await swpage.reload();assert.ok(await swpage.locator('.classes').count());await swpage.locator('.c1').click();await swpage.waitForSelector('.modes');assert.ok(await swpage.locator('.modes').count());check('Installed app shell and class navigation work offline');
 await swctx.close();assert.deepEqual(errors,[]);console.log(`\n${passed} browser groups passed. Map data: ${process.env.BME_MAP_FILE?'recorded official service geometry':'synthetic test-only geometry'}; map requests: ${mapRequests}.`);
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
