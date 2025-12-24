
import api from "../utils/api";

export const fetchAllBatchHistory = async () => {
    try{
        const res = await api.get("/pbh/get/pbh");
        const pbh = res.data
        return pbh
    }catch(error){
        console.error("Error Fetching Plant Batch History",error);
        throw error
    }
}



export const deleteBatchHistory = async (batch_id) =>{
    try {
        const data = await api.delete(`/pbh/delete/pbh/${batch_id}`)
        const pb = data.data
        return pb         
    } catch (error) {
        console.error(error)       
    }
}



