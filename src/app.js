<script>
(function(){
const APP_V='__V__';
const PORTAL='https://taif-ops.vercel.app/?back=1';
const FORM='https://forms.gle/us3hgom7yADd3Goh7';
const GCAL='https://calendar.google.com/calendar/embed?mode=AGENDA&showPrint=0&showTz=0&showCalendars=1&ctz=Asia%2FRiyadh&src=thi8lfa3o57nf0enn1iitcnsbc%40group.calendar.google.com&color=%2342d692&src=ar.saudiarabian%23holiday%40group.v.calendar.google.com&color=%2316a765';
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const PALETTE=['#56A7DD','#63BDC1','#A6C955','#62A752','#4590CC','#33748A','#A09FA3','#F472B6','#F5A524'];
const DAY_C='#F43F5E';
const sv=(d,w)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w||1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC={
 home:sv('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>'),
 systems:sv('<rect x="3" y="4" width="18" height="12" rx="2.5"/><path d="M8 20h8M12 16v4"/>'),
 orgs:sv('<path d="M4 20V8l8-4 8 4v12"/><path d="M9 20v-5h6v5M9 10h.01M15 10h.01M12 10h.01"/>'),
 refs:sv('<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6"/>'),
 apps:sv('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
 tools:sv('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),
 link:sv('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
 cal:sv('<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
 star:sv('<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>'),
 log:sv('<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>'),
 sun:sv('<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>'),
 moon:sv('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>'),
 pen:sv('<path d="M4 20h4L19 9l-4-4L4 16Z"/>',2),
 out:sv('<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10"/>'),
 dl:sv('<path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 20h16"/>',2),
 msg:sv('<path d="M4 5h16v11H9l-5 4z"/>'),
 search:sv('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',2),
 ext:sv('<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',2),
 plus:sv('<path d="M12 5v14M5 12h14"/>',2.2),
 portal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>',
 pa:'<svg class="pa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
 ios:'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11.2 8.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.6-2.3.6-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.6-1.1 1.9-.3 4.6.8 6.1.5.7 1.1 1.6 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5c.8 0 1.3-.8 1.8-1.5.6-.8.8-1.6.8-1.7 0 0-1.6-.6-1.6-2.6ZM9.7 3.9c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.8Z"/></svg>',
 gp:'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2.5 1.6c-.2.2-.3.5-.3.8v11.2c0 .3.1.6.3.8L8.8 8 2.5 1.6Zm7.1 5.6 1.8-1.8L4 1.2l5.6 6Zm0 1.6L4 14.8l7.4-4.2-1.8-1.8Zm4-2-1.9-1.1L9.7 8l2 2 1.9-1.1c.5-.3.5-1.1 0-1.1Z"/></svg>'
};
const secIcon=id=>IC[id]||IC.link;

const S={sec:[],links:[],days:[],view:'home',sid:'',q:'',fav:[],recent:[],theme:'dark',readonly:true,loaded:false,db:null,sync:{ok:true,at:0}};
try{const p=JSON.parse(localStorage.getItem('thc-links2')||'{}');Object.assign(S,{view:p.view||'home',sid:p.sid||'',fav:Array.isArray(p.fav)?p.fav:[],recent:Array.isArray(p.recent)?p.recent:[],theme:p.theme||'dark'})}catch(e){}
try{if(!localStorage.getItem('thc-links2')){const o=JSON.parse(localStorage.getItem('thc-links')||'{}');if(Array.isArray(o.fav))S.fav=o.fav}}catch(e){}
function remember(){try{localStorage.setItem('thc-links2',JSON.stringify({view:S.view,sid:S.sid,fav:S.fav,recent:S.recent,theme:S.theme}))}catch(e){}}
document.documentElement.setAttribute('data-theme',S.theme);

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DF=new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'});
const DS=new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'short'});
const DAYF=new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Riyadh'});
const TF12=new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Riyadh'});
const TODAY=new Date();TODAY.setHours(0,0,0,0);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function host(u){try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}}
function secsSorted(){return S.sec.slice().sort((a,b)=>(a.order??0)-(b.order??0))}
function secOf(l){return S.sec.find(s=>s.id===l.sid)||{name:'بدون قسم',color:'#8B9BCF',id:''}}
function sorted(list){return list.slice().sort((a,b)=>(a.order??0)-(b.order??0)||String(a.name).localeCompare(b.name,'ar'))}
function inSec(id){return S.links.filter(l=>l.sid===id)}
function isApp(l){return !!(l.ios||l.android)}
const norm=s=>String(s||'').toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
function matchQ(l,q){q=norm(q.trim());if(!q)return true;return norm(l.name+' '+(l.desc||'')+' '+host(l.url)+' '+secOf(l).name).includes(q)}
function nextDate(d){let x=new Date(TODAY.getFullYear(),(+d.m||1)-1,+d.d||1);if(x<TODAY)x=new Date(TODAY.getFullYear()+1,(+d.m||1)-1,+d.d||1);return x}
function daysTo(d){return Math.round((nextDate(d)-TODAY)/864e5)}
function daysSorted(){return S.days.slice().sort((a,b)=>daysTo(a)-daysTo(b))}
function cdTxt(n){return n===0?'اليوم':n===1?'غداً':n===2?'بعد يومين':n<=10?`بعد ${n} أيام`:`بعد ${n} يوماً`}
function cdChip(d){const n=daysTo(d);return `<span class="cd2${n===0?' now':n<=14?' soon':''}">${cdTxt(n)}</span>`}
function fav(u){return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(u))}&sz=64`}
function openUrl(l){if(!isApp(l))return l.url;const a=/Android/i.test(navigator.userAgent);return (a?l.android:l.ios)||l.ios||l.android||l.url}
function initial(l){return esc(String(l.name||'؟').trim().charAt(0))}
const logo=()=>`<img class="lg-w" src="img/logo-white.png" alt="تجمع الطائف الصحي"><img class="lg-c" src="img/logo-color.png" alt="تجمع الطائف الصحي">`;

/* ---------- writes ---------- */
const SAVE_TXT={idle:'يُحفظ تلقائياً',saving:'جارٍ الحفظ…',saved:'تم الحفظ ✓',failed:'لم يُحفظ'};
let saveN=0;function setSave(s){const el=document.getElementById('savePill');if(el){el.className='savepill '+s;el.textContent=SAVE_TXT[s]}}
const colOf=c=>c==='links'?S.links:c==='sections'?S.sec:S.days;
let chain=Promise.resolve();
function write(c,id,op,data){
  const arr=colOf(c),i=arr.findIndex(x=>x.id===id);
  if(op==='update'&&i>=0)Object.assign(arr[i],data);
  else if(op==='set'){if(i>=0)arr[i]={id,...data};else arr.push({id,...data})}
  else if(op==='delete'){if(i>=0)arr.splice(i,1);if(c==='sections')S.links=S.links.filter(l=>l.sid!==id)}
  render();
  if(!S.db||S.readonly){toast('سجّل الدخول لحفظ التغييرات');return Promise.resolve()}
  if(data)data.updatedAt=Date.now();
  saveN++;setSave('saving');
  chain=chain.then(()=>S.db.send({c,id,op,data})).then(()=>{if(--saveN<=0){saveN=0;setSave('saved')}}).catch(e=>{saveN=Math.max(0,saveN-1);setSave('failed');toast(e&&e.code==='permission_denied'?'انتهت صلاحية الدخول، ادخل مرة ثانية':e&&e.code==='bad url'?'الرابط لازم يبدأ بـ https://':'تعذّر الحفظ، حاول مرة أخرى')});
  return chain;
}

/* ---------- shell ---------- */
function syncDot(){return `<i style="background:${S.sync.ok?'#22C55E':'#F43F5E'}"></i>`}
function syncTxt(){return S.sync.at?(S.sync.ok?'متزامن':'تعذّر التحديث'):'جارٍ الاتصال…'}
function navItems(){
  const it=[{v:'home',t:'الرئيسية',ic:IC.home}];
  secsSorted().forEach(s=>it.push({v:'sec',sid:s.id,t:s.name,c:s.color,n:inSec(s.id).length}));
  it.push({v:'days',t:'الأيام الصحية',ic:IC.cal,n:S.days.length});
  it.push({v:'fav',t:'المفضلة',ic:IC.star,n:S.fav.filter(id=>S.links.some(l=>l.id===id)).length});
  if(isAdmin())it.push({v:'log',t:'السجل والرموز',ic:IC.log});
  return it}
const isOn=x=>x.v===S.view&&(x.v!=='sec'||x.sid===S.sid)&&!S.q.trim();
function side(){
  const its=navItems();
  const item=x=>`<button class="s-it" data-go="${x.v}"${x.sid?` data-sid="${x.sid}"`:''} aria-pressed="${isOn(x)}" style="--c:${x.c||'var(--acc)'}">${x.ic||'<i></i>'}<span>${esc(x.t)}</span>${x.n!=null?`<em class="tab-num">${x.n}</em>`:''}</button>`;
  return `<a class="pbtn wide" href="${PORTAL}" aria-label="العودة لبوابة التشغيل">${IC.portal}<span>بوابة التشغيل</span>${IC.pa}</a>
  <div class="s-id">${logo()}<div><b>دليل الأنظمة والخدمات الصحية</b><span>الإدارة التنفيذية للتشغيل</span></div></div>
  ${!S.readonly?`<div class="s-user"><span class="s-av">${esc((API.name||'؟').trim().charAt(0))}</span><div><b>${esc(API.name)}</b><small>${ROLE_N[API.role]||''} · وضع التعديل</small></div></div>`:''}
  <nav class="s-nav">${item(its[0])}<div class="s-lbl">الأقسام</div>${its.filter(x=>x.v==='sec').map(item).join('')}<div class="s-lbl">أدوات</div>${its.filter(x=>x.v!=='sec'&&x.v!=='home').map(item).join('')}</nav>
  <div class="s-act">
    <button class="s-btn" data-act="export">${IC.dl}<span>تصدير PDF / Excel</span></button>
    <a class="s-btn" href="${FORM}" target="_blank" rel="noopener" style="text-decoration:none">${IC.msg}<span>للملاحظات والاستفسارات</span></a>
    <button class="s-btn" data-act="edit">${S.readonly?IC.pen:IC.out}<span>${S.readonly?'دخول التعديل':'إنهاء التعديل'}</span></button>
    <button class="s-btn" data-act="theme">${S.theme==='light'?IC.moon:IC.sun}<span>${S.theme==='light'?'الوضع الداكن':'الوضع الفاتح'}</span></button>
  </div>
  <div class="s-foot"><span>${syncDot()}${syncTxt()} · النسخة ${APP_V}</span><b>إعداد وتطوير: سالم سعد الشهري</b></div>`}
function header(){return `<div class="id">${logo()}<span class="sep"></span><div class="tt"><b>دليل الأنظمة والخدمات الصحية</b><span>الإدارة التنفيذية للتشغيل</span></div></div>
  <div class="acts"><a class="pbtn mini" href="${PORTAL}" aria-label="العودة لبوابة التشغيل">${IC.portal}<span>البوابة</span></a><button class="ibtn${S.readonly?'':' on'}" data-act="edit" aria-label="${S.readonly?'دخول التعديل':'إنهاء التعديل'}">${S.readonly?IC.pen:IC.out}</button><button class="ibtn" data-act="theme" aria-label="تبديل الثيم">${S.theme==='light'?IC.moon:IC.sun}</button></div>`}
function pnav(){return navItems().map(x=>`<button data-go="${x.v}"${x.sid?` data-sid="${x.sid}"`:''} aria-pressed="${isOn(x)}" style="--c:${x.c||'var(--acc)'}">${x.c?'<i></i>':''}${esc(x.t)}</button>`).join('')}
function footer(){return `<span style="display:flex;flex-direction:column;gap:6px"><span>تجمع الطائف الصحي · الإدارة التنفيذية للتشغيل</span><b>إعداد وتطوير: سالم سعد الشهري © 2026</b><span class="sy">${syncDot()}${syncTxt()} <span style="opacity:.5">|</span> النسخة ${APP_V}</span></span><a class="lnk" href="${FORM}" target="_blank" rel="noopener">للملاحظات والاستفسارات ↗</a>`}

/* ---------- pieces ---------- */
function linkRow(l){const s=secOf(l),f=S.fav.includes(l.id),h=host(l.url);
  return `<div class="lk" style="--c:${s.color}" data-id="${esc(l.id)}">
    <span class="ic"><span>${initial(l)}</span>${h?`<img src="${fav(l.url)}" alt="" loading="lazy" onerror="this.remove()">`:''}</span>
    <a class="tx" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}" style="text-decoration:none"><b>${esc(l.name)}</b>${l.desc?`<small>${esc(l.desc)}</small>`:''}${!isApp(l)&&h?`<em>${esc(h)}</em>`:''}</a>
    ${isApp(l)?`<span class="stores">${l.ios?`<a href="${esc(l.ios)}" target="_blank" rel="noopener" data-open="${esc(l.id)}" aria-label="آب ستور">${IC.ios}<span>آيفون</span></a>`:''}${l.android?`<a href="${esc(l.android)}" target="_blank" rel="noopener" data-open="${esc(l.id)}" aria-label="قوقل بلاي">${IC.gp}<span>أندرويد</span></a>`:''}</span>`
      :`<a class="go" href="${esc(l.url)}" target="_blank" rel="noopener" data-open="${esc(l.id)}" aria-label="فتح ${esc(l.name)}">${IC.ext}</a>`}
    <button class="star" data-fav="${esc(l.id)}" aria-pressed="${f}" aria-label="${f?'إزالة من المفضلة':'إضافة للمفضلة'}">${f?'★':'☆'}</button>
    <span class="pen">تعديل</span>
  </div>`}
function dayRow(d){return `<div class="dr" data-day="${esc(d.id)}"><span class="dbad"><b class="tab-num">${+d.d}</b><small>${MONTHS[(+d.m||1)-1]}</small></span><span class="xt">${esc(d.name)}${d.desc?`<small>${esc(d.desc)}</small>`:''}</span>${cdChip(d)}</div>`}
function chip(l){const s=secOf(l),h=host(l.url);return `<a class="chipg" style="--c:${s.color}" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}"><i>${initial(l)}${h?`<img src="${fav(l.url)}" alt="" loading="lazy" onerror="this.remove()">`:''}</i>${esc(l.name)}</a>`}
function emptyBox(t,s,btn){return `<div class="empty2"><b>${t}</b><span>${s}</span>${btn||''}</div>`}
function sbar(){return `<div class="sbar"><label class="search">${IC.search}<input id="q" type="search" placeholder="ابحث في ${S.links.length} رابط: نظام، جهة، تطبيق…" value="${esc(S.q)}" autocomplete="off"></label><button class="gbtn mob-x" data-act="export" aria-label="تصدير">${IC.dl}<span>تصدير</span></button></div>`}

