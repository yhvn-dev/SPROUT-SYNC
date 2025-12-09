import api from "../utils/api";

export const fetchAllTrays = async () =>{
    try {
        const data = await api.get("/trays/get/trays");
        const trays = data.data
        return trays 
    } catch (error) {
        console.error("Error Fetching All Trays")        
        throw error
    }
}



export const insertTray = async (trayData) =>{
    try {
        const data = await api.post("/trays/post/trays",trayData)
        const trays = data.data
        return trays        
    } catch (error) {
        console.error(error)       
    }
}


export const updateTray = async (trayData,trayId) =>{
    console.log("PASSED TRAY DATA:",trayData)
    try {
        const data = await api.put(`/trays/put/trays/${trayId}`,trayData)
        const trays = data.data
        return trays       
    } catch (error) {
        console.error(error)       
    }
}


export const deleteTray = async (trayId) =>{
    try {
        const data = await api.delete(`/trays/delete/trays/${trayId}`)
        const trays  = data.data
        return trays         
    } catch (error) {
        console.error(error)       
    }
}

