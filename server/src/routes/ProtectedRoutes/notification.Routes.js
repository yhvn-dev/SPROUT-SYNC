import * as notificationController from "../../controllers/notifications.Controller.js"
import express from "express";
import { verifyAccessToken } from "../../middlewares/authMiddleware.js";


const router = express.Router();

    router.get("/get/notif",verifyAccessToken,notificationController.getNotifications);
    router.get("/get/notif/count",verifyAccessToken,notificationController.getUnreadNotificationCount)
    router.get("/get/notif/notify",verifyAccessToken,notificationController.notifyReplantDate)
    router.get("/get/notif/test-harvest",verifyAccessToken,notificationController.testHarvestNotification)
    router.get("/get/notif/:notification_id",verifyAccessToken,notificationController.getNotificationById);
    router.post("/post/notif",verifyAccessToken,notificationController.createNotifController)
    router.post("/post/pushNotif",verifyAccessToken,notificationController.sendPushNotifications)
    router.put("/put/notif/read",verifyAccessToken,notificationController.markNotificationsAsRead)
    router.put("/put/notif/:notification_id",verifyAccessToken,notificationController.updateNotification);
    router.delete("/delete/notif/all",verifyAccessToken,notificationController.removeAllNotifications);
    router.delete("/delete/notif/:notification_id",verifyAccessToken,notificationController.deleteNotification);


export default router;
