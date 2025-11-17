import api from "../utils/api";

export const fetchAllSensors = async () =>{
    try {
        const sensors = await api.get("/sensors/get/sensors");
        return sensors.data.data
    } catch (error) {
        console.error("Error Fetching All Sensors")        
        throw error
    }
}

export const fetchSensorsCountByBed = async (bed_id) =>{
    try {
        const sensors = await api.get(`sensors/get/count/sensors/${bed_id}`);
        return sensors.data.data
    } catch (error) {
        console.error("Error Fetching Sensors Count By Bed")        
        throw error
    }
}


export const fetchSensorsCount = async () =>{
    try {
        const sensors = await api.get(`sensors/get/count/sensors`);
        return sensors.data.data
    } catch (error) {
        console.error("Error Fetching Sensors Count")        
        throw error
    }
}