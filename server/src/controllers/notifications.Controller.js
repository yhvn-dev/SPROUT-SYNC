import * as notificationModel from "../models/notificationModels.js";
import * as sensorModel from "../models/sensorModels.js";
import * as plantBatchModel from "../models/plantBatchesModels.js"
import * as trayModel from "../models/trayModels.js"
import * as trayGroupModel from "../models/trayGroupsModel.js"
import { toDateOnlyUTC } from "../utils/schedules.js";

  

// ===== GET all notifications =====
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.readNotif()
    res.status(200).json(notifications);
    console.log("NOTIFICATIONS:", notifications);
  } catch (err) {
    console.error("CONTROLLER: Error getting notifications", err);
    res.status(500).json({ message: "Error getting notifications", err });
  }
};


// ===== GET notification by ID =====
export const getNotificationById = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notification = await notificationModel.readNotifById(notification_id)

    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(notification);
    console.log("NOTIFICATION:", notification);
  } catch (err) {
    console.error("CONTROLLER: Error getting notification by ID", err);
    res.status(500).json({ message: "Error getting notification", err });
  }
};


export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await notificationModel.readTotalUnreadNotifCount()
    res.status(200).json(count);
    console.log("NOTIFICATION:", count );
  } catch (err) {
    console.error("CONTROLLER: Error getting notification count", err);
    res.status(500).json({ message: "Error getting notification count", err });
  }
};


export const markNotificationsAsRead = async (req, res) => {
    try {
        const isRead = await notificationModel.markAllNotificationsAsRead();
        console.log("✅ Model returned:", isRead); // Add this
        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("CONTROLLER: Error marking all notifications as read", error);
        res.status(500).json({ message: "Error marking all notifications as read" });
    }
};


export const createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    const notification = await notificationModel.createNotif(notificationData);
    res.status(201).json(notification);
    console.log("NOTIFICATION CREATED:", notification);

  } catch (err) {
    console.error("CONTROLLER: Error creating notification", err);
    res.status(500).json({ message: "Error creating notification", err });
  }
};





export const notifyReplantDate = async (req, res) => {
  try {
    const batchData = await plantBatchModel.readPlantBatches();
    console.log("🌱 Checking batches:", batchData.length);

    const today = toDateOnlyUTC(new Date());
    const notifiedBatches = [];

    for (const batch of batchData) {
      if (!batch.date_planted || batch.expected_harvest_days == null) continue;

      const planted = toDateOnlyUTC(new Date(batch.date_planted));
      const expectedDays = Number(batch.expected_harvest_days);

      const harvestDate = new Date(planted);
      harvestDate.setUTCDate(harvestDate.getUTCDate() + expectedDays);

      const msPerDay = 1000 * 60 * 60 * 24;
      const daysRemaining = Math.ceil(
        (harvestDate.getTime() - today.getTime()) / msPerDay
      );

      // 🔍 Debug
      console.log({
        batch_id: batch.batch_id,
        plant: batch.plant_name,
        planted: planted.toISOString().slice(0, 10),
        harvest: harvestDate.toISOString().slice(0, 10),
        today: today.toISOString().slice(0, 10),
        daysRemaining
      });

      if (daysRemaining === 1) {
        const tray = await trayModel.readTrayById(batch.tray_id);
        const tray_group_id = tray?.tray_group_id;
        const trayGroup = await trayGroupModel.readTrayGroupById(tray_group_id);
        const location = trayGroup?.location || "Unknown";

        await notificationModel.createNotif({
          type: "Info",
          status: "Medium",
          message: 
            `🌱 Harvest Reminder\n` +
            `1 Day Remaining before harvest \n\n` +
            `Plant:    ${batch.plant_name}\n` +
            `Location: ${location}\n` +
            `Planted:  ${planted.toISOString().slice(0,10)}\n` +
            `Expected Harvest: ${harvestDate.toISOString().slice(0,10)}`
        });

        // ✅ Save both batch_id and plant_name
        notifiedBatches.push({ batch_id: batch.batch_id, plant_name: batch.plant_name });
      }
    }

    res.status(200).json({
      success: true,
      message: notifiedBatches.length
        ? `Batches notified: ${notifiedBatches.map(b => `#${b.batch_id} ${b.plant_name}`).join(", ")}`
        : "No batches need notification today"
    });

  } catch (error) {
    console.error("❌ Harvest notification error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending harvest notifications"
    });
  }
};





export const testHarvestNotification = async (req, res) => {
  try {
    await notifyReplantDate(req, res); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ===== UPDATE a notification =====
export const updateNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;
    const notificationData = req.body;
    const { related_sensor } = notificationData;

    const existingNotification = await notificationModel.readNotifById(notification_id);
    if (!existingNotification) return res.status(404).json({ message: "Notification not found" });

    // Check if the related sensor exists
    const existingSensor = await sensorModel.readSensorById(related_sensor);
    if (!existingSensor) {
      return res.status(404).json({ message: "Related sensor does not exist" });
    }
    const updated = await notificationModel.updateNotif(notificationData, notification_id);
    res.status(200).json(updated);
    console.log("NOTIFICATION UPDATED:", updated);


  } catch (err) {
    console.error("CONTROLLER: Error updating notification", err);
    res.status(500).json({ message: "Error updating notification", err });
  }
};



// ===== DELETE a notification =====
export const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const existingNotification = await notificationModel.readNotifById(notification_id);
    if (!existingNotification) return res.status(404).json({ message: "Notification not found" });

    const deletedNotification = await notificationModel.deleteNotif(notification_id);
    res.status(200).json({ message: "Notification deleted successfully", deletedNotification });
    console.log("NOTIFICATION DELETED:", deletedNotification);
  } catch (err) {
    console.error("CONTROLLER: Error deleting notification", err);
    res.status(500).json({ message: "Error deleting notification", err });
  }
};







export const removeAllNotifications = async (req, res) => {
  try {
    await notificationModel.deleteAllNotifs();
    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (err) {
    console.error("CONTROLLER: Error deleting notification", err);
    res.status(500).json({ message: "Error deleting notification", err });
  }
};