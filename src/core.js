"use strict";
/* ================= yardımcılar ================= */
const $=(s,r)=>(r||document).querySelector(s);
const R2D=180/Math.PI,D2R=Math.PI/180,PI=Math.PI;
const W=640,HT=440,U=40;
const norm360=a=>((a%360)+360)%360;
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),add=(a,b)=>({x:a.x+b.x,y:a.y+b.y}),mul=(a,k)=>({x:a.x*k,y:a.y*k});
const len=v=>Math.hypot(v.x,v.y),dist=(a,b)=>len(sub(a,b)),cross=(a,b)=>a.x*b.y-a.y*b.x,dot=(a,b)=>a.x*b.x+a.y*b.y;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,lerpP=(p,q,t)=>({x:lerp(p.x,q.x,t),y:lerp(p.y,q.y,t)});
const mid=(a,b)=>lerpP(a,b,.5);
const f=n=>(+n).toFixed(1),f2=n=>(+n).toFixed(2);
function tr(n,d){d=d==null?1:d;let s=(+n).toFixed(d);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');if(s==='-0')s='0';return s.replace('.',',');}
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const snapv=(v,s)=>Math.round(v/(s||U))*(s||U);
const RM=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const cp=o=>JSON.parse(JSON.stringify(o));
const PL=['','','','üçgen','dörtgen','beşgen','altıgen','yedigen','sekizgen','dokuzgen','ongen','onbirgen','onikigen'];

function svgPt(svg,e){const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());}
function dirDeg(a,b){return norm360(Math.atan2(-(b.y-a.y),b.x-a.x)*R2D);}
function polar(c,r,a){const t=a*D2R;return {x:c.x+r*Math.cos(t),y:c.y-r*Math.sin(t)};}
function sector(c,r,a0,a1){
  if(a1-a0>=359.9) return `M${f(c.x-r)} ${f(c.y)}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0Z`;
  if(a1-a0<=0.01) return '';
  const s=polar(c,r,a0),e=polar(c,r,a1),lg=(a1-a0)>180?1:0;
  return `M${f(c.x)} ${f(c.y)}L${f(s.x)} ${f(s.y)}A${r} ${r} 0 ${lg} 0 ${f(e.x)} ${f(e.y)}Z`;
}
function arc(c,r,a0,a1){
  if(a1-a0>=359.9) return `M${f(c.x-r)} ${f(c.y)}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`;
  if(a1-a0<=0.01) return '';
  const s=polar(c,r,a0),e=polar(c,r,a1),lg=(a1-a0)>180?1:0;
  return `M${f(s.x)} ${f(s.y)}A${r} ${r} 0 ${lg} 0 ${f(e.x)} ${f(e.y)}`;
}
function rightMark(c,a0,size){const p1=polar(c,size,a0),p3=polar(c,size,a0+90),p2=polar(p1,size,a0+90);return `<path class="sq" d="M${f(p1.x)} ${f(p1.y)}L${f(p2.x)} ${f(p2.y)}L${f(p3.x)} ${f(p3.y)}"/>`;}
function T(p,str,cls,anchor){return `<text x="${f(p.x)}" y="${f(p.y)}" class="${cls||'val'}" text-anchor="${anchor||'middle'}" dominant-baseline="central">${str}</text>`;}
function hdl(id,p,label,r){return `<g class="hdl" data-h="${id}"><circle class="hit" cx="${f(p.x)}" cy="${f(p.y)}" r="24"/><circle class="dot" cx="${f(p.x)}" cy="${f(p.y)}" r="${r||10}"/><title>${label||'Sürükle'}</title></g>`;}
let gridN=0;
function grid(step,w,h){step=step||U;w=w||W;h=h||HT;const id='g'+(++gridN);return `<defs><pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse"><path d="M${step} 0H0V${step}" class="gl"/></pattern></defs><rect width="${w}" height="${h}" fill="url(#${id})"/>`;}
function plain(w,h){return `<rect width="${w||W}" height="${h||HT}" fill="none"/>`;}
function L(a,b,cls){return `<line class="${cls||'ray'}" x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"/>`;}
function lineFull(a,b,cls){const v=sub(b,a),l=len(v)||1,u={x:v.x/l,y:v.y/l};return L({x:a.x-u.x*1500,y:a.y-u.y*1500},{x:a.x+u.x*1500,y:a.y+u.y*1500},cls);}
function pd(pts){return 'M'+pts.map(p=>f(p.x)+' '+f(p.y)).join('L')+'Z';}
function poly(pts,cls,extra){return `<path class="${cls}" d="${pd(pts)}" ${extra||''}/>`;}
function wedge(v,p,q){let a0=dirDeg(v,p),a1=dirDeg(v,q);let d=norm360(a1-a0);if(d>180){const t=a0;a0=a1;a1=t;d=360-d;}return {s:a0,d};}
function interior(v,p,q){const u=sub(p,v),w=sub(q,v);const c=dot(u,w)/((len(u)*len(w))||1);return Math.acos(clamp(c,-1,1))*R2D;}
function round180(arr){const fl=arr.map(Math.floor);let rem=180-fl.reduce((a,b)=>a+b,0);const o=arr.map((v,i)=>[v-Math.floor(v),i]).sort((a,b)=>b[0]-a[0]);for(let k=0;k<rem&&k<3;k++)fl[o[k][1]]++;return fl;}
function intersect(p1,p2,q1,q2){const r=sub(p2,p1),s=sub(q2,q1),d=cross(r,s);if(Math.abs(d)<1e-9)return null;const t=cross(sub(q1,p1),s)/d;return {x:p1.x+t*r.x,y:p1.y+t*r.y};}
function foot(P,A,B){const v=sub(B,A),t=dot(sub(P,A),v)/(dot(v,v)||1);return {x:A.x+t*v.x,y:A.y+t*v.y,t};}
function eqTicks(P,Q,n){n=n||1;const m=mid(P,Q),v=sub(Q,P),l=len(v)||1,u={x:v.x/l,y:v.y/l},nn={x:-u.y,y:u.x};let s='';for(let k=0;k<n;k++){const o=(k-(n-1)/2)*6;const c={x:m.x+u.x*o,y:m.y+u.y*o};s+=`<line class="eqtick" x1="${f(c.x-nn.x*8)}" y1="${f(c.y-nn.y*8)}" x2="${f(c.x+nn.x*8)}" y2="${f(c.y+nn.y*8)}"/>`;}return s;}
function parArrows(P,Q,n,at){n=n||1;const m=lerpP(P,Q,at==null?.5:at),v=sub(Q,P),l=len(v)||1,u={x:v.x/l,y:v.y/l},nn={x:-u.y,y:u.x};let s='';for(let k=0;k<n;k++){const c={x:m.x+u.x*(k*7),y:m.y+u.y*(k*7)};const b1={x:c.x-u.x*7+nn.x*6,y:c.y-u.y*7+nn.y*6},b2={x:c.x-u.x*7-nn.x*6,y:c.y-u.y*7-nn.y*6};s+=`<path class="parm" d="M${f(b1.x)} ${f(b1.y)}L${f(c.x)} ${f(c.y)}L${f(b2.x)} ${f(b2.y)}"/>`;}return s;}
function arrowHead(p,deg,sz,cls){sz=sz||13;const a=polar(p,sz,deg+155),b=polar(p,sz,deg-155);return `<path class="${cls||'parm'}" style="stroke:var(--ink)" d="M${f(a.x)} ${f(a.y)}L${f(p.x)} ${f(p.y)}L${f(b.x)} ${f(b.y)}"/>`;}
function polyArea(pts){let s=0;for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];s+=a.x*b.y-b.x*a.y;}return s/2;}
function segX(a,b,c,d){const d1=cross(sub(b,a),sub(c,a)),d2=cross(sub(b,a),sub(d,a)),d3=cross(sub(d,c),sub(a,c)),d4=cross(sub(d,c),sub(b,c));return ((d1>0&&d2<0)||(d1<0&&d2>0))&&((d3>0&&d4<0)||(d3<0&&d4>0));}
function selfX(pts){const n=pts.length;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){if(j===i+1||(i===0&&j===n-1))continue;if(segX(pts[i],pts[(i+1)%n],pts[j],pts[(j+1)%n]))return true;}return false;}
/* çokgenin iç açıları (basit çokgen) */
function polyAngles(pts){const n=pts.length;const turns=[];for(let i=0;i<n;i++){const a=pts[(i-1+n)%n],b=pts[i],c=pts[(i+1)%n];const u=sub(b,a),v=sub(c,b);turns.push(Math.atan2(cross(u,v),dot(u,v))*R2D);}const s=Math.sign(turns.reduce((x,y)=>x+y,0))||1;return turns.map(t=>180-s*t);}

