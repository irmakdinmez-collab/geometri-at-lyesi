/* ======================= 6. SINIF ======================= */

/* ---------- Açılar 6 ---------- */
reg({id:'a6',g:6,sub:'Açılar',title:'Kesişme Noktası',
icon:'<path class="if" d="M60 60L102 60A42 42 0 0 0 89.7 30.3Z"/><path class="if" d="M60 60L18 60A42 42 0 0 0 30.3 89.7Z"/><path class="is" d="M8 60H112M22 98L98 22"/>',
tasks:[{k:'ters',text:'Bir açıya dokun, ters açısının eşit olduğunu gör',lab:0},{k:'dik',text:'İki doğruyu dik kesiştir',lab:0},
 {k:'kdik',text:'Keseni paralel doğrulara dik yap',lab:1},{k:'ic',text:'3 numaralı açıya dokun, iç ters eşini bul',lab:1},{k:'yon',text:'7 numaralı açıya dokun, yöndeşini bul',lab:1}],
labs:[
{name:'Ters ve Komşu Açılar',why:true,note:'Ters açılar neden eşit? ∠1 ile ∠2 bütünler, ∠2 ile ∠3 de bütünler. İkisi de 180°\'yi ∠2 ile tamamlıyorsa ∠1 = ∠3 olmak zorunda.',
init(api){
  const O={x:320,y:220},S={a1:20,a2:115,sel:0};
  api.hint('Doğruları kırmızı noktalardan döndür, açılara dokun.');
  function render(clicked){let a1=S.a1,a2=S.a2;if(a1>a2){const t=a1;a1=a2;a2=t;}const x=a2-a1;
    const st=[a1,a2,a1+180,a2+180],en=[a2,a1+180,a2+180,a1+360],val=[x,180-x,x,180-x];
    let s=grid()+lineFull(O,polar(O,10,S.a1))+lineFull(O,polar(O,10,S.a2));
    for(let i=0;i<4;i++){let c='';if(i===S.sel)c=' sel';else if(i%2===S.sel%2)c=' mate';s+=`<path class="ang ${i%2?'cB':'cA'}${c}" data-ang="${i}" tabindex="0" role="button" aria-label="${i+1} numaralı açı" d="${sector(O,60,st[i],en[i])}"/>`;}
    for(let i=0;i<4;i++){const m=(st[i]+en[i])/2;s+=T(polar(O,36,m),i+1,'anum')+T(polar(O,84,m),val[i]+'°','val');}
    s+=`<circle class="vtx" cx="${O.x}" cy="${O.y}" r="5"/>`+hdl('l1',polar(O,170,S.a1),'Birinci doğru')+hdl('l2',polar(O,170,S.a2),'İkinci doğru');api.draw(s);
    const i=S.sel,j=(i+1)%4,k=(i+2)%4;
    api.info(head('Seçili açı',`m(∠${i+1}) = ${val[i]}°`,null,`∠${k+1} onun ters açısı, ∠${j+1} ve ∠${(i+3)%4+1} komşu bütünleri.`)+
      `<ul class="rel"><li class="eq"><b>∠${k+1}</b><span>Ters açılar</span><em>eşit</em></li><li class="sup"><b>∠${j+1}</b><span>Komşu bütünler</span><em>toplam 180°</em></li><li class="sup"><b>∠${(i+3)%4+1}</b><span>Komşu bütünler</span><em>toplam 180°</em></li></ul>`+
      `<p class="eqn">∠${i+1} + ∠${j+1} = ${val[i]}° + ${val[j]}° = 180°<br>∠${j+1} + ∠${k+1} = ${val[j]}° + ${val[k]}° = 180°<small>İkisi de ∠${j+1} ile 180° ediyor, o halde ∠${i+1} = ∠${k+1}</small></p>`);
    if(clicked)api.done('ters');if(x===90)api.done('dik');}
  api.drag((id,p)=>{let a=Math.round(dirDeg(O,p))%180;const other=id==='l1'?S.a2:S.a1;if(Math.abs(a-other)<6||Math.abs(a-other)>174)return;if(id==='l1')S.a1=a;else S.a2=a;render(false);});
  const pick=e=>{const a=e.target.closest('[data-ang]');if(!a)return;S.sel=+a.dataset.ang;render(true);};
  api.svg.addEventListener('click',pick);api.svg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e);}});
  render(false);}},
{name:'Paralel ve Kesen',note:'Paralel doğrular bir kesenle 8 açı oluşturur ama yalnızca iki farklı ölçü vardır. Aynı renkli açılar eşit, farklı renkliler bütünlerdir.',init:kesenLab({dik:'kdik',ic:'ic',yon:'yon'})}
]});

