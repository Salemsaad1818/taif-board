<script>
(function(){
const APP_V='__V__';
const PORTAL='https://taif-ops.vercel.app/?back=1';
const FORM='https://forms.gle/us3hgom7yADd3Goh7';
const GCAL='https://calendar.google.com/calendar/embed?mode=AGENDA&showPrint=0&showTz=0&showCalendars=1&ctz=Asia%2FRiyadh&src=thi8lfa3o57nf0enn1iitcnsbc%40group.calendar.google.com&color=%2342d692&src=ar.saudiarabian%23holiday%40group.v.calendar.google.com&color=%2316a765';
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const PALETTE=['#007AFF','#30B0C7','#FF9500','#34C759','#5856D6','#FF2D55','#AF52DE','#A2845E','#8E8E93'];
const DAY_C='#FF3B30';
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
back:sv('<path d="m9 5 7 7-7 7"/>',2.4),
 plus:sv('<path d="M12 5v14M5 12h14"/>',2.2),
 portal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>',
 pa:'<svg class="pa" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
 ios:'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11.2 8.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.6-2.3.6-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.6-1.1 1.9-.3 4.6.8 6.1.5.7 1.1 1.6 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5c.8 0 1.3-.8 1.8-1.5.6-.8.8-1.6.8-1.7 0 0-1.6-.6-1.6-2.6ZM9.7 3.9c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.8Z"/></svg>',
 gp:'<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2.5 1.6c-.2.2-.3.5-.3.8v11.2c0 .3.1.6.3.8L8.8 8 2.5 1.6Zm7.1 5.6 1.8-1.8L4 1.2l5.6 6Zm0 1.6L4 14.8l7.4-4.2-1.8-1.8Zm4-2-1.9-1.1L9.7 8l2 2 1.9-1.1c.5-.3.5-1.1 0-1.1Z"/></svg>'
};
const secIcon=id=>IC[id]||(id==='phones'?sv(LI.phone,1.9):IC.link);

const S={sec:[],links:[],days:[],view:'home',sid:'',q:'',fav:[],recent:[],theme:'dark',readonly:true,loaded:false,db:null,sync:{ok:true,at:0}};
try{const p=JSON.parse(localStorage.getItem('thc-links2')||'{}');Object.assign(S,{view:p.view||'home',sid:p.sid||'',fav:Array.isArray(p.fav)?p.fav:[],recent:Array.isArray(p.recent)?p.recent:[],theme:p.theme||((window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light')})}catch(e){}
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
function host(u){if(/^tel:/i.test(u||''))return String(u).slice(4);try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}}
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

/* ---------- brand: «وِجهة» ---------- */
const BRAND='وِجهة',TAG='دليل الموظف الصحي';
function mark(id){id=id||'m'+Math.random().toString(36).slice(2,6);return `<svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A84FF"/><stop offset="1" stop-color="#5E5CE6"/></linearGradient></defs><rect x="2" y="2" width="44" height="44" rx="14" fill="url(#${id})"/><rect x="2.5" y="2.5" width="43" height="43" rx="13.5" fill="none" stroke="#fff" stroke-opacity=".35"/><path d="M24 7.5 28.6 19.4 40.5 24 28.6 28.6 24 40.5 19.4 28.6 7.5 24 19.4 19.4Z" fill="#fff"/><path d="M24 7.5 28.6 19.4 24 24 19.4 19.4Z" fill="#FF9F0A"/><circle cx="24" cy="24" r="6.2" fill="#1D2B7A"/><path d="M22.9 20.6h2.2v2.3h2.3v2.2h-2.3v2.3h-2.2v-2.3h-2.3v-2.2h2.3z" fill="#fff"/></svg>`}
const MARK_DATA='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A84FF"/><stop offset="1" stop-color="#5E5CE6"/></linearGradient></defs><rect x="2" y="2" width="44" height="44" rx="14" fill="url(#g)"/><path d="M24 7.5 28.6 19.4 40.5 24 28.6 28.6 24 40.5 19.4 28.6 7.5 24 19.4 19.4Z" fill="#fff"/><path d="M24 7.5 28.6 19.4 24 24 19.4 19.4Z" fill="#FF9F0A"/><circle cx="24" cy="24" r="6.2" fill="#1D2B7A"/><path d="M22.9 20.6h2.2v2.3h2.3v2.2h-2.3v2.3h-2.2v-2.3h-2.3v-2.2h2.3z" fill="#fff"/></svg>');
const brand=()=>`${mark()}<div class="bt"><b>${BRAND}</b><span>${TAG}</span></div>`;

/* ---------- link icons ---------- */
const LI={
 building:'<path d="M4 20V8l8-4 8 4v12M9 20v-5h6v5M9 10h.01M12 10h.01M15 10h.01"/>',
 grid:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
 key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2M14 9l2 2"/>',
 mail:'<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
 pen:'<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="M13 7l4 4"/>',
 user:'<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
 users:'<circle cx="9" cy="9" r="3.4"/><path d="M3 19.5a6 6 0 0 1 12 0"/><path d="M15.5 5.6a3.4 3.4 0 0 1 0 6.8M17 13.6a6 6 0 0 1 4 5.9"/>',
 headset:'<path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2"/><rect x="3.5" y="13" width="4" height="6" rx="1.5"/><rect x="16.5" y="13" width="4" height="6" rx="1.5"/><path d="M18.5 19c0 1.5-2 2.5-5 2.5"/>',
 layers:'<path d="m12 4 8.5 4.5L12 13 3.5 8.5Z"/><path d="m3.5 12.5 8.5 4.5 8.5-4.5M3.5 16.5 12 21l8.5-4.5"/>',
 badge:'<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><circle cx="9" cy="11" r="2.2"/><path d="M5.8 16a3.4 3.4 0 0 1 6.4 0M14 10h4M14 13.5h3"/>',
 file:'<path d="M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8Z"/><path d="M14 3.5V8h4.5M9 13h6M9 16.5h4"/>',
 transfer:'<path d="M4 8h14m-4-4 4 4-4 4M20 16H6m4-4-4 4 4 4"/>',
 phone:'<path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2"/>',
 pill:'<rect x="3" y="8.5" width="18" height="7" rx="3.5" transform="rotate(-45 12 12)"/><path d="m9.5 9.5 5 5"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M21 20H3"/>',
 syringe:'<path d="m18 3 3 3M16.5 4.5l3 3M19 6l-9.5 9.5-3-3L16 3M9.5 15.5 6 19l-1-1M7.5 11.5l2 2M10 9l2 2"/>',
 smile:'<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>',
 alert:'<path d="M12 4 21 19.5H3Z"/><path d="M12 10v4.5M12 17h.01"/>',
 ban:'<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>',
 award:'<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/>',
 shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
 drop:'<path d="M12 3.5s6.5 7 6.5 11a6.5 6.5 0 0 1-13 0c0-4 6.5-11 6.5-11Z"/>',
 hand:'<path d="M12 20s-6-3.7-6-8.2A3.3 3.3 0 0 1 12 10a3.3 3.3 0 0 1 6 1.8c0 4.5-6 8.2-6 8.2Z"/><path d="M12 6V3M8.5 6.5 7 4M15.5 6.5 17 4"/>',
 ambulance:'<path d="M3 16.5V8h11v8.5M14 11h4l3 3v2.5h-7"/><circle cx="7" cy="17.5" r="2"/><circle cx="17" cy="17.5" r="2"/><path d="M8.5 10.2v3.6M6.7 12h3.6"/>',
 book:'<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6"/>',
 globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5Z"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
 cloud:'<path d="M7 18.5h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.2A3.4 3.4 0 0 0 7 18.5Z"/>',
 translate:'<path d="M4 6h9M8.5 4v2M6 6c.5 3 2.5 5.5 5 7M11 6c-.5 3-3 6-6 7.5M12.5 20l4-9 4 9M14 17h5"/>',
 money:'<rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v5M17.5 9.5v5"/>',
 ruler:'<rect x="2.5" y="8" width="19" height="8" rx="1.8"/><path d="M6.5 8v3M10 8v4M13.5 8v3M17 8v4"/>',
 chat:'<path d="M4 18.5 5.3 15A7.5 7.5 0 1 1 8.8 18Z"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
};
const DEF_IC={systems:'grid',orgs:'building',refs:'book',apps:'phone',tools:'grid',phones:'phone'};
function licon(l){const k=l.icon&&LI[l.icon]?l.icon:(DEF_IC[l.sid]||'link');return sv(LI[k],1.9)}

const NF=new Intl.NumberFormat('en-US');
function hitsTxt(){return S.hits?NF.format(S.hits):''}
const EYE=sv('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>');
/* ---------- shell ---------- */
function syncDot(){return `<i style="background:${S.sync.ok?'#22C55E':'#F43F5E'}"></i>`}
function syncTxt(){return S.sync.at?(S.sync.ok?'متزامن':'تعذّر التحديث'):'جارٍ الاتصال…'}
function navItems(){
  const it=[{v:'home',t:'الرئيسية',ic:IC.home}];
  secsSorted().forEach(s=>it.push({v:'sec',sid:s.id,t:s.name,c:s.color,n:inSec(s.id).length,ic:secIcon(s.id)}));
  it.push({v:'days',t:'الأيام الصحية',ic:IC.cal,n:S.days.length});
  it.push({v:'fav',t:'المفضلة',ic:IC.star,n:favList().length});
  if(isAdmin())it.push({v:'log',t:'السجل والرموز',ic:IC.log});
  return it}
const isOn=x=>x.v===S.view&&(x.v!=='sec'||x.sid===S.sid)&&!S.q.trim();
function favList(){return S.fav.map(id=>S.links.find(l=>l.id===id)).filter(Boolean)}
function side(){
  const its=navItems();
  const item=x=>`<button class="s-it" data-go="${x.v}"${x.sid?` data-sid="${x.sid}"`:''} aria-pressed="${isOn(x)}" style="--c:${x.c||'var(--acc)'}"><span class="s-ic">${x.ic}</span><span>${esc(x.t)}</span>${x.n!=null?`<em class="tab-num">${x.n}</em>`:''}</button>`;
  return `<div class="s-id">${brand()}</div>
  ${!S.readonly?`<div class="s-user"><span class="s-av">${esc((API.name||'؟').trim().charAt(0))}</span><div><b>${esc(API.name)}</b><small>${ROLE_N[API.role]||''} · وضع التعديل</small></div></div>`:''}
  <nav class="s-nav">${item(its[0])}<div class="s-lbl">الأقسام</div>${its.filter(x=>x.v==='sec').map(item).join('')}<div class="s-lbl">أدوات</div>${its.filter(x=>x.v!=='sec'&&x.v!=='home').map(item).join('')}</nav>
  <div class="s-act">
    <button class="s-btn" data-act="export">${IC.dl}<span>تصدير PDF / Excel</span></button>
    <a class="s-btn" href="${FORM}" target="_blank" rel="noopener" style="text-decoration:none">${IC.msg}<span>للملاحظات والاستفسارات</span></a>
    <button class="s-btn" data-act="share">${IC.ext}<span>مشاركة وِجهة</span></button>
    <button class="s-btn" data-act="edit">${S.readonly?IC.pen:IC.out}<span>${S.readonly?'دخول التعديل':'إنهاء التعديل'}</span></button>
    <button class="s-btn" data-act="theme">${S.theme==='light'?IC.moon:IC.sun}<span>${S.theme==='light'?'الوضع الداكن':'الوضع الفاتح'}</span></button>
  </div>
  <div class="s-foot">${S.hits?`<span class="s-hits">${EYE}<b class="tab-num">${hitsTxt()}</b> زيارة للموقع</span>`:''}<span>${syncDot()}${syncTxt()} · النسخة ${APP_V}</span><b>إعداد وتطوير: سالم سعد الشهري</b></div>`}
function header(){return `<div class="id">${brand()}</div>
  <div class="acts"><a class="ibtn" href="${FORM}" target="_blank" rel="noopener" aria-label="للملاحظات والاستفسارات">${IC.msg}</a><button class="ibtn${S.readonly?'':' on'}" data-act="edit" aria-label="${S.readonly?'دخول التعديل':'إنهاء التعديل'}">${S.readonly?IC.pen:IC.out}</button><button class="ibtn" data-act="theme" aria-label="تبديل الثيم">${S.theme==='light'?IC.moon:IC.sun}</button></div>`}
function tabbar(){const t=[['home','الرئيسية',IC.home],['all','الأقسام',IC.tools],['days','الأيام الصحية',IC.cal],['fav','المفضلة',IC.star]];
  const on=v=>!S.q.trim()&&(S.view===v||(v==='all'&&S.view==='sec'));
  return t.map(([v,n,ic])=>`<button data-go="${v}" aria-pressed="${on(v)}">${ic}<span>${n}</span></button>`).join('')+(isAdmin()?`<button data-go="log" aria-pressed="${!S.q.trim()&&S.view==='log'}">${IC.log}<span>السجل</span></button>`:'')}
function footer(){return `<span style="display:flex;flex-direction:column;gap:6px"><span>${BRAND} · ${TAG}</span><b>إعداد وتطوير: سالم سعد الشهري © 2026</b><span class="sy">${syncDot()}${syncTxt()} <span style="opacity:.5">|</span> النسخة ${APP_V}${S.hits?` <span style="opacity:.5">|</span> ${hitsTxt()} زيارة`:''}</span></span><span style="display:flex;gap:16px;flex-wrap:wrap"><button class="lnk" data-act="share">مشاركة وِجهة</button><a class="lnk" href="${FORM}" target="_blank" rel="noopener">للملاحظات والاستفسارات ↗</a></span>`}

/* ---------- pieces ---------- */
function linkRow(l){const s=secOf(l),f=S.fav.includes(l.id),h=host(l.url);
  return `<div class="lk" style="--c:${s.color}" data-id="${esc(l.id)}">
    <span class="ic">${licon(l)}</span>
    <a class="tx" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}"><b>${esc(l.name)}</b>${l.desc?`<small>${esc(l.desc)}</small>`:''}${!isApp(l)&&h&&!/^tel:/i.test(l.url)?`<em>${esc(h)}</em>`:''}</a>
    ${isApp(l)?`<span class="stores">${l.ios?`<a href="${esc(l.ios)}" target="_blank" rel="noopener" data-open="${esc(l.id)}" aria-label="متجر آبل">${IC.ios}<span>آيفون</span></a>`:''}${l.android?`<a href="${esc(l.android)}" target="_blank" rel="noopener" data-open="${esc(l.id)}" aria-label="متجر قوقل">${IC.gp}<span>أندرويد</span></a>`:''}</span>`:''}
    <button class="star" data-fav="${esc(l.id)}" aria-pressed="${f}" aria-label="${f?'إزالة من المفضلة':'تثبيت في المفضلة'}">${f?'★':'☆'}</button>
    <span class="pen">تعديل</span>
  </div>`}
function appTile(l){const s=secOf(l);return `<a class="qa" style="--c:${s.color}" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}"><span class="qi">${licon(l)}</span><b>${esc(l.name)}</b></a>`}
function miniRow(l){const s=secOf(l);return `<a class="mr" style="--c:${s.color}" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}"><span class="mi">${licon(l)}</span><span class="mt"><b>${esc(l.name)}</b>${l.desc?`<small>${esc(l.desc)}</small>`:''}</span><span class="ma">${IC.ext}</span></a>`}
function dayRow(d){return `<div class="dr" data-day="${esc(d.id)}"><span class="dbad"><b class="tab-num">${+d.d}</b><small>${MONTHS[(+d.m||1)-1]}</small></span><span class="xt">${esc(d.name)}${d.desc?`<small>${esc(d.desc)}</small>`:''}</span>${cdChip(d)}</div>`}
function emptyBox(t,s,btn){return `<div class="empty2"><b>${t}</b><span>${s}</span>${btn||''}</div>`}
function secChips(){return `<div class="schips">${secsSorted().map(s=>`<button class="sc" style="--c:${s.color}" data-go="sec" data-sid="${s.id}" aria-pressed="${S.view==='sec'&&S.sid===s.id}"><span class="si">${secIcon(s.id)}</span>${esc(s.name)}<em class="tab-num">${inSec(s.id).length}</em></button>`).join('')}</div>`}
function greet(){const h=+new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:'Asia/Riyadh'}).format(new Date());return h<12?'صباح الخير':'مساء الخير'}
function sbar(){
  const home=S.view==='home'&&!S.q.trim();
  return `<div class="sbar${home?' big':''}">
    ${home?`<div class="gr"><span class="pills"><span class="pill2"><i></i>${DAYF.format(new Date())}</span>${S.hits?`<span class="pill2 hits" id="hitsPill">${EYE}<b class="tab-num">${hitsTxt()}</b> زيارة</span>`:''}</span><h1><span id="greet">${greet()}</span>، وش تبي توصل له اليوم؟</h1><p>${S.links.length} رابطاً لأنظمة الوزارة والجهات الصحية والمراجع والتطبيقات، في مكان واحد.</p></div>`:''}
    <div class="srow"><label class="search">${IC.search}<input id="q" type="search" placeholder="ابحث: البريد، موارد، حصن، صحتي…" value="${esc(S.q)}" autocomplete="off" enterkeyhint="search"></label><button class="gbtn mob-x" data-act="export" aria-label="تصدير">${IC.dl}<span>تصدير</span></button></div>
  </div>`}
const DEFAULT_QUICK=['apps-11','systems-2','systems-4','systems-8','systems-7','systems-6','systems-15','systems-18','apps-1','systems-16','systems-1','phones-1'];

let deferredPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if(S.view==='home')renderMain()});
function standalone(){return (window.matchMedia&&matchMedia('(display-mode: standalone)').matches)||navigator.standalone===true}
function installTip(){let off=false;try{off=localStorage.getItem('wjh-tip')==='off'}catch(e){}
  if(off||standalone()||window.innerWidth>=1000)return '';
  const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);
  return `<div class="tip"><span class="tipi">${mark('tm')}</span><div class="tipt"><b>ثبّت وِجهة على شاشتك الرئيسية</b><span>${deferredPrompt?'تفتح مثل التطبيق بضغطة وحدة.':ios?'في سفاري اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».':'من قائمة المتصفح اختر «إضافة إلى الشاشة الرئيسية».'}</span></div>${deferredPrompt?'<button class="gbtn sm acc" data-act="install">تثبيت</button>':''}<button class="tipx" data-act="tipoff" aria-label="إخفاء">✕</button></div>`}
