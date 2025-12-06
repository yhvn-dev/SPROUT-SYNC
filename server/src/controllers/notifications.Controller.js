import * as notificationModel from "../models/notificationModels.js";
import * as sensorModel from "../models/sensorModels.js";

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



// ===== CREATE a notification =====
export const createNotification = async (req, res) => {
  try {
    const notificationData = req.body;
    const { related_sensor } = notificationData;

    // Check if the related sensor exists
    const existingSensor = await sensorModel.readSensorById(related_sensor);
    if (!existingSensor) {
      return res.status(404).json({ message: "Related sensor does not exist" });
    }

    // Create notification
    const notification = await notificationModel.createNotif(notificationData)
    res.status(201).json(notification);
    console.log("NOTIFICATION CREATED:", notification);
  } catch (err) {
    console.error("CONTROLLER: Error creating notification", err);
    res.status(500).json({ message: "Error creating notification", err });
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
