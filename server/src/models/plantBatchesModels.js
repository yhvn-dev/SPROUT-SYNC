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
  const {
    tray_id,
    plant_name,
    total_seedlings,
    alive_seedlings,
    dead_seedlings,
    replanted_seedlings,
    fully_grown_seedlings,
    growth_stage,
    date_planted,
    expected_harvest_days,
    status
  } = batchData;

  try {
    const sql = `
      INSERT INTO plant_batches 
      (tray_id, plant_name, total_seedlings, alive_seedlings, dead_seedlings, replanted_seedlings, fully_grown_seedlings, growth_stage, date_planted, expected_harvest_days, status) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;

    const values = [
      tray_id,
      plant_name,
      total_seedlings !== undefined ? total_seedlings : null,
      alive_seedlings !== undefined ? alive_seedlings : null,
      dead_seedlings !== undefined ? dead_seedlings : null,
      replanted_seedlings !== undefined ? replanted_seedlings : null,
      fully_grown_seedlings !== undefined ? fully_grown_seedlings : null,
      growth_stage || 'Seedling',
      date_planted,
      expected_harvest_days,
      status || 'Growing'
    ];

    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};




// ===== UPDATE a plant batch =====
export const updatePlantBatch = async (batchData, batch_id) => {
  const {
    tray_id,
    plant_name,
    total_seedlings,
    alive_seedlings,
    dead_seedlings,
    replanted_seedlings,
    fully_grown_seedlings,
    growth_stage,
    date_planted,
    expected_harvest_days,
    status
  } = batchData;

  try {
    const sql = `
      UPDATE plant_batches
      SET tray_id = $1,
          plant_name = $2,
          total_seedlings = $3,
          alive_seedlings = $4,
          dead_seedlings = $5,
          replanted_seedlings = $6,
          fully_grown_seedlings = $7,
          growth_stage = $8,
          date_planted = $9,
          expected_harvest_days = $10,
          status = $11
      WHERE batch_id = $12
      RETURNING *
    `;

    const values = [
      tray_id,
      plant_name,
      total_seedlings !== undefined ? total_seedlings : null,
      alive_seedlings !== undefined ? alive_seedlings : null,
      dead_seedlings !== undefined ? dead_seedlings : null,
      replanted_seedlings !== undefined ? replanted_seedlings : null,
      fully_grown_seedlings !== undefined ? fully_grown_seedlings : null,
      growth_stage || 'Seedling',
      date_planted,
      expected_harvest_days,
      status || 'Growing',
      batch_id
    ];

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