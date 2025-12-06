import api from "../utils/api";

export const fetchAllReadings = async () => {
    try{
        const res = await api.get("/notifs/get/notifs");
        const readingsData = res.data
        return  readingsData
    }catch(err){
        console.err("Error Fetching Readings",err);
        throw err
    }
}



