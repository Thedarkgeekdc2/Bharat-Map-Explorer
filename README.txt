BHARAT MAP EXPLORER — BASE (Classes I–V)

RUN: index.html ko double-click karke kholein (internet ki zaroorat nahi). Interactive Panel par bhi chalega.

STRUCTURE
index.html          — page shell
css/style.css       — poora design (touch-friendly, responsive)
js/data/regions.js  — 28 States + 8 UTs (id, en, hi, type, mapId, capital, content, verified)
js/i18n.js          — English/Hindi text
js/modules.js       — activity registry (Learn / Explore Map / Build India / Play Quiz)
js/app.js           — router + screens (home -> class -> mode)

MODULE 1: Explore Map (js/map/map.js engine + js/explore.js). Map data CDN se aata hai; offline ke liye js/map/README.txt dekhein.
MODULE 7 (final): Teacher Corner, Learning Evidence Corner (BEFORE/AFTER), state-card quiz. Guide: docs/TEACHER_GUIDE.md
Storage: sirf class aur language (localStorage). Koi personal data nahi.
