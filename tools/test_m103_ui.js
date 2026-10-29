/* M10.3 regression checks. Run from the Bharat_Map_Explorer directory: node tools/test_m103_ui.js */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

global.window = global;
global.itemKey = s => String(s || '').toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
global.esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
global.thumb = () => '';
global.spk = () => '';
global.reviewTag = () => '<span class="rv">Review</span>';
global.descOf = x => x && x.d;

const scripts = [
  'js/data/regions.js', 'js/data/capitals.js', 'js/data/cards.js',
  'js/data/cards-dk.js', 'js/data/languages.js', 'js/data/classical-dances.js',
  'js/data/official-languages.js', 'js/data/info.js', 'js/card.js', 'js/discover.js'
];
for (const file of scripts) vm.runInThisContext(fs.readFileSync(file, 'utf8'), { filename: file });

const labels = {
  catDance:'Classical dance', catFolk:'Folk / traditional art', catFestival:'Festival',
  catFood:'Food', catPlace:'Place', catAnimal:'Animal', catLanguage:'Language',
  catOffLang:'Official language', languages:'Language', offLang:'Official language',
  capital:'Capital', dances:'Dance', classicalTag:'classical', sources:'sources', playQuiz:'Play Quiz'
};
const t = key => labels[key] || key;
const month = new Date().getMonth() + 1;
const dance = DISCOVER.search('', 'dance', 'en', t, month);
const scheduled = DISCOVER.search('', 'languages', 'en', t, month);
const expected = ['Bharatanatyam','Kathak','Kathakali','Kuchipudi','Manipuri','Mohiniyattam','Odissi','Sattriya'];
assert.equal(dance.length, 8, 'Classical Dance view should contain exactly eight forms');
assert.deepEqual(dance.map(x => x.en), expected, 'Classical Dance forms should be in the intended order');
assert.ok(dance.every(x => x.r && x.detail && x.detailHi), 'Every classical dance needs a state and bilingual description');
assert.equal(scheduled.length, 22, 'Official language view should contain exactly 22 Eighth Schedule languages');
assert.equal(new Set(scheduled.map(x => x.en)).size, 22, 'Scheduled-language list should contain no duplicates');
const andhra = regionById('andhra-pradesh');
const card = renderCard(andhra, { t, esc, lang:'en' });
assert.ok(card.includes('Language'), 'State card should have the Language section');
assert.ok(!card.includes('Official language'), 'State card should not show a second Official language section');
console.log('M10.3 UI regression tests: PASS');
console.log(`Regions: ${REGIONS.length}; classical dances: ${dance.length}; scheduled languages: ${scheduled.length}`);