/* ================= 3B ================= */
const v3=(x,y,z)=>({x,y,z}),add3=(a,b)=>v3(a.x+b.x,a.y+b.y,a.z+b.z),sub3=(a,b)=>v3(a.x-b.x,a.y-b.y,a.z-b.z),mul3=(a,k)=>v3(a.x*k,a.y*k,a.z*k);
const cross3=(a,b)=>v3(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x),dot3=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
function cam3(o){return Object.assign({yaw:-0.62,pitch:0.42,s:40,cx:320,cy:250},o||{});}
function rot3(p,c){const cy=Math.cos(c.yaw),sy=Math.sin(c.yaw);const x=p.x*cy-p.z*sy,z=p.x*sy+p.z*cy;const cpp=Math.cos(c.pitch),sp=Math.sin(c.pitch);return {x,y:p.y*cpp-z*sp,z:p.y*sp+z*cpp};}
function P3(p,c){const r=rot3(p,c);return {x:c.cx+r.x*c.s,y:c.cy-r.y*c.s,z:r.z};}
function fcenter(pts){return mul3(pts.reduce(add3,v3(0,0,0)),1/pts.length);}
function fnormal(pts){let N=v3(0,0,0);for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];N=add3(N,v3((a.y-b.y)*(a.z+b.z),(a.z-b.z)*(a.x+b.x),(a.x-b.x)*(a.y+b.y)));}return N;}
/* dışbükey cisim: arka yüzler kesikli, ön yüzler dolu */
function convex3(faces,c,o){o=o||{};let C=v3(0,0,0),n=0;faces.forEach(fc=>fc.p.forEach(p=>{C=add3(C,p);n++;}));C=mul3(C,1/n);
  let back='',front='',labels='';
  faces.forEach(fc=>{const ctr=fcenter(fc.p);let N=fnormal(fc.p);if(dot3(N,sub3(ctr,C))<0)N=mul3(N,-1);const nl=Math.hypot(N.x,N.y,N.z)||1;const nz=rot3(N,c).z/nl;
    const q=fc.p.map(p=>P3(p,c)),d=pd(q);
    if(nz<=0.002){if(!o.noHidden&&!fc.nohid)back+=`<path class="e3h" d="${d}"/>`;}
    else{front+=`<path class="f3 ${fc.k||'cA'}" d="${d}"/>`+((fc.k||'').indexOf('glass')>=0?'':`<path class="sh3" d="${d}" style="fill-opacity:${f2(0.34*(1-nz))}"/>`);if(fc.lab){labels+=T(P3(ctr,c),fc.lab,'dimt');}}
  });
  return back+front+labels;}
/* ressam algoritması: derinliğe göre sırala */
function painter3(faces,c,o){o=o||{};const pr=faces.map(fc=>{const q=fc.p.map(p=>P3(p,c));const N=fnormal(fc.p),nl=Math.hypot(N.x,N.y,N.z)||1;const nz=Math.abs(rot3(N,c).z/nl);return {q,z:q.reduce((s,v)=>s+v.z,0)/q.length+(fc.bias||0),k:fc.k,nz,lab:fc.lab,ctr:fcenter(fc.p),op:fc.op};});
  pr.sort((a,b)=>a.z-b.z);let s='';pr.forEach(fc=>{const d=pd(fc.q);s+=`<path class="f3 ${fc.k||'cA'}" d="${d}" ${fc.op!=null?`style="fill-opacity:${fc.op}"`:''}/><path class="sh3" d="${d}" style="fill-opacity:${f2(0.34*(1-fc.nz))}"/>`;if(fc.lab)s+=T(P3(fc.ctr,c),fc.lab,'dimt');});return s;}
