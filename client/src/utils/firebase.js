import { initializeApp } from "firebase/app";
import {getColorByStatus} from "../utils/colors";
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





export const showInPageNotification = (title, body, type = "info", status = "Low", isDark = false) => {
  const container = document.getElementById("notification-container");
  if (!container) {
    console.warn("❌ Notification container not found!");
    return;
  }

  container.classList.remove("hidden");  

  const colors = getColorByStatus(status, type, isDark);


  const iconMap = {
    high: '🔴', medium: '🟡', low: '🟢',
    warning: '⚠️', error: '❌', success: '✅', info: 'ℹ️'
  };
  const iconEmoji = iconMap[status?.toLowerCase()] || iconMap[type?.toLowerCase()] || '🌱';

  const notif = document.createElement("div");
  notif.style.cssText = `
    padding: 16px 20px;
    margin-bottom: 8px;
    background: ${colors.bg};
    border: 1px solid ${colors.border};
    color: ${colors.text};
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    max-width: 400px;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  `;
  
  notif.innerHTML = `
    <div style="
      width: 40px;
      height: 40px;
      background: ${colors.iconBg};
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 20px;
    ">
      ${iconEmoji}
    </div>
    <div style="flex: 1; min-width: 0;">
      <div style="
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 8px;">
        <span>${title}</span>
      
      </div>
      <div style="font-size: 14px; opacity: 0.95; margin-bottom: 4px;">
        ${body}
      </div>
     
    </div>
    <button onclick="this.parentElement.remove()" style="
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: ${colors.text};
      opacity: 0.7;
      padding: 4px;
      flex-shrink: 0;
    ">×</button>
  `;
  
  container.appendChild(notif);
  
  setTimeout(() => {
    if (notif.parentNode) notif.remove();
    if (container.children.length === 0) {
      container.classList.add("hidden");
    }
  }, 10000);
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
    
    // ✅ Extract type, status, title, body
    const type = payload.data?.type || "info";
    const status = payload.data?.status || "Low";
    const title = payload.data?.title || payload.notification?.title || "SPROUT-SYNC";
    const body = payload.data?.body || payload.notification?.body || "New notification";
    
    console.log("🎯 SHOWING:", { title, body, type, status });
    
    showInPageNotification(title, body, type, status);
  });
  
};