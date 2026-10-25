# Validation Report — M7b
Date: 25 Oct 2026. Environment: headless Chromium (desktop 1100 px and mobile 390 px, opening the project from local files), Node.js, openpyxl, LibreOffice.

## Passed
- **Engine (Node, 21 checks):** per-roll forms (42 rolls, all different, identical mix, 4 map questions each); map answers; absent status; completed rolls cannot be marked absent; six-sheet reports; remedial levels; JSON validation and upgrade of older M7 files; AFTER keeps the plan and avoids each roll's BEFORE targets; matched/insufficient logic; improvement maths; Class 1–2 wording; clear insufficient-pool error.
- **Browser end-to-end (30 checks):** login; class read-only from selector and blocked when none selected; 5/10/15/20 and map-share options; summary; 42 rolls; map questions in the real UI; absent flow and locking; real downloads of Excel and JSON; BEFORE JSON imported in a separate browser context; AFTER setup restored from file; parallel form mix equal; Excel scores and improvements equal a recomputation from raw answers; absent = insufficient evidence; remedial levels; no page errors.
- **Mobile viewport:** setup form and map question fit the screen; tapping a state highlights it.
- **Regression (13 checks):** Home, Class, Learn, Quiz, Explore, Build India screen, Discover tabs and search, Hindi, state-card quiz, Teacher Corner exit; no JavaScript errors.
- **Excel files:** valid ZIP; open in openpyxl and LibreOffice.
- The earlier M7 checks (login, 42 rolls, BEFORE/AFTER files, resume from JSON) still pass.

## Important limits of this testing
- This environment has **no internet**. Map questions were tested with a **stand-in map file** (simple rectangles for all 36 regions) so the real clickable-map data was not exercised. Please test the live map on your hosting.
- Not tested: real Android phones/tablets, Microsoft Excel itself, GitHub Pages hosting, device voices.
- The shipped ZIP does not contain the stand-in map file.

## Known limits
- Login is not secure (visible in source).
- Difficulty is matched by question type only (MCQ medium, True/False easy, map medium).
- With small topics (e.g. foods, festivals with verified data) several students may share questions; a message tells you.
- Teacher Corner is in English. Only items with an official source are used unless *(reviewed by DK)* is ticked.
- Each assessment covers one class-section of up to 50 students; run one per section.
