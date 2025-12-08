import api from "../utils/api";

export const fetchAllBatches = async () => {
    try{
        const res = await api.get("/pb/get/pb");
        const pb = res.data
        return  pb 
    }catch(err){
        console.err("Error Fetching Plant Batches",err);
        throw err
    }
}



