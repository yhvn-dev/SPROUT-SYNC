import * as notificationModel from "../models/notificationModels.js";
import * as sensorModel from "../models/sensorModels.js";
import * as plantBatchModel from "../models/plantBatchesModels.js"
import * as trayModel from "../models/trayModels.js"
import * as trayGroupModel from "../models/trayGroupsModel.js"
import { toDateOnlyUTC } from "../utils/schedules.js";
import { sendPushNotification } from "../utils/firebaseAdmin.js"; 
import * as deviceTokenModel from "../models/deviceTokenModels.js"



// ===== GET all notifications =====
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.readNotif()
    res.status(200).json(notifications);
    // console.log("NOTIFICATIONS:", notifications);
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
  } catch (err) {
    console.error("CONTROLLER: Error getting notification by ID", err);
    res.status(500).json({ message: "Error getting notification", err });
  }
};


export const getUnreadNotificationCount = async (req, res) => {
  try {
    const count = await notificationModel.readTotalUnreadNotifCount()
    res.status(200).json(count);
  } catch (err) {
    console.error("CONTROLLER: Error getting notification count", err);
    res.status(500).json({ message: "Error getting notification count", err });
  }
};


export const markNotificationsAsRead = async (req, res) => {
    try {
        await notificationModel.markAllNotificationsAsRead();
        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error("CONTROLLER: Error marking all notifications as read", error);
        res.status(500).json({ message: "Error marking all notifications as read" });
    }
};




export const notifyReplantDate = async (req, res) => {
  try {
    const batchData = await plantBatchModel.readPlantBatches();
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
        const trayGroup = await trayGroupModel.readTrayGroupById(tray?.tray_group_id);
        const location = trayGroup?.location || "Unknown";

        await notificationModel.createNotif({
          user_id: null,
          batch_id: batch.batch_id,
          type: "warning",
          status: "Medium",
          message: `🌱 Harvest Reminder\n1 Day Remaining before harvest \n\nPlant: ${batch.plant_name}\nLocation: ${location}\nPlanted: ${planted.toISOString().slice(0, 10)}\nExpected Harvest: ${harvestDate.toISOString().slice(0, 10)}`
        });

        const devices = await deviceTokenModel.getAllDeviceTokens();
        console.log("📱 Device tokens count:", devices.length);

        if (devices.length > 0) {
          const notifMessage = `${batch.plant_name}[${batch.batch_number}] harvest is tomorrow!`;

          await Promise.all(
            devices.map(device =>
              sendPushNotification(
                device.push_token,
                "Sprout Sync Notification",
                notifMessage
              )
            )
          );
        }

        notifiedBatches.push({
          batch_id: batch.batch_id,
          plant_name: batch.plant_name,
          message: `${batch.plant_name} harvest is tomorrow!`
        });
      }
    }

    if (res) {
      res.status(200).json({
        success: true,
        message: notifiedBatches.length
          ? `Batches notified: ${notifiedBatches.map(b => b.message).join(", ")}`
          : "No batches need notification today"
      });
    }

  } catch (error) {
    console.error("❌ Harvest notification error:", error);

    if (res) {
      res.status(500).json({
        success: false,
        message: "Error sending harvest notifications"
      });
    }
  }
};



export const notifyBatchCreated = async (batch,mode) => {
  try {
    const planted = toDateOnlyUTC(new Date(batch.date_planted));
    const harvestDate = new Date(planted);
    harvestDate.setUTCDate(harvestDate.getUTCDate() + Number(batch.expected_harvest_days));


    if(mode === "insert"){

      await notificationModel.createNotif({
        user_id: null,
        batch_id: batch.batch_id,
        type: "Info",
        status: "Low",
        message: `🌱 New Batch Added\n\nPlant: ${batch.plant_name}\nBatch: ${batch.batch_number}\nPlanted: ${planted.toISOString().slice(0, 10)}\nExpected Harvest: ${harvestDate.toISOString().slice(0, 10)}`
      });

      const devices = await deviceTokenModel.getAllDeviceTokens();
      if (devices.length > 0) {
        await Promise.all(
          devices.map(device =>
            sendPushNotification(
              device.push_token,
              "Sprout Sync Notification",
              `🌱 ${batch.plant_name}[${batch.batch_number}] batch has been added!`
            )
          )
        );
      }
  

    }else if(mode === "update"){

      await notificationModel.createNotif({
        user_id: null,
        batch_id: batch.batch_id,
        type: "Info",
        status: "Low",
        message: `🌱 Batch Updated\n\nPlant: [${batch.batch_number}]${batch.plant_name}\n\nPlanted: ${planted.toISOString().slice(0, 10)}\nExpected Harvest: ${harvestDate.toISOString().slice(0, 10)}`
      });

      const devices = await deviceTokenModel.getAllDeviceTokens();
      if (devices.length > 0) {
        await Promise.all(
          devices.map(device =>
            sendPushNotification(
              device.push_token,
              "Sprout Sync Notification",
              `🌱 ${batch.plant_name}[${batch.batch_number}] batch has been updated!`
            )
          )
        );
      }
    }
    
  } catch (error) {
    console.error("❌ notifyBatchCreated error:", error);
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



export const sendPushNotifications = async (req,res) =>{
  try {
    const { push_token, title, body, data } = req.body;

    if (!push_token || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "push_token, title, and body are required",
      });
    }

    const response = await sendPushNotification(push_token, title, body, data);
    res.status(200).json({
      success: true,
      message: "Notification sent successfully",
      response,
    });

  } catch (err) {
    console.error("Error sending notification:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}


    
