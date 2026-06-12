/* =========================================
   カロリーノート オフライン対応
   （アプリのファイルだけを端末に保存して、
     電波がない場所でも開けるようにします。
     ブログ側のページにはさわりません）
   ========================================= */

const CACHE_NAME = "kenko-note-v1";

// オフラインでも使えるようにしておくファイル
const APP_FILES = [
  "health.html",
  "health.css",
  "health.js",
  "foods.js",
  "manifest.webmanifest",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
];

function isAppFile(url) {
  const path = new URL(url).pathname;
  return APP_FILES.some((f) => path.endsWith("/" + f));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// アプリのファイルだけ：キャッシュから即表示しつつ、裏で最新版に更新する
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !isAppFile(event.request.url)) return;
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const fetching = fetch(event.request)
        .then((res) => {
          if (res && res.ok) cache.put(event.request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached || fetching;
    })
  );
});
