'use strict';
const CACHE='psa-seguimiento-v0.2-20261105b';
const SCOPE=new URL('./',self.location.href).href;
const INDEX=new URL('index.html',SCOPE).href;
const PRESENTATION=new URL('simulador.html',SCOPE).href;
const SHELL=['./','./index.html','./simulador.html','./manifest.webmanifest','./assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('psa-seguimiento-') && key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if (request.method!=='GET' || !request.url.startsWith(SCOPE)) return;
  if (request.mode==='navigate') {
    const path=new URL(request.url).pathname;
    const key=path===new URL(PRESENTATION).pathname ? PRESENTATION :
      (path===new URL(SCOPE).pathname || path===new URL(INDEX).pathname ? INDEX : null);
    if (!key) return;
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try {
        const response=await fetch(request);
        if (response.ok) { await cache.put(key,response.clone()); return response; }
        return (await cache.match(key)) || response;
      } catch (error) {
        const saved=await cache.match(key);
        if (saved) return saved;
        throw error;
      }
    })());
    return;
  }
  const url=new URL(request.url);
  const shellUrls=SHELL.map(item=>new URL(item,SCOPE).pathname);
  if (shellUrls.includes(url.pathname)) {
    event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(request)) || fetch(request)));
  }
});