/* ---------- views ---------- */
function vHome(){
  const nd=daysSorted()[0],apps=S.links.filter(isApp).length;
  const favs=sorted(S.links.filter(l=>S.fav.includes(l.id)));
  const rec=S.recent.map(id=>S.links.find(l=>l.id===id)).filter(Boolean).slice(0,8);
  return `<section class="dhero"><span class="pill2"><i></i>دليل الأنظمة الصحية</span>
    <h1>كل أنظمتك الصحية في مكان واحد</h1>
    <p>أنظمة وزارة الصحة، والجهات والهيئات الصحية، والمراجع الطبية، والتطبيقات، وتقويم الأيام الصحية العالمية. ابحث وافتح بضغطة، وثبّت مفضلتك بالنجمة.</p>
    <div class="hstat"><button data-go="sec" data-sid="${secsSorted()[0]?.id||''}"><b class="tab-num">${S.links.length}</b><span>رابطاً في ${S.sec.length} أقسام</span></button>
      <button data-go="sec" data-sid="${(S.sec.find(s=>s.id==='apps')||{}).id||''}"><b class="tab-num">${apps}</b><span>تطبيقاً للجوال</span></button>
      <button data-go="days"><b class="tab-num">${S.days.length}</b><span>يوماً صحياً عالمياً</span></button>
      <button data-go="days">${nd?`<b class="sm">${esc(nd.name)}</b><span>${nd.d} ${MONTHS[nd.m-1]} · ${cdTxt(daysTo(nd))}</span>`:'<b>—</b><span>اليوم الصحي القادم</span>'}</button></div>
  </section>
  ${rec.length?`<div class="grp"><div class="gh"><b style="--c:var(--muted);color:var(--muted)">آخر ما فتحت</b></div><div class="recent">${rec.map(chip).join('')}</div></div>`:''}
  ${favs.length?`<div class="grp"><div class="gh" style="--c:#FACC15"><b><i></i>★ المفضلة</b><span>${favs.length}</span></div><div class="lgrid">${favs.map(linkRow).join('')}</div></div>`:''}
  <div class="grp"><div class="sh"><div><h2>الأقسام</h2><p>اختر قسماً لعرض روابطه</p></div><div class="acts ed-only"><button class="gbtn sm" data-act="addSec">${IC.plus}قسم جديد</button></div></div>
  <div class="sgrid">${secsSorted().map(s=>{const ls=sorted(inSec(s.id));return `<button class="tile" style="--c:${s.color}" data-go="sec" data-sid="${s.id}"><span class="ti">${secIcon(s.id)}</span><b>${esc(s.name)}</b><span class="n tab-num">${ls.length}<small>رابط</small></span><span class="peek">${esc(ls.slice(0,4).map(l=>l.name).join(' · '))}</span></button>`}).join('')}</div></div>
  <div class="duo">
    <div class="card"><h3>الأيام الصحية القادمة <button class="lnk" data-go="days">التقويم كامل ←</button></h3><div class="dlist">${daysSorted().slice(0,5).map(dayRow).join('')||'<p class="note">لا توجد أيام صحية.</p>'}</div></div>
    <div class="card" style="--c:${(S.sec.find(s=>s.id==='apps')||{}).color||'#62A752'}"><h3>تطبيقات الجوال <button class="lnk" data-go="sec" data-sid="apps">الكل ←</button></h3><div class="lgrid" style="grid-template-columns:1fr">${sorted(S.links.filter(isApp)).slice(0,4).map(linkRow).join('')||'<p class="note">لا توجد تطبيقات.</p>'}</div></div>
  </div>`}
