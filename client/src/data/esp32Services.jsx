
import api from "../utils/api";

export const getESP32Status = async () =>{
    try {
        const res = await api.get("esp32/status");
        return res.data.connected
    } catch (error) {     
        throw error
    }
}

