import { query } from "../config/db.js";
import * as utils from "../utils/hashPass.js";

export const findUser = async (loginInput) => {
  try {
    const { rows } = await query(
      "SELECT * FROM users WHERE username = $1 OR email = $1",
      [loginInput]
    );
    return rows[0];
  } catch (err) {
    console.log(`MODELS: Error Getting Username and Email ${err}`);
    throw err;
  }
};

export const countAllUsers = async () => {
  try {
    const { rows } = await query("SELECT COUNT(*) AS total_users FROM users");
    return rows[0];
  } catch (err) {
    console.log(`MODELS: Error Counting Users ${err}`);
  }
};

export const countUserByRole = async () => {
  try {
    const { rows } = await query(`
      SELECT role, COUNT(*) AS total_users FROM users GROUP BY role ORDER BY role;
    `);
    return rows;
  } catch (err) {
    console.log(`MODELS: Error Counting Users By Roles ${err}`);
  }
};

export const getUsers = async () => {
  try {
    const { rows } = await query("SELECT * FROM users ORDER BY created_at DESC");
    return rows;
  } catch (err) {
    console.log(`MODELS: Error Getting Users ${err}`);
    throw err;
  }
};

export const selectUser = async (user_id) => {
  try {
    const { rows } = await query("SELECT * FROM users WHERE user_id = $1", [user_id]);
    return rows[0];
  } catch (err) {
    console.log(`MODELS: Error Selecting User ${err}`);
    throw err;
  }
};

export const filterUser = async (value, filterBy) => {
  try {
    const allowedValues = ["owner", "admin", "viewer"];
    const allowedColumns = ["username", "fullname", "email", "role", "created_at"];

    if (!allowedColumns.includes(filterBy)) {
      throw new Error("Invalid Filter Column");
    }

    if (value && !allowedValues.includes(value)) {
      throw new Error("Invalid Users");
    }

    let queryText;
    let params = [];

    if (value && value.trim() !== "") {
      queryText = `SELECT * FROM users WHERE ${filterBy} = $1 ORDER BY ${filterBy} ASC`;
      params = [value];
    } else {
      queryText = `SELECT * FROM users ORDER BY ${filterBy} ASC`;
    }

    const { rows } = await query(queryText, params);
    return rows;
  } catch (err) {
    console.log(`MODELS: Error Filtering User ${err}`);
    throw err;
  }
};

export const searchUser = async (term) => {
  try {
    const { rows } = await query(
      `SELECT * FROM users 
       WHERE username ILIKE $1 
       OR fullname ILIKE $1 
       OR email ILIKE $1 
       OR phone_number ILIKE $1 
       OR role ILIKE $1`,
      [`%${term}%`]
    );
    return rows;
  } catch (err) {
    console.log(`MODELS: Error SEARCHING Users`, [`%${term}%`]);
    throw err;
  }
};

export const insertUsers = async (userData) => {
  try {
    const { username, fullname, email, phone_number, password, role } = userData;
    const hashedPassword = await utils.hashedPass(password);

    const { rows } = await query(
      `INSERT INTO users (username, fullname, email, phone_number, password_hash, role)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [username, fullname, email, phone_number, hashedPassword, role]
    );

    return rows[0];
  } catch (err) {
    console.log(`MODELS: Error Inserting Users ${err}`);
    throw err;
  }
};



// ===== COUNT users by status =====
export const countUsersByStatus = async () => {
  try {
    const sql = `
      SELECT COALESCE(status, 'unknown') AS status, COUNT(*) AS total_users
      FROM users
      GROUP BY status
      ORDER BY status;
    `;
    const result = await query(sql);
    return result.rows; // [{status: 'active', total_users: 5}, ...]
  } catch (error) {
    console.error("MODELS: Error Counting Users by Status", error);
    throw new Error("CONTROLLER: Error Counting Users by Status");
  }
};



export const updateUser = async (user_id, userData) => {
  try {
    const { username, fullname, email, phone_number, password, role } = userData;

    if (password && password.trim() !== "") {
      const hashedPassword = await utils.hashedPass(password);

      const { rows } = await query(
        `UPDATE users SET 
           username = $1,
           fullname = $2,
           email = $3,
           phone_number = $4,
           password_hash = $5,
           role = $6
         WHERE user_id = $7
         RETURNING *`,
        [username, fullname, email, phone_number, hashedPassword, role, user_id]
      );

      return rows[0];
    } else {
      const { rows } = await query(
        `UPDATE users SET 
           username = $1,
           fullname = $2,
           email = $3,
           phone_number = $4,
           role = $5
         WHERE user_id = $6
         RETURNING *`,
        [username, fullname, email, phone_number, role, user_id]
      );

      return rows[0];
    }
  } catch (err) {
    console.log(`MODELS: Error Updating Users ${err}`);
    throw err;
  }
};



export const deleteUser = async (user_id) => {
  try {
    const { rows } = await query("DELETE FROM users WHERE user_id = $1 RETURNING *", [user_id]);
    return rows[0];
  } catch (err) {
    console.log(`MODELS: Error Deleting Users ${err}`);
    throw err;
  }
};
