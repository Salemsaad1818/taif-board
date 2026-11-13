const { auth, readState, writeState, writeConfig, MAX_ADMINS, hasBridge, bridge, appendLog, editorName, deviceLabel, recordHist } = require('./_store');
const { runBackup } = require('./backup');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const { state } = await readState();
    const a = await auth(req, { facilities: state.facilities });
    if (a.role !== 'admin') return res.status(403).json({ error: 'admin only' });
    const { cfg, blobs } = a;
    if (req.method === 'POST') {
      const b = req.body || {};
      if (b.action === 'backups') {
        if (!hasBridge()) return res.status(200).json({ backups: [], nobridge: true });
        const r = await bridge('backups'); return res.status(200).json(await r.json());
      }
      if (b.action === 'backupNow') { if (!hasBridge()) return res.status(503).json({ error: 'nobridge' }); return res.status(200).json(await runBackup()); }
      if (b.action === 'restore') {
        if (!hasBridge() || !/^\d{4}-\d{2}-\d{2}$/.test(String(b.day || ''))) return res.status(400).json({ error: 'bad day' });
        await runBackup().catch(() => {});
        const r = await bridge('backup', { query: '&day=' + b.day }); const bk = await r.json();
        if (!bk || !bk.state || !bk.state.projects) return res.status(400).json({ error: 'bad backup' });
        const ns = bk.state; ns.rev = Math.max(state.rev || 0, ns.rev || 0);
        const out = await writeState(ns); await recordHist(out).catch(() => {});
        await appendLog([{ at: Date.now(), by: editorName(req), role: 'admin', fid: '', action: 'استرجاع نسخة احتياطية', target: b.day, name: '', fac: '', device: deviceLabel(req), changes: [] }]).catch(() => {});
        return res.status(200).json({ ok: true, rev: out.rev });
      }
      if (b.action === 'removeAdmin') cfg.admins = cfg.admins.filter(x => x.id !== b.id || x.id === String(req.headers['x-device-id'] || ''));
      else if (b.action === 'regen') {
        const used = new Set([process.env.ADMIN_PIN || '', process.env.VP_PIN || '', cfg.opsPin, cfg.qfsPin, ...Object.values(cfg.facilityPins)]);
        const gen = () => { let p; do { p = String(Math.floor(200000 + Math.random() * 799999)); } while (used.has(p)); return p; };
        if (b.target === 'ops') cfg.opsPin = gen();
        else if (b.target === 'qfs') cfg.qfsPin = gen();
        else if (cfg.facilityPins[b.target]) cfg.facilityPins[b.target] = gen();
        else return res.status(400).json({ error: 'bad target' });
      } else return res.status(400).json({ error: 'bad action' });
      await writeConfig(cfg);
    }
    const me = String(req.headers['x-device-id'] || '');
    return res.status(200).json({
      opsPin: cfg.opsPin,
      qfsPin: cfg.qfsPin || '',
      facilities: Object.keys(state.facilities || {}).map(id => ({ id, name: state.facilities[id].name, color: state.facilities[id].color, order: state.facilities[id].order || 0, pin: cfg.facilityPins[id] || '' })).sort((x, y) => x.order - y.order),
      admins: cfg.admins.map(x => ({ id: x.id, name: x.name, device: x.device, at: x.at, last: x.last, me: x.id === me })),
      maxAdmins: MAX_ADMINS
    });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
