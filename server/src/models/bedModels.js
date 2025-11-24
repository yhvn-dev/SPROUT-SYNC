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



export const readBedByCode = async (bed_code) => {
    try{
        const {rows} = await query("SELECT * FROM beds WHERE bed_code = $1", [bed_code]); 
        return rows[0]
     }catch(err){
        console.log(`MODELS: Error Getting beds by code ${err}`, )
        throw err
    }
}


export const countTotalBeds = async() =>{
    try {
        const { rows } = await query("SELECT COUNT(*) FROM beds") 
        console.log("TOTAL BEDS:",rows)
        
         return parseInt(rows[0].count);
    } catch (err) {
        console.log(`MODELS: Error Getting Total Bed Counts ${err}`, )
        throw err
    }
}

export const createBed = async (bedData) =>{
    try {
        const {bed_number,bed_code,bed_name,location,is_watering,min_moisture,max_moisture} = bedData
        const { rows } = await query(`INSERT INTO beds 
            (bed_number,bed_code,bed_name,location,is_watering,min_moisture,max_moisture) 
            VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [bed_number,bed_code,bed_name,location,is_watering,min_moisture,max_moisture]) 
        console.log("NEW BEDS:",rows)   
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating beds ${err}`, )
        throw err
    }
}

export const updateBed = async (bedData,bed_id) =>{
    try {
        
        const {bed_number,bed_code,bed_name,location,is_watering,min_moisture,max_moisture} = bedData
        const { rows } = await query(`UPDATE beds SET 
                                    bed_number = $1, 
                                    bed_code = $2, 
                                    bed_name = $3, 
                                    location = $4, 
                                    is_watering = $5,
                                    min_moisture = $6,
                                    max_moisture = $7
                                    WHERE bed_id = $8
                                    RETURNING *`,  
                                    [bed_number,bed_code,bed_name,location,is_watering,min_moisture,max_moisture,bed_id]) 
        console.log("UPDATED BEDS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Updating beds ${err}`, )
        throw err
    }
}


export const deleteBed = async (bed_id) =>{
    try {
        const { rows } = await query("DELETE FROM beds WHERE bed_id = $1",[bed_id]) 
        console.log("UPDATED BEDS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating beds ${err}`, )
        throw err
    }
}
