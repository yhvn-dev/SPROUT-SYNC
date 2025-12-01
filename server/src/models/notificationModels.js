import {query} from "../config/db.js" 


export const readNotif = async () =>{
    try {
        const { rows } = await query("SELECT * FROM notifications ORDER BY created_at DESC")
        return rows[0];
    } catch (error) {   
        console.error("MODELS: Error Reading Notifications")
    }
}



export const createNotif = async (message, bedId, sensorId) => {
  try {
    const { rows } = await query(`INSERT INTO notifications (message, bed_id, sensor_id, status, created_at  
         VALUES ($1, $2, $3, 'unread', NOW()) RETURNING *`,[message, bedId, sensorId])
    return rows[0];
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};




export const deleteNotif = async (notif_id) => {
  try {
    await query(`DELETE FROM notifications WHERE notif_id = $1`,[notif_id])
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};





// Notifications table
// Stores notifications to be shown on the dashboard.
// Field	Type	Description
// notification_id	INT (PK)	Unique ID
// type	VARCHAR	Sensor Alert / Bed Alert
// message	TEXT	Notification message
// related_bed	INT (FK)	Optional, which bed it relates to
// related_sensor	INT (FK)	Optional, which sensor it relates to
// status	VARCHAR	Unread / Read
// created_at	DATETIME	Timestamp when notification created