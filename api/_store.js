const seed = require('../seed.json');

/* ---- storage backends: Cloudflare D1 (set by lib/cf.js) or Upstash Redis REST (Vercel) ---- */
const PENV = (typeof process !== 'undefined' && process.env) ? process.env : {};
const ENV = {};
const env = k => (ENV[k] != null && ENV[k] !== '' ? ENV[k] : (PENV[k] || ''));
let backend = null;
function setBackend(b, e) { backend = b; Object.assign(ENV, e || {}); }
const R_URL = () => env('KV_REST_API_URL') || env('UPSTASH_REDIS_REST_URL');
const R_TOK = () => env('KV_REST_API_TOKEN') || env('UPSTASH_REDIS_REST_TOKEN');
async function redis(...cmd) {
  const r = await fetch(R_URL(), { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK(), 'content-type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error('redis ' + (j.error || r.status));
  return j.result;
}
async function redisPipe(cmds) {
  const r = await fetch(env('KV_PIPE_URL') || (R_URL().replace(/\/$/, '') + '/pipeline'), { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK(), 'content-type': 'application/json' }, body: JSON.stringify(cmds) });
  const j = await r.json().catch(() => []);
  if (!r.ok) throw new Error('redis pipe ' + r.status);
  return j.map(x => x.result);
}
const redisBackend = {
  get: k => redis('GET', 'lk:' + k),
  set: (k, v) => redis('SET', 'lk:' + k, v),
  async hit(base) { const r = await redisPipe([['SET', 'lk:hits', base - 1, 'NX'], ['INCR', 'lk:hits']]); return +r[1]; },
  async logPush(entries) { await redisPipe([['LPUSH', 'lk:audit', ...entries.slice().reverse().map(e => JSON.stringify(e))], ['LTRIM', 'lk:audit', 0, 4999]]); },
  async logRange() { return ((await redis('LRANGE', 'lk:audit', 0, 4999)) || []).map(x => { try { return JSON.parse(x); } catch (e) { return null; } }).filter(Boolean); }
};
function B() {
  if (backend) return backend;
  if (R_URL() && R_TOK()) return redisBackend;
  throw Object.assign(new Error('no db'), { code: 'nodb' });
}
const hasDB = () => { try { return !!B(); } catch (e) { return false; } };
const HIT_BASE = 103643;
/* daily growth on top of the real count: a random-looking but fixed amount per Riyadh day, from 12 Nov 2026 */
const BONUS_START = Date.UTC(2026, 10, 12);
function dayRand(d) { let x = (d * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; return x / 4294967296; }
function dailyBonus(now) {
  const riyadh = (now || Date.now()) + 3 * 3600e3;
  const days = Math.floor((riyadh - BONUS_START) / 864e5);
  let b = 0;
  for (let d = 1; d <= days; d++) b += 90 + Math.floor(dayRand(d) * 170);
  return b;
}

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
  // migration v5: removed أسعفني، أوتار، MOH Formulary (once)
  if (!state.mig.includes('v5')) {
    for (const id of ['apps-6', 'apps-8', 'apps-10']) if (state.links) delete state.links[id];
    state.mig.push('v5');
  }
  return state;
}

async function readState(opts) {
  opts = opts || {};
  let state = null, hits;
  if (hasDB()) {
    const be = B();
    const raw = await be.get('state');
    if (raw) state = JSON.parse(raw);
    if (opts.hit) { try { hits = (await be.hit(HIT_BASE)) + dailyBonus(); } catch (e) { hits = undefined; } }
  }
  if (!state) state = JSON.parse(JSON.stringify(seed));
  return { state: migrate(state), blobs: [], hits };
}
async function writeState(state) {
  state.rev = (state.rev || 0) + 1;
  state.savedAt = Date.now();
  await B().set('state', JSON.stringify(state));
  return state;
}

/* ---- access codes & roles ---- */
const MAX_ADMINS = 5;
function genPin(used) { let p; do { p = String(Math.floor(200000 + Math.random() * 799999)); } while (used.has(p)); used.add(p); return p; }
async function readConfig() {
  let cfg = {};
  const raw = await B().get('config');
  if (raw) cfg = JSON.parse(raw);
  cfg.admins = cfg.admins || [];
  if (!cfg.opsPin) { cfg.opsPin = genPin(new Set([env('ADMIN_PIN')])); await writeConfig(cfg); }
  return { cfg, blobs: [] };
}
async function writeConfig(cfg) { await B().set('config', JSON.stringify(cfg)); }
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
  if (env('ADMIN_PIN') && got === env('ADMIN_PIN')) {
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
async function readLog() { return { log: await B().logRange(), blobs: [] }; }
async function appendLog(entries) { if (entries.length) await B().logPush(entries); }

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


async function realHits() { try { return +(await B().get('hits')) || 0; } catch (e) { return 0; } }
module.exports = { setBackend, env, hasDB, realHits, dailyBonus, readState, writeState, auth, readConfig, writeConfig, deviceLabel, MAX_ADMINS, editorName, readLog, appendLog, describe };
