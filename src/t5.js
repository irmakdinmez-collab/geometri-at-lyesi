/* ======================= 5. SINIF ======================= */

/* ---------- Temel kavramlar ---------- */
reg({id:'k5',g:5,sub:'Temel Geometrik Kavramlar',title:'Noktadan Sonsuza',
icon:'<path class="is" d="M14 88L106 32"/><path class="is" d="M95 30L106 32L101 43"/><path class="is" d="M25 90L14 88L19 77"/><circle class="if" cx="44" cy="70" r="9"/><circle class="if" cx="78" cy="49" r="9"/>',
tasks:[
 {k:'p5',text:'5 br uzunluğunda bir doğru parçası çiz',lab:0,hint:'Köşegen de olabilir!'},
 {k:'isin',text:'Bir ışın oluştur, uç noktalarını say',lab:0},
 {k:'dogru',text:'Doğru görünümüne geç',lab:0},
 {k:'fan',text:'A noktasından geçen birçok doğruyu göster',lab:1},
 {k:'tek',text:'A\'dan geçen doğruyu B\'den de geçir',lab:1}],
labs:[
{name:'Çizgi Çeşitleri',note:'Doğru parçasının iki ucu vardır, ölçülebilir. Işının tek ucu vardır, öbür yanı sonsuza gider. Doğrunun hiç ucu yoktur, iki yönde de sonsuza uzanır.',
init(api){
  const S={A:{x:200,y:280},B:{x:400,y:160},m:'seg'};
  api.hint('A ve B noktalarını sürükle.');
  api.seg([['seg','Doğru parçası'],['ray','Işın'],['line','Doğru']],S.m,v=>{S.m=v;render(true);},{label:'Çizgi türü'});
  function render(user){
    const {A,B}=S,v=sub(B,A),l=len(v),u={x:v.x/l,y:v.y/l},n={x:-u.y,y:u.x};let s=grid();
    if(S.m==='seg')s+=L(A,B);
    else if(S.m==='ray'){const E={x:B.x+u.x*90,y:B.y+u.y*90};s+=L(A,E)+arrowHead(E,dirDeg(A,E),16);}
    else{const E1={x:A.x-u.x*90,y:A.y-u.y*90},E2={x:B.x+u.x*90,y:B.y+u.y*90};s+=L(E1,E2)+arrowHead(E2,dirDeg(A,B),16)+arrowHead(E1,dirDeg(B,A),16);}
    s+=T({x:A.x+n.x*24,y:A.y+n.y*24},'A','lbl')+T({x:B.x+n.x*24,y:B.y+n.y*24},'B','lbl');
    if(S.m==='seg')s+=T({x:(A.x+B.x)/2-n.x*20,y:(A.y+B.y)/2-n.y*20},tr(l/U)+' br','sml');
    s+=hdl('A',A,'A noktası')+hdl('B',B,'B noktası');api.draw(s);
    const ov=`<span style="display:inline-block;position:relative;padding-top:.32em">AB<span style="position:absolute;left:0;right:0;top:-.2em;text-align:center;font-size:.62em">⟷</span></span>`;
    const I={seg:['[AB]','Doğru parçası','İki ucu var: A ve B. Uzunluğu ölçülebilir.','2',tr(l/U)+' br'],
      ray:['[AB','Işın','Başlangıç noktası A. B yönünde sonsuza gider.','1','Ölçülemez'],
      line:[ov,'Doğru','Hiç ucu yok. İki yönde de sonsuza uzanır.','0','Ölçülemez']}[S.m];
    api.info(head('Gösterim',I[0],I[1],I[2])+stats(stat('Uç nokta',I[3]),stat('Uzunluk',I[4]))+`<p class="desc">Nokta bir yer belirtir; eni, boyu, kalınlığı yoktur. Büyük harfle adlandırılır: A, B…</p>`);
    if(user){if(S.m==='seg'&&Math.abs(l-5*U)<0.5)api.done('p5');if(S.m==='ray')api.done('isin');if(S.m==='line')api.done('dogru');}
  }
  api.drag((id,p)=>{const x=clamp(snapv(p.x),U,W-U),y=clamp(snapv(p.y),U,HT-U);const o=S[id==='A'?'B':'A'];if(o.x===x&&o.y===y)return;if(S[id].x===x&&S[id].y===y)return;S[id]={x,y};render(true);});
  render(false);}},
{name:'İki Noktadan Kaç Doğru?',why:true,note:'Bir noktadan sonsuz sayıda doğru geçer. Ama iki farklı noktadan yalnızca bir doğru geçer. Bu yüzden iki nokta bir doğruyu tek başına belirler.',
init(api){
  const A={x:220,y:270},B={x:460,y:150},S={th:150,fan:false};
  api.hint('Kırmızı noktayı sürükleyerek doğruyu A etrafında döndür.');
  const fb=api.button('Birçok doğru çiz',b=>{S.fan=!S.fan;b.setAttribute('aria-pressed',S.fan);render(true,'fan');},{pressed:false});
  const tgt=dirDeg(A,B)%180;
  function render(user,what){let s=grid();
    if(S.fan)for(let k=0;k<180;k+=12)s+=lineFull(A,polar(A,10,k),'dash');
    const on=Math.abs((S.th%180)-tgt)<0.01;
    s+=lineFull(A,polar(A,10,S.th),on?'ray pen':'ray');
    s+=`<circle class="vtx" cx="${A.x}" cy="${A.y}" r="6"/>`+T({x:A.x-18,y:A.y+22},'A','lbl');
    s+=`<circle cx="${B.x}" cy="${B.y}" r="${on?10:7}" style="fill:${on?'var(--ok)':'var(--ink)'}"/>`+T({x:B.x+18,y:B.y-20},'B','lbl');
    s+=hdl('h',polar(A,160,S.th),'Doğruyu döndür');api.draw(s);
    api.info(head('A\'dan geçen doğru',on?'B\'den de geçiyor!':'B\'den geçmiyor',on?'Tek bir doğru':'Döndürmeye devam',on?'A ve B\'den geçen yalnızca bu doğru var. Biraz döndürünce B\'yi kaçırırsın.':'Doğru A etrafında dönerken B\'den yalnızca tek bir konumda geçer.',on?'good':'')+
      stats(stat('A\'dan geçen doğru','Sonsuz'),stat('A ve B\'den geçen','1 tane')));
    if(user){if(on)api.done('tek');if(what==='fan'&&S.fan)api.done('fan');}}
  api.drag((id,p)=>{const a=dirDeg(A,p);const t=a%180;const base=a>=180?180:0;S.th=Math.abs(t-tgt)<2.5?base+tgt:Math.round(a);render(true);});
  render(false);}}
]});

