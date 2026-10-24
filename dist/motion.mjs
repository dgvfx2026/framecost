// Presentation only. Animation history survives result re-renders within a view.
const REVEALS='.page-head,.focus-panel,.configure,.model,.metric,.resolution-audit,.resolution-option,.results-head,.comparison,.result-row,.pending-data,.retry,.project-teaser,.project-form>.card,.scene,.cost-item,.quote,.source-card,.source-entry,.method,.billing-panel,.fx-strip,.foot';
const LIQUID='.card,.model,.resolution-option,.generation-dashboard>.page-head';
const CONTROL='input,select,textarea,[contenteditable="true"]';
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

function elementKey(element,root){
 const parts=[];
 for(let node=element;node&&node!==root;node=node.parentElement){
  if(node.id){parts.unshift('#'+node.id);break;}
  const siblings=node.parentElement?[...node.parentElement.children].filter(e=>e.localName===node.localName):[];
  parts.unshift(node.localName+':'+siblings.indexOf(node));
 }
 return parts.join('/');
}

export function createMotion(root){
 const hover=matchMedia('(hover: hover) and (pointer: fine)');
 const seen=new Set(),records=new Map(),animations=new Map();
 let view=null,chromeEntered=false,observer=null,active=null,frame=0,previousTime=0;
 let states=new Map();
 root.classList.add('motion-enabled');

 function finish(element){
  const record=records.get(element);
  if(record)seen.add(record.key);
  const animation=animations.get(element);
  if(animation){animation.onfinish=null;animation.cancel();animations.delete(element);}
  element.dataset.reveal='done';
 }

 function reveal(element,delay=0){
  const record=records.get(element);
  if(!record||element.dataset.reveal!=='pending')return;
  seen.add(record.key);observer?.unobserve(element);
  if(record.isChrome)chromeEntered=true;
  if(typeof element.animate!=='function'){finish(element);return;}
  const small=element.matches('.model,.resolution-option,.result-row,.scene,.cost-item,.nav button');
  const distance=small?38:70;
  element.dataset.reveal='playing';
  const animation=element.animate([
   {opacity:0,translate:`0 ${distance}px`,scale:small?'.92':'.94',filter:`blur(${small?8:13}px)`,offset:0},
   {opacity:1,translate:'0 -4px',scale:'1.009',filter:'blur(0px)',offset:.76},
   {opacity:1,translate:'0 0',scale:'1',filter:'blur(0px)',offset:1}
  ],{duration:small?800:1100,delay,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
  animations.set(element,animation);
  animation.onfinish=()=>finish(element);
 }

 function wake(element){
  for(let node=element;node&&node!==root;node=node.parentElement)if(records.has(node))finish(node);
 }

 function resetSurface(state){
  state.element.classList.remove('liquid-active');
  for(const name of ['--liquid-rx','--liquid-ry','--liquid-skew','--liquid-lift'])state.element.style.removeProperty(name);
  for(const name of ['--liquid-x','--liquid-y','--liquid-tail-x','--liquid-tail-y','--liquid-stretch','--liquid-angle'])state.surface.style.removeProperty(name);
 }

 function stopLiquid(){
  if(frame)cancelAnimationFrame(frame);
  frame=0;previousTime=0;active=null;
  for(const state of states.values()){state.over=false;state.live=false;state.engagement=0;state.vx=0;state.vy=0;resetSurface(state);}
 }

 function tick(time){
  frame=0;
  const dt=Math.min(2,(time-(previousTime||time-16.67))/16.67);previousTime=time;
  let moving=false;
  for(const state of states.values()){
   if(!state.live)continue;
   if(!state.element.isConnected){states.delete(state.element);continue;}
   const input=state.element.contains(document.activeElement)&&document.activeElement.matches(CONTROL);
   const targetX=state.over?state.tx:.5,targetY=state.over?state.ty:.5;
   const oldX=state.x,oldY=state.y;
   state.vx=(state.vx+(targetX-state.x)*.105*dt)*Math.pow(.69,dt);
   state.vy=(state.vy+(targetY-state.y)*.105*dt)*Math.pow(.69,dt);
   state.x+=state.vx*dt;state.y+=state.vy*dt;
   state.tailX+=(state.x-state.tailX)*Math.min(1,.075*dt);
   state.tailY+=(state.y-state.tailY)*Math.min(1,.075*dt);
   state.engagement+=((state.over&&!input?1:0)-state.engagement)*Math.min(1,.12*dt);
   const x=clamp(state.x,-.1,1.1),y=clamp(state.y,-.1,1.1);
   const speed=Math.hypot(state.x-oldX,state.y-oldY);
   const angle=Math.atan2(state.y-state.tailY,state.x-state.tailX)*180/Math.PI;
   state.surface.style.setProperty('--liquid-x',(x*100).toFixed(2)+'%');
   state.surface.style.setProperty('--liquid-y',(y*100).toFixed(2)+'%');
   state.surface.style.setProperty('--liquid-tail-x',(state.tailX*100).toFixed(2)+'%');
   state.surface.style.setProperty('--liquid-tail-y',(state.tailY*100).toFixed(2)+'%');
   state.surface.style.setProperty('--liquid-stretch',Math.min(1.75,1+speed*12).toFixed(3));
   state.surface.style.setProperty('--liquid-angle',angle.toFixed(2)+'deg');
   const tilt=state.tilt*state.engagement;
   state.element.style.setProperty('--liquid-rx',((.5-y)*tilt).toFixed(3)+'deg');
   state.element.style.setProperty('--liquid-ry',((x-.5)*tilt).toFixed(3)+'deg');
   state.element.style.setProperty('--liquid-skew',((x-state.tailX)*2*state.engagement).toFixed(3)+'deg');
   state.element.style.setProperty('--liquid-lift',(-3*state.engagement).toFixed(3)+'px');
   const resting=Math.abs(state.vx)+Math.abs(state.vy)+Math.abs(state.x-targetX)+Math.abs(state.y-targetY)+Math.abs(state.x-state.tailX)+Math.abs(state.y-state.tailY)+Math.abs(state.engagement-(state.over&&!input?1:0))<.001;
   if(!state.over&&resting){state.live=false;resetSurface(state);}
   else if(!resting)moving=true;
  }
  if(moving)frame=requestAnimationFrame(tick);else previousTime=0;
 }

 function startTick(){if(!frame)frame=requestAnimationFrame(tick);}

 function leave(){
  if(!active)return;
  active.over=false;active.element.classList.remove('liquid-active');active=null;startTick();
 }

 function ripple(state,x,y){
  const ring=document.createElement('span');ring.className='liquid-ripple';
  ring.style.left=x+'px';ring.style.top=y+'px';
  state.surface.append(ring);
  const size=Math.max(state.element.clientWidth,state.element.clientHeight)*1.7;
  const animation=ring.animate([
   {opacity:.7,transform:'translate(-50%,-50%) scale(.03)'},
   {opacity:.3,offset:.35},
   {opacity:0,transform:'translate(-50%,-50%) scale(1)'}
  ],{duration:1150,easing:'cubic-bezier(.14,.72,.24,1)'});
  ring.style.width=size+'px';ring.style.height=size+'px';
  animation.onfinish=()=>ring.remove();
 }

 function move(event){
  if(!hover.matches||event.pointerType==='touch')return;
  const element=event.target.closest?.('.liquid-card');
  if(!element||!root.contains(element)){leave();return;}
  const state=states.get(element);if(!state)return;
  const rect=element.getBoundingClientRect();
  const x=clamp((event.clientX-rect.left)/rect.width,0,1),y=clamp((event.clientY-rect.top)/rect.height,0,1);
  if(active!==state){
   leave();active=state;state.over=true;state.live=true;state.x=x;state.y=y;state.tailX=x;state.tailY=y;
   state.element.classList.add('liquid-active');
   ripple(state,event.clientX-rect.left,event.clientY-rect.top);
  }
  state.tx=x;state.ty=y;state.live=true;startTick();
 }

 function beforeRender(){
  observer?.disconnect();observer=null;
  for(const element of animations.keys())finish(element);
  stopLiquid();
  for(const surface of root.querySelectorAll('.liquid-surface'))surface.remove();
  for(const element of root.querySelectorAll('.liquid-card'))element.classList.remove('liquid-card');
  states=new Map();records.clear();
 }

 function sync(nextView){
  root.dataset.motionMode='automatic';
  root.dataset.pointerMode=hover.matches?'fine':'coarse';
  if(nextView!==view){seen.clear();view=nextView;}
  const targets=[...root.querySelectorAll(REVEALS)];
  const chrome=[...root.querySelectorAll('.sidebar,.nav button,.topbar')];
  const enterChrome=!chromeEntered;
  if('IntersectionObserver' in window){
   observer=new IntersectionObserver(entries=>{
    let order=0;
    for(const entry of entries)if(entry.isIntersecting)reveal(entry.target,Math.min(order++*65,390));
   },{rootMargin:'0px 0px -38px 0px',threshold:0});
  }
  for(const element of [...chrome,...targets]){
   const key=elementKey(element,root),isChrome=chrome.includes(element);
   records.set(element,{key,isChrome});
   if(!observer||seen.has(key)||(isChrome&&!enterChrome)||element.contains(document.activeElement)){
    finish(element);continue;
   }
   element.dataset.reveal='pending';
   if(isChrome)reveal(element,chrome.indexOf(element)*65);else observer.observe(element);
  }
  for(const element of root.querySelectorAll(LIQUID)){
    element.classList.add('liquid-card');
    const surface=document.createElement('span');surface.className='liquid-surface';surface.setAttribute('aria-hidden','true');
    surface.innerHTML='<span class="liquid-rim"></span><span class="liquid-flow"><i></i><i></i><i></i></span><span class="liquid-reflection"></span>';
    element.append(surface);
    if(hover.matches&&typeof Element.prototype.animate==='function')states.set(element,{element,surface,over:false,live:false,x:.5,y:.5,tx:.5,ty:.5,tailX:.5,tailY:.5,vx:0,vy:0,engagement:0,tilt:clamp(1400/Math.max(element.clientWidth,element.clientHeight,1),1.2,4)});
  }
 }

 function preferenceChanged(){beforeRender();sync(view);}
 root.addEventListener('pointermove',move,{passive:true});
 root.addEventListener('pointerleave',leave,{passive:true});
 root.addEventListener('focusin',event=>{wake(event.target);leave();});
 root.addEventListener('pointerdown',event=>{
  wake(event.target);
  if(!active||event.pointerType==='touch')return;
  const rect=active.element.getBoundingClientRect();ripple(active,event.clientX-rect.left,event.clientY-rect.top);
 },{passive:true});
 window.addEventListener('scroll',leave,{passive:true});
 window.addEventListener('blur',leave);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stopLiquid();});
 hover.addEventListener('change',preferenceChanged);
 window.addEventListener('beforeprint',()=>{stopLiquid();for(const element of records.keys())finish(element);});
 let dialogAnimation=null;
 function enterDialog(element){
  if(typeof element.animate!=='function')return;
  dialogAnimation?.cancel();
  dialogAnimation=element.animate([
   {opacity:0,translate:'0 36px',scale:'.92',filter:'blur(9px)'},
   {opacity:1,translate:'0 0',scale:'1',filter:'blur(0px)'}
  ],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'});
 }
 return {beforeRender,sync,enterDialog};
}
