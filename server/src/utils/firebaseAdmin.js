import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve("./src/config/serviceAccountKey.json"), "utf-8")

);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendPushNotification = async (pushToken, title, body, data = {}) => {
  try {
    const message = {
      token: pushToken,
      data: {
        title: String(title),
        body: String(body),
        ...data,
      },
    };

    console.log("DATA", data);
    const response = await admin.messaging().send(message);
    console.log("FCM sent:", response);
    return response;
  } catch (err) {
    console.error("FCM Error:", err);
  }
};

