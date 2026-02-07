// trayGroups.model.js
import { query } from "../config/db.js";



export const readTrayGroups = async () => {
  try {
    const sql = `
      SELECT 
        tg.*,
        COUNT(s.sensor_id) AS sensor_count
      FROM tray_groups tg
      LEFT JOIN trays t ON t.tray_group_id = tg.tray_group_id
      LEFT JOIN sensors s ON s.tray_id = t.tray_id
      GROUP BY tg.tray_group_id
      ORDER BY tg.tray_group_id ASC
    `;
    const result = await query(sql);
    return result.rows;       
  } catch (error) {
    throw error;
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

  // SQL query for reindexing a tray group sequentially
  const reindexSQL = `
    WITH ordered AS (
      SELECT tray_group_id,
             ROW_NUMBER() OVER (ORDER BY group_number) AS new_group_number
      FROM tray_groups
      WHERE tray_group_name = $1
    )
    UPDATE tray_groups t
    SET group_number = o.new_group_number
    FROM ordered o
    WHERE t.tray_group_id = o.tray_group_id
  `;

  
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

    // 2️⃣ If tray group name changed, rename first
    if (baseName !== currentBaseName) {
      await query(
        `UPDATE tray_groups
         SET tray_group_name = $1
         WHERE tray_group_id = $2`,
        [baseName, tray_group_id]
      );

      // 3️⃣ Reindex old group (previous name) to remove gaps
      await query(reindexSQL, [currentBaseName]);
      // 4️⃣ Reindex new group (new name) to assign proper sequential numbers
      await query(reindexSQL, [baseName]);
    }

    // 5️⃣ Update the rest of the fields
    const sql = `
      UPDATE tray_groups
      SET min_moisture = $1,
          max_moisture = $2,
          is_watering = $3,
          location = $4,
          updated_at = NOW()
      WHERE tray_group_id = $5
      RETURNING *
    `;

    const values = [min_moisture, max_moisture, is_watering ?? false, location, tray_group_id];
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