import * as notificationController from "../../controllers/notifications.Controller.js"
import express from "express";

const router = express.Router();

router.get("/get/notif",notificationController.getNotifications);
router.get("/get/notif/count",notificationController.getUnreadNotificationCount)
router.get("/get/notif/:notification_id",notificationController.getNotificationById);
router.post("/post/notif",notificationController.createNotification);
router.put("/put/notif/read",notificationController.markNotificationsAsRead)
router.put("/put/notif/:notification_id",notificationController.updateNotification);
router.delete("/delete/notif/:notification_id",notificationController.deleteNotification);

export default router;
