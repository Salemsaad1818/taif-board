const { hasDB, readState, writeState, auth, editorName, deviceLabel, appendLog, describe } = require('./_store');
const COLS = ['facilities', 'projects'];
const ID = /^[A-Za-z0-9_-]{1,64}$/;

function validParent(state, o) {
  const d = o.data || {};
  if (o.c !== 'projects' || !('pid' in d) || !d.pid) return true;
  if (d.pid === o.id) return false;
  const par = (state.projects || {})[d.pid];
  if (!par || par.pid) return false;
  const fid = 'fid' in d ? d.fid : ((state.projects || {})[o.id] || {}).fid;
  if (par.fid !== fid) return false;
  return !Object.values(state.projects || {}).some(x => x.pid === o.id);
}
function allowed(a, state, o) {
  if (!validParent(state, o)) return false;
  if (a.role === 'admin' || a.role === 'ops') return true;
  if (a.role !== 'facility') return false;
  if (o.c !== 'projects' || o.op === 'delete') return false;
  const cur = (state.projects || {})[o.id];
  if (cur && cur.fid !== a.fid) return false;
  if (o.op === 'set' && (o.data || {}).fid !== a.fid) return false;
  if (o.op === 'update' && o.data && 'fid' in o.data && o.data.fid !== a.fid) return false;
  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const { state, readonly } = await readState();
      res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
      return res.status(200).json(readonly ? { ...state, readonly: true } : state);
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
    if (!hasDB()) return res.status(503).json({ error: 'readonly' });
    const ops = Array.isArray(req.body?.ops) ? req.body.ops : [req.body || {}];
    const login = ops.some(o => o.op === 'ping' && o.login);
    const { state } = await readState();
    const a = await auth(req, { login, facilities: state.facilities });
    if (a.error) return res.status(a.status).json({ error: a.error });
    if (ops.every(o => o.op === 'ping')) {
      if (login) await appendLog([{ at: Date.now(), by: editorName(req), role: a.role, fid: a.fid || '', action: 'دخول', target: a.vp ? 'نائب الرئيس التنفيذي للتشغيل' : '', name: '', fac: a.fid ? ((state.facilities || {})[a.fid] || {}).name || '' : '', device: deviceLabel(req), changes: [] }]).catch(() => {});
      return res.status(200).json({ role: a.role, fid: a.fid || '', vp: !!a.vp });
    }
    const by = editorName(req), at = Date.now(), entries = [];
    let changed = false;
    for (const o of ops) {
      if (o.op === 'ping') continue;
      if (!COLS.includes(o.c) || !ID.test(String(o.id || ''))) return res.status(400).json({ error: 'bad op' });
      if (!allowed(a, state, o)) return res.status(403).json({ error: 'forbidden' });
      try { const d = describe(state, o); if (d.action !== 'تعديل' || d.changes.length) entries.push({ at, by, role: a.role, fid: a.fid || '', ...d }); } catch (e) {}
      const col = state[o.c] || (state[o.c] = {});
      if (o.op === 'set') col[o.id] = o.data || {};
      else if (o.op === 'update') { if (!col[o.id]) return res.status(404).json({ error: 'missing' }); col[o.id] = { ...col[o.id], ...(o.data || {}) }; }
      else if (o.op === 'delete') delete col[o.id];
      else return res.status(400).json({ error: 'bad op' });
      changed = true;
    }
    const out = changed ? await writeState(state) : state;
    if (entries.length) await appendLog(entries).catch(() => {});
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
