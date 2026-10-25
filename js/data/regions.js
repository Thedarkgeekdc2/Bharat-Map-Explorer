/* Reusable region data — 28 States + 8 Union Territories.
   MODULE 1 fills mapId (links to map shape). MODULE 2 fills capital + content after verification.
   verified:false until a source is checked. */
(function(){
const S=[
['Andhra Pradesh','आंध्र प्रदेश'],['Arunachal Pradesh','अरुणाचल प्रदेश'],['Assam','असम'],['Bihar','बिहार'],
['Chhattisgarh','छत्तीसगढ़'],['Goa','गोवा'],['Gujarat','गुजरात'],['Haryana','हरियाणा'],
['Himachal Pradesh','हिमाचल प्रदेश'],['Jharkhand','झारखंड'],['Karnataka','कर्नाटक'],['Kerala','केरल'],
['Madhya Pradesh','मध्य प्रदेश'],['Maharashtra','महाराष्ट्र'],['Manipur','मणिपुर'],['Meghalaya','मेघालय'],
['Mizoram','मिजोरम'],['Nagaland','नागालैंड'],['Odisha','ओडिशा'],['Punjab','पंजाब'],['Rajasthan','राजस्थान'],
['Sikkim','सिक्किम'],['Tamil Nadu','तमिलनाडु'],['Telangana','तेलंगाना'],['Tripura','त्रिपुरा'],
['Uttar Pradesh','उत्तर प्रदेश'],['Uttarakhand','उत्तराखंड'],['West Bengal','पश्चिम बंगाल']];
const U=[
['Andaman and Nicobar Islands','अंडमान और निकोबार द्वीपसमूह'],['Chandigarh','चंडीगढ़'],
['Dadra and Nagar Haveli and Daman and Diu','दादरा और नगर हवेली तथा दमन और दीव'],['Delhi','दिल्ली'],
['Jammu and Kashmir','जम्मू और कश्मीर'],['Ladakh','लद्दाख'],['Lakshadweep','लक्षद्वीप'],['Puducherry','पुडुचेरी']];
const mk=(type)=>([en,hi])=>({id:en.toLowerCase().replace(/[^a-z]+/g,'-'),en,hi,type,mapId:null,capital:null,content:null,verified:false});
window.REGIONS=[...S.map(mk('state')),...U.map(mk('ut'))];
window.regionById=id=>REGIONS.find(r=>r.id===id)||null;
})();