function boxFaces(x0,y0,z0,x1,y1,z1,k){const P=v3;const F=[[P(x0,y0,z0),P(x1,y0,z0),P(x1,y0,z1),P(x0,y0,z1)],[P(x0,y1,z0),P(x1,y1,z0),P(x1,y1,z1),P(x0,y1,z1)],[P(x0,y0,z1),P(x1,y0,z1),P(x1,y1,z1),P(x0,y1,z1)],[P(x0,y0,z0),P(x1,y0,z0),P(x1,y1,z0),P(x0,y1,z0)],[P(x0,y0,z0),P(x0,y0,z1),P(x0,y1,z1),P(x0,y1,z0)],[P(x1,y0,z0),P(x1,y0,z1),P(x1,y1,z1),P(x1,y1,z0)]];return F.map((p,i)=>({p,k:Array.isArray(k)?k[i]:(k||'cA')}));}
function ngon3(n,R,y,off){const a=[];for(let i=0;i<n;i++){const t=2*PI*i/n+(off||0);a.push(v3(R*Math.cos(t),y,R*Math.sin(t)));}return a;}
function prismFaces(n,a,h,kSide,kCap){const R=a/(2*Math.sin(PI/n)),off=PI/2+PI/n;const b=ngon3(n,R,-h/2,off),t=ngon3(n,R,h/2,off);const F=[{p:b,k:kCap||'cB'},{p:t,k:kCap||'cB'}];for(let i=0;i<n;i++){const j=(i+1)%n;F.push({p:[b[i],b[j],t[j],t[i]],k:kSide||'cA'});}return F;}
function cylFaces(r,h,n){n=n||48;const b=ngon3(n,r,-h/2,0),t=ngon3(n,r,h/2,0);const F=[{p:b,k:'cB'},{p:t,k:'cB'}];for(let i=0;i<n;i++){const j=(i+1)%n;F.push({p:[b[i],b[j],t[j],t[i]],k:'cA sm',nohid:true});}return F;}
function coneFaces(r,h,n){n=n||48;const b=ngon3(n,r,-h/2,0),A=v3(0,h/2,0);const F=[{p:b,k:'cB'}];for(let i=0;i<n;i++){const j=(i+1)%n;F.push({p:[b[i],b[j],A],k:'cA sm',nohid:true});}return F;}
function pyrFaces(a,h){const s=a/2,b=[v3(-s,-h/2,-s),v3(s,-h/2,-s),v3(s,-h/2,s),v3(-s,-h/2,s)],A=v3(0,h/2,0);const F=[{p:b,k:'cB'}];for(let i=0;i<4;i++)F.push({p:[b[i],b[(i+1)%4],A],k:'cA'});return F;}

/* ================= bilgi kartı parçaları ================= */
const stat=(l,v,s)=>`<div class="stat"><span>${l}</span><b>${v}</b>${s?`<span>${s}</span>`:''}</div>`;
const stats=(...a)=>`<div class="stats${a.length===3?' three':''}">${a.join('')}</div>`;
const head=(eb,big,pill,desc,pc)=>`${eb?`<p class="eyebrow">${eb}</p>`:''}<p class="big">${big}</p>${pill?`<span class="pill ${pc||''}">${pill}</span>`:''}${desc?`<p class="desc">${desc}</p>`:''}`;
const checks=items=>`<ul class="checks">${items.map(([ok,t])=>`<li class="${ok?'y':'n'}">${t}</li>`).join('')}</ul>`;

/* ================= uygulama ================= */
const Topics=[];const reg=t=>Topics.push(t);
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let GEN=0,cur=null,justK=null,toastT;
function toast(msg,ms){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),ms||2400);}
const doneSet=id=>new Set(store.get('gka2-'+id)||[]);

