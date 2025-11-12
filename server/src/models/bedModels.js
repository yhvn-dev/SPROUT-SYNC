import {query} from "../config/db.js"


export const readBed = async () =>{
    try{
        const { rows } = await query("SELECT * FROM beds RETURNING *") 
        console.log("BEDS:",rows)
        return rows[0]
    }catch(err){
        console.log(`MODELS: Error Getting beds ${err}`, )
        throw err
    }
}

export const createBed = async (bedData) =>{

     const {bed_name,esp_id,is_active,hysteresis} = bedData
    try {
        const { rows } = await query(`INSERT INTO beds 
            (bed_name,esp_id,location,is_active,hysteresis) 
            VALUES (?,?,?,?,?) RETURNING * `,
            [bed_name,esp_id,is_active,hysteresis]) 
        console.log("NEW BEDS:",rows)
        return rows[0]
    } catch (err) {
         console.log(`MODELS: Error Creating beds ${err}`, )
        throw err
    }
}

export const updateBed = async (bedData) =>{

    const {bed_name,esp_id,is_active,hysteresis} = bedData

    try {
        const { rows } = await query(`UPDATE beds SET 
                                    bed_name = $1, 
                                    esp_id = $2,
                                    location = $3, 
                                    is_active = $4,
                                    hysteresis = $5 WHERE bed_id = $6
                                    RETURNING *`,
                                    [bed_name,esp_id,is_active,hysteresis]) 
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
