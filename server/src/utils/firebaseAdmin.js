import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  type: "service_account",
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  authUri: "https://accounts.google.com/o/oauth2/auth",
  tokenUri: "https://oauth2.googleapis.com/token",
  authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
  clientX509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universeDomain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (pushToken, title, body, data = {}) => {
  try {
 
    const dataMessage = {
      token: pushToken,
      data: { title, body, ...data }
    };

    
    console.log("📤 Sending   :", { title, body });
  
    const [dataResponse] = await Promise.all([
      admin.messaging().send(dataMessage),
    ]);
  
    console.log("✅ Data:", dataResponse);
    return { dataResponse };
  } catch (err) {
    console.error("❌ FCM Error:", err);
  }
};



