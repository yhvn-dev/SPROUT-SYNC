import { useState, useContext } from "react";
import { UserContext } from "../../hooks/userContext";

import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from "../../components/notifModal.jsx";

import { usePlantData } from "../../hooks/plantContext.jsx";

import Nursery_Dashboard from "./nursery.jsx"
import ManagePlants from "./manage_plants.jsx";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isNotifOpen, setNotifOpen] = useState(false);

  const { loadTrayGroups, loadTrays, loadBatches, loadReadings } = usePlantData();

  return (
    <>
      <section
        className="bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]
        grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_30vh_57vh] gap-4
        h-[100vh] w-[100%] overflow-y-auto relative">
          
        {/* HEADER */}
        <Db_Header setNotifOpen={setNotifOpen}/>
        <Sidebar user={user} />

        {/* TAB BUTTONS */}
        <div className="center-l col-start-2 row-start-1">
          <button
            onClick={() => setActiveTab("Overview")}
            className={`cursor-pointer mr-2 px-6 py-2 text-sm rounded-lg transition-all
              ${
                activeTab === "Overview"
                  ? "bg-white text-[#027c68] shadow-md"
                  : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
              }`}>
                
            Overview
          </button>

          <button
            onClick={() => setActiveTab("Manage Plants")}
            className={`cursor-pointer ml-2 px-6 py-2 text-sm rounded-lg transition-all
              ${
                activeTab === "Manage Plants"
                  ? "bg-white text-[#027c68] shadow-md"
                  : "bg-white/50 text-[#5A8F73] hover:bg-white/70"
              }`}
          >
            Manage Plants
          </button>
        </div>

  

        {/* MAIN CONTENT */}
        <main className="col-start-2 col-span-full row-start-2 row-end-4 w-full h-full">
          {activeTab === "Overview" ? (
              <Nursery_Dashboard/>
          ) : (
            <ManagePlants reloadTrayGroups={loadTrayGroups} />
          )}
        </main>

        {/* NOTIFICATION MODAL */}
        {isNotifOpen && (
          <Notif_Modal
            isOpen={isNotifOpen}
            onClose={() => setNotifOpen(false)}

          />
        )}
      </section>
    </>
  );
}


export default Dashboard;
