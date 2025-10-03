if(!self.define){let e,i={};const r=(r,n)=>(r=new URL(r+".js",n).href,i[r]||new Promise(i=>{if("document"in self){const e=document.createElement("script");e.src=r,e.onload=i,document.head.appendChild(e)}else e=r,importScripts(r),i()}).then(()=>{let e=i[r];if(!e)throw new Error(`Module ${r} didn’t register its module`);return e}));self.define=(n,o)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let a={};const c=e=>r(e,s),d={module:{uri:s},exports:a,require:c};i[s]=Promise.all(n.map(e=>d[e]||c(e))).then(e=>(o(...e),a))}}define(["./workbox-a3cf1d8c"],function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"_astro/index.CBLsNiD-.css",revision:null},{url:"favicon.svg",revision:"8c13f40658976ea1dfb8ba37a8be0e8d"},{url:"images/crema_ordinary.webp",revision:"5c7936b6d439671a8e830e08852be7c3"},{url:"images/cremaByoma.png",revision:"92c539279c666952231a73bb1c0b5107"},{url:"images/latico.png",revision:"514be8aef10a5251a4497ab7a7f08152"},{url:"images/limpiador.png",revision:"678b626bdd62be973e2a9d9df0a9c233"},{url:"images/logo.png",revision:"cd97993677e6a76e61e74f58f5f127ae"},{url:"images/ordinary_hialuronico.webp",revision:"4ad83e92acf20be658e2bef9d9064e11"},{url:"images/serumByoma.png",revision:"4cac0492f84beade66e2e216eb616a84"},{url:"images/sol.png",revision:"f4ddeda36f1b82f3f1393eef4becb86b"},{url:"/",revision:"08290446431828e8133558e626368b1f"},{url:"manifest.webmanifest",revision:"3f8d3a6ac13c1a72f155df8f76adb8a1"}],{directoryIndex:"index.html"}),e.cleanupOutdatedCaches()});

// sw.js (añade estas handlers)
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  // Al hacer click intentamos enfocar una ventana existente o abrir la app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Permite que el cliente mande mensajes para que el SW muestre notificaciones (opcional)
self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data) return;
  if (data.type === 'show-notification' && data.title) {
    self.registration.showNotification(data.title, data.options || {});
  }
});
