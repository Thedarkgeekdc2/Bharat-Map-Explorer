/* M10.4 legal-page/footer regression checks. Run from the project directory:
   node tools/test_m104_legal.js */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const elements = {};
const elementIds = [
  'app', 'backBtn', 'brandName', 'langBtn', 'footNote', 'gradeBadge',
  'footTagline', 'footProjectLabel', 'footBoundary', 'footPrivacy',
  'footPrivacyDesc', 'footTerms', 'footTermsDesc', 'footCopyright', 'footNav'
];
for (const id of elementIds) {
  elements[id] = {
    id, hidden: false, textContent: '', innerHTML: '',
    setAttribute(name, value) { this[name] = value; },
    focus() {}, classList: { toggle() {} }
  };
}

const listeners = {};
const document = {
  title: '',
  body: { classList: { toggle() {} } },
  documentElement: { lang: 'en' },
  getElementById(id) {
    if (!elements[id]) elements[id] = { id, hidden: false, textContent: '', innerHTML: '', setAttribute() {}, focus() {} };
    return elements[id];
  }
};
const location = { hash: '#/privacy' };
const sandbox = {
  console, document, location,
  history: { length: 1, back() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  sessionStorage: { getItem() { return null; }, setItem() {} },
  addEventListener(name, callback) { listeners[name] = callback; },
  scrollTo() {}
};
sandbox.window = sandbox;
vm.createContext(sandbox);

for (const file of ['js/i18n.js', 'js/legal.js', 'js/app.js']) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}

assert.match(elements.app.innerHTML, /Privacy Policy/);
assert.match(elements.app.innerHTML, /What stays on your own device/);
assert.match(elements.app.innerHTML, /Children/);
assert.equal(elements.backBtn.hidden, false);
assert.equal(document.title, 'Bharat Map Explorer | Privacy Policy');
assert.equal(elements.footPrivacy.textContent, 'Privacy Policy');
assert.equal(elements.footTerms.textContent, 'Terms & Conditions');

location.hash = '#/terms';
listeners.hashchange();
assert.match(elements.app.innerHTML, /Terms &amp; Conditions/);
assert.match(elements.app.innerHTML, /Independent project/);
assert.match(elements.app.innerHTML, /Limit of responsibility/);
assert.equal(document.title, 'Bharat Map Explorer | Terms & Conditions');

// The app language toggle translates footer labels while keeping legal pages available.
elements.langBtn.onclick();
assert.equal(elements.footPrivacy.textContent, 'गोपनीयता नीति');
assert.equal(elements.footTerms.textContent, 'नियम एवं शर्तें');
assert.equal(document.documentElement.lang, 'hi');
assert.match(elements.app.innerHTML, /Terms &amp; Conditions/);

elements.backBtn.onclick();
assert.equal(location.hash, '#/home');

const html = fs.readFileSync('index.html', 'utf8');
assert.match(html, /href="#\/privacy"/);
assert.match(html, /href="#\/terms"/);
assert.ok(html.indexOf('js/legal.js?v=m10.4') < html.indexOf('js/app.js?v=m10.4'));
assert.ok(fs.readFileSync('sw.js', 'utf8').includes('"js/legal.js"'));

console.log('M10.4 legal pages, routing, footer language toggle and offline asset checks: PASS');
