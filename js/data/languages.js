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
/* Official language(s) of each State / UT. Sources found were exam-preparation sites and state-law summaries, not one official table,
   so every entry shows a Review button. Sikkim differs between sources. Ladakh and Puducherry are left empty until a reliable list is found. */
const O=`andhra-pradesh|Telugu|तेलुगु
arunachal-pradesh|English|अंग्रेज़ी
assam|Assamese;Bengali (Barak Valley);Bodo (Bodoland)|असमिया;बांग्ला (बराक घाटी);बोड़ो (बोडोलैंड)
bihar|Hindi;Urdu|हिंदी;उर्दू
chhattisgarh|Hindi|हिंदी
goa|Konkani;Marathi|कोंकणी;मराठी
gujarat|Gujarati;Hindi|गुजराती;हिंदी
haryana|Hindi;Punjabi|हिंदी;पंजाबी
himachal-pradesh|Hindi|हिंदी
jharkhand|Hindi;Urdu|हिंदी;उर्दू
karnataka|Kannada|कन्नड़
kerala|Malayalam|मलयालम
madhya-pradesh|Hindi|हिंदी
maharashtra|Marathi|मराठी
manipur|Manipuri (Meiteilon);English|मणिपुरी (मैतेई);अंग्रेज़ी
meghalaya|English;Khasi;Garo|अंग्रेज़ी;खासी;गारो
mizoram|Mizo;English;Hindi|मिजो;अंग्रेज़ी;हिंदी
nagaland|English|अंग्रेज़ी
odisha|Odia|ओड़िया
punjab|Punjabi|पंजाबी
rajasthan|Hindi|हिंदी
sikkim|English;Nepali;Sikkimese;Lepcha|अंग्रेज़ी;नेपाली;सिक्किमी;लेपचा
tamil-nadu|Tamil|तमिल
telangana|Telugu;Urdu|तेलुगु;उर्दू
tripura|Bengali;Kokborok|बांग्ला;कोकबोरोक
uttar-pradesh|Hindi;Urdu|हिंदी;उर्दू
uttarakhand|Hindi;Sanskrit|हिंदी;संस्कृत
west-bengal|Bengali|बांग्ला
delhi|Hindi;Punjabi;Urdu|हिंदी;पंजाबी;उर्दू
chandigarh|English|अंग्रेज़ी
lakshadweep|Malayalam;English|मलयालम;अंग्रेज़ी
dadra-and-nagar-haveli-and-daman-and-diu|Gujarati;Marathi;Konkani;Hindi|गुजराती;मराठी;कोंकणी;हिंदी
andaman-and-nicobar-islands|Hindi;English|हिंदी;अंग्रेज़ी
jammu-and-kashmir|Urdu;Hindi;English;Kashmiri;Dogri|उर्दू;हिंदी;अंग्रेज़ी;कश्मीरी;डोगरी`;
O.split('\n').forEach(l=>{const [id,e,h]=l.split('|');if(window.CONTENT[id])window.CONTENT[id].off={en:e.split(';'),hi:h.split(';')};});
})();
