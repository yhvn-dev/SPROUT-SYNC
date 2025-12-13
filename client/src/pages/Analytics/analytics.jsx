import { useState,useContext} from 'react';
import { Sidebar } from '../../components/sidebar';
import { Db_Header } from '../../components/db_header';
import { UserContext } from "../../hooks/userContext";
import { Notif_Modal } from '../../components/notifModal';


import { Overview } from './overview';
import { SeedlingStats } from './seedlingStats';

/* =======================
   MAIN DASHBOARD
======================= */

export default function Analytics() {
  const { user } = useContext(UserContext);
  const [isNotifOpen,setNotifOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Main Grid Layout */}
      <div className="h-full grid grid-cols-[12fr_30fr_58fr] gap-4 grid-rows-[auto_auto_1fr] ">

        
        {/* Sidebar */}
        <Sidebar user={user} />
        <Db_Header setNotifOpen={setNotifOpen}/>


        {/* Navigation Tabs */}
        <nav className="col-start-2  border-b border-gray-200 px-6 py-3 flex items-center gap-2">
          <button 
            onClick={() => setActiveTab("Overview")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "Overview"
                ? "bg-teal-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}>
            Overview
          </button>

          <button 
            onClick={() => setActiveTab("Seedling Stats")}
            className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "Seedling Stats"
                ? "bg-teal-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
>
            Seedling Stats
          </button>
        </nav>

        {/* Main Content Area */}
        <main className="col-start-2 col-span-full row-start-3 row-span-full overflow-hidden">
          <div className="h-full ">
            {activeTab === "Overview" && <Overview />}
            {activeTab === "Seedling Stats" && <SeedlingStats />}
          </div>
        </main>

      </div>

      <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)}/>

    </div>
  );
}