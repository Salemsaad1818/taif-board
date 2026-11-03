const { put, list, del } = require('@vercel/blob');
const seed = require('./_seed.json');
const PREFIX = 'board/state-';

const ph=(src,label)=>({src:'img/'+src+'.jpg',label});
const MIGRATIONS=[
  {id:'m1-ayadati-report',run(st){
    const F=st.facilities||{},P=st.projects||{};
    if(F.kfh)F.kfh.name='مجمع الملك فيصل الطبي';
    const INTRO='ضمن مبادرة «عيادتي» لتعزيز جاهزية بيئة تقديم الخدمة والارتقاء بمستوى الخدمات المقدمة للمستفيدين.';
    const add=(pid,opts)=>{const p=P[pid];if(!p)return;
      if(opts.name&&p.name==='مشروع عيادتي')p.name=opts.name;
      if(opts.desc&&(!p.desc||p.desc==='تضمين هوية الصحة القابضة في العيادات.'))p.desc=opts.desc;
      const have=new Set((p.photos||[]).map(x=>x.src));
      p.photos=[...(p.photos||[]),...opts.photos.filter(x=>!have.has(x.src))];
      if(!p.cover&&opts.cover)p.cover=opts.cover;
      p.updatedAt=Date.now();};
    const set=(pre,n)=>[1,2,3,4].map(i=>ph(pre+'_b'+i,'قبل')).concat([1,2,3,4].map(i=>ph(pre+'_a'+i,'بعد')));
    add('onco-clinics',{photos:[ph('fac_kash','المنشأة'),...set('ay_kash')]});
    add('kfh-1',{name:'مشروع عيادتي – مركز العيون',desc:'تطوير عيادات مركز العيون '+INTRO,cover:'img/ay_kfmc_a3.jpg',photos:[ph('fac_kfmc','المنشأة'),...set('ay_kfmc')]});
    add('eradah-clinics',{desc:'تطوير عيادات مجمع إرادة والصحة النفسية '+INTRO,cover:'img/ay_er_a1.jpg',photos:[ph('fac_eradah','المنشأة'),...set('ay_er')]});
  }}
,
  {id:'m2-split-kash-ayadati',run(st){
    const P=st.projects||(st.projects={}),on=P['onco-clinics'];
    if(!on||P['kash-ayadati'])return;
    const isAy=x=>/img\/(ay_kash_|fac_kash)/.test(x.src||'');
    const ay=(on.photos||[]).filter(isAy);
    on.photos=(on.photos||[]).filter(x=>!isAy(x));
    if(on.name==='مشروع عيادتي – مركز الأورام')on.name='مشروع مركز الأورام';
    if(on.cover&&isAy({src:on.cover}))on.cover=(on.photos[0]||{}).src||'';
    on.updatedAt=Date.now();
    P['kash-ayadati']={fid:on.fid||'kash',name:'مشروع عيادتي',desc:'تطوير عيادات مستشفى الملك عبدالعزيز التخصصي ضمن مبادرة «عيادتي» لتعزيز جاهزية بيئة تقديم الخدمة والارتقاء بمستوى الخدمات المقدمة للمستفيدين.',status:'todo',progress:0,start:'',end:'',owner:'',cover:'img/ay_kash_a2.jpg',photos:ay,tasks:[],updates:[],order:(on.order??2)+0.5,updatedAt:Date.now()};
  }}
,
  {id:'m3-remove-eradah-dental-dates',run(st){
    const F=st.facilities||{},P=st.projects||{};
    delete F.eradah;
    for(const id of Object.keys(P)) if(P[id].fid==='eradah') delete P[id];
    const d=P['dental-clinics'];
    if(d){d.start='2026-11-05';d.end='2026-11-28';
      if(!d.desc||d.desc==='تضمين هوية الصحة القابضة في العيادات.')d.desc='تطوير 10 عيادات في مركز طب الأسنان التخصصي ضمن مبادرة «عيادتي» وتضمين هوية الصحة القابضة.';
      d.updatedAt=Date.now();}
  }}
,
  {id:'m4-add-peds-pt',run(st){
    const F=st.facilities||(st.facilities={});
    if(!F['peds-pt'])F['peds-pt']={name:'العلاج الطبيعي للأطفال',sub:'',color:'#A78BFA',order:6};
  }}
,
  {id:'m5-children-hospital-physio',run(st){
    const F=st.facilities||{},P=st.projects||(st.projects={});
    if(F['peds-pt']&&F['peds-pt'].name==='العلاج الطبيعي للأطفال')F['peds-pt'].name='مستشفى الأطفال';
    if(F['peds-pt']&&!P['peds-physio'])P['peds-physio']={fid:'peds-pt',name:'مشروع العلاج الطبيعي',desc:'تحسين قسم العلاج الطبيعي للأطفال.',status:'todo',progress:0,start:'',end:'',owner:'',cover:'',photos:[],tasks:[],updates:[],order:1,updatedAt:Date.now()};
  }}
,
  {id:'m6-kfmc-er-icu-opd',run(st){
    const P=st.projects||(st.projects={}),now=Date.now();
    let n=0;const tk=arr=>arr.map((t,i)=>({id:'m6'+(++n),t,done:false,when:''}));
    const vinyl=['إزالة الفينيل','رفع المخلفات وتنظيف الأرضيات','أعمال التسوية','أعمال اللحام'];
    const er={fid:'kfh',name:'مشروع صيانة الطوارئ',desc:'صيانة أرضيات قسم الطوارئ خلال 4 أيام، وتشمل: إزالة الفينيل، رفع المخلفات وتنظيف الأرضيات، أعمال التسوية، أعمال اللحام.',start:'2026-11-04',end:'2026-11-07',tasks:tk(vinyl)};
    const old=P['kfh-3'];
    if(old&&old.name==='فينيل الطوارئ والعناية المركزة'){Object.assign(old,er,{updatedAt:now})}
    else if(!P['kfh-er'])P['kfh-er']={...er,status:'todo',progress:0,owner:'',cover:'',photos:[],updates:[],order:3,updatedAt:now};
    if(!P['kfh-icu'])P['kfh-icu']={fid:'kfh',name:'مشروع صيانة فينيل العناية المركزة',desc:'صيانة فينيل العناية المركزة خلال 20 يوماً، وتشمل: إزالة الفينيل، رفع المخلفات وتنظيف الأرضيات، أعمال التسوية، أعمال اللحام.',start:'2026-12-01',end:'2026-12-20',status:'todo',progress:0,owner:'',cover:'',photos:[],tasks:tk(vinyl),updates:[],order:3.5,updatedAt:now};
    if(!P['kfh-opd'])P['kfh-opd']={fid:'kfh',name:'مشروع صيانة 15 عيادة بالعيادات الخارجية',desc:'صيانة 15 عيادة في العيادات الخارجية خلال شهر، وتشمل الأرضيات والأسقف والدهانات.',start:'2026-11-01',end:'2026-11-30',status:'prog',progress:0,owner:'',cover:'',photos:[],tasks:tk(['الأرضيات','الأسقف','الدهانات']),updates:[],order:1.5,updatedAt:now};
  }}
,
  {id:'m7-kfmc-10-clinics',run(st){
    const P=st.projects||(st.projects={});
    if(!P['kfh-10cl'])P['kfh-10cl']={fid:'kfh',name:'مشروع صيانة 10 عيادات',desc:'صيانة 10 عيادات خلال شهر، وتشمل: إصلاح الأرضيات، رفع المخلفات وتنظيف الأرضيات، أعمال التسوية، أعمال النجارة.',start:'2026-12-01',end:'2026-12-30',status:'todo',progress:0,owner:'',cover:'',photos:[],
      tasks:['إصلاح الأرضيات','رفع المخلفات وتنظيف الأرضيات','أعمال التسوية','أعمال النجارة'].map((t,i)=>({id:'m7'+(i+1),t,done:false,when:''})),updates:[],order:3.7,updatedAt:Date.now()};
  }}
,
  {id:'m8-dental-10-subclinics',run(st){
    const P=st.projects||(st.projects={}),par=P['dental-clinics'];
    if(!par||par.pid)return;
    for(let i=1;i<=10;i++){const id='dental-cl-'+i;if(P[id])continue;
      P[id]={fid:par.fid,pid:'dental-clinics',name:'تطوير عيادة '+i,desc:'تطوير العيادة رقم '+i+' في مركز طب الأسنان التخصصي ضمن مبادرة «عيادتي».',status:'todo',progress:0,start:par.start||'',end:par.end||'',owner:'',cover:'',photos:[],tasks:[],updates:[],order:i,updatedAt:Date.now()};}
  }}
];
function migrate(st){st.migrations=st.migrations||[];let ch=false;for(const m of MIGRATIONS){if(!st.migrations.includes(m.id)){m.run(st);st.migrations.push(m.id);ch=true}}return ch}


