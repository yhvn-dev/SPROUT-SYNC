import { useState,useEffect } from 'react';
import { Db_Header } from '../../components/db_header';
import { Sidebar } from '../../components/sidebar';

import BedsScreen from './bedsScreen';
import BedModal from './bedsModal';
import SensorModal from "./sensorModal"

import * as bedService from "../../data/bedServices"
import * as sensorService from "../../data/sensorServices"
import { fetchLoggedUser } from '../../data/userService';

import { FloatSuccessMsg } from '../../components/sucessMsgs';

// Main Component
const DeviceManagement = () => {
  const [activeTab, setActiveTab] = useState('beds');

  const [bed,setBedData] = useState([])
  const [openBed,setOpenBed] = useState(false)
  const [bedMode,setBedMode] = useState("")
  const [selectedBed,setSelectedBed] = useState([])
  const [bedCount,setBedCount] = useState(0)
  
  const [openSensor,setOpenSensor] = useState(false)
  const [sensorMode,setSensorMode] = useState("")
  const [selectedSensor,setSelectedSensor] = useState([])
  const [sensorData,setSensorData] = useState([])
  const [sensorCount,setSensorCount] = useState([]);
  
  const [user,setUser] = useState(null);

  const [scsMsg,setScsMsg] = useState("")
  const [errMsg,setErrMsg] = useState("")

  useEffect(() => {
    loadUsers()
    loadBedData();
  }, []);


    const loadUsers = async () =>{
      try {
          const loggedUser = await fetchLoggedUser();
          setUser(loggedUser);
      } catch (err) {
          console.error(err);
      }
    }

    const loadBedData = async () => {
        try {       
          const beds = await bedService.fetchAllBeds();
          const sensors = await sensorService.fetchAllSensors();
          const bedCount = await bedService.fetchBedsCount()
          

          // Calculate sensor count per bed
          const bedsWithSensorCount = beds.map(b => ({
            ...b,
            sensorCount: sensors.filter(s => s.bed_id === b.bed_id).length
          }));

          setBedData(bedsWithSensorCount);
          setSensorData(sensors);       
          setBedCount(bedCount)
          
          // Optional: total sensors
          const totalSensors = sensors.length;
          setSensorCount(totalSensors);
          

        } catch (err) {
          console.error(err);
        }
      }

      const clearMsg = () =>{
        setScsMsg("")
      }
    
  return (
    <section className="grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_88vh] 
    h-[100vh] w-[100%] gap-4 overflow-y-auto relative 
    bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">
        
      <Db_Header  
        input={               
            <>
            <input type="text" placeholder='' className='border-[1px] border-[var(--metal-dark4)] outline-[var(--sage)] rounded-2xl px-4'/>
            <label>Search For Beds</label>
            </>}
        />
  
      <Sidebar />
      
      
      {/* Main Content */}
      <main className="row-start-2  col-start-2 col-span-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 overflow-y-auto">
            
        
        <div className='w-full py-4 row-start-2 row-end-2 col-start-2 col-span-full center '>
            <nav className='center-l px-4  h-full w-1/2 0'>     
                  {/* Navigation Tabs */}
              <button
                onClick={() => setActiveTab('beds')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'beds' 
                    ? 'bg-white text-[#027c68] shadow-md' 
                    : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
                }`}>
                Beds
              </button>
            </nav>

            <div className='center h-full w-1/2 0'>     
                <p className='text-sm text-[var(--acc-darkc)] text-end'>
                    Manage and monitor all connected devices, including beds and sensors, within your automated watering system      
                </p>
            </div>

        </div>
                
          {/* Beds Tab */}
          {activeTab === 'beds' && (
          <BedsScreen  
          setOpenBed={setOpenBed} 
          onBedClose={setOpenBed} 
          setBedMode={setBedMode} 
          setSelectedBed={setSelectedBed} 
          bed={bed}
          bedCount={bedCount}
          setOpenSensor={setOpenSensor}  
          sensorMode={setSensorMode}  
          sensors={sensorData} 
          sensorCount={sensorCount} 
          setSelectedSensor={setSelectedSensor}
          />
          )}
          
          {/* Sensors Tab */}
          {activeTab === 'sensors' && (
            <>
              <SensorsScreen/>
            </>
          )}

      </main>

          

     {openBed && 
     <BedModal 
      isBedOpen={setOpenBed} 
      onBedClose={() => setOpenBed(false)} 
      bedMode={bedMode} 
      selectedBed={selectedBed}
      loadBedData={loadBedData}
      scsMsg={setScsMsg}
      errMsg={setErrMsg}
     />}



    {openSensor  && 
    <SensorModal
      isSensorOpen={setOpenSensor}
      onSensorClose={() => setOpenSensor(false)}
      sensorMode={sensorMode}
      selectedBed={selectedBed}
      selectedSensor={selectedSensor}
      loadBedData={loadBedData}
      scsMsg={setScsMsg}
      
    />}


    {scsMsg && <FloatSuccessMsg txt={scsMsg} clearMsg={clearMsg}/>}
      
    </section>
  );
};

export default DeviceManagement;