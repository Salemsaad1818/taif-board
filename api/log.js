const { auth, readLog } = require('./_store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method' });
  try {
    const a = await auth(req);
    if (a.role !== 'admin') return res.status(403).json({ error: 'admin only' });
    const { log } = await readLog();
    return res.status(200).json({ entries: log });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
