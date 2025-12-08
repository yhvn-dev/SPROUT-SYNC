// plantBatches.model.js
import { query } from "../config/db.js";

// ===== READ all plant batches =====
export const readPlantBatches = async () => {
    try {  
        const sql = `SELECT * FROM plant_batches ORDER BY batch_id ASC`;
        const result = await query(sql);
        return result.rows;       
    } catch (error) {
         throw error;
    }
};

// ===== READ single plant batch by ID =====
export const readPlantBatchById = async (batch_id) => {
    try {
        const sql = `SELECT * FROM plant_batches WHERE batch_id = $1`;
        const result = await query(sql, [batch_id]);
        return result.rows[0];       
    } catch (error) {
        throw error;
    }
};

// ===== CREATE a new plant batch =====
export const createPlantBatch = async (batchData) => {
    
    const { tray_group_id, plant_name, total_seedlings, date_planted, expected_harvest_days, status } = batchData;

    try {        
        const sql = `
            INSERT INTO plant_batches 
            (tray_group_id, plant_name, total_seedlings, date_planted, expected_harvest_days, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;

        const values = [tray_group_id, plant_name, total_seedlings, date_planted, expected_harvest_days, status || 'Growing'];
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// ===== UPDATE a plant batch =====
export const updatePlantBatch = async (batchData, batch_id) => {
    const { tray_group_id, plant_name, total_seedlings, date_planted, expected_harvest_days, status } = batchData;

    try {   
        const sql = `
            UPDATE plant_batches
            SET tray_group_id = $1, 
                plant_name = $2, 
                total_seedlings = $3, 
                date_planted = $4, 
                expected_harvest_days = $5,
                status = $6
            WHERE batch_id = $7
            RETURNING *
        `;
        const values = [tray_group_id, plant_name, total_seedlings, date_planted, expected_harvest_days, status, batch_id]; 
        const result = await query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// ===== DELETE a plant batch =====
export const deletePlantBatch = async (batch_id) => {
    try {
        const sql = `DELETE FROM plant_batches WHERE batch_id = $1 RETURNING *`;
        const result = await query(sql, [batch_id]);
        return result.rows[0];        
    } catch (error) {
        throw error;
    }
};