/* ---------- Açılar 5 ---------- */
function protractorLab(keys){return function(api){
  const O={x:320,y:230},R=180,S={th:50};
  api.hint('B noktasını açıölçerin etrafında döndür.');
  [45,90,135,180].forEach(v=>api.button(v+'°',()=>{S.th=v;render(true);}));
  const sl=api.slider({label:'Açı ölçüsü',min:0,max:360,step:1,value:S.th,fmt:v=>Math.round(v)+'°',onInput:v=>{S.th=Math.round(v);render(true);}});
  function type(t){if(t===0)return ['Sıfır açı','İki kol üst üste.'];if(t<90)return ['Dar açı','Ölçüsü 0° ile 90° arasında.'];if(t===90)return ['Dik açı','Tam 90°. Köşesine küçük bir kare çizilir.'];if(t<180)return ['Geniş açı','Ölçüsü 90° ile 180° arasında.'];if(t===180)return ['Doğru açı','Kollar zıt yönde, bir doğru oluşturur.'];if(t<360)return ['180°\'den büyük açı','Doğru açıdan büyük, tam açıdan küçük.'];return ['Tam açı','Bir tam tur: 360°.'];}
  function render(user){const th=S.th;let s=grid();s+=`<circle class="ring" cx="${O.x}" cy="${O.y}" r="${R}"/>`;
    for(let d=0;d<360;d+=5){const big=d%30===0,md=d%10===0,p1=polar(O,R-(big?14:md?9:5),d),p2=polar(O,R,d);s+=`<line class="tick${big?' big':''}" x1="${f(p1.x)}" y1="${f(p1.y)}" x2="${f(p2.x)}" y2="${f(p2.y)}"/>`;if(big)s+=T(polar(O,R+17,d),d,'tickl');}
    if(th===90)s+=`<path class="sec" style="stroke:none" d="${sector(O,30,0,90)}"/>`+rightMark(O,0,30);else if(th>0)s+=`<path class="sec" d="${sector(O,th>180?52:62,0,th)}"/>`;
    const Ap=polar(O,R,0),Bp=polar(O,R,th);s+=L(O,Ap)+L(O,Bp);
    s+=`<circle class="vtx" cx="${O.x}" cy="${O.y}" r="5"/>`+T({x:O.x-16,y:O.y+20},'O','lbl')+T({x:Ap.x-14,y:Ap.y+22},'A','lbl')+T(polar(polar(O,R-30,th),18,th+90),'B','lbl');
    if(th>0&&th<360)s+=T(polar(O,th<25?118:96,th/2),th+'°','val');
    s+=hdl('b',Bp,'B noktasını sürükle');api.draw(s);sl.set(th);
    const [nm,ds]=type(th);
    api.info(head('Ölçüm',`m(∠AOB) = ${th}°`,nm,ds)+stats(stat('Tümleri',th>0&&th<90?(90-th)+'°':'—',th>0&&th<90?`${th}° + ${90-th}° = 90°`:'Yalnız dar açıların tümleri olur.'),stat('Bütünleri',th>0&&th<180?(180-th)+'°':'—',th>0&&th<180?`${th}° + ${180-th}° = 180°`:'180°\'den küçük açılar için.')));
    if(user&&keys){if(th>0&&th<90)api.done(keys.dar);if(th===90)api.done(keys.dik);if(th>90&&th<180)api.done(keys.genis);if(th===180)api.done(keys.dogru);}}
  api.drag((id,p)=>{let t=Math.round(dirDeg(O,p));if(t===360&&S.th<180)t=0;if(t===0&&S.th>300)t=360;S.th=t;render(true);});
  render(false);};}

