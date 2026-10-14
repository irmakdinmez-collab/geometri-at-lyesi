# Geometri Keşif Atölyesi

Ortaokul (5–8. sınıf) geometri konuları için etkileşimli bir web uygulaması. Öğrenci önce sınıfını seçer, sonra büyük kare kartlardan bir konuya girer. Her konuda şekilleri sürükleyerek keşfettiği etkinlikler, formüllerin nereden geldiğini gösteren **Neden?** animasyonları ve kendini sınadığı görevler bulunur.

## Konular

| Sınıf | Konular |
|---|---|
| 5 | Noktadan Sonsuza · Açı Avcıları · Kenar Köşe Kulübü · Şekil Ailesi · Pergelin Sırrı · Kutu Atölyesi |
| 6 | Kesişme Noktası · Kes, Kaydır, Bul · Pi Peşinde · Kutunun İçi ve Dışı · Damla Damla Litre |
| 7 | Paralel Dedektifi · Kaç Üçgen Sığar? · Pizza Matematiği · Üçgenin Gizli Çizgileri · Üç Göz Bakışı |
| 8 | Kenar Kavgası · İkiz mi, Kuzen mi? · Karelerin Dansı · Ayna ve Kaydırak · Cisimler Galerisi |

## Kullanım

`index.html` dosyasını bir tarayıcıda açmak yeterli; kurulum gerekmez. **Tahta modu** yazıları büyütür ve görevleri gizler. Öğrenci ilerlemesi her tarayıcının kendi hafızasında tutulur.

## Uygulama olarak yükleme

Site GitHub Pages'ten açıldığında uygulama olarak yüklenebilir ve internet olmadan da çalışır.

- **Bilgisayar (Chrome, Edge):** Sağ üstteki **Uygulamayı yükle** düğmesine ya da adres çubuğundaki yükleme simgesine tıklayın.
- **Android:** Chrome'da **Uygulamayı yükle** düğmesine ya da menüden **Ana ekrana ekle**'ye dokunun.
- **iPhone / iPad:** Safari'de **Paylaş** düğmesine, sonra **Ana Ekrana Ekle**'ye dokunun.

Yüklenen uygulama kendi simgesiyle, tarayıcı çubukları olmadan tam ekran açılır.

## Geliştirme

Kaynak kod `src/` klasöründedir:

- `shell.html` – sayfa iskeleti ve stiller
- `core.js` – ortak çizim, 3B ve uygulama araçları
- `t5.js` … `t8.js` – her sınıfın konuları ve etkinlikleri

Değişiklikten sonra `python3 src/build.py` komutu kök dizindeki `index.html` dosyasını yeniden üretir. Yüklenmiş uygulamaların güncellemeyi alması için `sw.js` içindeki `SURUM` değerini de artırın (örneğin `gka-v2`).

Uygulama dosyaları: `manifest.webmanifest` (ad, renkler, simgeler), `sw.js` (çevrimdışı önbellek), `icons/` (uygulama simgeleri).
