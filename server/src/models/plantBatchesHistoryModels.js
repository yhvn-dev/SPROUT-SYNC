// plantBatchHistory.model.js
import { query } from "../config/db.js";

// ===== READ all history =====
export const readPlantBatchHistory = async () => {
  try {
    const sql = `SELECT * FROM plant_batch_history ORDER BY date_recorded DESC`;
    const result = await query(sql);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// ===== READ history by history_id =====
export const readHistoryById = async (history_id) => {
  try {
    const sql = `SELECT * FROM plant_batch_history WHERE history_id = $1`;
    const result = await query(sql, [history_id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// ===== READ history by batch_id =====
export const readHistoryByBatchId = async (batch_id) => {
  try {
    const sql = `SELECT * FROM plant_batch_history WHERE batch_id = $1 ORDER BY date_recorded DESC`;
    const result = await query(sql, [batch_id]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};



// ===== CREATE a history record =====
export const createHistoryRecord = async (historyData) => {
  const {
    batch_id = null,
    tray_id = null,
    plant_name,
    date_recorded = new Date(),           // default to today
    total_seedlings = 0,
    dead_seedlings = 0,
    replanted_seedlings = 0,
    fully_grown_seedlings = 0,
    growth_stage = "Seedling",
    expected_harvest_days,
    notes = null
  } = historyData;

  const sql = `
    INSERT INTO plant_batch_history (
      batch_id, tray_id, plant_name, date_recorded,
      total_seedlings, dead_seedlings, replanted_seedlings, fully_grown_seedlings,
      growth_stage, expected_harvest_days, notes
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;
  const values = [
    batch_id, tray_id, plant_name, date_recorded,
    total_seedlings, dead_seedlings, replanted_seedlings, fully_grown_seedlings,
    growth_stage, expected_harvest_days, notes
  ];

  try {
    const result = await query(sql, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// ===== DELETE a history record (optional) =====
export const deleteHistoryRecord = async (history_id) => {
  try {
    const sql = `DELETE FROM plant_batch_history WHERE history_id = $1 RETURNING *`;
    const result = await query(sql, [history_id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
