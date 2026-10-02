const CACHE_NAME = 'nicole0-editor-shell-v0.3.3';
const CACHE_PREFIX = 'nicole0-editor-shell-';
const SHELL = [
  './description-editor.html',
  './description-editor.js',
  './editor.webmanifest',
  './assets/editor/icon-192.png',
  './assets/editor/icon-512.png',
  './assets/editor/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

function isEditorShell(url) {
  const p = url.pathname;
  return p.endsWith('/description-editor.html') ||
         p.endsWith('/description-editor.js') ||
         p.endsWith('/editor.webmanifest') ||
         p.includes('/assets/editor/');
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !isEditorShell(url)) return;

  // Prefer the newest editor shell. Fall back to the installed shell offline.
  event.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req).then(cached => cached || caches.match('./description-editor.html')))
  );
});
