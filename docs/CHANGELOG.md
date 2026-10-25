# Changelog
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
