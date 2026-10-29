# M10 Map Fix — Validation Notes

## Implemented
- Removed the dependency on the old `@svg-maps/india` geometry, which represented Jammu & Kashmir and Ladakh as one shared shape.
- Added a loader for the Survey of India / Esri India State polygon GeoJSON service.
- Converts `Polygon` and `MultiPolygon` features into local SVG paths in the browser.
- Validates that every one of the 36 region IDs in `js/data/regions.js` has a corresponding polygon; incomplete responses fail visibly rather than quietly showing a partial map.
- **M10.1 hotfix:** handles datasets that still represent Dadra and Nagar Haveli and Daman and Diu as two distinct feature names, by grouping both areas under the current combined Union Territory. This prevents the missing-UT validation error.
- Added a service-worker runtime cache for the GeoJSON request and a best-effort localStorage backup.
- Bumped the service-worker cache name to `bme-m10` to invalidate the previous app shell.

## Tests run for M10.1 hotfix
- `node --check js/map/map.js`: PASS.
- `node --check sw.js`: PASS.
- Regression fixture with 37 source features: the two separate names `Dadra and Nagar Haveli` and `Daman and Diu` combine into the one expected current UT; all 36 region IDs are mapped: PASS.
- Jammu & Kashmir and Ladakh produce separate map groups: PASS.
- Offline fallback from previously saved GeoJSON in localStorage: PASS.
- Python bundler syntax check: PASS.
- Live official service payload and actual rendered map were not available from this build environment; deployment smoke test still required.

## Verification still required on deployment
The live GeoJSON endpoint could not be fetched from this build environment, so the actual service payload and its exact feature spellings were not live-tested here. The loader validates all 36 State/UTs at runtime and reports a clear error if anything is absent. Please test the deployed app once while online and confirm that all 36 shapes—including Jammu & Kashmir and Ladakh independently—appear.

## Offline limitation
This ZIP does **not** contain a pre-downloaded official GeoJSON asset. The first successful map load requires internet. After that, the response is cached by the Service Worker and also stored locally when browser storage allows it, so the same device/browser can use the map offline. Service-worker caching requires HTTPS (GitHub Pages works) or localhost.

The Survey of India register lists the combined Dadra & Nagar Haveli, Daman and Diu UT, with Jammu & Kashmir and Ladakh listed separately. The renderer accepts either a single combined geometry or separate feature geometries for the two former areas, merging both into the combined UT for display.

For first-run offline use, the official source data must be downloaded and bundled as `js/map/india-data.js`; the current ZIP only implements the cached-after-first-load route.

## Source links
- Survey of India Administrative Boundary Database: https://surveyofindia.gov.in/pages/administrative-boundary-data-base-abdb-
- Survey of India Online Maps Portal: https://onlinemaps.surveyofindia.gov.in/AboutPortal.aspx
- Survey of India / Esri India State layer: https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1
- Query used: https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1/query?where=1%3D1&outFields=state&returnGeometry=true&outSR=4326&f=geojson
