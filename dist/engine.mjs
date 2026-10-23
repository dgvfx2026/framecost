// Pure calculation engine: native currencies, no DOM, no rounding money before display.
export const EPS=1e-8;
export function numeric(value,label,{min=0,max=1e9,integer=false}={}){const n=Number(value);if(value===''||value==null||!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n)))throw new Error(label+': valor inválido.');return n}
export function unitCost(cost,credits){return numeric(cost,'Custo')/numeric(credits,'Créditos',{min:EPS})}
export function attributableCost(plan){return plan.period==='annual'&&plan.creditPeriod==='monthly'?plan.price/12:plan.price}
export function convert(value,from,to,fx){if(value==null||!Number.isFinite(value))return null;if(from===to)return value;if(!Number.isFinite(fx)||fx<=0)return null;return from==='USD'?value*fx:value/fx}
export function segment(duration,billing){
 const target=numeric(duration,'Duração',{min:EPS,max:86400});
 if(!billing)throw new Error('Regra de consumo pendente.');
 let clips=[];
 if(billing.type==='second'||billing.type==='block'){
  const min=numeric(billing.min,'Duração mínima',{min:EPS});const max=numeric(billing.max,'Duração máxima',{min});const step=numeric(billing.step??1,'Passo',{min:EPS});const count=Math.ceil((target-EPS)/max);
  for(let i=0;i<count;i++){const requested=Math.min(max,target-i*max);const seconds=Math.min(max,Math.max(min,Math.ceil((requested-EPS)/step)*step));const credits=billing.type==='second'?seconds*numeric(billing.rate,'Tarifa'):Math.ceil((seconds-EPS)/numeric(billing.block,'Bloco',{min:EPS}))*numeric(billing.rate,'Tarifa');clips.push({seconds,credits})}
 }else if(billing.type==='presets'){
  const opts=billing.options.map(o=>({seconds:numeric(o.seconds,'Duração do clipe',{min:EPS}),credits:numeric(o.credits,'Consumo')}));if(!opts.length)throw new Error('Durações pendentes.');
  // Bounded dynamic programming: minimum credits to cover duration, then least excess.
  const precision=10, goal=Math.ceil(target*precision-EPS), max=Math.max(...opts.map(o=>Math.round(o.seconds*precision)));if(goal>1000000)throw new Error('Duração muito longa.');
  const costs=new Float64Array(goal+max+1).fill(Infinity), prev=new Int32Array(costs.length).fill(-1), chosen=new Int32Array(costs.length).fill(-1);costs[0]=0;
  for(let i=0;i<goal;i++)if(Number.isFinite(costs[i]))opts.forEach((o,k)=>{const next=i+Math.round(o.seconds*precision);if(costs[i]+o.credits<costs[next]-EPS){costs[next]=costs[i]+o.credits;prev[next]=i;chosen[next]=k}});
  let end=goal;for(let i=goal;i<costs.length;i++)if(costs[i]<costs[end]-EPS)end=i;if(!Number.isFinite(costs[end]))throw new Error('Composição indisponível.');while(end>0){clips.push(opts[chosen[end]]);end=prev[end]}clips.reverse();
 }else throw new Error('Consumo ilimitado ou especial: não há tarifa linear confirmada.');
 return {clips,segments:clips.length,requested:target,generated:clips.reduce((s,x)=>s+x.seconds,0),credits:clips.reduce((s,x)=>s+x.credits,0)};
}
export function activeLots(lots=[],date=new Date().toISOString().slice(0,10)){return lots.filter(l=>!l.expires||l.expires>=date).sort((a,b)=>(a.priority??99)-(b.priority??99)||String(a.expires||'9999').localeCompare(String(b.expires||'9999')))}
export function spend(lots,credits,fallback,date){let need=credits,cost=0,used=[];for(const l of activeLots(lots,date)){const take=Math.min(numeric(l.credits,'Saldo'),need);if(take>0){const rate=unitCost(l.cost,l.originalCredits??l.credits);cost+=take*rate;need-=take;used.push({id:l.id,credits:take,cost:take*rate})}}if(need>EPS){if(fallback==null)return {cost:null,unfunded:need,used,estimated:true};cost+=need*fallback}return {cost,unfunded:Math.max(0,need),used,estimated:need>EPS}}
export function additional(plan,required,{owned=false,lots=[],date}={}){
 if(plan.validUntil&&plan.validUntil<(date??new Date().toISOString().slice(0,10))&&!owned)return {payment:null,purchased:0,reason:'Oferta encerrada; atualizar o preço.'};
 let available=owned?activeLots(lots,date).reduce((s,l)=>s+l.credits,0):(plan.credits??0);let payment=owned?0:plan.price;
 if(payment==null||plan.credits==null)return {payment:null,purchased:0,reason:'Preço ou capacidade pendente.'};const deficit=Math.max(0,required-available);
 if(deficit>EPS){if(!plan.topup)return {payment:null,purchased:0,reason:'Faltam '+Math.ceil(deficit)+' créditos; preço de recarga/upgrade não confirmado.'};const packs=Math.ceil((deficit-EPS)/plan.topup.credits);return {payment:payment+packs*plan.topup.price,purchased:packs*plan.topup.credits,reason:'Compra simulada de '+packs+' pacote(s) de '+plan.topup.credits+' créditos; confirmar elegibilidade.'}}
 return {payment,purchased:0,reason:owned?'Saldo informado suficiente.':'Cenário de nova contratação; saldo da conta não consultado.'};
}
export function simulate(plan,rule,duration,count=1,account={}){
 const n=numeric(count,'Execuções',{min:1,max:100000,integer:true});const clip=segment(duration,rule.billing);const rate=unitCost(attributableCost(plan),plan.credits);const lots=account.owned?(account.lots??[]):[{id:'plan',credits:plan.credits,originalCredits:plan.credits,cost:attributableCost(plan),priority:0}];const available=activeLots(lots,account.date).reduce((s,l)=>s+l.credits,0);const required=clip.credits*n;const economic=spend(lots,required,plan.topup?plan.topup.price/plan.topup.credits:rate,account.date);const cash=additional(plan,required,account);
 return {...clip,count:n,required,economic:economic.cost,economicEstimated:economic.estimated,payment:cash.payment,purchased:cash.purchased,paymentReason:cash.reason,available,remaining:Math.max(0,available-required),shortfall:Math.max(0,required-available),remainingAfterPurchase:cash.payment==null?null:Math.max(0,available+cash.purchased-required),capacity:Math.floor((available+EPS)/clip.credits),capacityAfter:Math.floor((Math.max(0,available-required)+EPS)/clip.credits),percent:available>0?required/available*100:null,perSecond:economic.cost/(clip.generated*n),unitRate:rate,estimated:plan.status!=='verified'||rule.status!=='verified'||economic.estimated};
}
export function operations(items,scenes){return items.reduce((sum,x)=>{const value=numeric(x.value,'Custo operacional');const count=x.type==='scene'?scenes:x.type==='hour'?numeric(x.hours,'Horas'):1;return sum+value*count},0)}
export function pricing(cost,{method='margin',percent=40,provision=0}={}){numeric(cost,'Custo');const p=numeric(percent,'Percentual',{min:0,max:method==='margin'?99.99:10000})/100;const f=numeric(provision,'Provisão',{min:0,max:99.99})/100;if(method==='margin'&&p+f>=1)throw new Error('Margem + provisão deve ser menor que 100%.');const sale=method==='markup'?cost*(1+p)/(1-f):cost/(1-p-f);const fees=sale*f;const profit=sale-cost-fees;return {cost,sale,fees,profit,margin:sale?profit/sale*100:0}}
export function project(plan,scenes,resolveRule,{reserveType='percent',reserve=20,items=[],pricing:price={},account={}}={}){
 if(!scenes.length)throw new Error('Adicione pelo menos uma cena.');let baseCredits=0,baseGenerated=0,desired=0,executions=0,segments=0,sceneCount=0;const details=[];
 for(const s of scenes){const q=numeric(s.quantity,'Quantidade de cenas',{min:1,max:10000,integer:true});const attempts=numeric(s.attempts,'Tentativas',{min:1,max:10000,integer:true});const r=resolveRule(s);if(!r)throw new Error('Sem tarifa compatível para '+(s.name||'uma das cenas')+'.');const c=segment(s.duration,r.billing);baseCredits+=c.credits*q*attempts;baseGenerated+=c.generated*q*attempts;desired+=c.requested*q;executions+=q*attempts;segments+=c.segments*q*attempts;sceneCount+=q;details.push({...c,quantity:q,attempts,rule:r})}
 const rv=numeric(reserve,'Reserva',{max:reserveType==='percent'?1000:100000,integer:reserveType==='extra'});let reserveCredits=0,extraSegments=0,extraGenerated=0;
 if(reserveType==='percent'){reserveCredits=baseCredits*rv/100;extraGenerated=baseGenerated*rv/100}
 else {for(let i=0;i<rv;i++){const d=details[i%details.length];reserveCredits+=d.credits;extraSegments+=d.segments;extraGenerated+=d.generated}}
 const required=baseCredits+reserveCredits;const rate=unitCost(attributableCost(plan),plan.credits);const lots=account.owned?(account.lots??[]):[{id:'plan',credits:plan.credits,originalCredits:plan.credits,cost:attributableCost(plan),priority:0}];const baseSpend=spend(lots,baseCredits,plan.topup?plan.topup.price/plan.topup.credits:rate,account.date);const allSpend=spend(lots,required,plan.topup?plan.topup.price/plan.topup.credits:rate,account.date);const cash=additional(plan,required,account);const operational=operations(items,sceneCount);const total=allSpend.cost+operational;const sale=pricing(total,price);
 return {sceneCount,desired,executions,segments,extraSegments,baseGenerated,extraGenerated,baseCredits,reserveCredits,required,ai:allSpend.cost,baseAI:baseSpend.cost,reserveAI:allSpend.cost-baseSpend.cost,economicEstimated:allSpend.estimated,operational,total,payment:cash.payment,paymentReason:cash.reason,details,remaining:Math.max(0,activeLots(lots,account.date).reduce((a,l)=>a+l.credits,0)-required),...sale};
}
