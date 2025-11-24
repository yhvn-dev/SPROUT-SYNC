import api from "../utils/api";

export const fetchAllBeds = async () => {
    try{
        const res = await api.get("/beds/get/beds");
        return res.data.data
    }catch(err){
        console.err("Error Fetching Beds",err);
        throw err
    }
}


export const fetchBedsCount = async () =>{
    try {
        const beds = await api.get(`beds/get/beds/count`);
        const bedCount = beds.data.data
        return bedCount
    } catch (error) {
        console.error("Error Fetching Beds Count")        
        throw error
    }
}


export const insertBeds = async (data) =>{
    try{
        const res = await api.post("/beds/post/beds",data);
        const beds = res.data.data
        return beds        
    }catch(err){
        throw err
    }
} 

export const updateBeds = async (bedData,bed_id) =>{

    try{
        const res = await api.put(`/beds/put/beds/${bed_id}`,bedData);
        const beds = res.data.data
        return beds        
    }catch(err){
        console.error("Error Updating Users",err)
        throw err
    }
}




export const deleteBed = async (bed_id) => {

    try{
        console.log(bed_id)
        await api.delete(`beds/delete/beds/${bed_id}`)
    } catch (err) {
        console.error("Error Deleting Beds")
    }
};

