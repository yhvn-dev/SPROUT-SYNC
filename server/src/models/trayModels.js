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

    const {tray_group_id, batch_id, plant, is_alive, is_harvested, status} = trayData;
    try {
        const sql = `
            INSERT INTO trays (tray_group_id, batch_id, plant, is_alive, is_harvested, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [tray_group_id, batch_id, plant, is_alive, is_harvested, status || 'Active'];
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// ===== UPDATE a tray =====
export const updateTray = async (trayData, tray_id) => {
    
    const {tray_group_id, batch_id, plant, is_alive, is_harvested, status} = trayData;
    
    try {
        const sql = `
            UPDATE trays
            SET tray_group_id = $1,
                batch_id  = $2
                plant = $3,
                is_alive = $4,
                is_harvested = $5,
                status = $6
            WHERE tray_id = $7
            RETURNING *
        `;
        const values = [tray_group_id, batch_id, plant, is_alive, is_harvested, status || 'Active', tray_id];
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

;

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
