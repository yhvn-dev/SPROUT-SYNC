// trayGroups.model.js
import { query } from "../config/db.js";



// ===== READ all tray groups =====
export const readTrayGroups = async () => {
    try {  
        const sql = `SELECT * FROM tray_groups ORDER BY tray_group_id ASC`;
        const result = await query(sql);
        return result.rows;       
    } catch (error) {
         throw error
    }
};


// ===== READ single tray group by ID =====
export const readTrayGroupById = async (tray_group_id) => {
    try {

        const sql = `SELECT * FROM tray_groups WHERE tray_group_id = $1`;
        const result = await query(sql, [tray_group_id]);
        return result.rows[0];       

    } catch (error) {
        throw error
    }
 
};




export const createTrayGroups = async (trayGroupData) => {
  let { tray_group_name, min_moisture, max_moisture, is_watering, location } = trayGroupData;

  try {
    const baseName = tray_group_name.trim();

    const checkSql = `SELECT tray_group_name FROM tray_groups WHERE tray_group_name ILIKE $1`;
    const existing = await query(checkSql, [`${baseName}%`]);

    let nextNumber = 1;
    if (existing.rows.length > 0) {
      const suffixNumbers = existing.rows.map(r => {
        const match = r.tray_group_name.match(/- (\d+)$/); 
        return match ? parseInt(match[1], 10) : 0;
      });
      nextNumber = Math.max(...suffixNumbers) + 1;
    }

    tray_group_name = `${baseName} - ${nextNumber}`;
    const sql = `
      INSERT INTO tray_groups (tray_group_name, min_moisture, max_moisture, is_watering, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`;
      
    const values = [tray_group_name, min_moisture, max_moisture, is_watering, location];
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
  
};


export const updateTrayGroups = async (trayGroupData, tray_group_id) => {
  let { tray_group_name, min_moisture, max_moisture, is_watering, location } = trayGroupData;
  try {
    const baseName = tray_group_name.trim();

    const checkSql = ` SELECT tray_group_name  FROM tray_groups  WHERE tray_group_name ILIKE $1 AND tray_group_id != $2`;
    const existing = await query(checkSql, [`${baseName}%`, tray_group_id]);

    let nextNumber = 1;
    if (existing.rows.length > 0) {
      const suffixNumbers = existing.rows.map(r => {
        const match = r.tray_group_name.match(/- (\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      });
      nextNumber = Math.max(...suffixNumbers) + 1;
    }

    tray_group_name = `${baseName} - ${nextNumber}`;

    const sql = `
      UPDATE tray_groups
      SET tray_group_name = $1,
          min_moisture = $2,
          max_moisture = $3,
          is_watering = $4,
          location = $5
      WHERE tray_group_id = $6
      RETURNING *
    `;
    const values = [tray_group_name, min_moisture, max_moisture, is_watering, location, tray_group_id];
    const result = await query(sql, values);
    return result.rows[0];

  } catch (error) {
    throw error;
  }
};




// ===== DELETE a tray group =====
export const deleteTrayGroups = async (tray_group_id) => {
    try {
        const sql = `DELETE FROM tray_groups WHERE tray_group_id = $1 RETURNING *`;
        const result = await query(sql, [tray_group_id]);
        return result.rows[0];        
    } catch (error) {
        throw error
    }
};