const seed = require('../seed.json');

/* ---- storage: Upstash Redis (REST), same database as the improvement board, keys prefixed «lk:» ---- */
const R_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const R_TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const hasDB = () => !!(R_URL && R_TOK);
async function redis(...cmd) {
  if (!hasDB()) throw Object.assign(new Error('no db'), { code: 'nodb' });
  const r = await fetch(R_URL, { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK, 'content-type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error('redis ' + (j.error || r.status));
  return j.result;
}
async function redisPipe(cmds) {
  if (!hasDB()) throw Object.assign(new Error('no db'), { code: 'nodb' });
  const r = await fetch(R_URL.replace(/\/$/, '') + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK, 'content-type': 'application/json' }, body: JSON.stringify(cmds) });
  const j = await r.json().catch(() => []);
  if (!r.ok) throw new Error('redis pipe ' + r.status);
  return j.map(x => x.result);
}
const K = { state: 'lk:state', cfg: 'lk:config', log: 'lk:audit', hits: 'lk:hits' };
const HIT_BASE = 103643;

function migrate(state) {
  // migration v2: add an icon to seeded links that have none (never overwrites edits)
  for (const [id, l] of Object.entries(seed.links || {})) {
    const cur = (state.links || {})[id];
    if (cur && !cur.icon && l.icon) cur.icon = l.icon;
  }
  // migration v3: Apple palette for the seeded sections, only if still on an older default colour
  const OLD = ['#2BD4F0', '#A78BFA', '#F5A524', '#34D399', '#60A5FA', '#56A7DD', '#63BDC1', '#A6C955', '#62A752', '#A09FA3'];
  for (const [id, sec] of Object.entries(seed.sections || {})) {
    const cur = (state.sections || {})[id];
    if (cur && OLD.includes(String(cur.color).toUpperCase())) cur.color = sec.color;
  }
  // migration v4: new links and the «أرقام مهمة» section, added once
  state.mig = state.mig || [];
  if (!state.mig.includes('v4')) {
    const V4 = ['apps-11', 'orgs-10', 'systems-27', 'systems-28', 'phones-1', 'phones-2', 'phones-3', 'phones-4', 'phones-5'];
    state.sections = state.sections || {}; state.links = state.links || {};
    if (!state.sections.phones) state.sections.phones = seed.sections.phones;
    for (const id of V4) if (!state.links[id]) state.links[id] = seed.links[id];
    state.mig.push('v4');
  }
  return state;
}

async function readState(opts) {
  opts = opts || {};
  let state = null, hits;
  if (hasDB()) {
    if (opts.hit) {
      const res = await redisPipe([['GET', K.state], ['SET', K.hits, HIT_BASE - 1, 'NX'], ['INCR', K.hits]]);
      if (res[0]) state = JSON.parse(res[0]);
      hits = +res[2] || undefined;
    } else {
      const raw = await redis('GET', K.state);
      if (raw) state = JSON.parse(raw);
    }
  }
  if (!state) state = JSON.parse(JSON.stringify(seed));
  return { state: migrate(state), blobs: [], hits };
}
async function writeState(state) {
  state.rev = (state.rev || 0) + 1;
  state.savedAt = Date.now();
  await redis('SET', K.state, JSON.stringify(state));
  return state;
}

/* ---- access codes & roles ---- */
const MAX_ADMINS = 5;
function genPin(used) { let p; do { p = String(Math.floor(200000 + Math.random() * 799999)); } while (used.has(p)); used.add(p); return p; }
async function readConfig() {
  let cfg = {};
  const raw = await redis('GET', K.cfg);
  if (raw) cfg = JSON.parse(raw);
  cfg.admins = cfg.admins || [];
  if (!cfg.opsPin) { cfg.opsPin = genPin(new Set([process.env.ADMIN_PIN || ''])); await writeConfig(cfg); }
  return { cfg, blobs: [] };
}
async function writeConfig(cfg) { await redis('SET', K.cfg, JSON.stringify(cfg)); }
function deviceLabel(req) {
  const ua = String(req.headers['user-agent'] || '');
  return /iPhone/.test(ua) ? 'آيفون' : /iPad/.test(ua) ? 'آيباد' : /Android/.test(ua) ? 'أندرويد' : /Windows/.test(ua) ? 'ويندوز' : /Mac OS/.test(ua) ? 'ماك' : 'جهاز آخر';
}
function editorName(req) {
  try { return decodeURIComponent(String(req.headers['x-editor-name'] || '')).slice(0, 60) || 'بدون اسم'; } catch (e) { return 'بدون اسم'; }
}
/* returns {role:'admin'|'ops', cfg, blobs} or {error,status} */
async function auth(req, opts) {
  opts = opts || {};
  const got = String(req.headers['x-edit-pin'] || '').trim();
  if (!got) return { error: 'pin', status: 401 };
  const { cfg, blobs } = await readConfig();
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
  return { error: 'pin', status: 401 };
}


/* ---- audit log (admin only) ---- */
async function readLog() {
  const arr = await redis('LRANGE', K.log, 0, 4999);
  return { log: (arr || []).map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean), blobs: [] };
}
async function appendLog(entries) {
  if (!entries.length) return;
  await redisPipe([['LPUSH', K.log, ...entries.slice().reverse().map(e => JSON.stringify(e))], ['LTRIM', K.log, 0, 4999]]);
}

const TGT = { links: 'رابط', sections: 'قسم', days: 'يوم صحي' };
const LBL = { icon: 'الأيقونة', name: 'الاسم', url: 'الرابط', desc: 'الوصف', sid: 'القسم', ios: 'رابط App Store', android: 'رابط Google Play', color: 'اللون', m: 'الشهر', d: 'اليوم' };
const short = v => { v = String(v ?? ''); return v.length > 90 ? v.slice(0, 90) + '…' : v; };
function describe(st, o) {
  const col = st[o.c] || {}, before = col[o.id], target = TGT[o.c] || o.c;
  const name = (o.data && o.data.name) || (before && before.name) || o.id;
  const secName = sid => ((st.sections || {})[sid] || {}).name || sid || '—';
  const sec = o.c === 'links' ? secName((before && before.sid) || (o.data && o.data.sid)) : '';
  if (o.op === 'delete') return { action: 'حذف', target, name, fac: sec, changes: [] };
  if (o.op === 'set' && !before) return { action: 'إضافة', target, name, fac: sec, changes: [] };
  const ch = [], d = o.data || {};
  for (const k of Object.keys(d)) {
    if (k === 'updatedAt' || k === 'order') continue;
    const a = before ? before[k] : undefined, b = d[k];
    if (JSON.stringify(a) === JSON.stringify(b)) continue;
    const fmt = v => k === 'sid' ? secName(v) : (short(v) || '—');
    ch.push({ label: LBL[k] || k, from: fmt(a), to: fmt(b) });
  }
  return { action: 'تعديل', target, name, fac: sec, changes: ch };
}


module.exports = { hasDB, readState, writeState, auth, readConfig, writeConfig, deviceLabel, MAX_ADMINS, editorName, readLog, appendLog, describe };
