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




// ===== UPDATE a tray =====
export const updateTray = async (trayData, tray_id) => {
  let { tray_group_id, plant, status } = trayData;

  try {
    // 1️⃣ Get existing tray
    const existingTrayQuery = await query(
      `SELECT tray_group_id, tray_number, plant FROM trays WHERE tray_id = $1`,
      [tray_id]
    );
    const existingTray = existingTrayQuery.rows[0];
    if (!existingTray) throw new Error("Tray not found");

    const newPlant = plant.trim();
    let tray_number = existingTray.tray_number; // keep existing tray_number by default

    // 2️⃣ If plant OR tray_group_id changed, recalc tray_number
    if (newPlant !== existingTray.plant || tray_group_id !== existingTray.tray_group_id) {
      const result = await query(
        `
        SELECT COALESCE(MAX(tray_number), 0) + 1 AS next_number
        FROM trays
        WHERE tray_group_id = $1 AND plant ILIKE $2
        `,
        [tray_group_id, newPlant]
      );
      tray_number = result.rows[0].next_number;
    }

    // 3️⃣ Update tray
    const sql = `
      UPDATE trays
      SET tray_group_id = $1,
          tray_number = $2,
          plant = $3,
          status = $4,
          updated_at = NOW()
      WHERE tray_id = $5
      RETURNING *
    `;
    const values = [tray_group_id, tray_number, newPlant, status || "Available", tray_id];
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
