// readings.model.js
import { query } from "../config/db.js";


// ===== CREATE a new reading =====
export const createReadings = async (readingData) => {
  const {sensor_id, value} = readingData;

  try {        
    const sql = `
      INSERT INTO sensor_readings (sensor_id,value)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [sensor_id, value];
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }

};


// ===== READ all readings =====
export const readReadings = async () => {
  try {  
    const sql = `SELECT * FROM sensor_readings ORDER BY recorded_at ASC`;
    const result = await query(sql);
    return result.rows;       
  } catch (error) {
    throw error;
  }
};


// ===== READ single reading by ID =====
export const readReadingById = async (reading_id) => {
  try {
    const sql = `SELECT * FROM sensor_readings WHERE reading_id = $1`;
    const result = await query(sql, [reading_id]);
    return result.rows[0];       
  } catch (error) {
    throw error;
  }
};


// ===== UPDATE reading =====
export const updateReadings = async (readingData, reading_id) => {
  const {sensor_id, value} = readingData;

  try {   
    const sql = `
      UPDATE sensor_readings
      SET sensor_id = $1, value = $2,
      WHERE reading_id = $3
      RETURNING *
    `;

    const values = [sensor_id, value,reading_id]; 
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};


// ===== DELETE reading =====
export const deleteReadings = async (reading_id) => {
  try {
    const sql = `DELETE FROM sensor_readings WHERE reading_id = $1 RETURNING *`;
    const result = await query(sql, [reading_id]);
    return result.rows[0];        
  } catch (error) {
    throw error;
  }
};
