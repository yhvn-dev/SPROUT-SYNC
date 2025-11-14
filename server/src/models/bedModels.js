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


export const createBed = async (bedData) =>{

     const {bed_name,location,is_active,hysteresis} = bedData
    try {
        const { rows } = await query(`INSERT INTO beds 
            (bed_name,location,is_active,hysteresis) 
            VALUES ($1,$2,$3,$4) RETURNING *`,
            [bed_name,location,is_active,hysteresis]) 
        console.log("NEW BEDS:",rows)
        
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating beds ${err}`, )
        throw err
    }
}

export const updateBed = async (bedData) =>{

    const {bed_name,location,is_active,hysteresis} = bedData

    try {
        const { rows } = await query(`UPDATE beds SET 
                                    bed_name = $1, 
                                    location = $2, 
                                    is_active = $3,
                                    hysteresis = $4 WHERE bed_id = $5
                                    RETURNING *`,
                                    [bed_name,location,is_active,hysteresis]) 
        console.log("UPDATED BEDS:",rows)

        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating beds ${err}`, )
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
