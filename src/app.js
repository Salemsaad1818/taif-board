<script>
(function(){
const PALETTE=['#2BD4F0','#A78BFA','#F5A524','#34D399','#60A5FA','#F472B6','#FB7185','#FACC15','#2DD4BF'];
const DAY_C='#FB7185';
const FORM='https://forms.gle/us3hgom7yADd3Goh7';
const GCAL='https://calendar.google.com/calendar/embed?mode=AGENDA&showPrint=0&showTz=0&showCalendars=1&ctz=Asia%2FRiyadh&src=thi8lfa3o57nf0enn1iitcnsbc%40group.calendar.google.com&color=%2342d692&src=ar.saudiarabian%23holiday%40group.v.calendar.google.com&color=%2316a765';
const MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

const S={sec:[],links:[],days:[],view:'cards',fSec:'all',q:'',fav:[],readonly:true,loaded:false,db:null,openId:null};
try{const p=JSON.parse(localStorage.getItem('thc-links')||'{}');S.view=p.view||'cards';S.fSec=p.fSec||'all';S.fav=Array.isArray(p.fav)?p.fav:[]}catch(e){}
function remember(){try{localStorage.setItem('thc-links',JSON.stringify({view:S.view,fSec:S.fSec,fav:S.fav}))}catch(e){}}

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DF=new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'long',year:'numeric'});
const DS=new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{day:'numeric',month:'short'});
const DAYF=new Intl.DateTimeFormat('ar-SA-u-ca-gregory-nu-latn',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Riyadh'});
const TF12=new Intl.DateTimeFormat('ar-SA-u-nu-latn',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Riyadh'});
const TF=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true,timeZone:'Asia/Riyadh'});
const TODAY=new Date();TODAY.setHours(0,0,0,0);
function tick(){const now=new Date();const parts=TF.formatToParts(now);const g=t=>(parts.find(x=>x.type===t)||{}).value||'';
  $('#clockT').textContent=`${g('hour')}:${g('minute')}:${g('second')}`;$('#clockP').textContent=g('dayPeriod').toUpperCase()==='AM'?'ص':'م';
  const d=DAYF.format(now);if($('#today').textContent!==d)$('#today').textContent=d}
tick();setInterval(tick,1000);

