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
    
    return rows; 
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
        throw error;
    }
}


export const readTotalUnreadNotifCount = async () => {
    try {
        const { rows } = await query(
            "SELECT COUNT(*) as total FROM notifications WHERE is_read = false",[]);
        return rows[0].total;
    } catch (error) {   
        console.error("MODELS: Error Reading Total Unread Notifications Count", error);
        throw error; 
    }
};



// Mark ALL unread notifications as read (clears the count)
export const markAllNotificationsAsRead = async () => {
    try {
        await query("UPDATE notifications SET is_read = true WHERE is_read = false");
        return true;
    } catch (error) {
        console.error("MODELS: Error marking all notifications as read", error);
        throw error;
    }
};


export const createNotif = async (notificationData) => {
    const { type, message, related_sensor, status } = notificationData;
    const { rows } = await query(`
        INSERT INTO notifications (type, message, related_sensor, status, is_read, created_at) 
        VALUES ($1, $2, $3, $4, false, NOW())
        RETURNING *
    `, [type, message, related_sensor, status]);
    return rows[0];
};


export const updateNotif = async function (notifData,notification_id) {
  const {type,message,related_sensor,status,is_read} = notifData

  try {
      const { rows } = await query(`UPDATE notifications SET 
        type = $1, message = $2, 
        related_sensor = $3, 
        status = $4, 
        is_read = $5 WHERE 
        notification_id = $6
        RETURNING *`,
        [type,message,related_sensor,status,is_read,notification_id])

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



export const deleteAllNotifs = async () => {
  try {
    await query(`DELETE FROM notifications`)
  } catch (error) {
    console.error('Error deleting all notification:', error);
    throw error;
  }
};







