// Official commercial sources and native app quotes; derivations are explicit in notes.
export const REVIEWED='2026-10-23';
export const CATALOG_VERSION=2;
const source=(name,url,note='')=>({name,url,date:REVIEWED,note});
export const sources={
 magnific:source('Magnific · preços BRL, mensal e anual','https://www.magnific.com/pricing','Alternância mensal/anual conferida no navegador; preços regionais brasileiros.'),
 magnificCredits:source('Magnific · créditos por segundo','https://www.magnific.com/ai/docs/ai-video-generator-credits'),
 magnificPlans:source('Magnific · alocações por ciclo','https://www.magnific.com/ai/docs/plans-and-pricing'),
 magnificLengths:source('Magnific · limites de duração','https://www.magnific.com/blog/ai-video-length/'),
 magnificSeedance25:source('Magnific · Seedance 2.5','https://www.magnific.com/seedance/seedance-2-5','A página de lançamento ainda diz Coming soon; o catálogo atual lista o modelo. Confirme a disponibilidade na conta.'),
 magnificKling:source('Magnific · Kling, qualidade e áudio','https://www.magnific.com/ai/kling'),
 magnificWan:source('Magnific · Wan 3.0, 2–30s','https://www.magnific.com/wan-3-0'),
 magnificWanPrime:source('Magnific · Wan 3.0 e Prime, mesmas especificações','https://www.magnific.com/blog/wan-3-0-generations/','Prime usa as mesmas especificações e limite de 30s. Preços do artigo de lançamento divergem da central de créditos atual; o cálculo usa a central de créditos, com 780p literal.'),
 runway:source('Runway · preços e créditos','https://runway.com/pricing'),
 runwayRates:source('Runway Academy · tarifas por modelo','https://academy.runwayml.com/models-pricing'),
 runwayWeb:source('Runway Creative · modelos, limites e cotações no app','https://app.runwayml.com','Tool → Video, modo visitante, 23/10/2026. Wan e Prime: 2–30s. Prime de 5s: 34/70/140 créditos em 480p/720p/1080p. Kling 4: 3–30s; curva 1080p conferida de 3 a 29s, sem vídeo de entrada. Nenhuma geração executada.'),
 runwayKlingSpecs:source('Runway · especificações Kling 3','https://docs.dev.runwayml.com/assets/inputs/','Usado somente para duração de 3–15s e variantes Standard 720p / Pro 1080p. Tarifas da assinatura vêm da Runway Academy, não de saldo ou preço em dólares da API.'),
 runwayS2:source('Runway · Seedance 2.0','https://help.runwayml.com/hc/en-us/articles/50488490233363-Creating-with-Seedance-2-0','O guia indica 5–15s; o exemplo de preço cita 4s. Duração de 4s fica pendente.'),
 runwayS25:source('Runway · Seedance 2.5, 4–30s','https://help.runwayml.com/hc/en-us/articles/53542207042323-Creating-with-Seedance-2-5'),
 runwayCredits:source('Runway · origem e validade dos créditos','https://help.runwayml.com/hc/en-us/articles/15124877443219-How-do-credits-work'),
 runwayPacks:source('Runway · créditos adicionais','https://help.runwayml.com/hc/en-us/articles/23987639973267-Will-unused-credits-carry-over-after-my-billing-day'),
 higgsfield:source('Higgsfield · tabela dinâmica carregada','https://higgsfield.ai/pricing','Mensal/anual verificados no navegador. Planos atuais Starter, Plus e Ultra. Tarifas com ~ são aproximadas.'),
 higgsKling:source('Higgsfield · Kling 4.0, cotações de 5s e 30s','https://higgsfield.ai/blog/kling-4-0-on-higgsfield'),
 higgsWan:source('Higgsfield · Wan 3.0 e Prime','https://higgsfield.ai/creator-hub/changelog'),
 seedance:source('Higgsfield · guia Seedance','https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-seedance'),
 krea:source('Krea · preços e units','https://www.krea.ai/pricing','Dois ciclos conferidos. Basic anual: US$ 5,25/mês na tabela detalhada, apesar de card arredondado para US$ 5.'),
 sjinn:source('SJinn · mensalidades e anuidades','https://sjinn.ai/pricing','Mensal: Lite 9,90, Standard 19,90, Pro 49,90, Ultra 99 e Enterprise 999 USD. Não deduzidos do percentual de desconto.'),
 fx:{name:'Frankfurter · referência cambial',url:'https://frankfurter.dev',date:null}
};
export const models=[
 {id:'seedance-2',name:'Seedance 2.0',family:'ByteDance',short:'S',max:15,source:'seedance'},
 {id:'seedance-25',name:'Seedance 2.5',family:'ByteDance',short:'S',max:30,source:'seedance'},
 {id:'kling-3',name:'Kling 3.0',family:'Kuaishou',short:'K',max:15,source:'higgsKling'},
 {id:'kling-4',name:'Kling 4.0',family:'Kuaishou',short:'K',max:30,source:'higgsKling'},
 {id:'wan-3',name:'Wan 3.0',family:'Alibaba',short:'W',max:30,source:'higgsWan'},
 {id:'wan-prime',name:'Wan 3.0 Prime',family:'Alibaba',short:'W',max:30,source:'higgsWan'}
];
export const platforms=[
 {id:'higgsfield',name:'Higgsfield',mark:'H',color:'#d7fb80',source:'higgsfield',note:'Preços atuais Starter, Plus e Ultra. Créditos mensais nos dois ciclos. Tarifas aproximadas (~) desativadas por padrão. Ilimitado promocional não equivale a custo zero.'},
 {id:'magnific',name:'Magnific',mark:'M',color:'#9fa1ff',source:'magnific',note:'Preços regionais BRL. Premium+ mensal inclui 45 mil créditos; anual inclui 600 mil/ano. Pro Starter mensal: 112,5 mil; anual: 1,5 milhão. Alocações auditadas separadamente.'},
 {id:'runway',name:'Runway',mark:'R',color:'#f1f1ed',source:'runway',note:'Créditos mensais nos dois ciclos de cobrança. API usa outro saldo. Recargas simuladas em pacotes documentados de 1.000 créditos por US$ 10.'},
 {id:'sjinn',name:'SJinn',mark:'S',color:'#ffb889',source:'sjinn',note:'Mensal/anual verificados ao alternar a página. A tarifa genérica seedance não identifica versão; os seis modelos exigem tarifa exata para cálculo.'},
 {id:'krea',name:'Krea',mark:'k',color:'#91c5ff',source:'krea',note:'Units mensais nos dois ciclos. Contagens aproximadas de vídeos não são tarifas. Seedance 2.5 exige Pro ou superior. Pacotes comprados: 90 dias.'}
];
function plan(id,platform,name,price,credits,currency,period,extra={}){
 return {id,platform,name,family:platform+'-'+name,price,credits,currency,period,creditPeriod:'monthly',source:platform,status:'verified',topup:null,expires:'Validade pendente',limits:'',...extra};
}
export const plans=[
 plan('mag-premium-monthly','magnific','Premium',80,20000,'BRL','monthly',{region:'BR',expires:'Ciclo mensal',limits:'R$ 80 cobrados por mês; 20.000 créditos mensais.'}),
 plan('mag-plus-monthly','magnific','Premium+',180,45000,'BRL','monthly',{region:'BR',expires:'Ciclo mensal',limits:'R$ 180 cobrados por mês; 45.000 créditos mensais.'}),
 plan('mag-pro-monthly','magnific','Pro Starter',440,112500,'BRL','monthly',{region:'BR',expires:'Ciclo mensal',limits:'R$ 440 cobrados por mês; 112.500 créditos mensais.'}),
 plan('mag-premium','magnific','Premium',354,240000,'BRL','annual',{region:'BR',creditPeriod:'annual',expires:'Um ano, sem reset mensal',validUntil:'2026-10-26',limits:'Promoção: R$ 29,50/mês equivalentes × 12 = R$ 354/ano. Renovação promocional não confirmada.'}),
 plan('mag-plus','magnific','Premium+',1620,600000,'BRL','annual',{region:'BR',creditPeriod:'annual',expires:'Um ano, sem reset mensal',limits:'R$ 135/mês equivalentes; R$ 1.620/ano; 600.000 créditos anuais.'}),
 plan('mag-pro','magnific','Pro Starter',3960,1500000,'BRL','annual',{region:'BR',creditPeriod:'annual',expires:'Um ano, sem reset mensal',limits:'R$ 330/mês equivalentes; R$ 3.960/ano; 1,5 milhão de créditos anuais.'}),
 ...[['standard','Standard',15,12,625],['pro','Pro',35,28,2250],['max','Max',95,76,9500]].flatMap(([id,n,m,a,c])=>['monthly','annual'].map(period=>plan('rw-'+id+'-'+period,'runway',n,period==='monthly'?m:a*12,c,'USD',period,{expires:id==='max'?'Rollover de até um mês':'Expiram no ciclo mensal',topup:{credits:1000,price:10,source:'runwayPacks'},limits:period==='annual'?'Cobrança anual integral; apenas créditos mensais disponíveis agora.':''}))),
 ...[['starter','Starter',15,15,200],['plus','Plus',49,39,1000],['ultra','Ultra',129,99,3000]].flatMap(([id,n,m,a,c])=>['monthly','annual'].map(period=>plan('hf-'+id+'-'+period,'higgsfield',n,period==='monthly'?m:a*12,c,'USD',period,{limits:(id==='starter'?'Modelos selecionados: compatibilidade dos seis modelos ainda pendente.':'Sem valorar ilimitado promocional como gratuito.')+(period==='annual'?' Pagamento anual, créditos mensais.':'')}))),
 ...[['basic','Basic',9,5.25,5000],['pro','Pro',35,21,20000],['max','Max',105,63,60000],['business','Business',200,160,80000]].flatMap(([id,n,m,a,c])=>['monthly','annual'].map(period=>plan('kr-'+id+(period==='annual'?'-annual':''),'krea',n,period==='monthly'?m:a*12,c,'USD',period,{expires:'Ciclo mensal; extras: 90 dias',limits:'Units mensais. Consumo exato por configuração não deduzido de vídeos aproximados.'}))),
 ...[['lite','Lite',9.9,6,8000],['standard','Standard',19.9,12,20000],['pro','Pro',49.9,30,60000],['ultra','Ultra',99,60,120000],['enterprise','Enterprise',999,720,1200000]].flatMap(([id,n,m,a,c])=>['monthly','annual'].map(period=>plan('sj-'+id+(period==='monthly'?'-monthly':''),'sjinn',n,period==='monthly'?m:a*12,c,'USD',period,{limits:period==='monthly'?'Mensalidade conferida com Monthly selecionado. Consumo por versão pendente.':'Yearly selecionado: valor mensal equivalente × 12; créditos mensais. Consumo por versão pendente.'})))
];
const perSecond=(rate,min,max,extra={})=>({type:'second',rate,min,max,step:1,...extra});
function rule(id,platform,model,resolution,billing,source,extra={}){return {id,platform,model,resolution,billing,source,status:'verified',quality:'Padrão',mode:'Texto / imagem',audio:'Não discriminado na tarifa',...extra};}
const hfPaid=plans.filter(p=>p.platform==='higgsfield'&&p.name!=='Starter').map(p=>p.id);
export const rules=[
 ...[['480p',145],['720p',280],['1080p',700]].map(([r,c])=>rule('mag-s2-'+r,'magnific','seedance-2',r,perSecond(c,4,15),'magnificCredits',{limitsSource:'magnificLengths',audio:'Áudio nativo',note:'Tarifa por segundo; clipes de até 15s. Sem vídeo de referência.'})),
 ...[['480p',200],['720p',440],['1080p',1100]].map(([r,c])=>rule('mag-s25-'+r,'magnific','seedance-25',r,perSecond(c,4,30),'magnificCredits',{limitsSource:'magnificSeedance25',audio:'Áudio nativo',note:'Modo padrão, separado de Draft. Limite 4–30s. Disponibilidade individual deve ser confirmada na conta.'})),
 ...[['720p',70,'Standard'],['1080p',90,'Pro']].map(([r,c,q])=>rule('mag-k3-'+r,'magnific','kling-3',r,perSecond(c,5,15,{strictMin:true}),'magnificKling',{quality:q,audio:'Sem áudio',note:'Tarifa sem áudio; duração abaixo de 5s não auditada, sem arredondamento silencioso.'})),
 ...[['720p',105,'Standard'],['1080p',140,'Pro']].map(([r,c,q])=>rule('mag-k3-audio-'+r,'magnific','kling-3',r,perSecond(c,5,15,{strictMin:true}),'magnificKling',{quality:q,klingAudio:true,audio:'Áudio nativo',note:'Variante com áudio; preço distinto da variante sem áudio.'})),
 rule('mag-k4','magnific','kling-4','1080p',{type:'reference',options:[{seconds:3,credits:840}]},'magnific',{note:'Apenas cotação de 3s confirmada. Não inferimos tarifa linear ou clipes maiores.'}),
 ...[['480p',60],['780p',120],['1080p',240]].map(([r,c])=>rule('mag-wan-'+r,'magnific','wan-3',r,perSecond(c,2,30),'magnificCredits',{limitsSource:'magnificWan',audio:'Áudio nativo',note:r==='780p'?'A documentação publica 780p. Mantido literalmente, sem renomear para 720p.':'Tarifa de lista; descartados descontos divergentes de páginas alternativas.'})),
 ...[['480p',100],['780p',200],['1080p',400]].map(([r,c])=>rule('mag-prime-'+r,'magnific','wan-prime',r,perSecond(c,2,30,{strictMin:true}),'magnificCredits',{limitsSource:'magnificWanPrime',audio:'Áudio nativo',note:'Prime: mesmas especificações de Wan 3, confirmado no artigo da plataforma. Tarifa da central de créditos atual; o artigo de lançamento diverge. 780p mantido como publicado na central.'})),
 ...[['480p',36],['720p',36],['1080p',40]].map(([r,c])=>rule('rw-s2-'+r,'runway','seedance-2',r,perSecond(c,5,15,{strictMin:true}),'runwayRates',{limitsSource:'runwayS2',audio:'Áudio nativo',note:'Guia: 5–15s. Exemplo de 4s conflitante: abaixo de 5s fica pendente.'})),
 ...[['480p',20],['720p',30],['1080p',68]].map(([r,c])=>rule('rw-s25-'+r,'runway','seedance-25',r,perSecond(c,4,30),'runwayS25',{audio:'Áudio nativo',note:'Sem vídeo de entrada. A tarifa adicional de referência de vídeo não está incluída.'})),
 ...[['720p',9,13,'Standard'],['1080p',12,17,'Pro']].flatMap(([r,silent,audio,q])=>[false,true].map(klingAudio=>rule('rw-k3-'+r+(klingAudio?'-audio':''),'runway','kling-3',r,perSecond(klingAudio?audio:silent,3,15,{strictMin:true}),'runwayRates',{quality:q,klingAudio,audio:klingAudio?'Áudio nativo':'Sem áudio',limitsSource:'runwayKlingSpecs',note:'Kling 3 '+q+' na assinatura Runway. O seletor de áudio escolhe a tarifa correspondente.'}))),
 rule('rw-k4-1080p','runway','kling-4','1080p',perSecond(23.5,3,30,{strictMin:true,creditRounding:'nearest'}),'runwayWeb',{audio:'Áudio nativo',validUntil:'2026-11-30',note:'Curva nativa 1080p: 3s=71, 5s=118, 8s=188, 15s=353, 29s=682 cr. A taxa derivada de 23,5 cr./s com arredondamento por clipe reproduz as 27 durações conferidas. Observada na promoção de 25% até 30/11/2026; não aplicar desconto novamente. Sem vídeo de entrada.'}),
 rule('rw-k4-720p','runway','kling-4','720p',null,'runwayWeb',{status:'pending',audio:'Áudio nativo',note:'Kling 4 está disponível no Runway em 720p. A tarifa de 720p ainda não foi confirmada neste catálogo; o cálculo em 1080p está disponível.'}),
 ...[['480p',5],['720p',10],['1080p',20]].map(([r,c])=>rule('rw-wan-'+r,'runway','wan-3',r,perSecond(c,2,30,{strictMin:true}),'runwayRates',{limitsSource:'runwayWeb',audio:'Áudio nativo',note:'Tarifa da assinatura na Academy; limites 2–30s conferidos no seletor nativo do Runway.'})),
 ...[['480p',6.8],['720p',14],['1080p',28]].map(([r,c])=>rule('rw-prime-'+r,'runway','wan-prime',r,perSecond(c,2,30,{strictMin:true}),'runwayWeb',{limitsSource:'runwayWeb',audio:'Áudio nativo',note:'Tarifa conferida na assinatura: 5s custam 34/70/140 cr. em 480p/720p/1080p. O cálculo preserva a precisão da taxa por segundo; o indicador nativo arredonda a apresentação.'})),
 ...[['seedance-2','720p',22],['seedance-2','1080p',60],['kling-3','720p',7],['kling-3','1080p',8]].map(([m,r,c])=>rule('hf-'+m+'-'+r,'higgsfield',m,r,{type:'reference',options:[{seconds:5,credits:c}]},'higgsfield',{status:'estimated',planIds:hfPaid,note:'A tabela usa ~. Cotação aproximada somente para 5s, sem extrapolação.'})),
 ...[['wan-3','480p',5],['wan-3','720p',8.75],['wan-3','1080p',17.5],['wan-prime','480p',7.5],['wan-prime','720p',15],['wan-prime','1080p',30]].map(([m,r,c])=>rule('hf-'+m+'-'+r,'higgsfield',m,r,{type:'reference',options:[{seconds:5,credits:c}]},'higgsfield',{planIds:hfPaid,audio:'Áudio nativo',note:'Cotação confirmada para 5s. Outras durações exigem tarifa própria.'})),
 ...[['720p',25,150],['1080p',37.5,225]].map(([r,a,b])=>rule('hf-k4-'+r,'higgsfield','kling-4',r,{type:'reference',max:30,options:[{seconds:5,credits:a},{seconds:30,credits:b}]},'higgsKling',{planIds:hfPaid,audio:'Áudio nativo',note:'Cotações de 5s e 30s. Composição só acima do máximo de 30s e com todos os segmentos cotados.'}))
];
export function ruleMatches(p,r,c){return r.platform===p.platform&&r.model===c.model&&r.resolution===c.resolution&&(!r.planId||r.planId===p.id)&&(!r.planIds||r.planIds.includes(p.id));}
export function getRules(planId,modelId,resolution,manual=[]){const p=[...plans,...manual.map(x=>x.plan)].find(x=>x.id===planId);return p?[...rules,...manual.map(x=>x.rule)].filter(r=>r.platform===p.platform&&r.model===modelId&&(!resolution||r.resolution===resolution)&&(!r.planId||r.planId===p.id)&&(!r.planIds||r.planIds.includes(p.id))):[];}
export function availability(platform,model){return rules.some(r=>r.platform===platform&&r.model===model&&r.status==='verified')?'verified':'pending';}
