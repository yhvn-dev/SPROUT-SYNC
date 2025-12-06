import * as readingModel from "../models/readingsModels.js";
import * as sensorModels from "../models/sensorModels.js";
import * as notificationModels from "../models/notificationModels.js"
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
  
    // ✅ check if sensor exists
    const existingSensor = await sensorModels.readSensorById(sensor_id);
    console.log("SELECTED SENSOR",existingSensor)
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor with this id doesn't exist" });
    }
    
    const {tray_group_id} = existingSensor
    const selectedTrayGroup = await trayGroupModels.readTrayGroupById(tray_group_id)
    console.log("SELECTED TRAY GROUP",selectedTrayGroup)


    const {min_moisture,max_moisture} = selectedTrayGroup

    const moisture = Number(value);
    const min = Number(min_moisture);
    const max = Number(max_moisture);

    if (moisture < min) {
      await notificationModels.createNotif({
        type: "warning",
        message: "Moisture is LOW",
        related_sensor: sensor_id,
        status: "LOW"
      });
    } 
    else if (moisture > max) {
      await notificationModels.createNotif({
        type: "warning",
        message: "Moisture is HIGH",
        related_sensor: sensor_id,
        status: "HIGH"
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
    const { tray_id, sensor_id } = readingData;

    const existingReading = await readingModel.readReadingById(reading_id);
    if (!existingReading) return res.status(404).json({ message: "Reading not found" });


    // ✅ check tray
    const existingTray = await trayModels.readTrayById(tray_id);
    if (!existingTray) {
      return res.status(404).json({ message: "Tray with this id doesn't exist" });
    }

    // ✅ check sensor
    const existingSensor = await sensorModels.readSensorById(sensor_id);
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor with this id doesn't exist" });
    }


    const updated = await readingModel.updateReadings(readingData, reading_id);
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