function vSec(){
  const s=S.sec.find(x=>x.id===S.sid);if(!s){S.view='home';return vHome()}
  const ls=sorted(inSec(s.id));
  return `<div class="sh" style="--c:${s.color}"><div><h2><i></i>${esc(s.name)}</h2><p>${ls.length} رابط${s.id==='apps'?' · لكل تطبيق رابط للآيفون وللأندرويد':''}</p></div>
    <div class="acts ed-only"><button class="gbtn sm" data-act="editSec" data-sid="${s.id}">${IC.pen}تعديل القسم</button><button class="gbtn sm acc" data-act="addLink" data-sid="${s.id}">${IC.plus}رابط جديد</button></div></div>
  ${ls.length?`<div class="lgrid${ls.some(isApp)?' apps':''}">${ls.map(linkRow).join('')}</div>`:emptyBox('لا توجد روابط في هذا القسم','',S.readonly?'':`<button class="gbtn sm acc" data-act="addLink" data-sid="${s.id}">${IC.plus}أضف أول رابط</button>`)}`}
function vSearch(){const q=S.q.trim();const res=S.links.filter(l=>matchQ(l,q));
  const groups=secsSorted().map(s=>({s,ls:sorted(res.filter(l=>l.sid===s.id))})).filter(g=>g.ls.length);
  return `<div class="sh"><div><h2>نتائج البحث</h2><p>${res.length} نتيجة لـ «${esc(q)}»</p></div><div class="acts"><button class="gbtn sm" data-act="clearq">مسح البحث</button></div></div>
  ${groups.length?groups.map(g=>`<div class="grp" style="--c:${g.s.color}"><div class="gh"><b><i></i>${esc(g.s.name)}</b><span>${g.ls.length}</span></div><div class="lgrid">${g.ls.map(linkRow).join('')}</div></div>`).join(''):emptyBox('ما لقينا شيء','جرّب كلمة ثانية، مثل اسم النظام أو الجهة.')}`}
function vFav(){const ls=sorted(S.links.filter(l=>S.fav.includes(l.id)));
  return `<div class="sh" style="--c:#FACC15"><div><h2><i></i>المفضلة</h2><p>تُحفظ على جهازك فقط</p></div></div>
  ${ls.length?`<div class="lgrid">${ls.map(linkRow).join('')}</div>`:emptyBox('ما عندك مفضلة بعد','اضغط النجمة ☆ بجانب أي رابط عشان يظهر هنا وفي الصفحة الرئيسية.')}`}
function vDays(){const cm=TODAY.getMonth()+1;const order=[...Array(12)].map((_,i)=>((cm-1+i)%12)+1);
  return `<div class="sh"><div><h2><i style="--c:${DAY_C}"></i>تقويم الأيام الصحية</h2><p>${S.days.length} مناسبة صحية عالمية · مرتبة من الشهر الحالي</p></div><div class="acts ed-only"><button class="gbtn sm acc" data-act="addDay">${IC.plus}يوم صحي</button></div></div>
  <div class="mgrid">${order.map(m=>{const list=S.days.filter(d=>+d.m===m).sort((a,b)=>a.d-b.d);if(!list.length&&m!==cm)return '';
    return `<div class="card mon${m===cm?' cur':''}"><h3><span style="display:flex;align-items:center;gap:8px"><i></i>${MONTHS[m-1]}</span><small>${m===cm?'الشهر الحالي · ':''}${list.length} مناسبة</small></h3><div class="dlist">${list.map(dayRow).join('')||'<p class="note">لا توجد مناسبات.</p>'}</div></div>`}).join('')}</div>
  <div class="card gcal"><h3>تقويم قوقل للأيام الصحية <a class="lnk" href="${GCAL}" target="_blank" rel="noopener">فتح ↗</a></h3><iframe src="${GCAL}" loading="lazy" title="تقويم الأيام الصحية العالمية"></iframe></div>`}
function vLog(){return `<div class="sh"><div><h2>السجل والرموز</h2><p>كل دخول وكل تعديل على الدليل، للمسؤولين فقط.</p></div><div class="acts"><button class="gbtn sm" data-act="logRef">تحديث</button><button class="gbtn sm" data-act="logX">${IC.dl}تصدير Excel</button></div></div>
  <div class="card"><h3>رموز الدخول</h3><div id="admPanel"><p class="note">جارٍ التحميل…</p></div></div>
  <div class="k4" id="logStats"></div><div id="logList"><p class="note">جارٍ تحميل السجل…</p></div>`}

