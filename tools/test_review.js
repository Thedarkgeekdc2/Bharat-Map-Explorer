/* Deterministic regression checks. Run: node tools/test_review.js */
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
process.chdir(path.join(__dirname,'..'));
global.window=global;global.document={addEventListener(){}};global.localStorage={getItem:()=>null,setItem:()=>{}};
for(const f of ['data/regions','data/capitals','data/cards','data/cards-dk','data/languages','data/classical-dances','data/official-languages','data/info','data/hi','data/reviewed','review','tq','xlsx','map/map'])vm.runInThisContext(fs.readFileSync(`js/${f}.js`,'utf8'),{filename:f});
let tests=0;
const check=(label,fn)=>{fn();tests++;console.log('PASS '+label);};
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture(){
 const settings={topics:['capital','identity'],total:10,typeMode:'mixed',mapShare:0,includeDK:false,lang:'both',thresholds:{strong:80,practice:60}};
 const gen=TQ.generate({...settings,students:3},{grade:5});assert.ok(!gen.error,gen.error);
 return TQ.create({kind:'before',school:'Test School',code:'TEST',year:'2026–27',cls:5,section:'A',students:3,settings,gen});
}
check('Generated backups pass full validation',()=>assert.deepEqual(TQ.validate(fixture()),[]));
check('All grade/language/question-mode combinations round-trip',()=>{
 for(const grade of [1,2,3,4,5])for(const lang of ['en','hi','both'])for(const typeMode of ['mcq','tf','mixed']){
  const topics=TQ.prof(grade).rec.filter(t=>TQ.capacity([t],false,grade)[t]>0);
  const settings={topics,total:5,typeMode,mapShare:0,includeDK:false,lang,thresholds:{strong:80,practice:60}};
  const gen=TQ.generate({...settings,students:2},{grade});assert.ok(!gen.error,gen.error);
  const a=TQ.create({kind:'before',school:'School',year:'2026–27',cls:grade,section:'A',students:2,settings,gen});
  assert.deepEqual(TQ.validate(a),[],`${grade}/${lang}/${typeMode}`);
 }
});
const mutations={
 'HTML in class':a=>a.class='<img src=x onerror=alert(1)>',
 'HTML in section':a=>a.section='<svg onload=alert(1)>',
 'null school':a=>a.school=null,
 'non-string school':a=>a.school.name={},
 'oversized school':a=>a.school.name='x'.repeat(501),
 'invalid count':a=>a.students=999,
 'fractional count':a=>a.students=1.5,
 'unknown kind':a=>a.kind='evil',
 'future schema':a=>a.schema=999,
 'bad timestamp':a=>a.createdAt='bad',
 'missing form':a=>delete a.forms[1],
 'duplicate form question':a=>a.forms[1][1]=a.forms[1][0],
 'unknown form question':a=>a.forms[1][0]='unknown',
 'missing question id':a=>delete a.questions[0].id,
 'duplicate question id':a=>a.questions[1].id=a.questions[0].id,
 'invalid answer key':a=>a.questions[0].correct='invalid',
 'duplicate options':a=>a.questions[0].options=[a.questions[0].correct,a.questions[0].correct],
 'null question':a=>a.questions[0]=null,
 'wrong option type':a=>a.questions[0].options={},
 'bad topic':a=>a.questions[0].topic='__proto__',
 'bad student status':a=>a.records[1].status='evil',
 'bad roll':a=>a.records[1].roll=999,
 'null answers':a=>a.records[1].answers=null,
 'unknown answer':a=>a.records[1].answers[a.forms[1][0]]='invalid',
 'foreign question answer':a=>a.records[1].answers.unknown='invalid',
 'invalid thresholds':a=>a.settings.thresholds={strong:60,practice:80},
 'invalid total':a=>a.settings.total=100,
 'invalid plan':a=>a.settings.plan=null,
 'invalid plan counts':a=>a.settings.plan.capital={mcq:'bad',tf:0},
 'bad options with saved answer':a=>{const q=TQ.formQs(a,1)[0];a.records[1].answers[q.id]=q.correct;q.options=null;},
 'legacy null question':a=>{delete a.forms;a.questions[0]=null;},
 'invalid repeated questions':a=>a.reused[1]='bad',
 'recursive AFTER baseline':a=>{a.kind='after';a.baseline={data:clone(a)};}
};
for(const [label,mutate]of Object.entries(mutations))check('Reject '+label,()=>{const a=fixture();mutate(a);assert.ok(TQ.validate(a).length);});
check('Primitive and malformed containers never crash validation',()=>{
 for(const a of [null,[],1,'text',{}, {app:'BharatMapExplorer',school:[],records:42,questions:{}}])assert.ok(TQ.validate(a).length);
});
check('Legacy shared-question backups normalize safely',()=>{
 const a=fixture(),first=a.forms[1];a.questions=a.questions.filter(q=>first.includes(q.id));delete a.forms;delete a.reused;a.schema=1;
 assert.deepEqual(TQ.validate(a),[]);assert.equal(a.schema,2);assert.equal(a.forms[3].length,10);
});
check('Scoring, absence and invalid answers',()=>{
 const a=fixture(),qs=TQ.formQs(a,1);
 assert.equal(TQ.setAnswer(a,1,'unknown','x'),false);assert.equal(TQ.setAnswer(a,999,qs[0].id,qs[0].correct),false);
 for(const q of qs)assert.equal(TQ.setAnswer(a,1,q.id,q.correct),true);
 assert.equal(TQ.score(a,1).acc,100);TQ.finish(a,1);assert.equal(TQ.setAnswer(a,1,qs[0].id,qs[0].correct),false);
 TQ.markAbsent(a,2);assert.equal(TQ.counts(a).absent,1);assert.equal(TQ.score(a,2).status,'absent');assert.deepEqual(TQ.validate(a),[]);
});
check('AFTER baseline round-trip and mismatch rejection',()=>{
 const b=fixture(),settings=b.settings;
 const gen=TQ.generate({...settings,students:b.students},{grade:b.class,plan:settings.plan,mapN:0});
 const a=TQ.create({kind:'after',school:b.school.name,code:b.school.code,year:b.academicYear,cls:b.class,section:b.section,students:b.students,settings,gen,baseline:b});
 assert.deepEqual(TQ.validate(a),[]);a.baseline.data.section='B';assert.ok(TQ.validate(a).length);
});
check('CSV formulas are neutralized and CR is quoted',()=>{
 const csv=XLSX_LITE.csv([['=1+1','+SUM(A1)','@x','-cmd','\t=1','a\rb',-2]]);
 assert.ok(csv.startsWith("'=1+1,'+SUM(A1),'@x,'-cmd,'\t=1,"));assert.ok(csv.includes('"a\rb"'));assert.ok(csv.endsWith(',-2'));
});
(async()=>{
 // Deliberately synthetic rectangles: only a renderer test, never a distributable map.
 const features=REGIONS.map((r,i)=>({type:'Feature',properties:{state:r.en},geometry:{type:'Polygon',coordinates:[[[70+i*.1,20],[70.05+i*.1,20],[70.05+i*.1,20.1],[70+i*.1,20.1],[70+i*.1,20]]]}}));
 features.push({type:'Feature',properties:{state:'Dadar & Nagar Haveli'},geometry:{type:'Polygon',coordinates:[[[72,20],[72.1,20],[72.1,20.1],[72,20.1],[72,20]]]}});
 let calls=0;global.fetch=async()=>{calls++;await new Promise(r=>setTimeout(r,10));return{ok:true,json:async()=>({type:'FeatureCollection',features})};};
 await Promise.all([BMap.load(),BMap.load(),BMap.load()]);
 check('Concurrent map loads share one request',()=>assert.equal(calls,1));
 check('Class 5 map targets cover all 36 States/UTs including Ladakh',()=>assert.equal(TQ.mapTargets(5).length,36));
 check('All 36 regions and Dadar spelling are recognized',()=>{assert.equal(Object.keys(BMap.info().groups).length,36);assert.deepEqual(BMap.info().unknown,[]);assert.equal(BMap.info().groups['dadra-and-nagar-haveli-and-daman-and-diu'].length,2);});
 const sheets=[{name:'School',rows:[['Text','Number'],['=1+1',-2],['हिन्दी',1]]}];
 const blob=XLSX_LITE.build(sheets),bytes=Buffer.from(await blob.arrayBuffer());
 check('XLSX ZIP contains text cells, not executable formulas',()=>{assert.equal(bytes.readUInt32LE(),0x04034b50);assert.ok(!bytes.toString().includes('<f>'));assert.ok(bytes.toString().includes('t="inlineStr"'));});
 if(process.env.XLSX_PATH)fs.writeFileSync(process.env.XLSX_PATH,bytes);
 console.log(`\n${tests} regression groups passed (including 45 generation combinations).`);
})().catch(e=>{console.error(e);process.exitCode=1;});
