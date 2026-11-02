const { auth, readState, writeConfig, MAX_ADMINS } = require('./_store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const { state } = await readState();
    const a = await auth(req, { facilities: state.facilities });
    if (a.role !== 'admin') return res.status(403).json({ error: 'admin only' });
    const { cfg, blobs } = a;
    if (req.method === 'POST') {
      const b = req.body || {};
      if (b.action === 'removeAdmin') cfg.admins = cfg.admins.filter(x => x.id !== b.id || x.id === String(req.headers['x-device-id'] || ''));
      else if (b.action === 'regen') {
        const used = new Set([process.env.ADMIN_PIN || '', cfg.opsPin, ...Object.values(cfg.facilityPins)]);
        const gen = () => { let p; do { p = String(Math.floor(200000 + Math.random() * 799999)); } while (used.has(p)); return p; };
        if (b.target === 'ops') cfg.opsPin = gen();
        else if (cfg.facilityPins[b.target]) cfg.facilityPins[b.target] = gen();
        else return res.status(400).json({ error: 'bad target' });
      } else return res.status(400).json({ error: 'bad action' });
      await writeConfig(cfg, blobs);
    }
    const me = String(req.headers['x-device-id'] || '');
    return res.status(200).json({
      opsPin: cfg.opsPin,
      facilities: Object.keys(state.facilities || {}).map(id => ({ id, name: state.facilities[id].name, color: state.facilities[id].color, order: state.facilities[id].order || 0, pin: cfg.facilityPins[id] || '' })).sort((x, y) => x.order - y.order),
      admins: cfg.admins.map(x => ({ id: x.id, name: x.name, device: x.device, at: x.at, last: x.last, me: x.id === me })),
      maxAdmins: MAX_ADMINS
    });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
