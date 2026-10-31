/* Review button: items without an official source show "Review". A teacher can check the fact and send a screenshot to Mr DK on WhatsApp.
   After the review the item is listed in js/data/reviewed.js and shows "(reviewed by <teacher name>)". */
window.WA_NUMBER='918126956997';
window.reviewTag=function(x,stateName,lang){
  const k=itemKey(x.en),who=(window.REVIEWED||{})[k];
  if(who)return ` <span class="dk ok">(${lang==='hi'?'समीक्षक':'reviewed by'} ${String(who).replace(/[&<>"]/g,'')})</span>`;
  const msg=`Review request - Bharat Map Explorer\nState/UT: ${stateName||''}\nItem: ${lab(x.en)}\nMy name: \n(I am attaching a screenshot.)`;
  const url='https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(msg);
  return ` <span class="dk rv" role="link" tabindex="0" data-url="${url}">${lang==='hi'?'समीक्षा':'Review'}</span>`;
};
function lab(s){return String(s).replace(/\s*\(.*?\)\s*/g,' ').trim();}
function go(el){window.open(el.dataset.url,'_blank','noopener');}
document.addEventListener('click',e=>{const s=e.target.closest&&e.target.closest('.rv');if(s){e.preventDefault();e.stopPropagation();go(s);}},true);
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList&&e.target.classList.contains('rv')){e.preventDefault();go(e.target);}},true);
