import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

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