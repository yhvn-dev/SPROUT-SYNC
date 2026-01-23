import * as sensorModel from "../models/sensorModels.js"
import * as trayModels from "../models/trayModels.js"

// ===== GET all sensors =====
export const getSensors = async (req, res) => {
  try {
    const sensors = await sensorModel.readSensors();
    res.status(200).json(sensors);
    console.log("SENSORS:", sensors);
    
  } catch (err) {
    console.error("CONTROLLER: Error getting sensors", err);
    res.status(500).json({ message: "Error getting sensors", err });
  }
};


// ===== GET sensor by ID =====
export const getSensorById = async (req, res) => {
  try {
    const { sensor_id } = req.params;
    const sensor = await sensorModel.readSensorById(sensor_id);
    
    if (!sensor) return res.status(404).json({ message: "Sensor not found" });
    res.status(200).json(sensor);
    console.log("SENSOR:", sensor);
    
  } catch (err) {
    console.error("CONTROLLER: Error getting sensor by ID", err);
    res.status(500).json({ message: "Error getting sensor", err });
  }
};



export const createSensors = async (req, res) => {
  try {
    const sensorData = req.body;
    const { tray_id, sensor_type } = sensorData;

    if (sensor_type === "moisture") {
      if (!tray_id) {
        return res.status(400).json({
          message: "tray_id is required for moisture sensors",
        });
      }

      const existingTray = await trayModels.readTrayById(tray_id);
      if (!existingTray) {
        return res.status(404).json({
          message: "Selected Tray doesn't exist",
        });
      }
    }

    const sensor = await sensorModel.createSensors(sensorData);
    res.status(201).json(sensor);
    console.log("SENSOR CREATED:", sensor);
  } catch (err) {
    console.error("CONTROLLER: Error creating sensor", err);
    res.status(500).json({ message: "Error creating sensor", err });
  }
};




export const updateSensors = async (req, res) => {
  try {
    const { sensor_id } = req.params;
    const sensorData = req.body;
    const { tray_id, sensor_type } = sensorData;

    const existingSensor = await sensorModel.readSensorById(sensor_id);
    if (!existingSensor) {
      return res.status(404).json({ message: "Sensor not found" });
    }

    if (sensor_type === "moisture") {
      if (!tray_id) {
        return res.status(400).json({
          message: "tray_id is required for moisture sensors",
        });
      }
      const existingTray = await trayModels.readTrayById(tray_id);
      if (!existingTray) {
        return res.status(404).json({
          message: "Selected Tray doesn't exist",
        });
      }
    }
    const updated = await sensorModel.updateSensors(sensorData, sensor_id);
    res.status(200).json(updated);

  } catch (err) {
    console.error("CONTROLLER: Error updating sensor", err);
    res.status(500).json({ message: "Error updating sensor", err });
  }
};





// ===== DELETE a sensor =====
export const deleteSensors = async (req, res) => {
  try {
    const { sensor_id } = req.params;
    
    const existingSensor = await sensorModel.readSensorById(sensor_id);
    if (!existingSensor) return res.status(404).json({ message: "Sensor not found" });

    const deletedSensor = await sensorModel.deleteSensors(sensor_id);
    res.status(200).json({ message: "Sensor deleted successfully", deletedSensor });
    console.log("SENSOR DELETED:", deletedSensor);

  } catch (err) {
    console.error("CONTROLLER: Error deleting sensor", err);
    res.status(500).json({ message: "Error deleting sensor", err });
  }
};
