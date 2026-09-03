// sw.js — Crowsnest Castle Service Worker
const CACHE = 'crowsnest-v1';

const FILES = [
  '/index.html',

  // Floor 1
  '/Rooms/floor1/floor1.html',
  '/Rooms/floor1/ballroom.html',
  '/Rooms/floor1/chapel.html',
  '/Rooms/floor1/drawingroom.html',
  '/Rooms/floor1/freezer.html',
  '/Rooms/floor1/kitchen.html',
  '/Rooms/floor1/library.html',
  '/Rooms/floor1/livingroom.html',
  '/Rooms/floor1/pantry.html',
  '/Rooms/floor1/storage.html',
  '/Rooms/floor1/washroom.html',
  '/Rooms/floor1/mystery-engine.js',
  '/Rooms/floor1/mystery-state.js',
  '/Rooms/floor1/mystery-ui.js',
  '/Rooms/floor1/evidence-system.js',
  '/Rooms/floor1/helpsystm.js',

  // Living Quarters
  '/Rooms/floor1/livingquarters/livingquarters.html',
  '/Rooms/floor1/livingquarters/room1.html',
  '/Rooms/floor1/livingquarters/room2.html',
  '/Rooms/floor1/livingquarters/room3.html',
  '/Rooms/floor1/livingquarters/room4.html',
  '/Rooms/floor1/livingquarters/room5.html',
  '/Rooms/floor1/livingquarters/room6.html',

  // Floor 2
  '/Rooms/floor2/floor2.html',
  '/Rooms/floor2/celticroom.html',
  '/Rooms/floor2/closetroom.html',
  '/Rooms/floor2/crystalroom.html',
  '/Rooms/floor2/gothicroom.html',
  "/Rooms/floor2/Knight'sroom.html",
  '/Rooms/floor2/medievalroom.html',
  '/Rooms/floor2/midnightchambers.html',
  '/Rooms/floor2/romandressingroom.html',
  '/Rooms/floor2/romansuite.html',
  '/Rooms/floor2/tudorroom.html',
  '/Rooms/floor2/victoriansuite.html',

  // Lord & Ladies Room
  '/Rooms/floor2/lordandladiesroom/lordandladiesroom.html',
  '/Rooms/floor2/lordandladiesroom/balcony.html',
  '/Rooms/floor2/lordandladiesroom/walkin-closet.html',

  // Basement
  '/Rooms/Basement/basement.html',

  // PWA files
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install — cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// Activate — delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});