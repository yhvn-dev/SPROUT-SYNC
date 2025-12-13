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
    const checkSql = `SELECT plant FROM trays WHERE plant ~ $1`;
    const existing = await query(checkSql, [`^${baseName}( - \\d+)?$`]);

    let nextNumber = 1;
    if (existing.rows.length > 0) {
      const suffixNumbers = existing.rows.map(r => {
        const match = r.plant.match(/- (\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      });
      nextNumber = Math.max(...suffixNumbers) + 1;
    }

    plant = `${baseName} - ${nextNumber}`;

    const sql = `
      INSERT INTO trays (tray_group_id, plant, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [tray_group_id, plant, status || 'Available'];
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};




// ===== UPDATE a tray =====
export const updateTray = async (trayData, tray_id) => {
  let { tray_group_id, plant, status } = trayData;

  try {
    const existingTray = await query(`SELECT plant FROM trays WHERE tray_id = $1`, [tray_id]);
    if (!existingTray.rows[0]) throw new Error("Tray not found");

    const existingPlantFull = existingTray.rows[0].plant;
    const baseName = plant.trim();

    let finalPlant = existingPlantFull; // default: keep current full name

    // If base name changed, calculate next number
    const currentBase = existingPlantFull.split(" - ")[0];
    if (currentBase !== baseName) {
      const existing = await query(`SELECT plant FROM trays WHERE plant ~ $1`, [`^${baseName}( - \\d+)?$`]);
      let nextNumber = 1;
      if (existing.rows.length > 0) {
        const suffixNumbers = existing.rows.map(r => {
          const match = r.plant.match(/- (\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        });
        nextNumber = Math.max(...suffixNumbers) + 1;
      }
      finalPlant = `${baseName} - ${nextNumber}`;
    }

    const sql = `
      UPDATE trays
      SET tray_group_id = $1,
          plant = $2,
          status = $3
      WHERE tray_id = $4
      RETURNING *
    `;
    const values = [tray_group_id, finalPlant, status || "Available", tray_id];
    const result = await query(sql, values);
    return result.rows[0];
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
