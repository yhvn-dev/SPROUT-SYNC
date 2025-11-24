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




export const insertSensors = async (data) =>{
    try{
        const res = await api.post("/sensors/post/sensors",data);
        const sensors = res.data.data
        return sensors        
    }catch(err){
        throw err
    }
} 

export const updateSensors = async (sensorData,sensor_id) =>{

    try{
        const res = await api.put(`/sensor/put/sensor/${sensor_id}`,sensorData);
        const sensors = res.data.data
        return sensors        
    }catch(err){
        console.error("Error Updating Sensors",err)
        throw err
    }
}


export const deletSensors = async (sensor_id) => {
    try{
        console.log(sensor_id)
        await api.delete(`sensor/delete/sensor/${sensor_id}`)
    } catch (err) {
        console.error("Error Deleting sensor")
    }
};

