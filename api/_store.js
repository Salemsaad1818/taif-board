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

function pinOk(req) {
  const pin = process.env.EDIT_PIN || '';
  return pin && String(req.headers['x-edit-pin'] || '') === pin;
}

module.exports = { readState, writeState, pinOk };
