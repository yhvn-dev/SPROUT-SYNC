import { query } from "../config/db.js";

/* =========================
   CREATE PLANT GROUP
========================= */
export const createPlantGroup = async (
  group_name,
  moisture_min,
  moisture_max
) => {
  try {
    const { rows } = await query(
      `
      INSERT INTO plant_groups (group_name, moisture_min, moisture_max)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [group_name, moisture_min, moisture_max]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Creating Plant Group", err);
    throw err;
  }
};

/* =========================
   READ ALL PLANT GROUPS
========================= */
export const getAllPlantGroups = async () => {
  try {
    const { rows } = await query(
      `SELECT * FROM plant_groups ORDER BY group_name ASC`
    );
    return rows;
  } catch (err) {
    console.error("MODELS: Error Fetching Plant Groups", err);
    throw err;
  }
};

/* =========================
   READ SINGLE PLANT GROUP
========================= */
export const getPlantGroupById = async (plant_group_id) => {
  try {
    const { rows } = await query(
      `SELECT * FROM plant_groups WHERE plant_group_id = $1`,
      [plant_group_id]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Fetching Plant Group", err);
    throw err;
  }
};

/* =========================
   UPDATE PLANT GROUP
========================= */
export const updatePlantGroup = async (
  plant_group_id,
  group_name,
  moisture_min,
  moisture_max
) => {
  try {
    const { rows } = await query(
      `
      UPDATE plant_groups
      SET
        group_name = $1,
        moisture_min = $2,
        moisture_max = $3
      WHERE plant_group_id = $4
      RETURNING *;
      `,
      [group_name, moisture_min, moisture_max, plant_group_id]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Updating Plant Group", err);
    throw err;
  }
};

/* =========================
   DELETE PLANT GROUP
========================= */
export const deletePlantGroup = async (plant_group_id) => {
  try {
    const { rows } = await query(
      `
      DELETE FROM plant_groups
      WHERE plant_group_id = $1
      RETURNING *;
      `,
      [plant_group_id]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Deleting Plant Group", err);
    throw err;
  }
};