// Dashboard.jsx
import { useState, useContext,useEffect,useCallback} from "react";
import { UserContext } from "../../hooks/userContext";
import { MessageContext } from "../../hooks/messageHooks.jsx";

import { Menu } from "lucide-react";

import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";

import { usePlantData } from "../../hooks/plantContext.jsx";
import Nursery_Dashboard from "./nursery.jsx";
import ManagePlants from "./manage_plants.jsx";
import RegisterDeviceModal from "./modals/registerDeviceModal.jsx";


export function Dashboard() {
  const { user, skippedRegister} = useContext(UserContext);
  const {openDeleteNotifModal,setOpenDeleteNotifModal,selectedNotif,
         deleteMode,
         messageContext,setMessageContext} = useContext(MessageContext);

    
  const [activeTab, setActiveTab] = useState("Overview");
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const { loadTrayGroups } = usePlantData();


  const clearMsg = useCallback(() => {
    setMessageContext("")
    }, []);
    


  useEffect(() => {
    if (user?.first_time_login && !skippedRegister) {
      setRegisterModalVisible(true);
    } else {
      setRegisterModalVisible(false);
    }
  }, [user?.first_time_login, skippedRegister]);

  
  if (!user) return <div>Loading...</div>;


  return (
    <section className="con_main w-full min-h-screen bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] flex flex-col md:grid md:grid-cols-[15fr_85fr] md:grid-rows-[auto_auto_1fr] gap-4 overflow-hidden relative">

      {/* MOBILE MENU */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} />
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}



      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block md:row-span-full`}>
          <Sidebar
            user={user}
            setLogoutOpen={setLogoutOpen}
            setSidebarOpen={setSidebarOpen}
            setRegisterModalVisible={setRegisterModalVisible}
          />
      </aside>


      {/* HEADER */}
      <div className="md:col-start-2">
        <Db_Header setNotifOpen={setNotifOpen} />
      </div>
      

      
        {/* TABS */}
        {user.role === "admin" && (   
        <nav className="dashboard_nav flex gap-2 px-4 md:px-0 md:col-start-2">
            <button
            onClick={() => setActiveTab("Overview")}
            className={`db_nav_button cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2
              text-xs md:text-sm rounded-lg transition
              ${activeTab === "Overview"
                ? "conb active bg-white shadow-md text-[#5A8F73] dark:bg-[var(--metal-dark3)] dark:text-[#00ffe0] dark:shadow-md"
                : "bg-white/50  text-[#5A8F73] hover:bg-white/70 dark:bg-[var(--metal-dark2)] dark:text-[#a0f0d5] dark:hover:bg-[var(--metal-dark1)]"
              }`}>
            Overview
          </button>
          
          <button
            onClick={() => setActiveTab("Manage Plants")}
            className={`db_nav_button cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2
              text-xs md:text-sm rounded-lg transition bg-[var(-)]
              ${activeTab === "Manage Plants"
                ? "conb active bg-white shadow-md text-[#5A8F73] dark:bg-[var(--metal-dark3)] dark:text-white dark:shadow-md"
                : "bg-white/50  text-[#5A8F73] hover:bg-white/70 dark:bg-[var(--metal-dark2)] dark:text-white dark:hover:bg-[var(--metal-dark1)]"
              }`}>
                Manage Plants
          </button>
                 
        </nav>
      )}


      {/* MAIN */}
      <main className="flex-1 md:col-start-2 overflow-y-auto px-4 pb-4">
        {activeTab === "Overview" ? (
          <Nursery_Dashboard />
        ) : (
          <ManagePlants reloadTrayGroups={loadTrayGroups} />
        )}
      </main>

  
      {openDeleteNotifModal && (
        <DeleteNotifModal 
          isOpen={openDeleteNotifModal} 
          selectedNotif={selectedNotif}
          deleteMode={deleteMode} 
          onClose={() => setOpenDeleteNotifModal(false)} 
        />
      )}
    
      {/* MODALS */}
      {isNotifOpen && (
        <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
      )}

      {isRegisterModalVisible && (
        <RegisterDeviceModal
          userData={user}
          onClose={() => setRegisterModalVisible(false)}
        />
       )}

      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}

      {messageContext && (
        <FloatSuccessMsg  txt={messageContext} clearMsg={clearMsg} />
      )}

      
    </section>
  );
}

export default Dashboard;