// trayGroups.model.js
import { query } from "../config/db.js";

// ===== CREATE a new tray group =====
export const createTrayGroups = async (trayGroupData) => {
    const {tray_group_name,is_watering} = trayGroupData

    try {        
        const sql = `INSERT INTO tray_groups (tray_group_name,is_watering) VALUES ($1, $2) RETURNING *`;
        const values = [tray_group_name,is_watering];
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error
    }
};



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




export const updateTrayGroups = async (trayGroupData, tray_group_id) => {
    const {tray_group_name,is_watering} = trayGroupData
    try {   
        const sql = `
            UPDATE tray_groups
            SET tray_group_name = $1, is_watering = $2
            WHERE tray_group_id = $3
            RETURNING *
        `;
        const values = [tray_group_name,is_watering,tray_group_id]; 
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error
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