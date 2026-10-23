const EPS=1e-8;
function positive(value,label){const n=Number(value);if(value==null||value===''||!Number.isFinite(n)||n<=0)throw new Error(label+': valor inválido.');return n;}
function presetComposition(target,options,step){
  const goal=Math.ceil((target-EPS)/step);
  const opts=options.map(o=>({seconds:positive(o.seconds,'Duração cotada'),credits:Number(o.credits)}));
  if(!opts.length||opts.some(o=>!Number.isFinite(o.credits)||o.credits<0))throw new Error('Cotações incompletas.');
  const max=Math.max(...opts.map(o=>Math.round(o.seconds/step)));
  if((goal+max)*opts.length>20000000)throw new Error('Configuração de blocos muito extensa; divida o projeto em cenas.');
  const costs=new Float64Array(goal+max+1).fill(Infinity);
  const counts=new Float64Array(costs.length).fill(Infinity);
  const prev=new Int32Array(costs.length).fill(-1), choice=new Int32Array(costs.length).fill(-1);
  costs[0]=0;counts[0]=0;
  for(let i=0;i<goal;i++)if(Number.isFinite(costs[i])){
    opts.forEach((o,k)=>{
      const units=Math.round(o.seconds/step);
      if(units<1||Math.abs(units*step-o.seconds)>EPS)throw new Error('Duração incompatível com a precisão de cobrança.');
      const next=i+units, cost=costs[i]+o.credits, count=counts[i]+1;
      if(cost<costs[next]-EPS||(Math.abs(cost-costs[next])<EPS&&count<counts[next])){
        costs[next]=cost;counts[next]=count;prev[next]=i;choice[next]=k;
      }
    });
  }
  let end=goal;
  for(let i=goal+1;i<costs.length;i++)if(costs[i]<costs[end]-EPS)end=i;
  if(!Number.isFinite(costs[end]))throw new Error('Não há composição tarifada para essa duração.');
  const clips=[];
  while(end>0){clips.push(opts[choice[end]]);end=prev[end];}
  return clips.reverse();
}

export function segment(duration,billing){
  const target=positive(duration,'Duração');
  if(target>86400)throw new Error('Duração máxima de planejamento: 86.400s.');
  if(!billing)throw new Error('Regra de consumo ou limites de duração pendentes de confirmação.');
  let clips;
  if(billing.type==='reference'){
    const quoteFor=t=>(billing.options||[]).find(q=>Math.abs(q.seconds-t)<EPS);
    const exact=quoteFor(target);
    if(exact)clips=[exact];
    else if(billing.max&&target>billing.max){
      const maximum=quoteFor(billing.max), whole=Math.floor((target+EPS)/billing.max), rest=target-whole*billing.max;
      const tail=rest>EPS?quoteFor(rest):null;
      if(!maximum||(rest>EPS&&!tail))throw new Error('Não há cotação para todos os segmentos dessa duração.');
      clips=Array.from({length:whole},()=>maximum);if(tail)clips.push(tail);
    }else throw new Error('A fonte confirma apenas '+(billing.options||[]).map(q=>q.seconds+'s').join(' ou ')+'. Informe a tarifa desta duração; não extrapolamos a cotação.');
  }else if(billing.type==='second'||billing.type==='block'){
    const min=positive(billing.min,'Duração mínima'), max=positive(billing.max,'Duração máxima');
    const step=positive(billing.step??1,'Passo da cobrança');
    if(max<min)throw new Error('Duração máxima menor que a mínima.');
    if(billing.strictMin&&target<min-EPS)throw new Error('Duração abaixo de '+min+'s ainda não auditada nesta plataforma.');
    const minUnits=Math.ceil((min-EPS)/step), maxUnits=Math.floor((max+EPS)/step);
    const goal=Math.ceil((target-EPS)/step), rate=Number(billing.rate);
    if(maxUnits<minUnits||!Number.isFinite(rate)||rate<0)throw new Error('Regra de duração ou tarifa inválida.');
    if(billing.type==='block'){
      const block=positive(billing.block,'Bloco de cobrança');
      const options=Array.from({length:maxUnits-minUnits+1},(_,i)=>{
        const seconds=(minUnits+i)*step;
        return {seconds,credits:Math.ceil((seconds-EPS)/block)*rate};
      });
      clips=presetComposition(target,options,step);
    }else{
      const count=Math.ceil(goal/maxUnits);
      let remaining=Math.max(goal,count*minUnits);
      clips=[];
      for(let i=0;i<count;i++){
        // Leave enough duration for every remaining clip: 31s => 27s + 4s, not 30s + 4s.
        const units=Math.min(maxUnits,remaining-(count-i-1)*minUnits);
        const seconds=units*step;clips.push({seconds,credits:seconds*rate});remaining-=units;
      }
    }
  }else if(billing.type==='presets')clips=presetComposition(target,billing.options,.1);
  else throw new Error('Consumo ilimitado ou especial sem regra de custo confirmada.');
  return {clips,segments:clips.length,requested:target,generated:clips.reduce((a,c)=>a+c.seconds,0),credits:clips.reduce((a,c)=>a+c.credits,0)};
}
