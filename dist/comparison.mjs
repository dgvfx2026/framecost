import {simulate,convert,numeric} from './engine.mjs';
export function terms(plan){
  return {monthlyPrice:plan.period==='annual'?plan.price/12:plan.price,
    monthlyCredits:plan.creditPeriod==='annual'?plan.credits/12:plan.credits,
    dueNow:plan.price,availableNow:plan.credits};
}
export function eligiblePlans(plans,{period='monthly',date,accounts={}}={}){
  if(!['monthly','annual'].includes(period))throw new Error('Escolha um único ciclo de cobrança: mensal ou anual.');
  return plans.filter(p=>p.period===period&&p.status!=='pending'&&p.price!=null&&p.credits>0&&
    (!p.validUntil||p.validUntil>=date||accounts[p.id]?.owned));
}
export function matchingRule(plan,rules,config){
  const compatible=r=>r.platform===plan.platform&&r.model===config.model&&r.resolution===config.resolution;
  const own=rules.find(r=>compatible(r)&&r.planId===plan.id);
  if(own||plan.status==='manual')return own||null;
  return rules.find(r=>compatible(r)&&!r.planId&&(!r.planIds||r.planIds.includes(plan.id)));
}
export function groupKey(row){
  const {p,r,one}=row;
  return [p.period,r.model,r.resolution,r.quality,r.mode,r.audio,one.generated,p.status,r.status].join('|');
}
export function generationResults({plans,rules,config,period='monthly',includeEstimated=false,accounts={},date}){
  numeric(config.duration,'Duração',{min:.1,max:86400});
  numeric(config.count,'Execuções',{min:1,max:100000,integer:true});
  const outcomes=[];
  for(const p of eligiblePlans(plans,{period,date,accounts})){
    const r=matchingRule(p,rules,config);
    if(!r){outcomes.push({p,pending:true,reason:'Sem tarifa auditada para este modelo e resolução.'});continue;}
    if(r.status==='pending'||!r.billing){outcomes.push({p,r,pending:true,reason:r.note||'Regra pendente.'});continue;}
    if(!includeEstimated&&(p.status==='estimated'||r.status==='estimated')){
      outcomes.push({p,r,pending:true,reason:'A fonte informa uma tarifa aproximada; ative a opção para consultá-la.'});continue;
    }
    try{
      const account={...(accounts[p.id]||{}),date};
      const row={p,r,one:simulate(p,r,config.duration,1,account),three:simulate(p,r,config.duration,3,account),retry:simulate(p,r,config.duration,config.count,account)};
      row.key=groupKey(row);outcomes.push(row);
    }catch(e){outcomes.push({p,r,pending:true,reason:e.message});}
  }
  return outcomes;
}
export function focusResult(rows,planId){return rows.find(r=>r.p.id===planId&&!r.pending&&!r.error)||null;}
export function modelResolutions(plan,rules,model){
  const compatible=rules.filter(r=>r.model===model&&r.billing&&r.status!=='pending'&&(!plan||matchingRule(plan,rules,r)===r));
  return [...new Set(compatible.map(r=>r.resolution))].sort((a,b)=>parseInt(a)-parseInt(b));
}
export function resolutionForModel(plan,rules,model,current){
  const local=modelResolutions(plan,rules,model),all=modelResolutions(null,rules,model);
  const options=local.length?local:all;
  if(options.includes(current))return current;
  return [...options].sort((a,b)=>Math.abs(parseInt(a)-parseInt(current))-Math.abs(parseInt(b)-parseInt(current)))[0]||current;
}
export function configurationChoices(plan,rules,config){
  if(!plan)return [];
  return rules.filter(r=>r.model===config.model&&r.billing&&r.status==='verified'&&matchingRule(plan,rules,r)===r).flatMap(r=>{
    if(r.billing.type==='reference')return r.billing.options.map(q=>({resolution:r.resolution,duration:q.seconds}));
    const duration=Math.max(Number(config.duration)||0,r.billing.min||.1);
    return [{resolution:r.resolution,duration}];
  }).sort((a,b)=>(a.resolution!==config.resolution)-(b.resolution!==config.resolution)||Math.abs(a.duration-config.duration)-Math.abs(b.duration-config.duration));
}
export function correspondingPlan(plans,id,period){
  const p=plans.find(x=>x.id===id);
  if(!p)return null;
  if(p.status==='manual')return p.period===period?p:null;
  return plans.find(x=>x.period===period&&x.platform===p.platform&&(x.family||x.name)===(p.family||p.name))||null;
}
export function rankResults(rows,{sort='cost',currency='USD',fx=null}={}){
  const valid=rows.filter(r=>!r.pending&&!r.error).map(r=>({...r,best:false,bestThree:false}));
  const groups=new Map();
  for(const r of valid){const key=groupKey(r);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);}
  for(const group of groups.values()){
    if(group.length<2)continue;
    const value=(r,n)=>convert(r[n].economic,r.p.currency,currency,fx);
    for(const n of ['one','three']){
      const values=group.map(r=>value(r,n));
      if(values.some(v=>v==null))continue;
      const minimum=Math.min(...values);
      if(group.some(r=>r[n].economicEstimated))continue;
      group.forEach((r,i)=>{r[n==='one'?'best':'bestThree']=Math.abs(values[i]-minimum)<1e-8;});
    }
  }
  valid.sort((a,b)=>{
    if(sort==='capacity')return b.one.capacity-a.one.capacity;
    const va=convert(sort==='payment'?a.one.payment:a.one.economic,a.p.currency,currency,fx);
    const vb=convert(sort==='payment'?b.one.payment:b.one.economic,b.p.currency,currency,fx);
    return (va??Infinity)-(vb??Infinity);
  });
  return [...valid,...rows.filter(r=>r.pending||r.error)];
}
