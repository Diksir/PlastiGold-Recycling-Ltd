self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data?.json?.() || {
    title: 'PlastiGold Recycling Ltd',
    body: 'New update from PlastiGold Recycling Ltd.',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/assets/plastigold-logo-transparent.png',
      badge: '/assets/plastigold-logo-transparent.png',
    }),
  );
});