async function shareSite(){const d={title:'وِجهة · دليل الموظف الصحي',text:'كل الروابط اللي يحتاجها الموظف الصحي في مكان واحد',url:location.origin};
  try{if(navigator.share){await navigator.share(d);return}}catch(e){return}
  try{await navigator.clipboard.writeText(d.url);toast('تم نسخ رابط الموقع')}catch(e){toast(d.url)}}
function folder(s){const ls=sorted(inSec(s.id));const four=ls.slice(0,4);
  return `<button class="fold" style="--c:${s.color}" data-go="sec" data-sid="${s.id}"><span class="f4">${four.map(l=>`<span class="fi" style="--c:${s.color}">${licon(l)}</span>`).join('')}${four.length<4?Array(4-four.length).fill('<span class="fi e"></span>').join(''):''}</span><span class="fn"><span class="si">${secIcon(s.id)}</span><b>${esc(s.name)}</b></span><small>${ls.length} ${ls.length===1?'رابط':ls.length===2?'رابطان':ls.length<=10?'روابط':'رابطاً'}</small></button>`}
/* ---------- views ---------- */
function vHome(){
  const favs=favList();
  const quick=(favs.length?favs:DEFAULT_QUICK.map(id=>S.links.find(l=>l.id===id)).filter(Boolean)).slice(0,12);
  const rec=S.recent.map(id=>S.links.find(l=>l.id===id)).filter(Boolean).filter(l=>!quick.includes(l)).slice(0,6);
  const nd=daysSorted().slice(0,4);
  return `${installTip()}<section class="block"><div class="bh"><h2>${favs.length?'★ مفضلتك':'الوصول السريع'}</h2><span>${favs.length?'روابطك المثبّتة':'ثبّت أي رابط بالنجمة ☆ ليظهر هنا مكانها'}</span></div>
    <div class="qgrid">${quick.map(appTile).join('')}</div></section>
  ${rec.length?`<section class="block"><div class="bh"><h2>آخر ما فتحت</h2></div><div class="qgrid sm">${rec.map(appTile).join('')}</div></section>`:''}
  <section class="block"><div class="bh"><h2>الأقسام</h2><span class="ed-only"><button class="gbtn sm" data-act="addSec">${IC.plus}قسم جديد</button></span></div>
  <div class="lib">${secsSorted().map(folder).join('')}</div></section>
  <section class="block"><div class="bh"><h2>الأيام الصحية القادمة</h2><button class="lnk" data-go="days">التقويم كامل ←</button></div>
    <div class="dstrip">${nd.map(d=>{const n=daysTo(d);return `<button class="dcard${n<=14?' soon':''}" data-go="days"><span class="dbad"><b class="tab-num">${+d.d}</b><small>${MONTHS[d.m-1]}</small></span><b>${esc(d.name)}</b>${cdChip(d)}</button>`}).join('')}</div></section>`}
