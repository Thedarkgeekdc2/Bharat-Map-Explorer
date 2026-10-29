# Developer notes (for Mr DK only; not shown to teachers)

## Teacher login
Username `KV2KGP`, password `1261` are in `js/tq.js` (`CFG.auth`). This is a convenience gate, not security: anyone who reads the public JavaScript can see it. Nothing confidential should depend on it. The login state is kept in `sessionStorage` only.

## Review button (replaces "reviewed by DK")
- Items in `js/data/cards-dk.js` have no official source yet. They show a **Review** button that opens WhatsApp (+91 81269 56997) with a prefilled message (state, item, "attach a screenshot").
- After a teacher reviews an item (and you change it if needed), add it to `js/data/reviewed.js`: `'item name in lower case without brackets':'Teacher Name'`. The item then shows "(reviewed by Teacher Name)". If the facts are fully verified, move the item to `js/data/cards.js` and delete it from `cards-dk.js`; its Review button disappears.
- The Home page note explaining this is `homeNote` in `js/i18n.js` (English and Hindi).

## Panel layout
`.xsplit` puts the map beside the details (Explore, Learn) on screens at least 900 px wide and 560 px high; smaller screens stack. On **big screens** (1200 px wide, 640 px high or more: interactive panels) `body.fill` (set in `js/app.js` for Explore and Learn) makes the page use the whole screen: full width, map about one third, details box about two thirds with balanced columns and larger text; the state picker stays pinned and only the details list scrolls inside its box when a state has a lot of content. Tune it at the end of `css/style.css` (search "Interactive Panel").

## Offline map (M10)
The State/UT GeoJSON is fetched from Survey of India / Esri India on first successful map use. The Service Worker runtime cache and a best-effort localStorage copy allow offline reuse on the same device/browser after that first successful load. First-ever use without internet still requires a pre-populated official data asset, which is not bundled in this ZIP. Follow `js/map/README.txt`.

## Footer
The credit links to https://thedarkgeekdc2.github.io. Map boundary attribution is Survey of India / Esri India; keep the source link in the developer notes.


## M10 — Official boundary layer and offline cache

The old @svg-maps/india fallback was removed from the primary path because it merged Jammu & Kashmir and Ladakh and was not an official government source. The map engine now requests GeoJSON from the Survey of India / Esri India State polygon layer, projects polygons to SVG paths locally, and validates that all 36 State/UT names in `js/data/regions.js` are present. It rejects a partial layer rather than silently displaying a misleading map.

Source / provenance:
- Survey of India Administrative Boundary Database: https://surveyofindia.gov.in/pages/administrative-boundary-data-base-abdb-
- Survey of India Online Maps Portal describes ABDB state/district/sub-district boundary products: https://onlinemaps.surveyofindia.gov.in/AboutPortal.aspx
- Survey of India / Esri India State polygon layer metadata: https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1
- GeoJSON query used by this project: https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1/query?where=1%3D1&outFields=state&returnGeometry=true&outSR=4326&f=geojson

Offline behaviour: the service worker caches the GeoJSON query after its first successful request; the map module also stores a best-effort copy in localStorage. This means offline use is supported after the map has successfully loaded online once on that device/browser. This ZIP does not contain a pre-downloaded official GeoJSON file, so first-ever use with no internet will not load the map.
