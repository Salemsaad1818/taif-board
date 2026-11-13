const { readHist, hasBridge, bridge } = require('./_store');
module.exports = async (req, res) => {
  try {
    if (req.query && req.query.check) {
      res.setHeader('Cache-Control', 'no-store');
      if (!hasBridge()) return res.status(200).json({ bridge: 'off' });
      try { const j = await (await bridge('backups')).json(); return res.status(200).json({ bridge: 'ok', backups: (j.backups || []).length, files: j.files ? j.files.count : null }); }
      catch (e) { return res.status(200).json({ bridge: 'error', msg: String(e.message || e).slice(0, 80) }); }
    }
    const days = await readHist();
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ days });
  } catch (e) { res.setHeader('Cache-Control', 'no-store'); return res.status(500).json({ error: 'server' }); }
};
