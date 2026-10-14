# Kaynak dosyaları birleştirip kök dizindeki index.html'i üretir: python3 src/build.py
import os
d=os.path.dirname(os.path.abspath(__file__))
js='\n'.join(open(os.path.join(d,f),encoding='utf-8').read() for f in ['core.js','t5.js','t6.js','t7.js','t8.js','boot.js'])
sh=open(os.path.join(d,'shell.html'),encoding='utf-8').read()
html='<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="5–8. sınıf geometri konuları için etkileşimli keşif atölyesi.">\n<link rel="manifest" href="manifest.webmanifest">\n<meta name="theme-color" content="#1c3360">\n<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="Geometri">\n<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n<style>body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}[hidden]{display:none!important}</style>\n'+sh.replace('/*JS*/','(function(){\n'+js+'\n})();').replace('<div class="app">','</head>\n<body>\n<div class="app">',1)+'\n</body>\n</html>\n'
open(os.path.join(d,'..','index.html'),'w',encoding='utf-8').write(html)
print('index.html güncellendi')
