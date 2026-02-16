importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// FIREBASE SDK.
firebase.initializeApp({
  apiKey: "AIzaSyDutbmjQWIWYQD_swZiOQE9rLRCXqco2VM",
  authDomain: "sprout-sync-2e760.firebaseapp.com",
  projectId: "sprout-sync-2e760",
  storageBucket: "sprout-sync-2e760.appspot.com",
  messagingSenderId: "947217179064",
  appId: "1:947217179064:web:f8bb81328c98dee0eeef4d",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload);
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/icon.png",
    }
  );
});
