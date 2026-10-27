# Install Bharat Map Explorer as an app (Interactive Panel, phone, laptop)

## For teachers
1. Open the website once in **Chrome or Edge** (use the internet for this first time).
2. A pop-up says **Install Bharat Map Explorer**. Tap **Install app**.
3. The app icon (the Bharat Map Explorer picture) appears on the home screen / desktop / panel. Open it like any app.
4. If you tap **Not now**, you can install later with the **Install app** button at the bottom of the page.
5. After the first visit the app also works **without internet** (the map is saved after you have opened it once).

**iPhone / iPad (Safari):** tap the Share button, then **Add to Home Screen**.
**Interactive Panel:** use the panel's Chrome/Edge browser, open the website, install, then pin it from the panel's app list if needed. Some panels block installs; in that case use *Bookmark* and choose the same icon if the panel allows it.

## For the developer (Mr DK)
- Install needs **https** (GitHub Pages is https) or `localhost`. Opening `index.html` from a file does not offer install.
- Files: `manifest.webmanifest`, `sw.js` (made by `tools/build_sw.py`), `js/pwa.js`, icons in `icons/` (made from the poster).
- **When you publish a new version, change the cache name** so devices refresh: `python3 tools/build_sw.py bme-m10` (then upload everything). Also change the `?v=` number in `index.html` if you like.
- The pop-up shows only when the browser says the app is installable and the app is not already installed. It appears once per visit; "Not now" hides it for that visit.
- To change the icon, replace the PNG files in `icons/` (192, 512, maskable 512, apple-touch 180, favicons) and keep the same names.