function vAll(){return `<div class="sh"><div><h2>الأقسام</h2><p>اختر القسم اللي تبيه</p></div><div class="acts ed-only"><button class="gbtn sm" data-act="addSec">${IC.plus}قسم جديد</button></div></div>
  <div class="lib">${secsSorted().map(folder).join('')}</div>`}
function vSec(){
  const s=S.sec.find(x=>x.id===S.sid);if(!s){S.view='home';return vHome()}
  const ls=sorted(inSec(s.id));
  return `<button class="back" data-go="all">${IC.back}الأقسام</button><div class="sh" style="--c:${s.color}"><div><h2><span class="si big">${secIcon(s.id)}</span>${esc(s.name)}</h2><p>${ls.length} رابط${s.id==='apps'?' · لكل تطبيق زر للآيفون وزر للأندرويد':' · اضغط الاسم للفتح، والنجمة للتثبيت'}</p></div>
    <div class="acts ed-only"><button class="gbtn sm" data-act="editSec" data-sid="${s.id}">${IC.pen}تعديل القسم</button><button class="gbtn sm acc" data-act="addLink" data-sid="${s.id}">${IC.plus}رابط جديد</button></div></div>
  ${ls.length?`<div class="lgrid${ls.some(isApp)?' apps':''}">${ls.map(linkRow).join('')}</div>`:emptyBox('لا توجد روابط في هذا القسم','',S.readonly?'':`<button class="gbtn sm acc" data-act="addLink" data-sid="${s.id}">${IC.plus}أضف أول رابط</button>`)}`}
