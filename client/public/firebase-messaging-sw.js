importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDutbmjQWIWYQD_swZiOQE9rLRCXqco2VM",
  authDomain: "sprout-sync-2e760.firebaseapp.com",
  projectId: "sprout-sync-2e760",
  storageBucket: "sprout-sync-2e760.appspot.com",
  messagingSenderId: "947217179064",
  appId: "1:947217179064:web:f8bb81328c98dee0eeef4d",
});

const messaging = firebase.messaging();

// 🔥 FIXED: Skip DATA-ONLY messages
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] Background message:", payload);
  
  // CRITICAL: Skip pure data messages (let foreground onMessage handle)
  if (!payload.notification && payload.data) {
    console.log("[SW] Skipping data-only → Foreground will handle");
    return; 
  }
  
  // Only show notification for actual notification messages
  const title = payload.notification?.title || payload.data?.title || "SPROUT-SYNC";
  const body = payload.notification?.body || payload.data?.body || "New notification";
  
  const options = {
    body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "sprout-sync",
    renotify: true,
    vibrate: [200, 100, 200],
    data: { url: "/dashboard" },
  };

  self.registration.showNotification(title, options);
});




// Notification click handler (unchanged)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/dashboard";
  
  clients.matchAll({ type: "window", includeUncontrolled: true })
    .then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    });
});
