import {query} from "../config/db.js"


export const countSensorOnBed = async (bed_id) => {
    try {   
        const { rows } = await query("SELECT COUNT(*) from sensors WHERE bed_id = $1",[bed_id])
          return parseInt(rows[0].count);
    } catch (error) {
        console.log(`MODELS: Error Getting Sensors Count On Each Bed ${err}`, )
        throw err
    }
}

export const countSensors = async () => {
    try {   
        const { rows } = await query("SELECT COUNT(*) from sensors")
        return parseInt(rows[0].count);
    } catch (error) {
        console.log(`MODELS: Error Getting Sensors Count ${err}`, )
        throw err
    }
}



export const readSensors = async () =>{
    try{
        const { rows } = await query("SELECT * FROM sensors") 
        console.log("Sensors:",rows)
        return rows
    }catch(err){
        console.log(`MODELS: Error Getting Sensors ${err}`, )
        throw err
    }
}

export const readSensor = async (sensor_id) =>{
    try{
        const { rows } = await query("SELECT * FROM sensors WHERE sensor_id = $1",[sensor_id]) 
        console.log("BEDS:",rows)
        return rows[0]
    }catch(err){
        console.log(`MODELS: Error Getting Sensors ${err}`, )
        throw err
    }
}



export const readSensorByCode = async (sensor_code) => {
    try{
        const {rows} = await query("SELECT * FROM sensors WHERE sensor_code = $1", [sensor_code]); 
        return rows[0]
     }catch(err){
        console.log(`MODELS: Error Getting Sensors by code ${err}`, )
        throw err
    }
}




export const createSensor = async (sensorData) =>{
    try {
        const {bed_id,sensor_type,sensor_name,sensor_code,unit,status} = sensorData

        

        const { rows } = await query(`INSERT INTO sensors 
            (bed_id,sensor_type,sensor_name,sensor_code,unit,status) 
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [bed_id,sensor_type,sensor_name,sensor_code,unit,status]) 
        console.log("NEW Sensors:",rows)   
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating Sensors ${err}`, )
        throw err
    }
}

export const updateSensor = async (sensorData,sensor_id) =>{
    try {
        const {bed_id,sensor_type,sensor_name,sensor_code,unit,status} = sensorData
        const { rows } = await query(`UPDATE sensors SET 
                                    bed_id = $1, 
                                    sensor_type = $2, 
                                    sensor_name = $3, 
                                    sensor_code = $4, 
                                    unit = $5,
                                    status = $6 WHERE sensor_id = $7
                                    RETURNING *`,  
                                    [bed_id,sensor_type,sensor_name,sensor_code,unit,status,sensor_id]) 
        console.log("UPDATED SENSORS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Updating SENSORS ${err}`, )
        throw err
    }
}



export const deleteSensor = async (sensor_id) => {
    try {
        const { rows } = await query(
            "DELETE FROM sensors WHERE sensor_id = $1 RETURNING *",
            [sensor_id]
        );
        console.log("DELETED SENSOR:", rows[0]);
        return rows[0];  
    } catch (err) {
        console.log(`MODELS: Error Deleting SENSOR ${err}`);
        throw err;
    }
};