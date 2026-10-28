/* Languages spoken in the 28 states (from a school reference list; NOT yet matched to an official source, so each card shows a Review button).
   id | English names | Hindi names (same order). Add the 8 Union Territories here when you have a list. */
(function(){
const D=`andhra-pradesh|Telugu;Urdu|तेलुगु;उर्दू
arunachal-pradesh|Nyishi;Adi;Monpa;Hindi;English|न्यीशी;आदि;मोनपा;हिंदी;अंग्रेज़ी
assam|Assamese;Bengali;Bodo|असमिया;बांग्ला;बोड़ो
bihar|Hindi;Bhojpuri;Maithili;Magahi;Urdu|हिंदी;भोजपुरी;मैथिली;मगही;उर्दू
chhattisgarh|Chhattisgarhi;Hindi;Gondi|छत्तीसगढ़ी;हिंदी;गोंडी
goa|Konkani;Marathi|कोंकणी;मराठी
gujarat|Gujarati;Hindi;Kutchi|गुजराती;हिंदी;कच्छी
haryana|Hindi;Haryanvi;Punjabi|हिंदी;हरियाणवी;पंजाबी
himachal-pradesh|Hindi;Pahari languages|हिंदी;पहाड़ी भाषाएँ
jharkhand|Hindi;Santali;Nagpuri;Khortha;Kurukh|हिंदी;संथाली;नागपुरी;खोरठा;कुरुख
karnataka|Kannada;Tulu;Konkani;Urdu|कन्नड़;तुलु;कोंकणी;उर्दू
kerala|Malayalam;Tamil|मलयालम;तमिल
madhya-pradesh|Hindi;Bundeli;Bagheli;Malvi|हिंदी;बुंदेली;बघेली;मालवी
maharashtra|Marathi;Hindi;Urdu|मराठी;हिंदी;उर्दू
manipur|Manipuri (Meitei);Various tribal languages|मणिपुरी (मैतेई);विभिन्न जनजातीय भाषाएँ
meghalaya|Khasi;Garo;English|खासी;गारो;अंग्रेज़ी
mizoram|Mizo;English|मिजो;अंग्रेज़ी
nagaland|English;Nagamese;Various Naga languages|अंग्रेज़ी;नागामीज़;विभिन्न नागा भाषाएँ
odisha|Odia;Santali|ओड़िया;संथाली
punjab|Punjabi;Hindi|पंजाबी;हिंदी
rajasthan|Hindi;Various Rajasthani dialects|हिंदी;राजस्थानी की विभिन्न बोलियाँ
sikkim|Nepali;Bhutia;Lepcha|नेपाली;भूटिया;लेपचा
tamil-nadu|Tamil|तमिल
telangana|Telugu;Urdu|तेलुगु;उर्दू
tripura|Bengali;Kokborok|बांग्ला;कोकबोरोक
uttar-pradesh|Hindi;Urdu;Bhojpuri;Awadhi;Braj|हिंदी;उर्दू;भोजपुरी;अवधी;ब्रज
uttarakhand|Hindi;Garhwali;Kumaoni|हिंदी;गढ़वाली;कुमाऊँनी
west-bengal|Bengali;Nepali;Hindi;Santali;Urdu|बांग्ला;नेपाली;हिंदी;संथाली;उर्दू`;
D.split('\n').forEach(l=>{const [id,e,h]=l.split('|');if(window.CONTENT[id])window.CONTENT[id].langs={en:e.split(';'),hi:h.split(';')};});
})();
