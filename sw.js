const CACHE='aura-inventory-shell-v4';
const ROOT=new URL('./',self.location).pathname;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([ROOT,ROOT+'icon.svg']))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE&&(key.startsWith('aura-shell-')||key.startsWith('aura-inventory-shell-'))).map(key=>caches.delete(key))))));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==location.origin||url.pathname.startsWith('/api')||url.pathname.startsWith(ROOT+'api/'))return;
 event.respondWith((async()=>{
   const cache=await caches.open(CACHE),cached=await cache.match(event.request),asset=url.pathname.startsWith(ROOT+'assets/');
   // Content-hashed files never change. Prefer the verified copy already cached.
   if(asset&&cached)return cached;
   try{
     const response=await fetch(event.request);
     if(!response.ok)return cached||response;
     const type=response.headers.get('content-type')||'';
     // Never save a Pages HTML error/fallback as a JavaScript module.
     if(asset&&/\.m?js$/.test(url.pathname)&&!/javascript|ecmascript/i.test(type))return cached||new Response('Module temporarily unavailable',{status:503});
     await cache.put(event.request,response.clone());return response;
   }catch{
     return cached||(event.request.mode==='navigate'?await cache.match(ROOT):null)||Response.error();
   }
 })());
});
