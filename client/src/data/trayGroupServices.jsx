import api from "../utils/api"

export const fetchAllTrayGroups = async () =>{
    try {
        const data = await api.get("/tg/get/tg")
        const trayGroups = data.data
        return trayGroups        
    } catch (error) {
        console.error(error)       
    }
}