function makeApi(t,li){
  const g=GEN;
  const wrap=$('#svgWrap');wrap.innerHTML='';
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox',`0 0 ${W} ${HT}`);svg.setAttribute('role','img');svg.setAttribute('aria-label',t.labs[li].name+' çizim alanı');
  wrap.appendChild(svg);
  const bar=$('#bar'),below=$('#below');bar.innerHTML='';below.innerHTML='';
  let nid=0;const uid=()=>`c${g}-${++nid}`;
  const api={svg,bar,below,
    alive:()=>g===GEN,
    view(w,h){svg.setAttribute('viewBox',`0 0 ${w} ${h}`);},
    draw(s){svg.innerHTML=s;},
    info(h){$('#info').innerHTML=h;},
    hint(s){$('#hint').textContent=s||'';},
    done(k){if(g!==GEN)return;const ds=doneSet(t.id);if(ds.has(k))return;const tk=t.tasks.find(x=>x.k===k);if(!tk)return;ds.add(k);store.set('gka2-'+t.id,[...ds]);justK=k;renderTasks();toast(ds.size===t.tasks.length?'Harika! Bu konunun tüm görevleri tamam.':'Görev tamamlandı: '+tk.text);},
    _move:null,_orb:null,
    drag(fn){api._move=fn;},
    orbit(cam,render){api._orb={cam,render};},
    button(label,fn,o){o=o||{};const b=document.createElement('button');b.type='button';b.className='btn'+(o.primary?' primary':'');b.innerHTML=label;if(o.pressed!=null)b.setAttribute('aria-pressed',o.pressed);b.onclick=()=>fn(b);(o.where||bar).appendChild(b);return b;},
    seg(opts,val,fn,o){o=o||{};const d=document.createElement('div');d.className='segm';d.setAttribute('role','group');if(o.label)d.setAttribute('aria-label',o.label);
      const bs=opts.map(([v,l])=>{const b=document.createElement('button');b.type='button';b.textContent=l;b.dataset.v=v;b.setAttribute('aria-pressed',String(v)===String(val));b.onclick=()=>{bs.forEach(x=>x.setAttribute('aria-pressed',x===b));fn(v);};d.appendChild(b);return b;});
      (o.where||bar).appendChild(d);return {el:d,set(v){bs.forEach(x=>x.setAttribute('aria-pressed',x.dataset.v===String(v)));}};},
    check(label,val,fn,o){o=o||{};const l=document.createElement('label');l.className='chk';const id=uid();l.innerHTML=`<input type="checkbox" id="${id}" ${val?'checked':''}> ${label}`;l.querySelector('input').onchange=e=>fn(e.target.checked);(o.where||bar).appendChild(l);return l.querySelector('input');},
    slider(o){const row=document.createElement('div');row.className='srow';const id=uid();const fmt=o.fmt||(v=>tr(v,2));
      row.innerHTML=`<label for="${id}">${o.label}</label><input type="range" id="${id}" min="${o.min}" max="${o.max}" step="${o.step||1}" value="${o.value}"><output for="${id}">${fmt(o.value)}</output>`;
      const inp=row.querySelector('input'),out=row.querySelector('output');
      const sl={min:o.min,max:o.max,input:inp,v:+o.value,playing:false,
        set(v,fire){sl.v=v;inp.value=v;out.textContent=fmt(v);if(fire&&o.onInput)o.onInput(v);},
        get:()=>sl.v};
      inp.addEventListener('input',()=>{sl.playing=false;sl.set(+inp.value,true);});
      if(o.play){const b=document.createElement('button');b.type='button';b.className='btn primary';b.innerHTML='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1L11 6L2 11Z" fill="currentColor"/></svg>Oynat';
        b.onclick=()=>{if(sl.playing){sl.playing=false;return;}const mx=+sl.max,mn=+sl.min;let from=sl.v;if(from>=mx-1e-6)from=mn;if(RM){sl.set(mx,true);return;}
          const dur=Math.max(1,(o.dur||3000)*(mx-from)/((mx-mn)||1)),t0=performance.now();sl.playing=true;
          const step=now=>{if(g!==GEN||!sl.playing)return;const k=Math.min(1,(now-t0)/dur);sl.set(from+(mx-from)*k,true);if(k<1)requestAnimationFrame(step);else sl.playing=false;};requestAnimationFrame(step);};
        row.appendChild(b);}
      else row.appendChild(document.createElement('span'));
      (o.where||below).appendChild(row);return sl;},
    loop(fn){let last=performance.now();const step=now=>{if(g!==GEN)return;const dt=Math.min(50,now-last);last=now;if(fn(dt)!==false)requestAnimationFrame(step);};requestAnimationFrame(step);},
    later(fn,ms){setTimeout(()=>{if(g===GEN)fn();},ms);}
  };
  let dragId=null,orbOn=false,last=null;
  svg.addEventListener('pointerdown',e=>{const h=e.target.closest('[data-h]');
    if(h&&api._move){dragId=h.dataset.h;try{svg.setPointerCapture(e.pointerId)}catch(_){}svg.classList.add('dragging');e.preventDefault();api._move(dragId,svgPt(svg,e),true);}
    else if(api._orb&&!e.target.closest('[data-ang]')){orbOn=true;last={x:e.clientX,y:e.clientY};try{svg.setPointerCapture(e.pointerId)}catch(_){}svg.classList.add('dragging');e.preventDefault();}});
  svg.addEventListener('pointermove',e=>{if(dragId!==null){e.preventDefault();api._move(dragId,svgPt(svg,e),false);}
    else if(orbOn){const c=api._orb.cam;c.yaw+=(e.clientX-last.x)*0.012;c.pitch=clamp(c.pitch+(e.clientY-last.y)*0.01,-0.15,1.45);last={x:e.clientX,y:e.clientY};api._orb.render();}});
  const end=()=>{dragId=null;orbOn=false;svg.classList.remove('dragging');};
  svg.addEventListener('pointerup',end);svg.addEventListener('pointercancel',end);
  return api;
}

