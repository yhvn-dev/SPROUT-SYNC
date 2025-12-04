// trayGroups.model.js
import { query } from "../config/db.js";

// ===== CREATE a new tray group =====
export const createTray = async (traysData) => {
    const {tray_group_id,plant_type,soil_type} = traysData

    try {        
        const sql = `INSERT INTO trays (tray_group_id,plant_type,soil_type) VALUES ($1,$2,$3) RETURNING *`;
        const values = [tray_group_id,plant_type,soil_type];
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error
    }
};



// ===== READ all tray groups =====
export const readTrays = async () => {
    try {  
        const sql = `SELECT * FROM trays ORDER BY tray_id ASC`;
        const result = await query(sql);
        return result.rows;       
    } catch (error) {
         throw error
    }
};


// ===== READ single tray group by ID =====
export const readTrayById = async (tray_id) => {
    try {
        const sql = `SELECT * FROM trays WHERE tray_id = $1`;
        const result = await query(sql, [tray_id]);
        return result.rows[0];       
    } catch (error) {
        throw error
    }
};




export const updateTrays = async (trayData, tray_id) => {
  const { tray_group_id, plant_type, soil_type } = trayData;

  try {   
    const sql = `
      UPDATE trays
      SET tray_group_id = $1, plant_type = $2, soil_type = $3
      WHERE tray_id = $4
      RETURNING *
    `;
    const values = [tray_group_id, plant_type, soil_type, tray_id]; 
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};





// ===== DELETE a tray group =====
export const deleteTrays = async (tray_id) => {
    try {
        const sql = `DELETE FROM trays WHERE tray_id = $1 RETURNING *`;
        const result = await query(sql, [tray_id]);
        return result.rows[0];        
    } catch (error) {
        throw error
    }
};