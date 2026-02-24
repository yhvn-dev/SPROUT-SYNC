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

// ===== GET TOTALS OF SEEDLINGS =====
export const getPlantBatchTotals = async () => {
  try {
    const sql = `
      SELECT 
        SUM(total_seedlings) AS total_seedlings,
        SUM(dead_seedlings) AS total_dead,
        SUM(replanted_seedlings) AS total_replanted,
        SUM(fully_grown_seedlings) AS total_grown,
        CASE 
          WHEN SUM(total_seedlings) = 0 THEN 0
          ELSE ROUND(SUM(fully_grown_seedlings)::DECIMAL / SUM(total_seedlings) * 100, 2)
        END AS growth_rate_percentage,
        CASE
          WHEN SUM(total_seedlings) = 0 THEN 0
          ELSE ROUND(SUM(dead_seedlings)::DECIMAL / SUM(total_seedlings) * 100, 2)
        END AS death_rate_percentage
      FROM plant_batches
    `;
    const result = await query(sql);
    return result.rows[0]; 
  } catch (error) {
    throw error;
  }
};

// ===== GET SEEDLING GROWTH PER WEEK FOR ALL BATCHES =====
export const getSeedlingGrowthByWeekAll = async () => {
  try {
    const sql = `
     SELECT
          DATE_TRUNC('week', date_planted) AS week_start,
          SUM(COALESCE(fully_grown_seedlings, 0)) AS total_grown,
          SUM(COALESCE(dead_seedlings, 0)) AS total_dead,
          SUM(COALESCE(replanted_seedlings, 0)) AS total_replanted
      FROM plant_batches
      GROUP BY week_start
      ORDER BY week_start;
    `;
    const result = await query(sql);
    return result.rows; 
  } catch (error) {
    throw error;
  }
};


export const createPlantBatch = async (batchData) => {
  const {
    tray_id,
    plant_name,
    total_seedlings,
    dead_seedlings,
    replanted_seedlings,
    fully_grown_seedlings,
    growth_stage = "Seedling",
    date_planted,
    expected_harvest_days,
    batch_number
  } = batchData;


  // Force numeric defaults
  const dead = Number(dead_seedlings) || 0;
  const replanted = Number(replanted_seedlings) || 0;
  const grown = Number(fully_grown_seedlings) || 0;

  // AUTO-ADJUST: Never exceed total_seedlings
  const safeReplanted = Math.min(replanted, total_seedlings);
  const safeFullyGrown = Math.min(grown, total_seedlings);
  const totalAlive = total_seedlings - dead;
  const finalReplanted = Math.min(safeReplanted, totalAlive);
  const finalFullyGrown = Math.min(safeFullyGrown, totalAlive - finalReplanted);

  const sql = `
    INSERT INTO plant_batches (
      tray_id, plant_name, total_seedlings, dead_seedlings,
      replanted_seedlings, fully_grown_seedlings, growth_stage,
      date_planted, expected_harvest_days, batch_number
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
  `;

  const values = [
    tray_id,
    plant_name,
    total_seedlings,
    dead,              
    finalReplanted,
    finalFullyGrown,
    growth_stage,
    date_planted,
    expected_harvest_days,
    batch_number
  ];

  const result = await query(sql, values);
  return result.rows[0];
  
};



// ===== UPDATE a plant batch =====
export const updatePlantBatch = async (batchData, batch_id) => {
  const {
    tray_id,
    plant_name,
    total_seedlings,
    dead_seedlings = 0,
    replanted_seedlings = 0,
    fully_grown_seedlings = 0,
    growth_stage = "Seedling",
    date_planted,
    expected_harvest_days
  } = batchData;

  const computedTotal = total_seedlings + replanted_seedlings;

  try {
    const sql = `
      UPDATE plant_batches
      SET
        tray_id = $1,
        plant_name = $2,
        total_seedlings = $3,
        dead_seedlings = $4,
        replanted_seedlings = $5,
        fully_grown_seedlings = $6,
        growth_stage = $7,
        date_planted = $8,
        expected_harvest_days = $9
      WHERE batch_id = $10
      RETURNING *
    `;

    const values = [
      tray_id,
      plant_name,
      computedTotal,
      dead_seedlings,
      replanted_seedlings,
      fully_grown_seedlings,
      growth_stage,
      date_planted,
      expected_harvest_days,
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