function renderTasks(){
  const t=cur.t,ds=doneSet(t.id),n=t.tasks.filter(x=>ds.has(x.k)).length,tot=t.tasks.length;
  const el=$('#tasks');
  el.innerHTML=`<div class="head"><h3>Görevler</h3><span class="count">${n}/${tot}</span></div><div class="prog"><i style="width:${n/tot*100}%"></i></div>
  <ul>${t.tasks.map(tk=>`<li><button type="button" class="tk${ds.has(tk.k)?' done':''}${tk.k===justK?' just':''}" data-lab="${tk.lab||0}"><span class="box" aria-hidden="true"></span><span>${tk.text}<small>${t.labs[tk.lab||0].name}${tk.hint?' · '+tk.hint:''}</small></span></button></li>`).join('')}</ul>
  <button class="linkbtn" type="button" id="resetTasks">Görevleri sıfırla</button>`;
  justK=null;
  el.querySelectorAll('.tk').forEach(b=>b.onclick=()=>{const li=+b.dataset.lab;if(li!==cur.li)runLab(li);});
  $('#resetTasks').onclick=()=>{store.set('gka2-'+t.id,[]);renderTasks();};
}
function runLab(li){
  GEN++;cur.li=li;const t=cur.t,lab=t.labs[li];
  document.querySelectorAll('.lab').forEach((b,i)=>{b.setAttribute('aria-selected',i===li);b.tabIndex=i===li?0:-1;});
  $('#note').innerHTML=lab.note||'';$('#info').innerHTML='';$('#hint').textContent='';
  const api=makeApi(t,li);
  try{lab.init(api);}catch(err){console.error(err);api.info('<p class="desc">Bu etkinlik yüklenemedi.</p>');}
  renderTasks();
  setHash('t-'+t.id+(li?'.'+li:''));
}
function setHash(h){try{history.replaceState(null,'','#'+h)}catch(e){}}
function openTopic(id,li){
  const t=Topics.find(x=>x.id===id);if(!t)return showHome();
  cur={t,li:0};
  $('#home').hidden=true;$('#topic').hidden=false;
  $('#tGrade').textContent=`${t.g}. Sınıf · ${t.sub}`;$('#tTitle').textContent=t.title;
  const labs=$('#labs');labs.innerHTML='';
  t.labs.forEach((lab,i)=>{const b=document.createElement('button');b.type='button';b.className='lab';b.setAttribute('role','tab');b.innerHTML=`${lab.name}${lab.why?'<span class="why">NEDEN?</span>':''}`;b.onclick=()=>runLab(i);
    b.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const n=(i+(e.key==='ArrowRight'?1:t.labs.length-1))%t.labs.length;runLab(n);labs.children[n].focus();}};labs.appendChild(b);});
  runLab(clamp(li||0,0,t.labs.length-1));
  window.scrollTo(0,0);
}
let grade=store.get('gka2-grade')||5;
function showHome(){
  GEN++;cur=null;$('#topic').hidden=true;$('#home').hidden=false;
  const gd=$('#grades');gd.innerHTML='';
  [5,6,7,8].forEach(g=>{const b=document.createElement('button');b.type='button';b.className='grade';b.innerHTML=`<b>${g}.</b> Sınıf`;b.setAttribute('aria-pressed',g===grade);b.onclick=()=>{grade=g;store.set('gka2-grade',g);showHome();};gd.appendChild(b);});
  const cols=['var(--hl)','var(--hl2)','var(--hl3)','var(--hl4)'];
  $('#cards').innerHTML=Topics.filter(t=>t.g===grade).map((t,i)=>{const ds=doneSet(t.id),n=t.tasks.filter(x=>ds.has(x.k)).length;
    return `<button type="button" class="tcard" data-id="${t.id}" style="--c:${cols[i%4]}"><span class="off">${t.sub}</span><span class="ic" aria-hidden="true"><svg viewBox="0 0 120 120">${t.icon}</svg></span><h3>${t.title}</h3><span class="meta">${t.labs.length} etkinlik<span class="mini"><i style="width:${n/t.tasks.length*100}%"></i></span>${n}/${t.tasks.length}</span></button>`;}).join('');
  document.querySelectorAll('.tcard').forEach(c=>c.onclick=()=>openTopic(c.dataset.id,0));
  setHash('g'+grade);
}
function boot(){
  $('#home-btn').onclick=showHome;$('#back').onclick=showHome;
  const bm=$('#boardMode');bm.checked=!!store.get('gka-board');document.body.classList.toggle('board',bm.checked);
  bm.onchange=()=>{document.body.classList.toggle('board',bm.checked);store.set('gka-board',bm.checked);};
  pwa();
  const h=(location.hash||'').slice(1);
  if(h.indexOf('t-')===0){const [id,li]=h.slice(2).split('.');openTopic(id,+li||0);}
  else{const m=/^g([5-8])$/.exec(h);if(m)grade=+m[1];showHome();}
}

/* ================= yüklenebilir uygulama (PWA) ================= */
function pwa(){
  if(!document.querySelector('link[rel="manifest"]'))return;
  const btn=$('#installBtn');let deferred=null;
  const standalone=(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true;
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;btn.hidden=false;});
  window.addEventListener('appinstalled',()=>{btn.hidden=true;deferred=null;toast('Uygulama yüklendi. Ana ekrandaki simgeden açabilirsin.',4000);});
  if(ios&&!standalone)btn.hidden=false;
  btn.onclick=async()=>{
    if(deferred){deferred.prompt();try{const r=await deferred.userChoice;if(r.outcome==='accepted')btn.hidden=true;}catch(e){}deferred=null;}
    else if(ios)toast('Safari\'de Paylaş düğmesine dokun, sonra "Ana Ekrana Ekle"yi seç.',6000);
    else toast('Tarayıcı menüsünden "Uygulamayı yükle" ya da "Ana ekrana ekle"yi seç.',5000);};
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
    navigator.serviceWorker.register('sw.js').catch(()=>{});}
}

/* ================= ortak etkinlik parçaları ================= */
/* --- üçgen --- */
function triState(P){
  const {A:a,B:b,C:c}=P;const sa=dist(b,c),sb=dist(c,a),sc=dist(a,b);
  const area=Math.abs(cross(sub(b,a),sub(c,a)))/2;const mx=Math.max(sa,sb,sc);
  const degen=area<mx*mx*0.02||Math.min(sa,sb,sc)<1;
  const raw=[interior(a,b,c),interior(b,c,a),interior(c,a,b)];const ang=degen?[0,0,0]:round180(raw);
  const eq=(x,y)=>Math.abs(x-y)/Math.max(x,y)<0.015;let bySide,eqs=[];
  if(!degen&&Math.max(...raw)-Math.min(...raw)<=2.5){bySide='Eşkenar';eqs=['AB','BC','CA'];}
  else{if(eq(sc,sa))eqs=['AB','BC'];else if(eq(sa,sb))eqs=['BC','CA'];else if(eq(sc,sb))eqs=['AB','CA'];bySide=eqs.length?'İkizkenar':'Çeşitkenar';}
  const m=Math.max(...ang);const byAng=m===90?'Dik açılı':m>90?'Geniş açılı':'Dar açılı';
  return {raw,ang,sa,sb,sc,area,degen,bySide,byAng,eqs};
}
function triDraw(P,st,o){o=o||{};const V=[P.A,P.B,P.C],nm=o.names||['A','B','C'],cl=o.colors||['cA','cB','cC'];
  const G={x:(P.A.x+P.B.x+P.C.x)/3,y:(P.A.y+P.B.y+P.C.y)/3};let s=`<path class="tri" d="${pd(V)}"/>`;
  if(!st.degen){
    if(o.angles!==false)V.forEach((v,i)=>{const w=wedge(v,V[(i+1)%3],V[(i+2)%3]);
      if(st.ang[i]===90)s+=`<path class="fsec ${cl[i]}" style="stroke:none" d="${sector(v,22,w.s,w.s+w.d)}"/>`+rightMark(v,w.s,22);
      else s+=`<path class="fsec ${cl[i]}" d="${sector(v,32,w.s,w.s+w.d)}"/>`;
      if(o.angleVals!==false)s+=T(polar(v,st.ang[i]<35?72:56,w.s+w.d/2),st.ang[i]+'°','val');});
    const sides=[['AB',P.A,P.B,st.sc],['BC',P.B,P.C,st.sa],['CA',P.C,P.A,st.sb]];
    sides.forEach(([n,p,q,l])=>{if(o.ticks!==false&&st.eqs.includes(n))s+=eqTicks(p,q);
      if(o.sides!==false){const m=mid(p,q),d=sub(m,G),dl=len(d)||1;s+=T({x:m.x+d.x/dl*22,y:m.y+d.y/dl*22},tr(l/(o.unit||U))+' br','sml');}});
  }
  if(o.labels!==false)V.forEach((v,i)=>{const d=sub(v,G),dl=len(d)||1;s+=T({x:v.x+d.x/dl*30,y:v.y+d.y/dl*30},nm[i],'lbl');});
  return s;}
