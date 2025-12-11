import * as readingModel from "../models/readingsModels.js";
import * as sensorModels from "../models/sensorModels.js";
import * as notificationModels from "../models/notificationModels.js"
import * as trayModels from "../models/trayModels.js"
import * as trayGroupModels from "../models/trayGroupsModel.js"


// ===== GET all readings =====
export const getReadings = async (req, res) => {
  try {
    const readings = await readingModel.readReadings();
    res.status(200).json(readings);
    console.log("READINGS:", readings);

  } catch (err) {
    console.error("CONTROLLER: Error getting readings", err);
    res.status(500).json({ message: "Error getting readings", err });
  }
};


// ===== GET reading by ID =====
export const getReadingById = async (req, res) => {
  try {
    const { reading_id } = req.params;
    const reading = await readingModel.readReadingById(reading_id);
    
    if (!reading) return res.status(404).json({ message: "Reading not found" });
    res.status(200).json(reading);
    console.log("READING:", reading);

  } catch (err) {
    console.error("CONTROLLER: Error getting reading by ID", err);
    res.status(500).json({ message: "Error getting reading", err });
  }
};


// ===== CREATE a reading =====
export const createReadings = async (req, res) => {
  try {

    const readingData = req.body;
    const {sensor_id,value} = readingData;  

    const existingSensor = await sensorModels.readSensorById(sensor_id);
    
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor with this id doesn't exist" });
    }

    const {tray_id} = existingSensor
    const selectedTray = await trayModels.readTrayById(tray_id)
    const {tray_group_id} = selectedTray
    const selectedTrayGroup =  await trayGroupModels.readTrayGroupById(tray_group_id)



    const {min_moisture,max_moisture} = selectedTrayGroup
    
    const moisture = Number(value);
    const min = Number(min_moisture);
    const max = Number(max_moisture);

    if (moisture < min) {
    const percentageBelow = ((min - moisture) / min) * 100;

    if (percentageBelow > 15) { 
      await notificationModels.createNotif({
        type: "Alert",
        message: "Soil is CRITICALLY DRY",
        related_sensor: sensor_id,
        status: "LOW"
      });
    } else { // Approaching low
      await notificationModels.createNotif({
        type: "Warning",
        message: "Soil is approaching dryness",
        related_sensor: sensor_id,
        status: "LOW"
      });
    }
  }

  // HIGH thresholds
  else if (moisture > max) {
    const percentageAbove = ((moisture - max) / max) * 100;

    if (percentageAbove > 15) { // Too wet
      await notificationModels.createNotif({
        type: "Alert",
        message: "Soil is TOO WET",
        related_sensor: sensor_id,
        status: "HIGH"
      });

    } else { 
      await notificationModels.createNotif({
        type: "Warning",
        message: "Soil is getting wet",
        related_sensor: sensor_id,
        status: "HIGH"
      });
    }
  } 
  
  else {
    await notificationModels.createNotif({
      type: "Info",
      message: "Soil moisture is normal",
      related_sensor: sensor_id,
      status: "NORMAL"
    });
  }



    
    // ✅ create reading
    const reading = await readingModel.createReadings(readingData);
    res.status(201).json(reading);
    console.log("READING CREATED:", reading);

  } catch (err) {
    console.error("CONTROLLER: Error creating reading", err);
    res.status(500).json({ message: "Error creating reading", err });
  }
};



// ===== UPDATE a reading =====
export const updateReadings = async (req, res) => {
  try {
    const { reading_id } = req.params;
    const readingData = req.body;
    const {sensor_id} = readingData;

    const existingReading = await readingModel.readReadingById(reading_id);
    if (!existingReading) return res.status(404).json({ message: "Reading not found" });

    // ✅ check sensor
    const existingSensor = await sensorModels.readSensorById(sensor_id);
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor with this id doesn't exist" });
    }

    const updated = await readingModel.updateReadings(readingData, reading_id);
    console.log(updated)
    res.status(200).json(updated);
    console.log("READING UPDATED:", updated);

  } catch (err) {
    console.error("CONTROLLER: Error updating reading", err);
    res.status(500).json({ message: "Error updating reading", err });
  }
};




// ===== DELETE a reading =====
export const deleteReadings = async (req, res) => {
  try {
    const { reading_id } = req.params;
    
    const existingReading = await readingModel.readReadingById(reading_id);
    if (!existingReading) return res.status(404).json({ message: "Reading not found" });

    const deletedReading = await readingModel.deleteReadings(reading_id);
    res.status(200).json({ message: "Reading deleted successfully", deletedReading });
    console.log("READING DELETED:", deletedReading);

    
  } catch (err) {
    console.error("CONTROLLER: Error deleting reading", err);
    res.status(500).json({ message: "Error deleting reading", err });
  }
};


// type	Categorizes the general kind of notification
// 'info', 'warning', 'alert', 'success'	This is usually used for UI purposes: icons, colors, grouping. It answers “what kind of notification is this?”

//  status	Represents the specific condition or severity that triggered the notification	
// 'LOW', 'HIGH', 'NORMAL', 'CRITICAL'	
// This is usually used for logic or filtering, 
//  i.e., to know what the notification is telling you about the system state.