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

    // CHECK SENSOR
    const existingSensor = await sensorModels.readSensorById(sensor_id);
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor with this id doesn't exist" });
    }

    // CREATE READING
    const reading = await readingModel.createReadings(readingData);

    
    
    try {
      // ✅ MOISTURE (ALREADY WORKING)
      if (existingSensor.sensor_type === "moisture") {
        await handleMoistureNotifications(existingSensor, value);
      }
      
      if (Number(sensor_id) === 8) {
        await handleUltrasonicNotifications(sensor_id, value);
      }

    } catch (notifError) {
      console.error("❌ Notification failed (reading still created):", notifError);
    }




    console.log("✅ READING CREATED:", reading);
    res.status(201).json(reading);



  } catch (err) {
    console.error("CONTROLLER: Error creating reading", err);
    res.status(500).json({ message: "Error creating reading" });
  }
};




const handleMoistureNotifications = async (existingSensor, value) => {
  const { tray_id } = existingSensor;
  if (!tray_id) return;

  const selectedTray = await trayModels.readTrayById(tray_id);
  if (!selectedTray) return;

  const selectedTrayGroup = await trayGroupModels.readTrayGroupById(
    selectedTray.tray_group_id
  );
  if (!selectedTrayGroup) return;

  const { min_moisture, max_moisture, tray_group_name, group_number } =
    selectedTrayGroup;

  const moisture = Number(value);
  const min = Number(min_moisture);
  const max = Number(max_moisture);

  // TOO DRY → NEED WATERING
  if (moisture < min) {
    await notificationModels.createNotif({
      type: "Alert",
      status: "HIGH",
      related_sensor: existingSensor.sensor_id,
      message: `[${group_number}] ${tray_group_name} soil is TOO DRY! Needs watering (${moisture.toFixed(
        1
      )}%)`
    });
  }
  // TOO WET → DO NOT WATER
  else if (moisture > max) {
    await notificationModels.createNotif({
      type: "Alert",
      status: "HIGH",
      related_sensor: existingSensor.sensor_id,
      message: `[${group_number}] ${tray_group_name} soil is TOO WET! Do not water (${moisture.toFixed(
        1
      )}%)`
    });
  }
};



const handleUltrasonicNotifications = async (sensor_id, value) => {
  const waterLevel = Number(value);

  if (isNaN(waterLevel)) return;
  if (waterLevel <= 20) {
    await notificationModels.createNotif({
      type: "Alert",
      status: "HIGH",
      related_sensor: sensor_id,
      message: `🚨 Water level is CRITICALLY LOW (${waterLevel}%)`
    });
  }

  else if (waterLevel <= 30) {
    await notificationModels.createNotif({
      type: "Warning",
      status: "MEDIUM",
      related_sensor: sensor_id,
      message: `⚠️ Water level is LOW (${waterLevel}%)`
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



// ===== DELETE a reading =====
export const deleteAllReadings = async (req, res) => {
  try {
    const result = await readingModel.deleteAllReadings();
    res.status(200).json({
      message: "All readings deleted successfully",
      deleted: result.deletedCount
    });
  } catch (err) {
    console.error("CONTROLLER ERROR:", err);
    res.status(500).json({ message: "Error deleting readings" });
  }
};







export const removeAllReadingsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const deleted = await readingModel.deleteAllReadingsByType(type);

    if (deleted.length === 0) {
      return res.status(404).json({ message: `No readings found for sensor type: ${type}` });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Deleted ${deleted.length} readings of type ${type}`, 
      deleted 
    });
  } catch (error) {
    console.error("Error deleting readings by type:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

