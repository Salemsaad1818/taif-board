const { put, list, del } = require('@vercel/blob');
const seed = require('./_seed.json');
const PREFIX = 'board/state-';

async function readState() {
  const { blobs } = await list({ prefix: PREFIX, limit: 1000 });
  if (!blobs.length) return { state: JSON.parse(JSON.stringify(seed)), blobs: [] };
  blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  const r = await fetch(blobs[0].url, { cache: 'no-store' });
  if (!r.ok) throw new Error('read failed');
  return { state: await r.json(), blobs };
}

async function writeState(state, oldBlobs) {
  state.rev = (state.rev || 0) + 1;
  state.savedAt = Date.now();
  const name = PREFIX + String(state.savedAt).padStart(15, '0') + '.json';
  await put(name, JSON.stringify(state), { access: 'public', contentType: 'application/json', addRandomSuffix: true, cacheControlMaxAge: 60 });
  const stale = oldBlobs.slice(30);
  if (stale.length) await del(stale.map(b => b.url)).catch(() => {});
  return state;
}

function pinOk(req) {
  const pin = process.env.EDIT_PIN || '';
  return pin && String(req.headers['x-edit-pin'] || '') === pin;
}

module.exports = { readState, writeState, pinOk };
