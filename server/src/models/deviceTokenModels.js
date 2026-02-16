import { query } from "../config/db.js";


export const insertDeviceToken = async (
  user_id,
  push_token,
  device_type,
  device_info
) => {
  try {
    const { rows } = await query(
      `
      INSERT INTO device_tokens (user_id, push_token, device_type, device_info)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, push_token)
      DO UPDATE SET
        device_type = EXCLUDED.device_type,
        device_info = EXCLUDED.device_info,
        last_active = NOW()
      RETURNING *;
      `,
      [user_id, push_token, device_type, device_info]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Inserting Device Token", err);
    throw err;
  }
};



export const getAllDeviceTokens = async () => {
  try {
    const { rows } = await query(
      `SELECT * FROM device_tokens`);
    return rows;
  } catch (err) {
    console.error("MODELS: Error Fetching All Device Tokens", err);
    throw err;
  }
};




// Get all tokens for a user
export const getDeviceTokensByUser = async (user_id) => {
  try {
    const { rows } = await query(
      `SELECT * FROM device_tokens WHERE user_id = $1`,
      [user_id]
    );
    return rows;
  } catch (err) {
    console.error("MODELS: Error Fetching Device Tokens", err);
    throw err;
  }

  
};




// Delete a token (like when user logs out or unsubscribes)
export const deleteDeviceToken = async (user_id, token) => {
  try {
    const { rows } = await query(
      `DELETE FROM device_tokens WHERE user_id = $1 AND push_token = $2 RETURNING *`,
      [user_id, token]
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Deleting Device Token", err);
    throw err;
  }

};





export const deleteAllDeviceToken = async () => {
  try {
    const { rows } = await query(
      `DELETE FROM device_tokens`,
    );
    return rows[0];
  } catch (err) {
    console.error("MODELS: Error Deleting All Device Token", err);
    throw err;
  }
};