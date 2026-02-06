
import api from "../utils/api";


export const getESP32Status = async () =>{
    try {
        const res = await api.get("esp32/status");
        console.log("ESP32 STATUS:",res)
        return res
    } catch (error) {     
        throw error
    }
}