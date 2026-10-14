/* ======================= 8. SINIF ======================= */

/* ---------- Üçgende açı-kenar, eşitsizlik ---------- */
reg({id:'e8',g:8,sub:'Üçgenler',title:'Kenar Kavgası',
icon:'<path class="is" d="M12 96H108"/><path class="is" d="M12 96L44 46" style="stroke:var(--pen)"/><path class="is" d="M108 96L80 44" style="stroke:var(--hl4)"/><path class="is" d="M50 40L74 38" style="stroke-dasharray:4 6;stroke-width:3"/>',
tasks:[{k:'olur',text:'Üç çubukla bir üçgen kur',lab:0},{k:'olmaz',text:'Üçgen kurulamayan üç uzunluk bul',lab:0},{k:'duz',text:'Çubukların tam düz çizgi olduğu sınır durumu bul',lab:0},{k:'esit',text:'İki açısı eşit bir üçgende karşı kenarları karşılaştır',lab:1},{k:'dik',text:'Dik üçgende en uzun kenarı bul',lab:1}],
labs:[
{name:'Üçgen Eşitsizliği',why:true,note:'Kısa iki kenarın toplamı üçüncü kenardan uzun olmazsa çubuklar birbirine yetişemez. Kural: her kenar, öbür ikisinin farkından büyük ve toplamından küçük olmalı.',
init(api){
  const S={a:8,b:5,c:4,t:0},Sc=40,yb=360;
  api.hint('Çubuk uzunluklarını seç, Oynat\'a bas.');
  const reset=()=>{S.t=0;tl.set(0);};
  api.slider({label:'Taban (a)',min:2,max:10,step:0.5,value:8,fmt:v=>tr(v),onInput:v=>{S.a=v;reset();render(false);}});
  api.slider({label:'Sol çubuk (b)',min:1,max:10,step:0.5,value:5,fmt:v=>tr(v),onInput:v=>{S.b=v;reset();render(false);}});
  api.slider({label:'Sağ çubuk (c)',min:1,max:10,step:0.5,value:4,fmt:v=>tr(v),onInput:v=>{S.c=v;reset();render(false);}});
  const tl=api.slider({label:'Birleştir',min:0,max:1,step:0.001,value:0,play:true,dur:2500,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  function render(user){const {a,b,c}=S,k=ease(S.t);const Lp={x:320-a*Sc/2,y:yb},Rp={x:320+a*Sc/2,y:yb};
    const ok=b+c>a&&a+c>b&&a+b>c,eq=!ok&&(Math.abs(b+c-a)<1e-9||Math.abs(a+c-b)<1e-9||Math.abs(a+b-c)<1e-9);
    let tb,tc;if(ok){const x=(a*a+b*b-c*c)/(2*a),y=Math.sqrt(Math.max(0,b*b-x*x));tb=Math.atan2(y,x)*R2D;tc=180-Math.atan2(y,a-x)*R2D;}
    else if(b>=a+c){tb=0;tc=0;}else if(c>=a+b){tb=180;tc=180;}else{tb=0;tc=180;}
    const bb=lerp(115,tb,k),cc=lerp(65,tc,k);const Pb=polar(Lp,b*Sc,bb),Pc=polar(Rp,c*Sc,cc);let g=grid();
    if(ok&&S.t>0.99)g+=poly([Lp,Rp,Pb],'fpoly cC soft');
    g+=`<line x1="${f(Lp.x)}" y1="${yb}" x2="${f(Rp.x)}" y2="${yb}" style="stroke:var(--ink);stroke-width:9;stroke-linecap:round"/>`;
    g+=`<line x1="${f(Lp.x)}" y1="${yb}" x2="${f(Pb.x)}" y2="${f(Pb.y)}" style="stroke:var(--hl2);stroke-width:9;stroke-linecap:round"/><line x1="${f(Rp.x)}" y1="${yb}" x2="${f(Pc.x)}" y2="${f(Pc.y)}" style="stroke:var(--hl4);stroke-width:9;stroke-linecap:round"/>`;
    g+=`<circle class="kpt" cx="${f(Lp.x)}" cy="${yb}" r="6"/><circle class="kpt" cx="${f(Rp.x)}" cy="${yb}" r="6"/>`;
    const gap=dist(Pb,Pc);if(S.t>0.99&&!ok&&gap>2)g+=`<line x1="${f(Pb.x)}" y1="${f(Pb.y-14)}" x2="${f(Pc.x)}" y2="${f(Pc.y-14)}" class="badline" style="stroke-dasharray:5 5"/>`+T({x:(Pb.x+Pc.x)/2,y:Pb.y-32},'yetişemiyor: '+tr(gap/Sc)+' br','sml');
    g+=T({x:320,y:yb+26},'a = '+tr(a),'sml')+T(polar(Lp,b*Sc/2,bb),'b = '+tr(b),'val')+T(polar(Rp,c*Sc/2,cc),'c = '+tr(c),'val');api.draw(g);
    const res=ok?['Üçgen olur','good','Her kenar öbür ikisinin toplamından küçük.']:eq?['Düz bir çizgi','','Toplam tam eşit: çubuklar düz yatıyor, alan sıfır. Bu bir üçgen değil.']:['Üçgen olmaz','warn','Kısa çubuklar yetişemiyor.'];
    api.info(head('Sonuç',res[0],null,res[2],res[1])+checks([[b+c>a,`b + c > a → ${tr(b+c)} > ${tr(a)}`],[a+c>b,`a + c > b → ${tr(a+c)} > ${tr(b)}`],[a+b>c,`a + b > c → ${tr(a+b)} > ${tr(c)}`]])+`<p class="eqn">|b − c| < a < b + c<small>${tr(Math.abs(b-c))} < ${tr(a)} < ${tr(b+c)}</small></p>`);
    if(user&&S.t>0.99){if(ok)api.done('olur');else if(eq)api.done('duz');else api.done('olmaz');}}
  render(false);}},
{name:'Büyük Açı, Büyük Kenar',note:'Üçgende en büyük açının karşısında en uzun kenar, en küçük açının karşısında en kısa kenar bulunur. Eşit açıların karşısındaki kenarlar da eşittir.',
init(api){
  const P={A:{x:200,y:100},B:{x:120,y:360},C:{x:520,y:360}};
  api.hint('Köşeleri sürükle; aynı renkler karşılıklı açı ve kenar.');
  function render(user){const st=triState(P);let g=grid();if(st.degen){api.draw(g+`<path class="tri" d="${pd([P.A,P.B,P.C])}"/>`+triHandles(P));api.info(degenInfo());return;}
    const cols=['var(--hl)','var(--hl2)','var(--hl3)'];[[P.B,P.C],[P.C,P.A],[P.A,P.B]].forEach(([p,q],i)=>{g+=`<line x1="${p.x}" y1="${p.y}" x2="${q.x}" y2="${q.y}" style="stroke:${cols[i]};stroke-width:12;stroke-linecap:round"/>`;});
    g+=triDraw(P,st,{ticks:true})+triHandles(P);api.draw(g);
    const nm=['A','B','C'],sn=['a','b','c'],sl=[st.sa,st.sb,st.sc];const ord=[0,1,2].sort((i,j)=>st.raw[j]-st.raw[i]);
    const rel=(arr,f2)=>ord.map(i=>f2(i)).join(Math.abs(arr[ord[0]]-arr[ord[1]])<1e-9?' = ':' > ');
    const aStr=ord.map(i=>`∠${nm[i]}`),sStr=ord.map(i=>sn[i]);const sym=(x,y)=>Math.abs(x-y)<0.6?' = ':' > ';
    api.info(head('Sıralama',`${aStr[0]}${sym(st.raw[ord[0]],st.raw[ord[1]])}${aStr[1]}${sym(st.raw[ord[1]],st.raw[ord[2]])}${aStr[2]}`,null,'Karşı kenarlar da aynı sırada:')+`<p class="eqn">${sStr[0]}${sym(st.raw[ord[0]],st.raw[ord[1]])}${sStr[1]}${sym(st.raw[ord[1]],st.raw[ord[2]])}${sStr[2]}</p>`+
      `<ul class="rows">${[0,1,2].map(i=>`<li><i class="sw ${['cA','cB','cC'][i]}"></i>∠${nm[i]} = ${st.ang[i]}° · karşısı ${sn[i]}<b>${tr(sl[i]/U)} br</b></li>`).join('')}</ul>`);
    if(user){if(st.bySide==='İkizkenar')api.done('esit');if(st.byAng==='Dik açılı')api.done('dik');}}
  api.drag((id,p)=>{if(triMove(P,id,p,true))render(true);});render(false);}}
]});

/* ---------- Eşlik ve benzerlik ---------- */
reg({id:'b8',g:8,sub:'Eşlik ve Benzerlik',title:'İkiz mi, Kuzen mi?',
icon:'<path class="if" d="M8 100H48L22 70Z"/><path class="if" d="M50 100H112L72 54Z" style="fill:var(--hl3)"/><path class="is" d="M34 34L86 34" style="stroke-dasharray:4 6;stroke-width:3"/>',
tasks:[{k:'k2',text:'Benzerlik oranını 2 yap, alan oranına bak',lab:0},{k:'es',text:'Oranı 1 yaparak eş üçgen elde et',lab:0},{k:'kak',text:'KAK kuralıyla hedef üçgenin eşini kur',lab:1},{k:'aka',text:'AKA kuralıyla hedef üçgenin eşini kur',lab:1},{k:'kkk',text:'KKK kuralıyla hedef üçgenin eşini kur',lab:1},{k:'golge',text:'Gölgelerden ağacın boyunu bul',lab:2}],
labs:[
{name:'Benzerlik Büyüteci',note:'Benzer üçgenlerde açılar aynıdır, kenarlar aynı oranda büyür (k). Alan ise k² kat büyür: kenarlar 2 katına çıkınca alan 4 katına çıkar.',
init(api){
  const P={A:{x:120,y:240},B:{x:60,y:400},C:{x:220,y:400}},S={k:1.5};
  api.hint('Soldaki üçgenin köşelerini sürükle, oranı değiştir.');
  api.slider({label:'Benzerlik oranı (k)',min:0.5,max:2,step:0.25,value:1.5,fmt:v=>tr(v,2),onInput:v=>{S.k=v;render(true);}});
  function render(user){const st=triState(P);let g=grid(20);if(st.degen){api.draw(g+`<path class="tri" d="${pd([P.A,P.B,P.C])}"/>`+triHandles(P));api.info(degenInfo());return;}
    const mnx=Math.min(P.A.x,P.B.x,P.C.x),mxy=Math.max(P.A.y,P.B.y,P.C.y),k=S.k,o={x:330,y:410};
    const Q={A:{x:o.x+k*(P.A.x-mnx),y:o.y-k*(mxy-P.A.y)},B:{x:o.x+k*(P.B.x-mnx),y:o.y-k*(mxy-P.B.y)},C:{x:o.x+k*(P.C.x-mnx),y:o.y-k*(mxy-P.C.y)}};
    const s2=triState(Q);g+=triDraw(P,st,{unit:U})+triDraw(Q,s2,{unit:U,names:["A'","B'","C'"]})+triHandles(P);api.draw(g);
    const es=Math.abs(k-1)<1e-9;
    api.info(head(es?'Eş üçgenler':'Benzer üçgenler',es?'ABC ≅ A\'B\'C\'':'ABC ∼ A\'B\'C\'',`Oran k = ${tr(k,2)}`,'Açılar birebir aynı, kenarlar aynı oranda.',es?'good':'')+
      `<table class="tb"><tr><th>Kenar</th><th>ABC</th><th>A'B'C'</th><th>Oran</th></tr>${[['AB',st.sc,s2.sc],['BC',st.sa,s2.sa],['CA',st.sb,s2.sb]].map(([n,x,y])=>`<tr><td>${n}</td><td>${tr(x/U,2)}</td><td>${tr(y/U,2)}</td><td>${tr(y/x,2)}</td></tr>`).join('')}</table>`+
      stats(stat('Açılar','aynı',st.ang.join('°, ')+'°'),stat('Alan oranı',tr(k*k,4),'k² = '+tr(k,2)+'²')));
    if(user){if(Math.abs(k-2)<1e-9)api.done('k2');if(es)api.done('es');}}
  api.drag((id,p)=>{if(triMove(P,id,p,false,[40,220,280,400])){P[id]={x:snapv(P[id].x,20),y:snapv(P[id].y,20)};render(true);}});render(false);}},
{name:'Eşlik Kuralı Kilidi',why:true,note:'Üç doğru parça bir üçgeni kilitler: KKK, KAK, AKA. Üç açı (AAA) yetmez; aynı açılarla farklı büyüklükte üçgenler çizilebilir. AAA yalnızca benzerlik verir.',
init(api){
  const A0={x:120,y:370},TG={c:6,A:50,b:5};const tC=polar(A0,TG.b*U,TG.A),tB={x:A0.x+TG.c*U,y:A0.y};const tst=triState({A:A0,B:tB,C:tC});
  const S={rule:'KAK',c:4,A:80,b:3,B:60,a:5};
  api.hint('Kaydırıcılarla kesikli hedef üçgenin eşini kur.');
  api.seg([['KAK','KAK'],['AKA','AKA'],['KKK','KKK'],['AAA','AAA']],'KAK',v=>{S.rule=v;build();render(false);},{label:'Kural'});
  const SL={c:['c kenarı (AB)',2,9,0.1,v=>tr(v)+' br'],b:['b kenarı (AC)',2,9,0.1,v=>tr(v)+' br'],a:['a kenarı (BC)',2,9,0.1,v=>tr(v)+' br'],A:['∠A',20,140,1,v=>Math.round(v)+'°'],B:['∠B',20,140,1,v=>Math.round(v)+'°']};
  const parts={KAK:['b','A','c'],AKA:['A','c','B'],KKK:['a','b','c'],AAA:['A','B','c']};
  function build(){api.below.innerHTML='';parts[S.rule].forEach(k=>{const d=SL[k];api.slider({label:d[0],min:d[1],max:d[2],step:d[3],value:S[k],fmt:d[4],onInput:v=>{S[k]=d[3]<1?Math.round(v*10)/10:Math.round(v);render(true);}});});}
  function tri(){const B={x:A0.x+S.c*U,y:A0.y};let C=null;
    if(S.rule==='KAK')C=polar(A0,S.b*U,S.A);
    else if(S.rule==='AKA'||S.rule==='AAA'){if(S.A+S.B<179)C=intersect(A0,polar(A0,10,S.A),B,polar(B,10,180-S.B));}
    else{const a=S.a,b=S.b,c=S.c;if(a+b>c&&a+c>b&&b+c>a){const x=(b*b+c*c-a*a)/(2*c);C={x:A0.x+x*U,y:A0.y-Math.sqrt(Math.max(0,b*b-x*x))*U};}}
    return C?{A:A0,B,C}:null;}
  function render(user){const P=tri();let g=grid()+`<path class="ghost" d="${pd([A0,tB,tC])}"/>`+T({x:tC.x,y:tC.y-18},'hedef','sml');
    if(!P){api.draw(g);api.info(head(S.rule,'Üçgen kurulamıyor','Değerleri değiştir','Bu parçalarla üçgen oluşmuyor.','warn'));return;}
    const st=triState(P);g+=triDraw(P,st,{ticks:false,colors:['cA','cB','cC']});api.draw(g);
    const match=!st.degen&&Math.abs(st.sa-tst.sa)<0.15*U&&Math.abs(st.sb-tst.sb)<0.15*U&&Math.abs(st.sc-tst.sc)<0.15*U;
    const angOnly=!st.degen&&S.rule==='AAA'&&Math.abs(st.raw[0]-tst.raw[0])<1.5&&Math.abs(st.raw[1]-tst.raw[1])<1.5;
    const desc={KAK:'İki kenar ve aralarındaki açı.',AKA:'İki açı ve aralarındaki kenar.',KKK:'Üç kenar.',AAA:'Üç açı (c yalnızca boyutu belirler).'}[S.rule];
    api.info(head(S.rule+' kuralı',match?'Eş! ≅':angOnly?'Benzer ama eş değil':'Henüz eş değil',match?'Hedefle çakıştı':null,angOnly&&!match?'Açılar aynı ama boyut farklı: AAA eşlik için yetmez.':desc,match?'good':'')+
      `<table class="tb"><tr><th></th><th>Hedef</th><th>Senin</th></tr><tr><td>a</td><td>${tr(tst.sa/U,1)}</td><td>${tr(st.sa/U,1)}</td></tr><tr><td>b</td><td>${tr(tst.sb/U,1)}</td><td>${tr(st.sb/U,1)}</td></tr><tr><td>c</td><td>${tr(tst.sc/U,1)}</td><td>${tr(st.sc/U,1)}</td></tr><tr><td>∠A</td><td>${Math.round(tst.raw[0])}°</td><td>${Math.round(st.raw[0])}°</td></tr><tr><td>∠B</td><td>${Math.round(tst.raw[1])}°</td><td>${Math.round(st.raw[1])}°</td></tr></table>`);
    if(user&&match){const m={KAK:'kak',AKA:'aka',KKK:'kkk'}[S.rule];if(m)api.done(m);}}
  build();render(false);}},
{name:'Gölgeyle Yükseklik',why:true,note:'Güneş ışınları paralel geldiği için çubuk ile gölgesinin oluşturduğu üçgen, ağaç ile gölgesinin oluşturduğu üçgene benzerdir. Oranlar eşitse ağacın boyu ölçmeden bulunur.',
init(api){
  const S={e:45,H:5},s0=1.5,M=30,gy=380,xs=70,xt=300,moved=new Set();
  api.hint('Güneşin yüksekliğini ve ağacın boyunu değiştir.');
  api.slider({label:'Güneş açısı',min:35,max:75,step:1,value:45,fmt:v=>Math.round(v)+'°',onInput:v=>{S.e=Math.round(v);moved.add(S.e);render(true);}});
  api.slider({label:'Ağacın boyu',min:3,max:6,step:0.5,value:5,fmt:v=>tr(v)+' m',onInput:v=>{S.H=v;render(true);}});
  function render(user){const t=Math.tan(S.e*D2R),g1=s0/t,g2=S.H/t;let g=grid(30);
    g+=L({x:0,y:gy},{x:W,y:gy},'ray thin');
    const sun=polar({x:560,y:gy},700,180-S.e);
    g+=poly([{x:xs,y:gy},{x:xs,y:gy-s0*M},{x:xs+g1*M,y:gy}],'fpoly cA');g+=poly([{x:xt,y:gy},{x:xt,y:gy-S.H*M},{x:xt+g2*M,y:gy}],'fpoly cA soft');
    g+=L({x:xs+g1*M,y:gy},polar({x:xs+g1*M,y:gy},140,180-S.e),'dash')+L({x:xt+g2*M,y:gy},polar({x:xt+g2*M,y:gy},S.H*M/Math.sin(S.e*D2R)+60,180-S.e),'dash');
    g+=`<line x1="${xs}" y1="${gy}" x2="${xs}" y2="${f(gy-s0*M)}" style="stroke:var(--ink);stroke-width:6;stroke-linecap:round"/>`;
    g+=`<line x1="${xt}" y1="${gy}" x2="${xt}" y2="${f(gy-S.H*M)}" style="stroke:#7a5230;stroke-width:9;stroke-linecap:round"/><circle cx="${xt}" cy="${f(gy-S.H*M)}" r="34" class="cC" style="stroke:var(--ink);stroke-width:2"/>`;
    g+=`<line x1="${xs}" y1="${gy+6}" x2="${f(xs+g1*M)}" y2="${gy+6}" style="stroke:var(--pen);stroke-width:5"/><line x1="${xt}" y1="${gy+6}" x2="${f(xt+g2*M)}" y2="${gy+6}" style="stroke:var(--pen);stroke-width:5"/>`;
    g+=T({x:xs+g1*M/2,y:gy+24},tr(g1,2)+' m','sml')+T({x:xt+g2*M/2,y:gy+24},tr(g2,2)+' m','sml')+T({x:xs-10,y:gy-s0*M/2},'1,5 m','sml','end')+T({x:xt-12,y:gy-S.H*M/2},'? m','val','end');
    const sp=polar({x:610,y:gy},Math.min(560,(gy-30)/Math.sin(S.e*D2R)),180-S.e);
    g+=`<circle cx="${f(clamp(sp.x,40,600))}" cy="${f(clamp(sp.y,30,300))}" r="22" style="fill:var(--hl);stroke:var(--ink);stroke-width:2"/>`;
    api.draw(g);
    api.info(head('Ağacın boyu',`${tr(s0,1)} × ${tr(g2,2)} ÷ ${tr(g1,2)} = ${tr(S.H,1)} m`,null,'Çubuk 1,5 m. Gölge uzunluklarını ölçüp orantı kuruyoruz.')+`<p class="eqn">ağaç ÷ çubuk = gölge₂ ÷ gölge₁<small>${tr(S.H/s0,2)} = ${tr(g2/g1,2)}</small></p>`+stats(stat('Çubuk gölgesi',tr(g1,2)+' m'),stat('Ağaç gölgesi',tr(g2,2)+' m')));
    if(user&&moved.size>=2)api.done('golge');}
  render(false);}}
]});

/* ---------- Pisagor ---------- */
function sqOn(P,Q,R){const v=sub(Q,P);let n={x:-v.y,y:v.x};if(dot(n,sub(R,P))>0)n={x:-n.x,y:-n.y};return [P,Q,add(Q,n),add(P,n)];}
function sqGrid(sq,step){const [P,Q,R2,Pn]=sq,l=dist(P,Q),k=Math.floor(l/step-1e-6);let s='';const u=mul(sub(Q,P),1/l),w=mul(sub(Pn,P),1/l);
  for(let i=1;i<=k;i++){const a=add(P,mul(u,i*step)),b=add(Pn,mul(u,i*step)),c=add(P,mul(w,i*step)),d=add(Q,mul(w,i*step));s+=L(a,b,'tick')+L(c,d,'tick');}return s;}
reg({id:'pt8',g:8,sub:'Pisagor Bağıntısı',title:'Karelerin Dansı',
icon:'<rect class="if" x="10" y="50" width="30" height="30" style="fill:var(--hl2)"/><rect class="if" x="40" y="80" width="40" height="38"/><path class="if" d="M40 50L80 80L110 40L70 10Z" style="fill:var(--hl3)"/><path class="is" d="M40 50V80H80Z"/>',
tasks:[{k:'uclu',text:'Kenarları tam sayı olan bir dik üçgen bul',lab:0,hint:'3-4-5'},{k:'genis',text:'Dik açıyı boz: geniş açıda c² ile a² + b²\'yi karşılaştır',lab:0},{k:'kanit',text:'Dört üçgenle kanıtı izle',lab:1},{k:'mesafe',text:'Arası tam 5 br olan, aynı çizgide olmayan iki nokta bul',lab:2}],
labs:[
{name:'Kenarlarda Kareler',note:'Dik üçgende dik kenarlar üzerine kurulan karelerin alanları toplamı, hipotenüs üzerindeki karenin alanına eşittir: a² + b² = c². Açı 90° değilse eşitlik bozulur.',
init(api){
  const Sc=32,C={x:200,y:268},S={a:3,b:4,g:90};
  api.hint('Kırmızı noktalarla dik kenarları ayarla.');
  api.slider({label:'C açısı',min:60,max:120,step:1,value:90,fmt:v=>Math.round(v)+'°',onInput:v=>{S.g=Math.round(v);render(true);}});
  function render(user){const B={x:C.x+S.b*Sc,y:C.y},A=polar(C,S.a*Sc,S.g);const c=dist(A,B)/Sc;
    let g=grid(Sc);const sa=sqOn(C,A,B),sb=sqOn(C,B,A),sc=sqOn(A,B,C);
    g+=poly(sa,'fpoly cB soft')+sqGrid(sa,Sc)+poly(sb,'fpoly cA soft')+sqGrid(sb,Sc)+poly(sc,'fpoly cC soft')+sqGrid(sc,Sc);
    const ctr=q=>({x:(q[0].x+q[2].x)/2,y:(q[0].y+q[2].y)/2});
    g+=T(ctr(sa),`a² = ${S.a*S.a}`,'val')+T(ctr(sb),`b² = ${S.b*S.b}`,'val')+T(ctr(sc),`c² = ${tr(c*c,1)}`,'val');
    g+=poly([A,B,C],'fpoly cP');if(S.g===90)g+=rightMark(C,0,14);
    g+=T({x:C.x-14,y:C.y+16},'C','lbl')+T(polar(A,18,S.g+90),'A','lbl')+T({x:B.x+12,y:B.y+18},'B','lbl');
    g+=hdl('a',A,'a kenarı')+hdl('b',B,'b kenarı');api.draw(g);
    const s2=S.a*S.a+S.b*S.b,c2=c*c,cmp=Math.abs(s2-c2)<0.05?'=':c2>s2?'<':'>';const ci=Math.abs(c-Math.round(c))<1e-6;
    api.info(head(S.g===90?'Dik üçgen':S.g>90?'Geniş açılı':'Dar açılı',`${S.a*S.a} + ${S.b*S.b} ${cmp} ${tr(c2,1)}`,S.g===90&&ci?'Pisagor üçlüsü!':null,S.g===90?`c = √${s2} ≈ ${tr(c,2)} br`:(c2>s2?'C açısı 90°\'den büyük: c² daha büyük.':'C açısı 90°\'den küçük: c² daha küçük.'),S.g===90&&ci?'good':'')+stats(stat('a² + b²',s2),stat('c²',tr(c2,2))));
    if(user){if(S.g===90&&ci)api.done('uclu');if(S.g>90)api.done('genis');}}
  api.drag((id,p)=>{if(id==='a'){const v=clamp(Math.round(dist(C,p)/Sc),1,4);if(v!==S.a){S.a=v;render(true);}}else{const v=clamp(Math.round((p.x-C.x)/Sc),1,4);if(v!==S.b){S.b=v;render(true);}}});
  render(false);}},
{name:'Dört Üçgenle Kanıt',why:true,note:'Aynı büyük karenin içine aynı dört üçgeni iki farklı şekilde yerleştiriyoruz. Boş kalan alan ilkinde c², ikincisinde a² + b². Üçgenler aynı olduğuna göre boşluklar da eşittir.',
init(api){
  const S={a:3,b:5,t:0},Sc=36;
  api.hint('Oynat\'a bas: üçgenler yer değiştiriyor.');
  api.slider({label:'a',min:1,max:5,step:1,value:3,fmt:v=>v,onInput:v=>{S.a=v;render(false);}});
  api.slider({label:'b',min:1,max:5,step:1,value:5,fmt:v=>v,onInput:v=>{S.b=v;render(false);}});
  api.slider({label:'Yer değiştir',min:0,max:1,step:0.001,value:0,play:true,dur:3000,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  function render(user){const a=S.a,b=S.b,s=a+b,k=ease(S.t),o={x:320-s*Sc/2,y:220-s*Sc/2};const P=(x,y)=>({x:o.x+x*Sc,y:o.y+y*Sc});
    const tris=[[[0,0],[a,0],[0,b]],[[a,0],[s,0],[s,a]],[[s,a],[s,s],[b,s]],[[b,s],[0,s],[0,b]]],mv=[[0,a],[0,0],[-b,0],[a,-b]];
    let g=grid(Sc);
    if(k<0.02){g+=poly([P(a,0),P(s,a),P(b,s),P(0,b)],'fpoly cA');g+=T(P(s/2,s/2),'c²','lbl');}
    if(k>0.98){g+=poly([P(0,0),P(a,0),P(a,a),P(0,a)],'fpoly cB')+poly([P(a,a),P(s,a),P(s,s),P(a,s)],'fpoly cD');g+=T(P(a/2,a/2),'a²','lbl')+T(P(a+b/2,a+b/2),'b²','lbl');}
    tris.forEach((tq,i)=>{const d=mv[i];g+=poly(tq.map(([x,y])=>P(x+d[0]*k,y+d[1]*k)),'fpoly cC');});
    g+=`<path class="outl" d="${pd([P(0,0),P(s,0),P(s,s),P(0,s)])}"/>`;
    g+=T({x:o.x+a*Sc/2,y:o.y-14},'a','sml')+T({x:o.x+(a+b/2)*Sc,y:o.y-14},'b','sml');api.draw(g);
    api.info(head('Büyük kare: (a + b)²',k>0.98?`a² + b² = ${a*a} + ${b*b}`:`c² = ${a*a+b*b}`,k>0.98?'Boşluklar: a² ve b²':'Boşluk: c²',`Büyük karenin alanı ${s*s}. Dört üçgenin toplamı 4 × ${a}·${b}/2 = ${2*a*b}. Geriye kalan ${s*s-2*a*b}.`)+`<p class="eqn">c² = a² + b² = ${a*a+b*b}</p>`);
    if(user&&S.t>0.99)api.done('kanit');}
  render(false);}},
{name:'İki Nokta Arası',note:'Koordinat düzleminde iki nokta arasındaki uzaklık, yatay ve dikey farkların dik kenar olduğu bir dik üçgenin hipotenüsüdür: d = √(Δx² + Δy²).',
init(api){
  const S={P:{x:120,y:360},Q:{x:440,y:120}};
  api.hint('İki noktayı sürükle.');
  function render(user){const {P,Q}=S,dx=Math.abs(Q.x-P.x)/U,dy=Math.abs(Q.y-P.y)/U,d=Math.hypot(dx,dy),K={x:Q.x,y:P.y};let g=grid();
    if(dx&&dy){const a1=dirDeg(K,P),b1=dirDeg(K,Q);g+=poly([P,K,Q],'fpoly cA soft')+rightMark(K,Math.round(norm360(b1-a1))===90?a1:b1,12);}
    g+=L(P,Q,'ray pen')+L(P,K,'dash')+L(K,Q,'dash')+T({x:(P.x+K.x)/2,y:P.y+(P.y>Q.y?20:-20)},`Δx = ${dx}`,'sml')+T({x:K.x+(K.x>P.x?30:-30),y:(K.y+Q.y)/2},`Δy = ${dy}`,'sml');
    g+=T(mid(P,Q),`d = ${tr(d,2)}`,'val')+hdl('P',P,'Birinci nokta')+hdl('Q',Q,'İkinci nokta');api.draw(g);
    api.info(head('Uzaklık',`d = √(${dx}² + ${dy}²) = ${Number.isInteger(d)?d:'√'+(dx*dx+dy*dy)+' ≈ '+tr(d,2)}`,Number.isInteger(d)&&dx&&dy?'Tam sayı çıktı!':null,'Yeşil üçgenin dik kenarları, noktalar arasındaki yatay ve dikey uzaklıktır.')+stats(stat('Δx² + Δy²',dx*dx+dy*dy),stat('d',tr(d,2)+' br')));
    if(user&&dx&&dy&&Math.abs(d-5)<1e-9)api.done('mesafe');}
  api.drag((id,p)=>{const x=clamp(snapv(p.x),U,W-U),y=clamp(snapv(p.y),U,HT-U);const o=S[id==='P'?'Q':'P'];if(o.x===x&&o.y===y)return;if(S[id].x===x&&S[id].y===y)return;S[id]={x,y};render(true);});
  render(false);}}
]});

/* ---------- Dönüşüm geometrisi ---------- */
const O8={x:320,y:220},SH=[[0,0],[3,0],[2,2],[0,3]],NM=['A','B','C','D'];
const toS=([x,y])=>({x:O8.x+x*U,y:O8.y-y*U});
function axes(){let s=grid();s+=L({x:0,y:O8.y},{x:W,y:O8.y},'ax')+L({x:O8.x,y:0},{x:O8.x,y:HT},'ax');
  for(let i=-7;i<=7;i++)if(i)s+=T({x:O8.x+i*U,y:O8.y+14},i,'axl');for(let j=-5;j<=5;j++)if(j)s+=T({x:O8.x-12,y:O8.y-j*U},j,'axl','end');
  s+=T({x:W-12,y:O8.y-14},'x','ttl')+T({x:O8.x+14,y:14},'y','ttl');return s;}
function shapeAt(ax,ay){return SH.map(([x,y])=>[x+ax,y+ay]);}
function shapeSvg(pts,cls,names,ghost){const sp=pts.map(toS);let s=ghost?`<path class="ghost" d="${pd(sp)}"/>`:poly(sp,'fpoly '+cls);if(names)sp.forEach((p,i)=>{s+=`<circle class="vtx" cx="${p.x}" cy="${p.y}" r="4"/>`+T({x:p.x-12,y:p.y-14},names[i],'sml');});return s;}
const ptTxt=([x,y])=>`(${x}, ${y})`;
reg({id:'d8',g:8,sub:'Dönüşüm Geometrisi',title:'Ayna ve Kaydırak',
icon:'<path class="is" d="M60 8V112" style="stroke-dasharray:6 6"/><path class="if" d="M50 30H20V90H30V40H50Z"/><path class="if" d="M70 30H100V90H90V40H70Z" style="fill:var(--hl2)"/>',
tasks:[{k:'hedef',text:'Şekli kesikli hedefin üstüne ötele',lab:0},{k:'yatay',text:'Şekli yalnızca yatay olarak ötele',lab:0},{k:'x',text:'x eksenine göre yansıt',lab:1},{k:'y',text:'y eksenine göre yansıt',lab:1},{k:'eksen',text:'Bir köşeyi aynanın üstüne koy: görüntüsü nerede?',lab:1}],
labs:[
{name:'Öteleme',note:'Ötelemede şeklin her noktası aynı yöne, aynı miktarda kayar. Şekil dönmez, büyümez, ters yüz olmaz: (x, y) → (x + a, y + b).',
init(api){
  const S={ax:-6,ay:-3,dx:4,dy:2},TG=[2,1];
  api.hint('Pembe şeklin A\' köşesini sürükle ya da kaydırıcıları kullan.');
  const sx=api.slider({label:'Sağa / sola (a)',min:-10,max:10,step:1,value:4,fmt:v=>(v>0?'+':'')+v,onInput:v=>{S.dx=v;render(true);}});
  const sy=api.slider({label:'Yukarı / aşağı (b)',min:-6,max:6,step:1,value:2,fmt:v=>(v>0?'+':'')+v,onInput:v=>{S.dy=v;render(true);}});
  function render(user){const P=shapeAt(S.ax,S.ay),I=P.map(([x,y])=>[x+S.dx,y+S.dy]);let g=axes();
    g+=shapeSvg(shapeAt(TG[0],TG[1]),'',null,true)+T(toS([TG[0]+1.5,TG[1]-0.5]),'hedef','sml');
    g+=shapeSvg(P,'cA',NM)+shapeSvg(I,'cB',NM.map(n=>n+"'"));
    P.forEach((p,i)=>{const a=toS(p),b=toS(I[i]);if(dist(a,b)>4){g+=L(a,b,'dash');g+=arrowHead(b,dirDeg(a,b),11);}});
    g+=hdl('o',toS(P[0]),'Şekli taşı')+hdl('i',toS(I[0]),'Görüntüyü taşı');api.draw(g);sx.set(S.dx);sy.set(S.dy);
    api.info(head('Öteleme',`(x, y) → (x ${S.dx<0?'−':'+'} ${Math.abs(S.dx)}, y ${S.dy<0?'−':'+'} ${Math.abs(S.dy)})`,null,'Bütün oklar aynı uzunlukta ve aynı yönde.')+
      `<table class="tb"><tr><th>Nokta</th><th>Önce</th><th>Sonra</th></tr>${P.map((p,i)=>`<tr><td>${NM[i]}</td><td>${ptTxt(p)}</td><td>${ptTxt(I[i])}</td></tr>`).join('')}</table>`);
    if(user){if(S.ax+S.dx===TG[0]&&S.ay+S.dy===TG[1])api.done('hedef');if(S.dy===0&&S.dx!==0)api.done('yatay');}}
  api.drag((id,p)=>{const x=Math.round((p.x-O8.x)/U),y=Math.round((O8.y-p.y)/U);
    if(id==='o'){const ax=clamp(x,-7,4),ay=clamp(y,-5,2);if(ax===S.ax&&ay===S.ay)return;S.ax=ax;S.ay=ay;}
    else{const dx=clamp(x-S.ax,-10,10),dy=clamp(y-S.ay,-6,6);if(S.ax+dx>4||S.ax+dx<-7||S.ay+dy>2||S.ay+dy<-5)return;if(dx===S.dx&&dy===S.dy)return;S.dx=dx;S.dy=dy;}render(true);});
  render(false);}},
{name:'Yansıma',why:true,note:'Yansımada her nokta ile görüntüsü aynaya eşit uzaklıktadır ve onları birleştiren doğru aynaya diktir. Şekil ters yüz olur: köşelerin dönüş yönü değişir. Aynanın üstündeki nokta yerinde kalır.',
init(api){
  const S={ax:1,ay:1,m:'y'};
  api.hint('Şekli A köşesinden sürükle, aynayı seç.');
  api.seg([['y','y eksenine göre'],['x','x eksenine göre']],'y',v=>{S.m=v;render(true);},{label:'Ayna'});
  function render(user){const P=shapeAt(S.ax,S.ay),I=P.map(([x,y])=>S.m==='x'?[x,-y]:[-x,y]);let g=axes();
    g+=S.m==='x'?`<line x1="0" y1="${O8.y}" x2="${W}" y2="${O8.y}" style="stroke:var(--pen);stroke-width:5;opacity:.6"/>`:`<line x1="${O8.x}" y1="0" x2="${O8.x}" y2="${HT}" style="stroke:var(--pen);stroke-width:5;opacity:.6"/>`;
    P.forEach((p,i)=>{const a=toS(p),b=toS(I[i]),m=mid(a,b);if(dist(a,b)>2){g+=L(a,b,'dash')+eqTicks(a,m)+eqTicks(m,b);}});
    g+=shapeSvg(P,'cA',NM)+shapeSvg(I,'cB',NM.map(n=>n+"'"));
    g+=hdl('o',toS(P[0]),'Şekli taşı');api.draw(g);
    const on=P.some(([x,y])=>S.m==='x'?y===0:x===0);
    api.info(head(S.m==='x'?'x eksenine göre yansıma':'y eksenine göre yansıma',S.m==='x'?'(x, y) → (x, −y)':'(x, y) → (−x, y)',on?'Aynadaki nokta yerinde kaldı':null,S.m==='x'?'x aynı kalır, y\'nin işareti değişir.':'y aynı kalır, x\'in işareti değişir.',on?'good':'')+
      `<table class="tb"><tr><th>Nokta</th><th>Önce</th><th>Sonra</th></tr>${P.map((p,i)=>`<tr><td>${NM[i]}</td><td>${ptTxt(p)}</td><td>${ptTxt(I[i])}</td></tr>`).join('')}</table><p class="desc">A → B → C → D dönüş yönü görüntüde tersine döner.</p>`);
    if(user){api.done(S.m);if(on)api.done('eksen');}}
  api.drag((id,p)=>{const ax=clamp(Math.round((p.x-O8.x)/U),-7,4),ay=clamp(Math.round((O8.y-p.y)/U),-5,2);if(ax===S.ax&&ay===S.ay)return;S.ax=ax;S.ay=ay;render(true);});
  render(false);}}
]});

/* ---------- Geometrik cisimler 8 ---------- */
reg({id:'c8',g:8,sub:'Geometrik Cisimler',title:'Cisimler Galerisi',
icon:'<path class="if" d="M8 100L34 30L60 100Z"/><ellipse class="if" cx="34" cy="100" rx="26" ry="8" style="fill:var(--hl2)"/><path class="if" d="M66 34V96A22 8 0 0 0 110 96V34Z" style="fill:var(--hl3)"/><ellipse class="if" cx="88" cy="34" rx="22" ry="8"/>',
tasks:[{k:'dort',text:'Dört cismin hepsini incele',lab:0},{k:'ac',text:'Silindirin yan yüzünü aç',lab:1},{k:'uc',text:'Koniyle silindiri doldur',lab:2}],
labs:[
{name:'Cisim Seç',note:'Silindir ve prizmada hacim = taban alanı × yükseklik. Koni ve piramitte aynı tabana ve yüksekliğe sahip olan prizmanın üçte biri: hacim = taban alanı × yükseklik ÷ 3.',
init(api){
  const S={k:'pr',r:1.5,h:3},seen=new Set(),cam=cam3({s:62,cy:225,pitch:0.38});
  api.hint('Cismi seç, boyutlarını değiştir, sürükleyerek döndür.');
  api.seg([['pr','Kare prizma'],['py','Kare piramit'],['cy','Silindir'],['co','Koni']],'pr',v=>{S.k=v;render(true);},{label:'Cisim'});
  api.slider({label:'Taban (a ya da r)',min:1,max:3,step:0.5,value:1.5,fmt:v=>tr(v)+' br',onInput:v=>{S.r=v;render(true);}});
  api.slider({label:'Yükseklik (h)',min:1,max:5,step:0.5,value:3,fmt:v=>tr(v)+' br',onInput:v=>{S.h=v;render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const {r,h}=S;const ps=3.14;let F,nm,V,SA,vf,sf,ex='';
    if(S.k==='pr'){F=prismFaces(4,r*1.2,h,'cA','cB');const a=r*1.2;nm='Kare prizma';V=a*a*h;SA=2*a*a+4*a*h;vf=`a² · h = ${tr(a,1)}² · ${tr(h)}`;sf=`2a² + 4a·h`;}
    else if(S.k==='py'){const a=r*1.4;F=pyrFaces(a,h);const l=Math.hypot(h,a/2);nm='Kare piramit';V=a*a*h/3;SA=a*a+2*a*l;vf=`a² · h ÷ 3 = ${tr(a,1)}² · ${tr(h)} ÷ 3`;sf=`a² + 4 · (a · ℓ ÷ 2)`;ex=`Yan yüz yüksekliği ℓ = ${tr(l,2)} br`;}
    else if(S.k==='cy'){F=cylFaces(r,h);nm='Silindir';V=ps*r*r*h;SA=2*ps*r*r+2*ps*r*h;vf=`π · r² · h ≈ 3,14 · ${tr(r)}² · ${tr(h)}`;sf=`2πr² + 2πr·h`;}
    else{F=coneFaces(r,h);const l=Math.hypot(h,r);nm='Koni';V=ps*r*r*h/3;SA=ps*r*r+ps*r*l;vf=`π · r² · h ÷ 3`;sf=`πr² + πr·ℓ`;ex=`Ana doğru ℓ = ${tr(l,2)} br`;}
    api.draw(plain()+convex3(F,cam));seen.add(S.k);
    api.info(head('Cisim',nm,null,ex||null)+stats(stat('Hacim',tr(V,2)+' br³',vf),stat('Yüzey alanı',tr(SA,2)+' br²',sf)));
    if(user&&seen.size>=4)api.done('dort');}
  render(false);}},
{name:'Silindirin Açınımı',why:true,note:'Silindirin yan yüzü açılınca bir dikdörtgen olur. Bu dikdörtgenin bir kenarı yükseklik (h), öbür kenarı taban çemberinin uzunluğu (2πr). Yan alan = 2πr · h.',
init(api){
  const S={r:1,h:2.5,t:0},cam=cam3({s:34,cy:230,pitch:0.35,yaw:-0.45});
  api.hint('Oynat\'a bas. Döndürmek için sürükle.');
  api.slider({label:'Yarıçap',min:0.5,max:1.5,step:0.25,value:1,fmt:v=>tr(v,2)+' br',onInput:v=>{S.r=v;render(true);}});
  api.slider({label:'Yükseklik',min:1,max:4,step:0.5,value:2.5,fmt:v=>tr(v)+' br',onInput:v=>{S.h=v;render(true);}});
  api.slider({label:'Aç',min:0,max:1,step:0.001,value:0,play:true,dur:3500,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const {r,h}=S,k=ease(S.t),k1=Math.min(1,k/0.75),k2=clamp((k-0.7)/0.3,0,1),n=48;const F=[];
    const R=k1>0.999?1e9:r/(1-k1);const pt=(u,y)=>{const ph=u/R;return v3(R*Math.sin(ph),y,(r-R)+R*Math.cos(ph));};
    for(let i=0;i<n;i++){const u0=2*PI*r*i/n,u1=2*PI*r*(i+1)/n;F.push({p:[pt(u0,-h/2),pt(u1,-h/2),pt(u1,h/2),pt(u0,h/2)],k:'cA sm'});}
    const ps=-k2*PI/2;[[h/2,1],[-h/2,-1]].forEach(([y0,sg])=>{const pts=[];for(let i=0;i<n;i++){const th=2*PI*i/n,dz=r*Math.sin(th)-r,dx=r*Math.cos(th);const ang=sg*ps;pts.push(v3(dx,y0-dz*Math.sin(-ang)*1,r+dz*Math.cos(ang)));}F.push({p:pts,k:'cB'});});
    const c2=Object.assign({},cam,{yaw:lerp(cam.yaw,0,k*k),pitch:lerp(cam.pitch,0.05,k*k),cx:320-PI*r*k*cam.s});
    let g=plain()+painter3(F,c2);
    if(k>0.98){const a=P3(v3(0,-h/2,r),c2),b=P3(v3(2*PI*r,-h/2,r),c2);g+=L({x:a.x,y:a.y+18},{x:b.x,y:b.y+18},'dim')+T({x:(a.x+b.x)/2,y:a.y+34},'2πr ≈ '+tr(2*PI*r,2)+' br','dimt');}
    api.draw(g);
    api.info(head('Yan yüz',k>0.98?'Bir dikdörtgen!':'Açılıyor…',null,'Yan yüzü bir kâğıt gibi kesip düzleştiriyoruz.')+stats(stat('Genişlik',tr(2*PI*r,2)+' br','2πr'),stat('Yükseklik',tr(h)+' br','h'))+`<p class="eqn">Yan alan = 2πr · h ≈ ${tr(2*3.14*r*h,2)} br²<small>Tüm yüzey = 2πr² + 2πr·h ≈ ${tr(2*3.14*r*r+2*3.14*r*h,2)} br²</small></p>`);
    if(user&&S.t>0.99)api.done('ac');}
  render(false);}},
{name:'Koni ile Silindiri Doldur',why:true,note:'Aynı taban ve yükseklikteki koninin hacmi, silindirin tam üçte biridir. Koniyi üç kez doldurup boşaltınca silindir dolar. Piramit ile prizma arasında da aynı ilişki vardır.',
init(api){
  const S={p:0},r=70,h=210,yb=390,cx=150,sx=440;
  api.hint('Oynat\'a bas: koni dolup silindire boşaltılıyor.');
  api.slider({label:'Dökülen koni',min:0,max:3,step:0.001,value:0,play:true,dur:7000,fmt:v=>tr(Math.min(3,Math.floor(v+1e-9)),0)+' koni',onInput:v=>{S.p=v;render(true);}});
  function render(user){const p=S.p,kk=Math.min(2,Math.floor(p)),fr=p>=3?1:p-kk;const fill=fr<0.4?fr/0.4:1-(fr-0.4)/0.6,pour=clamp((fr-0.4)/0.6,0,1);
    const vc=p>=3?0:fill,lvl=p>=3?h:(kk+pour)/3*h;let g=grid();
    const top=yb-h;g+=`<path class="outl" d="M${cx-r} ${top}L${cx} ${yb}L${cx+r} ${top}"/><ellipse cx="${cx}" cy="${top}" rx="${r}" ry="12" style="fill:none;stroke:var(--ink);stroke-width:3"/>`;
    if(vc>0.001){const hw=h*Math.cbrt(vc),rw=r*Math.cbrt(vc);g+=`<path class="water" d="M${f(cx-rw)} ${f(yb-hw)}L${cx} ${yb}L${f(cx+rw)} ${f(yb-hw)}Z"/><ellipse class="water" cx="${cx}" cy="${f(yb-hw)}" rx="${f(rw)}" ry="${f(12*rw/r)}"/>`;}
    if(lvl>0.5)g+=`<rect class="water" x="${sx-r}" y="${f(yb-lvl)}" width="${2*r}" height="${f(lvl)}"/><ellipse class="water" cx="${sx}" cy="${f(yb-lvl)}" rx="${r}" ry="12"/><ellipse class="water" cx="${sx}" cy="${yb}" rx="${r}" ry="12"/>`;
    g+=`<path class="outl" d="M${sx-r} ${top}V${yb}M${sx+r} ${top}V${yb}"/><ellipse cx="${sx}" cy="${top}" rx="${r}" ry="12" style="fill:none;stroke:var(--ink);stroke-width:3"/><path d="M${sx-r} ${yb}A${r} 12 0 0 0 ${sx+r} ${yb}" style="fill:none;stroke:var(--ink);stroke-width:3"/>`;
    for(let j=1;j<=3;j++){const y=yb-h*j/3;g+=L({x:sx+r,y},{x:sx+r+14,y},'ray thin')+T({x:sx+r+22,y},j+'/3','sml','start');}
    if(fr>0.4&&fr<1&&p<3)g+=`<path class="dash" d="M${cx+r-10} ${top-10}Q${(cx+sx)/2} ${top-110} ${sx-20} ${top-6}"/>`+arrowHead({x:sx-20,y:top-6},-40,12);
    g+=T({x:cx,y:yb+30},'Koni','ttl')+T({x:sx,y:yb+30},'Silindir','ttl');api.draw(g);
    const n=p>=3?3:kk+(pour>0.999?1:0);
    api.info(head('Aynı taban, aynı yükseklik',p>=3?'3 koni = 1 silindir':`${n} koni döküldü`,p>=3?'Silindir doldu':null,'Silindirin dolu kısmını sağdaki çizgilerle karşılaştır.',p>=3?'good':'')+`<p class="eqn">V koni = π·r²·h ÷ 3<small>V silindir = π·r²·h</small></p>`);
    if(user&&p>=2.999)api.done('uc');}
  render(false);}}
]});
