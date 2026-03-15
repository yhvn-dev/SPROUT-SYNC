import api from "../utils/api";




export const closeAllGroups = async (action) =>{
    try {
        const res = await api.post("esp32/post/closeAllGroups",{action:action});
        console.log("CLOSE ALL GROUPS",res)
        return res
    } catch (error) {     
        throw error
    }
}

export const closeBokchoyGroup = async (action) =>{
    try {
        const res = await api.post("esp32/post/closeBokchoyGroup",{action:action});
        console.log("CLOSE ALL BOKCHOY GROUP",res)
        return res
    } catch (error) {     
        throw error
    }
}

export const closePechayGroup = async (action) =>{
    try {
        const res = await api.post("esp32/post/closePechayGroup",{action:action});
        console.log("CLOSE ALL PECHAY GROUP",res)
        return res
    } catch (error) {     
        throw error
    }
}


export const closeMustasaGroup = async (action) =>{
    try {
        const res = await api.post("esp32/post/closeMustasaGroup",{action:action});
        console.log("CLOSE ALL MUSTASA GROUP",res)
        return res
    } catch (error) {     
        throw error
    }
}