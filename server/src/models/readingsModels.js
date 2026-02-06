// readings.model.js
import { query } from "../config/db.js";

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




// ===== READ latest reading per sensor =====
export const readLatestReadingsPerSensor = async () => {
  try {
    const sql = `
      SELECT DISTINCT ON (r.sensor_id)
        r.reading_id,
        r.sensor_id,
        r.value,
        r.recorded_at
      FROM sensor_readings r
      JOIN sensors s ON r.sensor_id = s.sensor_id
      ORDER BY r.sensor_id, r.recorded_at DESC
    `;
    
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

// ===== READ moisture readings for last 24 hours =====
export const readMoistureReadingsLast24h = async () => {
  try {
    const sql = `
      SELECT r.*, s.sensor_type
      FROM sensor_readings r
      JOIN sensors s ON r.sensor_id = s.sensor_id
      WHERE s.sensor_type = 'moisture'
        AND r.recorded_at >= NOW() - INTERVAL '24 HOURS'
      ORDER BY r.recorded_at ASC
    `;
    const result = await query(sql);
    return result.rows;
  } catch (error) {
    throw error;
  }
};


// ===== READ average moisture across all time =====
export const readAverageMoisture = async () => {
  try {
    const sql = `
      SELECT AVG(r.value::numeric) AS avg_moisture
      FROM sensor_readings r
      JOIN sensors s ON r.sensor_id = s.sensor_id
      WHERE s.sensor_type = 'moisture'
    `;
    const result = await query(sql);
    return result.rows[0].avg_moisture || 0; 
  } catch (error) {
    console.error("Error fetching overall average moisture", error);
    throw error;
  }
};

export const readAverageBySensorType = async (sensorType) => {
  const sql = `
    SELECT ROUND(AVG(r.value::numeric), 3) AS average
    FROM sensor_readings r
    JOIN sensors s ON r.sensor_id = s.sensor_id
    WHERE s.sensor_type = $1
  `;
  const result = await query(sql, [sensorType]);
  return result.rows[0].average || 0;
};


// ===== CREATE a new reading =====
export const createReadings = async (readingData) => {
  const { sensor_id, value} = readingData;
  
  const { rows } = await query(`
    INSERT INTO sensor_readings (sensor_id, value, recorded_at) 
    VALUES ($1, $2, NOW()) 
    RETURNING *
  `, [sensor_id, value]);
  
  return rows[0]; 
};



// ===== UPDATE reading =====
export const updateReadings = async (readingData, reading_id) => {
  const {sensor_id, value} = readingData;

  try {   
    const sql = `
      UPDATE sensor_readings
      SET sensor_id = $1, value = $2
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
