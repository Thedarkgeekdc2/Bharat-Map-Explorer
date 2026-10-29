Bharat Map Explorer — State/UT boundary map

Official reference layer used by the app: Survey of India / Esri India State polygon service
https://livingatlas.esri.in/server/rest/services/LivingAtlas/IND_AdminBoundary/MapServer/1

The renderer accepts Polygon and MultiPolygon GeoJSON. It maps Jammu & Kashmir and Ladakh independently. Some boundary datasets expose the merged Dadra & Nagar Haveli and Daman & Diu Union Territory as the two former areas (“Dadra and Nagar Haveli” and “Daman and Diu”). Both feature geometries are now combined under the current single Union Territory in the app.

Offline operation: after the app has successfully fetched the map once on a device/browser, the service worker and localStorage keep a copy for that same browser. The official geometry is not embedded in this ZIP, so a clean first install still needs internet. If you need first-run offline deployment, download the official SOI Administrative Boundary Database and generate js/map/india-data.js using tools/build_offline_map.py (instructions in docs/M10_MAP_VALIDATION.md).

Official source context: Survey of India lists the merged Dadra & Nagar Haveli, Daman and Diu UT, with Jammu & Kashmir and Ladakh as separate UTs.
https://surveyofindia.gov.in/pages/geospatial-digital-data-register
https://surveyofindia.gov.in/pages/administrative-boundary-data-base-abdb-