/* ---------- Alan ölçme ---------- */
reg({id:'al6',g:6,sub:'Alan Ölçme',title:'Kes, Kaydır, Bul',
icon:'<path class="if" d="M12 92L72 92L106 30L46 30Z"/><path class="is" d="M46 30V92" style="stroke-dasharray:6 7"/><path class="is" d="M46 82H56V92"/>',
tasks:[{k:'kes',text:'Paralelkenarı kesip dikdörtgene çevir',lab:0},{k:'a24',text:'Alanı 24 br² olan eğik bir paralelkenar kur',lab:0},{k:'yarim',text:'Üçgeni kopyalayıp paralelkenar yap',lab:1},{k:'sabit',text:'Tepe noktasını 4 br kaydır, alanı izle',lab:2},{k:'disari',text:'Yüksekliğin üçgenin dışına düştüğü bir üçgen yap',lab:2}],
labs:[
{name:'Paralelkenardan Dikdörtgene',why:true,note:'Paralelkenarın bir ucundaki üçgeni kesip öbür uca taşıyınca dikdörtgen olur. Hiçbir parça eklenmedi ya da atılmadı, o yüzden alan = taban × yükseklik.',
init(api){
  const S={a:5,h:4,s:2,t:0},x0=80,yb=380;
  api.hint('Üst sol köşeyi sürükleyerek eğ, sonra Oynat.');
  api.slider({label:'Taban',min:2,max:7,step:1,value:5,fmt:v=>v+' br',onInput:v=>{S.a=v;S.s=Math.min(S.s,Math.min(S.a,12-S.a));render(true);}});
  api.slider({label:'Yükseklik',min:1,max:7,step:1,value:4,fmt:v=>v+' br',onInput:v=>{S.h=v;render(true);}});
  const tl=api.slider({label:'Kes ve taşı',min:0,max:1,step:0.001,value:0,play:true,dur:2600,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  function render(user){const a=S.a*U,h=S.h*U,s=S.s*U,k=ease(S.t);
    const A={x:x0,y:yb},B={x:x0+a,y:yb},C={x:x0+a+s,y:yb-h},D={x:x0+s,y:yb-h};let g=grid();
    g+=`<path class="ghost" d="${pd([A,B,C,D])}"/>`;
    if(s>0){g+=poly([{x:x0+s,y:yb},B,C,D],'fpoly cA');const dx=a*k;g+=poly([{x:A.x+dx,y:yb},{x:x0+s+dx,y:yb},{x:D.x+dx,y:D.y}],'fpoly cB');}
    else g+=poly([A,B,C,D],'fpoly cA');
    g+=L({x:x0+s,y:yb},D,'dash')+rightMark({x:x0+s,y:yb},0,12);
    g+=T({x:x0+a/2+(k>0.98?s:0),y:yb+22},`taban = ${S.a} br`,'sml')+T({x:x0+s-10,y:yb-h/2},`h = ${S.h}`,'sml','end');
    if(S.t===0)g+=hdl('D',D,'Eğmek için sürükle');api.draw(g);
    api.info(head(k>0.98?'Artık bir dikdörtgen':'Paralelkenar',`Alan = ${S.a} × ${S.h} = ${S.a*S.h} br²`,null,'Kareleri sayarak da kontrol edebilirsin: pembe parça, sağdaki boşluğu tam dolduruyor.')+stats(stat('Taban',S.a+' br'),stat('Yükseklik',S.h+' br','tabana dik uzaklık')));
    if(user){if(S.t>0.99&&S.s>0)api.done('kes');if(S.a*S.h===24&&S.s>0)api.done('a24');}}
  api.drag((id,p)=>{if(S.t>0)return;const smax=Math.min(S.a,12-S.a);const s=clamp(Math.round((p.x-x0)/U),0,smax);if(s!==S.s){S.s=s;render(true);}});
  render(false);}},
{name:'Üçgen = Yarım Paralelkenar',why:true,note:'İki eş üçgeni birleştirince paralelkenar oluşur. Demek ki üçgenin alanı, aynı taban ve yükseklikteki paralelkenarın yarısıdır: (taban × yükseklik) ÷ 2.',
init(api){
  const S={a:5,h:4,s:2,t:0},x0=100,yb=380;
  api.hint('Tepe noktasını sürükle, sonra Oynat.');
  api.slider({label:'Taban',min:2,max:6,step:1,value:5,fmt:v=>v+' br',onInput:v=>{S.a=v;S.s=Math.min(S.s,S.a);render(true);}});
  api.slider({label:'Yükseklik',min:1,max:7,step:1,value:4,fmt:v=>v+' br',onInput:v=>{S.h=v;render(true);}});
  api.slider({label:'Kopyayı döndür',min:0,max:1,step:0.001,value:0,play:true,dur:2600,fmt:v=>Math.round(v*180)+'°',onInput:v=>{S.t=v;render(true);}});
  function render(user){const a=S.a*U,h=S.h*U,k=ease(S.t);const A={x:x0,y:yb},B={x:x0+a,y:yb},C={x:x0+S.s*U,y:yb-h},M=mid(B,C),ph=PI*k;
    const rot=p=>{const d=sub(p,M);return {x:M.x+d.x*Math.cos(ph)-d.y*Math.sin(ph),y:M.y+d.x*Math.sin(ph)+d.y*Math.cos(ph)};};
    let g=grid();g+=poly([rot(A),rot(B),rot(C)],'fpoly cB'+(k===0?' soft':''));g+=poly([A,B,C],'fpoly cA');
    g+=L(C,{x:C.x,y:yb},'dash')+rightMark({x:C.x,y:yb},0,12)+`<circle class="kpt" cx="${f(M.x)}" cy="${f(M.y)}" r="5"/>`;
    g+=T({x:x0+a/2,y:yb+22},`taban = ${S.a} br`,'sml')+T({x:C.x-10,y:yb-h/2},`h = ${S.h}`,'sml','end');
    if(S.t===0)g+=hdl('C',C,'Tepe noktası');api.draw(g);
    const A2=S.a*S.h;
    api.info(head(k>0.98?'İki üçgen = bir paralelkenar':'Kopya üçgen dönüyor',`Alan = ${S.a} × ${S.h} ÷ 2 = ${tr(A2/2)} br²`,null,'Kopya, BC kenarının orta noktası etrafında yarım tur döner.')+stats(stat('Paralelkenar',A2+' br²'),stat('Bir üçgen',tr(A2/2)+' br²','yarısı')));
    if(user&&S.t>0.99)api.done('yarim');}
  api.drag((id,p)=>{if(S.t>0)return;const s=clamp(Math.round((p.x-x0)/U),0,S.a);if(s!==S.s){S.s=s;render(true);}});
  render(false);}},
{name:'Aynı Taban, Aynı Yükseklik',why:true,note:'Tepe noktası tabana paralel bir doğru üzerinde kayarsa üçgenin şekli ve çevresi değişir ama alanı hiç değişmez. Alanı yalnızca taban ve yükseklik belirler.',
init(api){
  const S={a:4,h:5,cx:280},B1={x:200,y:380},x0=280;
  api.hint('C noktasını sağa sola kaydır.');
  api.slider({label:'Yükseklik',min:1,max:8,step:1,value:5,fmt:v=>v+' br',onInput:v=>{S.h=v;render(false);}});
  function render(user){const B2={x:B1.x+S.a*U,y:B1.y},C={x:S.cx,y:B1.y-S.h*U},Fo={x:C.x,y:B1.y};let g=grid();
    g+=L({x:0,y:C.y},{x:W,y:C.y},'dash')+`<path class="ghost" d="${pd([B1,B2,{x:x0,y:C.y}])}"/>`;
    const out=C.x<B1.x||C.x>B2.x;if(out)g+=L(C.x<B1.x?Fo:B2,C.x<B1.x?B1:Fo,'dash');
    g+=poly([B1,B2,C],'fpoly cA')+L(C,Fo,'dash')+rightMark(Fo,C.x<B1.x?0:180,12);
    g+=T({x:(B1.x+B2.x)/2,y:B1.y+22},`taban = ${S.a} br`,'sml')+T({x:C.x+10,y:(C.y+B1.y)/2},`h = ${S.h}`,'sml','start')+T({x:C.x,y:C.y-20},'C','lbl')+T({x:B1.x-14,y:B1.y+16},'A','lbl')+T({x:B2.x+14,y:B2.y+16},'B','lbl');
    g+=hdl('C',C,'C noktası');api.draw(g);
    const per=(dist(B1,B2)+dist(B2,C)+dist(C,B1))/U;
    api.info(head('Üçgenin alanı',`${S.a} × ${S.h} ÷ 2 = ${tr(S.a*S.h/2)} br²`,out?'Yükseklik dışarıda':null,out?'Geniş açılı üçgende yükseklik, tabanın uzantısına iner. Formül yine aynı!':'Kesikli üçgen ilk konum. Alanları aynı.')+stats(stat('Alan',tr(S.a*S.h/2)+' br²','hiç değişmiyor'),stat('Çevre',tr(per)+' br','değişiyor!')));
    if(user){if(Math.abs(S.cx-x0)>=4*U)api.done('sabit');if(out)api.done('disari');}}
  api.drag((id,p)=>{const x=clamp(snapv(p.x,20),40,600);if(x!==S.cx){S.cx=x;render(true);}});
  render(false);}}
]});

/* ---------- Çember uzunluğu ---------- */
reg({id:'pi6',g:6,sub:'Çember ve π Sayısı',title:'Pi Peşinde',
icon:'<circle class="if" cx="36" cy="62" r="25"/><path class="is" d="M8 90H112"/><path class="is" d="M36 87L36 62" style="stroke-dasharray:5 6"/><text x="86" y="74" text-anchor="middle" style="font:800 48px var(--display);fill:var(--ink)">π</text>',
tasks:[{k:'yuvarla',text:'Tekerleği bir tam tur yuvarla',lab:0},{k:'iki',text:'İki farklı büyüklükte tekerlek yuvarla, oranı karşılaştır',lab:0},{k:'sar',text:'Çapı çevreye sarmayı bitir',lab:1},{k:'r7',text:'Çapı 7 br olan çemberin çevresini 22/7 ile hesapla',lab:2}],
labs:[
{name:'Tekerleği Yuvarla',why:true,note:'Hangi büyüklükte tekerlek olursa olsun, bir turda aldığı yol çapının yaklaşık 3,14 katıdır. Bu sabit sayıya π (pi) denir: Çevre = π × çap.',
init(api){
  const S={r:1.5,t:0},rolled=new Set(),x0=50,gy=360;
  api.hint('Tekerlek boyunu seç, Oynat\'a bas.');
  api.slider({label:'Yarıçap',min:0.75,max:2,step:0.25,value:1.5,fmt:v=>tr(v,2)+' br',onInput:v=>{S.r=v;S.t=0;tl.set(0);render(false);}});
  const tl=api.slider({label:'Yuvarla',min:0,max:1,step:0.001,value:0,play:true,dur:3800,fmt:v=>Math.round(v*360)+'°',onInput:v=>{S.t=v;render(true);}});
  function render(user){const r=S.r*U,C2=2*PI*r,d=C2*S.t,th=d/r*R2D;const c={x:x0+d,y:gy-r};let g=grid();
    g+=L({x:20,y:gy},{x:620,y:gy},'ray thin');
    for(let j=1;j<=3;j++){const x=x0+j*2*r;g+=L({x,y:gy-8},{x,y:gy+14},'ray thin')+T({x:x-r,y:gy+28},j+'. çap','sml');}
    g+=L({x:x0,y:gy+6},{x:x0,y:gy-6},'ray thin');
    const rem=x0+C2;g+=L({x:rem,y:gy-14},{x:rem,y:gy+14},'dash');
    if(d>0)g+=`<line x1="${x0}" y1="${gy}" x2="${f(x0+d)}" y2="${gy}" style="stroke:var(--pen);stroke-width:7;stroke-linecap:round"/>`;
    let cy='';const n=Math.max(2,Math.round(60*S.t));for(let i=0;i<=n;i++){const dd=d*i/n,a=270-dd/r*R2D;const q=polar({x:x0+dd,y:gy-r},r,a);cy+=(i?'L':'M')+f(q.x)+' '+f(q.y);}if(d>0)g+=`<path class="cyc" d="${cy}"/>`;
    g+=`<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${r}" class="cD" style="fill-opacity:.35;stroke:var(--ink);stroke-width:3.5"/>`;
    for(let k=0;k<4;k++){g+=L(c,polar(c,r,45*k-th),'ray thin');g+=L(c,polar(c,r,45*k+180-th),'ray thin');}
    if(th>0)g+=`<path d="${arc(c,r,270-Math.min(th,359.9),270)}" style="fill:none;stroke:var(--pen);stroke-width:7"/>`;
    const mk=polar(c,r,270-th);g+=`<circle cx="${f(mk.x)}" cy="${f(mk.y)}" r="7" style="fill:var(--pen);stroke:var(--sheet);stroke-width:2"/>`;
    api.draw(g);
    const ratio=d/(2*r);
    api.info(head('Yuvarlanan yol',`${tr(d/U,2)} br`,S.t>0.999?'Bir tam tur!':null,`Çap ${tr(2*S.r,1)} br. Kırmızı çizgi, tekerleğin çevresinin yere serilmiş hali.`)+stats(stat('Yol ÷ çap',tr(ratio,2)),stat('Tam turda',tr(2*PI*S.r,2)+' br','= 3,14 × '+tr(2*S.r))));
    if(user&&S.t>0.999){api.done('yuvarla');rolled.add(S.r);if(rolled.size>=2)api.done('iki');}}
  render(false);}},
{name:'Çapı Çevreye Sar',why:true,note:'Çapı ip gibi düşünüp çemberin üstüne sararsan 3 tam çap sığar, biraz da artar. Bu "3 ve biraz" tam olarak π = 3,14159… sayısıdır.',
init(api){
  const C={x:320,y:230},r=110,S={t:0};
  api.hint('Oynat\'a bas: çap çemberin etrafına sarılıyor.');
  api.slider({label:'Sar',min:0,max:1,step:0.001,value:0,play:true,dur:4000,fmt:v=>tr(v*PI,2)+' çap',onInput:v=>{S.t=v;render(true);}});
  function render(user){const tot=S.t*PI;let g=grid();g+=`<circle cx="${C.x}" cy="${C.y}" r="${r}" class="ring" style="stroke-width:2"/>`;
    g+=L({x:C.x-r,y:C.y},{x:C.x+r,y:C.y},'ray pen')+T({x:C.x,y:C.y-16},'çap','sml');
    const step=2*R2D,cols=['var(--hl)','var(--hl2)','var(--hl3)','var(--hl4)'];
    for(let j=0;j<4;j++){const s0=j,s1=Math.min(tot,j+1);if(s1<=s0)break;const a1=90-s0*step,a0=90-s1*step;
      g+=`<path d="${arc(C,r,a0,a1)}" style="fill:none;stroke:${cols[j]};stroke-width:14;stroke-linecap:butt"/>`;
      const p=polar(C,r,a1),q=polar(C,r+22,a1),qq=polar(C,r-16,a1);g+=L(qq,q,'ray thin');
      g+=T(polar(C,r+34,(a0+a1)/2),j<3?(s1-s0>0.99?(j+1)+'. çap':''):tr(s1-s0,2),'sml');}
    api.draw(g);
    api.info(head('Çevreye sarılan',`${tr(tot,2)} çap`,S.t>0.999?'Çember tamamlandı':null,'Her renk bir çap uzunluğunda. Üç çap yetmiyor, küçük bir parça daha gerekiyor.')+`<p class="eqn">Çevre ≈ 3,14 × çap<small>π ≈ 3,14159…</small></p>`);
    if(user&&S.t>0.999)api.done('sar');}
  render(false);}},
{name:'Çevre Hesaplayıcı',note:'Çevre = 2 × π × r = π × çap. Okulda π için çoğu zaman 3 ya da 3,14 kullanılır. Çap 7\'nin katıysa 22/7 hesabı kolaylaştırır.',
init(api){
  const O={x:320,y:220},S={r:3,pi:'3.14'};
  api.hint('Kırmızı noktayı sürükleyerek yarıçapı değiştir.');
  api.seg([['3','π ≈ 3'],['3.14','π ≈ 3,14'],['22/7','π ≈ 22/7']],'3.14',v=>{S.pi=v;render(true);},{label:'Pi değeri'});
  function render(user){const r=S.r*U;let g=grid()+`<circle cx="${O.x}" cy="${O.y}" r="${r}" class="cD" style="fill-opacity:.25;stroke:var(--ink);stroke-width:3.5"/>`;
    g+=L(O,{x:O.x+r,y:O.y},'ray pen')+T({x:O.x+r/2,y:O.y-16},`r = ${tr(S.r)}`,'sml')+`<circle class="vtx" cx="${O.x}" cy="${O.y}" r="5"/>`+hdl('r',{x:O.x+r,y:O.y},'Yarıçap');api.draw(g);
    const d=2*S.r;let piv,txt;if(S.pi==='22/7'){piv=22/7;txt='22/7';}else{piv=+S.pi;txt=S.pi.replace('.',',');}
    const c=piv*d;
    api.info(head('Çemberin uzunluğu',`Ç ≈ ${tr(c,2)} br`,null,`Çap = 2 × ${tr(S.r)} = ${tr(d)} br`)+`<p class="eqn">Ç = π × çap ≈ ${txt} × ${tr(d)} = ${tr(c,2)}</p>`+stats(stat('Yarıçap',tr(S.r)+' br'),stat('Çap',tr(d)+' br')));
    if(user&&S.pi==='22/7'&&Math.abs(d-7)<1e-6)api.done('r7');}
  api.drag((id,p)=>{const r=clamp(Math.round((p.x-O.x)/(U/2))/2,1,4.5);if(r!==S.r){S.r=r;render(true);}});
  render(false);}}
]});

/* ---------- Yüzey alanı ve hacim ---------- */
function cubeFillLab(keys){return function(api){
  const S={a:3,b:2,c:4,n:6},cam=cam3({s:38,cy:265});
  api.hint('Boyutları seç, Oynat\'a bas. Döndürmek için sürükle.');
  const fill=()=>{fl.input.max=S.a*S.b*S.c;fl.max=S.a*S.b*S.c;S.n=Math.min(S.n,S.a*S.b*S.c);fl.set(S.n);};
  api.slider({label:'En',min:1,max:5,step:1,value:3,fmt:v=>v,onInput:v=>{S.a=v;fill();render(true);}});
  api.slider({label:'Boy',min:1,max:5,step:1,value:2,fmt:v=>v,onInput:v=>{S.b=v;fill();render(true);}});
  api.slider({label:'Yükseklik',min:1,max:5,step:1,value:4,fmt:v=>v,onInput:v=>{S.c=v;fill();render(true);}});
  const fl=api.slider({label:'Küp koy',min:0,max:24,step:1,value:0,play:true,dur:4000,fmt:v=>Math.floor(v),onInput:v=>{S.n=Math.floor(v);render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const {a,b,c}=S,ab=a*b,cells=[];for(let i=0;i<S.n;i++){const ly=Math.floor(i/ab),r=i%ab;cells.push([r%a-a/2,ly-c/2,Math.floor(r/a)-b/2]);}
    let g=plain();const E=boxFaces(-a/2,-c/2,-b/2,a/2,c/2,b/2);const ed=[[0,1],[1,2],[2,3],[3,0]];
    E.forEach(fc=>ed.forEach(([i,j])=>{g+=L(P3(fc.p[i],cam),P3(fc.p[j],cam),'dash');}));
    g+=painter3(cubesFaces(cells,'cA'),cam);api.draw(g);
    const full=Math.floor(S.n/ab);
    api.info(head('Hacim',`${a} × ${b} × ${c} = ${a*b*c} br³`,S.n===a*b*c?'Kutu doldu':`${S.n} küp kondu`,`Bir katmana taban alanı kadar küp sığar: ${a} × ${b} = ${ab} küp.`)+stats(stat('Bir katman',ab+' küp'),stat('Dolu katman',full+' / '+c),stat('Toplam',S.n+' küp'))+`<p class="eqn">Hacim = taban alanı × yükseklik</p>`);
    if(user&&S.n===a*b*c){if(keys.dolu)api.done(keys.dolu);if(keys.h24&&a*b*c===24)api.done(keys.h24);}}
  fill();render(false);};}
reg({id:'h6',g:6,sub:'Dik Prizmalar: Alan ve Hacim',title:'Kutunun İçi ve Dışı',
icon:'<path class="if" d="M18 40L60 20L102 40L102 86L60 106L18 86Z"/><path class="is" d="M18 40L60 60L102 40M60 60V106M39 50V96M81 50V96M18 63L60 83L102 63"/>',
tasks:[{k:'alan',text:'Kutuyu açıp yüzey alanını hesapla',lab:0},{k:'kup',text:'Küpün yüzey alanını bul',lab:0,hint:'Üç boyut eşit olsun'},{k:'dolu',text:'Bir kutuyu birim küplerle tamamen doldur',lab:1},{k:'h24',text:'Hacmi 24 br³ olan bir kutuyu doldur',lab:1}],
labs:[
{name:'Açınımda Yüzey Alanı',why:true,note:'Yüzey alanı, kutuyu kaplamak için gereken kâğıt miktarıdır. Açınımdaki 6 dikdörtgenin alanları toplanır: 2 × (en·boy + en·yükseklik + boy·yükseklik).',
init(api){
  const S={a:4,b:2,c:3,t:0},cam=cam3({s:30,cy:250,pitch:0.5});
  api.hint('Boyutları seç, kutuyu aç.');
  api.slider({label:'En',min:1,max:5,step:1,value:4,fmt:v=>v+' br',onInput:v=>{S.a=v;render(true);}});
  api.slider({label:'Boy',min:1,max:4,step:1,value:2,fmt:v=>v+' br',onInput:v=>{S.b=v;render(true);}});
  api.slider({label:'Yükseklik',min:1,max:4,step:1,value:3,fmt:v=>v+' br',onInput:v=>{S.c=v;render(true);}});
  api.slider({label:'Aç',min:0,max:1,step:0.001,value:0,play:true,dur:3000,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const {a,b,c}=S,k=ease(S.t);const c2=netCam(cam,S.a,S.b,S.c,k);
    const F=netFaces(a,b,c,k);const ar={alt:a*b,üst:a*b,ön:a*c,arka:a*c,sağ:b*c,sol:b*c};if(S.t>0.98)F.forEach(fc=>fc.lab=ar[fc.n]+'');
    api.draw(plain()+painter3(F,c2));const SA=2*(a*b+a*c+b*c);
    api.info(head('Yüzey alanı',`${SA} br²`,a===b&&b===c?'Küp: 6 × '+a*a:null,'Açınımdaki sayılar her yüzün alanı.')+`<ul class="rows"><li><i class="sw cA"></i>Alt + üst<b>2 × ${a*b}</b></li><li><i class="sw cB"></i>Ön + arka<b>2 × ${a*c}</b></li><li><i class="sw cC"></i>Sağ + sol<b>2 × ${b*c}</b></li></ul><p class="eqn">2 × (${a*b} + ${a*c} + ${b*c}) = ${SA} br²</p>`);
    if(user&&S.t>0.99){api.done('alan');if(a===b&&b===c)api.done('kup');}}
  render(false);}},
{name:'Birim Küplerle Hacim',why:true,note:'Hacim, kutunun içine kaç birim küp sığdığıdır. Önce tabana bir katman dizilir, sonra katmanlar üst üste konur: hacim = taban alanı × yükseklik.',init:cubeFillLab({dolu:'dolu',h24:'h24'})}
]});

/* ---------- Sıvı ölçme ---------- */
function tankLab(o){return function(api){
  const S={a:o.a,b:o.b,c:o.c,w:0},cam=cam3({s:o.s,cy:o.cy||250,pitch:0.45});
  api.hint(o.hint);
  if(o.dims){api.slider({label:'En',min:20,max:60,step:5,value:S.a,fmt:v=>v+' cm',onInput:v=>{S.a=v;render(true);}});
    api.slider({label:'Boy',min:20,max:40,step:5,value:S.b,fmt:v=>v+' cm',onInput:v=>{S.b=v;render(true);}});
    api.slider({label:'Yükseklik',min:20,max:50,step:5,value:S.c,fmt:v=>v+' cm',onInput:v=>{S.c=v;S.w=Math.min(S.w,v);ws.input.max=v;ws.max=v;ws.set(S.w);render(true);}});}
  const ws=api.slider({label:'Su yüksekliği',min:0,max:S.c,step:o.step||1,value:0,play:true,dur:3500,fmt:v=>tr(v)+' cm',onInput:v=>{S.w=v;render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const {a,b,c}=S;const w=Math.round(S.w*10)/10;let g=plain();
    if(w>0.05)g+=convex3(boxFaces(-a/2+0.15,-c/2+0.05,-b/2+0.15,a/2-0.15,-c/2+w,b/2-0.15,'cD'),cam,{noHidden:true});
    g+=convex3(boxFaces(-a/2,-c/2,-b/2,a/2,c/2,b/2,'glass'),cam);
    if(o.unitCube){const u=boxFaces(a/2+3,-c/2,b/2-1,a/2+4,-c/2+1,b/2,'cA');g+=convex3(u,cam,{noHidden:true});const p=P3(v3(a/2+3.5,-c/2+1,b/2),cam);g+=T({x:p.x+40,y:p.y-26},'1 cm³','sml');}
    api.draw(g);o.info(api,S,w,user);}
  render(false);};}
reg({id:'s6',g:6,sub:'Sıvı Ölçme',title:'Damla Damla Litre',
icon:'<path class="if2" d="M30 16H90V100A6 6 0 0 1 84 106H36A6 6 0 0 1 30 100Z"/><path class="if" d="M30 58H90V100A6 6 0 0 1 84 106H36A6 6 0 0 1 30 100Z"/><path class="is" d="M30 16H90M74 32H90M80 46H90M74 60H90M80 74H90M74 88H90"/>',
tasks:[{k:'litre',text:'1 dm³\'lük küpü tamamen doldur',lab:0},{k:'yarim',text:'Küpe tam 500 mL su koy',lab:0},{k:'b15',text:'Sürahiye tam 1,5 L su koy',lab:1},{k:'dl7',text:'Sürahiye tam 7 dL su koy',lab:1},{k:'l24',text:'Akvaryuma tam 24 L su koy',lab:2}],
labs:[
{name:'1 Litrelik Küp',why:true,note:'Ayrıtı 10 cm olan küpün hacmi 10 × 10 × 10 = 1000 cm³ = 1 dm³. Bu küp tam 1 litre su alır. Yani 1 cm³ = 1 mL.',
init:tankLab({a:10,b:10,c:10,s:19,cy:250,step:0.1,unitCube:true,hint:'Su yüksekliğini artır. Döndürmek için sürükle.',
  info(api,S,w,user){const ml=Math.round(100*w);api.info(head('Küpteki su',`${ml} mL`,ml===1000?'Tam 1 litre!':null,`Taban 10 cm × 10 cm = 100 cm². Su yüksekliği ${tr(w)} cm.`)+`<p class="eqn">100 × ${tr(w)} = ${ml} cm³ = ${ml} mL</p>`+stats(stat('Litre',tr(ml/1000,3)+' L'),stat('1 cm su',' 100 mL','her santimetre')));
    if(user){if(ml===1000)api.done('litre');if(ml===500)api.done('yarim');}}})},
{name:'Ölçü Merdiveni',note:'Sıvı ölçüleri onar onar büyür: 1 L = 10 dL = 100 cL = 1000 mL. Büyük birimden küçüğe inerken 10 ile çarpılır.',
init(api){
  const S={ml:0};
  api.hint('Butonlarla sürahiye su ekle.');
  [['+1 L',1000],['+1 dL',100],['+1 cL',10],['+1 mL',1]].forEach(([l,v])=>api.button(l,()=>{S.ml=Math.min(3000,S.ml+v);render(true);}));
  api.button('Boşalt',()=>{S.ml=0;render(false);});
  function render(user){const ml=S.ml;let g=grid();const x0=70,y0=60,w=170,h=330,yb=y0+h;const lv=yb-h*ml/3000;
    g+=`<rect x="${x0}" y="${f(lv)}" width="${w}" height="${f(yb-lv)}" class="water"/>`;
    g+=`<path class="outl" d="M${x0} ${y0}V${yb}H${x0+w}V${y0}"/><path class="outl" d="M${x0+w} ${y0+40}h28a12 12 0 0 1 12 12v120a12 12 0 0 1-12 12h-28"/>`;
    for(let m=0;m<=3000;m+=100){const y=yb-h*m/3000,big=m%500===0;g+=L({x:x0,y},{x:x0+(big?34:18),y},'ray thin');if(m%500===0&&m>0)g+=T({x:x0+40,y},tr(m/1000)+' L','sml','start');}
    const U4=['L','dL','cL','mL'],D=[1000,100,10,1],X=[330,410,490,570];
    for(let i=0;i<4;i++){const y=110+i*70;g+=`<rect x="${X[i]-38}" y="${y-26}" width="76" height="52" rx="10" class="cP" style="stroke:var(--ink);stroke-width:2.5"/>`+T({x:X[i],y:y-8},U4[i],'ttl')+T({x:X[i],y:y+12},tr(ml/D[i],3),'sml');
      if(i<3){const p={x:X[i]+6,y:y+30},q={x:X[i+1]-6,y:y+40};g+=`<path class="dash" d="M${p.x} ${p.y}Q${p.x+10} ${q.y+6} ${q.x} ${q.y}"/>`+T({x:(p.x+q.x)/2+6,y:q.y+14},'× 10','sml');}}
    api.draw(g);
    api.info(head('Sürahide',ml>=1000?tr(ml/1000,3)+' L':ml+' mL',null,`${ml} mL = ${tr(ml/10,1)} cL = ${tr(ml/100,2)} dL = ${tr(ml/1000,3)} L`)+stats(stat('Su bardağı (200 mL)',tr(ml/200,2)+' bardak'),stat('Çay kaşığı (5 mL)',Math.round(ml/5)+' kaşık')));
    if(user){if(ml===1500)api.done('b15');if(ml===700)api.done('dl7');}}
  render(false);}},
{name:'Akvaryum',note:'Bir kaptaki sıvının hacmi = taban alanı × sıvının yüksekliği. Sonucu cm³ olarak bulursan 1000\'e bölerek litreye çevirirsin.',
init:tankLab({a:40,b:30,c:30,s:5.2,cy:240,dims:true,step:1,hint:'Akvaryumun boyutlarını ve su yüksekliğini ayarla.',
  info(api,S,w,user){const v=S.a*S.b*w;api.info(head('Akvaryumdaki su',`${tr(v/1000,3)} L`,null,`${S.a} cm × ${S.b} cm taban, ${tr(w)} cm su.`)+`<p class="eqn">${S.a} × ${S.b} × ${tr(w)} = ${v} cm³<small>1000 cm³ = 1 L</small></p>`+stats(stat('Tam dolu',tr(S.a*S.b*S.c/1000,2)+' L'),stat('Doluluk',Math.round(100*w/S.c)+'%')));
    if(user&&v===24000)api.done('l24');}})}
]});
