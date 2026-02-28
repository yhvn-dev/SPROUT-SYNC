import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const VAPID_KEY = "BME4hG6VTr7JC24lIO_p1H5hMw4DT3Ba35Mg_5D5z-hqL1EskJTF1Rw8KXfTCqejukY8bhDGWSZHk0X_GUdw9kk";

const firebaseConfig = {
  apiKey: "AIzaSyDutbmjQWIWYQD_swZiOQE9rLRCXqco2VM",
  authDomain: "sprout-sync-2e760.firebaseapp.com",
  projectId: "sprout-sync-2e760",
  storageBucket: "sprout-sync-2e760.appspot.com",
  messagingSenderId: "947217179064",
  appId: "1:947217179064:web:f8bb81328c98dee0eeef4d",
  measurementId: "G-MRP06197XP",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const showInPageNotification = (title, body) => {
  const container = document.getElementById("notification-container");
  if (!container) {
    console.warn("❌ Notification container not found!");
    return;
  }

  container.classList.remove("hidden");
  
  const notif = document.createElement("div");
  notif.className = "p-4 mb-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl border-l-4 border-green-400";
  notif.innerHTML = `
    <div class="font-bold text-lg mb-1 flex items-center">
      🌱 <span class="ml-2">${title}</span>
    </div>
    <div class="text-sm">${body}</div>
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => {
    if (notif.parentNode) notif.remove();
    if (container.children.length === 0) {
      container.classList.add("hidden");
    }
  }, 6000);
};

export const getPushToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Notification permission denied");
      return null;
    }

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    await navigator.serviceWorker.ready;
    
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("✅ FCM Token:", token?.substring(0, 20) + "...");
    return token;
  } catch (err) {
    console.error("❌ Push token error:", err);
    return null;
  }
};





export const listenForMessages = () => {
  console.log("🔥 Listener starting...");  
  onMessage(messaging, (payload) => {
    console.log("🚨 RAW PAYLOAD:", JSON.stringify(payload, null, 2));
    console.log("📱 DATA:", payload.data);
    console.log("📱 NOTIFICATION:", payload.notification);
    
    const title = payload.data?.title || payload.notification?.title || "SPROUT-SYNC";
    const body = payload.data?.body || payload.notification?.body || "New notification";
    
    console.log("🎯 SHOWING:", { title, body });
    showInPageNotification(title, body);
  });
  
  console.log("✅ Listener ACTIVE!");
};
