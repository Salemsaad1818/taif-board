# وِجهة · دليل الموظف الصحي

كل الروابط اللي يحتاجها الموظف الصحي في مكان واحد.
إعداد وتطوير: سالم سعد الشهري

## التشغيل على Cloudflare Pages
1. Cloudflare ← Workers & Pages ← Create ← Pages ← Connect to Git ← اختر المستودع والفرع.
2. إعدادات البناء: Framework = None · Build command = (فارغ) · Build output directory = `/`.
3. Storage & Databases ← D1 ← Create database باسم `health-wejha`.
4. المشروع ← Settings ← Bindings ← Add ← D1 database: الاسم `DB` واختر قاعدة `health-wejha`.
5. Settings ← Variables and Secrets ← Add: `ADMIN_PIN` (Secret) = رمز المسؤول.
6. Deployments ← Retry deployment (حتى تنطبق الربطات).

## الملفات
- `index.html` الواجهة (تُبنى من `src/` عبر `sh build.sh`).
- `api/` منطق الخادم — مشترك بين Cloudflare و Vercel.
- `functions/api/` مسارات Cloudflare Pages · `lib/cf.js` محوّل Cloudflare + تخزين D1.
