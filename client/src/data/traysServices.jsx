import api from "../utils/api";

export const fetchAllTrays = async () =>{
    try {
        const trays = await api.get("/trays/get/trays");
        const traysData = trays.data
        return traysData 
    } catch (error) {
        console.error("Error Fetching All Trays")        
        throw error
    }
}