function triHandles(P){return ['A','B','C'].map(k=>hdl(k,P[k],k+' köşesini sürükle')).join('');}
function triMove(P,id,p,snap,box){box=box||[U,U,W-U,HT-U];let x,y;if(snap){x=clamp(snapv(p.x),box[0],box[2]);y=clamp(snapv(p.y),box[1],box[3]);}else{x=clamp(Math.round(p.x),box[0]-16,box[2]+16);y=clamp(Math.round(p.y),box[1]-16,box[3]+16);}
  if(P[id].x===x&&P[id].y===y)return false;P[id]={x,y};return true;}
function triAngInfo(st){const [a,b,c]=st.ang;return `<ul class="rows"><li><i class="sw cA"></i>m(∠A)<b>${a}°</b></li><li><i class="sw cB"></i>m(∠B)<b>${b}°</b></li><li><i class="sw cC"></i>m(∠C)<b>${c}°</b></li></ul><p class="eqn">${a}° + ${b}° + ${c}° = 180°</p>`;}
const degenInfo=()=>head('Ölçüm','Üçgen yok!','Köşeler aynı doğru üzerinde','Üç köşe tek bir doğru üzerine gelince üçgen oluşmaz. Bir köşeyi yukarı ya da aşağı çek.','warn');

/* --- dörtgen --- */
function quadState(Q){
  const n=4,sides=[],dirs=[];for(let i=0;i<n;i++){const a=Q[i],b=Q[(i+1)%n];sides.push(dist(a,b));dirs.push(sub(b,a));}
  const bad=selfX(Q)||Math.abs(polyArea(Q))<200;
  const par=(u,v)=>Math.abs(cross(u,v))/(len(u)*len(v)||1)<0.004;
  const p02=par(dirs[0],dirs[2]),p13=par(dirs[1],dirs[3]);
  const ang=bad?[0,0,0,0]:polyAngles(Q).map(Math.round);
  const allR=ang.every(a=>a===90);const eq=(x,y)=>Math.abs(x-y)/Math.max(x,y)<0.015;
  const allE=eq(sides[0],sides[1])&&eq(sides[1],sides[2])&&eq(sides[2],sides[3]);
  const convex=!bad&&ang.every(a=>a<180);
  let name='Dörtgen';
  if(bad)name='Dörtgen değil';
  else if(allR&&allE)name='Kare';else if(allR)name='Dikdörtgen';else if(allE)name='Eşkenar dörtgen';
  else if(p02&&p13)name='Paralelkenar';else if(p02||p13)name='Yamuk';
  else if(convex&&((eq(sides[0],sides[1])&&eq(sides[2],sides[3]))||(eq(sides[1],sides[2])&&eq(sides[3],sides[0]))))name='Deltoid';
  const d1=dist(Q[0],Q[2]),d2=dist(Q[1],Q[3]);const D=intersect(Q[0],Q[2],Q[1],Q[3]);
  const dPerp=Math.abs(dot(sub(Q[2],Q[0]),sub(Q[3],Q[1])))/(d1*d2||1)<0.006;
  const bisect=D&&convex&&Math.abs(dist(Q[0],D)-dist(D,Q[2]))<2&&Math.abs(dist(Q[1],D)-dist(D,Q[3]))<2;
  return {sides,ang,p02,p13,allR,allE,name,bad,convex,d1,d2,dEq:eq(d1,d2),dPerp,bisect,D};
}
function quadDraw(Q,st,o){o=o||{};const nm=['A','B','C','D'];let s=`<path class="tri" style="fill:var(--hl4);fill-opacity:.16" d="${pd(Q)}"/>`;
  const G={x:Q.reduce((a,p)=>a+p.x,0)/4,y:Q.reduce((a,p)=>a+p.y,0)/4};
  if(!st.bad){
    if(o.diag){s+=L(Q[0],Q[2],'dash')+L(Q[1],Q[3],'dash');if(st.D){if(st.dPerp)s+=rightMark(st.D,dirDeg(st.D,Q[2]),12);s+=`<circle class="kpt" cx="${f(st.D.x)}" cy="${f(st.D.y)}" r="4"/>`;}}
    Q.forEach((v,i)=>{const p=Q[(i+3)%4],q=Q[(i+1)%4];const w=wedge(v,p,q);if(st.ang[i]>180)return;
      if(st.ang[i]===90)s+=rightMark(v,w.s,18);else s+=`<path class="sec" style="fill-opacity:.35" d="${sector(v,24,w.s,w.s+w.d)}"/>`;
      s+=T(polar(v,46,w.s+w.d/2),st.ang[i]+'°','sml');});
    const eq=(x,y)=>Math.abs(x-y)/Math.max(x,y)<0.015;
    const grp=[0,0,0,0];let gn=0;for(let i=0;i<4;i++){if(grp[i])continue;const same=[i];for(let j=i+1;j<4;j++)if(!grp[j]&&eq(st.sides[i],st.sides[j]))same.push(j);if(same.length>1){gn++;same.forEach(k=>grp[k]=gn);}}
    for(let i=0;i<4;i++){const a=Q[i],b=Q[(i+1)%4];if(grp[i])s+=eqTicks(a,b,grp[i]);
      const m=mid(a,b),d=sub(m,G),dl=len(d)||1;s+=T({x:m.x+d.x/dl*20,y:m.y+d.y/dl*20},tr(st.sides[i]/U)+' br','sml');}
    if(st.p02){s+=parArrows(Q[0],Q[1],1,.32)+parArrows(Q[3],Q[2],1,.32);}
    if(st.p13){s+=parArrows(Q[1],Q[2],2,.3)+parArrows(Q[0],Q[3],2,.3);}
  }
  Q.forEach((v,i)=>{const d=sub(v,G),dl=len(d)||1;s+=T({x:v.x+d.x/dl*28,y:v.y+d.y/dl*28},nm[i],'lbl');});
  s+=Q.map((v,i)=>hdl('q'+i,v,nm[i]+' köşesini sürükle')).join('');
  return s;}
