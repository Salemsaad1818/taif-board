const { redis, hasDB, K } = require('./_store');

module.exports = async (req, res) => {
  const id = String((req.query && req.query.id) || '').replace(/[^a-z0-9]/gi, '').slice(0, 40);
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
