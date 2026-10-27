import os,json,sys
cache=sys.argv[1] if len(sys.argv)>1 else 'bme-m9'
files=['./','index.html','manifest.webmanifest']
for d in ['css','js','icons']:
    for r,_,fs in os.walk(d):
        for f in sorted(fs):
            if f.endswith(('.txt','.md')):continue
            files.append(os.path.join(r,f).replace(os.sep,'/'))
open('sw.js','w').write(open('tools/sw.js.tpl').read().replace('__CACHE__',cache).replace('__FILES__',json.dumps(files)))
print(len(files),'files precached; cache',cache)
