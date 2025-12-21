import { query } from "../config/db.js"


export const insertRefreshToken = async (user_id,tokenBody) =>{
    
    try{

        const {refresh_token,device} = tokenBody 

        const { rows } = await query(`INSERT INTO tokens (user_id,refresh_token,device) 
        VALUES ($1,$2,$3) RETURNING *`,[user_id,refresh_token,device])
        return rows[0]
        
    }catch(err){
        console.log("MODELS: Error Inserting Refresh Tokens",err)
        throw err
    }

}





export const findRefreshToken = async (refreshToken) => {
    try{

        const { rows } = await query("SELECT * FROM tokens WHERE refresh_token = $1",[refreshToken])
        return rows[0];
        
    }catch(err){
        console.log("MODELS: Error Finding Refresh Token")
        throw err
    }
}


export const deleteAllRefreshToken = async (user_id) =>{

    try{
        const { rows } = await query("DELETE FROM tokens WHERE user_id = $1 RETURNING *",[user_id])
        return rows[0];

    }catch(err){
        console.log("MODELS: Error Deleting All Tokens")
        throw err
    }
}


export const deleteRefreshTokenByDevice = async (user_id, device_id) => {
  try {
    const { rows } = await query(
      "DELETE FROM tokens WHERE user_id = $1 AND device_id = $2 RETURNING *",
      [user_id,device_id]
    );

    console.log(rows[0])
    return rows[0];
  } catch (err) {
    console.log("MODELS: Error Deleting Token By Device", err);
    throw err;
  }
};





