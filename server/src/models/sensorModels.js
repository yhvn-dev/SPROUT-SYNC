import {query} from "../config/db.js"


export const readBeds = async () =>{
    try{
        const { rows } = await query("SELECT * FROM beds") 
        console.log("BEDS:",rows)
        return rows
    }catch(err){
        console.log(`MODELS: Error Getting beds ${err}`, )
        throw err
    }
}

export const readBed = async (bed_id) =>{
    try{
        const { rows } = await query("SELECT * FROM beds WHERE bed_id = $1",[bed_id]) 
        console.log("BEDS:",rows)
        return rows[0]
    }catch(err){
        console.log(`MODELS: Error Getting beds ${err}`, )
        throw err
    }
}


export const createBed = async (sensorData) =>{
    try {
        const {bed_id,sensor_type,sensor_name,sensor_code,unit,status} = sensorData
        const { rows } = await query(`INSERT INTO beds 
            (bed_number,bed_code,bed_name,location,is_active,hysteresis) 
            VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
            [bed_id,sensor_type,sensor_name,sensor_code,unit,status]) 
        console.log("NEW BEDS:",rows)   
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating beds ${err}`, )
        throw err
    }
}

export const updateBed = async (sensorData,sensor_id) =>{
    try {
        const {bed_number,bed_code,bed_name,location,is_active,hysteresis} = bedData
        const { rows } = await query(`UPDATE beds SET 
                                    bed_number = $1, 
                                    bed_code = $2, 
                                    bed_name = $3, 
                                    location = $4, 
                                    is_active = $5,
                                    hysteresis = $6 WHERE bed_id = $7
                                    RETURNING *`,  
                                    [bed_number,bed_code,bed_name,location,is_active,hysteresis,bed_id]) 
        console.log("UPDATED SENSORS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Updating SENSORS ${err}`, )
        throw err
    }
}


export const deleteBed = async (sensor_id) =>{
    try {
        const { rows } = await query("DELETE FROM sensors WHERE sensor_id = $1",[sensor_id]) 
        console.log("UPDATED SENSORS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating SENSORS ${err}`, )
        throw err
    }
}
