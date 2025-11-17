import { useState,useEffect } from "react";
import { X, Plus, Edit,Delete } from "lucide-react";
import * as bedService from "../../data/bedServices"
import BedSimulation from "./bedSimulation";

function SensorModal({ isSensorOpen,onSensorClose,sensorMode,selectedBed}) {
  const [formData,setFormData] = useState({sensor_type:"",
                                          sensor_name:"",
                                          sensor_code:"",
                                          unit:"",
                                          status:""})
         
  console.log("SELECTED BED",selectedBed)
 
  if(!isSensorOpen) return null

  return (
    <div className="fixed column inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl ">
         <main className={`rounded-xl overflow-hidden column w-[80%] h-[80%] bg-white` }>


             {/* Header */}
            <header className="flex items-center justify-between p-6 bg-gray-200 rounded-t-xl">
              <nav className="flex items-center gap-3">                      
              </nav>
              <button
                  onClick={onSensorClose}
                  className="shadow-lg bg-white text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                  <X className="w-6 h-6" stroke="var(--acc-darkc)" />
              </button>
            </header>

            {/* Bed Form */}
            <BedSimulation/>
                   
        </main>    
    </div>
  );
};


export default SensorModal