function vSearch(){const q=S.q.trim();const res=S.links.filter(l=>matchQ(l,q));
  const groups=secsSorted().map(s=>({s,ls:sorted(res.filter(l=>l.sid===s.id))})).filter(g=>g.ls.length);
  return `<div class="sh"><div><h2>نتائج البحث</h2><p>${res.length} نتيجة لـ «${esc(q)}»</p></div><div class="acts"><button class="gbtn sm" data-act="clearq">مسح البحث</button></div></div>
  ${groups.length?groups.map(g=>`<div class="grp" style="--c:${g.s.color}"><div class="gh"><span class="si">${secIcon(g.s.id)}</span><b>${esc(g.s.name)}</b><span>${g.ls.length}</span></div><div class="lgrid${g.ls.some(isApp)?' apps':''}">${g.ls.map(linkRow).join('')}</div></div>`).join(''):emptyBox('ما لقينا شيء','جرّب كلمة ثانية، مثل اسم النظام أو الجهة.')}`}
function vFav(){const ls=favList();
  return `<div class="sh" style="--c:#FACC15"><div><h2><span class="si big" style="--c:#FACC15">${IC.star}</span>المفضلة</h2><p>تُحفظ على جهازك، وتظهر أول شيء في الرئيسية</p></div></div>
  ${ls.length?`<div class="lgrid">${ls.map(linkRow).join('')}</div>`:emptyBox('ما عندك مفضلة بعد','اضغط النجمة ☆ بجانب أي رابط عشان يظهر هنا وفي أعلى الصفحة الرئيسية.','<button class="gbtn sm acc" data-go="all">تصفّح الأقسام</button>')}`}
function vDays(){const cm=TODAY.getMonth()+1;const order=[...Array(12)].map((_,i)=>((cm-1+i)%12)+1);
  return `<div class="sh"><div><h2><i style="--c:${DAY_C}"></i>تقويم الأيام الصحية</h2><p>${S.days.length} مناسبة صحية عالمية · مرتبة من الشهر الحالي</p></div><div class="acts ed-only"><button class="gbtn sm acc" data-act="addDay">${IC.plus}يوم صحي</button></div></div>
  <div class="mgrid">${order.map(m=>{const list=S.days.filter(d=>+d.m===m).sort((a,b)=>a.d-b.d);if(!list.length&&m!==cm)return '';
    return `<div class="card mon${m===cm?' cur':''}"><h3><span style="display:flex;align-items:center;gap:8px"><i></i>${MONTHS[m-1]}</span><small>${m===cm?'الشهر الحالي · ':''}${list.length} مناسبة</small></h3><div class="dlist">${list.map(dayRow).join('')||'<p class="note">لا توجد مناسبات.</p>'}</div></div>`}).join('')}</div>
  <div class="card gcal"><h3>تقويم قوقل للأيام الصحية <a class="lnk" href="${GCAL}" target="_blank" rel="noopener">فتح ↗</a></h3><iframe src="${GCAL}" loading="lazy" title="تقويم الأيام الصحية العالمية"></iframe></div>`}