reg({id:'a5',g:5,sub:'Açılar',title:'Açı Avcıları',
icon:'<path class="if" d="M18 96L64 96A46 46 0 0 0 50.5 63.5Z"/><path class="is" d="M18 96H108M18 96L84 30"/><circle class="idot" cx="18" cy="96" r="5"/>',
tasks:[{k:'dar',text:'Bir dar açı oluştur',lab:0},{k:'dik',text:'Tam 90° dik açı oluştur',lab:0},{k:'genis',text:'Bir geniş açı oluştur',lab:0},{k:'dogru',text:'Doğru açı oluştur',lab:0},
 {k:'tum45',text:'Dik açıyı iki eş tümler açıya böl',lab:1,hint:'İkisi de 45° olmalı.'},{k:'but120',text:'Bütünler açılardan biri 120° olsun',lab:1}],
labs:[
{name:'Açıölçer',note:'Açıyı kolların uzunluğu değil, aralarındaki açıklık belirler. Kolları ne kadar uzatsan da ölçü değişmez.',init:protractorLab({dar:'dar',dik:'dik',genis:'genis',dogru:'dogru'})},
{name:'Tümler ve Bütünler',why:true,note:'Tümler açılar bir dik açıyı, bütünler açılar bir doğru açıyı paylaşır. Bir parça büyüdükçe öbürü aynı miktarda küçülür.',
init(api){
  const S={tot:90,x:35};
  api.hint('Aradaki kırmızı noktayı sürükle.');
  api.seg([['90','Dik açıyı böl (90°)'],['180','Doğru açıyı böl (180°)']],'90',v=>{S.tot=+v;S.x=Math.min(S.x,S.tot-1);sl.input.max=S.tot-1;render(true);});
  const sl=api.slider({label:'Birinci açı',min:1,max:89,step:1,value:S.x,fmt:v=>Math.round(v)+'°',onInput:v=>{S.x=Math.round(v);render(true);}});
  function render(user){const tot=S.tot,x=S.x,y=tot-x;const O=tot===90?{x:200,y:380}:{x:320,y:350};const R=tot===90?300:250,r=tot===90?110:100;
    let s=grid();s+=`<path class="fsec cA" d="${sector(O,r,0,x)}"/><path class="fsec cB" d="${sector(O,r,x,tot)}"/>`;
    s+=L(O,polar(O,R,0))+L(O,polar(O,R,tot))+L(O,polar(O,R*0.9,x),'ray pen');
    if(tot===180)s+=L(O,polar(O,R,180));
    s+=T(polar(O,r+(x<20?52:30),x/2),x+'°','val')+T(polar(O,r+(y<20?52:30),x+y/2),y+'°','val');
    s+=`<circle class="vtx" cx="${O.x}" cy="${O.y}" r="5"/>`+hdl('m',polar(O,R*0.9,x),'Ortadaki kolu sürükle');api.draw(s);sl.set(x);
    api.info(head(tot===90?'Tümler açılar':'Bütünler açılar',`${x}° + ${y}° = ${tot}°`,tot===90?'Toplamları 90°':'Toplamları 180°',`${x}° açısının ${tot===90?'tümleri':'bütünleri'} ${y}°. Kol hareket edince toplam hiç değişmiyor.`)+stats(stat('Sarı açı',x+'°'),stat('Pembe açı',y+'°')));
    if(user){if(tot===90&&x===45)api.done('tum45');if(tot===180&&(x===120||y===120))api.done('but120');}}
  api.drag((id,p)=>{const O=S.tot===90?{x:200,y:380}:{x:320,y:350};let a=dirDeg(O,p);if(a>270)a=0;S.x=clamp(Math.round(a),1,S.tot-1);render(true);});
  render(false);}}
]});

/* ---------- Çokgenler 5 ---------- */
const QUIZ5=[
 {n:'Kare',ok:true,why:'Dört doğru parçasından oluşan kapalı bir şekil.',d:'M210 110H430V330H210Z'},
 {n:'Daire',ok:false,why:'Kenarları doğru parçası değil, eğri bir çizgi.',d:'M320 100A120 120 0 1 1 319.9 100Z'},
 {n:'Açık çizgi',ok:false,why:'Kapalı değil: başladığı yere dönmüyor.',d:'M170 320L260 140L360 300L470 120',open:true},
 {n:'Yıldız',ok:true,why:'10 kenarlı içbükey bir çokgen. İçe dönük köşeleri olabilir.',d:pd([0,1,2,3,4,5,6,7,8,9].map(i=>polar({x:320,y:230},i%2?55:130,90+36*i)))},
 {n:'Kelebek',ok:false,why:'Kenarlar birbirini kesiyor; çokgende kenarlar kesişmez.',d:'M190 120L450 320L450 120L190 320Z'},
 {n:'Üçgen',ok:true,why:'Üç doğru parçasıyla kapanan en az kenarlı çokgen.',d:'M180 330L460 330L300 110Z'},
 {n:'Yarım daire',ok:false,why:'Bir kenarı eğri; çokgenin tüm kenarları doğru parçasıdır.',d:'M190 290A130 130 0 0 1 450 290Z'},
 {n:'L şekli',ok:true,why:'6 kenarlı bir çokgen (altıgen), içbükey.',d:'M220 100H300V260H440V340H220Z'}];
