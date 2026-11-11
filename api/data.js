const { readState, writeState, auth, editorName, deviceLabel, appendLog, describe } = require('./_store');
const COLS = ['sections', 'links', 'days'];
const ID = /^[A-Za-z0-9_-]{1,64}$/;
const URLRE = /^https?:\/\//i;

function clean(c, d) {
  d = d || {};
  for (const k of ['url', 'ios', 'android']) if (k in d && d[k] && !URLRE.test(String(d[k]))) return null;
  return d;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const { state } = await readState();
      return res.status(200).json(state);
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
    const ops = Array.isArray(req.body?.ops) ? req.body.ops : [req.body || {}];
    const login = ops.some(o => o.op === 'ping' && o.login);
    const a = await auth(req, { login });
    if (a.error) return res.status(a.status).json({ error: a.error });
    if (ops.every(o => o.op === 'ping')) {
      if (login) await appendLog([{ at: Date.now(), by: editorName(req), role: a.role, action: 'دخول', target: '', name: '', fac: '', device: deviceLabel(req), changes: [] }]).catch(() => {});
      return res.status(200).json({ role: a.role });
    }
    const { state, blobs } = await readState();
    const by = editorName(req), at = Date.now(), entries = [];
    let changed = false;
    for (const o of ops) {
      if (o.op === 'ping') continue;
      if (!COLS.includes(o.c) || !ID.test(String(o.id || ''))) return res.status(400).json({ error: 'bad op' });
      if (o.op !== 'delete' && !clean(o.c, o.data)) return res.status(400).json({ error: 'bad url' });
      try { const d = describe(state, o); if (d.action !== 'تعديل' || d.changes.length) entries.push({ at, by, role: a.role, ...d }); } catch (e) {}
      const col = state[o.c] || (state[o.c] = {});
      if (o.op === 'set') col[o.id] = o.data || {};
      else if (o.op === 'update') { if (!col[o.id]) return res.status(404).json({ error: 'missing' }); col[o.id] = { ...col[o.id], ...(o.data || {}) }; }
      else if (o.op === 'delete') {
        delete col[o.id];
        if (o.c === 'sections') for (const [lid, l] of Object.entries(state.links || {})) if (l.sid === o.id) delete state.links[lid];
      }
      else return res.status(400).json({ error: 'bad op' });
      changed = true;
    }
    const out = changed ? await writeState(state, blobs) : state;
    if (entries.length) await appendLog(entries).catch(() => {});
    return res.status(200).json(out);
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
