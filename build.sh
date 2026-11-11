#!/bin/sh
cd "$(dirname "$0")"
{
cat <<'H'
<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#061452"><meta name="format-detection" content="telephone=no"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><link rel="apple-touch-icon" href="img/logo-white.png"><link rel="icon" href="img/logo-white.png">
<title>دليل الأنظمة والخدمات الصحية · تجمع الطائف الصحي</title>
<meta name="author" content="سالم سعد الشهري">
<meta name="description" content="دليل أنظمة وزارة الصحة والجهات الصحية والمراجع الطبية والتطبيقات وتقويم الأيام الصحية">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Alexandria:wght@500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap">
H
cat src/base.css
cat src/extra.css src/body.html
cat src/app.js
} > index.html
