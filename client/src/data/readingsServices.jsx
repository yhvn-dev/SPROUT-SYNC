import api from "../utils/api";

export const fetchAllReadings = async () => {
    try{
        const res = await api.get("/readings/get/readings");
        return res.data.data
    }catch(err){
        console.err("Error Fetching Readings",err);
        throw err
    }
}

export const fetchReadingsBySensor = async (sensor_id) =>{
    try {
        const res = await api.get(`/readings/get/readings/sensors/${sensor_id}`);
        return res.data.data
    } catch (error) {
        console.err("Error Fetching Readings By Sensor",err);
        throw err
    }
}


