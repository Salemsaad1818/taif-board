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

function pinRole(req) {
  const got = String(req.headers['x-edit-pin'] || '');
  if (!got) return null;
  if (process.env.ADMIN_PIN && got === process.env.ADMIN_PIN) return 'admin';
  if (process.env.EDIT_PIN && got === process.env.EDIT_PIN) return 'editor';
  return null;
}
function pinOk(req) { return !!pinRole(req); }
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
const LBL = { name: 'الاسم', status: 'الحالة', progress: 'نسبة الإنجاز', start: 'تاريخ البداية', end: 'تاريخ النهاية', owner: 'المسؤول', desc: 'الوصف', fid: 'المنشأة', cover: 'صورة الغلاف', color: 'اللون', sub: 'الوصف المختصر' };
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
      const fmt = v => k === 'status' ? (STN[v] || v || '—') : k === 'progress' ? (v ?? 0) + '%' : k === 'fid' ? (((st.facilities || {})[v] || {}).name || v || '—') : (short(v) || '—');
      ch.push({ label: LBL[k] || k, from: fmt(a), to: fmt(b) });
    }
  }
  return { action: 'تعديل', target, name, fac, changes: ch };
}

module.exports = { readState, writeState, pinOk, pinRole, editorName, readLog, appendLog, describe };
