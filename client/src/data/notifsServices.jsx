import api from "../utils/api";

export const fetchAllNotifs = async () => {
    try{
        const res = await api.get("/notif/get/notif");
        const notifData = res.data
        console.log("NOTIFICATION DATA",notifData)
        return notifData
    }catch(err){
        console.error("Error Fetching Notifications",err);
        throw err
    }
}

export const fetchNotifsCount = async () => {
    try{
        const res = await api.get("/notif/get/notif/count");
        const notifCount = res.data
        return notifCount 
    }catch(err){
        console.error("Error Fetching Notifications Count",err);
        throw err
    }
}



export const markNotifAsRead = async () => {
    try{
        const res = await api.put("/notif/put/notif/read");
        const notifStatus = res.data
        console.log("NOTIF STATUS",notifStatus)
        return notifStatus 
    }catch(err){
        console.error("Error updating notification status",err);
        throw err
    }
}

export const deleteNotifs = async (notification_id) => {
    try{
        console.log(notification_id)
        const res = await api.delete(`/notif/delete/notif/${notification_id}`);
        const notifData = res.data
        console.log("NOTIFICATION DELETED",notifData )
        return notifData  
    }catch(err){
        console.error("Error deleting notifications",err);
        throw err
    }
}


export const deleteAllNotifs = async () => {
    try{
        const res =  await api.delete(`/notif/delete/notif/all`);
        return res
    }catch(err){
        console.error("Error deleting all notifications",err);
        throw err
    }
}



