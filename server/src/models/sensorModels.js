// sensors.model.js
import { query } from "../config/db.js";



// ===== READ all sensors =====
export const readSensors = async () => {
  try {  
    const sql = `SELECT * FROM sensors ORDER BY sensor_id ASC`;
    const result = await query(sql);
    return result.rows;       
  } catch (error) {
    throw error;
  }
};


// ===== READ single sensor by ID =====
export const readSensorById = async (sensor_id) => {
  try {
    const sql = `SELECT * FROM sensors WHERE sensor_id = $1`;
    const result = await query(sql, [sensor_id]);
    return result.rows[0];       
  } catch (error) {
    throw error;
  }
};




// ===== CREATE a new sensor =====
export const createSensors = async (sensorData) => {
  const {tray_id, sensor_type,status } = sensorData;

  try {        
    const sql = `
      INSERT INTO sensors (tray_id,sensor_type,status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [tray_id, sensor_type,status];
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }

};

// ===== UPDATE sensor =====
export const updateSensors = async (sensorData, sensor_id) => {
  const {tray_group_id, sensor_type,status} = sensorData;

  try {   
    const sql = `
      UPDATE sensors
      SET tray_id = $1,sensor_type = $2, status = $3
      WHERE sensor_id = $4
      RETURNING *
    `;

    const values = [tray_id, sensor_type,status,sensor_id]; 
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};



// ===== DELETE sensor =====
export const deleteSensors = async (sensor_id) => {
  try {
    const sql = `DELETE FROM sensors WHERE sensor_id = $1 RETURNING *`;
    const result = await query(sql, [sensor_id]);
    return result.rows[0];        
  } catch (error) {
    throw error;
  }
};
