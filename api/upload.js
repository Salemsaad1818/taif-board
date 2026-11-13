const { auth, redis, hasDB, K, hasBridge, bridge } = require('./_store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!hasDB()) return res.status(503).json({ error: 'readonly' });
  const a = await auth(req);
  if (a.error) return res.status(a.status).json({ error: a.error });
  const type = String(req.headers['content-type'] || '');
  if (!/^image\/(jpeg|png|webp)$/.test(type)) return res.status(415).json({ error: 'type' });
  try {
    const chunks = []; let size = 0;
    for await (const ch of req) { size += ch.length; if (size > 3 * 1024 * 1024) return res.status(413).json({ error: 'too big' }); chunks.push(ch); }
    const buf = Buffer.concat(chunks);
    if (hasBridge() && buf.length <= 1900000) {
      try { const r = await bridge('put', { method: 'POST', body: buf, type }); const j = await r.json(); if (j.id) return res.status(200).json({ url: '/api/img?cf=' + j.id }); } catch (e) {}
    }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    await redis('SET', K.img + id, type + ';' + buf.toString('base64'));
    return res.status(200).json({ url: '/api/img?id=' + id });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