async function loadRaw() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  if (!blobs.length) return { state: JSON.parse(JSON.stringify(seed)), blobs: [] };
  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  const r = await fetch(blobs[0].url, { cache: 'no-store' });
  if (!r.ok) throw new Error('read failed');
  return { state: await r.json(), blobs };
}
async function readState() {
  const res = await loadRaw();
  if (migrate(res.state)) { await writeState(res.state, res.blobs); }
  return res;
}

async function writeState(state, oldBlobs) {
  state.rev = (state.rev || 0) + 1;
  state.savedAt = Date.now();
  const name = PREFIX + String(state.savedAt).padStart(15, '0') + '.json';
  await put(name, JSON.stringify(state), { access: 'public', contentType: 'application/json', addRandomSuffix: true, cacheControlMaxAge: 60 });
  const stale = oldBlobs.slice(30);
  if (stale.length) await del(stale.map(b => b.url)).catch(() => {});
  return state;
}

/* ---- access codes & roles ---- */
const CFGP = 'board/config-';
const MAX_ADMINS = 5;
function genPin(used) { let p; do { p = String(Math.floor(200000 + Math.random() * 799999)); } while (used.has(p)); used.add(p); return p; }
async function readConfig(stateFacilities) {
  const { blobs } = await list({ prefix: CFGP, limit: 1000 });
  let cfg = {}, dirty = false;
  if (blobs.length) {
    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    const r = await fetch(blobs[0].url, { cache: 'no-store' });
    if (r.ok) cfg = await r.json();
  }
  cfg.facilityPins = cfg.facilityPins || {};
  cfg.admins = cfg.admins || [];
  const used = new Set([process.env.ADMIN_PIN || '', cfg.opsPin || '', ...Object.values(cfg.facilityPins)]);
  if (!cfg.opsPin) { cfg.opsPin = genPin(used); dirty = true; }
  for (const fid of Object.keys(stateFacilities || {})) if (!cfg.facilityPins[fid]) { cfg.facilityPins[fid] = genPin(used); dirty = true; }
  if (dirty) await writeConfig(cfg, blobs);
  return { cfg, blobs };
}
async function writeConfig(cfg, oldBlobs) {
  await put(CFGP + String(Date.now()).padStart(15, '0') + '.json', JSON.stringify(cfg), { access: 'public', contentType: 'application/json', addRandomSuffix: true, cacheControlMaxAge: 60 });
  const stale = (oldBlobs || []).slice(3);
  if (stale.length) await del(stale.map(b => b.url)).catch(() => {});
}
function deviceLabel(req) {
  const ua = String(req.headers['user-agent'] || '');
  return /iPhone/.test(ua) ? 'آيفون' : /iPad/.test(ua) ? 'آيباد' : /Android/.test(ua) ? 'أندرويد' : /Windows/.test(ua) ? 'ويندوز' : /Mac OS/.test(ua) ? 'ماك' : 'جهاز آخر';
}
/* returns {role:'admin'|'ops'|'facility', fid?, cfg} or {error,status} */
async function auth(req, opts) {
  opts = opts || {};
  const got = String(req.headers['x-edit-pin'] || '').trim();
  if (!got) return { error: 'pin', status: 401 };
  const facilities = opts.facilities || (await readState()).state.facilities;
  const { cfg, blobs } = await readConfig(facilities);
  if (process.env.ADMIN_PIN && got === process.env.ADMIN_PIN) {
    const dev = String(req.headers['x-device-id'] || '').slice(0, 64);
    if (!dev) return { error: 'device', status: 400 };
    let me = cfg.admins.find(a => a.id === dev);
    if (!me) {
      if (!opts.login) return { error: 'admin-not-registered', status: 403 };
      if (cfg.admins.length >= MAX_ADMINS) return { error: 'admin-full', status: 403 };
      me = { id: dev, name: editorName(req), device: deviceLabel(req), at: Date.now(), last: Date.now() };
      cfg.admins.push(me); await writeConfig(cfg, blobs);
    } else if (opts.login) { me.name = editorName(req); me.device = deviceLabel(req); me.last = Date.now(); await writeConfig(cfg, blobs); }
    return { role: 'admin', cfg, blobs };
  }
  if (got === cfg.opsPin) return { role: 'ops', cfg, blobs };
  const fid = Object.keys(cfg.facilityPins).find(k => cfg.facilityPins[k] === got && (facilities || {})[k]);
  if (fid) return { role: 'facility', fid, cfg, blobs };
  return { error: 'pin', status: 401 };
}
function editorName(req) {
  try { return decodeURIComponent(String(req.headers['x-editor-name'] || '')).slice(0, 60) || 'بدون اسم'; } catch (e) { return 'بدون اسم'; }
}

