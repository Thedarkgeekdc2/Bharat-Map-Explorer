#!/usr/bin/env python3
"""Bundle a downloaded official State/UT GeoJSON as js/map/india-data.js.

Usage:
  python tools/build_offline_map.py path/to/official-states.geojson

This script intentionally does not download data or fabricate boundaries. Supply a GeoJSON
file acquired from an official source, such as the Survey of India ABDB portal or the
Survey of India / Esri India State layer. The app will validate that all 36 expected regions
are represented at runtime.
"""
from pathlib import Path
import json, sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'js' / 'map' / 'india-data.js'
if len(sys.argv) != 2:
    raise SystemExit('Usage: python tools/build_offline_map.py official-states.geojson')
src = Path(sys.argv[1])
if not src.exists():
    raise SystemExit(f'Input file not found: {src}')
try:
    data = json.loads(src.read_text(encoding='utf-8'))
except Exception as exc:
    raise SystemExit(f'Could not parse GeoJSON: {exc}')
if data.get('type') != 'FeatureCollection' or not isinstance(data.get('features'), list) or not data['features']:
    raise SystemExit('Input must be a GeoJSON FeatureCollection with non-empty features.')
# Refuse an accidental huge district/village layer unless it still plausibly represents states/UTs.
if len(data['features']) > 500:
    raise SystemExit(f'Found {len(data["features"])} features. Please provide the State/UT polygon layer, not district/village polygons.')
OUT.write_text('/* Official boundary GeoJSON bundled for first-run offline use. See README and source attribution. */\nwindow.INDIA_MAP = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print(f'Wrote {OUT} ({OUT.stat().st_size:,} bytes) from {src}.')
print('Deploy the project and verify that all 36 State/UTs load, especially Jammu & Kashmir and Ladakh separately.')
