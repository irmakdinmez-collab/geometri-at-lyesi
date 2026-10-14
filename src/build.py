# Kaynak dosyaları birleştirip kök dizindeki index.html'i üretir: python3 src/build.py
import os
d=os.path.dirname(os.path.abspath(__file__))
js='\n'.join(open(os.path.join(d,f),encoding='utf-8').read() for f in ['core.js','t5.js','t6.js','t7.js','t8.js','boot.js'])
sh=open(os.path.join(d,'shell.html'),encoding='utf-8').read()
html='<!doctype html>\n<html lang="tr">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>body{margin:0}</style>\n'+sh.replace('/*JS*/','(function(){\n'+js+'\n})();').replace('<div class="app">','</head>\n<body>\n<div class="app">',1)+'\n</body>\n</html>\n'
open(os.path.join(d,'..','index.html'),'w',encoding='utf-8').write(html)
print('index.html güncellendi')
