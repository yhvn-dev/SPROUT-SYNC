import { createContext, useState, useEffect } from "react";
import * as esp32Services from "../data/esp32Services";

export const ESP32Context = createContext();

export function ESP32Provider({ children }) {
  const [ESP32Status, setESP32Status] = useState(null);


  
    useEffect(() => {
      getESP32Status(); 
      const interval = setInterval(() => {
        getESP32Status();
      }, 1000); 
      return () => clearInterval(interval);
    }, []);



    async function getESP32Status() {
        try {

            const esp32Status = await esp32Services.getESP32Status()
            console.log("ESP32 STATUS",esp32Status)
            setESP32Status(esp32Status);

        } catch (err) {
        console.error(err);
        }
    }
    
  return (
    <ESP32Context.Provider value={{ESP32Status,setESP32Status}}>
      {children}
    </ESP32Context.Provider>
  );
  
}



