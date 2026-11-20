const CACHE = 'wx-v22';
const SHELL = ['./', 'index.html', 'quotes.js', 'puzzle-words.js', 'manifest.webmanifest', 'icon.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

// Network first, always revalidating the app's own files (GitHub Pages sends max-age=600,
// which would otherwise let the phone reuse a stale copy for 10 minutes). Cache is the offline fallback.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('.supabase.co')) return;   // never cache account data; let it go straight to the network
  const sameOrigin = new URL(e.request.url).origin === location.origin;
  const net = sameOrigin ? fetch(e.request.url, {cache:'no-cache', credentials:'same-origin'}) : fetch(e.request);
  e.respondWith(
    net.then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {}); }
        return res;
      })
      .catch(() => caches.match(e.request, {ignoreSearch:true}))
  );
});
