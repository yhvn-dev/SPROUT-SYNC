

// src/utils/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BME4hG6VTr7JC24lIO_p1H5hMw4DT3Ba35Mg_5D5z-hqL1EskJTF1Rw8KXfTCqejukY8bhDGWSZHk0X_GUdw9kk";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDutbmjQWIWYQD_swZiOQE9rLRCXqco2VM",
  authDomain: "sprout-sync-2e760.firebaseapp.com",
  projectId: "sprout-sync-2e760",
  storageBucket: "sprout-sync-2e760.appspot.com",
  messagingSenderId: "947217179064",
  appId: "1:947217179064:web:f8bb81328c98dee0eeef4d",
  measurementId: "G-MRP06197XP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const getPushToken = async () => {
  try {
    // 1️⃣ Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    await navigator.serviceWorker.ready;
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });
    

    console.log("Push token obtained:", token);
    return token;
  } catch (err) {
    console.error("Failed to get push token:", err);
    return null;
  }
};


/**
 * Listen for foreground messages
 * @param {function} callback - Function to handle incoming payload
 */



export const listenForMessages = () => {
    onMessage(messaging, (payload) => {
      console.log("📩 Foreground message received:", payload);

      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: "/icon.png",
        });
      }
    });
};







