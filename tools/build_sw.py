#!/usr/bin/env python3
"""Generate an app-shell release hash. Run after editing shipped assets."""
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
files = ['./', 'index.html', 'manifest.webmanifest']
for directory in ('css', 'js', 'icons'):
    files.extend(f.relative_to(ROOT).as_posix() for f in sorted((ROOT / directory).rglob('*'))
                 if f.is_file() and f.suffix not in ('.txt', '.md'))
template = (ROOT / 'tools/sw.js.tpl').read_text(encoding='utf-8')
digest = hashlib.sha256(template.encode('utf-8'))
for file in files:
    if file != './':
        digest.update(file.encode('utf-8'))
        digest.update((ROOT / file).read_bytes())
version = (sys.argv[1] + '-' if len(sys.argv) > 1 else 'review-') + digest.hexdigest()[:12]
(ROOT / 'sw.js').write_text(template.replace('__CACHE__', version).replace('__FILES__', json.dumps(files)), encoding='utf-8')
print(f'{len(files)} assets precached; release {version}')