/* ---------- helpers ---------- */
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
function host(u){try{return new URL(u).hostname.replace(/^www\./,'')}catch(e){return ''}}
function secsSorted(){return S.sec.slice().sort((a,b)=>(a.order??0)-(b.order??0))}
function secOf(l){return S.sec.find(s=>s.id===l.sid)||{name:'بدون قسم',color:'#7B8AB0',id:''}}
function sorted(list){return list.slice().sort((a,b)=>(a.order??0)-(b.order??0)||String(a.name).localeCompare(b.name,'ar'))}
function isApp(l){return !!(l.ios||l.android)}
function matchQ(l){const q=S.q.trim();if(!q)return true;return (l.name+' '+(l.desc||'')+' '+host(l.url)+' '+secOf(l).name).toLowerCase().includes(q.toLowerCase())}
function visible(){return S.links.filter(l=>(S.fSec==='all'||(S.fSec==='fav'?S.fav.includes(l.id):l.sid===S.fSec))&&matchQ(l))}
function nextDate(d){let x=new Date(TODAY.getFullYear(),(+d.m||1)-1,+d.d||1);if(x<TODAY)x=new Date(TODAY.getFullYear()+1,(+d.m||1)-1,+d.d||1);return x}
function daysTo(d){return Math.round((nextDate(d)-TODAY)/864e5)}
function cdTxt(n){return n===0?'اليوم':n===1?'غداً':n===2?'بعد يومين':n<=10?`بعد ${n} أيام`:`بعد ${n} يوماً`}
function cdChip(d){const n=daysTo(d);return `<span class="cd2${n===0?' now':n<=14?' soon':''}">${cdTxt(n)}</span>`}
function daysSorted(){return S.days.slice().sort((a,b)=>daysTo(a)-daysTo(b))}
function fav(u){return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host(u))}&sz=64`}
function openUrl(l){if(!isApp(l))return l.url;const a=/Android/i.test(navigator.userAgent);return (a?l.android:l.ios)||l.ios||l.android||l.url}

/* ---------- writes ---------- */
const SAVE_TXT={idle:'التغييرات تُحفظ تلقائياً',saving:'جارٍ الحفظ…',saved:'تم الحفظ ✓',failed:'لم يُحفظ، حاول مرة أخرى'};
let saveN=0;function setSave(s){const el=document.getElementById('savePill');if(el){el.className='savepill '+s;el.textContent=SAVE_TXT[s]}}
const colOf=c=>c==='links'?S.links:c==='sections'?S.sec:S.days;
let chain=Promise.resolve();
function write(c,id,op,data){
  const arr=colOf(c),i=arr.findIndex(x=>x.id===id);
  if(op==='update'&&i>=0)Object.assign(arr[i],data);
  else if(op==='set'){if(i>=0)arr[i]={id,...data};else arr.push({id,...data})}
  else if(op==='delete'){if(i>=0)arr.splice(i,1);if(c==='sections')S.links=S.links.filter(l=>l.sid!==id)}
  renderAll();
  if(!S.db||S.readonly){toast('سجّل الدخول لحفظ التغييرات');return Promise.resolve()}
  if(data)data.updatedAt=Date.now();
  saveN++;setSave('saving');
  chain=chain.then(()=>S.db.send({c,id,op,data})).then(()=>{if(--saveN<=0){saveN=0;setSave('saved')}}).catch(e=>{saveN=Math.max(0,saveN-1);setSave('failed');toast(e&&e.code==='permission_denied'?'انتهت صلاحية الدخول، ادخل مرة ثانية':e&&e.code==='bad url'?'الرابط لازم يبدأ بـ https://':'تعذّر الحفظ، حاول مرة أخرى')});
  return chain;
}

/* ---------- summary ---------- */
function ringSVG(){const total=S.links.length,r=30,C=2*Math.PI*r;let off=0,segs='';
  if(total){for(const s of secsSorted()){const n=S.links.filter(l=>l.sid===s.id).length;if(!n)continue;const len=C*n/total;segs+=`<circle cx="37" cy="37" r="${r}" fill="none" stroke="${s.color}" stroke-width="8" stroke-dasharray="${Math.max(0,len-2)} ${C}" stroke-dashoffset="${-off}" transform="rotate(-90 37 37)"/>`;off+=len}}
  return `<circle cx="37" cy="37" r="${r}" fill="none" stroke="#24408F" stroke-width="8"/>${segs}<text x="37" y="43" text-anchor="middle" font-family="Alexandria,sans-serif" font-weight="800" font-size="19" fill="#EEF2FF">${total}</text>`}
function renderSummary(){
  $('#ring').innerHTML=ringSVG();$('#ringSub').textContent=`في ${S.sec.length} أقسام · ${S.days.length} يوماً صحياً`;
  const secs=secsSorted();const nd=daysSorted()[0];
  const k=[{l:'إجمالي الروابط',v:S.links.length,s:'أنظمة وجهات ومراجع وتطبيقات',c:'#2BD4F0',f:'all'}];
  secs.slice(0,4).forEach(s=>k.push({l:s.name,v:S.links.filter(l=>l.sid===s.id).length,s:s.id==='apps'?'آيفون وأندرويد':'رابط',c:s.color,f:s.id}));
  k.push(nd?{l:'اليوم الصحي القادم',v:esc(nd.name),s:`${nd.d} ${MONTHS[nd.m-1]} · ${cdTxt(daysTo(nd))}`,c:DAY_C,sm:1,f:'days'}:{l:'اليوم الصحي القادم',v:'—',s:'',c:DAY_C,f:'days'});
  $('#kpis').innerHTML=k.slice(0,6).map(x=>`<button class="kpi" style="--c:${x.c};text-align:start;cursor:pointer" data-kf="${x.f}"><div class="lbl">${esc(x.l)}</div><div class="val tab-num${x.sm?' sm':''}">${x.v}</div><div class="sub">${esc(x.s)}</div></button>`).join('');
  const max=Math.max(1,...secs.map(s=>S.links.filter(l=>l.sid===s.id).length));
  $('#fbars').innerHTML=secs.map(s=>{const n=S.links.filter(l=>l.sid===s.id).length;return `<div class="fbar" style="--c:${s.color}" data-f="${s.id}" role="button" tabindex="0"><span class="n"><span class="sw" style="background:${s.color}"></span>${esc(s.name)}</span><span class="t"><i style="width:${Math.round(n/max*100)}%"></i></span><span class="p tab-num">${n}</span></div>`}).join('');
  $('#nextDays').innerHTML=daysSorted().slice(0,4).map(dayRow).join('')||'<p class="note">لا توجد أيام صحية مضافة.</p>';
}
function dayRow(d){return `<div class="ndi" data-day="${esc(d.id)}" style="--c:${DAY_C}"><span class="dbad"><b class="tab-num">${+d.d}</b><small>${MONTHS[(+d.m||1)-1]}</small></span><span class="xt">${esc(d.name)}${d.desc?`<small>${esc(d.desc)}</small>`:''}</span>${cdChip(d)}<span class="pen">تعديل</span></div>`}

/* ---------- toolbar ---------- */
function renderToolbar(){
  document.querySelectorAll('.tabs [data-v]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.v===S.view)));
  const showChips=S.view==='cards'||S.view==='table';$('#chips').hidden=!showChips;$('.search').style.display=showChips?'':'none';
  const chips=[{id:'all',n:'الكل',c:'var(--accent)',k:S.links.length},{id:'fav',n:'★ المفضلة',c:'#FACC15',k:S.links.filter(l=>S.fav.includes(l.id)).length},...secsSorted().map(s=>({id:s.id,n:s.name,c:s.color,k:S.links.filter(l=>l.sid===s.id).length}))];
  $('#chips').innerHTML=chips.map(c=>`<button class="chip" style="--c:${c.c}" aria-pressed="${S.fSec===c.id}" data-chip="${c.id}">${c.id!=='all'&&c.id!=='fav'?`<span class="sw" style="background:${c.c}"></span>`:''}${esc(c.n)} <span class="tab-num" style="color:var(--dim)">${c.k}</span></button>`).join('');
  const ed=!S.readonly;$('#addLink').hidden=!(ed&&showChips);$('#addSec').hidden=!(ed&&showChips);$('#addDay').hidden=!(ed&&S.view==='days');
}

/* ---------- views ---------- */
const IOS='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M11.2 8.4c0-1.5 1.2-2.2 1.3-2.3-.7-1-1.8-1.2-2.2-1.2-.9-.1-1.8.6-2.3.6-.5 0-1.2-.5-2-.5-1 0-2 .6-2.5 1.6-1.1 1.9-.3 4.6.8 6.1.5.7 1.1 1.6 1.9 1.5.8 0 1-.5 2-.5s1.2.5 2 .5c.8 0 1.3-.8 1.8-1.5.6-.8.8-1.6.8-1.7 0 0-1.6-.6-1.6-2.6ZM9.7 3.9c.4-.5.7-1.2.6-1.9-.6 0-1.3.4-1.8.9-.4.4-.7 1.1-.6 1.8.7.1 1.4-.3 1.8-.8Z"/></svg>';
const GP='<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2.5 1.6c-.2.2-.3.5-.3.8v11.2c0 .3.1.6.3.8L8.8 8 2.5 1.6Zm7.1 5.6 1.8-1.8L4 1.2l5.6 6Zm0 1.6L4 14.8l7.4-4.2-1.8-1.8Zm4-2-1.9-1.1L9.7 8l2 2 1.9-1.1c.5-.3.5-1.1 0-1.1Z"/></svg>';
function cardHtml(l){const s=secOf(l),f=S.fav.includes(l.id),h=host(l.url);
  return `<div class="lk" style="--c:${s.color}" data-id="${esc(l.id)}">
    <a class="lk-main" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}">
      <span class="ic"><b>${esc(String(l.name||'؟').trim().charAt(0))}</b>${h?`<img src="${fav(l.url)}" alt="" loading="lazy" onerror="this.remove()">`:''}</span>
      <span class="tx"><b>${esc(l.name)}</b>${l.desc?`<small>${esc(l.desc)}</small>`:''}${!isApp(l)&&h?`<em>${esc(h)}</em>`:''}</span>
    </a>
    ${isApp(l)?`<div class="stores">${l.ios?`<a href="${esc(l.ios)}" target="_blank" rel="noopener" data-open="${esc(l.id)}">${IOS}App Store</a>`:''}${l.android?`<a href="${esc(l.android)}" target="_blank" rel="noopener" data-open="${esc(l.id)}">${GP}Google Play</a>`:''}</div>`:''}
    <button class="star" data-fav="${esc(l.id)}" aria-pressed="${f}" aria-label="${f?'إزالة من المفضلة':'إضافة للمفضلة'}">${f?'★':'☆'}</button>
    <span class="pen">تعديل</span>
  </div>`}
function emptyState(){return `<div class="empty"><b>${S.fSec==='fav'?'ما عندك مفضلة بعد':'لا توجد نتائج'}</b><span>${S.fSec==='fav'?'اضغط النجمة ☆ على أي رابط عشان يظهر هنا في أعلى الدليل.':'جرّب كلمة بحث ثانية أو اعرض كل الأقسام.'}</span>${S.q||S.fSec!=='all'?'<button class="btn" data-reset>عرض الكل</button>':''}</div>`}
function groups(){const vis=visible();const out=[];
  if(S.fSec==='all'&&!S.q.trim()){const fv=sorted(S.links.filter(l=>S.fav.includes(l.id)));if(fv.length)out.push({id:'fav',name:'★ المفضلة',color:'#FACC15',list:fv,fav:1})}
  for(const s of secsSorted()){const list=sorted(vis.filter(l=>l.sid===s.id));if(list.length||(!S.readonly&&S.fSec===s.id)||(!S.readonly&&S.fSec==='all'&&!S.q.trim()))out.push({...s,list})}
  return out}
function gHead(g){return `<div class="g-head"><span class="tg" style="--c:${g.color};color:${g.color}">${g.fav?'':`<span class="sec-sw" style="--c:${g.color}"></span>`}${esc(g.name)}</span><span class="meta tab-num">${g.list.length} ${g.fav?'':'رابط'}</span>${g.fav?'':`<button class="secedit" data-editsec="${esc(g.id)}">✎ تعديل القسم</button>`}<span class="sp"></span>${g.fav?'':`<button class="addin" data-addin="${esc(g.id)}">+ رابط هنا</button>`}</div>`}
function renderCards(){const gs=groups();if(!gs.some(g=>g.list.length)&&S.readonly)return emptyState();
  return gs.map(g=>`<section class="group">${gHead(g)}${g.list.length?`<div class="lgrid">${g.list.map(cardHtml).join('')}</div>`:'<p class="note">لا توجد روابط في هذا القسم بعد.</p>'}</section>`).join('')}
function renderTable(){const gs=groups().filter(g=>!g.fav);if(!gs.some(g=>g.list.length)&&S.readonly)return emptyState();
  return gs.map(g=>`<section class="group">${gHead(g)}<div class="tbl-scroll"><table class="ltbl"><thead><tr><th class="name">الاسم</th><th>الوصف</th><th>الموقع</th><th>المفضلة</th><th></th></tr></thead><tbody>${g.list.map(l=>`<tr data-id="${esc(l.id)}"><td class="name" style="--c:${g.color}"><div class="nm">${esc(l.name)}</div></td><td>${esc(l.desc||'—')}</td><td class="host">${isApp(l)?'App Store · Google Play':esc(host(l.url))}</td><td><button class="star" style="position:static" data-fav="${esc(l.id)}" aria-pressed="${S.fav.includes(l.id)}">${S.fav.includes(l.id)?'★':'☆'}</button></td><td><a class="go" href="${esc(openUrl(l))}" target="_blank" rel="noopener" data-open="${esc(l.id)}">فتح ↗</a><span class="pen">تعديل</span></td></tr>`).join('')}</tbody></table></div></section>`).join('')}
function renderDays(){const cm=TODAY.getMonth()+1;const order=[...Array(12)].map((_,i)=>((cm-1+i)%12)+1);
  const box=order.map(m=>{const list=S.days.filter(d=>+d.m===m).sort((a,b)=>a.d-b.d);if(!list.length&&m!==cm)return '';
    return `<div class="mon${m===cm?' cur':''}"><h4><span class="sw" style="background:${DAY_C}"></span>${MONTHS[m-1]}<small>${m===cm?'الشهر الحالي · ':''}${list.length} مناسبة</small></h4>${list.map(dayRow).join('')||'<p class="note">لا توجد مناسبات.</p>'}</div>`}).join('');
  return `<div class="days">${box}</div>
  <div class="card gcal"><h3>تقويم الأيام الصحية العالمية <small><a class="lnk" href="${GCAL}" target="_blank" rel="noopener">فتح في تقويم قوقل ↗</a></small></h3><iframe src="${GCAL}" loading="lazy" title="تقويم الأيام الصحية العالمية"></iframe></div>`}
function renderView(){const v=$('#view');
  if(!S.loaded){v.innerHTML='<div class="empty"><div class="spin"></div><span>جارٍ تحميل الدليل…</span></div>';return}
  if(S.view==='log'&&isAdmin()){if(!$('#logw'))renderLogShell();return}
  if(S.view==='log')S.view='cards';
  v.innerHTML=S.view==='table'?renderTable():S.view==='days'?renderDays():renderCards();
}
function renderAll(){renderSummary();renderToolbar();renderView();if(S.openId&&!$('#layer').contains(document.activeElement))renderDrawer()}

/* ---------- link drawer ---------- */
function openDrawer(id){S.openId=id;renderDrawer()}
function closeDrawer(){S.openId=null;$('#layer').innerHTML=''}
function renderDrawer(){
  const l=S.links.find(x=>x.id===S.openId);if(!l){closeDrawer();return}
  const s=secOf(l);
  $('#layer').innerHTML=`<div class="scrim" data-close></div><aside class="drawer" role="dialog" aria-label="${esc(l.name)}" style="--c:${s.color}">
    <div class="dr-cover" style="height:96px;background:linear-gradient(135deg,${s.color}55,var(--bg2))"><button class="dr-x" data-close aria-label="إغلاق">✕</button></div>
    <div class="dr-body">
      <div class="dr-mode ed"><span>✎ تعديل الرابط · يُحفظ تلقائياً</span><span class="sp"></span><span class="savepill" id="savePill">${SAVE_TXT.idle}</span></div>
      <input class="dr-title" id="dName" value="${esc(l.name)}" aria-label="اسم الرابط">
      <div class="fields">
        <div class="f"><label for="dSec">القسم</label><select id="dSec">${secsSorted().map(x=>`<option value="${x.id}"${x.id===l.sid?' selected':''}>${esc(x.name)}</option>`).join('')}</select></div>
        <div class="f"><label for="dOrder">الترتيب</label><input id="dOrder" type="number" inputmode="numeric" value="${esc(l.order??'')}"></div>
        <div class="f full"><label for="dUrl">الرابط</label><input id="dUrl" type="url" dir="ltr" value="${esc(l.url)}" placeholder="https://"></div>
        <div class="f full"><label for="dDesc">وصف مختصر</label><input id="dDesc" value="${esc(l.desc||'')}"></div>
        <div class="f full"><label for="dIos">رابط App Store (للتطبيقات)</label><input id="dIos" type="url" dir="ltr" value="${esc(l.ios||'')}" placeholder="https://apps.apple.com/..."></div>
        <div class="f full"><label for="dAnd">رابط Google Play (للتطبيقات)</label><input id="dAnd" type="url" dir="ltr" value="${esc(l.android||'')}" placeholder="https://play.google.com/..."></div>
      </div>
      <p class="note">الرابط لازم يبدأ بـ https:// · رابطا المتجرين يظهران بس للتطبيقات.</p>
      <a class="btn" href="${esc(openUrl(l))}" target="_blank" rel="noopener" style="justify-content:center;text-decoration:none">فتح الرابط ↗</a>
    </div>
    <div class="dr-foot"><button class="btn danger" id="delLink">حذف الرابط</button><button class="btn pri" data-close>تم</button></div>
  </aside>`;
  const L=$('#layer');
  L.onclick=e=>{if(e.target.closest('[data-close]'))closeDrawer()};
  const upd=(k,v)=>{if(String(l[k]??'')===String(v))return;if(['url','ios','android'].includes(k)&&v&&!/^https?:\/\//i.test(v)){toast('الرابط لازم يبدأ بـ https://');return}write('links',l.id,'update',{[k]:v})};
  $('#dName').onchange=e=>upd('name',e.target.value.trim()||'رابط');
  $('#dSec').onchange=e=>upd('sid',e.target.value);
  $('#dOrder').onchange=e=>upd('order',+e.target.value||0);
  $('#dUrl').onchange=e=>upd('url',e.target.value.trim());
  $('#dDesc').onchange=e=>upd('desc',e.target.value.trim());
  $('#dIos').onchange=e=>upd('ios',e.target.value.trim());
  $('#dAnd').onchange=e=>upd('android',e.target.value.trim());
  const del=$('#delLink');del.onclick=()=>{if(!del.classList.contains('armed')){del.classList.add('armed');del.textContent='تأكيد الحذف؟';setTimeout(()=>{if(del.isConnected){del.classList.remove('armed');del.textContent='حذف الرابط'}},4000);return}const id=l.id;closeDrawer();write('links',id,'delete');toast('تم حذف الرابط')};
}
function addLink(sid){
  sid=sid&&S.sec.some(s=>s.id===sid)?sid:(S.sec.some(s=>s.id===S.fSec)?S.fSec:secsSorted()[0]?.id);
  if(!sid){toast('أضف قسماً أولاً');return}
  const id=uid(),n=S.links.filter(l=>l.sid===sid).length;
  write('links',id,'set',{sid,name:'رابط جديد',url:'https://',desc:'',ios:'',android:'',order:n+1});
  openDrawer(id);setTimeout(()=>{const t=$('#dName');t&&(t.focus(),t.select())},50);
}
/* ---------- section & day modals ---------- */
function modal(html,bind){const host=document.createElement('div');host.className='modal';host.innerHTML=`<div class="scrim" data-mclose></div><form class="box" style="position:relative;z-index:1">${html}</form>`;document.body.appendChild(host);host.addEventListener('click',e=>{if(e.target.closest('[data-mclose]'))host.remove()});bind(host,()=>host.remove());return host}
function secModal(id){
  const s=S.sec.find(x=>x.id===id)||{name:'',color:PALETTE[S.sec.length%PALETTE.length],order:S.sec.length+1};let col=s.color;
  modal(`<h3>${id?'تعديل القسم':'قسم جديد'}</h3>
    <div class="f"><label for="sName">اسم القسم</label><input id="sName" required value="${esc(s.name)}"></div>
    <div class="f"><label>اللون</label><div class="swatches">${PALETTE.map(c=>`<button type="button" style="--c:${c}" data-c="${c}" aria-pressed="${c===col}"></button>`).join('')}</div></div>
    <div class="f"><label for="sOrder">الترتيب</label><input id="sOrder" type="number" inputmode="numeric" value="${esc(s.order??'')}"></div>
    ${id?`<p class="note" style="margin:0">حذف القسم يحذف كل روابطه (${S.links.filter(l=>l.sid===id).length}).</p>`:''}
    <div style="display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap">${id?'<button type="button" class="btn danger" id="sDel">حذف القسم</button>':'<span></span>'}<span style="display:flex;gap:8px"><button type="button" class="btn ghost" data-mclose>إلغاء</button><button class="btn pri">حفظ</button></span></div>`,
  (h,close)=>{h.querySelector('#sName').focus();
    h.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{col=b.dataset.c;h.querySelectorAll('[data-c]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))});
    const d=h.querySelector('#sDel');if(d)d.onclick=()=>{if(!d.classList.contains('armed')){d.classList.add('armed');d.textContent='تأكيد الحذف؟';return}close();if(S.fSec===id)S.fSec='all';write('sections',id,'delete');toast('تم حذف القسم')};
    h.querySelector('form').onsubmit=e=>{e.preventDefault();const data={name:h.querySelector('#sName').value.trim()||'قسم',color:col,order:+h.querySelector('#sOrder').value||0};close();
      if(id)write('sections',id,'update',data);else{const nid=uid();write('sections',nid,'set',data);S.fSec=nid;remember();renderAll()}}});
}
function dayModal(id){
  const d=S.days.find(x=>x.id===id)||{name:'',m:TODAY.getMonth()+1,d:TODAY.getDate(),desc:''};
  modal(`<h3>${id?'تعديل اليوم الصحي':'يوم صحي جديد'}</h3>
    <div class="f"><label for="yName">اسم المناسبة</label><input id="yName" required value="${esc(d.name)}" placeholder="مثال: اليوم العالمي للسكري"></div>
    <div class="fields"><div class="f"><label for="yD">اليوم</label><input id="yD" type="number" min="1" max="31" inputmode="numeric" required value="${+d.d}"></div>
    <div class="f"><label for="yM">الشهر</label><select id="yM">${MONTHS.map((n,i)=>`<option value="${i+1}"${i+1===+d.m?' selected':''}>${n}</option>`).join('')}</select></div></div>
    <div class="f"><label for="yDesc">ملاحظة (اختياري)</label><input id="yDesc" value="${esc(d.desc||'')}"></div>
    <div style="display:flex;gap:8px;justify-content:space-between;flex-wrap:wrap">${id?'<button type="button" class="btn danger" id="yDel">حذف</button>':'<span></span>'}<span style="display:flex;gap:8px"><button type="button" class="btn ghost" data-mclose>إلغاء</button><button class="btn pri">حفظ</button></span></div>`,
  (h,close)=>{h.querySelector('#yName').focus();
    const x=h.querySelector('#yDel');if(x)x.onclick=()=>{if(!x.classList.contains('armed')){x.classList.add('armed');x.textContent='تأكيد الحذف؟';return}close();write('days',id,'delete');toast('تم الحذف')};
    h.querySelector('form').onsubmit=e=>{e.preventDefault();const data={name:h.querySelector('#yName').value.trim(),d:Math.min(31,Math.max(1,+h.querySelector('#yD').value||1)),m:+h.querySelector('#yM').value,desc:h.querySelector('#yDesc').value.trim()};close();
      if(id)write('days',id,'update',data);else write('days',uid(),'set',data)}});
}

/* ---------- misc ui ---------- */
let tt;function toast(t){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);clearTimeout(tt);tt=setTimeout(()=>d.remove(),2600)}
const loaded={};
function loadScript(u){return loaded[u]||(loaded[u]=new Promise((res,rej)=>{const s=document.createElement('script');s.src=u;s.onload=res;s.onerror=()=>{delete loaded[u];rej(new Error('lib'))};document.head.appendChild(s)}))}
function busy(msg){const el=document.createElement('div');el.className='busy';el.innerHTML=`<div class="box"><div class="spin"></div><b id="busyMsg"></b><span class="note">لا تغلق الصفحة حتى يكتمل التجهيز</span></div>`;document.body.appendChild(el);el.querySelector('#busyMsg').textContent=msg;return{close:()=>el.remove()}}
function toggleFav(id){const i=S.fav.indexOf(id);if(i>=0)S.fav.splice(i,1);else S.fav.push(id);remember();renderAll();toast(i>=0?'أُزيل من المفضلة':'أُضيف للمفضلة ★')}

document.addEventListener('click',e=>{
  const f=e.target.closest('[data-fav]');if(f){e.preventDefault();toggleFav(f.dataset.fav);return}
  const o=e.target.closest('[data-open]');if(o&&!S.readonly){e.preventDefault();openDrawer(o.dataset.open);return}
  const tr=e.target.closest('tr[data-id]');if(tr&&!e.target.closest('a')){if(!S.readonly)openDrawer(tr.dataset.id);else{const l=S.links.find(x=>x.id===tr.dataset.id);if(l)window.open(openUrl(l),'_blank','noopener')}return}
  const dy=e.target.closest('[data-day]');if(dy&&!S.readonly){dayModal(dy.dataset.day);return}
  const es=e.target.closest('[data-editsec]');if(es){secModal(es.dataset.editsec);return}
  const ai=e.target.closest('[data-addin]');if(ai){addLink(ai.dataset.addin);return}
  const ch=e.target.closest('[data-chip]');if(ch){S.fSec=ch.dataset.chip;remember();renderAll();return}
  const fb=e.target.closest('[data-f]');if(fb){S.fSec=fb.dataset.f;if(S.view!=='cards'&&S.view!=='table')S.view='cards';remember();renderAll();$('.toolbar').scrollIntoView({behavior:'smooth'});return}
  const kf=e.target.closest('[data-kf]');if(kf){const v=kf.dataset.kf;if(v==='days')S.view='days';else{S.fSec=v;if(S.view!=='table')S.view='cards'}remember();renderAll();$('.toolbar').scrollIntoView({behavior:'smooth'});return}
  const rs=e.target.closest('[data-reset]');if(rs){S.q='';$('#q').value='';S.fSec='all';remember();renderAll();return}
  const tv=e.target.closest('.tabs [data-v]');if(tv){S.view=tv.dataset.v;remember();if(S.view!=='log'){const lw=$('#logw');lw&&lw.remove()}renderAll();return}
});
$('#goDays').onclick=()=>{S.view='days';remember();renderAll();$('.toolbar').scrollIntoView({behavior:'smooth'})};
$('#q').addEventListener('input',e=>{S.q=e.target.value;renderView()});
$('#addLink').onclick=()=>addLink();
$('#addSec').onclick=()=>secModal();
$('#addDay').onclick=()=>dayModal();
$('#exportBtn').onclick=e=>exportMenu();
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeDrawer();document.querySelectorAll('.modal').forEach(m=>m.remove())}});

/* ---------- export ---------- */
function stamp(){return new Date().toISOString().slice(0,10)}
function fileSafe(t){return String(t).replace(/[\\/:*?"<>|]+/g,'').replace(/\s+/g,'-').slice(0,60)}
async function deliver(blob,filename){
  if(/FBAN|FBAV|Instagram|Line\/|Snapchat|WhatsApp|TikTok/i.test(navigator.userAgent))toast('للتحميل افتح الموقع في Safari أو Chrome');
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  if('download' in a){a.href=url;a.download=filename;a.rel='noopener';a.style.display='none';document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(url)},60000)}else{const w=window.open(url,'_blank');if(!w)window.location.href=url}}
function exportMenu(){
  const rows=[['all','الدليل كامل',`${S.links.length} رابط · ${S.days.length} يوماً صحياً`,'#2BD4F0'],...secsSorted().map(s=>[s.id,s.name,S.links.filter(l=>l.sid===s.id).length+' رابط',s.color]),['days','الأيام الصحية',S.days.length+' مناسبة',DAY_C]];
  modal(`<h3>تصدير الدليل</h3><div class="xmenu" style="width:100%;max-height:60vh;padding:0">${rows.map(r=>`<div class="xr"><span class="sw" style="background:${r[3]}"></span><span class="xt">${esc(r[1])}<small>${esc(r[2])}</small></span><span class="xb"><button type="button" class="xp" data-x="pdf:${r[0]}">PDF</button><button type="button" class="xx" data-x="xlsx:${r[0]}">Excel</button></span></div>`).join('')}</div><div style="display:flex;justify-content:flex-end"><button type="button" class="btn ghost" data-mclose>إغلاق</button></div>`,
  (h,close)=>{h.querySelector('form').onsubmit=e=>e.preventDefault();h.onclick=e=>{const b=e.target.closest('[data-x]');if(!b)return;const [k,sc]=b.dataset.x.split(':');close();(k==='pdf'?exportPDF:exportExcel)(sc).catch(()=>toast('تعذّر التصدير، تأكد من الاتصال وحاول مرة أخرى'))}});
}
function scopeData(sc){const secs=sc==='all'?secsSorted():sc==='days'?[]:secsSorted().filter(s=>s.id===sc);
  const label=sc==='all'?'الدليل كامل':sc==='days'?'الأيام الصحية':(secs[0]||{}).name||'';
  return{secs,label,days:sc==='all'||sc==='days'?daysSorted():[]}}
async function exportExcel(sc){
  const b=busy('جارٍ تجهيز ملف Excel…');
  try{await loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');
    const {secs,label,days}=scopeData(sc);const wb=new ExcelJS.Workbook();wb.creator='سالم سعد الشهري';
    const BG='FF061452',PN='FF10236F',LN='FF24408F',FG='FFEEF2FF',MU='FF9AA8D8';
    const argb=c=>'FF'+String(c).replace('#','').toUpperCase();
    const font=(o)=>Object.assign({name:'Arial',color:{argb:FG},size:11},o||{});
    function sheet(name,cols){const ws=wb.addWorksheet(name,{views:[{rightToLeft:true,showGridLines:false}],properties:{defaultRowHeight:22}});ws.columns=cols.map(w=>({width:w}));return ws}
    function paint(ws,rows,cols){for(let r=1;r<=rows;r++){const row=ws.getRow(r);for(let c=1;c<=cols;c++){const cell=row.getCell(c);if(!cell.fill||cell.fill.fgColor?.argb===undefined)cell.fill={type:'pattern',pattern:'solid',fgColor:{argb:BG}};if(!cell.font)cell.font=font()}}}
    function title(ws,t,sub,cols){ws.mergeCells(1,1,1,cols);const c=ws.getCell(1,1);c.value=t;c.font=font({size:18,bold:true});c.alignment={horizontal:'right',vertical:'middle'};ws.getRow(1).height=34;
      ws.mergeCells(2,1,2,cols);const s=ws.getCell(2,1);s.value=sub;s.font=font({color:{argb:MU},size:11});s.alignment={horizontal:'right'};}
    function head(ws,r,hs){hs.forEach((h,i)=>{const c=ws.getCell(r,i+1);c.value=h;c.font=font({bold:true});c.fill={type:'pattern',pattern:'solid',fgColor:{argb:PN}};c.alignment={horizontal:'right',vertical:'middle'};c.border={bottom:{style:'thin',color:{argb:'FF2BD4F0'}}}});ws.getRow(r).height=26}
    const sub=`تجمع الطائف الصحي · الإدارة التنفيذية للتشغيل · ${label} · ${DF.format(new Date())}`;
    // summary
    const s1=sheet('الملخص',[34,16,40]);title(s1,'دليل الأنظمة والخدمات الصحية',sub,3);head(s1,4,['القسم','عدد الروابط','ملاحظة']);let r=5;
    secs.forEach(s=>{const n=S.links.filter(l=>l.sid===s.id).length;s1.getCell(r,1).value=s.name;s1.getCell(r,1).font=font({bold:true,color:{argb:argb(s.color)}});s1.getCell(r,2).value=n;s1.getCell(r,2).font=font({bold:true,size:13});s1.getCell(r,3).value=s.id==='apps'?'روابط App Store و Google Play':'';r++});
    if(days.length){s1.getCell(r,1).value='الأيام الصحية';s1.getCell(r,1).font=font({bold:true,color:{argb:argb(DAY_C)}});s1.getCell(r,2).value=days.length;s1.getCell(r,2).font=font({bold:true,size:13});const nd=days[0];s1.getCell(r,3).value='القادم: '+nd.name+' ('+nd.d+' '+MONTHS[nd.m-1]+')';r++}
    r++;s1.mergeCells(r,1,r,3);s1.getCell(r,1).value='إعداد وتطوير: سالم سعد الشهري';s1.getCell(r,1).font=font({color:{argb:MU}});paint(s1,r,3);
    // links
    const web=secs.filter(s=>s.id!=='apps'||sc!=='all');const lst=[];secs.forEach(s=>sorted(S.links.filter(l=>l.sid===s.id&&!isApp(l))).forEach(l=>lst.push([s,l])));
    if(lst.length){const ws=sheet('الروابط',[28,34,36,50]);title(ws,'الروابط',sub,4);head(ws,4,['القسم','الاسم','الوصف','الرابط']);let i=5;
      lst.forEach(([s,l])=>{ws.getCell(i,1).value=s.name;ws.getCell(i,1).font=font({color:{argb:argb(s.color)},bold:true});ws.getCell(i,2).value=l.name;ws.getCell(i,2).font=font({bold:true});ws.getCell(i,3).value=l.desc||'';ws.getCell(i,3).font=font({color:{argb:MU}});
        ws.getCell(i,4).value={text:host(l.url)||l.url,hyperlink:l.url};ws.getCell(i,4).font=font({color:{argb:'FF2BD4F0'},underline:true});ws.getCell(i,4).alignment={horizontal:'left'};
        if(i%2===0)for(let c=1;c<=4;c++)ws.getCell(i,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF0A1A5E'}};i++});
      paint(ws,i,4);ws.autoFilter={from:{row:4,column:1},to:{row:i-1,column:4}};ws.views=[{rightToLeft:true,showGridLines:false,state:'frozen',ySplit:4}]}
    const apps=[];secs.forEach(s=>sorted(S.links.filter(l=>l.sid===s.id&&isApp(l))).forEach(l=>apps.push([s,l])));
    if(apps.length){const ws=sheet('التطبيقات',[24,34,24,24]);title(ws,'تطبيقات الجوال',sub,4);head(ws,4,['التطبيق','الوصف','آيفون','أندرويد']);let i=5;
      apps.forEach(([s,l])=>{ws.getCell(i,1).value=l.name;ws.getCell(i,1).font=font({bold:true,color:{argb:argb(s.color)}});ws.getCell(i,2).value=l.desc||'';ws.getCell(i,2).font=font({color:{argb:MU}});
        if(l.ios){ws.getCell(i,3).value={text:'App Store',hyperlink:l.ios};ws.getCell(i,3).font=font({color:{argb:'FF2BD4F0'},underline:true})}
        if(l.android){ws.getCell(i,4).value={text:'Google Play',hyperlink:l.android};ws.getCell(i,4).font=font({color:{argb:'FF34D399'},underline:true})}
        if(i%2===0)for(let c=1;c<=4;c++)ws.getCell(i,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF0A1A5E'}};i++});paint(ws,i,4)}
    if(days.length){const ws=sheet('الأيام الصحية',[22,48,22,26]);title(ws,'تقويم الأيام الصحية',sub,4);head(ws,4,['التاريخ','المناسبة','الأيام المتبقية','ملاحظة']);let i=5;
      daysSorted().forEach(d=>{const n=daysTo(d);ws.getCell(i,1).value=d.d+' '+MONTHS[d.m-1];ws.getCell(i,1).font=font({bold:true,color:{argb:argb(DAY_C)}});ws.getCell(i,2).value=d.name;ws.getCell(i,2).font=font({bold:true});ws.getCell(i,3).value=n===0?'اليوم':n;ws.getCell(i,3).font=font({color:{argb:n<=14?'FFFCD34D':MU}});ws.getCell(i,4).value=d.desc||'';
        if(i%2===0)for(let c=1;c<=4;c++)ws.getCell(i,c).fill={type:'pattern',pattern:'solid',fgColor:{argb:'FF0A1A5E'}};i++});paint(ws,i,4)}
    const buf=await wb.xlsx.writeBuffer();await deliver(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),fileSafe('دليل-الأنظمة-'+label)+'-'+stamp()+'.xlsx');toast('تم تجهيز ملف Excel')
  }finally{b.close()}
}
async function exportPDF(sc){
  const b=busy('جارٍ تجهيز ملف PDF…');
  try{await Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')]);
    try{await document.fonts.ready}catch(e){}
    const {secs,label,days}=scopeData(sc);
    // build rows
    const items=[];
    secs.forEach(s=>{const ls=sorted(S.links.filter(l=>l.sid===s.id));if(!ls.length)return;items.push({t:'h',n:s.name,c:s.color,k:ls.length});ls.forEach(l=>items.push({t:'r',l,c:s.color}))});
    if(days.length){items.push({t:'h',n:'الأيام الصحية',c:DAY_C,k:days.length});daysSorted().forEach(d=>items.push({t:'d',d}))}
    const W=794,H=1123,TOP=150,BOT=60,RH=38,HH=48;const pages=[];let cur=[],y=TOP;
    for(const it of items){const h=it.t==='h'?HH:RH;if(y+h>H-BOT||(it.t==='h'&&y+h+RH>H-BOT)){pages.push(cur);cur=[];y=TOP}it.y=y;cur.push(it);y+=h}
    if(cur.length)pages.push(cur);
    const root=document.createElement('div');root.style.cssText='position:fixed;top:0;left:-10000px;width:'+W+'px;z-index:-1';document.body.appendChild(root);
    const {jsPDF}=window.jspdf;const pdf=new jsPDF({unit:'px',format:[W,H],orientation:'portrait',hotfixes:['px_scaling']});
    const N=pages.length;
    for(let p=0;p<N;p++){
      root.innerHTML=`<div style="width:${W}px;height:${H}px;position:relative;background:#061452;color:#EEF2FF;font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;direction:rtl;overflow:hidden">
        <div style="position:absolute;top:0;left:0;right:0;height:120px;background:linear-gradient(135deg,#10236F,#061452);border-bottom:2px solid #2BD4F0;display:flex;align-items:center;gap:16px;padding:0 34px">
          <img src="img/logo-white.png" style="height:52px;padding-left:16px;border-left:1px solid #24408F">
          <div style="display:flex;flex-direction:column;gap:6px"><b style="font-family:Alexandria,sans-serif;font-size:22px;font-weight:700">دليل الأنظمة والخدمات الصحية</b><span style="font-size:13px;color:#C9D4FA">الإدارة التنفيذية للتشغيل · ${esc(label)}</span></div>
          <div style="margin-right:auto;text-align:left;font-size:12px;color:#9AA8D8;line-height:1.7">${DF.format(new Date())}<br>صفحة ${p+1} من ${N}</div></div>
        ${pages[p].map(it=>it.t==='h'?`<div style="position:absolute;right:34px;left:34px;top:${it.y+10}px;height:30px;display:flex;align-items:center;gap:10px;font-family:Alexandria,sans-serif;font-weight:700;font-size:16px;color:${it.c}"><span style="width:12px;height:12px;border-radius:3px;background:${it.c}"></span>${esc(it.n)}<span style="font-family:'IBM Plex Sans Arabic',sans-serif;font-weight:400;font-size:12px;color:#6F7FB5">${it.k}</span></div>`
          :it.t==='r'?`<div style="position:absolute;right:34px;left:34px;top:${it.y}px;height:${RH-6}px;background:#0A1A5E;border:1px solid #18307A;border-right:4px solid ${it.c};border-radius:8px;display:flex;align-items:center;gap:12px;padding:0 12px;font-size:13px"><b style="min-width:200px;font-weight:600">${esc(it.l.name)}</b><span style="color:#9AA8D8;flex:1;white-space:nowrap;overflow:hidden">${esc(it.l.desc||'')}</span><span style="direction:ltr;color:#2BD4F0;font-size:12px">${isApp(it.l)?'App Store · Google Play':esc(host(it.l.url))}</span></div>`
          :`<div style="position:absolute;right:34px;left:34px;top:${it.y}px;height:${RH-6}px;background:#0A1A5E;border:1px solid #18307A;border-right:4px solid ${DAY_C};border-radius:8px;display:flex;align-items:center;gap:12px;padding:0 12px;font-size:13px"><b style="min-width:90px;color:${DAY_C};font-family:Alexandria,sans-serif">${it.d.d} ${MONTHS[it.d.m-1]}</b><span style="flex:1;font-weight:600">${esc(it.d.name)}</span><span style="color:#9AA8D8;font-size:12px">${cdTxt(daysTo(it.d))}</span></div>`).join('')}
        <div style="position:absolute;bottom:0;left:0;right:0;height:44px;border-top:1px solid #24408F;display:flex;align-items:center;justify-content:space-between;padding:0 34px;font-size:11.5px;color:#9AA8D8"><span>تجمع الطائف الصحي · الإدارة التنفيذية للتشغيل</span><b style="color:#C9D4FA;font-weight:600">إعداد وتطوير: سالم سعد الشهري</b></div></div>`;
      await Promise.all([...root.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})));
      const cv=await html2canvas(root.firstElementChild,{scale:2,backgroundColor:'#061452',useCORS:true,logging:false});
      if(p)pdf.addPage([W,H],'portrait');pdf.addImage(cv.toDataURL('image/jpeg',0.9),'JPEG',0,0,W,H);
      pages[p].forEach(it=>{if(it.t==='r'){const u=openUrl(it.l);if(/^https?:/.test(u))pdf.link(34,it.y,W-68,RH-6,{url:u})}});
    }
    root.remove();
    await deliver(pdf.output('blob'),fileSafe('دليل-الأنظمة-'+label)+'-'+stamp()+'.pdf');toast('تم تجهيز ملف PDF، الروابط فيه قابلة للضغط');
  }finally{b.close()}
}

/* ---------- access & admin ---------- */
const API={pin:'',name:'',role:'',dev:''};
try{const p=JSON.parse(localStorage.getItem('thc-links-edit')||'{}');API.pin=p.pin||'';API.name=p.name||'';API.role=p.role||''}catch(e){}
try{API.dev=localStorage.getItem('thc-dev')||'';if(!API.dev){API.dev=uid()+uid();localStorage.setItem('thc-dev',API.dev)}}catch(e){API.dev=API.dev||uid()+uid()}
function saveApi(){try{localStorage.setItem('thc-links-edit',JSON.stringify({pin:API.pin,name:API.name,role:API.role}))}catch(e){}}
const ROLE_N={admin:'مسؤول',ops:'التشغيل'};const ROLE_C={admin:'#7C8CFF',ops:'#F5A524'};
const isAdmin=()=>!S.readonly&&API.role==='admin';
function hdrs(extra){return Object.assign({'x-edit-pin':API.pin,'x-device-id':API.dev,'x-editor-name':encodeURIComponent(API.name||'')},extra||{})}
function roleChip(e){const n=ROLE_N[e.role];return n?`<span class="lrole r-${e.role}">${n}</span>`:''}
const ADM={data:null,err:''};
async function loadAdmin(body){try{const r=await fetch('/api/admin',body?{method:'POST',headers:hdrs({'content-type':'application/json'}),body:JSON.stringify(body)}:{headers:hdrs(),cache:'no-store'});if(!r.ok)throw r.status;ADM.data=await r.json();ADM.err=''}catch(e){ADM.err='تعذّر تحميل الرموز'}fillAdmin()}
function fillAdmin(){const el=document.getElementById('admPanel');if(!el)return;if(ADM.err){el.innerHTML=`<p class="note">${ADM.err}</p>`;return}const d=ADM.data;if(!d){el.innerHTML='<p class="note">جارٍ تحميل الرموز…</p>';return}
  el.innerHTML=`<div class="admgrid">
    <div class="admcard"><h4><span class="sw" style="background:#7C8CFF"></span>المسؤولون <small>${d.admins.length} من ${d.maxAdmins}</small></h4>
      <p class="note">يعدلون كل شي، ومعهم سجل التعديلات وهذي الرموز. رمز المسؤول يقبل ${d.maxAdmins} أشخاص كحد أقصى، كل واحد على جهازه.</p>
      ${d.admins.map(a=>`<div class="admrow"><span class="lav" style="background:#7C8CFF;width:30px;height:30px">${esc((a.name||'؟').charAt(0))}</span><span class="xt"><b>${esc(a.name||'بدون اسم')}</b>${a.me?' <span class="lrole">أنت</span>':''}<small>${esc(a.device||'')} · آخر دخول ${a.last?DS.format(new Date(a.last))+' '+TF12.format(new Date(a.last)):'—'}</small></span>${a.me?'':`<button class="btn danger sm" data-rmadmin="${esc(a.id)}">إزالة</button>`}</div>`).join('')}</div>
    <div class="admcard"><h4><span class="sw" style="background:#F5A524"></span>رمز التشغيل</h4>
      <p class="note">يضيف ويعدّل ويحذف الروابط والأقسام والأيام الصحية، بدون سجل التعديلات.</p>
      <div class="admrow"><span class="pinv tab-num">${esc(d.opsPin)}</span><button class="btn ghost sm" data-copy="${esc(d.opsPin)}">نسخ</button><button class="btn ghost sm" data-regen="ops">رمز جديد</button></div></div></div>`}
function bindAdmin(){const el=document.getElementById('admPanel');if(!el)return;
  el.onclick=async e=>{const c=e.target.closest('[data-copy]');if(c){try{await navigator.clipboard.writeText(c.dataset.copy);toast('تم نسخ الرمز')}catch(err){toast('الرمز: '+c.dataset.copy)}return}
    const g=e.target.closest('[data-regen]');if(g){if(!g.classList.contains('armed')){g.classList.add('armed');g.textContent='تأكيد؟';return}await loadAdmin({action:'regen',target:'ops'});toast('تم إنشاء رمز جديد، الرمز القديم توقف');return}
    const r=e.target.closest('[data-rmadmin]');if(r){if(!r.classList.contains('armed')){r.classList.add('armed');r.textContent='تأكيد الإزالة';return}await loadAdmin({action:'removeAdmin',id:r.dataset.rmadmin});toast('تمت الإزالة')}};
  ADM.data?fillAdmin():loadAdmin()}
const LOG={entries:null,err:'',q:'',type:'all'};
async function loadLog(){try{const r=await fetch('/api/log',{headers:hdrs(),cache:'no-store'});if(!r.ok)throw r.status;LOG.entries=(await r.json()).entries||[];LOG.err=''}catch(e){LOG.err='تعذّر تحميل السجل'}fillLog()}
function renderLogShell(){$('#view').innerHTML=`<div class="logw" id="logw">
  <div class="loghead"><div><h2>السجل والرموز</h2><p class="note">كل دخول وكل تعديل على الدليل، مع الاسم والوقت والجهاز. يظهر للمسؤولين فقط.</p></div><div class="logact"><button class="btn" id="logRef">تحديث</button><button class="btn" id="logX">تصدير Excel</button></div></div>
  <details class="admbox" open><summary>رموز الدخول</summary><div id="admPanel"></div></details>
  <div class="logstats" id="logStats"></div>
  <div class="logfil"><label class="search"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3.5 3.5"/></svg><input id="logQ" type="search" placeholder="ابحث بالاسم أو الرابط"></label>
  <select class="sel" id="logT"><option value="all">الكل</option><option value="login">مرات الدخول</option><option value="edit">التعديلات</option></select></div>
  <div id="logList"></div></div>`;
  $('#logRef').onclick=()=>{LOG.entries=null;fillLog();loadLog();loadAdmin()};$('#logX').onclick=()=>exportLogExcel().catch(()=>toast('تعذّر التصدير'));
  $('#logQ').oninput=e=>{LOG.q=e.target.value;fillLog()};$('#logT').onchange=e=>{LOG.type=e.target.value;fillLog()};
  bindAdmin();LOG.entries?fillLog():loadLog()}
function logFiltered(){const q=LOG.q.trim();return (LOG.entries||[]).filter(e=>(LOG.type==='all'||(LOG.type==='login')===(e.action==='دخول'))&&(!q||(e.by+' '+(e.name||'')+' '+(e.fac||'')).includes(q)))}
function fillLog(){const el=$('#logList');if(!el)return;if(LOG.err){el.innerHTML=`<p class="note">${LOG.err}</p>`;return}if(!LOG.entries){el.innerHTML='<p class="note">جارٍ تحميل السجل…</p>';return}
  const all=LOG.entries,edits=all.filter(e=>e.action!=='دخول'),logins=all.filter(e=>e.action==='دخول'),td=DS.format(new Date());
  $('#logStats').innerHTML=[['إجمالي التعديلات',edits.length,'#2BD4F0'],['تعديلات اليوم',edits.filter(e=>DS.format(new Date(e.at))===td).length,'#22C55E'],['مرات الدخول اليوم',logins.filter(e=>DS.format(new Date(e.at))===td).length,'#F5A524'],['آخر دخول',logins[0]?TF12.format(new Date(logins[0].at)):'—','#A78BFA']].map(x=>`<div class="ls" style="--c:${x[2]}"><span>${x[0]}</span><b class="tab-num">${x[1]}</b></div>`).join('');
  const list=logFiltered();if(!list.length){el.innerHTML='<div class="empty"><b>لا توجد سجلات</b></div>';return}
  let html='',day='';
  for(const e of list.slice(0,400)){const d=DAYF.format(new Date(e.at));if(d!==day){if(day)html+='</div>';day=d;html+=`<h3 class="lday">${d}</h3><div class="lgrp">`}
    const av=`<div class="lav" style="background:${ROLE_C[e.role]||'#16307F'}">${esc((e.by||'؟').trim().charAt(0))}</div>`;
    if(e.action==='دخول'){html+=`<article class="le lin">${av}<div class="lbody"><div class="ltop"><b>${esc(e.by)}</b>${roleChip(e)}<span class="lact" style="--c:#F5A524">سجّل الدخول</span>${e.device?`<span class="note">من ${esc(e.device)}</span>`:''}<span class="ltime">${TF12.format(new Date(e.at))}</span></div></div></article>`;continue}
    const ac=e.action==='حذف'?'#FB7185':e.action==='إضافة'?'#22C55E':'#2BD4F0';
    html+=`<article class="le">${av}<div class="lbody"><div class="ltop"><b>${esc(e.by)}</b>${roleChip(e)}<span class="lact" style="--c:${ac}">${e.action} ${e.target}</span><span class="ltime">${TF12.format(new Date(e.at))}</span></div><div class="lname">${esc(e.name)}${e.fac?` <span class="note">· ${esc(e.fac)}</span>`:''}</div>${(e.changes||[]).length?`<ul class="lch">${e.changes.map(c=>`<li>${esc(c.label)}: <span class="lfrom">${esc(c.from)}</span> ← <span class="lto">${esc(c.to)}</span></li>`).join('')}</ul>`:''}</div></article>`}
  el.innerHTML=html+'</div>'}
async function exportLogExcel(){await loadScript('https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js');const wb=new ExcelJS.Workbook();const ws=wb.addWorksheet('السجل',{views:[{rightToLeft:true,state:'frozen',ySplit:1}]});
  ws.columns=[{header:'التاريخ',width:26},{header:'الوقت',width:12},{header:'الاسم',width:20},{header:'الصلاحية',width:12},{header:'الإجراء',width:20},{header:'القسم',width:24},{header:'العنصر',width:30},{header:'التفاصيل',width:60}];
  logFiltered().forEach(e=>ws.addRow([DAYF.format(new Date(e.at)),TF12.format(new Date(e.at)),e.by,ROLE_N[e.role]||'',e.action==='دخول'?'تسجيل دخول'+(e.device?' ('+e.device+')':''):e.action+' '+e.target,e.fac||'',e.name||'',(e.changes||[]).map(c=>`${c.label}: من ${c.from} إلى ${c.to}`).join(' | ')]));
  ws.eachRow((row,i)=>row.eachCell(c=>{c.fill={type:'pattern',pattern:'solid',fgColor:{argb:i===1?'FF10236F':i%2?'FF061452':'FF0A1A5E'}};c.font={name:'Arial',color:{argb:'FFEEF2FF'},bold:i===1}}));
  const buf=await wb.xlsx.writeBuffer();await deliver(new Blob([buf]),'سجل-دليل-الأنظمة-'+stamp()+'.xlsx')}

function setEdit(on){
  S.readonly=!on;document.body.classList.toggle('ro',!on);document.body.classList.toggle('editing',on);
  $('#editBtn').hidden=false;$('#editTxt').textContent=on?'إنهاء التعديل':'تعديل';$('#viewBar').hidden=on;
  $('#edName').textContent=(API.name||'')+(on?' ('+(ROLE_N[API.role]||'')+')':'');
  const adm=on&&API.role==='admin';$('#v-log').hidden=!adm;if(!adm){if(S.view==='log'){S.view='cards';remember()}LOG.entries=null;ADM.data=null;const lw=$('#logw');lw&&lw.remove()}
  if(!on){closeDrawer();if(API.pin){API.pin='';API.role='';try{localStorage.removeItem('thc-links-edit');sessionStorage.removeItem('thc-links-sess')}catch(e){}}}
  renderAll();
}
function loginModal(){
  modal(`<h3>✎ الدخول لوضع التعديل</h3><p class="note" style="margin:0">أدخل اسمك ورمز التعديل. يتذكر الجهاز الرمز فلا تحتاج إدخاله كل مرة.</p>
    <div class="f"><label for="lgName">اسمك (يظهر في السجل)</label><input id="lgName" required value="${esc(API.name)}" placeholder="مثال: سالم"></div>
    <div class="f"><label for="lgPin">رمز الدخول (رمز التشغيل أو رمز المسؤول)</label><input id="lgPin" required inputmode="numeric" autocomplete="off"></div>
    <p class="note" id="lgErr" style="margin:0;color:#FDA4AF" hidden>الرمز غير صحيح، تأكد منه وحاول مرة أخرى.</p>
    <div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-mclose>إلغاء</button><button class="btn pri">دخول</button></div>`,
  (h,close)=>{h.querySelector('#lgName').focus();h.querySelector('form').onsubmit=async e=>{e.preventDefault();const name=h.querySelector('#lgName').value.trim(),pin=h.querySelector('#lgPin').value.trim();
    let ok=null;try{ok=await S.db.ping(pin,name,true)}catch(err){}
    if(!ok||ok.error){const er=h.querySelector('#lgErr');er.textContent=ok&&ok.error==='admin-full'?'اكتمل عدد المسؤولين (5 أشخاص). اطلب من مسؤول حالي يزيل أحد المسجلين.':'الرمز غير صحيح، تأكد منه وحاول مرة أخرى.';er.hidden=false;return}
    API.pin=pin;API.name=name;API.role=ok.role;saveApi();try{sessionStorage.setItem('thc-links-sess','1')}catch(err){}close();setEdit(true);toast('أهلاً '+name+'، دخلت بصلاحية '+(ROLE_N[ok.role]||''))}});
}
function apiDb(){let st=null,pending=0;
  const apply=j=>{st=j;const m=o=>Object.entries(o||{}).map(([id,d])=>({id,...d}));S.sec=m(j.sections);S.links=m(j.links);S.days=m(j.days);S.loaded=true};
  return{
    async pull(){if(pending)return;const r=await fetch('/api/data',{cache:'no-store'});if(!r.ok)throw new Error('load');const j=await r.json();if(pending)return;if(!st||j.rev!==st.rev){apply(j);if(!S.openId)renderAll()}},
    async send(o){pending++;try{const r=await fetch('/api/data',{method:'POST',headers:hdrs({'content-type':'application/json'}),body:JSON.stringify(o)});
      if(r.status===401){setEdit(false);throw {code:'permission_denied'}}
      if(r.status===403){let j={};try{j=await r.json()}catch(e){}if(j.error==='admin-not-registered'){setEdit(false);toast('سجّل الدخول مرة ثانية برمز المسؤول')}throw {code:'forbidden'}}
      if(r.status===400){throw {code:'bad url'}}
      if(!r.ok)throw {code:'error'};st=await r.json()}finally{pending--}},
    async ping(pin,name,login){const r=await fetch('/api/data',{method:'POST',headers:{'content-type':'application/json','x-edit-pin':pin,'x-device-id':API.dev,'x-editor-name':encodeURIComponent(name||'')},body:JSON.stringify({op:'ping',login:!!login})});let j={};try{j=await r.json()}catch(e){}if(!r.ok)return {error:j.error||'pin'};return {role:j.role}}
  }}
async function useSnapshot(){try{const s=await (await fetch('/seed.json',{cache:'no-store'})).json();const m=o=>Object.entries(o||{}).map(([id,d])=>({id,...d}));S.sec=m(s.sections);S.links=m(s.links);S.days=m(s.days)}catch(e){}
  S.loaded=true;S.readonly=true;$('#sync').textContent='نسخة للعرض فقط';$('#editBtn').hidden=true;$('#viewBar').hidden=true;renderAll()}
async function start(){
  const db=apiDb();S.db=db;
  $('#editBtn').addEventListener('click',()=>{if(S.readonly)loginModal();else setEdit(false)});
  $('#edExit').addEventListener('click',()=>setEdit(false));
  renderAll();
  try{await db.pull()}catch(e){useSnapshot();return}
  $('#sync').innerHTML='<span class="dot" style="background:var(--s-done)"></span>متزامن · يتحدث تلقائياً';
  setEdit(!!API.pin);
  if(API.pin){let seen=false;try{seen=sessionStorage.getItem('thc-links-sess')==='1'}catch(e){}
    if(!seen)db.ping(API.pin,API.name,true).then(r=>{if(!r||r.error){setEdit(false);return}try{sessionStorage.setItem('thc-links-sess','1')}catch(e){}if(r.role!==API.role){API.role=r.role;saveApi();setEdit(true)}}).catch(()=>{})}
  setInterval(()=>{if(document.visibilityState==='visible')db.pull().catch(()=>{$('#sync').textContent='تعذّر التحديث، سيُعاد المحاولة'})},30000);
}
start();
})();
</script>
</body></html>