reg({id:'c5',g:5,sub:'Çokgenler',title:'Kenar Köşe Kulübü',
icon:'<path class="if" d="M60 14L106 47L88 102H32L14 47Z"/><circle class="idot" cx="60" cy="14" r="6"/><circle class="idot" cx="106" cy="47" r="6"/><circle class="idot" cx="88" cy="102" r="6"/><circle class="idot" cx="32" cy="102" r="6"/><circle class="idot" cx="14" cy="47" r="6"/>',
tasks:[{k:'altigen',text:'Bir altıgen oluştur',lab:0},{k:'icbukey',text:'Bir köşeyi içeri iterek içbükey çokgen yap',lab:0},{k:'quiz',text:'"Çokgen mi?" testinde en az 7 doğru yap',lab:1}],
labs:[
{name:'Çokgen Yap',note:'Çokgende kenar sayısı = köşe sayısı = iç açı sayısı. Adını da kenar sayısından alır: 5 kenar → beşgen.',
init(api){
  const S={n:5,P:[]};const C={x:320,y:225};
  function regular(){S.P=[];for(let i=0;i<S.n;i++)S.P.push(polar(C,155,90+360*i/S.n));S.P=S.P.map(p=>({x:Math.round(p.x),y:Math.round(p.y)}));}
  api.hint('Kenar sayısını seç, köşeleri sürükle.');
  api.slider({label:'Kenar sayısı',min:3,max:10,step:1,value:S.n,fmt:v=>Math.round(v),onInput:v=>{S.n=Math.round(v);regular();render(true);}});
  api.button('Düzgün yap',()=>{regular();render(false);});
  function render(user){const P=S.P,n=P.length,bad=selfX(P);const ang=bad?[]:polyAngles(P);const conc=!bad&&ang.some(a=>a>180.5);
    let s=grid()+`<path class="fpoly ${bad?'cB':'cD'} soft" d="${pd(P)}"/>`;
    P.forEach((p,i)=>{const q=P[(i+1)%n],m=mid(p,q);s+=`<circle cx="${f(m.x)}" cy="${f(m.y)}" r="12" class="cP" style="stroke:var(--ink-soft);stroke-width:1.5"/>`+T(m,i+1,'sml');});
    P.forEach((p,i)=>{const d=sub(p,C),dl=len(d)||1;s+=T({x:p.x+d.x/dl*26,y:p.y+d.y/dl*26},String.fromCharCode(65+i),'lbl');});
    s+=P.map((p,i)=>hdl('v'+i,p,String.fromCharCode(65+i)+' köşesi')).join('');api.draw(s);
    if(bad)api.info(head('Durum','Çokgen değil!','Kenarlar kesişiyor','Bir çokgenin kenarları birbirini kesmez. Bir köşeyi geri çek.','warn'));
    else api.info(head('Bu şeklin adı',PL[n][0].toUpperCase()+PL[n].slice(1),conc?'İçbükey çokgen':'Dışbükey çokgen',conc?'En az bir köşesi içeri dönük.':'Tüm köşeleri dışarı bakıyor.')+stats(stat('Kenar',n),stat('Köşe',n),stat('İç açı',n))+`<p class="desc">Kenarları numaralı: 1'den ${n}'e kadar say. Köşeler A'dan ${String.fromCharCode(64+n)}'ye.</p>`);
    if(user&&!bad){if(n===6)api.done('altigen');if(conc)api.done('icbukey');}}
  api.drag((id,p)=>{const i=+id.slice(1);S.P[i]={x:clamp(Math.round(p.x),20,W-20),y:clamp(Math.round(p.y),20,HT-20)};render(true);});
  regular();render(false);}},
{name:'Çokgen mi, Değil mi?',note:'Çokgen: yalnızca doğru parçalarından oluşan, kapalı ve kenarları birbirini kesmeyen şekildir.',
init(api){
  const S={i:0,score:0,ans:null};
  api.hint('Şekle bak, kararını ver.');
  const by=api.button('Çokgen',()=>answer(true)),bn=api.button('Çokgen değil',()=>answer(false)),nx=api.button('Sıradaki →',()=>next(),{primary:true});
  function next(){if(S.ans===null)return;S.i++;S.ans=null;if(S.i>=QUIZ5.length){end();return;}render();}
  function answer(v){if(S.ans!==null)return;S.ans=v;if(v===QUIZ5[S.i].ok)S.score++;render();}
  function end(){by.hidden=bn.hidden=true;nx.innerHTML='Baştan başla';nx.onclick=()=>{S.i=0;S.score=0;S.ans=null;by.hidden=bn.hidden=false;nx.innerHTML='Sıradaki →';nx.onclick=()=>next();render();};
    api.draw(grid()+T({x:320,y:200},`${S.score} / ${QUIZ5.length}`,'lbl').replace('class="lbl"','class="lbl" style="font-size:64px"')+T({x:320,y:270},'doğru cevap','ttl'));
    api.info(head('Sonuç',`${S.score} / ${QUIZ5.length}`,S.score>=7?'Çokgen uzmanı!':'Bir daha dene',S.score>=7?'Çokgenin üç şartını iyi biliyorsun.':'İpucu: doğru parçası, kapalı, kesişmeyen kenarlar.',S.score>=7?'good':''));
    if(S.score>=7)api.done('quiz');}
  function render(){const q=QUIZ5[S.i];let s=grid()+`<path class="qshape" d="${q.d}" ${q.open?'style="fill:none"':''}/>`+T({x:320,y:400},`Soru ${S.i+1} / ${QUIZ5.length}`,'sml');api.draw(s);
    nx.disabled=S.ans===null;
    if(S.ans===null)api.info(head('Soru '+(S.i+1),'Bu bir çokgen mi?',null,'Şartlar: yalnızca doğru parçaları, kapalı şekil, kenarlar birbirini kesmez.')+stats(stat('Doğru',S.score),stat('Kalan',QUIZ5.length-S.i)));
    else{const ok=S.ans===q.ok;api.info(head(q.n,ok?'Doğru!':'Yanlış',q.ok?'Çokgen':'Çokgen değil',q.why,ok?'good':'warn')+stats(stat('Doğru',S.score),stat('Kalan',QUIZ5.length-S.i-1)));}}
  render();}}
]});

