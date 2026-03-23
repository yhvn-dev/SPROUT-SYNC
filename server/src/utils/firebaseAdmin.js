import admin from "firebase-admin";
import serviceAccount from "../config/serviceAccount.json" with { type: "json" };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const sendPushNotification = async (pushToken, title, body, type = "info", status = "Low", data = {}) => {
  try {
    const dataMessage = {
      token: pushToken,
      data: { title, body, type, status, ...data }
    };
    const dataResponse = await admin.messaging().send(dataMessage);
    return { dataResponse };
  } catch (err) {
    console.error("❌ FCM Error:", err);
  }
};