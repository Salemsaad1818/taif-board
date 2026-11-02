const { readState, writeState, pinRole, editorName, appendLog, describe } = require('./_store');
const COLS = ['facilities', 'projects'];
const ID = /^[A-Za-z0-9_-]{1,64}$/;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const { state } = await readState();
      return res.status(200).json(state);
    }
    if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
    const role = pinRole(req);
    if (!role) return res.status(401).json({ error: 'pin' });
    const ops = Array.isArray(req.body?.ops) ? req.body.ops : [req.body || {}];
    if (ops.every(o => o.op === 'ping')) return res.status(200).json({ role });
    const by = editorName(req), at = Date.now(), entries = [];
    const { state, blobs } = await readState();
    let changed = false;
    for (const o of ops) {
      if (o.op === 'ping') continue;
      if (!COLS.includes(o.c) || !ID.test(String(o.id || ''))) return res.status(400).json({ error: 'bad op' });
      try { const d = describe(state, o); if (d.action !== 'تعديل' || d.changes.length) entries.push({ at, by, role, ...d }); } catch (e) {}
      const col = state[o.c] || (state[o.c] = {});
      if (o.op === 'set') col[o.id] = o.data || {};
      else if (o.op === 'update') { if (!col[o.id]) return res.status(404).json({ error: 'missing' }); col[o.id] = { ...col[o.id], ...(o.data || {}) }; }
      else if (o.op === 'delete') delete col[o.id];
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
