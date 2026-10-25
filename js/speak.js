/* MODULE 6 — Audio: reads names aloud with the device's own voices (Web Speech). Works offline if the device has the voice installed. */
(function(){
const ok='speechSynthesis' in window&&'SpeechSynthesisUtterance' in window;
if(!ok&&document.documentElement&&document.documentElement.classList)document.documentElement.classList.add('nospeech');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
window.spk=text=>ok?`<button class="spk" type="button" data-say="${esc(text.replace(/\s*\(.*?\)\s*/g,' ').trim())}" aria-label="Listen">🔊</button>`:'';
function toast(m){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>{t.hidden=true;},3500);}
window.say=text=>{if(!ok)return;const hi=/[\u0900-\u097F]/.test(text),tag=hi?'hi-IN':'en-IN';speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang=tag;u.rate=.85;const vs=speechSynthesis.getVoices();
  const v=vs.find(x=>x.lang===tag)||vs.find(x=>x.lang.toLowerCase().startsWith(tag.slice(0,2)));if(v)u.voice=v;
  else if(vs.length&&hi)toast(I18N[document.documentElement.lang==='hi'?'hi':'en'].noVoice);
  speechSynthesis.speak(u);};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.spk');if(b){e.preventDefault();e.stopPropagation();say(b.dataset.say);}},true);
})();
