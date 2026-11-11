const { auth, writeConfig, MAX_ADMINS } = require('./_store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const a = await auth(req);
    if (a.role !== 'admin') return res.status(403).json({ error: 'admin only' });
    const { cfg, blobs } = a;
    const me = String(req.headers['x-device-id'] || '');
    if (req.method === 'POST') {
      const b = req.body || {};
      if (b.action === 'removeAdmin') cfg.admins = cfg.admins.filter(x => x.id !== b.id || x.id === me);
      else if (b.action === 'regen' && b.target === 'ops') {
        let p; do { p = String(Math.floor(200000 + Math.random() * 799999)); } while (p === process.env.ADMIN_PIN || p === cfg.opsPin);
        cfg.opsPin = p;
      } else return res.status(400).json({ error: 'bad action' });
      await writeConfig(cfg, blobs);
    }
    return res.status(200).json({
      opsPin: cfg.opsPin,
      admins: cfg.admins.map(x => ({ id: x.id, name: x.name, device: x.device, at: x.at, last: x.last, me: x.id === me })),
      maxAdmins: MAX_ADMINS
    });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
