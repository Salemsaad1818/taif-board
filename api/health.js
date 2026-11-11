/* فحص حالة المنصة لبوابة التشغيل: يرجع ok فقط، بدون أي بيانات */
const { redis, hasDB } = require('./_store');
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('content-type', 'application/json; charset=utf-8');
  if (req.method === 'OPTIONS') return res.status(204).end();
  let ok = false;
  try { ok = hasDB() && (await redis('PING')) === 'PONG'; } catch (e) { ok = false; }
  res.status(ok ? 200 : 503).end(JSON.stringify({ ok }));
};
