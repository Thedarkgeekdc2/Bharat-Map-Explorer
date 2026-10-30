/* Bharat Map Explorer — in-page content review form.
   Existing reviewTag() call sites are preserved. No backend/database is used:
   the form prepares a WhatsApp message for Mr DK, and the reviewer taps Send in WhatsApp. */
(function () {
  'use strict';

  // Keep the project's existing WhatsApp destination.
  window.WA_NUMBER = window.WA_NUMBER || '918126956997';

  const MODAL_ID = 'bmeReviewModal';
  const STYLE_ID = 'bmeReviewStyles';

  const TEXT = {
    en: {
      title: 'Review this content', subtitle: 'Check the details and share your feedback.',
      state: 'State / UT', category: 'Category', item: 'Content item', current: 'Current information',
      reviewer: 'Reviewer details', name: 'Name', designation: 'Designation', school: 'School name',
      required: 'Required', status: 'Review status', choose: 'Select review status', correct: 'Correct',
      correction: 'Needs correction', more: 'Needs more information', suggestions: 'Suggested correction / additional information',
      suggestionsHint: 'Please explain what should be corrected or added.', source: 'Reference source / official link (optional)',
      send: 'Send on WhatsApp', cancel: 'Cancel', close: 'Close review form',
      note: 'WhatsApp will open with the message prepared. Please tap Send in WhatsApp.',
      correctHint: 'You can add an optional note for this item.',
      correctionHint: 'Please add the correction or missing information.',
      statusCorrect: 'Correct', statusCorrection: 'Needs correction', statusMore: 'Needs more information',
      noValue: 'Not specified',
    },
    hi: {
      title: 'इस सामग्री की समीक्षा करें', subtitle: 'विवरण जाँचें और अपना सुझाव भेजें।',
      state: 'राज्य / केंद्रशासित प्रदेश', category: 'श्रेणी', item: 'सामग्री', current: 'वर्तमान जानकारी',
      reviewer: 'समीक्षक का विवरण', name: 'नाम', designation: 'पदनाम', school: 'विद्यालय का नाम',
      required: 'अनिवार्य', status: 'समीक्षा की स्थिति', choose: 'स्थिति चुनें', correct: 'सही है',
      correction: 'सुधार आवश्यक है', more: 'अधिक जानकारी आवश्यक है', suggestions: 'सुधार / अतिरिक्त जानकारी',
      suggestionsHint: 'कृपया बताएँ कि क्या सुधारना या जोड़ना चाहिए।', source: 'संदर्भ स्रोत / आधिकारिक लिंक (वैकल्पिक)',
      send: 'WhatsApp पर भेजें', cancel: 'रद्द करें', close: 'समीक्षा फ़ॉर्म बंद करें',
      note: 'WhatsApp में संदेश तैयार होकर खुलेगा। कृपया वहाँ Send दबाएँ।',
      correctHint: 'आप चाहें तो इस सामग्री पर अतिरिक्त टिप्पणी लिख सकते हैं।',
      correctionHint: 'कृपया सुधार या छूटी हुई जानकारी लिखें।',
      statusCorrect: 'सही है', statusCorrection: 'सुधार आवश्यक है', statusMore: 'अधिक जानकारी आवश्यक है',
      noValue: 'उल्लेख नहीं है',
    }
  };

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[ch]);
  }

  function cleanText(node) {
    if (!node) return '';
    const copy = node.cloneNode(true);
    copy.querySelectorAll('.rv, .ok, .spk, .source-link, button, input, select, textarea').forEach(n => n.remove());
    return (copy.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function labelWithoutParentheses(value) {
    return String(value || '').replace(/\s*\(.*?\)\s*/g, ' ').trim();
  }

  function getPayload(element) {
    try {
      return JSON.parse(decodeURIComponent(element.getAttribute('data-review-payload') || ''));
    } catch (_) {
      return { item: cleanText(element), state: '', lang: 'en' };
    }
  }

  function inferContext(element, payload) {
    const result = {
      state: String(payload.state || '').trim(),
      category: '',
      item: labelWithoutParentheses(payload.item || ''),
      current: ''
    };

    // State detail screen: use the category card heading.
    const categoryCard = element.closest('.cat');
    if (categoryCard) {
      const heading = categoryCard.querySelector('h4');
      if (heading) result.category = cleanText(heading);
      const description = categoryCard.querySelector('.langs');
      if (description) result.current = cleanText(description);
    }

    // Discover screen: its small label is formatted as "State · Category".
    const listItem = element.closest('li');
    const small = listItem && listItem.querySelector('small');
    if (small) {
      const parts = cleanText(small).split(/[·•]/).map(s => s.trim()).filter(Boolean);
      if (!result.state && parts.length) result.state = parts[0];
      if (!result.category && parts.length > 1) result.category = parts.slice(1).join(' · ');
    }

    // Learning screen: the fact label sits beside the review tag.
    const fact = element.closest('.facts li');
    if (!result.category && fact) {
      const label = fact.querySelector('span');
      if (label) result.category = cleanText(label);
    }
    if (!result.state) {
      const stateHeading = element.closest('.learn')?.querySelector('.lcard h3.big');
      if (stateHeading) result.state = cleanText(stateHeading);
    }

    // If a description is displayed beside this item, include it in the message.
    const row = element.closest('.it, .res li, .facts li');
    const desc = row && row.querySelector('.desc');
    if (desc) result.current = cleanText(desc);

    // Final fallback for state detail routes where a caller did not pass the state.
    if (!result.state) {
      const match = String(location.hash || '').match(/\/state\/([^/?]+)/);
      if (match && Array.isArray(window.REGIONS)) {
        const region = window.REGIONS.find(r => r && r.id === decodeURIComponent(match[1]));
        if (region) result.state = region.en || region.hi || '';
      }
    }

    return result;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${MODAL_ID}{position:fixed;inset:0;z-index:10050;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(9,18,43,.62);overflow:auto}
      #${MODAL_ID}[hidden]{display:none!important}
      #${MODAL_ID} .bme-rv-panel{position:relative;width:min(680px,100%);max-height:min(92vh,900px);overflow:auto;background:#fff;color:#17233f;border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.32);padding:clamp(18px,4vw,30px);font:inherit;line-height:1.45}
      #${MODAL_ID} .bme-rv-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin:0 0 6px}
      #${MODAL_ID} h2{margin:0;color:#1b3a8c;font-size:clamp(22px,4vw,29px);line-height:1.2}
      #${MODAL_ID} .bme-rv-sub{margin:0 0 18px;color:#526079;font-size:14px}
      #${MODAL_ID} .bme-rv-close{flex:0 0 auto;width:40px;height:40px;border:0;border-radius:12px;background:#eef2fa;color:#1b3a8c;font-size:25px;cursor:pointer;line-height:1}
      #${MODAL_ID} .bme-rv-context{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:14px 0 20px;padding:13px;background:#f2f6ff;border:1px solid #dce6fb;border-radius:14px}
      #${MODAL_ID} .bme-rv-context .wide{grid-column:1/-1}
      #${MODAL_ID} .bme-rv-context small{display:block;color:#526079;font-size:12px;font-weight:700;margin-bottom:2px}
      #${MODAL_ID} .bme-rv-context strong{display:block;overflow-wrap:anywhere;font-size:14px;color:#17233f;font-weight:750}
      #${MODAL_ID} .bme-rv-section{margin:16px 0 10px;font-weight:800;color:#1b3a8c;font-size:16px}
      #${MODAL_ID} .bme-rv-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
      #${MODAL_ID} .bme-rv-field{display:flex;flex-direction:column;gap:5px;min-width:0}
      #${MODAL_ID} .bme-rv-field.wide{grid-column:1/-1}
      #${MODAL_ID} label{font-size:14px;font-weight:750;color:#263654}
      #${MODAL_ID} .bme-rv-field input,#${MODAL_ID} .bme-rv-field select,#${MODAL_ID} .bme-rv-field textarea{display:block;width:100%;min-height:46px;border:2px solid #d5deed;border-radius:11px;background:#fff;color:#17233f;padding:10px 12px;font:inherit;font-size:15px;box-sizing:border-box}
      #${MODAL_ID} .bme-rv-field textarea{min-height:95px;resize:vertical}
      #${MODAL_ID} .bme-rv-field input:focus,#${MODAL_ID} .bme-rv-field select:focus,#${MODAL_ID} .bme-rv-field textarea:focus{outline:3px solid rgba(27,58,140,.16);border-color:#1b3a8c}
      #${MODAL_ID} .bme-rv-required{color:#b3261e}
      #${MODAL_ID} .bme-rv-note{margin:12px 0;color:#526079;font-size:13px}
      #${MODAL_ID} .bme-rv-actions{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:9px;margin-top:18px}
      #${MODAL_ID} .bme-rv-actions button{min-height:47px;padding:10px 17px;border:0;border-radius:12px;font:inherit;font-weight:800;cursor:pointer}
      #${MODAL_ID} .bme-rv-cancel{background:#edf0f6;color:#24334f}
      #${MODAL_ID} .bme-rv-send{background:#16834a;color:#fff}
      #${MODAL_ID} .bme-rv-send:hover{background:#106a3b}
      @media(max-width:520px){#${MODAL_ID}{padding:8px;align-items:flex-start}#${MODAL_ID} .bme-rv-panel{margin:auto 0;max-height:96vh;border-radius:16px;padding:17px}#${MODAL_ID} .bme-rv-context,#${MODAL_ID} .bme-rv-fields{grid-template-columns:1fr}#${MODAL_ID} .bme-rv-field.wide,#${MODAL_ID} .bme-rv-context .wide{grid-column:auto}#${MODAL_ID} .bme-rv-actions{flex-direction:column-reverse}#${MODAL_ID} .bme-rv-actions button{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function closeModal() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) modal.remove();
    if (window.__bmeReviewTrigger && window.__bmeReviewTrigger.isConnected) {
      window.__bmeReviewTrigger.focus({ preventScroll: true });
    }
    window.__bmeReviewTrigger = null;
  }

  function openReviewForm(element, payload) {
    ensureStyles();
    closeModal();
    window.__bmeReviewTrigger = element;

    const context = inferContext(element, payload);
    const lang = payload.lang === 'hi' ? 'hi' : 'en';
    const t = TEXT[lang];
    const dash = t.noValue;
    const contextCard = `
      <div class="bme-rv-context">
        <div><small>${t.state}</small><strong>${escapeHTML(context.state || dash)}</strong></div>
        <div><small>${t.category}</small><strong>${escapeHTML(context.category || dash)}</strong></div>
        <div class="wide"><small>${t.item}</small><strong>${escapeHTML(context.item || dash)}</strong></div>
        ${context.current ? `<div class="wide"><small>${t.current}</small><strong>${escapeHTML(context.current)}</strong></div>` : ''}
      </div>`;

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.setAttribute('role', 'presentation');
    modal.innerHTML = `
      <section class="bme-rv-panel" role="dialog" aria-modal="true" aria-labelledby="bmeRvTitle" aria-describedby="bmeRvNote">
        <div class="bme-rv-head"><h2 id="bmeRvTitle">${t.title}</h2><button type="button" class="bme-rv-close" data-rv-close aria-label="${t.close}" title="${t.close}">×</button></div>
        <p class="bme-rv-sub">${t.subtitle}</p>
        ${contextCard}
        <form id="bmeReviewForm">
          <div class="bme-rv-section">${t.reviewer}</div>
          <div class="bme-rv-fields">
            <div class="bme-rv-field"><label for="bmeRvName">${t.name} <span class="bme-rv-required">*</span></label><input id="bmeRvName" name="reviewerName" autocomplete="name" maxlength="120" required></div>
            <div class="bme-rv-field"><label for="bmeRvDesignation">${t.designation} <span class="bme-rv-required">*</span></label><input id="bmeRvDesignation" name="designation" autocomplete="organization-title" maxlength="120" required></div>
            <div class="bme-rv-field wide"><label for="bmeRvSchool">${t.school} <span class="bme-rv-required">*</span></label><input id="bmeRvSchool" name="schoolName" autocomplete="organization" maxlength="180" required></div>
          </div>
          <div class="bme-rv-section">${t.status}</div>
          <div class="bme-rv-fields">
            <div class="bme-rv-field wide"><label for="bmeRvStatus">${t.status} <span class="bme-rv-required">*</span></label><select id="bmeRvStatus" name="status" required>
              <option value="">${t.choose}</option>
              <option value="correct">${t.correct}</option>
              <option value="correction">${t.correction}</option>
              <option value="more">${t.more}</option>
            </select></div>
            <div class="bme-rv-field wide"><label for="bmeRvSuggestions">${t.suggestions}</label><textarea id="bmeRvSuggestions" name="suggestions" maxlength="1800" placeholder="${t.suggestionsHint}"></textarea><small id="bmeRvSuggestionHint" class="bme-rv-note">${t.correctHint}</small></div>
            <div class="bme-rv-field wide"><label for="bmeRvSource">${t.source}</label><input id="bmeRvSource" name="source" type="url" maxlength="500" placeholder="https://"></div>
          </div>
          <p id="bmeRvNote" class="bme-rv-note">${t.note}</p>
          <div class="bme-rv-actions"><button type="button" class="bme-rv-cancel" data-rv-close>${t.cancel}</button><button type="submit" class="bme-rv-send">${t.send}</button></div>
        </form>
      </section>`;

    modal.addEventListener('click', event => {
      if (event.target === modal || event.target.closest('[data-rv-close]')) closeModal();
    });

    const form = modal.querySelector('#bmeReviewForm');
    const status = modal.querySelector('#bmeRvStatus');
    const suggestions = modal.querySelector('#bmeRvSuggestions');
    const hint = modal.querySelector('#bmeRvSuggestionHint');
    function updateSuggestionRequirement() {
      const needsDetails = status.value === 'correction' || status.value === 'more';
      suggestions.required = needsDetails;
      hint.textContent = needsDetails ? t.correctionHint : t.correctHint;
    }
    status.addEventListener('change', updateSuggestionRequirement);

    form.addEventListener('submit', event => {
      event.preventDefault();
      updateSuggestionRequirement();
      if (!form.reportValidity()) return;

      const values = new FormData(form);
      const statusValue = String(values.get('status') || '');
      const statusLabel = statusValue === 'correct' ? 'Correct' : statusValue === 'correction' ? 'Needs correction' : 'Needs more information';
      const optionalText = (value, fallback) => String(value || '').trim() || fallback;
      const messageLines = [
        'BHARAT MAP EXPLORER — CONTENT REVIEW',
        '',
        'REVIEWER DETAILS',
        'Name: ' + String(values.get('reviewerName') || '').trim(),
        'Designation: ' + String(values.get('designation') || '').trim(),
        'School: ' + String(values.get('schoolName') || '').trim(),
        '',
        'CONTENT DETAILS',
        'State/UT: ' + optionalText(context.state, 'Not specified'),
        'Category: ' + optionalText(context.category, 'Not specified'),
        'Content item: ' + optionalText(context.item, 'Not specified'),
      ];
      if (context.current) messageLines.push('Current information: ' + context.current);
      messageLines.push('', 'REVIEW FEEDBACK', 'Status: ' + statusLabel);
      messageLines.push('Suggested correction/additional information: ' + optionalText(values.get('suggestions'), 'No additional suggestion'));
      messageLines.push('Reference source/official link: ' + optionalText(values.get('source'), 'Not provided'));
      messageLines.push('', 'Sent using the Bharat Map Explorer website review form.');

      const destination = String(window.WA_NUMBER || '').replace(/\D/g, '');
      if (!destination) {
        alert('WhatsApp destination is not configured. Please contact the website administrator.');
        return;
      }
      const whatsappURL = 'https://wa.me/' + destination + '?text=' + encodeURIComponent(messageLines.join('\n'));
      closeModal();
      // User gesture opens WhatsApp with a pre-filled message; WhatsApp itself requires Send.
      const waWindow = window.open(whatsappURL, '_blank');
      if (waWindow) waWindow.opener = null;
      else window.location.href = whatsappURL;
    });

    document.body.appendChild(modal);
    modal.querySelector('#bmeRvName').focus({ preventScroll: true });
  }

  // Preserve the public function used throughout card.js, discover.js and learn.js.
  window.reviewTag = function (x, stateName, lang) {
    const item = String((x && x.en) || '').trim();
    const key = typeof window.itemKey === 'function' ? window.itemKey(item) : item.toLowerCase();
    const reviewer = (window.REVIEWED || {})[key];
    const cleanReviewer = String(reviewer || '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
    if (reviewer) return ` <span class="dk ok">(${lang === 'hi' ? 'समीक्षक' : 'reviewed by'} ${cleanReviewer})</span>`;

    const payload = {
      item: labelWithoutParentheses(item),
      state: String(stateName || '').trim(),
      lang: lang === 'hi' ? 'hi' : 'en'
    };
    const encoded = encodeURIComponent(JSON.stringify(payload));
    const buttonLabel = lang === 'hi' ? 'समीक्षा' : 'Review';
    return ` <span class="dk rv" role="button" tabindex="0" aria-haspopup="dialog" aria-label="${buttonLabel}" data-review-payload="${encoded}">${buttonLabel}</span>`;
  };

  function openFromElement(element) {
    if (!element) return;
    const payload = getPayload(element);
    openReviewForm(element, payload);
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target && event.target.closest ? event.target.closest('.rv') : null;
    if (!trigger) return;
    event.preventDefault();
    event.stopPropagation();
    if (event.stopImmediatePropagation) event.stopImmediatePropagation();
    openFromElement(trigger);
  }, true);

  document.addEventListener('keydown', function (event) {
    const modal = document.getElementById(MODAL_ID);
    if (modal && event.key === 'Escape') {
      event.preventDefault();
      closeModal();
      return;
    }
    const trigger = event.target && event.target.closest ? event.target.closest('.rv') : null;
    if (trigger && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopPropagation();
      openFromElement(trigger);
    }
  }, true);
})();