function quadInfo(st,diag){
  if(st.bad)return head('Dörtgen ailesi','Dörtgen değil','Kenarlar kesişiyor','Kenarların birbirini kesmemesi gerekir. Bir köşeyi geri çek.','warn');
  const desc={Kare:'Dört kenarı eşit, dört açısı dik.',Dikdörtgen:'Dört açısı da 90°. Karşılıklı kenarlar eşit ve paralel.','Eşkenar dörtgen':'Dört kenarı eşit. Karşılıklı açılar eşit.',Paralelkenar:'Karşılıklı kenarlar paralel ve eşit.',Yamuk:'Yalnızca bir çift karşılıklı kenar paralel.',Deltoid:'Komşu kenarlardan ikişer ikişer eşit, uçurtma biçimi.',Dörtgen:'Özel bir adı yok: genel dörtgen.'}[st.name];
  let h=head('Dörtgen ailesi',st.name,null,desc)+checks([[st.p02&&st.p13,'İki çift karşılıklı kenar paralel'],[st.p02!==st.p13,'Yalnız bir çift kenar paralel'],[st.allE,'Dört kenar eşit'],[st.allR,'Dört açı 90°']]);
  h+=`<p class="eqn">${st.ang.join('° + ')}° = ${st.ang.reduce((a,b)=>a+b,0)}°<small>Dörtgenin iç açıları toplamı</small></p>`;
  if(diag)h+=`<p class="eyebrow" style="margin-top:12px">Köşegenler</p>`+checks([[st.dEq,`Uzunlukları eşit (${tr(st.d1/U)} ve ${tr(st.d2/U)} br)`],[st.dPerp,'Birbirine dik'],[st.bisect,'Birbirini ortalar']]);
  return h;}
function quadMove(Q,id,p,snap){const i=+id.slice(1);const x=clamp(snap?snapv(p.x):Math.round(p.x),U,W-U),y=clamp(snap?snapv(p.y):Math.round(p.y),U,HT-U);if(Q[i].x===x&&Q[i].y===y)return false;Q[i]={x,y};return true;}

/* --- paralel iki doğru + kesen --- */
function kesenRel(i,j){const li=i>>2,lj=j>>2,pi=i%4,pj=j%4,eq=(pi%2)===(pj%2);
  if(li===lj)return {name:(pi+2)%4===pj?'Ters açılar':'Komşu bütünler açılar',eq};
  const top=li===0?pi:pj,bot=li===0?pj:pi;if(top===bot)return {name:'Yöndeş açılar',eq};
  const mp={'20':'İç ters açılar','31':'İç ters açılar','02':'Dış ters açılar','13':'Dış ters açılar','30':'Karşı durumlu iç açılar','21':'Karşı durumlu iç açılar','03':'Karşı durumlu dış açılar','12':'Karşı durumlu dış açılar'};
  return {name:mp[''+top+bot]||'Bütünler açılar',eq};}
function kesenDraw(S,o){o=o||{};const {y1,y2,al}=S,M={x:320,y:(y1+y2)/2},t=al*D2R;
  const X=y=>({x:M.x+(Math.abs(al-90)<0.01?0:(M.y-y)/Math.tan(t)),y});const X1=X(y1),X2=X(y2);
  const VAL=i=>(i%2===0?al:180-al);
  let s=grid();s+=L({x:0,y:y1},{x:W,y:y1})+L({x:0,y:y2},{x:W,y:y2});
  s+=parArrows({x:540,y:y1},{x:600,y:y1})+parArrows({x:540,y:y2},{x:600,y:y2});
  s+=lineFull(M,polar(M,10,al),'ray thin');
  const st=[0,al,180,180+al],en=[al,180,180+al,360];
  [X1,X2].forEach((Xp,li)=>{for(let p=0;p<4;p++){const i=li*4+p,g=p%2===0?'cA':'cB';let c='';
    if(o.sel!=null){if(i===o.sel)c=' sel';else if(kesenRel(o.sel,i).eq)c=' mate';}
    if(o.hide&&o.hide.indexOf(i)<0&&i!==o.ask&&i!==o.given)continue;
    s+=`<path class="ang ${g}${c}" data-ang="${i}" tabindex="0" role="button" aria-label="${i+1} numaralı açı" d="${sector(Xp,48,st[p],en[p])}"/>`;}});
  [X1,X2].forEach((Xp,li)=>{for(let p=0;p<4;p++){const i=li*4+p,m=(st[p]+en[p])/2,sm=(en[p]-st[p])<45;
    if(o.quiz){if(i===o.given)s+=T(polar(Xp,sm?70:66,m),VAL(i)+'°','val');else if(i===o.ask)s+=T(polar(Xp,sm?66:62,m),'x','lbl');continue;}
    s+=T(polar(Xp,sm?36:30,m),i+1,'anum');if(o.vals!==false)s+=T(polar(Xp,sm?66:64,m),VAL(i)+'°','adeg');}});
  s+=`<circle class="vtx" cx="${f(X1.x)}" cy="${y1}" r="4.5"/><circle class="vtx" cx="${f(X2.x)}" cy="${y2}" r="4.5"/>`;
  s+=T({x:612,y:y1-16},'d','lbl')+T({x:612,y:y2-16},'e','lbl');
  const Hy=y1-70,Hp=polar(M,(M.y-Hy)/Math.sin(t),al);s+=T(polar(Hp,22,al-90),'k','lbl');
  if(o.handles!==false)s+=hdl('y1',{x:36,y:y1},'d doğrusunu kaydır')+hdl('y2',{x:36,y:y2},'e doğrusunu kaydır')+hdl('k',Hp,'Keseni döndür');
  return {s,VAL};}
