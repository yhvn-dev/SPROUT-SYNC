import { useState,useContext,useEffect, use } from "react"
import { UserContext } from "../../hooks/userContext"
import { Sidebar } from "../../components/sidebar"
import { Db_Header } from "../../components/db_header"

import * as trayGroupService from "../../data/trayGroupServices"
import * as sensorService from "../../data/sensorServices"
import * as traysService from "../../data/traysServices"
import * as readingsService from "../../data/readingsServices"

import Overview from "./overview.jsx"
import ManagePlants from "./manage_plants.jsx"


function Dashboard() {
  const { user } = useContext(UserContext);
  const [activeTab,setActiveTab] = useState("Overview")
  const [isNotifOpen,setNotifOpen] = useState(false)


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
        <section className="bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]
        grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_30vh_57vh] gap-4 
        h-[100vh] w-[100%] gap-x-4 overflow-y-auto relative">

          <Db_Header
              input={               
                <>
                <input type="text" placeholder='' className='border-[1px] border-[var(--acc-darkc)] rounded-2xl px-4'/>
                <label>Search For Readings</label>
              </>}
              setNotifOpen={setNotifOpen}
              />         
          <Sidebar user={user}/>  

          <div className="center-l col-start-2 col-end-2 row-start-1 row-end-1">
              <button onClick={() => setActiveTab("Overview")} 
                className={`cursor-pointer not-last:${activeTab === "Overview" ? " bg-white text-[#027c68] shadow-md" : "bg-white/50 text-[#5A8F73] hover:bg-white/70'"} 
                text-[#027c68] mr-2 px-6 py-2 text-sm rounded-lg hover:bg-white transition-all duration-200`}>
                  Overview
              </button>   

              <button onClick={() => setActiveTab("Manage Plants")} 
                className={`cursor-pointer ${activeTab === "Manage Plants" ?  " bg-white text-[#027c68] shadow-md" : "bg-white/50 text-[#5A8F73] hover:bg-white/70'"}
                text-[#027c68] ml-2 px-6 py-2 text-sm rounded-lg hover:bg-white  transition-all duration-200` }>
                  Manage Plants
              </button>   
          </div>


          <main className="col-start-2 col-span-full row-start-2 row-end-4 w-full h-full ">
              {activeTab === "Overview" ? <Overview/> : <ManagePlants/>}       
         </main>



          {isNotifOpen && 
          <div className="bg-red-500 w-1/3 right-20 h-1/2 z-50 absolute">
            
          </div>}

      </section>    
    </>
  )
}

export default Dashboard