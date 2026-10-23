import test from 'node:test';
import assert from 'node:assert/strict';
import {plans,rules,ruleMatches} from '../dist/data.mjs';
import {segment,simulate,project} from '../dist/engine.mjs';
import {terms,generationResults,focusResult,rankResults,eligiblePlans,matchingRule,correspondingPlan,modelResolutions,resolutionForModel,configurationChoices} from '../dist/comparison.mjs';
const date='2026-10-23';
const approx=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
const byId=id=>plans.find(p=>p.id===id);
test('switching Seedance 480p to Kling 3 selects a resolution in the chosen plan',()=>{
 const p=byId('mag-premium-monthly');
 assert.equal(resolutionForModel(p,rules,'kling-3','480p'),'720p');
});
test('Wan resolution choices use the selected plan rather than other providers',()=>{
 const p=byId('mag-premium-monthly');
 assert.deepEqual(modelResolutions(p,rules,'wan-3'),['480p','780p','1080p']);
 assert.equal(resolutionForModel(p,rules,'wan-3','720p'),'780p');
});
test('switching model keeps a valid chosen resolution',()=>{
 assert.equal(resolutionForModel(byId('mag-premium-monthly'),rules,'wan-3','1080p'),'1080p');
});
test('Kling 4 exposes the confirmed Magnific 3s quote without changing the plan',()=>{
 const p=byId('mag-premium-monthly');
 assert.deepEqual(configurationChoices(p,rules,{model:'kling-4',resolution:'1080p',duration:8}),[{resolution:'1080p',duration:3}]);
 const rows=generationResults({plans,rules,config:{model:'kling-4',resolution:'1080p',duration:3,count:3},period:'monthly',date});
 const row=focusResult(rows,p.id);assert.equal(row.one.required,840);approx(row.one.economic,3.36);
});
test('confirmed quote suggestions respect Higgsfield paid-plan access',()=>{
 const c={model:'kling-4',resolution:'720p',duration:8};
 assert.deepEqual(configurationChoices(byId('hf-starter-monthly'),rules,c),[]);
 assert.equal(configurationChoices(byId('hf-plus-monthly'),rules,c).length,4);
});
test('Wan Prime now has platform-specific limits and tariff at every listed resolution',()=>{
 const p=byId('mag-premium-monthly');
 for(const [resolution,rate]of[['480p',100],['780p',200],['1080p',400]]){
  const r=matchingRule(p,rules,{model:'wan-prime',resolution});
  assert.equal(r.billing.min,2);assert.equal(r.billing.max,30);assert.equal(r.billing.rate,rate);assert.equal(r.status,'verified');
  approx(simulate(p,r,8,1,{date}).economic,rate*8*80/20000);
 }
});
test('Wan Prime long clips are split without charging unnecessary seconds',()=>{
 const p=byId('mag-premium-monthly'),r=matchingRule(p,rules,{model:'wan-prime',resolution:'1080p'});
 const result=simulate(p,r,31,1,{date});assert.equal(result.generated,31);assert.equal(result.required,12400);
});
test('Kling 3 correct resolution is calculable after a model change',()=>{
 const p=byId('mag-premium-monthly'),resolution=resolutionForModel(p,rules,'kling-3','480p');
 const result=simulate(p,matchingRule(p,rules,{model:'kling-3',resolution}),8,1,{date});
 assert.equal(result.required,560);approx(result.economic,2.24);
});
const calc=(id,model,resolution,duration=8,count=1)=>{
 const p=byId(id),r=matchingRule(p,rules,{model,resolution});
 return simulate(p,r,duration,count,{date});
};
test('31 seconds are repartitioned, not padded to 34',()=>{
 const r=segment(31,{type:'second',min:4,max:30,step:1,rate:20});
 assert.equal(r.generated,31);assert.deepEqual(r.clips.map(c=>c.seconds),[27,4]);assert.equal(r.credits,620);
});
test('61 seconds are repartitioned without charging an artificial tail',()=>{
 const r=segment(61,{type:'second',min:4,max:30,step:1,rate:20});
 assert.equal(r.generated,61);assert.deepEqual(r.clips.map(c=>c.seconds),[30,27,4]);
});
test('large project duration still respects per-clip minimum and maximum',()=>{
 const r=segment(125,{type:'second',min:4,max:30,step:1,rate:20});
 assert.equal(r.generated,125);assert.equal(r.segments,5);assert.ok(r.clips.every(c=>c.seconds>=4&&c.seconds<=30));
});
test('block billing finds cheaper legal clip partitions',()=>{
 const r=segment(12,{type:'block',min:4,max:10,step:1,block:4,rate:10});
 assert.equal(r.generated,12);assert.equal(r.credits,30);
});
test('documented single-duration quote does not become a block tariff',()=>{
 const reference={type:'reference',options:[{seconds:5,credits:7}]};
 assert.equal(segment(5,reference).credits,7);assert.throws(()=>segment(8,reference),/extrapolamos/);assert.throws(()=>segment(10,reference),/extrapolamos/);
});
test('Kling 4 above maximum uses documented quotes only',()=>{
 const r=rules.find(r=>r.id==='hf-k4-1080p');
 assert.equal(segment(60,r.billing).credits,450);assert.equal(segment(35,r.billing).credits,262.5);assert.throws(()=>segment(34,r.billing),/cotação/);
});
test('conservative minimum never silently charges a longer unaudited clip',()=>{
 assert.throws(()=>calc('rw-pro-monthly','seedance-2','720p',4),/não auditada/);
});
test('monthly and annual plans can never enter the same comparison',()=>{
 for(const period of ['monthly','annual']){
  const rows=generationResults({plans,rules,config:{model:'seedance-25',resolution:'720p',duration:8,count:3},period,date});
  assert.ok(rows.length);assert.ok(rows.every(r=>r.p.period===period));
 }
 assert.throws(()=>eligiblePlans(plans,{period:'all',date}),/único ciclo/);
});
test('focus remains the chosen provider when resolution changes',()=>{
 const rowsFor=resolution=>rankResults(generationResults({plans,rules,config:{model:'seedance-25',resolution,duration:8,count:3},period:'monthly',date}),{currency:'BRL',fx:5});
 for(const resolution of ['480p','720p','1080p'])assert.equal(focusResult(rowsFor(resolution),'mag-premium-monthly').p.id,'mag-premium-monthly');
});
test('missing focused tariff never silently substitutes a cheaper provider',()=>{
 const rows=generationResults({plans,rules,config:{model:'kling-4',resolution:'720p',duration:8,count:3},period:'monthly',date});
 assert.equal(focusResult(rows,'mag-premium-monthly'),null);
});
test('commercial regression: Magnific Premium monthly price and credits',()=>{
 assert.equal(byId('mag-premium-monthly').price,80);assert.equal(byId('mag-premium-monthly').credits,20000);
 assert.equal(byId('mag-premium-monthly').period,'monthly');
});
test('commercial regression: Magnific monthly credit allowances are not annual / 12',()=>{
 assert.equal(byId('mag-plus-monthly').credits,45000);assert.equal(byId('mag-plus').credits,600000);
 assert.equal(byId('mag-pro-monthly').credits,112500);assert.equal(byId('mag-pro').credits,1500000);
 assert.notEqual(byId('mag-plus-monthly').credits,terms(byId('mag-plus')).monthlyCredits);
});
test('commercial regression: monthly SJinn prices come from the Monthly toggle',()=>{
 assert.equal(byId('sj-standard-monthly').price,19.9);assert.equal(byId('sj-pro-monthly').price,49.9);
 assert.equal(byId('sj-ultra-monthly').price,99);assert.equal(byId('sj-enterprise-monthly').price,999);
});
test('commercial regression: Krea Basic yearly uses precise 5.25, not rounded 5',()=>{
 assert.equal(byId('kr-basic-annual').price,63);assert.equal(terms(byId('kr-basic-annual')).monthlyPrice,5.25);
});
test('commercial regression: Higgsfield current Plus and Ultra prices',()=>{
 assert.equal(byId('hf-plus-monthly').price,49);assert.equal(byId('hf-plus-monthly').credits,1000);
 assert.equal(byId('hf-plus-annual').price,468);assert.equal(byId('hf-ultra-monthly').price,129);assert.equal(byId('hf-ultra-annual').price,1188);
});
test('annual monthly equivalent is independent of cash due and release period',()=>{
 assert.deepEqual(terms(byId('mag-premium')),{monthlyPrice:29.5,monthlyCredits:20000,dueNow:354,availableNow:240000});
 assert.deepEqual(terms(byId('rw-pro-annual')),{monthlyPrice:28,monthlyCredits:2250,dueNow:336,availableNow:2250});
});
test('commercial regression: Magnific Seedance 2.5 uses per-second rates',()=>{
 const r=calc('mag-premium-monthly','seedance-25','720p',5);
 assert.equal(r.required,2200);assert.equal(r.generated,5);assert.equal(r.segments,1);approx(r.economic,8.8);
});
test('same Magnific plan: 480p, 720p, 1080p are correctly ordered',()=>{
 const values=['480p','720p','1080p'].map(res=>calc('mag-premium-monthly','seedance-25',res));
 approx(values[0].economic,6.4);approx(values[1].economic,14.08);approx(values[2].economic,35.2);
 assert.ok(values[0].economic<values[1].economic&&values[1].economic<values[2].economic);
});
test('same Runway plan: resolution costs cannot be replaced by other platform costs',()=>{
 const values=['480p','720p','1080p'].map(res=>calc('rw-pro-monthly','seedance-25',res));
 approx(values[0].economic,160*35/2250);approx(values[2].economic,544*35/2250);
 assert.ok(values[0].economic<values[1].economic&&values[1].economic<values[2].economic);
});
test('resolution monotonicity on each audited plan, duration and number of executions',()=>{
 for(const p of plans.filter(p=>['magnific','runway'].includes(p.platform))){
  for(const model of ['seedance-2','seedance-25'])for(const duration of [5,8,15,31,125])for(const count of [1,3]){
   const costs=['480p','720p','1080p'].map(resolution=>calc(p.id,model,resolution,duration,count).economic);
   assert.ok(costs[0]<=costs[1]+1e-8&&costs[1]<=costs[2]+1e-8,`${p.id}/${model}/${duration}/${count}: ${costs}`);
  }
 }
});
test('Magnific Wan uses current list price, not stale promotional pages',()=>{
 assert.equal(calc('mag-premium-monthly','wan-3','1080p',8).required,1920);
 assert.equal(matchingRule(byId('mag-premium-monthly'),rules,{model:'wan-3',resolution:'780p'}).billing.rate,120);
});
test('Higgsfield exact 5s quote and resolution ordering',()=>{
 const values=['480p','720p','1080p'].map(res=>calc('hf-plus-monthly','wan-3',res,5));
 approx(values[0].economic,.245);approx(values[1].economic,.42875);approx(values[2].economic,.8575);
 assert.throws(()=>calc('hf-plus-monthly','wan-3','720p',8),/extrapolamos/);
});
test('unverified durations and approximate rates cannot receive exact prices by default',()=>{
 const rows=generationResults({plans,rules,config:{model:'wan-3',resolution:'720p',duration:8,count:3},period:'monthly',date});
 assert.ok(rows.filter(r=>r.p.platform==='runway'||r.p.platform==='higgsfield').every(r=>r.pending));
 const hf=generationResults({plans,rules,config:{model:'kling-3',resolution:'720p',duration:5,count:3},period:'monthly',date});
 assert.ok(hf.find(r=>r.p.id==='hf-plus-monthly').pending);
});
test('manual tariff takes priority over built-in platform tariffs',()=>{
 const p={...byId('mag-premium-monthly'),id:'TEST-MANUAL',status:'manual'};
 const own={...rules.find(r=>r.id==='mag-s25-720p'),id:'TEST-RULE',planId:p.id,billing:{type:'second',rate:1,min:4,max:30,step:1}};
 assert.equal(matchingRule(p,[...rules,own],{model:'seedance-25',resolution:'720p'}).id,'TEST-RULE');
 assert.equal(matchingRule(p,rules,{model:'seedance-25',resolution:'720p'}),null);
});
test('Starter access is never inferred from another Higgsfield plan',()=>{
 const p=byId('hf-starter-monthly');
 assert.ok(!rules.some(r=>ruleMatches(p,r,{model:'wan-3',resolution:'720p'})));
});
test('project and generation use exactly the same audited tariff',()=>{
 const p=byId('mag-premium-monthly'),config={model:'seedance-25',resolution:'720p',duration:8,quantity:8,attempts:5};
 const r=project(p,[config],c=>matchingRule(p,rules,c),{reserve:20,account:{date}});
 assert.equal(r.baseCredits,140800);assert.equal(r.reserveCredits,28160);assert.equal(r.required,168960);
 approx(r.baseAI,563.2);approx(r.total,675.84);
});
test('changing cycle preserves the platform and named plan',()=>{
 assert.equal(correspondingPlan(plans,'mag-plus-monthly','annual').id,'mag-plus');
 assert.equal(correspondingPlan(plans,'rw-pro-annual','monthly').id,'rw-pro-monthly');
});
test('manual plan is not substituted by a catalog plan with the same name',()=>{
 const manual={...byId('mag-premium-monthly'),id:'TEST-MANUAL',status:'manual'};
 assert.equal(correspondingPlan([...plans,manual],manual.id,'monthly').id,manual.id);
 assert.equal(correspondingPlan([...plans,manual],manual.id,'annual'),null);
});
test('invalid execution count is rejected before comparing prices',()=>{
 assert.throws(()=>generationResults({plans,rules,config:{model:'seedance-25',resolution:'720p',duration:8,count:0},period:'monthly',date}),/Execuções/);
});
test('estimated cost beyond balance never receives a verified best-cost badge',()=>{
 const base={p:{currency:'USD',period:'monthly',status:'verified'},r:{status:'verified'},one:{generated:5,economic:1,economicEstimated:true},three:{economic:3,economicEstimated:true}};
 const ranked=rankResults([base,{...base,one:{...base.one,economic:2}}],{currency:'USD'});
 assert.ok(ranked.every(r=>!r.best&&!r.bestThree));
});
test('sorting by immediate payment uses the displayed one-execution scenario',()=>{
 const base={p:{currency:'USD',period:'monthly',status:'verified'},r:{status:'verified'},one:{generated:5,economic:1,capacity:1},three:{economic:3}};
 const a={...base,p:{...base.p,id:'A'},one:{...base.one,payment:5},retry:{payment:100}};
 const b={...base,p:{...base.p,id:'B'},one:{...base.one,payment:10},retry:{payment:10}};
 assert.equal(rankResults([a,b],{sort:'payment',currency:'USD'})[0].p.id,'A');
});
