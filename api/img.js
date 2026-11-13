const { redis, hasDB, K } = require('./_store');
const BR = process.env.TB_BRIDGE_URL || '';
module.exports = async (req, res) => {
  const q = req.query || {};
  const cf = String(q.cf || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);
  if (cf) {
    if (!BR) return res.status(404).end();
    try {
      const r = await fetch(BR + '?a=img&id=' + cf);
      if (!r.ok) return res.status(r.status === 404 ? 404 : 502).end();
      res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      return res.status(200).send(Buffer.from(await r.arrayBuffer()));
    } catch (e) { return res.status(502).end(); }
  }
  const id = String(q.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);
  if (!id || !hasDB()) return res.status(404).end();
  try {
    const v = await redis('GET', K.img + id);
    if (!v) return res.status(404).end();
    const i = v.indexOf(';');
    res.setHeader('Content-Type', v.slice(0, i));
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    return res.status(200).send(Buffer.from(v.slice(i + 1), 'base64'));
  } catch (e) { return res.status(500).end(); }
};
