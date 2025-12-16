import { useState,useContext, useEffect} from 'react';
import { Sidebar } from '../../components/sidebar';
import { Db_Header } from '../../components/db_header';
import { UserContext } from "../../hooks/userContext";
import { usePlantData } from '../../hooks/plantContext';
import { Notif_Modal } from '../../components/notifModal';


import { Overview } from './overview';
import { SeedlingStats } from './seedlingStats';

/* =======================
   MAIN DASHBOARD
======================= */

export default function Analytics() {
  const { user } = useContext(UserContext);
  const { batchTotal,loadBatchTotal,
          growthOvertime,loadGrowthOvertime,
          readings,loadReadings, 
          moistureReadingsLast24h,loadMoistureReadingsLast24h,        
          averageReadingsBySensor,loadAverageReadingsBySensor,
        } = usePlantData();
          
  const [isNotifOpen,setNotifOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadBatchTotal();
    loadGrowthOvertime();
    loadReadings();
    loadMoistureReadingsLast24h();
    loadAverageReadingsBySensor("moisture");
    loadAverageReadingsBySensor("ultra_sonic");
  }, [loadBatchTotal,loadGrowthOvertime,loadReadings,loadMoistureReadingsLast24h, loadAverageReadingsBySensor]);



  return (
    <section className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">
      
      {/* Main Grid Layout */}
      <div className="h-full grid grid-cols-[12fr_30fr_58fr] gap-4 grid-rows-[auto_auto_1fr] ">
        {/* Sidebar */}
        <Sidebar user={user} />
        <Db_Header setNotifOpen={setNotifOpen}/>
        {/* Navigation Tabs */}
        <nav className="col-start-2  border-b border-gray-200 py-3 flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("Overview")}
            className={`cursor-pointer px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "Overview"
              ? "bg-white text-[#027c68] shadow-md"
              : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
            }`}>
            Overview
          </button>


          <button 
            onClick={() => setActiveTab("Seedling Stats")}
            className={`cursor-pointer px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "Seedling Stats"
                ? "bg-white text-[#027c68] shadow-md"
                : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
            }`}>              
            Seedling Stats
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="col-start-2 col-span-full row-start-3 row-span-full overflow-hidden">
          <div className="h-full">
            
            {activeTab === "Overview" && 
              <Overview
              batchTotal={batchTotal} 
              readings={readings} 
              moistureReadingsLast24h={moistureReadingsLast24h}
              averageReadingsBySensor={averageReadingsBySensor}/>}
              
              {activeTab === "Seedling Stats" &&
              <SeedlingStats 
              batchTotal={batchTotal} 
              growthOvertime={growthOvertime}
              averageReadingsBySensor={averageReadingsBySensor} />}
          </div>
          
        </main>
        
      </div>
      

      <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)}/>

    </section>
  );
}