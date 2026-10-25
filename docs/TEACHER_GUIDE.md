# Learning Evidence Corner — Teacher Guide (M7b)

## What this does
It creates anonymous, Roll-Number-based assessment evidence before and after students learn with Bharat Map Explorer. No server, no online database, no student names.

## Teacher entry
Open **Teacher Corner** (top bar or Home page). Username `KV2KGP`, password `1261`.
These values sit in public JavaScript. This is a convenience gate, **not secure authentication**, and must not protect confidential data. Students can use every learning mode without it.

## Select the class first
Choose Class 1–5 on the main class selector (Home page), then open Teacher Corner. The form shows that class **read-only**; there is no second Class dropdown. If no class is selected the form tells you to choose one. Then pick Section A–D and the number of students (1–50); Roll Numbers 1…N are created automatically.

## BEFORE assessment
1. Choose **BEFORE**. Enter School name (required), KV code (optional), Academic Year.
2. Choose Section and number of students.
3. Choose topics (*Select All Topics* / *Clear Selection*; topics without verified data are greyed out unless you tick *Also use items marked (reviewed by DK)*).
4. Choose MCQ, True/False or Mixed; questions per student (**5 / 10 / 15 / 20**); **map-question share** (None / 20 / 30 / 40 / 50 %, default 40 %). Map questions ask the student to tap a state on the real map (internet needed the first time).
5. Read the summary and warnings, tick the warning, start.
6. **Each roll gets its own set of questions** with the same topic, type and map mix. Questions are ordered differently per roll. Classes 1–2 get simpler prompts. If the data bank is too small for every roll to be different, a message says so.
7. Tap a Roll Number (or *Next roll number*). Finish each roll, or press **Mark Roll Absent**. Absent is *insufficient evidence*, not a zero. *Download progress backup (JSON)* any time; *Resume from a saved JSON file* continues later.
8. *Finish and get reports* → download the **Excel workbook** and the **JSON backup** before refreshing, closing or leaving the page.

## Learning period
Let students use Learn, Explore Map, Build India, Quiz, Discover and state-card quizzes for the chosen period. The Evidence Corner does not track this period in the background; it records only explicit assessment attempts.

## AFTER assessment
1. Choose **AFTER** and import the saved BEFORE JSON. School, year, class, section, student count, topics, question type, number of questions and map share are restored from the file and locked.
2. The app builds a parallel form for each roll: same topic / type / map mix, and facts the same student did not meet in BEFORE where the data bank allows (any repeat is flagged).
3. Complete the rolls (or mark absent), then download the AFTER Excel and JSON.

## Excel workbook (same six sheets for BEFORE and AFTER)
1. **Class Summary** — school/session details, counts (completed / absent / incomplete), averages, map accuracy. AFTER adds matched rolls, average change and improved/unchanged/reduced counts.
2. **Individual Progress** — Roll Number, blank *Student Name* column, status, scores, accuracy, map accuracy, recommendation. AFTER adds BEFORE score/accuracy, improvement (percentage points) and comparison status.
3. **Topic-wise Progress** — per roll and topic accuracy (AFTER adds BEFORE accuracy and change).
4. **Remedial Plan** — topic, evidence, priority, suggested practice, blank follow-up column.
5. **Map Skills** — map questions attempted, correct, accuracy, missed map targets.
6. **Question Details** — actual questions, type, topic, map flag, selected and correct answer (map answers as state names), result, reused-fallback flag (AFTER also lists the BEFORE questions).

## Interpreting the remedial analysis
- Below 60 % with at least 2 questions in a topic: **Priority practice**.
- 60 % to below 80 %: **Guided practice**.
- 80 % or above: no immediate need / **Enrichment**.
- Fewer than 2 questions in a topic: **Recheck (small sample)**.
- Absent, incomplete or unmatched rolls: **insufficient evidence**, never a zero or a fake improvement.
Thresholds (80 / 60) can be edited in setup and on the results screen. These are practice suggestions, not judgements of a child's ability; a pupil can improve and still need practice.

## No-server limitation
Results do not sync between devices. Data stays in the open page (and this tab's temporary session storage) until you download it. The BEFORE JSON is the portable baseline for AFTER weeks later. Keep JSON backups safe and never rely on browser storage as the permanent record. Downloaded files contain educational records (roll numbers and answers).

## Deployment check
Works from GitHub Pages or any web host (relative paths). The state data is bundled in the JavaScript files, so no data fetch is needed. The map package loads from the internet the first time (or place a saved copy at `js/map/india-data.js`, see `js/map/README.txt`). Before using with a class, test the live map questions and open both workbooks in Excel / LibreOffice / Google Sheets.
