// Commercial facts reviewed on 2026-10-23. Never replace null with an invented value.
export const REVIEWED='2026-10-23';
export const sources={
 magnific:{name:'Magnific · preços oficiais',url:'https://www.magnific.com/pricing',date:REVIEWED},
 magnificArchive:{name:'Magnific · tabela oficial alternativa (pode divergir da atual)',url:'https://www.magnific.com/pricing/136053124',date:REVIEWED},
 runway:{name:'Runway · preços oficiais',url:'https://runway.com/pricing',date:REVIEWED},
 runwayRates:{name:'Runway Academy · créditos por modelo',url:'https://academy.runwayml.com/models-pricing',date:REVIEWED},
 runwayCredits:{name:'Runway · validade e ordem dos saldos',url:'https://help.runwayml.com/hc/en-us/articles/15124877443219-How-do-credits-work',date:REVIEWED},
 runwayPacks:{name:'Runway · créditos comprados e preço',url:'https://help.runwayml.com/hc/en-us/articles/23987639973267-Will-unused-credits-carry-over-after-my-billing-day',date:REVIEWED},
 runwayS2:{name:'Runway · limites Seedance 2.0',url:'https://help.runwayml.com/hc/en-us/articles/50488490233363-Creating-with-Seedance-2-0',date:REVIEWED},
 runwayS25:{name:'Runway · limites e tarifas Seedance 2.5',url:'https://help.runwayml.com/hc/en-us/articles/53542207042323-Creating-with-Seedance-2-5',date:REVIEWED},
 higgsfield:{name:'Higgsfield · preços oficiais (conteúdo dinâmico)',url:'https://higgsfield.ai/pricing',date:REVIEWED},
 higgsKling:{name:'Higgsfield · Kling 4.0 e plano Plus',url:'https://higgsfield.ai/blog/kling-4-0-on-higgsfield',date:REVIEWED},
 higgsWan:{name:'Higgsfield · lançamento Wan 3.0 / Prime',url:'https://higgsfield.ai/creator-hub/changelog',date:REVIEWED},
 seedance:{name:'Higgsfield · guia Seedance',url:'https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-seedance',date:REVIEWED},
 krea:{name:'Krea · preços e acesso aos modelos',url:'https://www.krea.ai/pricing',date:REVIEWED},
 sjinn:{name:'SJinn · preços oficiais',url:'https://sjinn.ai/pricing',date:REVIEWED},
 fx:{name:'Frankfurter · referência cambial',url:'https://frankfurter.dev',date:null}
};
export const models=[
 {id:'seedance-2',name:'Seedance 2.0',family:'ByteDance',short:'S',max:15,source:'seedance',desc:'Referências multimodais e controle de cena.'},
 {id:'seedance-25',name:'Seedance 2.5',family:'ByteDance',short:'S',max:30,source:'seedance',desc:'Cenas cinematográficas com áudio sincronizado.'},
 {id:'kling-3',name:'Kling 3.0',family:'Kuaishou',short:'K',max:15,source:'higgsKling',desc:'Movimento, personagens e narrativa em múltiplos planos.'},
 {id:'kling-4',name:'Kling 4.0',family:'Kuaishou',short:'K',max:30,source:'higgsKling',desc:'Referências, keyframes e cenas de até 30 segundos.'},
 {id:'wan-3',name:'Wan 3.0',family:'Alibaba',short:'W',max:30,source:'higgsWan',desc:'Geração com áudio e cenas mais longas.'},
 {id:'wan-prime',name:'Wan 3.0 Prime',family:'Alibaba',short:'W',max:30,source:'higgsWan',desc:'Variante Prime; tarifa própria por plataforma.'}
];
export const platforms=[
 {id:'higgsfield',name:'Higgsfield',mark:'H',color:'#d7fb80',source:'higgsfield',note:'Tabela dinâmica e planos conflitantes. Plus citado no artigo oficial; contratação exige confirmação. Promoções ilimitadas não foram precificadas como créditos gratuitos.'},
 {id:'magnific',name:'Magnific',mark:'M',color:'#9fa1ff',source:'magnific',note:'Antiga Freepik. Preços originais em BRL, cobrança anual e créditos anuais disponíveis no período. Premium promocional até 26/10/2026.'},
 {id:'runway',name:'Runway',mark:'R',color:'#f1f1ed',source:'runway',note:'Créditos mensais mesmo na assinatura anual. A API usa saldo separado. Adicionais: estratégia conservadora em pacotes de 1.000 créditos por US$ 10.'},
 {id:'sjinn',name:'SJinn',mark:'S',color:'#ffb889',source:'sjinn',note:'Planos publicados com 40% de desconto anual. A tarifa genérica “seedance” não confirma a versão 2.5. Wan 3.0 ilimitado depende do Tool Mode; custo marginal não inferido.'},
 {id:'krea',name:'Krea',mark:'k',color:'#91c5ff',source:'krea',note:'Computação em units. A tabela publica capacidades aproximadas, insuficientes para deduzir tarifas exatas. Seedance 2.5 exige Pro ou superior. Pacotes extras válidos por 90 dias.'}
];
const plan=(id,platform,name,price,credits,currency,period,source,extra={})=>({id,platform,name,price,credits,currency,period,source,status:'verified',creditPeriod:period,topup:null,limits:'',...extra});
export const plans=[
 plan('mag-premium','magnific','Premium',354,240000,'BRL','annual','magnific',{expires:'1 ano, sem reset mensal',validUntil:'2026-10-26',limits:'Oferta: R$ 29,50/mês, R$ 354 cobrados no ano. Renovação promocional não confirmada.'}),
 plan('mag-plus','magnific','Premium+',1620,600000,'BRL','annual','magnific',{expires:'1 ano, sem reset mensal',limits:'R$ 135/mês equivalentes. Ilimitado de outros modelos não aplicado a esta simulação.'}),
 plan('mag-pro','magnific','Pro Starter',3960,1500000,'BRL','annual','magnific',{expires:'1 ano, sem reset mensal',limits:'R$ 330/mês equivalentes; faixa de 1,5 milhão de créditos/ano.'}),
 ...[['standard','Standard',15,12,625],['pro','Pro',35,28,2250],['max','Max',95,76,9500]].flatMap(([id,name,monthly,annual,c])=>['monthly','annual'].map(period=>plan('rw-'+id+'-'+period,'runway',name,period==='monthly'?monthly:annual*12,c,'USD',period,'runway',{creditPeriod:'monthly',expires:id==='max'?'Até 1 mês de rollover':'Expiram no fim do ciclo mensal',topup:{credits:1000,price:10,source:'runwayPacks'},limits:'Créditos renovados mensalmente; adicionais não expiram. '+(period==='annual'?'Pagamento anual integral; não libera 12 meses de créditos de uma vez.':'')}))),
 plan('hf-plus','higgsfield','Plus · referência editorial',49,1000,'USD','monthly','higgsKling',{status:'estimated',expires:'Pendente de confirmação',limits:'Preço citado em artigo de 20/10/2026. Divergência entre planos públicos; confirmar antes de contratar.'}),
 ...[['basic','Basic',9,5000],['pro','Pro',35,20000],['max','Max',105,60000],['business','Business',200,80000]].map(([id,n,p,c])=>plan('kr-'+id,'krea',n,p,c,'USD','monthly','krea',{expires:'Ciclo mensal; extras: 90 dias',limits:'Preço mensal regular exibido. Consumo exato por configuração pendente.'})),
 ...[['standard','Standard',12,20000],['pro','Pro',30,60000],['ultra','Ultra',60,120000],['enterprise','Enterprise',720,1200000]].map(([id,n,p,c])=>plan('sj-'+id,'sjinn',n,p*12,c,'USD','annual','sjinn',{status:'estimated',creditPeriod:'monthly',expires:'Pendente de confirmação',limits:'Periodicidade anual inferida do desconto anunciado; confirmar antes de contratar. Valor mensal equivalente com desconto anual de 40%; confirmar condições na contratação.'}))
];
const rule=(id,platform,model,resolution,billing,source,extra={})=>({id,platform,model,resolution,billing,source,status:'verified',mode:'Texto / imagem',quality:'Padrão',audio:'Não discriminado na tarifa',...extra});
export const rules=[
 rule('mag-s2','magnific','seedance-2','720p',{type:'presets',options:[{seconds:4,credits:1120}]},'magnific',{quality:'Pro',note:'Cenário conservador: composição com clipes de 4s publicados; não infere preço de clipes maiores.'}),
 ...[['720p',1760],['1080p',4400]].map(([r,c])=>rule('mag-s25-'+r,'magnific','seedance-25',r,{type:'presets',options:[{seconds:4,credits:c}]},'magnific',{note:'Somente o clipe de 4s tem tarifa cadastrada. Conteúdos maiores são compostos em vários clipes de 4s.'})),
 rule('mag-k3','magnific','kling-3','1080p',{type:'presets',options:[{seconds:5,credits:450}]},'magnific',{quality:'Pro',note:'Tarifa publicada para clipe de 5s. Áudio não discriminado; não participa de ranking com áudio confirmado.'}),
 rule('mag-k4','magnific','kling-4','1080p',{type:'presets',options:[{seconds:3,credits:840}]},'magnific',{note:'Tarifa publicada sem entrada de vídeo, em clipes de 3s.'}),
 ...[['wan-3',400],['wan-prime',680]].map(([m,c])=>rule('mag-'+m,'magnific',m,'1080p',{type:'presets',options:[{seconds:2,credits:c}]},'magnificArchive',{status:'estimated',note:'Tabela oficial alternativa com promoção; modelo ausente na tabela principal atual. Confirme no gerador.'})),
 ...[['480p',36],['720p',36],['1080p',40]].map(([r,c])=>rule('rw-s2-'+r,'runway','seedance-2',r,{type:'second',rate:c,min:5,max:15,step:1},'runwayRates',{status:'estimated',quality:'Pro',audio:'Áudio nativo',note:'Tarifa confirmada. Guia de criação publica mínimo 5s, enquanto a tabela de preços cita 4s. Usamos mínimo conservador de 5s. Limites: fonte runwayS2; confirme na conta.'})),
 ...[['480p',20],['720p',30],['1080p',68]].map(([r,c])=>rule('rw-s25-'+r,'runway','seedance-25',r,{type:'second',rate:c,min:4,max:30,step:1},'runwayS25',{audio:'Áudio nativo',note:'Texto/imagem, sem vídeo de referência. Vídeo de entrada tem cobrança adicional e não está incluído.'})),
 ...[['480p',5],['720p',10],['1080p',20]].map(([r,c])=>rule('rw-wan-'+r,'runway','wan-3',r,{type:'second',rate:c,min:2,max:30,step:1},'runwayRates',{status:'estimated',audio:'Áudio nativo',note:'Tarifa de saída confirmada; limites 2–30s vêm do modelo no Higgsfield e exigem confirmação específica na Runway.'})),
 ...[['720p',25,150],['1080p',37.5,225]].map(([r,a,b])=>rule('hf-k4-'+r,'higgsfield','kling-4',r,{type:'presets',options:[{seconds:5,credits:a},{seconds:30,credits:b}]},'higgsKling',{audio:'Áudio nativo',note:'Somente durações tarifadas de 5s e 30s; sem interpolar os demais comprimentos.'}))
];
export function getRules(planId,modelId,resolution,manual=[]){const p=[...plans,...manual.map(x=>x.plan)].find(x=>x.id===planId);return p? [...rules,...manual.map(x=>x.rule)].filter(x=>x.platform===p.platform&&x.model===modelId&&(!resolution||x.resolution===resolution)&&(!x.planId||x.planId===p.id)):[]}
export function availability(platform,model){if(rules.some(r=>r.platform===platform&&r.model===model))return 'verified';if(platform==='krea')return 'verified';if(platform==='sjinn'&&['seedance-25','wan-3'].includes(model))return 'verified';return 'pending'}
