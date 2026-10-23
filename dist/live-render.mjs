// Update computed results without ever detaching the field being edited.
// Number inputs do not support setSelectionRange; restoring focus resets their caret.
export function renderLive(root,html){
  const active=root.ownerDocument.activeElement;
  const editing=active?.matches('input:not([type=checkbox]):not([type=radio]), textarea')&&root.contains(active)&&active.id;
  if(!editing){root.innerHTML=html;return false;}
  const template=root.ownerDocument.createElement('template');
  template.innerHTML=html;
  const replacement=template.content.querySelector('#'+CSS.escape(active.id));
  if(!replacement){root.innerHTML=html;return false;}
  const path=[];
  let current=active,next=replacement;
  while(current!==root){
    if(!next||current.nodeName!==next.nodeName){root.innerHTML=html;return false;}
    path.push([current,next]);current=current.parentNode;next=next.parentNode;
  }
  path.push([root,template.content]);
  // Every ancestor on this path stays mounted. Only its siblings are replaced.
  for(let i=0;i<path.length;i++){
    const [element,fresh]=path[i];
    if(i!==path.length-1){
      for(const attr of [...element.attributes])if(!fresh.hasAttribute(attr.name)&&!(i===0&&attr.name==='value'))element.removeAttribute(attr.name);
      for(const attr of fresh.attributes)if(!(i===0&&attr.name==='value')&&element.getAttribute(attr.name)!==attr.value)element.setAttribute(attr.name,attr.value);
    }
    if(i===0)continue;
    const [branch,freshBranch]=path[i-1];
    for(const child of [...element.childNodes])if(child!==branch)child.remove();
    let after=false;
    for(const child of fresh.childNodes){
      if(child===freshBranch){after=true;continue;}
      if(after)element.append(child.cloneNode(true));else element.insertBefore(child.cloneNode(true),branch);
    }
  }
  return true;
}
