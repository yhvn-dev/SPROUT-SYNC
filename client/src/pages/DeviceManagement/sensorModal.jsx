import { useState,useEffect } from "react";
import { X, Plus, Edit,Delete,Droplet,Activity } from "lucide-react";
import BedSimulation from "./bedSimulation";
import * as sensorServices from "../../data/sensorServices"

function SensorModal({ isSensorOpen,onSensorClose,sensorMode,selectedBed,selectedSensor,loadBedData}) {
  const [formDataSensor,setFormDataSensor] = useState({
                                bed_id:0,
                                sensor_type:"",
                                sensor_name:"",
                                sensor_code:"",
                                unit:""
                                })           
                                                    
    useEffect(() => {
      try {
        const sensor = Array.isArray(selectedSensor)
          ? selectedSensor[0]
          : selectedSensor;       
          

        if (sensorMode === "insert") {
          setFormDataSensor({
            bed_id: selectedBed?.bed_id,
            sensor_type: "",
            sensor_name: "",
            sensor_code: "",
            unit: ""
          });

        } else if (sensorMode === "update") {
          setFormDataSensor({
            bed_id: sensor?.bed_id,
            sensor_type: sensor?.sensor_type || "",
            sensor_name: sensor?.sensor_name || "",
            sensor_code: sensor?.sensor_code || "",
            unit: sensor?.unit || ""
          });

        } else if (sensorMode === "delete") {
          setFormDataSensor({
            bed_id:  sensor?.bed_id,
            sensor_type: sensor?.sensor_type || "",
            sensor_name: sensor?.sensor_name || ""
          });
        }
      } catch (error) {
        console.error("Error Displaying Sensor Data to the Input", error);
      }
  }, [sensorMode, isSensorOpen, selectedBed, selectedSensor]);


  
  const handleChange = (e) =>{
      const {name,value} = e.target;     
      setFormDataSensor(prev =>({
            ...prev,[name]:value
        }))
  }
  
  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
      if(sensorMode === "insert"){
          const data = await sensorServices.insertSensors(formDataSensor)
          console.log("NEW SERNSOR",data)
          loadBedData()
          onSensorClose(true)
          
      }else if(sensorMode === "update"){
       
      }else{
        
      }
    } catch (error) {
        console.error(error,"Error Submitting Sensor Data")
    }
  }



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

              <form onSubmit={handleSubmit}>
                 <p className="text-sm text-[var(--acc-darkc)]"> Are you sure you want to delete {selectedSensor.sensor_code}</p>
                  <button></button>              
              </form>
            ):(
              <form onSubmit={handleSubmit} className="grid grid-cols-2 grid-rows-[2fr_1fr] w-full h-full ">
              
                  {/* Left Column */}
                  <div className="flex flex-1 items-center flex-col justify-evenly gap-4 ">
                    {/* BED ID */}
                    <div className="form_box input_box relative column">
                      <input 
                        type="text" 
                        placeholder='' 
                        name='bed_id'  
                        value={formDataSensor.bed_id}    
                        onChange={handleChange}              
                        className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                      />
                      <label>Bed ID</label> 
                    </div>

                    {/* Sensor Name */}
                    <div className="form_box input_box relative column">
                      <input 
                        type="text" 
                        placeholder='' 
                        name='sensor_name'      
                        value={formDataSensor.sensor_name}     
                        onChange={handleChange}                
                        className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                      />
                      <label>Sensor Name</label> 
                    </div>

                    {/* Unit */}
                    <div className="form_box input_box relative column">
                      <input 
                        type="text" 
                        placeholder='' 
                        name='unit'             
                        value={formDataSensor.unit}         
                        onChange={handleChange}       
                        className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                      />
                      <label>Unit</label> 
                    </div>
                  </div>



                  {/* Right Column */}
                  <div className="flex flex-1 items-center flex-col justify-evenly gap-4">

                    {/* Sensor Type */}
                    <div className="form_box input_box relative column  w-1/2">
                      <select 
                        name='sensor_type'
                        value={formDataSensor.sensor_type}
                        onChange={handleChange}
                        className="px-4 py-2 shadow-lg bg-gray-200 w-full rounded-lg"
                      >
                        <option value="">Sensor Type</option>
                        <option value="ph">ph</option>
                        <option value="moisture">Moisture</option>
                        <option value="humidity">Humidity</option>
                        <option value="temperature">Temperature</option>
                        <option value="ultrasonic">Ultrasonic</option>
                      </select>
                    </div>
                    {/* Sensor Code */}
                    <div className="form_box input_box relative column w-1/2">
                      <input 
                        type="text" 
                        placeholder='' 
                        name='sensor_code'
                        value={formDataSensor.sensor_code}    
                        onChange={handleChange}        
                        className="form-inp email w-full px-4 py-2 border-2 border-[var(--sage-light)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                      />
                      <label>Sensor Code</label> 
                    </div>
                  </div>
              

                {/* Buttons */}
                <div className="col-start-1 col-span-full flex items-start justify-start flex-row-reverse h-[20%] w-full mt-6">
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
                    className=" px-4 py-2.5 mx-2 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] transition-colors font-semibold text-[0.9rem]"
                  >
                    Cancel
                  </button>
                </div>
              </form>


            )}

            
            
                 
        </main>    
    </div>
  );
};


export default SensorModal