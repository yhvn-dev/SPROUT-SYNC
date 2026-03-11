// plantBatches.model.js
import { query } from "../config/db.js";


// ===== READ all plant batches =====
export const readPlantBatches = async () => {
  try {  
    const sql = `
      SELECT
        *,
        (date_planted + (expected_harvest_days || ' days')::interval) 
          AS expected_harvest_date
      FROM plant_batches
      WHERE status = 'Growing'
      ORDER BY expected_harvest_date ASC
    `;

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





  const computeHarvestStatus = (datePlanted, expectedDays, harvestedAt = null) => {
    if (harvestedAt) return "Harvested";

    const planted = new Date(datePlanted);
    const expected = new Date(planted);
    expected.setDate(expected.getDate() + Number(expectedDays));

    const today = new Date();
    today.setHours(0,0,0,0);
    expected.setHours(0,0,0,0);

    if (expected > today) return "Not Ready";
    if (expected.getTime() === today.getTime()) return "Due Now";
    return "Past Due";
  };


  export const createPlantBatch = async (batchData) => {
  try {
    const {
      tray_id,
      plant_name,
      total_seedlings,
      dead_seedlings,
      replanted_seedlings,
      fully_grown_seedlings,
      growth_stage = "Seedling",
      date_planted,
      expected_harvest_days
    } = batchData;

    const dead = Number(dead_seedlings) || 0;
    const replanted = Number(replanted_seedlings) || 0;
    const grown = Number(fully_grown_seedlings) || 0;

    const safeReplanted = Math.min(replanted, total_seedlings);
    const safeFullyGrown = Math.min(grown, total_seedlings);
    const totalAlive = total_seedlings - dead;
    const finalReplanted = Math.min(safeReplanted, totalAlive);
    const finalFullyGrown = Math.min(safeFullyGrown, totalAlive - finalReplanted);

    // 🔹 GET NEXT BATCH NUMBER BASED ON PLANT NAME
    const batchQuery = `
      SELECT COALESCE(MAX(batch_number), 0) + 1 AS next_batch
      FROM plant_batches
      WHERE plant_name = $1
    `;

    const batchResult = await query(batchQuery, [plant_name]);
    const nextBatchNumber = batchResult.rows[0].next_batch;
    const harvest_status = computeHarvestStatus(
      date_planted,
      expected_harvest_days
    );

    const sql = `
      INSERT INTO plant_batches (
        tray_id,
        plant_name,
        total_seedlings,
        dead_seedlings,
        replanted_seedlings,
        fully_grown_seedlings,
        growth_stage,
        date_planted,
        expected_harvest_days,
        batch_number,
        harvest_status
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
      nextBatchNumber,
      harvest_status
    ];

    const result = await query(sql, values);
    return result.rows[0];

  } catch (err) {
    console.error("MODELS: Error Creating Plant Batch", err);
    throw err;
  }
};




  // plantBatchesModels.js
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
      expected_harvest_days,
    } = batchData;

    
    // Ensure total_alive is consistent
    const totalAlive = Number(total_seedlings) - Number(dead_seedlings);
    const finalReplanted = Math.min(Number(replanted_seedlings), totalAlive);
    const finalFullyGrown = Math.min(Number(fully_grown_seedlings), totalAlive - finalReplanted);
    const computedTotal = Number(total_seedlings); 

    const harvest_status = computeHarvestStatus(
      date_planted,
      expected_harvest_days,
    );

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
        expected_harvest_days = $9,
        harvest_status = $10
      WHERE batch_id = $11
      RETURNING *;
    `;

    const values = [
      tray_id,
      plant_name,
      computedTotal,
      dead_seedlings,
      finalReplanted,
      finalFullyGrown,
      growth_stage,
      date_planted,
      expected_harvest_days,
      harvest_status,
      batch_id
    ];
    const result = await query(sql, values);
    return result.rows[0];
  };


  
  export const updateHarvestStatus = async (batch_id, harvest_status) => {
  try {
    const sql = `
      UPDATE plant_batches
      SET harvest_status = $1
      WHERE batch_id = $2
      RETURNING *
    `;

    const result = await query(sql, [harvest_status, batch_id]);
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
