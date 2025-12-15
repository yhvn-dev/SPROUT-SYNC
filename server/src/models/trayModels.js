// trays.model.js
import { query } from "../config/db.js";

// ===== READ all trays =====
export const readTrays = async () => {
    try {
        const sql = `SELECT * FROM trays ORDER BY tray_id ASC`;
        const result = await query(sql);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// ===== READ single tray by ID =====
export const readTrayById = async (tray_id) => {
    try {
        const sql = `SELECT * FROM trays WHERE tray_id = $1`;
        const result = await query(sql, [tray_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};




// ===== CREATE a new tray =====
export const createTray = async (trayData) => {
  let { tray_group_id, plant, status } = trayData;

  try {
    const baseName = plant.trim();

    // Get next tray_number for this tray group
    const result = await query(
      `SELECT COALESCE(MAX(tray_number), 0) + 1 AS next_number
       FROM trays
       WHERE tray_group_id = $1`,
      [tray_group_id]
    );

    const tray_number = result.rows[0].next_number;

    const sql = `
      INSERT INTO trays (tray_group_id, tray_number, plant, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [tray_group_id, tray_number, baseName, status || 'Available'];
    const insert = await query(sql, values);
    return insert.rows[0];

  } catch (error) {
    throw error;
  }
};


export const updateTray = async (trayData, tray_id) => {
  let { tray_group_id, plant, status } = trayData;
  const reindexSQL = `
    WITH ordered AS (
      SELECT tray_id,
             ROW_NUMBER() OVER (ORDER BY tray_number) AS new_tray_number
      FROM trays
      WHERE tray_group_id = $1 AND plant ILIKE $2
    )
    UPDATE trays t
    SET tray_number = o.new_tray_number
    FROM ordered o
    WHERE t.tray_id = o.tray_id
  `;
  try {
    
    // 1️⃣ Get existing tray
    const existingTrayQuery = await query(
      `SELECT tray_group_id, tray_number, plant FROM trays WHERE tray_id = $1`,
      [tray_id]
    );

    const existingTray = existingTrayQuery.rows[0];
    if (!existingTray) throw new Error("Tray not found");
    const oldGroupId = existingTray.tray_group_id;
    const oldPlant = existingTray.plant.trim();
    const newPlant = plant.trim();

    // 2️⃣ If plant or tray_group_id changed, rename first
    if (newPlant !== oldPlant || tray_group_id !== oldGroupId) {
      // a) Temporarily update tray_group_id and plant
      await query(
        `UPDATE trays
         SET tray_group_id = $1, plant = $2
         WHERE tray_id = $3`,
        [tray_group_id, newPlant, tray_id]
      );

      // b) Reindex old group/plant to remove gaps
      await query(reindexSQL, [oldGroupId, oldPlant]);
      await query(reindexSQL, [tray_group_id, newPlant]);
    }

    // 3️⃣ Update other fields (status, etc.)
    const sql = `
      UPDATE trays
      SET status = $1,
          updated_at = NOW()
      WHERE tray_id = $2
      RETURNING *
    `;
    const values = [status || "Available", tray_id];
    const updated = await query(sql, values);
    return updated.rows[0];

  } catch (error) {
    throw error;
  }
  
};







// ===== DELETE a tray =====
export const deleteTray = async (tray_id) => {
    try {
        const sql = `DELETE FROM trays WHERE tray_id = $1 RETURNING *`;
        const result = await query(sql, [tray_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
