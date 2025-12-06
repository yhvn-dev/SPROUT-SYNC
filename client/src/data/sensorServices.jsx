import api from "../utils/api";

export const fetchAllSensors = async () =>{
    try {
        const sensors = await api.get("/sensors/get/sensors");
        const sensorData = sensors.data
        return sensorData 
    } catch (error) {
        console.error("Error Fetching All Sensors")        
        throw error
    }
}

export const fetchSensorsCountByBed = async (tray_group_id) =>{
    try {
        const sensors = await api.get(`sensors/get/count/sensors/${tray_group_id}`);
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
        console.log(sensorData)
        const res = await api.put(`/sensors/put/sensors/${sensor_id}`,sensorData);
        const sensors = res.data.data
        return sensors        
    }catch(err){
        console.error("Error Updating Sensors",err)
        throw err
    }
}


export const deleteSensors = async (sensor_id) => {
    try{
        await api.delete(`sensors/delete/sensors/${sensor_id}`)
    } catch (err) {
        console.error("Error Deleting sensor")
    }
}