/* ---------- Üçgenler ve dörtgenler ---------- */
function triLab(keys,o){o=o||{};return function(api){
  const P=cp(o.P||{A:{x:160,y:360},B:{x:520,y:360},C:{x:280,y:120}});const S={snap:true};
  api.hint('A, B, C köşelerini sürükle.');
  api.check('Kareli kâğıda oturt',true,v=>{S.snap=v;});
  api.button('Başa dön',()=>{Object.assign(P,cp(o.P||{A:{x:160,y:360},B:{x:520,y:360},C:{x:280,y:120}}));render(false);});
  function render(user){const st=triState(P);api.draw(grid()+triDraw(P,st)+triHandles(P));
    if(st.degen)api.info(degenInfo());
    else api.info(`<p class="eyebrow">İç açılar</p>`+triAngInfo(st)+`<div class="tags"><span class="tag">Kenarlarına göre<br><b>${st.bySide}</b></span><span class="tag">Açılarına göre<br><b>${st.byAng}</b></span></div><div class="tags"><span class="tag">|AB| <b>${tr(st.sc/U)}</b></span><span class="tag">|BC| <b>${tr(st.sa/U)}</b></span><span class="tag">|CA| <b>${tr(st.sb/U)}</b></span><span class="tag">1 kare = 1 br</span></div>`);
    if(user&&!st.degen&&keys){if(st.byAng==='Dik açılı')api.done(keys.dik);if(st.bySide!=='Çeşitkenar')api.done(keys.ikiz);if(st.byAng==='Geniş açılı')api.done(keys.genis);if(st.bySide==='Eşkenar')api.done(keys.eskenar);if(keys.dikiz&&st.byAng==='Dik açılı'&&st.bySide==='İkizkenar')api.done(keys.dikiz);}}
  api.drag((id,p)=>{if(triMove(P,id,p,S.snap))render(true);});render(false);};}
function quadLab(keys,diag){return function(api){
  const Q0=[{x:160,y:340},{x:480,y:320},{x:440,y:120},{x:200,y:160}];let Q=cp(Q0);const S={snap:true};
  api.hint('A, B, C, D köşelerini sürükle.');
  api.check('Kareli kâğıda oturt',true,v=>{S.snap=v;});
  api.button('Başa dön',()=>{Q=cp(Q0);render(false);});
  function render(user){const st=quadState(Q);api.draw(grid()+quadDraw(Q,st,{diag}));api.info(quadInfo(st,diag));
    if(user&&keys&&!st.bad){const m={Kare:keys.kare,Dikdörtgen:keys.dikd,'Eşkenar dörtgen':keys.esk,Paralelkenar:keys.par,Yamuk:keys.yamuk,Deltoid:keys.del}[st.name];if(m)api.done(m);}}
  api.drag((id,p)=>{if(quadMove(Q,id,p,S.snap))render(true);});render(false);};}
