import api from "../utils/api";


export const waterAllGroups = async (action) =>{
    try {
        const res = await api.post("esp32/post/waterAllGroups",{action:action});
        console.log("WATER ALL GROUPS",res)
        return res
    } catch (error) {     
        throw error
    }
}

export const waterBokchoyGroup = async (action) =>{
    try {
        const res = await api.post("esp32/post/waterBokchoyGroup",{action:action});
        console.log("WATER ALL BOKCHOY GROUP",res)
        return res
    } catch (error) {     
        throw error
    }
}

export const waterPechayGroup = async (action) =>{
    try {
        const res = await api.post("esp32/post/waterPechayGroup",{action:action});
        console.log("WATER ALL PECHAY GROUP",res)
        return res
    } catch (error) {     
        throw error
    }
}


export const waterMustasaGroup = async (action) =>{
    try {
        const res = await api.post("esp32/post/waterMustasaGroup",{action:action});
        console.log("WATER ALL MUSTASA GROUP",res)
        return res
    } catch (error) {     
        throw error
    }
}