const { hasBridge, bridge, readState, readConfig, readLog, recordHist, auth } = require('./_store');
/* daily backup to Cloudflare D1 (Vercel cron) — or on demand by an admin */
async function runBackup() {
  const { state } = await readState();
  const { cfg } = await readConfig(state.facilities);
  const { log } = await readLog();
  const body = JSON.stringify({ at: Date.now(), state, config: cfg, log });
  const r = await bridge('backup', { method: 'POST', body, type: 'application/json' });
  await recordHist(state).catch(() => {});
  return { ...(await r.json()), size: body.length };
}
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const cron = process.env.CRON_SECRET && req.headers.authorization === 'Bearer ' + process.env.CRON_SECRET;
    if (!cron) {
      const { state } = await readState();
      const a = await auth(req, { facilities: state.facilities });
      if (a.role !== 'admin') return res.status(403).json({ error: 'admin only' });
    }
    if (!hasBridge()) return res.status(503).json({ error: 'nobridge' });
    return res.status(200).json(await runBackup());
  } catch (e) { return res.status(500).json({ error: 'server', detail: String(e.message || e).slice(0, 120) }); }
};
module.exports.runBackup = runBackup;
