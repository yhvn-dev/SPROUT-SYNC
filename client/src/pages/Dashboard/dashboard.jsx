// Dashboard.jsx
import { useState, useContext } from "react";
import { UserContext } from "../../hooks/userContext";
import { Menu } from "lucide-react";

import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { usePlantData } from "../../hooks/plantContext.jsx";

import Nursery_Dashboard from "./nursery.jsx";
import ManagePlants from "./manage_plants.jsx";

export function Dashboard() {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loadTrayGroups } = usePlantData();

  return (
    <section
      className="con_main 
        w-full min-h-screen bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] flex flex-col
        md:grid md:grid-cols-[15fr_85fr]
        md:grid-rows-[auto_auto_1fr]
        gap-4
        overflow-hidden
        relative">
        
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
      <aside
        className={`
          ${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"}
          md:static md:block
          md:row-span-full
        `}
      >
        <Sidebar
          user={user}
          setLogoutOpen={setLogoutOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* HEADER */}
      <div className="md:col-start-2">
        <Db_Header setNotifOpen={setNotifOpen} />
      </div>

      {/* TABS */}
      <nav className="nursery_nav flex flex-wrap gap-2 px-4 md:px-0 md:col-start-2">
        <button
          onClick={() => setActiveTab("Overview")}
          className={`cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2 text-xs md:text-sm rounded-lg
            ${
              activeTab === "Overview"
                ? "bg-white text-[#027c68] shadow-md"
                : "bg-white/50 text-[#5A8F73]"
            }`}>
          Overview
        </button>

        
        <button
          onClick={() => setActiveTab("Manage Plants")}
          className={`nursery_nav cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2 text-xs md:text-sm rounded-lg
            ${
              activeTab === "Manage Plants"
                ? "bg-white text-[#027c68] shadow-md"
                : "bg-white/50 text-[#5A8F73]"
            }`}>

          Manage Plants
        </button>
      </nav>

      {/* MAIN CONTENT */}
      <main
        className="
          flex-1 w-full
          px-4 pb-4
          md:px-0 md:pb-0
          md:col-start-2
          overflow-y-auto
        "
      >
        {activeTab === "Overview" ? (
          <Nursery_Dashboard />
        ) : (
          <ManagePlants reloadTrayGroups={loadTrayGroups} />
        )}
      </main>

      {/* MODALS */}
      {isNotifOpen && (
        <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
      )}

      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}
    </section>
  );
}

export default Dashboard;
