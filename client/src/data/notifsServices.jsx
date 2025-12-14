import api from "../utils/api";

export const fetchAllNotifs = async () => {
    try{
        const res = await api.get("/notif/get/notif");
        const notifData = res.data
        return notifData
    }catch(err){
        console.error("Error Fetching Readings",err);
        throw err
    }
}



