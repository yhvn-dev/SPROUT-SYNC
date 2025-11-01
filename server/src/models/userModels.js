import {query} from "../config/db.js"
import * as utils from "../utils/hashPass.js"

export const findUser = async (loginInput) =>{

    try{
        const { rows } = await query("SELECT * FROM users WHERE username = $1 OR email = $1",[loginInput]) 
        return rows[0]
        
    }catch(err){
        console.log(`MODELS: Error Getting Username and Email ${err}`, )
        throw err
    }
}


export const countAllUsers = async() =>{
    try {
        
        const { rows } = await query("SELECT COUNT(*) AS total_users FROM users");
        return rows[0];

    } catch (err) {
        console.log(`MODELS: Error Counting Users ${err}`)
    }
}

export const countUserByRole = async () => {
  try {
    const { rows } = await query(`
      SELECT role, COUNT(*) AS total_users FROM users GROUP BY role ORDER BY role;`);
    return rows; // will return an array, not just one row
  } catch (err) {
    console.log(`MODELS: Error Counting Users By Roles ${err}`);
  }
};

export const countUserByStatus = async () =>{
  try {
    const { rows } = await query(`SELECT status, COUNT(*) AS total_users from users GROUP BY status ORDER BY status`) 
    return rows;
  } catch (err) {
       console.log(`MODELS: Error Counting Users By Status ${err}`);
  }
}
                

export const getUsers = async () =>{
    try{
        const { rows } = await query("SELECT * FROM users");
        return rows
    }catch(err){
        console.log(`MODELS: Error Getting Users ${err}`)
        throw err
    }
}


export const selectUser = async (user_id) => {
    try{
        const { rows } = await query("SELECT * FROM users WHERE user_id = $1",[user_id])
        return rows[0] 
    }catch(err){
        console.log(`MODELS: Error Selecting User ${err}`)
        throw err
    }   
}

export const filterUser = async (value,filterBy) => {
  try{

    const allowedValues = ["owner","admin","viewer","active","inactive"];
    const allowedColumns = ["username","fullname","email","role","status","created_at"]    

    if(!allowedColumns.includes(filterBy))
      { throw new Error("Invalid Filter Column")}      
      
    if(value && !allowedValues.includes(value)){ // if ung value ay wala sa requirement values
        throw new Error ("Invalid Users")
    }

    let queryText;
    let params = [];
    
    if(value && value.trim() !== ""){ // if may value 

      queryText = `SELECT * FROM users WHERE ${filterBy} = $1 ORDER BY ${filterBy} ASC`;  
      params = [value]

    }else{  
        queryText = `SELECT * FROM users ORDER BY ${filterBy} ASC`;
    } 
  
    const { rows } = await query(queryText,params)  
    return rows;
  
  }catch(err){
    console.log(`MODELS: Error Filtering User ${err}`)
    throw err
  }

}


export const searchUser = async (term) => {
  try {
    const { rows } = await query(
      `SELECT * FROM users 
       WHERE username ILIKE $1 
       OR fullname ILIKE $1 
       OR email ILIKE $1 
       OR phone_number ILIKE $1 
       OR role ILIKE $1 
       OR status ILIKE $1`,
      [`%${term}%`]
    );
    return rows; 
  } catch (err) {
    console.log(`MODELS: Error SEARCHING Users`, [`%${term}%`]);
    throw err;
  }
};




export const insertUsers = async(userData) => {    
    try{

        const {username,fullname,email,phone_number,password,role,status,profile_picture} = userData
        const hashedPassword = await utils.hashedPass(password)

        const { rows } = await query(`INSERT INTO users 
          (username,fullname,email,phone_number,password_hash,role,status,profile_picture) 
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,[username,fullname,email,phone_number,hashedPassword,role,status,profile_picture])
          
        return rows[0]

    }catch(err){
        console.log(`MODELS: Error Inserting Users ${err}`)
        throw err
    }
    
}


export const updateUser = async(user_id,userData) => {
    try{
        
      const {username,fullname,email,phone_number,password,role,status,profile_picture} = userData
      // IF THERES A PASSWORD
      if(password && password.trim() !== ""){
        const hashedPassword = await utils.hashedPass(password)

        const { rows } = await query(`UPDATE users SET 
                      username = $1,fullname = $2, email = $3,phone_number = $4,
                      password_hash = $5,role = $6, status = $7, profile_picture = $8 WHERE user_id = $9 
                      RETURNING *`,
                      [username,fullname,email,phone_number,hashedPassword,role,status,profile_picture,user_id])

        return rows[0]

      }else{
        
        // IF THERES NO PASSWORD
        const { rows } = await query(
        `UPDATE users  SET username = $1,
         fullname = $2, email = $3, phone_number = $4, role = $5, status = $6, profile_picture = $7
         WHERE user_id = $8 RETURNING *`,
        [username, fullname, email, phone_number, role, status, profile_picture,user_id]);

         return rows[0];
      }
      
    }catch(err){
        console.log(`MODELS: Error Updating Users ${err}`)
        throw err
    }

}



export const deleteUser = async (user_id) =>{
    
    try{
        const { rows } = await query("DELETE FROM users WHERE user_id = $1 RETURNING *",[user_id])
        return rows[0]
    }catch(err){
        console.log(`MODELS: Error Deleting Users ${err}`)
        throw err
    }

}







