import {query} from "../config/db.js" 

// NOTIF TYPE
//  - Warning
//  - Alert
// - Error
// - Info
//  - Success



// NOTIF STATUS
// NORMAL
// DISCONNECTED
// FAULTY


export const readNotif = async () => {
  try {
    const { rows } = await query(
      "SELECT * FROM notifications ORDER BY created_at ASC"
    );
    
    return rows; // ✅ lahat na ang ibabalik
  } catch (error) {
    console.error("MODELS: Error Reading Notifications", error);
    throw error;
  }
};



export const readNotifById = async (notification_id) =>{
    try {
        const { rows } = await query("SELECT * FROM notifications WHERE notification_id = $1 ORDER BY created_at ASC",[notification_id])
        return rows[0];
    } catch (error) {   
        console.error("MODELS: Error Reading Notifications")
    }
}




export const createNotif = async (notifData) => {
  const {type,message,related_sensor,status} = notifData
  try {
    const { rows } = await query(`INSERT INTO notifications (type,message,related_sensor,status) 
         VALUES ($1, $2, $3, $4) RETURNING *`,[type,message,related_sensor,status])
    return rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};


export const updateNotif = async function (notifData,notification_id) {
  const {type,message,related_sensor,status} = notifData
  try {
      const { rows } = await query(`UPDATE notifications SET 
        type = $1, 
        message = $2, 
        related_sensor = $3,
        status = $4 WHERE notification_id = $5
        RETURNING *`,
        [type,message,related_sensor,status,notification_id])

    return rows[0];
  } catch (error) {
     console.error('Error updating notification:', error);
    throw error;
  }
}



export const deleteNotif = async (notification_id) => {
  try {
    await query(`DELETE FROM notifications WHERE notification_id = $1`,[notification_id])
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};



