/* Only the app's API endpoints are served; source files in the repository are never exposed */
const ALLOWED = /^\/api\/(data|admin|log)\/?$/;
const SEC = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
export async function onRequest(context) {
  const path = new URL(context.request.url).pathname;
  if (!ALLOWED.test(path)) return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8', ...SEC } });
  const res = await context.next();
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(SEC)) out.headers.set(k, v);
  return out;
}
