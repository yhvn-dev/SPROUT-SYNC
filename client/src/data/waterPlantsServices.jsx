import api from "../utils/api";


export const waterAllGroups = async () =>{
    try {
        const res = await api.post("esp32/post/waterPechayGroup");
        return res
    } catch (error) {     
        throw error
    }
}

export const waterBokchoyGroup = async () =>{
    try {
        const res = await api.post("esp32/post/waterBokchoyGroup");
        return res
    } catch (error) {     
        throw error
    }
}

export const waterPechayGroup = async () =>{
    try {
        const res = await api.post("esp32/post/waterPechayGroup");
        return res
    } catch (error) {     
        throw error
    }
}


export const waterMustasaGroup = async () =>{
    try {
        const res = await api.post("esp32/post/waterMustasaGroup");
        return res
    } catch (error) {     
        throw error
    }
}