function kesenMove(S,id,p){if(id==='y1')S.y1=clamp(snapv(p.y,10),100,S.y2-80);else if(id==='y2')S.y2=clamp(snapv(p.y,10),S.y1+80,400);else{const M={x:320,y:(S.y1+S.y2)/2};let a=dirDeg(M,p);if(a>180)a-=180;S.al=clamp(Math.round(a),25,155);}}
function kesenLab(keys){return function(api){
  const S={y1:140,y2:300,al:62,sel:0};
  api.hint('Bir açıya dokun, kırmızı noktaları sürükle.');
  const sl=api.slider({label:'Kesenin eğimi',min:25,max:155,step:1,value:S.al,fmt:v=>Math.round(v)+'°',onInput:v=>{S.al=Math.round(v);render(false);}});
  function render(clicked,focus){const r=kesenDraw(S,{sel:S.sel});api.draw(r.s);sl.set(S.al);
    const rows=[0,1,2,3,4,5,6,7].filter(j=>j!==S.sel).map(j=>Object.assign({j},kesenRel(S.sel,j))).sort((a,b)=>b.eq-a.eq||a.j-b.j);
    api.info(head('d ∥ e, k kesen doğru',`m(∠${S.sel+1}) = ${r.VAL(S.sel)}°`,null,'Seçili açıyla diğer açıların ilişkisi. Başka bir açıya dokunarak değiştir.')+`<ul class="rel">${rows.map(x=>`<li class="${x.eq?'eq':'sup'}"><b>∠${x.j+1}</b><span>${x.name}</span><em>${x.eq?'eşit':'toplam 180°'}</em></li>`).join('')}</ul>`);
    if(focus!=null){const el=api.svg.querySelector(`[data-ang="${focus}"]`);if(el&&el.focus)el.focus({preventScroll:true});}
    if(keys){if(S.al===90&&keys.dik)api.done(keys.dik);if(S.al===60&&keys.alt)api.done(keys.alt);if(clicked&&S.sel===2&&keys.ic)api.done(keys.ic);if(clicked&&S.sel===6&&keys.yon)api.done(keys.yon);}}
  api.drag((id,p)=>{kesenMove(S,id,p);render(false);});
  const pick=e=>{const a=e.target.closest('[data-ang]');if(!a)return;S.sel=+a.dataset.ang;render(true,S.sel);};
  api.svg.addEventListener('click',pick);api.svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e);}});
  render(false);};}

/* --- kutu açınımı (dikdörtgenler prizması) --- */
function netFaces(a,b,c,t){
  const ph=t*PI/2,cs=Math.cos(ph),sn=Math.sin(ph),x0=-a/2,x1=a/2,z0=-b/2,z1=b/2;
  const F=[];F.push({p:[v3(x0,0,z0),v3(x1,0,z0),v3(x1,0,z1),v3(x0,0,z1)],k:'cA',n:'alt'});
  const up=(h,d)=>add3(h,d);
  const dF=v3(0,cs,sn),dB=v3(0,cs,-sn),dR=v3(sn,cs,0),dL=v3(-sn,cs,0);
  F.push({p:[v3(x0,0,z1),v3(x1,0,z1),up(v3(x1,0,z1),mul3(dF,c)),up(v3(x0,0,z1),mul3(dF,c))],k:'cB',n:'ön'});
  const bt0=up(v3(x0,0,z0),mul3(dB,c)),bt1=up(v3(x1,0,z0),mul3(dB,c));
  F.push({p:[v3(x0,0,z0),v3(x1,0,z0),bt1,bt0],k:'cB',n:'arka'});
  F.push({p:[v3(x1,0,z0),v3(x1,0,z1),up(v3(x1,0,z1),mul3(dR,c)),up(v3(x1,0,z0),mul3(dR,c))],k:'cC',n:'sağ'});
  F.push({p:[v3(x0,0,z0),v3(x0,0,z1),up(v3(x0,0,z1),mul3(dL,c)),up(v3(x0,0,z0),mul3(dL,c))],k:'cC',n:'sol'});
  const uy=cs,uz=-sn,wy=sn,wz=cs;const dT=v3(0,cs*wy+sn*uy,cs*wz+sn*uz);
  F.push({p:[bt0,bt1,add3(bt1,mul3(dT,b)),add3(bt0,mul3(dT,b))],k:'cA',n:'üst'});
  return F;}

function netCam(cam,a,b,c,k){const sF=Math.min(cam.s,380/(2*b+2*c),560/(a+2*c));const s2=lerp(cam.s,sF,k);return Object.assign({},cam,{yaw:lerp(cam.yaw,0,k*k),pitch:lerp(cam.pitch,1.5,k*k),s:s2,cy:lerp(cam.cy,220+b*s2/2,k)});}
/* --- birim küp yığını --- */
function cubesFaces(cells,k){const has=new Set(cells.map(c=>c.join(',')));const F=[];
  cells.forEach(([x,y,z])=>{const nb=[[0,-1,0],[0,1,0],[0,0,1],[0,0,-1],[-1,0,0],[1,0,0]];const bf=boxFaces(x,y,z,x+1,y+1,z+1,k||'cA');
    bf.forEach((fc,i)=>{const d=nb[i];if(!has.has([x+d[0],y+d[1],z+d[2]].join(',')))F.push(fc);});});return F;}
