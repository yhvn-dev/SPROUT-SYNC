import  * as deviceTokenModel from "../models/deviceTokenModels.js";
import { sendPushNotification } from "../utils/firebaseAdmin.js";



export const registerDevice = async (req, res) => {
  try {
    const { user_id, push_token, device_type, device_info } = req.body;

    if (!user_id || !push_token || !device_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const device = await deviceTokenModel.insertDeviceToken(
      user_id,
      push_token,
      device_type,
      device_info
    );

    console.log("Device successfully inserted:", device);    
    await sendPushNotification(
      push_token,
      "Welcome to Sprout Sync!",
      "Your device is registered successfully 🌱"
    );
    
    res.status(200).json({
      success: true,
      message: "Device registered successfully",
      device,
    });
  } catch (err) {
    console.error("Error registering device:", err);
    res.status(500).json({ success: false, message: err.message });
  }
  
};


export const fetchUserDevices = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({ success: false, message: "Missing user_id" });
    }

    const devices = await deviceTokenModel.getDeviceTokensByUser(user_id);

    res.status(200).json({
      success: true,
      devices,
    });
  } catch (err) {
    console.error("CONTROLLER: Error fetching user devices", err);
    res.status(500).json({ success: false, message: err.message });
  }
};





export const fetchAllUserDevices = async (req, res) => {
  try {

    const devices = await deviceTokenModel.getAllDeviceTokens()
    res.status(200).json({
      success: true,
      devices,
    });
    
  } catch (err) {
    console.error("CONTROLLER: Error fetching all user devices", err);
    res.status(500).json({ success: false, message: err.message });
  }
};






export const removeDevice = async (req, res) => {
  
  try {
    const { user_id, push_token } = req.body;

    if (!user_id || !push_token) {
      return res.status(400).json({ success: false, message: "Missing user_id or push_token" });
    }

    const deleted = await deviceTokenModel.deleteDeviceToken(user_id, push_token);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Device token not found" });
    }

    res.status(200).json({success: true,message: "Device token deleted successfully",deleted});
  } catch (err) {
    console.error("CONTROLLER: Error deleting device token", err);
    res.status(500).json({ success: false, message: err.message });
  }

};


export const removeAllDevice = async (req, res) => {

  try {
    const deleted = await deviceTokenModel.deleteAllDeviceToken()
    res.status(200).json({success: true,message: "All Device token deleted successfully",deleted});
  } catch (err) {
    console.error("CONTROLLER: Error deleting device token", err);
    res.status(500).json({ success: false, message: err.message });
  }

};
