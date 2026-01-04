import { useState, useContext, useEffect } from "react";
import { Welcome_box } from "../../components/welcome_box";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { UserContext } from "../../hooks/userContext";
import { usePlantData } from "../../hooks/plantContext";
import { Notif_Modal } from "../../components/notifModal";
import { LogoutModal } from "../../components/logoutModal";
import { Menu } from "lucide-react";

import { Overview } from "./overview";
import { SeedlingStats } from "./seedlingStats";

export default function Analytics() {
  const { user } = useContext(UserContext);
  const {
    batchTotal,
    loadBatchTotal,
    batchHistoryTotal,
    loadBatchTotalHistory,
    growthOvertime,
    loadGrowthOvertime,
    readings,
    loadReadings,
    moistureReadingsLast24h,
    loadMoistureReadingsLast24h,
    averageReadingsBySensor,
    loadAverageReadingsBySensor,
  } = usePlantData();

  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadBatchTotal();
    loadBatchTotalHistory();
    loadGrowthOvertime();
    loadReadings();
    loadMoistureReadingsLast24h();
    loadAverageReadingsBySensor("moisture");
    loadAverageReadingsBySensor("ultra_sonic");
  }, [
    loadBatchTotal,
    loadBatchTotalHistory,
    loadGrowthOvertime,
    loadReadings,
    loadMoistureReadingsLast24h,
    loadAverageReadingsBySensor,
  ]);

  return (
    <section
      className="

      con_main  w-full min-h-[120vh] md:min-h-screen    
      bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]
      grid
      grid-cols-1       
      grid-rows-[auto_1fr_200vh]
      md:grid md:grid-cols-[12fr_30fr_58fr] 
      md:grid-rows-[auto_auto_1fr]
      gap-4
      overflow-hidden
      relative
    ">

 
    {/* MOBILE MENU BUTTON */}
    <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} className="text-[var(--acc-darkb)]" />
    </button>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className="md:static md:block md:row-span-full">
        {/* Mobile Sidebar */}
        <div
          className={`md:hidden fixed inset-y-0 left-0 w-64 z-50 transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            user={user}
            setLogoutOpen={setLogoutOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar user={user} setLogoutOpen={setLogoutOpen} setSidebarOpen={() => {}} />
        </div>
        
      </aside>

      {/* HEADER */}
      <div className="row-start-1 row-end-1 col-start-1 md:col-start-2 md:col-span-full">
        <Db_Header setNotifOpen={setNotifOpen} />
      </div>


      {/* NAVIGATION TABS */}
      <nav className="analytics_nav row-start-2 row-end-2 col-start-1 col-end-3 md:col-start-2 border-b border-gray-200 py-3 flex flex-wrap items-center gap-2 px-4 md:px-0">
          

        <button
          onClick={() => setActiveTab("Overview")}
          className={`
            cursor-pointer px-4 py-1 rounded-lg transition-all
            ${activeTab === "Overview" 
              ? "active bg-white text-[#027c68] shadow-md dark:bg-[var(--metal-dark3)] dark:text-[#00ffe0] dark:shadow-md"
              : " bg-white/50 text-[#5A8F73] hover:bg-white/70 dark:bg-[var(--metal-dark2)] dark:text-[#a0f0d5] dark:hover:bg-[var(--metal-dark1)]"
            }
          `}
        >
          Overview
        </button>




        <button
          onClick={() => setActiveTab("Seedling Stats")}
          className={`cursor-pointer px-4 md:px-6 py-1 md:py-2 text-xs md:text-sm font-medium rounded-lg transition-all ${
            activeTab === "Seedling Stats"
              ? "active bg-white text-[#027c68] shadow-md"
              : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
          }`}
        >
          Seedling Stats
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main className="col-start-1 col-end-3 md:col-span-full md:col-start-2 row-start-3 row-span-full overflow-y-auto px-0  ">
        {activeTab === "Overview" && (
          <Overview
            batchTotal={batchTotal}
            readings={readings}
            moistureReadingsLast24h={moistureReadingsLast24h}
            averageReadingsBySensor={averageReadingsBySensor}
          />
        )}

        {activeTab === "Seedling Stats" && (
          <SeedlingStats
            batchTotal={batchTotal}
            growthOvertime={growthOvertime}
            averageReadingsBySensor={averageReadingsBySensor}
            batchHistoryTotal={batchHistoryTotal}
          />
        )}
      </main>

      {/* MODALS */}
      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}
      {isNotifOpen && (
        <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
      )}
    </section>
  );
}