function vLog(){return `<div class="sh"><div><h2>السجل والرموز</h2><p>كل دخول وكل تعديل على الدليل، للمسؤولين فقط.</p></div><div class="acts"><button class="gbtn sm" data-act="logRef">تحديث</button><button class="gbtn sm" data-act="logX">${IC.dl}تصدير Excel</button></div></div>
  <div class="card"><h3>رموز الدخول</h3><div id="admPanel"><p class="note">جارٍ التحميل…</p></div></div>
  <div class="k4" id="logStats"></div><div id="logList"><p class="note">جارٍ تحميل السجل…</p></div>`}

/* ---------- render ---------- */
let lastSbar='';
function render(){
  $('#side').innerHTML=side();$('#hd').innerHTML=header();$('#tabbar').innerHTML=tabbar();$('#ft').innerHTML=footer();
  const key=(S.view==='home'&&!S.q.trim()?'h':'c')+S.links.length+':'+(S.hits||0);
  if(!$('#q')||lastSbar!==key){const had=document.activeElement&&document.activeElement.id==='q';$('#sbarw').innerHTML=sbar();lastSbar=key;if(had){const q=$('#q');q.focus();q.setSelectionRange(q.value.length,q.value.length)}}
  $('#eb').hidden=S.readonly;$('#ebName').textContent=(API.name||'')+' ('+(ROLE_N[API.role]||'')+')';
  document.body.classList.toggle('editing',!S.readonly);
  renderMain();
}
function renderMain(){const m=$('#main');
  if(!S.loaded){m.innerHTML='<div class="empty2"><div class="spin" style="margin:auto"></div><span>جارٍ تحميل الدليل…</span></div>';return}
  if(S.view==='log'&&!isAdmin())S.view='home';
  if(S.q.trim()){m.innerHTML=vSearch();return}
  if(S.view==='log'){if(!$('#logStats')){m.innerHTML=vLog();loadAdmin();LOG.entries?fillLog():loadLog()}return}
  m.innerHTML=S.view==='sec'?vSec():S.view==='all'?vAll():S.view==='days'?vDays():S.view==='fav'?vFav():vHome();
  const sc=m.querySelector('.sc[aria-pressed="true"]');if(sc&&sc.parentElement){const p=sc.parentElement;p.scrollLeft=sc.offsetLeft-(p.clientWidth-sc.clientWidth)/2}
}
function go(v,sid){S.view=v;S.sid=sid||'';S.q='';const q=$('#q');if(q)q.value='';remember();render();window.scrollTo({top:0,behavior:'smooth'})}

