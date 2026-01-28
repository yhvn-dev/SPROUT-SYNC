import api from "../utils/api";

export const fetchAllTrays = async () =>{
    try {
        const data = await api.get("/trays/get/trays");
        const trays = data.data
        return trays 
    } catch (error) {     
        throw error
    }
}


export const insertTray = async (trayData) =>{
    try {
        const data = await api.post("/trays/post/trays",trayData)
        const trays = data.data
        return trays        
    } catch (error) {  
        console.log("Error status:", error.response?.status);
        console.log("Error data:", error.response?.data);
        throw error 
    }
}
export const updateTray = async (trayData,trayId) =>{
    try {
        const data = await api.put(`/trays/put/trays/${trayId}`,trayData)
        const trays = data.data
        return trays       
    } catch (error) {
        console.log("Error status:", error.response?.status);
        console.log("Error data:", error.response?.data);
        throw error
    }
}



export const deleteTray = async (trayId) =>{
    try {
        const data = await api.delete(`/trays/delete/trays/${trayId}`)
        const trays  = data.data
        return trays         
    } catch (error) {   
        throw error  
    }
}

