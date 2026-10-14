/* ======================= 7. SINIF ======================= */

/* ---------- Doğrular ve açılar ---------- */
reg({id:'p7',g:7,sub:'Doğrular ve Açılar',title:'Paralel Dedektifi',
icon:'<path class="is" d="M8 28H112M8 94H112"/><path class="is" d="M28 28L86 61L36 94" style="stroke:var(--pen)"/><path class="if" d="M28 28L48 28A20 20 0 0 1 45.4 37.9Z"/>',
tasks:[{k:'k60',text:'Kesende 1 numaralı açıyı 60° yap',lab:0},{k:'kdik',text:'Keseni paralellere dik yap',lab:0},{k:'zig90',text:'Zigzagdaki B açısını 90° yap',lab:1},{k:'coz3',text:'3 problemi doğru çöz',lab:2}],
labs:[
{name:'Kesen ve Açılar',note:'Kesenin eğimi değişince 8 açının hepsi değişir ama aralarındaki eşitlik ve bütünlerlik ilişkileri asla bozulmaz.',init:kesenLab({alt:'k60',dik:'kdik'})},
{name:'Zigzag Kuralı',why:true,note:'B noktasından paralellere bir paralel daha çizersen B açısı ikiye ayrılır. Parçaların her biri bir iç ters açıya eşittir. Bu yüzden ∠B = ∠A + ∠C.',
init(api){
  const y1=110,y2=350,S={A:{x:160,y:y1},C:{x:200,y:y2},B:{x:420,y:220}};
  api.hint('A, B ve C noktalarını sürükle.');
  function render(user){const {A,B,C}=S;const al=Math.round(360-dirDeg(A,B)),be=Math.round(dirDeg(C,B));const x=Math.round(interior(B,A,C));
    let g=grid()+L({x:0,y:y1},{x:W,y:y1})+L({x:0,y:y2},{x:W,y:y2})+parArrows({x:560,y:y1},{x:610,y:y1})+parArrows({x:560,y:y2},{x:610,y:y2});
    g+=L({x:0,y:B.y},{x:W,y:B.y},'dash')+parArrows({x:560,y:B.y},{x:610,y:B.y});
    g+=`<path class="fsec cA" d="${sector(A,40,360-al,360)}"/><path class="fsec cB" d="${sector(C,40,0,be)}"/>`;
    g+=`<path class="fsec cA" d="${sector(B,40,180-al,180)}"/><path class="fsec cB" d="${sector(B,40,180,180+be)}"/>`;
    g+=L(A,B,'ray pen')+L(B,C,'ray pen');
    g+=T(polar(A,62,360-al/2),al+'°','val')+T(polar(C,62,be/2),be+'°','val')+T(polar(B,64,180-al/2),al+'°','sml')+T(polar(B,64,180+be/2),be+'°','sml');
    g+=T({x:A.x-6,y:A.y-22},'A','lbl')+T({x:C.x-6,y:C.y+24},'C','lbl')+T({x:B.x+22,y:B.y-6},'B','lbl')+T({x:612,y:y1-16},'d','lbl')+T({x:612,y:y2-16},'e','lbl');
    g+=hdl('A',A)+hdl('B',B)+hdl('C',C);api.draw(g);
    api.info(head('d ∥ e',`m(∠B) = ${al}° + ${be}° = ${al+be}°`,null,'Kesikli çizgi B\'den geçen yardımcı paralel. Sarı açılar iç ters, pembe açılar da iç ters açılardır.')+stats(stat('∠A',al+'°'),stat('∠C',be+'°'),stat('∠B ölçülen',x+'°')));
    if(user&&al+be===90)api.done('zig90');}
  api.drag((id,p)=>{const {A,B,C}=S;if(id==='A')S.A={x:clamp(Math.round(p.x),30,B.x-40),y:y1};else if(id==='C')S.C={x:clamp(Math.round(p.x),30,B.x-40),y:y2};else S.B={x:clamp(Math.round(p.x),Math.max(A.x,C.x)+40,620),y:clamp(Math.round(p.y),y1+30,y2-30)};render(true);});
  render(false);}},
{name:'Problem Çöz',note:'Önce verilen açıyla x\'in ilişkisini bul: aynı renkteyseler eşit, farklı renkteyseler toplamları 180°.',
init(api){
  const S={q:null,ok:0,ans:false};
  api.hint('x kaç derece? Cevabını yaz.');
  const box=document.createElement('div');box.className='qin';box.innerHTML=`<label for="qx" style="font-weight:800">x =</label><input id="qx" type="number" inputmode="numeric" min="0" max="180"><span style="font-weight:800">°</span>`;
  api.below.appendChild(box);const inp=box.querySelector('input');
  const kb=api.button('Kontrol et',()=>check(),{primary:true,where:box}),nb=api.button('Yeni soru',()=>{gen();render();},{where:box});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')check();});
  function gen(){let al;do{al=30+5*Math.floor(Math.random()*25);}while(al===90);const gv=Math.floor(Math.random()*8);let j;do{j=Math.floor(Math.random()*8);}while(j===gv);S.q={al,gv,j};S.ans=false;inp.value='';}
  function render(msg){const q=S.q;const r=kesenDraw({y1:140,y2:300,al:q.al},{quiz:true,hide:[],given:q.gv,ask:q.j,handles:false});api.draw(r.s);
    api.info(msg||head('Soru',`x = ?`,null,`d ∥ e. ${q.gv+1} numaralı konumdaki açı ${r.VAL(q.gv)}°. x\'i bul.`)+stats(stat('Doğru',S.ok),stat('Hedef','3')));}
  function check(){if(S.ans)return;const q=S.q,r=kesenRel(q.gv,q.j),v=q.j%2===0?q.al:180-q.al,u=+inp.value;if(inp.value==='')return;
    const ok=u===v;if(ok){S.ok++;S.ans=true;}
    render(head(ok?'Doğru!':'Tekrar dene',ok?`x = ${v}°`:`${u}° değil`,r.name,ok?(r.eq?'Bu iki açı eşit.':'Bu iki açının toplamı 180°.'):'İpucu: aynı renkte görünen açılar eşittir, farklı renkte olanlar bütünler.',ok?'good':'warn')+stats(stat('Doğru',S.ok),stat('Hedef','3')));
    if(S.ok>=3)api.done('coz3');}
  gen();render();}}
]});

