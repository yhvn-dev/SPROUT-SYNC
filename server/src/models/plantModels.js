// plantModels.js
import { query } from '../config/db.js'; // adjust path to your db file

/* =========================
   CREATE PLANT
========================= */
export const createPlant = async (
  name,
  description,
  reference_link,
  moisture_min,
  moisture_max,
  group_id
) => {
  try {
    const { rows } = await query(
      `
      INSERT INTO plants 
        (name, description, reference_link, moisture_min, moisture_max, group_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [name, description, reference_link, moisture_min, moisture_max, group_id]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Creating Plant", err);
    throw err;
  }
};

/* =========================
   GET ALL PLANTS
========================= */
export const getAllPlants = async () => {
  try {
    const { rows } = await query(`SELECT * FROM plants ORDER BY created_at ASC`);
    return rows;
  } catch (err) {
    console.error("MODELS: Error fetching plants", err);
    throw err;
  }
};


/* =========================
   GET PLANT BY ID
========================= */
export const getPlantById = async (plant_id) => {
  try {
    const { rows } = await query(`SELECT * FROM plants WHERE plant_id = $1`, [plant_id]);
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error fetching plant by ID", err);
    throw err;
  }
};

/* =========================
   UPDATE PLANT
========================= */
export const updatePlant = async (
  plant_id,
  name,
  description,
  reference_link,
  moisture_min,
  moisture_max,
  group_id
) => {
  try {
    const { rows } = await query(
      `
      UPDATE plants
      SET 
        name = $1,
        description = $2,
        reference_link = $3,
        moisture_min = $4,
        moisture_max = $5,
        group_id = $6
      WHERE plant_id = $7
      RETURNING *;
      `,
      [name, description, reference_link, moisture_min, moisture_max, group_id, plant_id]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error updating plant", err);
    throw err;
  }
};




/* =========================
   DELETE PLANT
========================= */
export const deletePlant = async (plant_id) => {
  try {
    const { rows } = await query(
      `DELETE FROM plants WHERE plant_id = $1 RETURNING *;`,
      [plant_id]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error deleting plant", err);
    throw err;
  }
};