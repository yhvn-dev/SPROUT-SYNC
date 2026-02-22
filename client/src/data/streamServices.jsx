import api from "../utils/api";


export const startStream = async () =>{
    try {
        const res = await api.get("stream/start-stream");
        console.log("START STREAM",res)
        return res
    } catch (error) {     
        throw error
    }
}

export const stopStream = async () =>{
    try {
        const res = await api.get("stream/stop-stream");
        console.log("STOP STREAM",res)
        return res
    } catch (error) {     
        throw error
    }
}

export const getStreamsStatus = async () =>{
    try {
        const res = await api.get("stream/status");
        console.log("STREAM STATUS",res)
        return res
    } catch (error) {     
        throw error
    }
}