/* ---- audit log (admin only) ---- */
const LOGP = 'board/audit-';
async function readLog() {
  const { blobs } = await list({ prefix: LOGP, limit: 1000 });
  if (!blobs.length) return { log: [], blobs: [] };
  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  const r = await fetch(blobs[0].url, { cache: 'no-store' });
  return { log: r.ok ? await r.json() : [], blobs };
}
async function appendLog(entries) {
  if (!entries.length) return;
  const { log, blobs } = await readLog();
  const next = entries.concat(log).slice(0, 5000);
  await put(LOGP + String(Date.now()).padStart(15, '0') + '.json', JSON.stringify(next), { access: 'public', contentType: 'application/json', addRandomSuffix: true, cacheControlMaxAge: 60 });
  const stale = blobs.slice(4);
  if (stale.length) await del(stale.map(b => b.url)).catch(() => {});
}

const STN = { todo: 'لم يبدأ', prog: 'قيد التنفيذ', final: 'لمسات نهائية', stuck: 'متعثر', done: 'مكتمل' };
const LBL = { pid: 'المشروع الرئيسي', name: 'الاسم', status: 'الحالة', progress: 'نسبة الإنجاز', start: 'تاريخ البداية', end: 'تاريخ النهاية', owner: 'المسؤول', desc: 'الوصف', fid: 'المنشأة', cover: 'صورة الغلاف', color: 'اللون', sub: 'الوصف المختصر' };
const short = v => { v = String(v ?? ''); return v.length > 90 ? v.slice(0, 90) + '…' : v; };
function describe(st, o) {
  const col = st[o.c] || {}, before = col[o.id], target = o.c === 'projects' ? 'مشروع' : 'منشأة';
  const name = (o.data && o.data.name) || (before && before.name) || o.id;
  const fac = before && o.c === 'projects' ? ((st.facilities || {})[before.fid] || {}).name || '' : '';
  if (o.op === 'delete') return { action: 'حذف', target, name, fac, changes: [] };
  if (o.op === 'set' && !before) return { action: 'إضافة', target, name, fac: o.c === 'projects' ? ((st.facilities || {})[o.data?.fid] || {}).name || '' : '', changes: [] };
  const ch = [], d = o.data || {};
  for (const k of Object.keys(d)) {
    if (k === 'updatedAt' || k === 'order') continue;
    const a = before ? before[k] : undefined, b = d[k];
    if (JSON.stringify(a) === JSON.stringify(b)) continue;
    if (k === 'tasks') {
      const A = a || [], B = b || [], ai = new Map(A.map(t => [t.id, t])), bi = new Map(B.map(t => [t.id, t]));
      B.filter(t => !ai.has(t.id)).forEach(t => ch.push({ text: 'أضاف مهمة: ' + short(t.t) }));
      A.filter(t => !bi.has(t.id)).forEach(t => ch.push({ text: 'حذف مهمة: ' + short(t.t) }));
      B.filter(t => ai.has(t.id) && !!ai.get(t.id).done !== !!t.done).forEach(t => ch.push({ text: (t.done ? 'أنجز مهمة: ' : 'أعاد فتح مهمة: ') + short(t.t) }));
    } else if (k === 'photos') {
      const A = a || [], B = b || [], as = new Set(A.map(x => x.src)), bs = new Set(B.map(x => x.src));
      const add = B.filter(x => !as.has(x.src)), rem = A.filter(x => !bs.has(x.src));
      if (add.length) ch.push({ text: 'أضاف ' + add.length + ' صورة' + (add[0].label ? ' (' + add[0].label + ')' : ''), photos: add.map(x => x.src).slice(0, 6) });
      if (rem.length) ch.push({ text: 'حذف ' + rem.length + ' صورة' });
    } else if (k === 'updates') {
      const A = a || [], as = new Set(A.map(u => u.at + '|' + u.text));
      (b || []).filter(u => !as.has(u.at + '|' + u.text)).forEach(u => ch.push({ text: 'كتب تحديثاً: ' + short(u.text) }));
    } else if (k === 'cover') {
      ch.push({ text: 'غيّر صورة الغلاف' });
    } else {
      const fmt = v => k === 'status' ? (STN[v] || v || '—') : k === 'progress' ? (v ?? 0) + '%' : k === 'fid' ? (((st.facilities || {})[v] || {}).name || v || '—') : k === 'pid' ? (v ? (((st.projects || {})[v] || {}).name || v) : 'بدون (رئيسي)') : (short(v) || '—');
      ch.push({ label: LBL[k] || k, from: fmt(a), to: fmt(b) });
    }
  }
  return { action: 'تعديل', target, name, fac, changes: ch };
}

module.exports = { readState, writeState, auth, readConfig, writeConfig, deviceLabel, MAX_ADMINS, editorName, readLog, appendLog, describe };
