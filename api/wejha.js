/* بوابة تخزين لموقع «وِجهة»: تمرّر أوامر محدودة لقاعدة البيانات، على مفاتيح lk: فقط، برمز سري */
const R_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const R_TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
const ALLOW = new Set(['GET', 'SET', 'INCR', 'LPUSH', 'LTRIM', 'LRANGE']);
const okCmd = c => Array.isArray(c) && ALLOW.has(String(c[0]).toUpperCase()) && typeof c[1] === 'string' && c[1].startsWith('lk:');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.WEJHA_KEY;
  if (!key || req.headers.authorization !== 'Bearer ' + key) return res.status(401).json({ error: 'auth' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!R_URL || !R_TOK) return res.status(503).json({ error: 'nodb' });
  const pipe = String((req.query || {}).pipe || '') === '1';
  const cmds = pipe ? req.body : [req.body];
  if (!Array.isArray(cmds) || !cmds.length || cmds.length > 10 || !cmds.every(okCmd)) return res.status(400).json({ error: 'forbidden command' });
  try {
    const r = await fetch(R_URL.replace(/\/$/, '') + (pipe ? '/pipeline' : ''), { method: 'POST', headers: { Authorization: 'Bearer ' + R_TOK, 'content-type': 'application/json' }, body: JSON.stringify(pipe ? cmds : cmds[0]) });
    const t = await r.text();
    res.setHeader('content-type', 'application/json');
    return res.status(r.status).end(t);
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
};
