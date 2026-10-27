/* Install the app: registers the service worker and shows an "Install" pop-up (Chrome / Edge / Android panel browsers)
   or Add-to-Home-Screen steps (iPhone / iPad Safari). Needs https (GitHub Pages is fine) or localhost. */
(function(){
  const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
  const T=k=>I18N[document.documentElement.lang==='hi'?'hi':'en'][k];
  const ok=location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1';
  if('serviceWorker' in navigator&&ok)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
  let dp=null;const seen=()=>{try{return sessionStorage.getItem('bme.pwa')==='1';}catch(e){return false;}},mark=()=>{try{sessionStorage.setItem('bme.pwa','1');}catch(e){}};
  const foot=()=>document.getElementById('pwaBtn');
  function close(){const p=document.getElementById('pwaPop');if(p)p.remove();mark();}
  function popup(ios){if(document.getElementById('pwaPop')||standalone())return;const d=document.createElement('div');d.id='pwaPop';d.className='pwapop';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
    d.innerHTML=`<div class="pwabox"><img src="icons/icon-192.png" alt="" width="84" height="84"><div><h3>${T('pwaTitle')}</h3><p>${ios?T('pwaIos'):T('pwaText')}</p>
      <div class="pwabtns">${ios?'':`<button class="act" id="pwaYes">📲 ${T('pwaInstall')}</button>`}<button class="tb2" id="pwaNo">${ios?T('pwaOk'):T('pwaLater')}</button></div></div></div>`;
    document.body.appendChild(d);document.getElementById('pwaNo').onclick=close;
    const y=document.getElementById('pwaYes');if(y)y.onclick=install;}
  async function install(){if(!dp){close();return;}close();dp.prompt();try{await dp.userChoice;}catch(e){}dp=null;if(foot())foot().hidden=true;}
  addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;if(foot())foot().hidden=false;if(!standalone()&&!seen())setTimeout(()=>popup(false),700);});
  addEventListener('appinstalled',()=>{dp=null;close();if(foot())foot().hidden=true;});
  addEventListener('DOMContentLoaded',()=>{const b=foot();if(b){b.textContent='📲 '+T('pwaInstall');b.onclick=()=>{if(dp)install();else popup(true);};}
    const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!standalone();if(ios){if(b){b.hidden=false;}if(!seen())setTimeout(()=>popup(true),1500);}});
  window.addEventListener('hashchange',()=>{const b=foot();if(b&&!b.hidden)b.textContent='📲 '+T('pwaInstall');});
})();
