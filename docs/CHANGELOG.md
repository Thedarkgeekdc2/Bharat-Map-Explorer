# Changelog
## M9d — final panel layout + Official language
- **Layout for Interactive Panels and laptops (1920x1080) and the 4K Ultra HD panel (3840x2160):** slimmer header and heading, map moved left, details box about two thirds of the screen. In Explore the text size adjusts itself to the largest size that fits the box (about 18–36 px on 1920x1080, 54–72 px on 4K), so no scrolling for the states tested. Learn resizes its card the same way. The long sources line is hidden on panels (the footer already says it).
- **Official language** section in every state's details (and 6 Union Territories) next to **Languages**. Both appear in a new **Discover → Languages** tab (and in All search), plus a Languages button on Home. Facts from the Constitution (Articles 343 and 345, Eighth Schedule: 22 languages) are shown at the top. State-wise lists carry a Review button because no single official table was found.

## M9c — Languages
- New **Languages** section in each state's details (28 states, English and Hindi) and language names searchable in Discover → All. Shown with a Review button because the list is not yet matched to an official source. The 8 Union Territories have no list yet.

## M9b — bigger details box for Interactive Panels
- On big screens (panels, 1200x640 and above) Explore and Learn now use the **whole screen**: no empty space on the right or bottom, map about one third, **details box about two thirds** with balanced columns and larger text. Phones and tablets are unchanged.
- The state picker stays at the top; only the details list scrolls inside its box when a state has a lot of content.

## M9 — installable app (PWA)
- The website can be **installed** on Interactive Panels, phones and laptops, with your poster as the app icon (192, 512, maskable, Apple touch icon, favicons).
- An **Install pop-up** (English / Hindi) appears when the browser allows installing; "Not now" hides it for the visit; a footer **Install app** button stays available. iPhone/iPad Safari shows the Add to Home Screen steps.
- **Works offline** after the first visit (app files and, once opened, the India map data are cached). Opens full-screen like an app.
- Files: `manifest.webmanifest`, `sw.js`, `js/pwa.js`, `icons/`, `tools/build_sw.py`, `docs/INSTALL_GUIDE.md`.

## M8 — final publish version
- **Panel layout:** Explore and Learn show the map beside the state's details (capital, dance, festivals, foods, animal, places) and the state quiz, so a panel screen shows everything at once without scrolling. Pick a state on the map or from the list. Narrow screens still stack.
- **Review button** replaces "(reviewed by DK)": opens WhatsApp to Mr DK with a prefilled message; once reviewed the credit shows "(reviewed by <teacher name>)" (`js/data/reviewed.js`).
- **Home note** above the footer explains the review process (English and Hindi) with the WhatsApp number.
- **Footer:** Build/prototype wording removed; credit now links to the GitHub portfolio.
- Security wording removed from the login page and Help page (kept only in `docs/DEVELOPER_NOTES.md`).

## M7d (build M7d-teacher)
- **Resume from backup JSON** is now on the BEFORE setup page and on the AFTER import page (also still on Teacher Corner home). Wrong file kind gets a clear message.
- A reminder to download a progress backup appears after every 10 completed rolls; help page and guide explain how to split a big class over several sittings.
- Fixed: after one session, "Next roll number" could skip Roll 1 and start from the old roll position. It now always starts from the first unfinished roll.

## M7c (build M7c-teacher)
- **Class rules (NCERT EVS based):** each class has its own open topics, maximum words in item names, number of options and default language. Topics outside the class are disabled.
- **Question language:** English, Hindi or Hindi + English for questions, options, True/False and map questions (saved and restored for AFTER).
- **Teacher Corner moved:** removed from the top bar and Home page; now the last item on every class page (below Learn / Play / Explore).
- **Teacher Corner Help:** button below Login, and a Help link inside; a colourful help page in simple English (`js/thelp.js`).
- **Phones:** header no longer overflows on the right; notch-safe margins (`viewport-fit=cover`); landscape layout for short screens; checked at 6 phone sizes in portrait and landscape.
- Fixed: after typing in a setup field, the first tap on **Continue** was lost (found by browser test).

## M7b — Learning Evidence Corner improvements (build M7b-teacher)
- Class now comes from the main class selector (read-only in the form; no second Class dropdown).
- **Map questions** (share 20/30/40/50 %, default 40 %) use the real clickable map; answers saved as the tapped state.
- **Per-roll forms:** every roll gets its own questions and order with the same topic/type/map mix; Classes 1–2 get simpler prompts.
- AFTER builds a parallel form and avoids each roll's own BEFORE targets where possible; repeats are flagged.
- **Mark Roll Absent** (insufficient evidence, not zero); absent shown in grey, counted separately, never compared.
- Question counts 5 / 10 / 15 / 20; mixed type splits automatically.
- **Six-sheet workbook for both BEFORE and AFTER** (Class Summary, Individual Progress, Topic-wise Progress, Remedial Plan, Map Skills, Question Details).
- Remedial rules now follow the guide: minimum 2 questions per topic; Priority / Guided / Enrichment / Recheck.
- Older M7 JSON files still open (upgraded on load).
- Fixed: setup form lost focus when tabbing between number fields (found in browser testing).

## M7 — first release
## Added
- **Teacher Corner** (home page + top bar) with simple login (sessionStorage only).
- **Learning Evidence Corner**: BEFORE and AFTER workflows, setup form, warning, student-wise assessment (Roll Numbers), class overview, resume from JSON, progress backup.
- Question generator from the existing data bank (identity, capitals, classical dance, folk arts, festivals, foods, state animals, notable wildlife, famous places), MCQ / True-False / Mixed.
- BEFORE → AFTER comparison by Roll Number, topic-wise analysis, editable thresholds, Remedial Practice Suggestions.
- Reports: real `.xlsx` workbooks (BEFORE: 3 sheets, AFTER: 5 sheets) written in the browser with a small built-in writer; JSON backups; CSV fallback.
- **"Play a Quiz" on every state card now works** (short quiz on that state).
## Files
- New: `js/xlsx.js`, `js/tq.js`, `js/teacher.js`, `js/statequiz.js`, `docs/*`
- Changed: `index.html`, `js/app.js`, `js/card.js`, `js/i18n.js`, `css/style.css`
- Unchanged: all data files (`js/data/*`), map engine, Learn, Explore, Build India, Quiz, Discover, Hindi/audio.
## Notes
- No server, database, external API, analytics or student names.
- The project data bank lives in `js/data/*.js` (there is no separate JSON file); it was not modified.
