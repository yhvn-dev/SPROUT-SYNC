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
  // deconstruct
  const { tray_group_name, min_moisture, max_moisture, is_watering, location } = trayGroupData;

  try {
    const baseName = tray_group_name.trim();
    const result = await query(
      `
      SELECT COALESCE(MAX(group_number), 0) + 1 AS next_number
      FROM tray_groups
      WHERE tray_group_name ILIKE $1
      `,
      [baseName]
    );

    const group_number = result.rows[0].next_number;

    const sql = `
      INSERT INTO tray_groups
      (
        tray_group_name,
        group_number,
        min_moisture,
        max_moisture,
        is_watering,
        location
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [ baseName, group_number, min_moisture, max_moisture, is_watering ?? false, location];
    const insert = await query(sql, values);
    return insert.rows[0];

  } catch (error) {
    throw error;
  }
};



export const updateTrayGroups = async (trayGroupData, tray_group_id) => {
  const { tray_group_name, min_moisture, max_moisture, is_watering, location } = trayGroupData;

  try {
    // 1️⃣ Get the existing tray group
    const existingQuery = await query(
      `SELECT tray_group_name, group_number FROM tray_groups WHERE tray_group_id = $1`,
      [tray_group_id]
    );

    const existingGroup = existingQuery.rows[0];
    if (!existingGroup) throw new Error("Tray group not found");

    const currentBaseName = existingGroup.tray_group_name.trim();
    const baseName = tray_group_name.trim();

    let newGroupNumber = existingGroup.group_number;

    // 2️⃣ If tray group name changed, recalc group_number
    if (baseName !== currentBaseName) {
      const result = await query(
        `
        SELECT COALESCE(MAX(group_number), 0) + 1 AS next_number
        FROM tray_groups
        WHERE tray_group_name ILIKE $1
        `,
        [baseName]
      );
      newGroupNumber = result.rows[0].next_number;
    }

    // 3️⃣ Update the tray group
    const sql = `
      UPDATE tray_groups
      SET tray_group_name = $1,
          group_number = $2,
          min_moisture = $3,
          max_moisture = $4,
          is_watering = $5,
          location = $6,
          updated_at = NOW()
      WHERE tray_group_id = $7
      RETURNING *
    `;

    const values = [ baseName, newGroupNumber, min_moisture, max_moisture, is_watering ?? false, location, tray_group_id];

    const updated = await query(sql, values);
    return updated.rows[0];

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