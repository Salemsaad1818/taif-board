/* Cloudflare Pages adapter: runs the same api/*.js handlers on Workers with a D1 database bound as DB */
import { setBackend } from '../api/_store.js';
import data from '../api/data.js';
import admin from '../api/admin.js';
import log from '../api/log.js';

const HANDLERS = { data, admin, log };

let ready = null;
function d1Backend(db) {
  const init = () => ready || (ready = db.prepare('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)').run().catch(e => { ready = null; throw e; }));
  const be = {
    async get(k) { await init(); const r = await db.prepare('SELECT v FROM kv WHERE k = ?').bind(k).first(); return r ? r.v : null; },
    async set(k, v) { await init(); await db.prepare('INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').bind(k, v).run(); },
    async hit(base) {
      await init();
      const r = await db.prepare("INSERT INTO kv (k, v) VALUES ('hits', ?) ON CONFLICT(k) DO UPDATE SET v = CAST(CAST(v AS INTEGER) + 1 AS TEXT) RETURNING v").bind(String(base)).first();
      return +r.v;
    },
    async logPush(entries) { const cur = JSON.parse((await be.get('audit')) || '[]'); await be.set('audit', JSON.stringify(entries.concat(cur).slice(0, 3000))); },
    async logRange() { return JSON.parse((await be.get('audit')) || '[]'); }
  };
  return be;
}

/* one request at a time per isolate: keeps read-modify-write of the shared state safe */
let lock = Promise.resolve();
export function serve(context, name) {
  const run = lock.then(() => handle(context, name));
  lock = run.catch(() => {});
  return run;
}
async function handle(context, name) {
  const { request, env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: 'D1 binding DB is missing' }), { status: 500, headers: { 'content-type': 'application/json' } });
  setBackend(d1Backend(env.DB), { ADMIN_PIN: env.ADMIN_PIN || '' });
  const h = HANDLERS[name];
  if (!h) return new Response('not found', { status: 404 });
  const url = new URL(request.url);
  const headers = {}; request.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
  const raw = request.method === 'POST' ? await request.text() : '';
  const req = { method: request.method, headers, url: request.url, query: Object.fromEntries(url.searchParams) };
  if (raw) { try { req.body = JSON.parse(raw); } catch (e) { req.body = {}; } }
  let status = 200, body = ''; const out = {};
  const res = {
    setHeader(k, v) { out[k] = v; }, status(c) { status = c; return res; },
    json(o) { out['content-type'] = 'application/json; charset=utf-8'; body = JSON.stringify(o); return res; },
    end(b) { body = b || ''; return res; }
  };
  await h(req, res);
  return new Response(body, { status, headers: out });
}
