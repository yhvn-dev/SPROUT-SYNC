import { useState,useEffect } from "react";
import { X, Plus, Edit,Delete,Droplet,Activity } from "lucide-react";
import * as bedService from "../../data/bedServices"
import BedSimulation from "./bedSimulation";

function SensorModal({ isSensorOpen,onSensorClose,sensorMode,selectedBed,selectedSensor}) {
  const [formDataSensor,setFormDataSensor] = useState({sensor_type:"",
                                          sensor_name:"",
                                          sensor_code:"",
                                          unit:""})
                                      
                                
  if(!isSensorOpen) return null

  return (
    <div className="fixed column inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl ">
         <main className={`rounded-xl overflow-hidden column w-[80%] h-[80%] bg-white` }>

             {/* Header */}
            <header className="flex items-center justify-between p-6 bg-gray-200 rounded-t-xl">
              <p className="text-2xl text-[var(--acc-darkc)]">{sensorMode === "insert" ? "Insert Sensor" : sensorMode === "update" ? "Update Sensor" : "Delete Sensor"}</p>
              <button
                  onClick={onSensorClose}
                  className="shadow-lg bg-white text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                  <X className="w-6 h-6" stroke="var(--acc-darkc)" />
              </button>
            </header>

            {sensorMode === "delete" ? (

              <div>

                 <p className="text-sm text-[var(--acc-darkc)]"> Are you sure you want to delete {selectedSensor.sensor_code}</p>
                  <button></button>
                  
              </div>

            ):(

                <div className="full flex items-center justify-center flex-col">
                  
                
                  <form action="#" className="flex items-center justify-evenly flex-col w-full h-full">

                      <div className="form_box input_box relative column">
                              <input 
                              type="text" 
                              placeholder='' 
                              name='sensor_type'                     
                              className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                            />
                            <label>Sensor Type</label> 
                      </div>

                      <div className="form_box input_box relative column">
                            <input 
                            type="text" 
                            placeholder='' 
                            name='sensor_name'                 
                            className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                          />
                          <label>Sensor Name</label> 
                      </div>
                      
                      <div className="form_box input_box relative">
                          <input 
                          type="text" 
                          placeholder='' 
                          name='sensor_code'
                          className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        />
                        <label>Sensor Code</label> 
                      </div>

                      <div className="form_box input_box relative column">
                          <input 
                          type="text" 
                          placeholder='' 
                          name='unit'                 
                          className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        />
                        <label>Unit</label> 
                      </div>

                      
                  <div className="flex items-start justify-start flex-row-reverse h-[20%] w-full ">

                
                  
                    <button
                      type="submit"         
                      className={` px-4 py-2.5 mx-4
                      ${sensorMode === "insert" ? "bg-gradient-to-r from-[var(--ptl-greenb)] to-[var(--ptl-greenc)]" : 
                      "bg-gradient-to-r from-[var(--white-blple--)] to-[var(--purpluish--)]" }
                      text-white rounded-lg hover:shadow-lg transition-all font-semibold text-[0.9rem]`}
                      >
                      {sensorMode === "insert" ? "Add Sensor" : "Update Sensor"}
                      </button>

                        <button
                        type="button"
                          className=" px-4 py-2.5 mx-2 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] transition-colors font-semibold text-[0.9rem]">
                          Cancel
                      </button>
                    </div>

                  </form>


              </div>

            )}

            
            
                 
        </main>    
    </div>
  );
};


export default SensorModal