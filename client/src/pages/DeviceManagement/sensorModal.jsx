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
            <header className="flex items-center justify-between p-6 bg-[var(--sage-light)] rounded-t-xl">
            <div className="flex items-center gap-3">            
                <h2 className="text-xl font-semibold text-white">

                </h2>
            </div>

            <button
                onClick={onSensorClose}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                <X className="w-6 h-6" />
            </button>
            </header>
        

            {/* Bed Form */}
            <form  className="grid grid-cols-2 grid-rows-[8fr_2fr] p-6 space-y-4">   

                <div className="flex items-center justify-evenly flex-col full col-start-1 col-end-1 row-start-1 row-end-1 p-4">
    

                    <div className="form_box input-box relative center">                  
                        <input
                        type="text"
                        name="bed_number"
                                            
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0  text-[var(--acc-darkc)]">Bed Number</label>
                    </div>
                        
                  
                    <div className="form_box input-box relative center">                
                        <input
                        type="text"
                        name="bed_code"
                                                   
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0 text-[var(--acc-darkc)]">Bed Code</label>
                    </div>

                    <div className="form_box input-box relative center">                  
                        <input
                        type="text"
                        name="bed_name"   
                                     
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0  text-[var(--acc-darkc)]">Bed Name</label>
                    </div>                        
                </div>

                
                <div className="flex items-center justify-evenly flex-col  full p-4 col-start-2 col-end-2 row-start-1 row-end-1">

                   
                    <div className="form_box input-box relative center">                   
                        <input
                        type="text"
                        name="location" 
                                     
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0 text-[var(--acc-darkc)]">Location</label>
                    </div>
                    
                    
                    <div className="relative center">                      
                        <input
                        type="number"
                        name="hysteresis"  
                                    
                        step="0.1"
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder="Hysteresis"/>                    
                    </div>

                    {/* Status Toggle */}
                    <div className="flex items-center justify-between  p-2 bg-[var(--sage-lighter)] rounded-lg">                            
                        <p>Status</p>
                    </div>
                </div>
      
            </form>
          
                   
        </main>    
    </div>
  );
};


export default SensorModal