/* ---------- render ---------- */
function render(){
  $('#side').innerHTML=side();$('#hd').innerHTML=header();$('#pnav').innerHTML=pnav();$('#ft').innerHTML=footer();
  if(!$('#q')||$('#sbarw').dataset.n!==String(S.links.length)){$('#sbarw').innerHTML=sbar();$('#sbarw').dataset.n=S.links.length}
  $('#eb').hidden=S.readonly;$('#ebName').textContent=(API.name||'')+' ('+(ROLE_N[API.role]||'')+')';
  document.body.classList.toggle('editing',!S.readonly);
  renderMain();
}
function renderMain(){const m=$('#main');
  if(!S.loaded){m.innerHTML='<div class="empty2"><div class="spin" style="margin:auto"></div><span>جارٍ تحميل الدليل…</span></div>';return}
  if(S.view==='log'&&!isAdmin())S.view='home';
  if(S.q.trim()){m.innerHTML=vSearch();return}
  if(S.view==='log'){if(!$('#logStats')){m.innerHTML=vLog();loadAdmin();LOG.entries?fillLog():loadLog()}return}
  m.innerHTML=S.view==='sec'?vSec():S.view==='days'?vDays():S.view==='fav'?vFav():vHome();
}
function go(v,sid){S.view=v;S.sid=sid||'';S.q='';const q=$('#q');if(q)q.value='';remember();render();window.scrollTo({top:0,behavior:'smooth'})}

