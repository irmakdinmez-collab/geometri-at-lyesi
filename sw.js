/* Geometri Keşif Atölyesi — çevrimdışı çalışma için servis çalışanı.
   Uygulama güncellendiğinde SURUM değerini artırın; eski önbellek silinir. */
const SURUM = 'gka-v1';
const TEMEL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SURUM).then(c => c.addAll(TEMEL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== SURUM).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // Sayfa: önce ağ (güncel sürüm), ağ yoksa önbellek
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => { const k = r.clone(); caches.open(SURUM).then(c => c.put('./index.html', k)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // Diğer dosyalar ve yazı tipleri: önce önbellek, yoksa ağdan alıp sakla
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r && (r.ok || r.type === 'opaque')) { const k = r.clone(); caches.open(SURUM).then(c => c.put(req, k)); }
    return r;
  })));
});
