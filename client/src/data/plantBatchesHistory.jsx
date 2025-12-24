
import api from "../utils/api";

export const fetchAllBatchHistory = async () => {
    try{
        const res = await api.get("/pbh/get/pbh");
        const pbh = res.data
        console.log("HISTORY",pbh)
        return pbh
    }catch(error){
        console.error("Error Fetching Plant Batch History",error);
        throw error
    }
}