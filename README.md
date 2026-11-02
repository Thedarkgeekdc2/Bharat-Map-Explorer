<div align="center">

# 🇮🇳 Bharat Map Explorer

<<<<<<< HEAD
### Discover India. Explore States. Learn Through Play.
=======
**An interactive India-map learning tool for Classes I–V**  
**Build:** M10.5-review · reliability, security, performance and accessibility fixes
>>>>>>> 7d16038 (Final updates)

**An interactive India-map learning experience for Classes I–V**

[![Build](https://img.shields.io/badge/Build-M7b-2563EB?style=for-the-badge)](#project-overview)
[![Classes](https://img.shields.io/badge/Classes-I--V-16A34A?style=for-the-badge)](#learning-activities)
[![Languages](https://img.shields.io/badge/Language-English%20%7C%20Hindi-F97316?style=for-the-badge)](#project-overview)
[![Hosting](https://img.shields.io/badge/Hosting-Static%20%7C%20GitHub%20Pages-7C3AED?style=for-the-badge)](#run-the-project)
[![Technology](https://img.shields.io/badge/Technology-HTML%20%7C%20CSS%20%7C%20JavaScript-0F766E?style=for-the-badge)](#technology)

**Explore • Discover • Build • Play • Learn**

</div>

---

## 🧭 Explore this README

<details open>
<summary><strong>📌 Quick navigation — click to expand or collapse</strong></summary>

- [🌟 Project Overview](#-project-overview)
- [✨ Learning Activities](#-learning-activities)
- [👩‍🏫 Teacher Corner — Learning Evidence](#-teacher-corner--learning-evidence)
- [🚀 Run the Project](#-run-the-project)
- [🗂️ Project Structure](#-project-structure)
- [🛠️ Technology](#️-technology)
- [🔐 Privacy, Storage and Security](#-privacy-storage-and-security)
- [🧪 Testing and Known Limitations](#-testing-and-known-limitations)
- [🗺️ Map Attribution](#️-map-attribution)
- [👨‍💻 Project Credit](#-project-credit)

</details>

---

## 🌟 Project Overview

**Bharat Map Explorer** helps primary-stage learners discover Indian States and Union Territories through interactive map activities, learning cards, quizzes, puzzles and bilingual content. It is designed for classroom use, including touch-enabled interactive panels.

| 🧩 Project Detail | 📘 Information |
|---|---|
| **Build** | M7b · Teacher Corner & Learning Evidence Corner |
| **Target Classes** | Classes I–V |
| **Interface Languages** | English and Hindi |
| **Technology** | HTML, CSS and vanilla JavaScript |
| **Hosting** | Static website — no application server or database required |
| **Geographical Coverage** | 28 States and 8 Union Territories |

> 🎯 **Learning idea:** Make learning about India visual, interactive and activity-based for young learners.

---

## ✨ Learning Activities

Explore India through a set of child-friendly activities. Select an activity below to see what learners can do.

<details open>
<summary><strong>🟦 1. Learn — Learning Cards</strong></summary>

Explore learning cards and state-related facts in a child-friendly format.

</details>

<details>
<summary><strong>🟩 2. Explore Map — Discover on the Map</strong></summary>

Tap a State or Union Territory on the interactive map to explore it.

</details>

<details>
<summary><strong>🟧 3. Build India — Map Puzzle</strong></summary>

Place map pieces in their correct locations using drag-and-drop or tap interactions.

</details>

<details>
<summary><strong>🟪 4. Play Quiz — Learn by Playing</strong></summary>

Practise through games such as **Find the State**, **Capital Match**, culture-based questions and **India Challenge**.

</details>

<details>
<summary><strong>🟨 5. Discover — Explore India's Diversity</strong></summary>

Browse and search themes such as:

- 🎉 Festivals
- 💃 Classical and folk dances
- 🍲 Famous foods
- 🐘 Animals
- 🏛️ Places
- 📅 Festival calendar

</details>

<details>
<summary><strong>🟥 6. State-card Quiz</strong></summary>

Open a short quiz directly from an individual State or Union Territory card.

</details>

<details>
<summary><strong>🌐 7. Hindi / English Switch</strong></summary>

Change the interface language between Hindi and English. Audio playback depends on the voices installed on the device.

</details>

> 🇮🇳 The built-in data model covers **28 States and 8 Union Territories**. Content availability and verification status can differ by topic. Items marked as reviewed should not automatically be treated as officially source-verified.

---

## 👩‍🏫 Teacher Corner — Learning Evidence

The **Teacher Corner** includes **BEFORE and AFTER assessments** to help teachers review learning progress without requiring student names.

### 📝 Assessment workflow

1. Select the class on the main screen.
2. Choose **Section A–D** and the number of students (**up to 50 per assessment**).
3. Identify students by **roll number** in the assessment.
4. Create **MCQ, True/False or mixed assessments** with 5, 10, 15 or 20 questions per student.
5. Configure the map-question share, where map questions are available.
6. Mark an absent student as **absent**, rather than treating absence as a zero score.
7. Download a JSON progress backup. Use the BEFORE JSON file to set up the matching AFTER assessment.

### 📊 Excel report — six sheets

The exported Excel workbook contains these six sheets:

| No. | Report sheet | What it helps review |
|:---:|---|---|
| 01 | **Class Summary** | Overall class-level assessment summary |
| 02 | **Individual Progress** | Roll-number-wise learner progress |
| 03 | **Topic-wise Progress** | Evidence organised by topic |
| 04 | **Remedial Plan** | Suggested practice priorities |
| 05 | **Map Skills** | Performance on map questions |
| 06 | **Question Details** | Question-level response details |

### 🔎 Assessment notes

- Question order and question sets vary by roll where the available question bank allows it.
- Classes I–II use simpler wording for supported prompts.
- Reports include topic-level evidence, map-question performance and suggested practice priorities.
- Suggestions are intended to guide teaching and follow-up—not to label a student's ability.

📖 **Teacher instructions:** [`docs/TEACHER_GUIDE.md`](docs/TEACHER_GUIDE.md)

---

## 🚀 Run the Project

Choose either local use or GitHub Pages hosting. No npm installation or compilation step is needed.

<details open>
<summary><strong>💻 Option 1 — Open locally</strong></summary>

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select a class and choose an activity.

Most of the application is static and does not require an installation or build step.

⚠️ **Map note:** Map-dependent activities may need an internet connection to load map data. For offline map use, see [`js/map/README.txt`](js/map/README.txt) and provide the optional `js/map/india-data.js` file in the format expected by the map engine.

</details>

<details>
<summary><strong>🌐 Option 2 — Publish with GitHub Pages</strong></summary>

1. Upload the **contents** of the `Bharat_Map_Explorer` folder to the root of your GitHub repository. The `index.html`, `css/` and `js/` items should be at the repository root.
2. Open the repository's **Settings → Pages**.
3. Under the build and deployment settings, choose **Deploy from a branch**.
4. Select your main branch and the **/(root)** folder, then save.
5. Open the published Pages URL and test the map on the device and browser you plan to use in class.

The project uses relative file paths, making it suitable for static hosting.

</details>

---

## 🗂️ Project Structure

<details>
<summary><strong>📁 View project folders and files</strong></summary>

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
│   ├── build.js            # Build India puzzle
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

</details>

---

## 🛠️ Technology

| Technology | Purpose |
|---|---|
| **HTML** | Page structure and content |
| **CSS** | Responsive, touch-friendly visual design |
| **Vanilla JavaScript** | Activities, application logic and interactions |
| **Browser storage** | Saves selected class and language settings locally |
| **JSON / downloadable files** | Assessment backup and progress transfer |
| **GitHub Pages** | Static website hosting |

---

## 🔐 Privacy, Storage and Security

<details open>
<summary><strong>🔎 Read the important privacy and security notes</strong></summary>

- The project does not require a server, online database, analytics service or student names.
- The selected class and language are saved in browser local storage.
- Assessment work is handled in the open browser session and should be downloaded as JSON/Excel files for keeping records or continuing later.
- **Reports are still educational records:** they can contain roll numbers, answers, school details and assessment results. Store and share downloaded files responsibly.
- **Teacher Corner's login is only a convenience gate, not secure authentication.** Its client-side code is visible to anyone who can access the source. Before publishing a public repository, review and change/remove the embedded login details; do not use this gate to protect confidential information.
- Records do not automatically sync between devices. Use the downloaded BEFORE JSON file to carry the baseline to the AFTER assessment.

</details>

---

## 🧪 Testing and Known Limitations

For recorded checks and repeatable testing, see:

- [`docs/VALIDATION_REPORT.md`](docs/VALIDATION_REPORT.md) — recorded validation checks.
- [`docs/TEST_CHECKLIST.md`](docs/TEST_CHECKLIST.md) — manual checks to repeat on your own devices.

<details>
<summary><strong>⚠️ Important testing notes and limitations</strong></summary>

- The live clickable map should be tested on the actual GitHub Pages deployment. The packaged project may load map data from an external source unless the optional local map data file is supplied.
- A Hindi device voice must be available for Hindi speech playback.
- The teacher assessment interface is currently in English.
- The assessment question bank can be too small to make every student's questions completely unique for some topics; the application warns when alternatives are limited.
- Testing recorded in the validation report does not mean every Android device, interactive panel or live hosting environment has been verified.

</details>

---

## 🗺️ Map Attribution

The map attribution in the application identifies `@svg-maps/india` (based on MapSVG), **CC BY 4.0**.

> ⚖️ The map is **not an official Government of India map**. Retain the relevant attribution and follow the upstream asset's applicable licence terms when distributing or modifying map assets.

---

## 👨‍💻 Project Credit

<div align="center">

### Made with ❤️ for joyful learning

**THEDARKGEEKDC · Mr DK Chaudhary**

*Made for interactive, activity-based learning about India in the primary classroom.*

</div>

---

<div align="center">

**🇮🇳 Explore India · Learn Together · Celebrate Diversity 🇮🇳**

</div>
