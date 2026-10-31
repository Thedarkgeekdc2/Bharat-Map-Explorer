BHARAT MAP EXPLORER — BASE (Classes I–V)

RUN: GitHub Pages (HTTPS) ya localhost par open karein. Interactive Panel par chalega. Map data first successful load ke liye internet chahiye; uske baad same device/browser par offline cache use hota hai.

STRUCTURE
index.html          — page shell
js/map/india-data.js — optional bundled GeoJSON hook; placeholder unless generated from official data
css/style.css       — poora design (touch-friendly, responsive)
js/data/regions.js  — 28 States + 8 UTs (id, en, hi, type, mapId, capital, content, verified)
js/i18n.js          — English/Hindi text
js/modules.js       — activity registry (Learn / Explore Map / Build India / Play Quiz)
js/app.js           — router + screens (home -> class -> mode)

MODULE 1: Explore Map (js/map/map.js + js/explore.js). State/UT boundaries Survey of India / Esri India state-polygon service se load hote hain; pehli successful online load ke baad Service Worker + local cache se offline reuse hota hai. Setup: js/map/README.txt. M10.1 groups separate legacy “Dadra and Nagar Haveli” and “Daman and Diu” features under the current combined UT. For a self-contained first-run offline ZIP, supply an official GeoJSON and run: `python tools/build_offline_map.py official-states.geojson`.
MODULE 7 (final): Teacher Corner, Learning Evidence Corner (BEFORE/AFTER), state-card quiz. Guide: docs/TEACHER_GUIDE.md
Storage: class/language settings plus cached boundary geometry (localStorage/Service Worker). No student names are stored by the map cache.

Privacy and terms: open the footer links for the in-app Privacy Policy and Terms & Conditions. These pages are also available at #/privacy and #/terms.
Run node tools/test_m103_ui.js and node tools/test_m104_legal.js from this folder for the M10.3 data/UI and M10.4 legal/footer checks.
