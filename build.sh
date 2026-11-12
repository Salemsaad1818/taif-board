#!/bin/sh
cd "$(dirname "$0")"
V=$(( $(git rev-list --count HEAD 2>/dev/null || echo 0) + 1 ))
{
cat <<'H'
<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#F2F2F7"><meta name="format-detection" content="telephone=no"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="وِجهة"><meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="icon" href="img/icon.svg" type="image/svg+xml"><link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="img/icon-180.png">
<title>وِجهة · دليل الموظف الصحي</title>
<meta name="author" content="سالم سعد الشهري">
<meta name="description" content="وِجهة: كل الروابط اللي يحتاجها الموظف الصحي في مكان واحد — أنظمة الوزارة، الجهات الصحية، المراجع، التطبيقات، والأيام الصحية">
<script>try{var t=JSON.parse(localStorage.getItem('thc-links2')||'{}').theme;if(!t)t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap">
H
cat src/style.css src/body.html
sed "s/__V__/2.$V/" src/app.js
} > index.html
