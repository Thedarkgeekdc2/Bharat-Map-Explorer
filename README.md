# 🇮🇳 Bharat Map Explorer

**An interactive India-map learning tool for Classes I–V**  
**Build:** M7b · Teacher Corner & Learning Evidence Corner

Bharat Map Explorer helps primary-stage learners discover Indian States and Union Territories through map activities, learning cards, quizzes, puzzles and bilingual content. It is designed for classroom use, including touch-enabled interactive panels.

**Interface languages:** English and Hindi  
**Technology:** HTML, CSS and vanilla JavaScript  
**Hosting:** Static website; no application server or database is required

---

## ✨ Learning Activities

- **Learn** — Explore learning cards and state-related facts in a child-friendly format.
- **Explore Map** — Tap a State or Union Territory on the interactive map to explore it.
- **Build India** — Place map pieces in the correct locations using drag-and-drop or tap interactions.
- **Play Quiz** — Practise with games such as Find the State, Capital Match, culture-based questions and India Challenge.
- **Discover** — Browse and search themes such as festivals, classical and folk dances, famous foods, animals and places. A festival calendar is also available.
- **State-card quiz** — Open a short quiz from an individual state or UT card.
- **Hindi/English switch** — Change the interface language. Audio playback depends on the voices installed on the device.

The built-in data model covers **28 States and 8 Union Territories**. Content availability and verification status can differ by topic; items marked as reviewed should not automatically be treated as officially source-verified.

## 👩‍🏫 Teacher Corner — Learning Evidence

The Teacher Corner includes **BEFORE and AFTER assessments** to help teachers review learning progress without requiring student names.

- Select the class on the main screen, then choose Section A–D and the number of students (up to 50 per assessment).
- Students are identified in the assessment by roll number.
- Create MCQ, True/False or mixed assessments with 5, 10, 15 or 20 questions per student.
- Configure the map-question share, where map questions are available.
- Question order and question sets vary by roll where the available question bank allows it. Classes I–II use simpler wording for supported prompts.
- Mark an absent student as absent, rather than treating absence as a zero score.
- Download a JSON progress backup and use the BEFORE JSON file to set up the matching AFTER assessment.
- Export an Excel workbook containing these six sheets:
  1. **Class Summary**
  2. **Individual Progress**
  3. **Topic-wise Progress**
  4. **Remedial Plan**
  5. **Map Skills**
  6. **Question Details**

The reports include topic-level evidence, map-question performance and suggested practice priorities. These suggestions are intended to guide teaching and follow-up—not to label a student's ability.

For step-by-step instructions, see [`docs/TEACHER_GUIDE.md`](docs/TEACHER_GUIDE.md).

## 🚀 Run the Project

### Option 1 — Open locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select a class and choose an activity.

Most of the application is static and does not require an installation or build step. **Map-dependent activities may need an internet connection** to load the map data. For offline map use, see [`js/map/README.txt`](js/map/README.txt) and provide the optional `js/map/india-data.js` file in the format expected by the map engine.

### Option 2 — Publish with GitHub Pages

1. Upload the **contents** of the `Bharat_Map_Explorer` folder to the root of your GitHub repository (so `index.html`, `css/` and `js/` are at the repository root).
2. Open the repository's **Settings → Pages**.
3. Under the build/deployment settings, choose **Deploy from a branch**, select your main branch and the `/ (root)` folder, then save.
4. Open the published Pages URL and test the map on the device/browser you plan to use in class.

No npm install or compilation step is needed. The project uses relative file paths, making it suitable for static hosting.

## 🗂️ Project Structure

```text
Bharat_Map_Explorer/
├── index.html              # Application entry point
├── css/
│   └── style.css           # Responsive, touch-friendly interface
├── js/
│   ├── app.js              # Navigation and application screens
│   ├── modules.js          # Core activity registry
│   ├── learn.js            # Learn activity
│   ├── explore.js          # Explore Map activity
│   ├── build.js             # Build India puzzle
│   ├── quiz.js              # Quiz activities
│   ├── statequiz.js         # Quiz linked to a state/UT card
│   ├── discover.js          # Search and themed discovery
│   ├── teacher.js           # Teacher Corner interface
│   ├── tq.js                # Assessment and report logic
│   ├── xlsx.js              # Browser-side Excel workbook generation
│   ├── i18n.js              # English/Hindi interface text
│   ├── speak.js             # Device speech support
│   ├── map/                 # Map engine and offline-map instructions
│   └── data/                # State, capital, card and topic data
└── docs/
    ├── TEACHER_GUIDE.md
    ├── TEST_CHECKLIST.md
    ├── VALIDATION_REPORT.md
    └── CHANGELOG.md
```

## 🔐 Privacy, Storage and Security

- The project does not require a server, online database, analytics service or student names.
- The selected class and language are saved in browser local storage. Assessment work is handled in the open browser session and should be downloaded as JSON/Excel files for keeping records or continuing later.
- **Reports are still educational records:** they can contain roll numbers, answers, school details and assessment results. Store and share downloaded files responsibly.
- **Teacher Corner's login is only a convenience gate, not secure authentication.** Its client-side code is visible to anyone who can access the source. Before publishing a public repository, review and change/remove the embedded login details; do not use this gate to protect confidential information.
- Records do not automatically sync between devices. Use the downloaded BEFORE JSON file to carry the baseline to the AFTER assessment.

## 🧪 Testing and Known Limitations

See [`docs/VALIDATION_REPORT.md`](docs/VALIDATION_REPORT.md) for the recorded checks and [`docs/TEST_CHECKLIST.md`](docs/TEST_CHECKLIST.md) for manual checks to repeat on your own devices.

Important points:

- The live clickable map should be tested on the actual GitHub Pages deployment. The packaged project may load map data from an external source unless the optional local map data file is supplied.
- A Hindi device voice must be available for Hindi speech playback.
- The teacher assessment interface is currently in English.
- The assessment question bank can be too small to make every student's questions completely unique for some topics; the application warns when alternatives are limited.
- Testing recorded in the validation report does not mean every Android device, interactive panel or live hosting environment has been verified.

## 🗺️ Map Attribution

The map attribution in the application identifies `@svg-maps/india` (based on MapSVG), **CC BY 4.0**. The map is **not an official Government of India map**. Retain the relevant attribution and follow the upstream asset's applicable licence terms when distributing or modifying map assets.

## 👨‍💻 Project Credit

**THEDARKGEEKDC · Mr DK Chaudhary**

---

*Made for interactive, activity-based learning about India in the primary classroom.*
