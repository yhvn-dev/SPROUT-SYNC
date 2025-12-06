import { useState,useContext,useEffect, use } from "react"
import { UserContext } from "../../hooks/userContext"
import { Sidebar } from "../../components/sidebar"
import { Db_Header } from "../../components/db_header"
import { Quick_Stats } from "./quick_stats" 
import Tray_Group from "./tray_group"
import { Droplets,Leaf ,Wind,Sun} from 'lucide-react';
import * as trayGroupService from "../../data/trayGroupServices"
import * as sensorService from "../../data/sensorServices"
import * as traysService from "../../data/traysServices"
import * as readingsService from "../../data/readingsServices"

import "./dashboard.css"
import "./dashboard_responsive.css"
import TrayGroupModal from "./modal"




const GaugeChart = ({ value, max, label, unit, icon: Icon, color }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="8"/>
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-6 h-6 mb-1" style={{ color }} />
          <span className="text-xl font-bold text-[#003333]">{value}</span>
          <span className="text-xs text-[#5A8F73]">{unit}</span>
        </div>
      </div>
      <p className="text-sm text-[#003333] mt-3 font-medium">{label}</p>
    </div>
  );
};


function Dashboard() {
  const { user } = useContext(UserContext);
  const [isModalOpen,setOpenModal] = useState(false)
  const [trayGroups,setTrayGroups] = useState([]);
  const [trays,setTrays] = useState([]);
  const [sensors,setSensors] = useState([]);
  const [readings,setReadings] = useState([])
  const [notif,setNotif] = useState([]);

  useEffect(() =>{
      loadNurseryData()
  },[])

    const loadNurseryData = async () => {
    try {
        const trayGroups = await trayGroupService.fetchAllTrayGroups()  
        const sensors = await sensorService.fetchAllSensors()
        const trays = await traysService.fetchAllTrays()
        const readings = await readingsService.fetchAllReadings()
        console.log("READINGS",readings)
    
        setTrayGroups(trayGroups)
        setSensors(sensors)
        setTrays(trays)
        setReadings(readings)
      } catch (error) {
        console.error(error)
    }
  }

  return (
    <>
        <section className="bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] page dashboard 
        grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_30vh_57vh] gap-4 
        h-[100vh] w-[100%] gap-x-4 overflow-y-auto relative">


          <Db_Header
              input={               
                <>
                <input type="text" placeholder='' className='border-[1px] border-[var(--acc-darkc)] rounded-2xl px-4'/>
                <label>Search For Readings</label>
              </>}/>         
          <Sidebar user={user}/>  

          {/* NUMBER CONTAINER */}
          <Quick_Stats
            data_box={
              <>
              
                {/* Gauges Row */}
                <div className="bg-white w-full rounded-2xl  shadow-lg hover:shadow-xl transition-all">
                    <div className="scale-90 origin-center">
                        <GaugeChart value={48} max={100} label="Moisture" unit="%" icon={Droplets} color="#027c68" />
                    </div>
                </div>
                

                {/* water level */}
                 <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="scale-90 origin-center">
                      <GaugeChart value={6.8} max={14} label="Water Level" unit="" icon={Droplets} color="#8f9bbc" />
                  </div>            
                </div>      
            


            
              </>
            }/>



          <main className='bg-white
          grid h-full col-start-2 col-end-4 row-start-3 row-end-3
          grid-rows-[1fr_9fr] grid-cols-[1fr] rounded-[10px] overflow-y-auto
          overflow-hidden'> 

            <div className='center w-full h-full col-start-1 col-end-4 bg-transparent mb-4 '>
                <ol className="wp_part full flex items-center justify-start">
                    <h1
                    className="flex items-center justify-start text-2xl full  font-bold mb-2 text-[var(--sancga)">
                        <Leaf className="mx-4" />
                        <span >Nursery</span>
                    </h1>
                    <p className="text-sm text-end px-4  ">
                        Real-time soil moisture monitoring.
                    </p>  
                </ol>
            
            </div>
            
            
          {/* content area */}
          <div className="content_box flex flex-col justify-start items-center w-full h-full
            row-start-2 col-span-1 overflow-y-auto shadow-[5px_5px_20px_1px_rgba(53,53,53,0.2)] 
            rounded-[10px]">
            <Tray_Group
            trayGroups={trayGroups} 
            sensors={sensors} 
            trays={trays}
            readings={readings}
            setOpenModal={setOpenModal}/>
          </div>


        </main>

          {isModalOpen && (
              <TrayGroupModal 
                isOpen={isModalOpen} 
                onClose={() => setOpenModal(false)} 
              />
          )}
                
      </section>    
    </>
  )
}

export default Dashboard