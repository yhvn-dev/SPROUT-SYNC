import api from "../utils/api";

export const fetchAllReadings = async () => {
    try{
        const res = await api.get("/readings/get/readings");
        const readingsData = res.data
        return  readingsData
    }catch(error){
        console.error("Error Fetching Readings",error);
        throw error
    }
}

export const fetchAllLatestReadings = async () => {
    try{
        const res = await api.get("/readings/get/readings/latest");
        const latestReadingsData = res.data.data
        return  latestReadingsData
    }catch(error){
        console.error("Error Fetching Readings",error);
        throw error
    }
}

export const fetchReadingsBySensor = async (sensor_id) =>{
    try {
        const res = await api.get(`/readings/get/readings/sensors/${sensor_id}`);
        return res.data.data
    } catch (error) {
        console.error("Error Fetching Readings By Sensor",error);
        throw error
    }
}

export const fetchMoistureReadingsLast24hr = async () =>{
    try {
        const res = await api.get(`/readings/get/readings/last24h/`);
        return res.data
    } catch (error) {
        console.error("Error Fetching Moisture Readings by 24hr",error);
        throw error
    }
}

export const fetchAverageReadings = async () =>{
    try {
        const res = await api.get(`/readings/get/readings/average`);
        return res
    } catch (error) {
        console.error("Error Fetching Average Readings",error);
        throw error
    }
}



export const fetchAverageReadingsBySensor = async (sensor_type) =>{
    try {
        const res = await api.get(`/readings/get/readings/average/${sensor_type}`);
        return res.data; 
    } catch (error) {
        console.error("Error Fetching Average Readings By Sensor",error);
        throw error;
    }
}