function tearLab(key){return function(api){
  const P={A:{x:140,y:290},B:{x:500,y:290},C:{x:300,y:80}};const S={t:0};const Q={x:320,y:400};
  api.hint('Köşeleri sürükle, sonra Oynat\'a bas.');
  const sl=api.slider({label:'Köşeleri yırt',min:0,max:1,step:0.001,value:0,play:true,dur:3200,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  function render(user){const st=triState(P);let s=grid();const k=ease(S.t);
    if(st.degen){api.draw(s+`<path class="tri" d="${pd([P.A,P.B,P.C])}"/>`+triHandles(P));api.info(degenInfo());return;}
    s+=`<path class="${S.t>0?'ghost':'tri'}" d="${pd([P.A,P.B,P.C])}"/>`;
    const V=[P.A,P.B,P.C],cl=['cA','cB','cC'],a=st.raw;const tgt=[180-a[0],180-a[0]-a[1],0];
    if(S.t>0.98)s+=L({x:Q.x-150,y:Q.y},{x:Q.x+150,y:Q.y},'ray thin');
    V.forEach((v,i)=>{const w=wedge(v,V[(i+1)%3],V[(i+2)%3]);if(S.t>0)s+=`<path class="fsec ${cl[i]}" style="fill-opacity:.18;stroke-dasharray:4 4" d="${sector(v,46,w.s,w.s+w.d)}"/>`;
      const delta=((tgt[i]-w.s+540)%360)-180;const c=lerpP(v,Q,k),st0=w.s+delta*k;
      s+=`<path class="fsec ${cl[i]}" d="${sector(c,46,st0,st0+w.d)}"/>`+T(polar(c,70,st0+w.d/2),st.ang[i]+'°','val');});
    V.forEach((v,i)=>{const G={x:(P.A.x+P.B.x+P.C.x)/3,y:(P.A.y+P.B.y+P.C.y)/3},d=sub(v,G),dl=len(d)||1;s+=T({x:v.x+d.x/dl*28,y:v.y+d.y/dl*28},'ABC'[i],'lbl');});
    if(S.t>0.98)s+=T({x:Q.x,y:Q.y+24},'Doğru açı = 180°','ttl');
    if(S.t===0)s+=triHandles(P);api.draw(s);
    api.info(head('Üç köşeyi yan yana koy',S.t>0.98?'Doğru açı oluştu!':'Köşeler yolda…',null,'Kâğıttan bir üçgenin köşelerini yırtıp yan yana koyarsan her zaman düz bir çizgi oluşur.')+triAngInfo(st));
    if(user&&S.t>0.99&&key)api.done(key);}
  api.drag((id,p)=>{if(S.t>0)return;if(triMove(P,id,p,true,[60,60,580,300]))render(false);});render(false);};}

reg({id:'u5',g:5,sub:'Üçgenler ve Dörtgenler',title:'Şekil Ailesi',
icon:'<path class="if" d="M12 100L62 100L37 54Z"/><rect class="if2" x="58" y="34" width="50" height="50" rx="2" transform="rotate(8 83 59)"/>',
tasks:[{k:'dik',text:'Bir dik üçgen oluştur',lab:0},{k:'ikiz',text:'Bir ikizkenar üçgen oluştur',lab:0},{k:'eskenar',text:'Eşkenar üçgen oluştur',lab:0,hint:'Yapıştırmayı kapat, açılar 60° olsun'},
 {k:'kare',text:'Bir kare oluştur',lab:1},{k:'par',text:'Bir paralelkenar oluştur',lab:1},{k:'yamuk',text:'Bir yamuk oluştur',lab:1},{k:'yirt',text:'Üçgenin köşelerini yırtıp yan yana diz',lab:2}],
labs:[
{name:'Üçgen Laboratuvarı',note:'Üçgenler iki şekilde sınıflanır. Kenarlarına göre: eşkenar, ikizkenar, çeşitkenar. Açılarına göre: dar, dik, geniş açılı.',init:triLab({dik:'dik',ikiz:'ikiz',eskenar:'eskenar'})},
{name:'Dörtgen Ailesi',note:'Kare hem dikdörtgendir hem eşkenar dörtgendir. Dikdörtgen de bir paralelkenardır. Özel dörtgenler büyük bir ailenin üyeleridir.',init:quadLab({kare:'kare',par:'par',yamuk:'yamuk'},false)},
{name:'Neden 180°?',why:true,note:'Üçgen nasıl olursa olsun, üç köşesini yan yana koyunca bir doğru açı oluşur. Bu yüzden iç açıların toplamı her zaman 180°.',init:tearLab('yirt')}
]});

/* ---------- Çember ---------- */
reg({id:'cm5',g:5,sub:'Çember ve Daire',title:'Pergelin Sırrı',
icon:'<circle class="if" cx="60" cy="60" r="44"/><path class="is" d="M60 60L104 60"/><path class="is" d="M60 60L29 29" style="stroke-dasharray:6 7"/><circle class="idot" cx="60" cy="60" r="6"/>',
tasks:[{k:'r3',text:'Yarıçapı 3 br olan bir çember çiz',lab:0},{k:'cap8',text:'Çapı 8 br olan bir çember çiz',lab:0},{k:'daire',text:'Daire görünümüne geç',lab:0},{k:'ciz',text:'Pergelle tam bir çember çiz',lab:1}],
labs:[
{name:'Merkez, Yarıçap, Çap',note:'Çemberdeki her nokta merkeze aynı uzaklıktadır; bu uzaklık yarıçaptır. Çap iki yarıçaptan oluşur: çap = 2 × yarıçap.',
init(api){
  const S={O:{x:320,y:220},R:{x:440,y:220},pa:125,disk:false};
  api.hint('Merkezi (O), yarıçap ucunu (R) ve çemberdeki P noktasını sürükle.');
  api.seg([['c','Çember'],['d','Daire']],'c',v=>{S.disk=v==='d';render(true);});
  function render(user){const {O,R}=S,r=dist(O,R),P=polar(O,r,S.pa),R2={x:2*O.x-R.x,y:2*O.y-R.y};let s=grid();
    s+=`<circle cx="${O.x}" cy="${O.y}" r="${f(r)}" class="${S.disk?'cA':''}" style="${S.disk?'fill-opacity:.4;':'fill:none;'}stroke:var(--ink);stroke-width:3.5"/>`;
    s+=L(R2,R,'dash')+L(O,R,'ray pen')+L(O,P,'ray thin');
    const rm=mid(O,R),n=dirDeg(O,R);s+=T(polar(rm,16,n+90),'r','lbl')+T(polar(mid(O,R2),16,n+90),'r','sml');
    s+=`<circle class="vtx" cx="${O.x}" cy="${O.y}" r="6"/>`+T({x:O.x-14,y:O.y+20},'O','lbl')+T(polar(P,22,S.pa),'P','lbl')+T(polar(R,22,n),'R','lbl');
    s+=hdl('O',O,'Merkez')+hdl('R',R,'Yarıçap ucu')+hdl('P',P,'Çemberdeki nokta');api.draw(s);
    api.info(head(S.disk?'Daire':'Çember',`r = ${tr(r/U)} br`,`Çap = ${tr(2*r/U)} br`,S.disk?'Daire, çemberin kendisi ve içindeki bölgedir.':'Çember yalnızca sınır çizgisidir; içi boştur.')+stats(stat('|OR| yarıçap',tr(r/U)+' br'),stat('|OP|',tr(r/U)+' br','P nereye giderse gitsin aynı!'))+`<p class="eqn">çap = 2 × ${tr(r/U)} = ${tr(2*r/U)} br</p>`);
    if(user){if(Math.abs(r-3*U)<0.5)api.done('r3');if(Math.abs(r-4*U)<0.5)api.done('cap8');if(S.disk)api.done('daire');}}
  api.drag((id,p)=>{if(id==='P'){S.pa=dirDeg(S.O,p);render(true);return;}
    const x=clamp(snapv(p.x),U,W-U),y=clamp(snapv(p.y),U,HT-U);
    if(id==='O'){const d=sub(S.R,S.O);S.O={x,y};S.R={x:x+d.x,y:y+d.y};}else{if(x===S.O.x&&y===S.O.y)return;S.R={x,y};}render(true);});
  render(false);}},
{name:'Pergelle Çiz',why:true,note:'Pergelin iki kolu arasındaki açıklık hiç değişmez. Bu yüzden kalem, merkeze hep aynı uzaklıkta kalarak döner ve çember çizer.',
init(api){
  const O={x:320,y:240},S={r:3,t:0};
  api.hint('Pergel açıklığını seç, Oynat\'a bas.');
  api.slider({label:'Açıklık (r)',min:1,max:4.5,step:0.5,value:3,fmt:v=>tr(v)+' br',onInput:v=>{S.r=v;S.t=0;sl.set(0);render(false);}});
  const sl=api.slider({label:'Çizim',min:0,max:1,step:0.001,value:0,play:true,dur:3500,fmt:v=>Math.round(v*360)+'°',onInput:v=>{S.t=v;render(true);}});
  function render(user){const r=S.r*U,th=S.t*360,P=polar(O,r,th);let s=grid();
    s+=`<circle cx="${O.x}" cy="${O.y}" r="${r}" class="ring"/>`;
    if(th>0)s+=`<path class="ray pen" d="${arc(O,r,0,th)}"/>`;
    for(let a=0;a<=th-1;a+=45){const q=polar(O,r,a);s+=L(O,q,'dash')+`<circle class="vtx" cx="${f(q.x)}" cy="${f(q.y)}" r="4"/>`;}
    const m=mid(O,P),v=sub(P,O),vl=len(v)||1;let nn={x:-v.y/vl,y:v.x/vl};if(nn.y>0)nn={x:-nn.x,y:-nn.y};const Lg=Math.max(r*0.7,120),hgt=Math.sqrt(Math.max(Lg*Lg-(r/2)*(r/2),400));const K={x:m.x+nn.x*hgt,y:m.y+nn.y*hgt};
    s+=`<line x1="${f(K.x)}" y1="${f(K.y)}" x2="${O.x}" y2="${O.y}" style="stroke:var(--ink-soft);stroke-width:7;stroke-linecap:round"/><line x1="${f(K.x)}" y1="${f(K.y)}" x2="${f(P.x)}" y2="${f(P.y)}" style="stroke:var(--hl4);stroke-width:7;stroke-linecap:round"/>`;
    s+=`<circle cx="${f(K.x)}" cy="${f(K.y)}" r="9" class="kpt"/><circle cx="${f(P.x)}" cy="${f(P.y)}" r="5" style="fill:var(--pen)"/><circle class="vtx" cx="${O.x}" cy="${O.y}" r="5"/>`+T({x:O.x-14,y:O.y+20},'O','lbl');
    api.draw(s);
    api.info(head('Pergel açıklığı',`r = ${tr(S.r)} br`,S.t>0.999?'Çember tamam':'Çiziliyor…','Kesikli çizgilerin hepsi aynı uzunlukta: hepsi yarıçap.')+stats(stat('Dönülen açı',Math.round(th)+'°'),stat('Merkeze uzaklık',tr(S.r)+' br','her an aynı')));
    if(user&&S.t>0.999)api.done('ciz');}
  render(false);}}
]});

/* ---------- Geometrik cisimler 5 ---------- */
reg({id:'p5',g:5,sub:'Geometrik Cisimler',title:'Kutu Atölyesi',
icon:'<path class="if" d="M18 40L60 20L102 40L102 86L60 106L18 86Z"/><path class="is" d="M18 40L60 60L102 40M60 60V106"/>',
tasks:[{k:'ucgen',text:'Üçgen prizmayı incele',lab:0},{k:'kup',text:'Bir küp oluştur',lab:0,hint:'Kare prizmada yükseklik = taban kenarı'},{k:'euler',text:'3 farklı prizmanın yüz, köşe, ayrıt sayılarını karşılaştır',lab:0},{k:'ac',text:'Kutuyu tamamen aç',lab:1},{k:'kupac',text:'Bir küpün açınımını gör',lab:1}],
labs:[
{name:'Prizma Gezgini',note:'Her prizmada: yüz + köşe − ayrıt = 2. Tabanı n kenarlı ise n + 2 yüzü, 2n köşesi, 3n ayrıtı vardır.',
init(api){
  const S={n:4,a:2,h:3,mode:'y'},seen=new Set(),cam=cam3({s:62,cy:225});
  api.hint('Döndürmek için çizim alanında sürükle.');
  api.seg([['y','Yüzler'],['a','Ayrıtlar'],['k','Köşeler']],'y',v=>{S.mode=v;render(false);});
  api.slider({label:'Taban kenar sayısı',min:3,max:8,step:1,value:4,fmt:v=>Math.round(v),onInput:v=>{S.n=Math.round(v);render(true);}});
  api.slider({label:'Taban kenarı',min:1,max:3,step:0.5,value:2,fmt:v=>tr(v)+' br',onInput:v=>{S.a=v;render(true);}});
  api.slider({label:'Yükseklik',min:1,max:4,step:0.5,value:3,fmt:v=>tr(v)+' br',onInput:v=>{S.h=v;render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const {n,a,h}=S;const F=prismFaces(n,a,h,'cA','cB');
    if(S.mode==='y'){const cls=['cA','cC','cD'];F.forEach((fc,i)=>{if(i>=2)fc.k=cls[(i-2)%3];});}
    let s=plain()+convex3(F,cam,{});
    const R=a/(2*Math.sin(PI/n)),off=PI/2+PI/n,b=ngon3(n,R,-h/2,off),t=ngon3(n,R,h/2,off);
    if(S.mode==='a'){for(let i=0;i<n;i++){const j=(i+1)%n;[[b[i],b[j]],[t[i],t[j]],[b[i],t[i]]].forEach(([p,q])=>{s+=L(P3(p,cam),P3(q,cam),'e3');});}}
    if(S.mode==='k'){b.concat(t).forEach((p,i)=>{const q=P3(p,cam);s+=`<circle cx="${f(q.x)}" cy="${f(q.y)}" r="11" style="fill:var(--pen);stroke:var(--sheet);stroke-width:2"/>`+`<text x="${f(q.x)}" y="${f(q.y)}" text-anchor="middle" dominant-baseline="central" style="fill:#fff;font:900 11px var(--body)">${i+1}</text>`;});}
    api.draw(s);
    const name=n===4?(a===h?'Küp':'Kare prizma'):PL[n][0].toUpperCase()+PL[n].slice(1)+' prizma';
    seen.add(n);
    api.info(head('Cismin adı',name,null,`İki tabanı eş ${PL[n]}, yan yüzleri dikdörtgen.`)+stats(stat('Yüz',n+2),stat('Köşe',2*n),stat('Ayrıt',3*n))+`<p class="eqn">${n+2} + ${2*n} − ${3*n} = 2<small>yüz + köşe − ayrıt</small></p>`);
    if(user){if(n===3)api.done('ucgen');if(n===4&&a===h)api.done('kup');if(seen.size>=3)api.done('euler');}}
  render(false);}},
{name:'Kutuyu Aç',why:true,note:'Bir dikdörtgenler prizmasını açınca 6 dikdörtgen çıkar. Karşılıklı yüzler eştir: alt-üst, ön-arka, sağ-sol.',
init(api){
  const S={a:3,b:2,c:2,t:0},cam=cam3({s:36,cy:250,pitch:0.5});
  api.hint('Oynat\'a bas ya da kaydırıcıyı çek. Döndürmek için sürükle.');
  api.slider({label:'En',min:1,max:4,step:1,value:3,fmt:v=>v+' br',onInput:v=>{S.a=v;render(true);}});
  api.slider({label:'Boy',min:1,max:4,step:1,value:2,fmt:v=>v+' br',onInput:v=>{S.b=v;render(true);}});
  api.slider({label:'Yükseklik',min:1,max:4,step:1,value:2,fmt:v=>v+' br',onInput:v=>{S.c=v;render(true);}});
  api.slider({label:'Aç',min:0,max:1,step:0.001,value:0,play:true,dur:3000,fmt:v=>Math.round(v*100)+'%',onInput:v=>{S.t=v;render(true);}});
  api.orbit(cam,()=>render(false));
  function render(user){const k=ease(S.t);const c2=netCam(cam,S.a,S.b,S.c,k);
    const F=netFaces(S.a,S.b,S.c,k);if(S.t>0.98)F.forEach(fc=>fc.lab=fc.n);
    api.draw(plain()+painter3(F,c2));
    const cube=S.a===S.b&&S.b===S.c;
    api.info(head('Dikdörtgenler prizması',S.t>0.98?'Açınım hazır':'Açılıyor…',cube?'Küp':null,'Kutuyu kesip düzleme yaydık. Aynı renkteki yüzler birbirine eş.')+`<ul class="rows"><li><i class="sw cA"></i>Alt ve üst<b>${S.a} × ${S.b}</b></li><li><i class="sw cB"></i>Ön ve arka<b>${S.a} × ${S.c}</b></li><li><i class="sw cC"></i>Sağ ve sol<b>${S.b} × ${S.c}</b></li></ul>`);
    if(user&&S.t>0.99){api.done('ac');if(cube)api.done('kupac');}}
  render(false);}}
]});
