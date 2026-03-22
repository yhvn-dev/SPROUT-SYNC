import api from "../utils/api";

export const fetchAllBatches = async () => {
    try{
        const res = await api.get("/pb/get/pb");
        const pb = res.data
        return pb 
    }catch(err){
        console.err("Error Fetching Plant Batches",err);
        throw err
    }
}

export const fetchTotalBatchesData = async () =>{
    try{
        const res = await api.get("/pb/get/pb/total");
        const pb = res.data
        return pb
    }catch(error){
        console.error("Error Fetching Plant Batches",error);
        throw error
    }
}

export const fetchSeedlingsGrowthOvertime = async () =>{
    try {
        const res = await api.get("/pb/get/pb/growthbyweek");
        const pb = res.data.seedlingGrowthData
        return pb
    } catch (error) {
        console.error("Error Fetching Plant Batches",error);
        throw error
    }
}


export const insertBatches = async (batchesData) =>{
    try {
        const data = await api.post("/pb/post/pb",batchesData)
        const pb = data.data
        return pb       
    } catch (error) {
        console.error(error)    
        throw error 
    }
}


export const updateBatches = async (batchData,batch_id) =>{
    try {
        const data = await api.put(`/pb/put/pb/${batch_id}`,batchData)
        const pb = data.data
        return pb      
    } catch (error) {
        console.error(error)    
        throw error
    }
}


export const updateHarvestStatus = async (batch_id,harvest_status) =>{
    try {
        const pb = await api.put(`/pb/put/pb/harvest_status/${batch_id}`,{harvest_status})
        console.log("PLANTBATCHES",pb)
        return pb      
    } catch (error) {
        console.error(error)    
        throw error
    }
}




export const deleteBatches = async (batch_id) =>{
    try {
        const data = await api.delete(`/pb/delete/pb/${batch_id}`)
        const pb = data.data
        return pb         
    } catch (error) {
        console.error(error)       
    }
}




