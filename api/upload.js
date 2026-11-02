const { put } = require('@vercel/blob');
const { auth } = require('./_store');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const a = await auth(req);
  if (a.error) return res.status(a.status).json({ error: a.error });
  const type = String(req.headers['content-type'] || '');
  if (!/^image\/(jpeg|png|webp)$/.test(type)) return res.status(415).json({ error: 'type' });
  try {
    const chunks = []; let size = 0;
    for await (const ch of req) { size += ch.length; if (size > 4 * 1024 * 1024) return res.status(413).json({ error: 'too big' }); chunks.push(ch); }
    const ext = type.split('/')[1].replace('jpeg', 'jpg');
    const blob = await put('board/photos/photo.' + ext, Buffer.concat(chunks), { access: 'public', contentType: type, addRandomSuffix: true });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
};
