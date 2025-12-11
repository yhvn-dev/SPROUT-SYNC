import api from "../utils/api"

export const fetchAllTrayGroups = async () =>{
    try {
        const data = await api.get("/tg/get/tg")
        const trayGroups = data.data
        return trayGroups        
    } catch (error) {
       throw error     
    }
}


export const insertTrayGroup = async (trayGroupData) =>{
    console.log("PASSED TRAY GROUP DATA:",trayGroupData)
    try {
        const data = await api.post("/tg/post/tg",trayGroupData)
        const trayGroups = data.data
        return trayGroups        
    } catch (error) {
       throw error
    }
}


export const updateTrayGroup = async (trayGroupData,trayId) =>{
    console.log("PASSED TRAY GROUP DATA:",trayGroupData)
    try {
        const data = await api.put(`/tg/put/tg/${trayId}`,trayGroupData)
        const trayGroups = data.data
        return trayGroups        
    } catch (error) {
       throw error
    }
}


export const deleteTrayGroup = async (trayId) =>{
    try {
        const data = await api.delete(`/tg/delete/tg/${trayId}`)
        const trayGroups = data.data
        return trayGroups        
    } catch (error) {
        throw error
    }
}





