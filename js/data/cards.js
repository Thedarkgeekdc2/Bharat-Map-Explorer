/* MODULE 2 data, ONLY items checked against official sources. One line per place: id | classical dance | dance traditions | festivals and traditions | official State Animal | famous places.
   Sources: Wildlife Institute of India / MoEFCC (2017) for State Animal; UNESCO World Heritage and Intangible Heritage lists; Sangeet Natak Akademi (8 classical dances); Govt of Assam (Bihu).
   Foods are not shown until an official source is checked. Add an item here only after it is verified.
   Classical = only the 8 Sangeet Natak Akademi dances. "Official State Animal" is NOT set here (needs source check); animals are Notable Wildlife.
   West Bengal has a fuller card in content.js. Items are English; Hindi item names come in MODULE 6. */
(function(){
const D=`andhra-pradesh|Kuchipudi|||Blackbuck|Nagarjunsagar-Srisailam Tiger Reserve
arunachal-pradesh||||Hoolock gibbon|Namdapha Tiger Reserve
assam|Sattriya|Bihu dance (State Dance, Govt of Assam)|Bihu (State Festival, Govt of Assam)|One-horned rhinoceros|Kaziranga National Park;Manas National Park;Moidams of the Ahom dynasty (UNESCO, 2024)
bihar||||Gaur (Indian bison)|Mahabodhi Temple, Bodh Gaya (UNESCO);Nalanda Mahavihara (UNESCO)
chhattisgarh||||Wild buffalo|Indravati Tiger Reserve;Achanakmar Tiger Reserve
delhi|||||Red Fort Complex (UNESCO);Qutb Minar (UNESCO);Humayun's Tomb (UNESCO)
goa||||Gaur (Indian bison)|Churches and Convents of Goa (UNESCO)
gujarat||Garba (UNESCO list, 2023)||Asiatic lion|Rani-ki-Vav (UNESCO);Champaner-Pavagadh (UNESCO);Historic City of Ahmedabad (UNESCO);Dholavira (UNESCO)
haryana||||Blackbuck|
himachal-pradesh||||Snow leopard|Great Himalayan National Park (UNESCO);Kalka-Shimla Railway (UNESCO)
jharkhand||Chhau (UNESCO list, 2010)||Asian elephant|Palamau Tiger Reserve
jammu-and-kashmir||||Hangul (Kashmir stag)|Hokera Wetland (Ramsar site)
karnataka|||||Hampi (UNESCO);Pattadakal (UNESCO);Hoysala temples (UNESCO)
kerala|Kathakali;Mohiniyattam|Mudiyettu (UNESCO list, 2010);Kutiyattam (UNESCO list, 2008)||Asian elephant|Western Ghats (UNESCO, shared with other states)
madhya-pradesh||||Hard-ground barasingha|Sanchi (UNESCO);Khajuraho (UNESCO);Bhimbetka (UNESCO)
maharashtra||||Indian giant squirrel|Ajanta Caves (UNESCO);Ellora Caves (UNESCO);Elephanta Caves (UNESCO);Chhatrapati Shivaji Maharaj Terminus (UNESCO);Maratha Military Landscapes (UNESCO, 2025)
manipur|Manipuri|Sankirtana (UNESCO list, 2013)||Sangai (brow-antlered deer)|Keibul Lamjao National Park
meghalaya||||Clouded leopard|Nokrek Biosphere Reserve
mizoram||||Serow|Dampa Tiger Reserve
nagaland||||Mithun|
odisha|Odissi|Chhau (UNESCO list, 2010)||Sambar|Konark Sun Temple (UNESCO);Simlipal Biosphere Reserve
punjab||||Blackbuck|Brass and copper craft of Jandiala Guru (UNESCO list, 2014)
rajasthan||Kalbelia (UNESCO list, 2010)||Chinkara|Keoladeo National Park (UNESCO);Jantar Mantar, Jaipur (UNESCO);Hill Forts of Rajasthan (UNESCO)
sikkim||||Red panda|Khangchendzonga National Park (UNESCO)
tamil-nadu|Bharatanatyam|||Nilgiri tahr|Great Living Chola Temples (UNESCO);Mahabalipuram monuments (UNESCO);Nilgiri Mountain Railway (UNESCO)
telangana||||Spotted deer (chital)|Ramappa Temple (UNESCO)
tripura||||Phayre's langur|
uttar-pradesh|Kathak||Kumbh Mela (UNESCO list, 2017)|Swamp deer (barasingha)|Taj Mahal (UNESCO);Agra Fort (UNESCO);Fatehpur Sikri (UNESCO)
uttarakhand|||Ramman festival of Garhwal (UNESCO list, 2009)|Himalayan musk deer|Nanda Devi and Valley of Flowers National Parks (UNESCO)
west-bengal||Chhau of Purulia (UNESCO list, 2010)|Durga Puja in Kolkata (UNESCO list, 2021)|Fishing cat|Sundarbans National Park (UNESCO);Santiniketan (UNESCO);Darjeeling Himalayan Railway (UNESCO)
andaman-and-nicobar-islands||||Dugong|Great Nicobar Biosphere Reserve
chandigarh|||||Capitol Complex (UNESCO)
dadra-and-nagar-haveli-and-daman-and-diu||||Four-horned antelope (chowsingha), listed for Dadra and Nagar Haveli|
ladakh|||Buddhist chanting of Ladakh (UNESCO list, 2012)||Tsomoriri Wetland (Ramsar site)
lakshadweep||||Butterfly fish|
puducherry||||Three-striped palm squirrel|`;
const split=s=>(s||'').split(';').map(x=>x.trim()).filter(Boolean).map(en=>({en}));
window.CONTENT={};
D.split('\n').forEach(line=>{
  const [id,cl,dt,fe,an,fa]=line.split('|');
  window.CONTENT[id]={classical:split(cl),traditions:split(dt),festivals:split(fe),animal:split(an)[0]||null,famous:split(fa)};
});
/* Foods verified in the Govt of India Geographical Indications Registry list (ipindia.gov.in) */
const F={'andhra-pradesh':'Tirupati Laddu (GI tag, Govt of India)','karnataka':'Dharwad Pedha (GI tag, Govt of India)','rajasthan':'Bikaneri Bhujia (GI tag, Govt of India)','telangana':'Hyderabad Haleem (GI tag, Govt of India)'};
Object.keys(CONTENT).forEach(id=>{CONTENT[id].foods=F[id]?[{en:F[id]}]:[];});
/* Festivals verified on official pages: Ministry of Tourism UTSAV portal + Kerala Tourism (Onam); Govt of Nagaland Tourism + UTSAV + PIB (Hornbill) */
CONTENT['kerala'].festivals.push({en:'Onam (Ministry of Tourism UTSAV; Kerala Tourism)'});
CONTENT['nagaland'].festivals.push({en:'Hornbill Festival (Govt of Nagaland; UTSAV)'});
})();