/* ---------- link drawer ---------- */
let openId=null;
function modal(html,bind){const h=document.createElement('div');h.className='modal';h.innerHTML=`<div class="scrim" data-mclose></div><form class="box">${html}</form>`;document.body.appendChild(h);h.addEventListener('click',e=>{if(e.target.closest('[data-mclose]')){h.remove();if(h.dataset.link)openId=null}});bind(h,()=>{h.remove();openId=null});return h}
function linkModal(id){
  const l=S.links.find(x=>x.id===id);if(!l)return;openId=id;
  const h=modal(`<div class="mrow"><h3>تعديل الرابط</h3><span class="savepill" id="savePill">${SAVE_TXT.idle}</span></div>
    <div class="f"><label for="dName">الاسم</label><input id="dName" value="${esc(l.name)}"></div>
    <div class="f2"><div class="f"><label for="dSec">القسم</label><select id="dSec">${secsSorted().map(x=>`<option value="${x.id}"${x.id===l.sid?' selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
    <div class="f"><label for="dOrder">الترتيب</label><input id="dOrder" type="number" inputmode="numeric" value="${esc(l.order??'')}"></div></div>
    <div class="f"><label for="dUrl">الرابط</label><input id="dUrl" type="url" dir="ltr" value="${esc(l.url)}" placeholder="https://"></div>
    <div class="f"><label for="dDesc">وصف مختصر</label><input id="dDesc" value="${esc(l.desc||'')}"></div>
    <div class="f"><label for="dIos">رابط متجر آبل (للتطبيقات فقط)</label><input id="dIos" type="url" dir="ltr" value="${esc(l.ios||'')}"></div>
    <div class="f"><label for="dAnd">رابط متجر قوقل (للتطبيقات فقط)</label><input id="dAnd" type="url" dir="ltr" value="${esc(l.android||'')}"></div>
    <p class="note">كل تغيير يُحفظ تلقائياً عند الخروج من الخانة. الروابط تبدأ بـ https://</p>
    <div class="mrow"><button type="button" class="dbtn" id="delLink">حذف الرابط</button><span><a class="gbtn sm" href="${esc(openUrl(l))}" target="_blank" rel="noopener" style="text-decoration:none">فتح ↗</a><button class="gbtn sm acc">تم</button></span></div>`,
  (h,close)=>{const upd=(k,v)=>{if(String(l[k]??'')===String(v))return;if(['url','ios','android'].includes(k)&&v&&!/^https?:\/\//i.test(v)){toast('الرابط لازم يبدأ بـ https://');return}write('links',l.id,'update',{[k]:v})};
    h.querySelector('#dName').onchange=e=>upd('name',e.target.value.trim()||'رابط');
    h.querySelector('#dSec').onchange=e=>upd('sid',e.target.value);
    h.querySelector('#dOrder').onchange=e=>upd('order',+e.target.value||0);
    h.querySelector('#dUrl').onchange=e=>upd('url',e.target.value.trim());
    h.querySelector('#dDesc').onchange=e=>upd('desc',e.target.value.trim());
    h.querySelector('#dIos').onchange=e=>upd('ios',e.target.value.trim());
    h.querySelector('#dAnd').onchange=e=>upd('android',e.target.value.trim());
    const d=h.querySelector('#delLink');d.onclick=()=>{if(!d.classList.contains('armed')){d.classList.add('armed');d.textContent='تأكيد الحذف؟';return}close();write('links',l.id,'delete');toast('تم حذف الرابط')};
    h.querySelector('form').onsubmit=e=>{e.preventDefault();document.activeElement&&document.activeElement.blur();setTimeout(close,50)}});
  h.dataset.link='1';return h}
function addLink(sid){sid=sid||secsSorted()[0]?.id;if(!sid){toast('أضف قسماً أولاً');return}
  const id=uid();write('links',id,'set',{sid,name:'رابط جديد',url:'https://',desc:'',ios:'',android:'',order:inSec(sid).length+1});
  const h=linkModal(id);const t=h&&h.querySelector('#dName');t&&(t.focus(),t.select())}
function secModal(id){
  const s=S.sec.find(x=>x.id===id)||{name:'',color:PALETTE[S.sec.length%PALETTE.length],order:S.sec.length+1};let col=s.color;
  modal(`<h3>${id?'تعديل القسم':'قسم جديد'}</h3>
    <div class="f"><label for="sName">اسم القسم</label><input id="sName" required value="${esc(s.name)}"></div>
    <div class="f"><label>اللون (من ألوان هوية التجمع)</label><div class="swatches">${PALETTE.map(c=>`<button type="button" style="--c:${c}" data-c="${c}" aria-pressed="${c===col}"></button>`).join('')}</div></div>
    <div class="f"><label for="sOrder">الترتيب</label><input id="sOrder" type="number" inputmode="numeric" value="${esc(s.order??'')}"></div>
    ${id?`<p class="note">حذف القسم يحذف روابطه كلها (${inSec(id).length}).</p>`:''}
    <div class="mrow">${id?'<button type="button" class="dbtn" id="sDel">حذف القسم</button>':'<span></span>'}<span><button type="button" class="gbtn sm" data-mclose>إلغاء</button><button class="gbtn sm acc">حفظ</button></span></div>`,
  (h,close)=>{h.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;h.querySelectorAll('[data-c]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
    const d=h.querySelector('#sDel');if(d)d.onclick=()=>{if(!d.classList.contains('armed')){d.classList.add('armed');d.textContent='تأكيد الحذف؟';return}close();if(S.sid===id)S.view='home';write('sections',id,'delete');toast('تم حذف القسم')};
    h.querySelector('form').onsubmit=e=>{e.preventDefault();const data={name:h.querySelector('#sName').value.trim()||'قسم',color:col,order:+h.querySelector('#sOrder').value||0};close();
      if(id)write('sections',id,'update',data);else{const nid=uid();write('sections',nid,'set',data);go('sec',nid)}}});
}
function dayModal(id){
  const d=S.days.find(x=>x.id===id)||{name:'',m:TODAY.getMonth()+1,d:TODAY.getDate(),desc:''};
  modal(`<h3>${id?'تعديل اليوم الصحي':'يوم صحي جديد'}</h3>
    <div class="f"><label for="yName">اسم المناسبة</label><input id="yName" required value="${esc(d.name)}" placeholder="مثال: اليوم العالمي للسكري"></div>
    <div class="f2"><div class="f"><label for="yD">اليوم</label><input id="yD" type="number" min="1" max="31" inputmode="numeric" required value="${+d.d}"></div>
    <div class="f"><label for="yM">الشهر</label><select id="yM">${MONTHS.map((n,i)=>`<option value="${i+1}"${i+1===+d.m?' selected':''}>${n}</option>`).join('')}</select></div></div>
    <div class="f"><label for="yDesc">ملاحظة (اختياري)</label><input id="yDesc" value="${esc(d.desc||'')}"></div>
    <div class="mrow">${id?'<button type="button" class="dbtn" id="yDel">حذف</button>':'<span></span>'}<span><button type="button" class="gbtn sm" data-mclose>إلغاء</button><button class="gbtn sm acc">حفظ</button></span></div>`,
  (h,close)=>{const x=h.querySelector('#yDel');if(x)x.onclick=()=>{if(!x.classList.contains('armed')){x.classList.add('armed');x.textContent='تأكيد الحذف؟';return}close();write('days',id,'delete');toast('تم الحذف')};
    h.querySelector('form').onsubmit=e=>{e.preventDefault();const data={name:h.querySelector('#yName').value.trim(),d:Math.min(31,Math.max(1,+h.querySelector('#yD').value||1)),m:+h.querySelector('#yM').value,desc:h.querySelector('#yDesc').value.trim()};close();
      if(id)write('days',id,'update',data);else write('days',uid(),'set',data)}});
}

/* ---------- misc ---------- */
let tt;function toast(t){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);clearTimeout(tt);tt=setTimeout(()=>d.remove(),2600)}
const loaded={};
function loadScript(u){return loaded[u]||(loaded[u]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>{delete loaded[u];rej(new Error('lib'))};document.head.appendChild(s)}))}
function busy(msg){const el=document.createElement('div');el.className='busy';el.innerHTML=`<div class="box" style="justify-items:center;text-align:center;width:auto;min-width:260px"><div class="spin"></div><b></b><span class="note">لا تغلق الصفحة حتى يكتمل التجهيز</span></div>`;el.querySelector('b').textContent=msg;document.body.appendChild(el);return{close:()=>el.remove()}}
function toggleFav(id){const i=S.fav.indexOf(id);if(i>=0)S.fav.splice(i,1);else S.fav.push(id);remember();render();toast(i>=0?'أُزيل من المفضلة':'أُضيف للمفضلة ★')}
function track(id){S.recent=[id,...S.recent.filter(x=>x!==id)].slice(0,12);remember()}
function setTheme(t){S.theme=t;document.documentElement.setAttribute('data-theme',t);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='light'?'#F5F7FC':'#061452';remember();render()}

document.addEventListener('click',e=>{
  const f=e.target.closest('[data-fav]');if(f){e.preventDefault();toggleFav(f.dataset.fav);return}
  const o=e.target.closest('[data-open]');if(o){if(!S.readonly){e.preventDefault();linkModal(o.dataset.open);return}track(o.dataset.open);return}
  const lk=e.target.closest('.lk');if(lk&&!S.readonly&&!e.target.closest('a,button')){linkModal(lk.dataset.id);return}
  const dy=e.target.closest('[data-day]');if(dy&&!S.readonly){dayModal(dy.dataset.day);return}
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go,g.dataset.sid);return}
  const a=e.target.closest('[data-act]');if(a){const k=a.dataset.act;
    if(k==='theme')setTheme(S.theme==='light'?'dark':'light');
    else if(k==='edit'){if(S.readonly)loginModal();else setEdit(false)}
    else if(k==='export')exportMenu();
    else if(k==='addSec')secModal();
    else if(k==='editSec')secModal(a.dataset.sid);
    else if(k==='addLink')addLink(a.dataset.sid);
    else if(k==='addDay')dayModal();
    else if(k==='clearq'){S.q='';$('#q').value='';renderMain()}
    else if(k==='logRef'){LOG.entries=null;ADM.data=null;$('#main').innerHTML=vLog();loadAdmin();loadLog()}
    else if(k==='logX')exportLogExcel().catch(()=>toast('تعذّر التصدير'));
    return}
});
document.addEventListener('input',e=>{if(e.target.id==='q'){S.q=e.target.value;renderMain();document.querySelectorAll('.s-it,.nav button').forEach(b=>b.setAttribute('aria-pressed',String(!S.q.trim()&&b.dataset.go===S.view&&(S.view!=='sec'||b.dataset.sid===S.sid))))}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal').forEach(m=>m.remove());openId=null}
  if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){e.preventDefault();$('#q')&&$('#q').focus()}});

/* ---------- export ---------- */
function stamp(){return new Date().toISOString().slice(0,10)}
function fileSafe(t){return String(t).replace(/[\\/:*?"<>|]+/g,'').replace(/\s+/g,'-').slice(0,60)}
async function deliver(blob,filename){
  if(/FBAN|FBAV|Instagram|Line\/|Snapchat|WhatsApp|TikTok/i.test(navigator.userAgent))toast('للتحميل افتح الموقع في سفاري أو كروم');
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  if('download' in a){a.href=url;a.download=filename;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},60000)}else{const w=window.open(url,'_blank');if(!w)window.location.href=url}}
function exportMenu(){
  const rows=[['all','الدليل كامل',`${S.links.length} رابط · ${S.days.length} يوماً صحياً`,'var(--acc)'],...secsSorted().map(s=>[s.id,s.name,inSec(s.id).length+' رابط',s.color]),['days','الأيام الصحية',S.days.length+' مناسبة',DAY_C]];
  modal(`<h3>تصدير الدليل</h3><p class="note">ملفات بنفس هوية الموقع، والروابط في ملف PDF قابلة للضغط.</p><div style="display:grid;gap:8px">${rows.map(r=>`<div class="xr" style="--c:${r[3]}"><i></i><span class="xt">${esc(r[1])}<small>${esc(r[2])}</small></span><span class="xb"><button type="button" class="xp" data-x="pdf:${r[0]}">PDF</button><button type="button" class="xx" data-x="xlsx:${r[0]}">Excel</button></span></div>`).join('')}</div><div class="mrow"><span></span><button type="button" class="gbtn sm" data-mclose>إغلاق</button></div>`,
  (h,close)=>{h.querySelector('form').onsubmit=e=>e.preventDefault();h.addEventListener('click',e=>{const b=e.target.closest('[data-x]');if(!b)return;const [k,sc]=b.dataset.x.split(':');close();(k==='pdf'?exportPDF:exportExcel)(sc).catch(()=>toast('تعذّر التصدير، تأكد من الاتصال وحاول مرة أخرى'))})});
}
function scopeData(sc){const secs=sc==='all'?secsSorted():sc==='days'?[]:secsSorted().filter(s=>s.id===sc);
  return{secs,label:sc==='all'?'الدليل كامل':sc==='days'?'الأيام الصحية':(secs[0]||{}).name||'',days:sc==='all'||sc==='days'?daysSorted():[]}}
async function exportExcel(sc){
  const b=busy('جارٍ تجهيز ملف Excel…');
  try{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');
    const {secs,label,days}=scopeData(sc);const wb=new ExcelJS.Workbook();wb.creator='سالم سعد الشهري';
    const BG='FF061452',PN='FF10236F',ALT='FF0A1A5E',FG='FFEEF2FF',MU='FF9AA8D8',AC='FFF5A524';
    const argb=c=>'FF'+String(c).replace('#','').toUpperCase();
    const font=o=>Object.assign({name:'Arial',color:{argb:FG},size:11},o||{});
    const sheet=(n,cols)=>{const ws=wb.addWorksheet(n,{views:[{rightToLeft:true,showGridLines:false}]});ws.columns=cols.map(w=>({width:w}));return ws};
    const paint=(ws,rows,cols)=>{for(let r=1;r<=rows;r++)for(let c=1;c<=cols;c++){const cell=ws.getCell(r,c);if(!cell.fill)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:BG}};if(!cell.font)cell.font=font()}};
    const title=(ws,t,cols)=>{ws.mergeCells(1,1,1,cols);const c=ws.getCell(1,1);c.value=t;c.font=font({size:18,bold:true});ws.getRow(1).height=34;c.alignment={horizontal:'right',vertical:'middle'};
      ws.mergeCells(2,1,2,cols);const s=ws.getCell(2,1);s.value=`تجمع الطائف الصحي · الإدارة التنفيذية للتشغيل · ${label} · ${DF.format(new Date())}`;s.font=font({color:{argb:MU}});s.alignment={horizontal:'right'}};
    const head=(ws,r,hs)=>{hs.forEach((h,i)=>{const c=ws.getCell(r,i+1);c.value=h;c.font=font({bold:true,color:{argb:'FF061452'}});c.fill={type:'pattern',pattern:'solid',fgColor:{argb:AC}};c.alignment={horizontal:'right',vertical:'middle'}});ws.getRow(r).height=26};
    const alt=(ws,i,n)=>{if(i%2===0)for(let c=1;c<=n;c++)ws.getCell(i,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:ALT}}};
    const s1=sheet('الملخص',[34,16,46]);title(s1,'دليل الأنظمة والخدمات الصحية',3);head(s1,4,['القسم','عدد الروابط','أبرز الروابط']);let r=5;
    secs.forEach(s=>{const ls=sorted(inSec(s.id));s1.getCell(r,1).value=s.name;s1.getCell(r,1).font=font({bold:true,color:{argb:argb(s.color)}});s1.getCell(r,2).value=ls.length;s1.getCell(r,2).font=font({bold:true,size:13,color:{argb:AC}});s1.getCell(r,3).value=ls.slice(0,4).map(l=>l.name).join('، ');s1.getCell(r,3).font=font({color:{argb:MU}});alt(s1,r,3);r++});
    if(days.length){s1.getCell(r,1).value='الأيام الصحية';s1.getCell(r,1).font=font({bold:true,color:{argb:argb(DAY_C)}});s1.getCell(r,2).value=days.length;s1.getCell(r,2).font=font({bold:true,size:13,color:{argb:AC}});s1.getCell(r,3).value='القادم: '+days[0].name+' ('+days[0].d+' '+MONTHS[days[0].m-1]+')';alt(s1,r,3);r++}
    r++;s1.mergeCells(r,1,r,3);s1.getCell(r,1).value='إعداد وتطوير: سالم سعد الشهري';s1.getCell(r,1).font=font({color:{argb:MU}});paint(s1,r,3);
    const web=[];secs.forEach(s=>sorted(inSec(s.id)).filter(l=>!isApp(l)).forEach(l=>web.push([s,l])));
    if(web.length){const ws=sheet('الروابط',[28,34,36,46]);title(ws,'الروابط',4);head(ws,4,['القسم','الاسم','الوصف','الرابط']);let i=5;
      web.forEach(([s,l])=>{ws.getCell(i,1).value=s.name;ws.getCell(i,1).font=font({bold:true,color:{argb:argb(s.color)}});ws.getCell(i,2).value=l.name;ws.getCell(i,2).font=font({bold:true});ws.getCell(i,3).value=l.desc||'';ws.getCell(i,3).font=font({color:{argb:MU}});
        ws.getCell(i,4).value={text:host(l.url)||l.url,hyperlink:l.url};ws.getCell(i,4).font=font({color:{argb:'FF56A7DD'},underline:true});ws.getCell(i,4).alignment={horizontal:'left'};alt(ws,i,4);i++});
      paint(ws,i,4);ws.autoFilter={from:{row:4,column:1},to:{row:i-1,column:4}};ws.views=[{rightToLeft:true,showGridLines:false,state:'frozen',ySplit:4}]}
    const apps=[];secs.forEach(s=>sorted(inSec(s.id)).filter(isApp).forEach(l=>apps.push([s,l])));
    if(apps.length){const ws=sheet('التطبيقات',[24,34,22,22]);title(ws,'تطبيقات الجوال',4);head(ws,4,['التطبيق','الوصف','آيفون','أندرويد']);let i=5;
      apps.forEach(([s,l])=>{ws.getCell(i,1).value=l.name;ws.getCell(i,1).font=font({bold:true,color:{argb:argb(s.color)}});ws.getCell(i,2).value=l.desc||'';ws.getCell(i,2).font=font({color:{argb:MU}});
        if(l.ios){ws.getCell(i,3).value={text:'متجر آبل',hyperlink:l.ios};ws.getCell(i,3).font=font({color:{argb:'FF56A7DD'},underline:true})}
        if(l.android){ws.getCell(i,4).value={text:'متجر قوقل',hyperlink:l.android};ws.getCell(i,4).font=font({color:{argb:'FFA6C955'},underline:true})}alt(ws,i,4);i++});paint(ws,i,4)}
    if(days.length){const ws=sheet('الأيام الصحية',[20,50,20,26]);title(ws,'تقويم الأيام الصحية',4);head(ws,4,['التاريخ','المناسبة','المتبقي','ملاحظة']);let i=5;
      days.forEach(d=>{const n=daysTo(d);ws.getCell(i,1).value=d.d+' '+MONTHS[d.m-1];ws.getCell(i,1).font=font({bold:true,color:{argb:'FFFB7185'}});ws.getCell(i,2).value=d.name;ws.getCell(i,2).font=font({bold:true});ws.getCell(i,3).value=cdTxt(n);ws.getCell(i,3).font=font({color:{argb:n<=14?AC:MU}});ws.getCell(i,4).value=d.desc||'';alt(ws,i,4);i++});paint(ws,i,4)}
    const buf=await wb.xlsx.writeBuffer();await deliver(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),fileSafe('دليل-الأنظمة-'+label)+'-'+stamp()+'.xlsx');toast('تم تجهيز ملف Excel')
  }finally{b.close()}}
async function exportPDF(sc){
  const b=busy('جارٍ تجهيز ملف PDF…');
  try{await Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')]);
    try{await document.fonts.ready}catch(e){}
    const {secs,label,days}=scopeData(sc);const items=[];
    secs.forEach(s=>{const ls=sorted(inSec(s.id));if(!ls.length)return;items.push({t:'h',n:s.name,c:s.color,k:ls.length});ls.forEach(l=>items.push({t:'r',l,c:s.color}))});
    if(days.length){items.push({t:'h',n:'الأيام الصحية',c:'#FB7185',k:days.length});days.forEach(d=>items.push({t:'d',d}))}
    const W=794,H=1123,TOP=170,BOT=64,RH=40,HH=50;const pages=[];let cur=[],y=TOP;
    for(const it of items){const h=it.t==='h'?HH:RH;if(y+h>H-BOT||(it.t==='h'&&y+h+RH>H-BOT)){pages.push(cur);cur=[];y=TOP}it.y=y;cur.push(it);y+=h}
    if(cur.length)pages.push(cur);
    const root=document.createElement('div');root.style.cssText='position:fixed;top:0;left:-10000px;width:'+W+'px';document.body.appendChild(root);
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'px',format:[W,H],orientation:'portrait',hotfixes:['px_scaling']});const N=pages.length;
    const FONT="Inter,'Readex Pro',Tahoma,sans-serif";
    for(let p=0;p<N;p++){
      root.innerHTML=`<div style="width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#EEF2FF;font-family:${FONT};direction:rtl;background:radial-gradient(520px 340px at 90% 0%,#2348C0 0%,rgba(35,72,192,0) 70%),#061452">
        <div style="position:absolute;top:28px;right:30px;left:30px;height:112px;border-radius:24px;background:linear-gradient(135deg,rgba(35,72,192,.45),rgba(255,255,255,.06));border:1px solid rgba(150,180,255,.3);display:flex;align-items:center;gap:18px;padding:0 26px">
          <img src="img/logo-white.png" style="height:50px;width:160px;object-fit:contain;object-position:right center">
          <div style="width:1px;height:50px;background:rgba(150,180,255,.3)"></div>
          <div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:22px;font-weight:800">دليل الأنظمة والخدمات الصحية</b><span style="font-size:13px;color:#9AA8D8">الإدارة التنفيذية للتشغيل · ${esc(label)}</span></div>
          <div style="margin-right:auto;text-align:left;font-size:12px;color:#9AA8D8;line-height:1.8">${DF.format(new Date())}<br><span style="color:#F5A524;font-weight:700">صفحة ${p+1} من ${N}</span></div></div>
        ${pages[p].map(it=>it.t==='h'?`<div style="position:absolute;right:34px;left:34px;top:${it.y+12}px;height:30px;display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;color:${it.c}"><span style="width:12px;height:12px;border-radius:4px;background:${it.c}"></span>${esc(it.n)}<span style="font-weight:400;font-size:12px;color:#6F7FB5">${it.k}</span></div>`
          :it.t==='r'?`<div style="position:absolute;right:34px;left:34px;top:${it.y}px;height:${RH-7}px;background:rgba(255,255,255,.07);border:1px solid rgba(150,180,255,.22);border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 10px 0 14px;font-size:13px"><span style="width:24px;height:24px;border-radius:7px;background:${it.c};color:#061452;font-weight:800;display:grid;place-items:center;font-size:12px">${initial(it.l)}</span><b style="min-width:190px;font-weight:600">${esc(it.l.name)}</b><span style="color:#9AA8D8;flex:1;white-space:nowrap;overflow:hidden">${esc(it.l.desc||'')}</span><span style="direction:ltr;color:#56A7DD;font-size:12px">${isApp(it.l)?'متجر آبل · متجر قوقل':esc(host(it.l.url))}</span></div>`
          :`<div style="position:absolute;right:34px;left:34px;top:${it.y}px;height:${RH-7}px;background:rgba(255,255,255,.07);border:1px solid rgba(150,180,255,.22);border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 14px;font-size:13px"><b style="min-width:90px;color:#FB7185;font-weight:800">${it.d.d} ${MONTHS[it.d.m-1]}</b><span style="flex:1;font-weight:600">${esc(it.d.name)}</span><span style="color:#F5A524;font-size:12px">${cdTxt(daysTo(it.d))}</span></div>`).join('')}
        <div style="position:absolute;bottom:0;left:0;right:0;height:46px;border-top:1px solid rgba(150,180,255,.25);display:flex;align-items:center;justify-content:space-between;padding:0 34px;font-size:11.5px;color:#9AA8D8"><span>تجمع الطائف الصحي · الإدارة التنفيذية للتشغيل</span><b style="color:#C9D4FA;font-weight:600">إعداد وتطوير: سالم سعد الشهري</b></div></div>`;
      await Promise.all([...root.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
      const cv=await html2canvas(root.firstElementChild,{scale:2,backgroundColor:'#061452',useCORS:true,logging:false});
      if(p)pdf.addPage([W,H],'portrait');pdf.addImage(cv.toDataURL('image/jpeg',0.9),'JPEG',0,0,W,H);
      pages[p].forEach(it=>{if(it.t==='r'){const u=openUrl(it.l);if(/^https?:/.test(u))pdf.link(34,it.y,W-68,RH-7,{url:u})}});
    }
    root.remove();await deliver(pdf.output('blob'),fileSafe('دليل-الأنظمة-'+label)+'-'+stamp()+'.pdf');toast('تم تجهيز ملف PDF، الروابط فيه قابلة للضغط');
  }finally{b.close()}}

/* ---------- access, admin & log ---------- */
const API={pin:'',name:'',role:'',dev:''};
try{const p=JSON.parse(localStorage.getItem('thc-links-edit')||'{}');API.pin=p.pin||'';API.name=p.name||'';API.role=p.role||''}catch(e){}
try{API.dev=localStorage.getItem('thc-dev')||'';if(!API.dev){API.dev=uid()+uid();localStorage.setItem('thc-dev',API.dev)}}catch(e){API.dev=API.dev||uid()+uid()}
function saveApi(){try{localStorage.setItem('thc-links-edit',JSON.stringify({pin:API.pin,name:API.name,role:API.role}))}catch(e){}}
const ROLE_N={admin:'مسؤول',ops:'التشغيل'},ROLE_C={admin:'#7C8CFF',ops:'#F5A524'};
function isAdmin(){return !S.readonly&&API.role==='admin'}
function hdrs(x){return Object.assign({'x-edit-pin':API.pin,'x-device-id':API.dev,'x-editor-name':encodeURIComponent(API.name||'')},x||{})}
const ADM={data:null,err:''};
async function loadAdmin(body){try{const r=await fetch('/api/admin',body?{method:'POST',headers:hdrs({'content-type':'application/json'}),body:JSON.stringify(body)}:{headers:hdrs(),cache:'no-store'});if(!r.ok)throw r.status;ADM.data=await r.json();ADM.err=''}catch(e){ADM.err='تعذّر تحميل الرموز'}fillAdmin()}
function fillAdmin(){const el=$('#admPanel');if(!el)return;if(ADM.err){el.innerHTML=`<p class="note">${ADM.err}</p>`;return}const d=ADM.data;if(!d)return;
  el.innerHTML=`<p class="note">رمز المسؤول يقبل ${d.maxAdmins} أشخاص كحد أقصى، كل واحد على جهازه، ومعه هذا السجل. رمز التشغيل يعدّل كل شيء بدون السجل.</p>
  <div class="arow"><span class="xt"><b>رمز التشغيل</b><small>للفريق اللي يحدّث الروابط</small></span><span class="pinv tab-num">${esc(d.opsPin)}</span><button type="button" class="gbtn sm" data-copy="${esc(d.opsPin)}">نسخ</button><button type="button" class="gbtn sm" data-regen="ops">رمز جديد</button></div>
  ${d.admins.map(a=>`<div class="arow"><span class="lav" style="background:#7C8CFF">${esc((a.name||'؟').charAt(0))}</span><span class="xt"><b>${esc(a.name||'بدون اسم')}</b>${a.me?' · أنت':''}<small>${esc(a.device||'')} · آخر دخول ${a.last?DS.format(new Date(a.last))+' '+TF12.format(new Date(a.last)):'—'}</small></span>${a.me?'':`<button type="button" class="dbtn" data-rmadmin="${esc(a.id)}">إزالة</button>`}</div>`).join('')}
  <p class="note">المسؤولون: ${d.admins.length} من ${d.maxAdmins}</p>`;
  el.onclick=async e=>{const c=e.target.closest('[data-copy]');if(c){try{await navigator.clipboard.writeText(c.dataset.copy);toast('تم نسخ الرمز')}catch(err){toast('الرمز: '+c.dataset.copy)}return}
    const g=e.target.closest('[data-regen]');if(g){if(!g.classList.contains('armed')){g.classList.add('armed');g.textContent='تأكيد؟';return}await loadAdmin({action:'regen',target:'ops'});toast('تم إنشاء رمز جديد، القديم توقف');return}
    const r=e.target.closest('[data-rmadmin]');if(r){if(!r.classList.contains('armed')){r.classList.add('armed');r.textContent='تأكيد الإزالة';return}await loadAdmin({action:'removeAdmin',id:r.dataset.rmadmin});toast('تمت الإزالة')}}}
const LOG={entries:null,err:''};
async function loadLog(){try{const r=await fetch('/api/log',{headers:hdrs(),cache:'no-store'});if(!r.ok)throw r.status;LOG.entries=(await r.json()).entries||[];LOG.err=''}catch(e){LOG.err='تعذّر تحميل السجل'}fillLog()}
function fillLog(){const el=$('#logList');if(!el)return;if(LOG.err){el.innerHTML=`<p class="note">${LOG.err}</p>`;return}if(!LOG.entries)return;
  const all=LOG.entries,edits=all.filter(e=>e.action!=='دخول'),logins=all.filter(e=>e.action==='دخول'),td=DS.format(new Date());
  $('#logStats').innerHTML=[['إجمالي التعديلات',edits.length,'#56A7DD'],['تعديلات اليوم',edits.filter(e=>DS.format(new Date(e.at))===td).length,'#A6C955'],['مرات الدخول اليوم',logins.filter(e=>DS.format(new Date(e.at))===td).length,'#F5A524'],['آخر دخول',logins[0]?TF12.format(new Date(logins[0].at)):'—','#63BDC1']].map(x=>`<div style="--c:${x[2]}"><span>${x[0]}</span><b class="tab-num">${x[1]}</b></div>`).join('');
  if(!all.length){el.innerHTML=emptyBox('لا توجد سجلات بعد','');return}
  let html='',day='';
  for(const e of all.slice(0,400)){const d=DAYF.format(new Date(e.at));if(d!==day){day=d;html+=`<h3 class="lday">${d}</h3>`}
    const av=`<span class="lav" style="background:${ROLE_C[e.role]||'#8B9BCF'}">${esc((e.by||'؟').trim().charAt(0))}</span>`;
    const ac=e.action==='دخول'?'#F5A524':e.action==='حذف'?'#FB7185':e.action==='إضافة'?'#4ADE80':'#56A7DD';
    html+=`<div class="le" style="margin-bottom:8px">${av}<div class="lbody"><div class="ltop"><b>${esc(e.by)}</b><span class="lact" style="--c:${ac}">${e.action==='دخول'?'سجّل الدخول':e.action+' '+e.target}</span>${e.device?`<span class="note">${esc(e.device)}</span>`:''}<span class="t">${TF12.format(new Date(e.at))}</span></div>${e.name?`<div style="margin-top:4px;font-weight:600">${esc(e.name)}${e.fac?` <span class="note">· ${esc(e.fac)}</span>`:''}</div>`:''}${(e.changes||[]).length?`<ul class="lch">${e.changes.map(c=>`<li>${esc(c.label)}: <span class="lfrom">${esc(c.from)}</span> ← <span class="lto">${esc(c.to)}</span></li>`).join('')}</ul>`:''}</div></div>`}
  el.innerHTML=html}
async function exportLogExcel(){await loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');const wb=new ExcelJS.Workbook();const ws=wb.addWorksheet('السجل',{views:[{rightToLeft:true,state:'frozen',ySplit:1}]});
  ws.columns=[{header:'التاريخ',width:26},{header:'الوقت',width:12},{header:'الاسم',width:20},{header:'الصلاحية',width:12},{header:'الإجراء',width:20},{header:'القسم',width:24},{header:'العنصر',width:30},{header:'التفاصيل',width:60}];
  (LOG.entries||[]).forEach(e=>ws.addRow([DAYF.format(new Date(e.at)),TF12.format(new Date(e.at)),e.by,ROLE_N[e.role]||'',e.action==='دخول'?'تسجيل دخول'+(e.device?' ('+e.device+')':''):e.action+' '+e.target,e.fac||'',e.name||'',(e.changes||[]).map(c=>`${c.label}: من ${c.from} إلى ${c.to}`).join(' | ')]));
  ws.eachRow((row,i)=>row.eachCell(c=>{c.fill={type:'pattern',pattern:'solid',fgColor:{argb:i===1?'FFF5A524':i%2?'FF061452':'FF0A1A5E'}};c.font={name:'Arial',color:{argb:i===1?'FF061452':'FFEEF2FF'},bold:i===1}}));
  const buf=await wb.xlsx.writeBuffer();await deliver(new Blob([buf]),'سجل-دليل-الأنظمة-'+stamp()+'.xlsx')}
function setEdit(on){
  S.readonly=!on;
  if(!on){document.querySelectorAll('.modal').forEach(m=>m.remove());if(API.pin){API.pin='';API.role='';try{localStorage.removeItem('thc-links-edit');sessionStorage.removeItem('thc-links-sess')}catch(e){}}LOG.entries=null;ADM.data=null;if(S.view==='log')S.view='home'}
  render();
}
function loginModal(){
  modal(`<h3>الدخول لوضع التعديل</h3><p class="note">أدخل اسمك ورمز التعديل. الجهاز يتذكر الرمز فلا تحتاج تكتبه كل مرة.</p>
    <div class="f"><label for="lgName">اسمك (يظهر في السجل)</label><input id="lgName" required value="${esc(API.name)}" placeholder="اكتب اسمك"></div>
    <div class="f"><label for="lgPin">الرمز</label><input id="lgPin" required inputmode="numeric" autocomplete="off" placeholder="••••••"></div>
    <p class="note" id="lgErr" style="color:#FB7185" hidden></p>
    <div class="mrow"><span></span><span><button type="button" class="gbtn sm" data-mclose>إلغاء</button><button class="gbtn sm acc">دخول</button></span></div>`,
  (h,close)=>{setTimeout(()=>h.querySelector(API.name?'#lgPin':'#lgName').focus(),30);h.querySelector('form').onsubmit=async e=>{e.preventDefault();const name=h.querySelector('#lgName').value.trim(),pin=h.querySelector('#lgPin').value.trim();
    let ok=null;try{ok=await S.db.ping(pin,name,true)}catch(err){}
    if(!ok||ok.error){const er=h.querySelector('#lgErr');er.textContent=ok&&ok.error==='admin-full'?'اكتمل عدد المسؤولين (5 أشخاص). اطلب من مسؤول حالي يزيل أحد المسجلين.':'الرمز غير صحيح، تأكد منه وحاول مرة أخرى.';er.hidden=false;return}
    API.pin=pin;API.name=name;API.role=ok.role;saveApi();try{sessionStorage.setItem('thc-links-sess','1')}catch(err){}close();setEdit(true);toast('أهلاً '+name+'، دخلت بصلاحية '+(ROLE_N[ok.role]||''))}});
}
function apiDb(){let st=null,pending=0;
  const apply=j=>{st=j;const m=o=>Object.entries(o||{}).map(([id,d])=>({id,...d}));S.sec=m(j.sections);S.links=m(j.links);S.days=m(j.days);S.loaded=true};
  return{
    async pull(){if(pending)return;const r=await fetch('/api/data',{cache:'no-store'});if(!r.ok)throw new Error('load');const j=await r.json();S.sync={ok:true,at:Date.now()};if(pending)return;if(!st||j.rev!==st.rev){apply(j);if(!document.querySelector('.modal'))render()}},
    async send(o){pending++;try{const r=await fetch('/api/data',{method:'POST',headers:hdrs({'content-type':'application/json'}),body:JSON.stringify(o)});
      if(r.status===401){setEdit(false);throw {code:'permission_denied'}}
      if(r.status===403){let j={};try{j=await r.json()}catch(e){}if(j.error==='admin-not-registered'){setEdit(false);toast('سجّل الدخول مرة ثانية برمز المسؤول')}throw {code:'forbidden'}}
      if(r.status===400)throw {code:'bad url'};if(!r.ok)throw {code:'error'};st=await r.json()}finally{pending--}},
    async ping(pin,name,login){const r=await fetch('/api/data',{method:'POST',headers:{'content-type':'application/json','x-edit-pin':pin,'x-device-id':API.dev,'x-editor-name':encodeURIComponent(name||'')},body:JSON.stringify({op:'ping',login:!!login})});let j={};try{j=await r.json()}catch(e){}if(!r.ok)return {error:j.error||'pin'};return {role:j.role}}
  }}
async function useSnapshot(){try{const s=await (await fetch('/seed.json',{cache:'no-store'})).json();const m=o=>Object.entries(o||{}).map(([id,d])=>({id,...d}));S.sec=m(s.sections);S.links=m(s.links);S.days=m(s.days)}catch(e){}
  S.loaded=true;S.readonly=true;S.sync={ok:false,at:Date.now()};render()}
async function start(){
  const db=apiDb();S.db=db;render();
  try{await db.pull()}catch(e){await useSnapshot();return}
  S.readonly=!API.pin;render();
  if(API.pin){let seen=false;try{seen=sessionStorage.getItem('thc-links-sess')==='1'}catch(e){}
    if(!seen)db.ping(API.pin,API.name,true).then(r=>{if(!r||r.error){setEdit(false);return}try{sessionStorage.setItem('thc-links-sess','1')}catch(e){}if(r.role!==API.role){API.role=r.role;saveApi();render()}}).catch(()=>{})}
  setInterval(()=>{if(document.visibilityState==='visible')db.pull().catch(()=>{S.sync={ok:false,at:Date.now()};if(!document.querySelector('.modal'))render()})},30000);
}
start();
})();
</script>
</body></html>
