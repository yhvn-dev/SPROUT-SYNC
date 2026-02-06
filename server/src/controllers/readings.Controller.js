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



// ===== GET readings for last 24 hours =====
export const getReadingsLast24h = async (req, res) => {
  try {
    const readings = await readingModel.readMoistureReadingsLast24h()
    res.status(200).json(readings);
    console.log("LAST 24H READINGS:", readings);
  } catch (err) {
    console.error("CONTROLLER: Error getting readings for last 24h", err);
    res.status(500).json({ message: "Error getting readings", err });
  }
};




// ===== GET latest reading per sensor =====
export const getLatestReadingsPerSensor = async (req, res) => {
  try {
    const readings = await readingModel.readLatestReadingsPerSensor();

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings
    });
  } catch (error) {
    console.error("Error fetching latest readings per sensor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest sensor readings"
    });
  }
};


export const getAverageReadings = async (req, res) => {
  try {
    const readings = await readingModel.readAverageMoisture()
    const averageReadings = parseFloat(readings).toFixed(1);
    res.status(200).json(averageReadings);
    console.log("AVERAGE MOISTURE READINGS:", readings);
  } catch (err) {
    console.error("CONTROLLER: Error getting average moisture readings", err);
    res.status(500).json({ message: "Error getting readings", err });
  }
};


export const getAverageBySensorType = async (req, res) => {
  try {
    const { sensor_type} = req.params;
    if (!sensor_type) {
      return res.status(400).json({
        message: "sensorType parameter is required"
      });
    }
    const average = await readingModel.readAverageBySensorType(sensor_type)
    const averageReadings = parseFloat(average).toFixed(1);
    res.status(200).json({
      sensor_type: sensor_type,
      average: Number(averageReadings)
    });

    console.log(`AVERAGE (${sensor_type}):`, averageReadings);
  } catch (err) {
    console.error("CONTROLLER: Error getting average by sensor type", err);
    res.status(500).json({
      message: "Error getting average sensor reading"
    });
  }
};





export const createReadings = async (req, res) => {
  try {
    const readingData = req.body;
    const { sensor_id, value } = readingData;

    const existingSensor = await sensorModels.readSensorById(sensor_id);
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor with this id doesn't exist" });
    }

    const { sensor_type } = existingSensor;
    const reading = await readingModel.createReadings(readingData);

    // **NOTIFICATIONS ARE BONUS** (won't block readings)
    try {
      if (sensor_type === "moisture") {
        await handleMoistureNotifications(existingSensor, value);
      } else if (sensor_type === "ultra_sonic") {
        await handleUltrasonicNotifications(sensor_id, value);
      }
    } catch (notifError) {
      console.error("❌ Notification failed (reading still created):", notifError);
    }

    res.status(201).json(reading);
    console.log("✅ READING CREATED:", reading);

  } catch (err) {
    console.error("CONTROLLER: Error creating reading", err);
    res.status(500).json({ message: "Error creating reading" });
  }
};




// Extracted helper functions (cleaner)
const handleMoistureNotifications = async (existingSensor, value) => {
  const { tray_id } = existingSensor;
  if (!tray_id) return;

  const selectedTray = await trayModels.readTrayById(tray_id);
  const { tray_group_id } = selectedTray;
  const selectedTrayGroup = await trayGroupModels.readTrayGroupById(tray_group_id);
  const { min_moisture, max_moisture, tray_group_name,group_number} = selectedTrayGroup;

  const moisture = Number(value);
  const min = Number(min_moisture);
  const max = Number(max_moisture);

  // TOO LOW - 10% or more below minimum
  if (moisture < min) {
    const percentageBelow = ((min - moisture) / min) * 100;
    
    if (percentageBelow >= 15) {
      // CRITICAL
      await notificationModels.createNotif({
        type: "Alert",
        message: `[${group_number}] ${tray_group_name}'s soil is Critically Dry`,
        related_sensor: existingSensor.sensor_id,
        status: "LOW"
      });
    } else {
      // APPROACHING DRYNESS
      await notificationModels.createNotif({
        type: "Warning",
        message: `${tray_group_name}'s soil is approaching dryness`,
        related_sensor: existingSensor.sensor_id,
        status: "LOW"
      });
    }
  } 
  // 10% APPROACHING MINIMUM (NEW!)
  else if (moisture <= (min * 1.10)) { 
    await notificationModels.createNotif({
      type: "Info",
      message: `${tray_group_name}'s soil is approaching minimum threshold (${moisture.toFixed(1)}%)`,
      related_sensor: existingSensor.sensor_id,
      status: "LOW"
    });
  }
  // TOO HIGH - 10% or more above maximum
  else if (moisture > max) {
    const percentageAbove = ((moisture - max) / max) * 100;
    
    if (percentageAbove >= 15) {
      // TOO WET
      await notificationModels.createNotif({
        type: "Alert",
        message: `${tray_group_name}'s soil is too wet`,
        related_sensor: existingSensor.sensor_id,
        status: "HIGH"
      });
    } else {
      // GETTING WET
      await notificationModels.createNotif({
        type: "Warning",
        message: `${tray_group_name}'s soil is getting wet`,
        related_sensor: existingSensor.sensor_id,
        status: "HIGH"
      });
    }
  }
  // 10% APPROACHING MAXIMUM (NEW!)
  else if (moisture >= (max * 0.90)) {
    await notificationModels.createNotif({
      type: "Info",
      message: `${tray_group_name}'s soil is approaching maximum threshold (${moisture.toFixed(1)}%)`,
      related_sensor: existingSensor.sensor_id,
      status: "HIGH"
    });
  }
};




const handleUltrasonicNotifications = async (value) => {
  const waterLevel = Number(value);
  const maxWaterHeight = 20;
  const minWaterHeight = 2;

  // CRITICAL HIGH - Overflow
  if (waterLevel > maxWaterHeight) {
    await notificationModels.createNotif({
      type: "Alert",
      message: `Water Tank is OVERFLOWING (${waterLevel}cm)`,
      status: "HIGH"
    });
  } 
  // APPROACHING MAX (NEW! - 3cm below max)
  else if (waterLevel > (maxWaterHeight - 3)) {
    await notificationModels.createNotif({
      type: "Info",
      message: `Water Tank approaching overflow (${waterLevel}cm)`,
      status: "HIGH"
    });
  }
  // CRITICAL LOW - Empty
  else if (waterLevel < minWaterHeight) {
    await notificationModels.createNotif({
      type: "Alert",
      message: `Water Tank is CRITICALLY LOW (${waterLevel}cm)`,
      status: "LOW"
    });
  } 
  // WARNING LOW - Getting low (2-5cm)
  else if (waterLevel < (minWaterHeight + 3)) {
    await notificationModels.createNotif({
      type: "Warning",
      message: `Water Tank level is getting low (${waterLevel}cm)`,
      status: "LOW"
    });
  }
  // APPROACHING MIN (NEW! - 5-8cm)
  else if (waterLevel < (minWaterHeight + 6)) {
    await notificationModels.createNotif({
      type: "Info",
      message: `Water Tank approaching minimum level (${waterLevel}cm)`,
      status: "LOW"
    });
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