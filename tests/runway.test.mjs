import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {plans,rules,availability} from '../dist/catalog.mjs';
import {simulate,project,segment} from '../dist/engine.mjs';
import {generationResults,focusResult,matchingRule,resolutionForModel} from '../dist/comparison.mjs';
const date='2026-10-23',p=plans.find(p=>p.id==='rw-pro-monthly');
const config=(model,resolution='720p',duration=8,klingAudio=false)=>({model,resolution,duration,klingAudio,count:3});
const result=c=>focusResult(generationResults({plans,rules,config:c,period:'monthly',date}),p.id);
const approx=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-7,`${actual} != ${expected}`);

test('Runway selects Kling 3 rather than reporting incompatible',()=>{
 const r=result(config('kling-3'));assert.ok(r);assert.equal(r.r.quality,'Standard');assert.equal(r.one.required,72);approx(r.one.economic,1.12);
});
test('Runway Kling 3 Pro 1080p has its own rate',()=>{
 const r=result(config('kling-3','1080p'));assert.equal(r.one.required,96);approx(r.one.economic,96*35/2250);
});
test('Runway Kling 3 audio changes rate in both resolutions',()=>{
 assert.equal(result(config('kling-3','720p',8,true)).one.required,104);
 assert.equal(result(config('kling-3','1080p',8,true)).one.required,136);
 assert.equal(result(config('kling-3','1080p',8,true)).r.audio,'Áudio nativo');
});
test('audio choice never reuses the silent Magnific rate',()=>{
 const rule=matchingRule(plans.find(p=>p.id==='mag-premium-monthly'),rules,config('kling-3','1080p',8,true));
 assert.equal(rule.billing.rate,140);assert.equal(rule.klingAudio,true);
});
test('Runway Wan 3 works at 480p, 720p and 1080p',()=>{
 for(const [resolution,credits] of [['480p',40],['720p',80],['1080p',160]]){
  const r=result(config('wan-3',resolution));assert.ok(r);assert.equal(r.one.required,credits);approx(r.one.economic,credits*35/2250);
 }
});
test('Runway Wan 3 and Prime use their own native duration limits',()=>{
 for(const model of ['wan-3','wan-prime']){
  const r=matchingRule(p,rules,config(model));assert.equal(r.billing.min,2);assert.equal(r.billing.max,30);
  assert.equal(simulate(p,r,2,1,{date}).generated,2);assert.equal(simulate(p,r,31,1,{date}).generated,31);
 }
});
test('Runway Wan Prime agrees with all three native 5s quotes',()=>{
 for(const [resolution,credits]of[['480p',34],['720p',70],['1080p',140]])assert.equal(result(config('wan-prime',resolution,5)).one.required,credits);
});
test('both Kling versions and both Wan versions work in every Runway billing plan',()=>{
 for(const plan of plans.filter(p=>p.platform==='runway'))for(const model of ['kling-3','kling-4','wan-3','wan-prime']){
  const resolution=resolutionForModel(plan,rules,model,'720p');
  for(const duration of [4,8,15,30,61,125]){
   const c=config(model,resolution,duration);
   const row=focusResult(generationResults({plans,rules,config:c,period:plan.period,date}),plan.id);
   assert.ok(row,`${plan.id}/${model}/${duration}`);assert.equal(row.one.generated,duration);assert.ok(row.one.required>0);
  }
 }
});
test('Runway Kling 4 aligns the resolution to the confirmed web tariff',()=>{
 assert.equal(resolutionForModel(p,rules,'kling-4','720p'),'1080p');
 const r=result(config('kling-4','1080p'));assert.equal(r.one.required,188);approx(r.one.economic,188*35/2250);
});
test('Runway Kling 4 reproduces every captured native 1080p quote',()=>{
 const evidence=JSON.parse(readFileSync(new URL('../docs/runway-native-quotes-2026-10-23.json',import.meta.url),'utf8'));
 assert.equal(evidence.kling4.length,27);
 for(const q of evidence.kling4){const seconds=parseInt(q.duration),credits=parseFloat(q.cost);assert.equal(result(config('kling-4',q.resolution,seconds)).one.required,credits,seconds+'s');}
});
test('Kling 4 rounds credits per clip before repeating executions',()=>{
 const r=result(config('kling-4','1080p',5));assert.equal(r.one.required,118);assert.equal(r.three.required,354);
 assert.equal(segment(31,r.r.billing).credits,729);assert.equal(segment(31,r.r.billing).generated,31);
});
test('native Kling 4 promotional rate expires for new and existing subscribers',()=>{
 const rule=matchingRule(p,rules,config('kling-4','1080p'));
 assert.throws(()=>simulate(p,rule,8,1,{date:'2026-12-01'}),/cotação.*venceu/);
 assert.throws(()=>simulate(p,rule,8,1,{date:'2026-12-01',owned:true,lots:[]}),/cotação.*venceu/);
 assert.throws(()=>project(p,[{...config('kling-4','1080p'),quantity:1,attempts:1}],()=>rule,{account:{date:'2026-12-01'}}),/cotação.*venceu/);
});
test('project and generation share all four corrected Runway model rules',()=>{
 for(const model of ['kling-3','kling-4','wan-3','wan-prime']){
  const c=config(model,model==='kling-4'?'1080p':'720p');
  const generation=result(c),r=project(p,[{...c,quantity:2,attempts:3}],x=>matchingRule(p,rules,x),{reserve:0,account:{date}});
  assert.equal(r.required,generation.one.required*6);approx(r.baseAI,generation.one.economic*6);
 }
});
test('Kling 4 missing 720p price is distinguished from model availability',()=>{
 const rule=matchingRule(p,rules,config('kling-4','720p'));assert.equal(availability('runway','kling-4'),'verified');
 assert.equal(rule.status,'pending');assert.match(rule.note,/disponível/);assert.match(rule.note,/tarifa/);
});
