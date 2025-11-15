import { useState,useEffect } from "react";
import { X, Plus, Edit,Delete } from "lucide-react";
import * as bedService from "../../data/bedServices"

function SensorModal({ isSensorOpen,onSensorClose,sensorMode}) {
  const [formData,setFormData] = useState({sensor_type:"",
                                          sensor_name:"",
                                          sensor_code:"",
                                          unit:"",
                                          status:""})
                                          
  const [tabView,setTabView] = useState("insert")



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

            <div className="w-full">
                <nav className="p-4">
                    <button onClick={() => setTabView("insert")} className={`${ tabView === "insert" ? "bg-white text-[#027c68] shadow-lg" : "bg-white/50 text-[#5A8F73] hover:bg-white/70" } text-sm mx-4 px-4 py-1 rounded-lg `}>Insert</button>
                    <button onClick={() => setTabView("update")} className={`${ tabView === "update" ? "bg-white text-[#027c68] shadow-lg" : "bg-white/50 text-[#5A8F73] hover:bg-white/70" } text-sm mx-4 px-4 py-1 rounded-lg `}>Update</button>
                    <button onClick={() => setTabView("delete")} className={`${ tabView === "delete" ? "bg-white text-[#027c68] shadow-lg" : "bg-white/50 text-[#5A8F73] hover:bg-white/70" } text-sm mx-4 px-4 py-1 rounded-lg  `}>Delete</button>
                </nav>
            </div>
        


      
            {/* Bed Form */}
            <form  className="grid grid-cols-2 grid-rows-[8fr_2fr] p-6 space-y-4">   

                {tabView  === "delete" ? (
                <div className="full flex items-start flex-col justify-center p-8 rounded-xl">
                    <p>Are you sure you want to delete this bed?</p>                   
                </div>   
                ) : (
              
                <div className="full bg-red-400">

                        
                        
                    
                </div>

                )
            
              }
             
            </form>
          
                   
        </main>    
    </div>
  );
};


export default SensorModal