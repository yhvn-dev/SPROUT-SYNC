// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");


// // Initialize Firebase in Service Worker
// firebase.initializeApp({
//   apiKey: "AIzaSyDutbmjQWIWYQD_swZiOQE9rLRCXqco2VM",
//   authDomain: "sprout-sync-2e760.firebaseapp.com",
//   projectId: "sprout-sync-2e760",
//   storageBucket: "sprout-sync-2e760.appspot.com",
//   messagingSenderId: "947217179064",
//   appId: "1:947217179064:web:f8bb81328c98dee0eeef4d",
// });

// const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log("[SW] Background message received:", payload);
//   // Extract title and body from data payload
//   const { title, body } = payload.data || {};

//   if (!title || !body) return;

//   self.registration.showNotification(title, {
//     body,
//     icon: "/SPROUTSYNC LOGO.png", // your app icon
//     badge: "/SPROUTSYNC LOGO.png", // optional badge
//     tag: "sprout-sync", // ensures same notification updates instead of stacking
//     renotify: true, // allows re-notification
//     data: { url: "/dashboard" }, // store any extra data (used on click)
//   });
// });

// // Handle notification click (opens page)
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close(); // close the popup

//   const clickResponsePromise = clients.matchAll({
//     type: "window",
//     includeUncontrolled: true,
//   }).then((clientList) => {
//     // If tab is already open, focus it
//     for (const client of clientList) {
//       if (client.url.includes(event.notification.data?.url) && "focus" in client) {
//         return client.focus();
//       }
//     }
//     // Otherwise open a new tab
//     if (clients.openWindow) {
//       return clients.openWindow(event.notification.data?.url || "/");
//     }
//   });

//   event.waitUntil(clickResponsePromise);
// });



