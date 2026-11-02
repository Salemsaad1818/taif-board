const { pinRole, readLog } = require('./_store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method' });
  if (pinRole(req) !== 'admin') return res.status(403).json({ error: 'admin only' });
  try {
    const { log } = await readLog();
    return res.status(200).json({ entries: log });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