/* ---------- Çokgenler 7 ---------- */
function regPoly(n,C,R,rot){const P=[];for(let i=0;i<n;i++)P.push(polar(C,R,(rot==null?90:rot)+360*i/n));return P.map(p=>({x:Math.round(p.x),y:Math.round(p.y)}));}
reg({id:'c7',g:7,sub:'Çokgenler',title:'Kaç Üçgen Sığar?',
icon:'<path class="if" d="M60 12L102 36V84L60 108L18 84V36Z"/><path class="is" d="M60 12L102 84M60 12L60 108M60 12L18 84"/>',
tasks:[{k:'alti',text:'Altıgenin iç açıları toplamını bul',lab:0},{k:'icb',text:'İçbükey çokgende de kuralın işlediğini gör',lab:0},{k:'kucult',text:'Çokgeni bir noktaya kadar küçült',lab:1},{k:'dose',text:'Kare dışında, düzlemi boşluksuz kaplayan bir düzgün çokgen bul',lab:2},{k:'yamuk',text:'Bir yamuk oluştur',lab:3},{k:'esk',text:'Bir eşkenar dörtgen oluştur, köşegenlerine bak',lab:3}],
labs:[
{name:'İç Açılar Toplamı',why:true,note:'Bir köşeden çizilen köşegenler n kenarlı çokgeni (n − 2) üçgene böler. Her üçgen 180° getirir: iç açılar toplamı = (n − 2) × 180°.',
init(api){
  const C={x:320,y:225},S={n:5,P:[]};
  api.hint('Kenar sayısını seç, köşeleri sürükle.');
  api.slider({label:'Kenar sayısı',min:3,max:10,step:1,value:5,fmt:v=>Math.round(v),onInput:v=>{S.n=Math.round(v);S.P=regPoly(S.n,C,165);render(true);}});
  function render(user){const P=S.P,n=P.length,bad=selfX(P);let g=grid();
    if(!bad){const cls=['cA','cB','cC'];for(let i=1;i<n-1;i++)g+=poly([P[0],P[i],P[i+1]],'fpoly '+cls[i%3]).replace('fpoly','fpoly soft');for(let i=2;i<n-1;i++)g+=L(P[0],P[i],'dash');}
    g+=`<path class="outl" d="${pd(P)}"/>`;
    const ang=bad?[]:polyAngles(P),G={x:P.reduce((a,p)=>a+p.x,0)/n,y:P.reduce((a,p)=>a+p.y,0)/n};
    if(!bad)P.forEach((p,i)=>{const d=sub(G,p),dl=len(d)||1;g+=T({x:p.x+d.x/dl*30,y:p.y+d.y/dl*30},Math.round(ang[i])+'°','sml');});
    g+=P.map((p,i)=>hdl('v'+i,p)).join('');api.draw(g);
    if(bad){api.info(head('Durum','Kenarlar kesişiyor',null,'Çokgen olması için kenarlar kesişmemeli.',''));return;}
    const conc=ang.some(a=>a>180.5),sum=Math.round(ang.reduce((a,b)=>a+b,0));
    api.info(head(PL[n]+' · '+(n-2)+' üçgen',`(${n} − 2) × 180° = ${(n-2)*180}°`,conc?'İçbükey ama kural aynı':null,conc?'Köşegenlerin bazıları dışarı taşsa da toplam değişmiyor.':'Renkli bölgeler A köşesinden çizilen köşegenlerle oluşan üçgenler.')+stats(stat('Üçgen sayısı',n-2),stat('Ölçülen toplam',sum+'°')));
    if(user){if(n===6)api.done('alti');if(conc)api.done('icb');}}
  api.drag((id,p)=>{const i=+id.slice(1);S.P[i]={x:clamp(Math.round(p.x),20,W-20),y:clamp(Math.round(p.y),20,HT-20)};render(true);});
  S.P=regPoly(5,C,165);render(false);}},
{name:'Dış Açılar Turu',why:true,note:'Çokgenin etrafında yürüyen biri her köşede dış açı kadar döner ve başladığı yöne bakarak turu bitirir. Bir tam tur 360° olduğundan dış açılar toplamı her zaman 360°.',
init(api){
  const C={x:320,y:220},S={n:5,P:[],t:0};
  api.hint('Köşeleri sürükle, sonra Oynat\'a bas.');
  api.slider({label:'Kenar sayısı',min:3,max:8,step:1,value:5,fmt:v=>Math.round(v),onInput:v=>{S.n=Math.round(v);S.P=regPoly(S.n,C,150,100);S.t=0;tl.set(0);render(false);}});
  const tl=api.slider({label:'Küçült',min:0,max:1,step:0.001,value:0,play:true,dur:3200,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  const cols=['cA','cB','cC','cD','cA','cB','cC','cD'];
  function render(user){const P=S.P,n=P.length,k=ease(S.t);const G={x:P.reduce((a,p)=>a+p.x,0)/n,y:P.reduce((a,p)=>a+p.y,0)/n};
    const Q=P.map(p=>lerpP(p,G,k*0.999));let g=grid();const bad=selfX(P);
    g+=`<path class="outl" d="${pd(Q)}" style="fill:var(--hl4);fill-opacity:.12"/>`;
    const ang=bad?[]:polyAngles(P),conc=!bad&&ang.some(a=>a>180.5);let tot=0;
    Q.forEach((q,i)=>{const din=dirDeg(Q[(i-1+n)%n],q),dout=dirDeg(q,Q[(i+1)%n]);let turn=((dout-din+540)%360)-180;tot+=Math.abs(turn);
      const a0=turn>=0?din:dout,a1=turn>=0?din+turn:din;g+=L(q,polar(q,58*(1-k)+12,din),'dash');
      g+=`<path class="fsec ${cols[i]}" d="${sector(q,44,a0,a1)}"/>`;if(k<0.6)g+=T(polar(q,64,(a0+a1)/2),Math.round(Math.abs(turn))+'°','sml');});
    if(k>0.98)g+=`<circle cx="${f(G.x)}" cy="${f(G.y)}" r="50" style="fill:none;stroke:var(--ink);stroke-width:2"/>`+T({x:G.x,y:G.y+74},'Tam tur = 360°','ttl');
    if(S.t===0)g+=P.map((p,i)=>hdl('v'+i,p)).join('');api.draw(g);
    api.info(head('Dış açılar',`Toplam = ${Math.round(tot)}°`,conc||bad?'Dışbükey çokgen kullan':(k>0.98?'Hepsi bir noktada':null),conc||bad?'Dış açı kuralı dışbükey çokgenler için.':'Çokgen küçüldükçe dış açılar bir noktada buluşup tam bir daire oluşturur.',conc||bad?'warn':'good')+stats(stat('Köşe sayısı',n),stat('Toplam',Math.round(tot)+'°','n ne olursa olsun')));
    if(user&&S.t>0.99&&!conc&&!bad)api.done('kucult');}
  api.drag((id,p)=>{if(S.t>0)return;const i=+id.slice(1);S.P[i]={x:clamp(Math.round(p.x),30,W-30),y:clamp(Math.round(p.y),30,HT-30)};render(false);});
  S.P=regPoly(5,C,150,100);render(false);}},
{name:'Düzgün Çokgenler',why:true,note:'Düzgün çokgenin her iç açısı (n − 2) × 180° ÷ n. Bir noktanın çevresi 360° olduğundan yalnızca iç açısı 360°\'yi tam bölen üçgen, kare ve altıgen düzlemi boşluksuz kaplar. Arı peteği bu yüzden altıgendir.',
init(api){
  const S={n:6};
  api.hint('Kenar sayısını değiştir, sağdaki döşemeyi izle.');
  api.slider({label:'Kenar sayısı',min:3,max:12,step:1,value:6,fmt:v=>Math.round(v),onInput:v=>{S.n=Math.round(v);render(true);}});
  function render(user){const n=S.n,ia=(n-2)*180/n,ea=360/n,C={x:170,y:225},P=regPoly(n,C,125,90+180/n);let g=grid();
    P.forEach(p=>{g+=L(C,p,'dash');});g+=`<path class="fpoly cD soft" d="${pd(P)}"/>`;
    const w=wedge(P[0],P[n-1],P[1]);g+=`<path class="fsec cA" d="${sector(P[0],30,w.s,w.s+w.d)}"/>`+T(polar(P[0],54,w.s+w.d/2),tr(ia)+'°','sml');
    g+=`<path class="fsec cB" d="${sector(C,26,90+180/n,90+180/n+ea)}"/>`+T(polar(C,44,90+180/n+ea/2),tr(ea)+'°','sml');
    const V={x:470,y:225},k=Math.floor(360/ia+1e-9),side=n>8?34:n>6?42:52,cls=['cA','cB','cC','cD'];
    for(let j=0;j<k;j++){const ph=j*ia;const Q=[V];let p=V;for(let m=0;m<n-1;m++){p=polar(p,side,ph+m*ea);Q.push(p);}g+=poly(Q,'fpoly '+cls[j%4]);}
    const gap=360-k*ia;if(gap>0.5)g+=`<path d="${sector(V,side*0.9,k*ia,360)}" style="fill:var(--pen);fill-opacity:.55"/>`+T(polar(V,side+24,k*ia+gap/2),tr(gap)+'° boşluk','sml');
    g+=`<circle class="vtx" cx="${V.x}" cy="${V.y}" r="4"/>`+T({x:170,y:405},'Düzgün '+PL[n],'ttl')+T({x:470,y:405},gap>0.5?'Boşluk kalıyor':'Tam kaplıyor!','ttl');api.draw(g);
    api.info(head('Düzgün '+PL[n],`İç açı = ${tr(ia)}°`,gap>0.5?'Düzlemi kaplamaz':'Düzlemi kaplar','Tüm kenarları ve tüm açıları eşit.',gap>0.5?'':'good')+`<p class="eqn">(${n} − 2) × 180° ÷ ${n} = ${tr(ia)}°</p>`+stats(stat('Dış açı',tr(ea)+'°','360° ÷ '+n),stat('Merkez açı',tr(ea)+'°','360° ÷ '+n)));
    if(user&&gap<=0.5&&n!==4)api.done('dose');}
  render(false);}},
{name:'Yamuk ve Eşkenar Dörtgen',note:'Eşkenar dörtgenin köşegenleri birbirini dik keser ve ortalar. Yamuğun yalnızca bir çift kenarı paraleldir; ikizkenar yamukta köşegenler eşittir.',init:quadLab({yamuk:'yamuk',esk:'esk'},true)}
]});

/* ---------- Daire alanı ---------- */
reg({id:'d7',g:7,sub:'Çember ve Daire',title:'Pizza Matematiği',
icon:'<circle class="if" cx="54" cy="64" r="42"/><path class="is" d="M54 64L96 64M54 64L33 27.6M54 64L33 100.4"/><path class="if2" d="M70 54L112 54A42 42 0 0 0 91 17.6Z"/>',
tasks:[{k:'diz',text:'Daireyi en az 24 dilime böl ve dikdörtgene diz',lab:0},{k:'ceyrek',text:'Çeyrek daire dilimi oluştur',lab:1},{k:'alt',text:'Dairenin altıda biri olan dilimi oluştur',lab:1}],
labs:[
{name:'Dilimle ve Diz',why:true,note:'Daireyi ince dilimlere ayırıp ters-düz dizince dikdörtgene benzer. Uzun kenarı çevrenin yarısı (π·r), kısa kenarı yarıçap (r). Alan = π·r·r = π·r².',
init(api){
  const S={n:8,t:0},r=80,C0={x:320,y:150},yb=390,yt=yb-r;
  api.hint('Dilim sayısını seç, Oynat\'a bas.');
  api.slider({label:'Dilim sayısı',min:4,max:40,step:2,value:8,fmt:v=>Math.round(v),onInput:v=>{S.n=Math.round(v);render(true);}});
  api.slider({label:'Diz',min:0,max:1,step:0.001,value:0,play:true,dur:3600,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  function render(user){const n=S.n,w=360/n,k=ease(S.t),s=2*PI*r/n,off=320-((n/2)*s+s/2)/2;let g=grid();
    if(S.t>0)g+=`<circle cx="${C0.x}" cy="${C0.y}" r="${r}" class="ring"/>`;
    for(let i=0;i<n;i++){const ev=i%2===0,tgt=ev?{x:off+(i/2)*s+s/2,y:yt}:{x:off+((i+1)/2)*s,y:yb},b1=ev?270:90,b0=i*w+w/2;
      const dl=((b1-b0+540)%360)-180,b=b0+dl*k,c=lerpP(C0,tgt,k);g+=`<path class="fsec ${ev?'cA':'cB'}" style="stroke-width:1" d="${sector(c,r,b-w/2,b+w/2)}"/>`;}
    if(S.t>0.97){const xL=off,xR=off+(n/2)*s+s/2;g+=L({x:xL+s/4,y:yb+16},{x:xR-s/4,y:yb+16},'dim')+T({x:320,y:yb+30},'≈ π·r (çevrenin yarısı)','dimt');
      g+=L({x:xR+12,y:yt},{x:xR+12,y:yb},'dim')+T({x:xR+30,y:(yt+yb)/2},'r','dimt');}
    api.draw(g);
    api.info(head(S.t>0.97?'Neredeyse bir dikdörtgen':'Daire dilimleniyor',`Alan = π · r · r = π · r²`,n>=24?'İnce dilimler':'Daha çok dilim dene',`${n} dilim. Dilimler inceldikçe kenarlar düzleşir ve şekil dikdörtgene yaklaşır.`)+stats(stat('Uzun kenar','π · r','çevrenin yarısı'),stat('Kısa kenar','r','yarıçap')));
    if(user&&n>=24&&S.t>0.99)api.done('diz');}
  render(false);}},
{name:'Daire Dilimi',note:'Daire dilimi, merkez açısı kadar daireden pay alır. 90° dairenin dörtte biri, 60° altıda biridir: dilim alanı = π·r² × α ÷ 360.',
init(api){
  const O={x:300,y:225},S={r:3,a:120};
  api.hint('Kırmızı noktayı sürükleyerek merkez açısını değiştir.');
  api.slider({label:'Yarıçap',min:1,max:4.5,step:0.5,value:3,fmt:v=>tr(v)+' br',onInput:v=>{S.r=v;render(true);}});
  function render(user){const r=S.r*U,a=S.a;let g=grid()+`<circle cx="${O.x}" cy="${O.y}" r="${r}" class="cD" style="fill-opacity:.15;stroke:var(--ink);stroke-width:2"/>`;
    g+=`<path class="fsec cA" style="stroke-width:3" d="${sector(O,r,0,a)}"/>`+`<path d="${arc(O,r,0,a)}" style="fill:none;stroke:var(--pen);stroke-width:5"/>`;
    g+=`<path class="sec" style="fill:var(--hl2)" d="${sector(O,30,0,a)}"/>`+T(polar(O,52,a/2),a+'°','val');
    g+=T(polar(O,r/2,-14),'r','sml')+hdl('a',polar(O,r,a),'Merkez açısı');api.draw(g);
    const A=PI*S.r*S.r,frac=a/360;
    api.info(head(`Merkez açısı ${a}°`,`Dilim = ${tr(A*frac,2)} br²`,a===90?'Çeyrek daire':a===180?'Yarım daire':a===60?'Altıda bir':null,`Daire alanı π·r² ≈ 3,14 × ${tr(S.r*S.r,2)} = ${tr(A,2)} br²`)+`<p class="eqn">π·r² × ${a}/360 ≈ ${tr(A*frac,2)} br²</p>`+stats(stat('Daireden payı',tr(frac*100,1)+'%'),stat('Yay uzunluğu',tr(2*PI*S.r*frac,2)+' br','kırmızı yay')));
    if(user){if(a===90)api.done('ceyrek');if(a===60)api.done('alt');}}
  api.drag((id,p)=>{let a=Math.round(dirDeg(O,p)/5)*5;if(a===0)a=S.a>180?360:5;a=clamp(a,5,360);if(a!==S.a){S.a=a;render(true);}});
  render(false);}}
]});

/* ---------- Yardımcı elemanlar ---------- */
function triCenters(P){const {A,B,C}=P,a=dist(B,C),b=dist(C,A),c=dist(A,B),s=(a+b+c)/2,ar=Math.abs(cross(sub(B,A),sub(C,A)))/2;
  const G={x:(A.x+B.x+C.x)/3,y:(A.y+B.y+C.y)/3},I={x:(a*A.x+b*B.x+c*C.x)/(a+b+c),y:(a*A.y+b*B.y+c*C.y)/(a+b+c)};
  const Ha=foot(A,B,C),Hb=foot(B,C,A),Hc=foot(C,A,B),H=intersect(A,Ha,B,Hb);
  return {a,b,c,s,ar,G,I,r:ar/s,Ha,Hb,Hc,H,Da:{x:(b*B.x+c*C.x)/(b+c),y:(b*B.y+c*C.y)/(b+c)},Db:{x:(a*A.x+c*C.x)/(a+c),y:(a*A.y+c*C.y)/(a+c)},Dc:{x:(a*A.x+b*B.x)/(a+b),y:(a*A.y+b*B.y)/(a+b)},Ma:mid(B,C),Mb:mid(C,A),Mc:mid(A,B)};}
reg({id:'y7',g:7,sub:'Üçgenin Yardımcı Elemanları',title:'Üçgenin Gizli Çizgileri',
icon:'<path class="if" d="M12 100H108L44 18Z"/><path class="is" d="M44 18L60 100M12 100L76 59M108 100L28 59" style="stroke-dasharray:6 6"/><circle class="ipen" cx="54.7" cy="72.7" r="6"/>',
tasks:[{k:'g',text:'Kenarortayları çiz, ağırlık merkezini bul',lab:0},{k:'ic',text:'Açıortaylarla iç teğet çemberi çiz',lab:0},{k:'dis',text:'Yükseklikleri dışarıda kesişen bir üçgen yap',lab:0,hint:'Geniş açılı üçgen'},{k:'alti',text:'Kenarortayların oluşturduğu 6 parçayı ayır',lab:1}],
labs:[
{name:'Kenarortay, Açıortay, Yükseklik',note:'Kenarortay kenarın orta noktasına, açıortay açıyı iki eş parçaya, yükseklik karşı kenara dik iner. Her türün üç çizgisi tek bir noktada buluşur.',
init(api){
  const P={A:{x:240,y:80},B:{x:120,y:380},C:{x:540,y:380}},S={m:true,b:false,h:false,ic:false};
  api.hint('Çizgileri aç, köşeleri sürükle.');
  api.check('Kenarortay',true,v=>{S.m=v;render(true);});api.check('Açıortay',false,v=>{S.b=v;render(true);});api.check('Yükseklik',false,v=>{S.h=v;render(true);});api.check('İç teğet çember',false,v=>{S.ic=v;render(true);});
  function render(user){const st=triState(P);let g=grid();if(st.degen){api.draw(g+`<path class="tri" d="${pd([P.A,P.B,P.C])}"/>`+triHandles(P));api.info(degenInfo());return;}
    const c=triCenters(P);g+=triDraw(P,st,{sides:false,angleVals:!S.b,ticks:false});
    const V=[P.A,P.B,P.C];let info='';
    if(S.h){[[P.A,c.Ha,P.B,P.C],[P.B,c.Hb,P.C,P.A],[P.C,c.Hc,P.A,P.B]].forEach(([v,h,p,q])=>{if(h.t<0||h.t>1)g+=L(h.t<0?h:q,h.t<0?p:h,'dash');g+=`<line x1="${f(v.x)}" y1="${f(v.y)}" x2="${f(h.x)}" y2="${f(h.y)}" style="stroke:var(--ink);stroke-width:2.6;stroke-dasharray:9 5"/>`+rightMark(h,dirDeg(h,q),11);});
      if(c.H){const out=st.byAng==='Geniş açılı';if(out){g+=L(P.A,c.H,'dash')+L(P.B,c.H,'dash')+L(P.C,c.H,'dash');}g+=`<circle cx="${f(c.H.x)}" cy="${f(c.H.y)}" r="6" style="fill:var(--ink)"/>`+T({x:c.H.x+14,y:c.H.y-14},'H','lbl');
        info+=`<li class="${out?'y':'n'}"><b>Yükseklikler</b>: ${out?'H dışarıda kesişiyor (geniş açılı)':st.byAng==='Dik açılı'?'H dik açının köşesinde':'H üçgenin içinde'}. h<sub>a</sub> = ${tr(dist(P.A,c.Ha)/U)} br</li>`;}}
    if(S.m){[[P.A,c.Ma],[P.B,c.Mb],[P.C,c.Mc]].forEach(([v,m])=>{g+=`<line x1="${f(v.x)}" y1="${f(v.y)}" x2="${f(m.x)}" y2="${f(m.y)}" style="stroke:var(--ok);stroke-width:3"/>`+`<circle cx="${f(m.x)}" cy="${f(m.y)}" r="4" style="fill:var(--ok)"/>`;});
      g+=eqTicks(P.B,c.Ma)+eqTicks(c.Ma,P.C)+eqTicks(P.C,c.Mb,2)+eqTicks(c.Mb,P.A,2)+eqTicks(P.A,c.Mc,3)+eqTicks(c.Mc,P.B,3);
      g+=`<circle cx="${f(c.G.x)}" cy="${f(c.G.y)}" r="7" style="fill:var(--ok);stroke:var(--sheet);stroke-width:2"/>`+T({x:c.G.x+16,y:c.G.y+14},'G','lbl');
      info+=`<li class="y"><b>Kenarortaylar</b> G\'de kesişir. |AG| = ${tr(dist(P.A,c.G)/U)}, |GD| = ${tr(dist(c.G,c.Ma)/U)} br → oran 2 : 1</li>`;}
    if(S.b||S.ic){if(S.b)[[P.A,c.Da],[P.B,c.Db],[P.C,c.Dc]].forEach(([v,d])=>{g+=`<line x1="${f(v.x)}" y1="${f(v.y)}" x2="${f(d.x)}" y2="${f(d.y)}" style="stroke:var(--pen);stroke-width:3"/>`;});
      if(S.b)V.forEach((v,i)=>{const w=wedge(v,V[(i+1)%3],V[(i+2)%3]);g+=`<path d="${arc(v,46,w.s,w.s+w.d/2)}" style="fill:none;stroke:var(--pen);stroke-width:2"/><path d="${arc(v,52,w.s+w.d/2,w.s+w.d)}" style="fill:none;stroke:var(--pen);stroke-width:2"/>`;});
      if(S.ic)g+=`<circle cx="${f(c.I.x)}" cy="${f(c.I.y)}" r="${f(c.r)}" style="fill:var(--hl2);fill-opacity:.2;stroke:var(--pen);stroke-width:2.5"/>`;
      g+=`<circle cx="${f(c.I.x)}" cy="${f(c.I.y)}" r="6" style="fill:var(--pen);stroke:var(--sheet);stroke-width:2"/>`+T({x:c.I.x-16,y:c.I.y-14},'I','lbl');
      info+=`<li class="y"><b>Açıortaylar</b> I\'da kesişir. I\'nın üç kenara uzaklığı eşit: r = ${tr(c.r/U)} br</li>`;}
    g+=triHandles(P);api.draw(g);
    api.info(head('Üçgen',st.byAng,null,'Yeşil: kenarortay. Kırmızı: açıortay. Kesikli: yükseklik.')+(info?`<ul class="checks">${info}</ul>`:'<p class="desc">Yukarıdan bir çizgi türü seç.</p>'));
    if(user){if(S.m)api.done('g');if(S.ic)api.done('ic');if(S.h&&st.byAng==='Geniş açılı')api.done('dis');}}
  api.drag((id,p)=>{if(triMove(P,id,p,true))render(true);});render(false);}},
{name:'Altı Eş Parça',why:true,note:'Kenarortay üçgeni iki eş alana böler: tabanlar eş, yükseklik ortak. Üç kenarortay birlikte üçgeni alanları eşit 6 küçük üçgene ayırır.',
init(api){
  const P={A:{x:280,y:70},B:{x:100,y:380},C:{x:560,y:360}},S={t:0};
  api.hint('Köşeleri sürükle, sonra parçaları ayır.');
  api.slider({label:'Parçaları ayır',min:0,max:1,step:0.001,value:0,play:true,dur:2000,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  function render(user){const st=triState(P);let g=grid();if(st.degen){api.draw(g+`<path class="tri" d="${pd([P.A,P.B,P.C])}"/>`+triHandles(P));api.info(degenInfo());return;}
    const c=triCenters(P),G=c.G,k=ease(S.t)*26;
    const parts=[[P.A,c.Mc,G],[c.Mc,P.B,G],[P.B,c.Ma,G],[c.Ma,P.C,G],[P.C,c.Mb,G],[c.Mb,P.A,G]],cls=['cA','cB','cC','cD','cA','cB'];
    const one=st.area/6/(U*U);
    parts.forEach((pp,i)=>{const ctr={x:(pp[0].x+pp[1].x+pp[2].x)/3,y:(pp[0].y+pp[1].y+pp[2].y)/3},d=sub(ctr,G),dl=len(d)||1,o={x:d.x/dl*k,y:d.y/dl*k};
      const q=pp.map(p=>add(p,o));g+=poly(q,'fpoly '+cls[i]);g+=T(add(ctr,o),tr(one,2),'sml');});
    if(S.t===0)g+=triHandles(P);api.draw(g);
    api.info(head('Altı küçük üçgen',`Her biri ${tr(one,2)} br²`,null,`Toplam alan ${tr(st.area/(U*U),2)} br². 6\'ya bölünce her parça aynı.`)+`<p class="eqn">${tr(st.area/(U*U),2)} ÷ 6 = ${tr(one,2)} br²</p>`);
    if(user&&S.t>0.99)api.done('alti');}
  api.drag((id,p)=>{if(S.t>0)return;if(triMove(P,id,p,true))render(false);});render(false);}}
]});

/* ---------- Farklı yönlerden görünüm ---------- */
function views(h){const fr=[0,1,2,3].map(x=>Math.max(...[0,1,2,3].map(z=>h[z][x]))),rt=[3,2,1,0].map(z=>Math.max(...h[z])),tp=h.map(r=>r.map(v=>v>0));return {fr,rt,tp};}
function viewGrid(x0,y0,cs,cols,data,top){let g='';const rows=top?4:3;
  for(let i=0;i<cols;i++)for(let r=0;r<rows;r++){const on=top?data[r][i]:(rows-1-r)<data[i];g+=`<rect x="${x0+i*cs}" y="${y0+r*cs}" width="${cs}" height="${cs}" style="fill:${on?'var(--hl)':'var(--paper)'};stroke:${on?'var(--ink)':'var(--grid2)'};stroke-width:${on?2:1}"/>`;}
  return g;}
function cubesOf(h){const cells=[];for(let z=0;z<4;z++)for(let x=0;x<4;x++)for(let y=0;y<h[z][x];y++)cells.push([x-2,y,z-2]);return cells;}
function editor(api,h,onCh){const ed=document.createElement('div');ed.className='ed';const gd=document.createElement('div');gd.className='ed-grid';gd.setAttribute('aria-label','Kule yükseklikleri, üstten görünüm');
  const btns=[];for(let z=0;z<4;z++)for(let x=0;x<4;x++){const b=document.createElement('button');b.type='button';b.onclick=()=>{h[z][x]=(h[z][x]+1)%4;sync();onCh();};gd.appendChild(b);btns.push([b,z,x]);}
  const sync=()=>btns.forEach(([b,z,x])=>{b.textContent=h[z][x]||'';b.className=h[z][x]?'on':'';b.setAttribute('aria-label',`Satır ${z+1}, sütun ${x+1}: ${h[z][x]} küp`);});
  ed.appendChild(gd);const sm=document.createElement('small');sm.innerHTML='Kareye dokundukça o noktadaki kule 1 küp yükselir (en fazla 3, sonra sıfırlanır). Üst sıra arka, alt sıra ön taraf.';ed.appendChild(sm);api.below.appendChild(ed);sync();return sync;}
reg({id:'g7',g:7,sub:'Cisimlerin Farklı Yönden Görünümleri',title:'Üç Göz Bakışı',
icon:'<path class="if" d="M20 50L44 38L68 50L68 78L44 90L20 78Z"/><path class="is" d="M20 50L44 62L68 50M44 62V90"/><path class="if" d="M44 26L68 14L92 26L92 54L68 66L44 54Z"/><path class="is" d="M44 26L68 38L92 26M68 38V66"/><path class="if" d="M68 62L92 50L116 62L116 90L92 102L68 90Z"/>',
tasks:[{k:'sekiz',text:'En az 8 küplük bir yapı kur',lab:0},{k:'ayni',text:'Önden ve sağdan görünümü aynı olan bir yapı kur',lab:0},{k:'bulmaca',text:'Bir görünüm bulmacasını çöz',lab:1}],
labs:[
{name:'Küp Kule Ustası',note:'Önden bakınca her sütunun en yüksek kulesini görürüz; arkadakiler önündekilerin arkasına saklanır. Bu yüzden görünüm, küp sayısını her zaman söylemez.',
init(api){
  const h=[[1,0,0,0],[2,1,0,0],[3,2,1,0],[1,1,1,1]],cam=cam3({yaw:-0.78,pitch:0.62,s:40,cx:215,cy:250});
  api.hint('Aşağıdaki kareye dokunarak küp ekle. Döndürmek için sürükle.');
  const sync=editor(api,h,()=>render(true));
  api.button('Yapıyı 90° döndür',()=>{const n=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];for(let z=0;z<4;z++)for(let x=0;x<4;x++)n[x][3-z]=h[z][x];for(let z=0;z<4;z++)h[z]=n[z];sync();render(true);});
  api.button('Temizle',()=>{h.forEach(r=>r.fill(0));sync();render(false);});
  api.orbit(cam,()=>render(false));
  function render(user){const cells=cubesOf(h),v=views(h);let g=plain();
    g+=painter3(cubesFaces(cells,'cA'),cam);const fp=P3(v3(0,0,3),cam);g+=T({x:fp.x-14,y:fp.y+22},'ÖN','sml');const rp=P3(v3(3,0,0),cam);g+=T({x:rp.x+22,y:rp.y+18},'SAĞ','sml');
    g+=T({x:470,y:22},'Önden','ttl','start')+viewGrid(470,34,24,4,v.fr);
    g+=T({x:470,y:142},'Sağdan','ttl','start')+viewGrid(470,154,24,4,v.rt);
    g+=T({x:470,y:262},'Üstten','ttl','start')+viewGrid(470,274,24,4,v.tp,true);
    api.draw(g);const n=cells.length;
    api.info(head('Yapı',`${n} birim küp`,null,'Sağdaki üç görünüm, yapıya ön, sağ ve üst taraftan dik bakınca görülen karelerdir.')+stats(stat('Önden kare',v.fr.reduce((a,b)=>a+b,0)),stat('Sağdan kare',v.rt.reduce((a,b)=>a+b,0)),stat('Üstten kare',v.tp.flat().filter(Boolean).length)));
    if(user){if(n>=8)api.done('sekiz');if(n>0&&v.fr.join()===v.rt.join())api.done('ayni');}}
  render(false);}},
{name:'Görünümden Yapıya',why:true,note:'Üç görünüm bir yapıyı çoğu zaman tek başına belirlemez: aynı görünümleri veren farklı yapılar kurulabilir. Mühendisler bu yüzden teknik çizimlere ek bilgi koyar.',
init(api){
  const PZ=[[[0,0,0,0],[0,1,0,0],[1,2,1,0],[1,1,0,0]],[[0,0,0,0],[2,0,0,0],[2,1,1,0],[1,1,1,1]],[[0,0,0,0],[0,3,0,0],[1,2,1,0],[0,1,0,0]],[[1,0,0,1],[1,0,0,1],[2,1,1,2],[0,0,0,0]]];
  const S={p:0};const h=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],cam=cam3({yaw:-0.78,pitch:0.6,s:30,cx:170,cy:270});
  api.hint('Hedef görünümleri veren bir yapı kur.');
  const sync=editor(api,h,()=>render(true));
  api.button('Yeni bulmaca',()=>{S.p=(S.p+1)%PZ.length;h.forEach(r=>r.fill(0));sync();render(false);});
  api.orbit(cam,()=>render(false));
  function render(user){const tv=views(PZ[S.p]),uv=views(h);const ok=[tv.fr.join()===uv.fr.join(),tv.rt.join()===uv.rt.join(),JSON.stringify(tv.tp)===JSON.stringify(uv.tp)];
    let g=plain()+painter3(cubesFaces(cubesOf(h),'cB'),cam);const fp=P3(v3(0,0,2.6),cam);g+=T({x:fp.x,y:fp.y+18},'ÖN','sml');
    g+=T({x:410,y:20},'Hedef','ttl')+T({x:540,y:20},'Seninki','ttl');
    [['Önden',tv.fr,uv.fr,false],['Sağdan',tv.rt,uv.rt,false],['Üstten',tv.tp,uv.tp,true]].forEach(([n,a,b,tp],i)=>{const y=48+i*128;g+=T({x:330,y:y+36},n,'sml','start');g+=viewGrid(372,y,20,4,a,tp)+viewGrid(500,y,20,4,b,tp);
      g+=`<circle cx="${600}" cy="${y+36}" r="10" style="fill:${ok[i]?'var(--ok)':'var(--paper)'};stroke:var(--ink-soft)"/>`;});
    api.draw(g);const all=ok.every(Boolean)&&cubesOf(h).length>0;
    api.info(head(`Bulmaca ${S.p+1}`,all?'Çözdün!':`${ok.filter(Boolean).length} / 3 görünüm tuttu`,all?`${cubesOf(h).length} küp kullandın`:null,all?'Aynı görünümleri farklı sayıda küple de elde edebilir misin?':'Önce üstten görünümü tutturmak işini kolaylaştırır.',all?'good':''));
    if(user&&all)api.done('bulmaca');}
  render(false);}}
]});