/* ---------- link drawer ---------- */
let openId=null;
function modal(html,bind){const h=document.createElement('div');h.className='modal';h.innerHTML=`<div class="scrim" data-mclose></div><form class="box">${html}</form>`;document.body.appendChild(h);h.addEventListener('click',e=>{if(e.target.closest('[data-mclose]')){h.remove();if(h.dataset.link)openId=null}});bind(h,()=>{h.remove();openId=null});return h}
function linkModal(id){
  const l=S.links.find(x=>x.id===id);if(!l)return;openId=id;
  const h=modal(`<div class="mrow"><h3>تعديل الرابط</h3><span class="savepill" id="savePill">${SAVE_TXT.idle}</span></div>
    <div class="f"><label for="dName">الاسم</label><input id="dName" value="${esc(l.name)}"></div>
    <div class="f"><label>الأيقونة</label><div class="icpick" style="--c:${secOf(l).color}">${Object.keys(LI).map(k=>`<button type="button" data-ic="${k}" aria-pressed="${(l.icon||DEF_IC[l.sid]||'link')===k}">${sv(LI[k],1.9)}</button>`).join('')}</div></div>
    <div class="f2"><div class="f"><label for="dSec">القسم</label><select id="dSec">${secsSorted().map(x=>`<option value="${x.id}"${x.id===l.sid?' selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
    <div class="f"><label for="dOrder">الترتيب</label><input id="dOrder" type="number" inputmode="numeric" value="${esc(l.order??'')}"></div></div>
    <div class="f"><label for="dUrl">الرابط</label><input id="dUrl" type="url" dir="ltr" value="${esc(l.url)}" placeholder="https://"></div>
    <div class="f"><label for="dDesc">وصف مختصر</label><input id="dDesc" value="${esc(l.desc||'')}"></div>
    <div class="f"><label for="dIos">رابط متجر آبل (للتطبيقات فقط)</label><input id="dIos" type="url" dir="ltr" value="${esc(l.ios||'')}"></div>
    <div class="f"><label for="dAnd">رابط متجر قوقل (للتطبيقات فقط)</label><input id="dAnd" type="url" dir="ltr" value="${esc(l.android||'')}"></div>
    <p class="note">كل تغيير يُحفظ تلقائياً عند الخروج من الخانة. الروابط تبدأ بـ https://</p>
    <div class="mrow"><button type="button" class="dbtn" id="delLink">حذف الرابط</button><span><a class="gbtn sm" href="${esc(openUrl(l))}" target="_blank" rel="noopener" style="text-decoration:none">فتح ↗</a><button class="gbtn sm acc">تم</button></span></div>`,
  (h,close)=>{const upd=(k,v)=>{if(String(l[k]??'')===String(v))return;if(['url','ios','android'].includes(k)&&v&&!/^(https?:\/\/|tel:[0-9+]+$)/i.test(v)){toast('الرابط لازم يبدأ بـ https://');return}write('links',l.id,'update',{[k]:v})};
    h.querySelector('#dName').onchange=e=>upd('name',e.target.value.trim()||'رابط');
    h.querySelectorAll('[data-ic]').forEach(btn=>btn.onclick=()=>{h.querySelectorAll('[data-ic]').forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));upd('icon',btn.dataset.ic)});
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
  const id=uid();write('links',id,'set',{sid,name:'رابط جديد',url:'https://',desc:'',ios:'',android:'',icon:DEF_IC[sid]||'link',order:inSec(sid).length+1});
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
function setTheme(t){S.theme=t;document.documentElement.setAttribute('data-theme',t);const m=document.querySelector('meta[name=theme-color]');if(m)m.content=t==='light'?'#F2F2F7':'#000000';remember();render()}

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
    else if(k==='share')shareSite();
    else if(k==='install'){if(deferredPrompt){deferredPrompt.prompt();deferredPrompt.userChoice.finally(()=>{deferredPrompt=null;renderMain()})}}
    else if(k==='tipoff'){try{localStorage.setItem('wjh-tip','off')}catch(e){}renderMain()}
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
    const BG='FF1C1C1E',PN='FF2C2C2E',ALT='FF242426',FG='FFFFFFFF',MU='FF98989F',AC='FF0A84FF';
    const argb=c=>'FF'+String(c).replace('#','').toUpperCase();
    const font=o=>Object.assign({name:'Arial',color:{argb:FG},size:11},o||{});
    const sheet=(n,cols)=>{const ws=wb.addWorksheet(n,{views:[{rightToLeft:true,showGridLines:false}]});ws.columns=cols.map(w=>({width:w}));return ws};
    const paint=(ws,rows,cols)=>{for(let r=1;r<=rows;r++)for(let c=1;c<=cols;c++){const cell=ws.getCell(r,c);if(!cell.fill)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:BG}};if(!cell.font)cell.font=font()}};
    const title=(ws,t,cols)=>{ws.mergeCells(1,1,1,cols);const c=ws.getCell(1,1);c.value=t;c.font=font({size:18,bold:true});ws.getRow(1).height=34;c.alignment={horizontal:'right',vertical:'middle'};
      ws.mergeCells(2,1,2,cols);const s=ws.getCell(2,1);s.value=`${BRAND} · ${TAG} · ${label} · ${DF.format(new Date())}`;s.font=font({color:{argb:MU}});s.alignment={horizontal:'right'}};
    const head=(ws,r,hs)=>{hs.forEach((h,i)=>{const c=ws.getCell(r,i+1);c.value=h;c.font=font({bold:true,color:{argb:'FFFFFFFF'}});c.fill={type:'pattern',pattern:'solid',fgColor:{argb:AC}};c.alignment={horizontal:'right',vertical:'middle'}});ws.getRow(r).height=26};
    const alt=(ws,i,n)=>{if(i%2===0)for(let c=1;c<=n;c++)ws.getCell(i,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:ALT}}};
    const s1=sheet('الملخص',[34,16,46]);title(s1,BRAND+' · '+TAG,3);head(s1,4,['القسم','عدد الروابط','أبرز الروابط']);let r=5;
    secs.forEach(s=>{const ls=sorted(inSec(s.id));s1.getCell(r,1).value=s.name;s1.getCell(r,1).font=font({bold:true,color:{argb:argb(s.color)}});s1.getCell(r,2).value=ls.length;s1.getCell(r,2).font=font({bold:true,size:13,color:{argb:AC}});s1.getCell(r,3).value=ls.slice(0,4).map(l=>l.name).join('، ');s1.getCell(r,3).font=font({color:{argb:MU}});alt(s1,r,3);r++});
    if(days.length){s1.getCell(r,1).value='الأيام الصحية';s1.getCell(r,1).font=font({bold:true,color:{argb:argb(DAY_C)}});s1.getCell(r,2).value=days.length;s1.getCell(r,2).font=font({bold:true,size:13,color:{argb:AC}});s1.getCell(r,3).value='القادم: '+days[0].name+' ('+days[0].d+' '+MONTHS[days[0].m-1]+')';alt(s1,r,3);r++}
    r++;s1.mergeCells(r,1,r,3);s1.getCell(r,1).value='إعداد وتطوير: سالم سعد الشهري';s1.getCell(r,1).font=font({color:{argb:MU}});paint(s1,r,3);
    const web=[];secs.forEach(s=>sorted(inSec(s.id)).filter(l=>!isApp(l)).forEach(l=>web.push([s,l])));
    if(web.length){const ws=sheet('الروابط',[28,34,36,46]);title(ws,'الروابط',4);head(ws,4,['القسم','الاسم','الوصف','الرابط']);let i=5;
      web.forEach(([s,l])=>{ws.getCell(i,1).value=s.name;ws.getCell(i,1).font=font({bold:true,color:{argb:argb(s.color)}});ws.getCell(i,2).value=l.name;ws.getCell(i,2).font=font({bold:true});ws.getCell(i,3).value=l.desc||'';ws.getCell(i,3).font=font({color:{argb:MU}});
        ws.getCell(i,4).value={text:host(l.url)||l.url,hyperlink:l.url};ws.getCell(i,4).font=font({color:{argb:'FF64D2FF'},underline:true});ws.getCell(i,4).alignment={horizontal:'left'};alt(ws,i,4);i++});
      paint(ws,i,4);ws.autoFilter={from:{row:4,column:1},to:{row:i-1,column:4}};ws.views=[{rightToLeft:true,showGridLines:false,state:'frozen',ySplit:4}]}
    const apps=[];secs.forEach(s=>sorted(inSec(s.id)).filter(isApp).forEach(l=>apps.push([s,l])));
    if(apps.length){const ws=sheet('التطبيقات',[24,34,22,22]);title(ws,'تطبيقات الجوال',4);head(ws,4,['التطبيق','الوصف','آيفون','أندرويد']);let i=5;
      apps.forEach(([s,l])=>{ws.getCell(i,1).value=l.name;ws.getCell(i,1).font=font({bold:true,color:{argb:argb(s.color)}});ws.getCell(i,2).value=l.desc||'';ws.getCell(i,2).font=font({color:{argb:MU}});
        if(l.ios){ws.getCell(i,3).value={text:'متجر آبل',hyperlink:l.ios};ws.getCell(i,3).font=font({color:{argb:'FF64D2FF'},underline:true})}
        if(l.android){ws.getCell(i,4).value={text:'متجر قوقل',hyperlink:l.android};ws.getCell(i,4).font=font({color:{argb:'FF30D158'},underline:true})}alt(ws,i,4);i++});paint(ws,i,4)}
    if(days.length){const ws=sheet('الأيام الصحية',[20,50,20,26]);title(ws,'تقويم الأيام الصحية',4);head(ws,4,['التاريخ','المناسبة','المتبقي','ملاحظة']);let i=5;
      days.forEach(d=>{const n=daysTo(d);ws.getCell(i,1).value=d.d+' '+MONTHS[d.m-1];ws.getCell(i,1).font=font({bold:true,color:{argb:'FFFF453A'}});ws.getCell(i,2).value=d.name;ws.getCell(i,2).font=font({bold:true});ws.getCell(i,3).value=cdTxt(n);ws.getCell(i,3).font=font({color:{argb:n<=14?AC:MU}});ws.getCell(i,4).value=d.desc||'';alt(ws,i,4);i++});paint(ws,i,4)}
    const buf=await wb.xlsx.writeBuffer();await deliver(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),fileSafe('دليل-الأنظمة-'+label)+'-'+stamp()+'.xlsx');toast('تم تجهيز ملف Excel')
  }finally{b.close()}}
async function exportPDF(sc){
  const b=busy('جارٍ تجهيز ملف PDF…');
  try{await Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')]);
    try{await document.fonts.ready}catch(e){}
    const {secs,label,days}=scopeData(sc);const items=[];
    secs.forEach(s=>{const ls=sorted(inSec(s.id));if(!ls.length)return;items.push({t:'h',n:s.name,c:s.color,k:ls.length});ls.forEach(l=>items.push({t:'r',l,c:s.color}))});
    if(days.length){items.push({t:'h',n:'الأيام الصحية',c:'#FF453A',k:days.length});days.forEach(d=>items.push({t:'d',d}))}
    const W=794,H=1123,TOP=170,BOT=64,RH=40,HH=50;const pages=[];let cur=[],y=TOP;
    for(const it of items){const h=it.t==='h'?HH:RH;if(y+h>H-BOT||(it.t==='h'&&y+h+RH>H-BOT)){pages.push(cur);cur=[];y=TOP}it.y=y;cur.push(it);y+=h}
    if(cur.length)pages.push(cur);
    const root=document.createElement('div');root.style.cssText='position:fixed;top:0;left:-10000px;width:'+W+'px';document.body.appendChild(root);
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'px',format:[W,H],orientation:'portrait',hotfixes:['px_scaling']});const N=pages.length;
    const FONT="-apple-system,BlinkMacSystemFont,'SF Pro Text','SF Arabic','IBM Plex Sans Arabic',Tahoma,sans-serif";
    for(let p=0;p<N;p++){
      root.innerHTML=`<div style="width:${W}px;height:${H}px;position:relative;overflow:hidden;color:#FFFFFF;font-family:${FONT};direction:rtl;background:radial-gradient(560px 360px at 92% -4%,rgba(10,132,255,.45) 0%,rgba(10,132,255,0) 70%),radial-gradient(420px 300px at 0% 100%,rgba(94,92,230,.35) 0%,rgba(94,92,230,0) 70%),#000">
        <div style="position:absolute;top:28px;right:30px;left:30px;height:112px;border-radius:24px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);display:flex;align-items:center;gap:18px;padding:0 26px">
          <img src="${MARK_DATA}" style="height:58px;width:58px">
          
          <div style="display:flex;flex-direction:column;gap:6px"><b style="font-size:24px;font-weight:800">${BRAND}</b><span style="font-size:13px;color:#98989F">${TAG} · ${esc(label)}</span></div>
          <div style="margin-right:auto;text-align:left;font-size:12px;color:#98989F;line-height:1.8">${DF.format(new Date())}<br><span style="color:#0A84FF;font-weight:700">صفحة ${p+1} من ${N}</span></div></div>
        ${pages[p].map(it=>it.t==='h'?`<div style="position:absolute;right:34px;left:34px;top:${it.y+12}px;height:30px;display:flex;align-items:center;gap:10px;font-weight:800;font-size:17px;color:${it.c}"><span style="width:12px;height:12px;border-radius:4px;background:${it.c}"></span>${esc(it.n)}<span style="font-weight:400;font-size:12px;color:#8E8E93">${it.k}</span></div>`
          :it.t==='r'?`<div style="position:absolute;right:34px;left:34px;top:${it.y}px;height:${RH-7}px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 10px 0 14px;font-size:13px"><span style="width:24px;height:24px;border-radius:7px;background:${it.c};color:#fff;font-weight:800;display:grid;place-items:center;font-size:12px">${initial(it.l)}</span><b style="min-width:190px;font-weight:600">${esc(it.l.name)}</b><span style="color:#98989F;flex:1;white-space:nowrap;overflow:hidden">${esc(it.l.desc||'')}</span><span style="direction:ltr;color:#64D2FF;font-size:12px">${isApp(it.l)?'متجر آبل · متجر قوقل':esc(host(it.l.url))}</span></div>`
          :`<div style="position:absolute;right:34px;left:34px;top:${it.y}px;height:${RH-7}px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;display:flex;align-items:center;gap:12px;padding:0 14px;font-size:13px"><b style="min-width:90px;color:#FB7185;font-weight:800">${it.d.d} ${MONTHS[it.d.m-1]}</b><span style="flex:1;font-weight:600">${esc(it.d.name)}</span><span style="color:#FF9F0A;font-size:12px">${cdTxt(daysTo(it.d))}</span></div>`).join('')}
        <div style="position:absolute;bottom:0;left:0;right:0;height:46px;border-top:1px solid rgba(255,255,255,.14);display:flex;align-items:center;justify-content:space-between;padding:0 34px;font-size:11.5px;color:#98989F"><span>${BRAND} · ${TAG}</span><b style="color:#EBEBF5;font-weight:600">إعداد وتطوير: سالم سعد الشهري</b></div></div>`;
      await Promise.all([...root.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
      const cv=await html2canvas(root.firstElementChild,{scale:2,backgroundColor:'#000000',useCORS:true,logging:false});
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
const ROLE_N={admin:'مسؤول',ops:'التشغيل'},ROLE_C={admin:'#5856D6',ops:'#FF9500'};
function isAdmin(){return !S.readonly&&API.role==='admin'}
function hdrs(x){return Object.assign({'x-edit-pin':API.pin,'x-device-id':API.dev,'x-editor-name':encodeURIComponent(API.name||'')},x||{})}
const ADM={data:null,err:''};
async function loadAdmin(body){try{const r=await fetch('/api/admin',body?{method:'POST',headers:hdrs({'content-type':'application/json'}),body:JSON.stringify(body)}:{headers:hdrs(),cache:'no-store'});if(!r.ok)throw r.status;ADM.data=await r.json();ADM.err=''}catch(e){ADM.err='تعذّر تحميل الرموز'}fillAdmin()}
function fillAdmin(){const el=$('#admPanel');if(!el)return;if(ADM.err){el.innerHTML=`<p class="note">${ADM.err}</p>`;return}const d=ADM.data;if(!d)return;
  el.innerHTML=`<p class="note">رمز المسؤول يقبل ${d.maxAdmins} أشخاص كحد أقصى، كل واحد على جهازه، ومعه هذا السجل. رمز التشغيل يعدّل كل شيء بدون السجل.</p>
  <div class="arow"><span class="xt"><b>رمز التشغيل</b><small>للفريق اللي يحدّث الروابط</small></span><span class="pinv tab-num">${esc(d.opsPin)}</span><button type="button" class="gbtn sm" data-copy="${esc(d.opsPin)}">نسخ</button><button type="button" class="gbtn sm" data-regen="ops">رمز جديد</button></div>
  ${d.admins.map(a=>`<div class="arow"><span class="lav" style="background:#5856D6">${esc((a.name||'؟').charAt(0))}</span><span class="xt"><b>${esc(a.name||'بدون اسم')}</b>${a.me?' · أنت':''}<small>${esc(a.device||'')} · آخر دخول ${a.last?DS.format(new Date(a.last))+' '+TF12.format(new Date(a.last)):'—'}</small></span>${a.me?'':`<button type="button" class="dbtn" data-rmadmin="${esc(a.id)}">إزالة</button>`}</div>`).join('')}
  <p class="note">المسؤولون: ${d.admins.length} من ${d.maxAdmins}</p>
  ${d.hits?`<div class="arow"><span class="xt"><b>عدّاد الزيارات</b><small>المعروض للزوار ${NF.format(d.hits+d.bonus)} = بداية ${NF.format(103642)} + زيارات فعلية ${NF.format(d.hits-103642)} + زيادة يومية تلقائية ${NF.format(d.bonus)}</small></span></div>`:''}`;
  el.onclick=async e=>{const c=e.target.closest('[data-copy]');if(c){try{await navigator.clipboard.writeText(c.dataset.copy);toast('تم نسخ الرمز')}catch(err){toast('الرمز: '+c.dataset.copy)}return}
    const g=e.target.closest('[data-regen]');if(g){if(!g.classList.contains('armed')){g.classList.add('armed');g.textContent='تأكيد؟';return}await loadAdmin({action:'regen',target:'ops'});toast('تم إنشاء رمز جديد، القديم توقف');return}
    const r=e.target.closest('[data-rmadmin]');if(r){if(!r.classList.contains('armed')){r.classList.add('armed');r.textContent='تأكيد الإزالة';return}await loadAdmin({action:'removeAdmin',id:r.dataset.rmadmin});toast('تمت الإزالة')}}}
const LOG={entries:null,err:''};
async function loadLog(){try{const r=await fetch('/api/log',{headers:hdrs(),cache:'no-store'});if(!r.ok)throw r.status;LOG.entries=(await r.json()).entries||[];LOG.err=''}catch(e){LOG.err='تعذّر تحميل السجل'}fillLog()}
function fillLog(){const el=$('#logList');if(!el)return;if(LOG.err){el.innerHTML=`<p class="note">${LOG.err}</p>`;return}if(!LOG.entries)return;
  const all=LOG.entries,edits=all.filter(e=>e.action!=='دخول'),logins=all.filter(e=>e.action==='دخول'),td=DS.format(new Date());
  $('#logStats').innerHTML=[['إجمالي التعديلات',edits.length,'#007AFF'],['تعديلات اليوم',edits.filter(e=>DS.format(new Date(e.at))===td).length,'#A6C955'],['مرات الدخول اليوم',logins.filter(e=>DS.format(new Date(e.at))===td).length,'#F5A524'],['آخر دخول',logins[0]?TF12.format(new Date(logins[0].at)):'—','#63BDC1']].map(x=>`<div style="--c:${x[2]}"><span>${x[0]}</span><b class="tab-num">${x[1]}</b></div>`).join('');
  if(!all.length){el.innerHTML=emptyBox('لا توجد سجلات بعد','');return}
  let html='',day='';
  for(const e of all.slice(0,400)){const d=DAYF.format(new Date(e.at));if(d!==day){day=d;html+=`<h3 class="lday">${d}</h3>`}
    const av=`<span class="lav" style="background:${ROLE_C[e.role]||'#8B9BCF'}">${esc((e.by||'؟').trim().charAt(0))}</span>`;
    const ac=e.action==='دخول'?'#FF9500':e.action==='حذف'?'#FF3B30':e.action==='إضافة'?'#34C759':'#007AFF';
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
    <p class="note" id="lgErr" style="color:#FF3B30" hidden></p>
    <div class="mrow"><span></span><span><button type="button" class="gbtn sm" data-mclose>إلغاء</button><button class="gbtn sm acc">دخول</button></span></div>`,
  (h,close)=>{setTimeout(()=>h.querySelector(API.name?'#lgPin':'#lgName').focus(),30);h.querySelector('form').onsubmit=async e=>{e.preventDefault();const name=h.querySelector('#lgName').value.trim(),pin=h.querySelector('#lgPin').value.trim();
    let ok=null;try{ok=await S.db.ping(pin,name,true)}catch(err){}
    if(!ok||ok.error){const er=h.querySelector('#lgErr');er.textContent=ok&&ok.error==='admin-full'?'اكتمل عدد المسؤولين (5 أشخاص). اطلب من مسؤول حالي يزيل أحد المسجلين.':'الرمز غير صحيح، تأكد منه وحاول مرة أخرى.';er.hidden=false;return}
    API.pin=pin;API.name=name;API.role=ok.role;saveApi();try{sessionStorage.setItem('thc-links-sess','1')}catch(err){}close();setEdit(true);toast('أهلاً '+name+'، دخلت بصلاحية '+(ROLE_N[ok.role]||''))}});
}
function apiDb(){let st=null,pending=0;
  const apply=j=>{st=j;const m=o=>Object.entries(o||{}).map(([id,d])=>({id,...d}));S.sec=m(j.sections);S.links=m(j.links);S.days=m(j.days);S.loaded=true};
  return{
    async pull(hit){if(pending)return;const r=await fetch('/api/data'+(hit?'?hit=1':''),{cache:'no-store'});if(!r.ok)throw new Error('load');const j=await r.json();if(j.hits){S.hits=j.hits;delete j.hits}S.sync={ok:true,at:Date.now()};if(pending)return;if(!st||j.rev!==st.rev){apply(j);if(!document.querySelector('.modal'))render()}},
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
  try{await db.pull(true)}catch(e){await useSnapshot();return}
  S.readonly=!API.pin;render();
  if(API.pin){let seen=false;try{seen=sessionStorage.getItem('thc-links-sess')==='1'}catch(e){}
    if(!seen)db.ping(API.pin,API.name,true).then(r=>{if(!r||r.error){setEdit(false);return}try{sessionStorage.setItem('thc-links-sess','1')}catch(e){}if(r.role!==API.role){API.role=r.role;saveApi();render()}}).catch(()=>{})}
  setInterval(()=>{if(document.visibilityState==='visible')db.pull().catch(()=>{S.sync={ok:false,at:Date.now()};if(!document.querySelector('.modal'))render()})},60000);
}
start();
})();
</script>
</body></html>
