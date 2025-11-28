

import {query} from "../config/db.js"


export const readSensorReadings = async () =>{
    try{
        const { rows } = await query("SELECT * FROM sensor_readings") 
        console.log("READINGS:",rows)
        return rows
    }catch(err){
        console.log(`MODELS: Error Getting READINGS ${err}`, )
        throw err   
    }
}


export const readSensorReadingsByReadingId = async (reading_id) =>{
    try{
        const { rows } = await query("SELECT * FROM sensor_readings WHERE reading_id = $1",[reading_id]) 
        console.log("READINGS",rows)
        return rows[0]
    }catch(err){
        console.log(`MODELS: Error Getting Readings by ID ${err}`, )
        throw err
    }
}


export const readSensorReadingsBySensorId = async (sensor_id) =>{
    try{
        const { rows } = await query("SELECT * FROM sensor_readings WHERE sensor_id = $1",[sensor_id]) 
        console.log("READINGS",rows)
        return rows[0]
    }catch(err){
        console.log(`MODELS: Error Getting Readings by Sensor ID ${err}`, )
        throw err
    }
}

export const countTotalReadings = async() =>{
    try {
        const { rows } = await query("SELECT COUNT(*) FROM sensor_readings") 
        console.log("TOTAL READINGS:",rows)
        
        return parseInt(rows[0].count);
    } catch (err) {
        console.log(`MODELS: Error Getting Total Readings Counts ${err}`, )
        throw err
    }
}

export const findSensor = async (sensor_id) =>{
    try {

        const { rows } = await query("SELECT * FROM sensors WHERE sensor_id = $1",[sensor_id]) 
        console.log("SENSORS",rows)
        return rows[0]

    } catch (error) {
        console.log(`MODELS: Error Getting Sensors ${err}`, )
        throw err
    }
}

export const createReadings = async (readingsData) =>{
    try {
        const {sensor_id,value} = readingsData
        const { rows } = await query(`INSERT INTO sensor_readings
            (sensor_id,value) 
            VALUES ($1,$2) RETURNING *`,
            [sensor_id,value]) 

            
        console.log("NEW Readings:",rows)   
        return rows[0]
    } catch (err) {
        console.log(`MODELS: Error Creating Readings ${err}`, )
        throw err
    }
}

export const updateReadings = async (readingsData,reading_id) =>{
    
    const {value} = readingsData
    try {
        const { rows } = await query(`UPDATE sensor_readings SET 
                                    value = $1
                                    WHERE reading_id = $2
                                    RETURNING * `, [value,reading_id]) 
        console.log("UPDATED READINGS:",rows)
        return rows[0]
        
    } catch (err) {
         console.log(`MODELS: Error Updating Readings ${err}`, )
        throw err
    }
}


export const deleteReadings= async (reading_id) =>{
    try {
        const { rows } = await query("DELETE FROM sensor_readings WHERE reading_id = $1",[reading_id]) 
        console.log("DELETED READINGS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error DELETING Readings ${err}`, )
        throw err
    }
}
