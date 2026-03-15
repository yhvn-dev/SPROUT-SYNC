import { useState, useContext, useEffect,useCallback } from "react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { UserContext } from "../../hooks/userContext";
import { usePlantData } from "../../hooks/plantContext";
import { Notif_Modal } from "../../components/notifModal";
import { LogoutModal } from "../../components/logoutModal";
import { Menu, CircleQuestionMark} from "lucide-react";
import { Overview } from "./overview";
import { SeedlingStats } from "./seedlingStats";
import { FloatErrorMsg } from "../../components/messages";
import { FloatSuccessMsg } from "../../components/sucessMsgs";

import InfosModal from "../../components/infosModal";
import AnalyticsModal from "./modal/analyticsModal";
import RegisterDeviceModal from "../Dashboard/modals/registerDeviceModal";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal.jsx";



export default function Analytics() {
  const { user, skippedRegister} = useContext(UserContext);
  const {
    batchTotal,
    loadBatchTotal,
    batchHistoryTotal,
    loadBatchTotalHistory,
    growthOvertime,
    loadGrowthOvertime,
    readings,
    loadReadings,
    averageReadingsBySensor,
    loadAverageReadingsBySensor,
  } = usePlantData();

  const {openDeleteNotifModal,setOpenDeleteNotifModal,selectedNotif,deleteMode,
          messageContext,setMessageContext} = useContext(MessageContext);

  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInfoModalOpen,setInfoModalOpen] = useState(false);
  const [isModalOpen,setModalOpen] = useState(false);
  const [infoModalPurpose,setInfoModalPurpose] = useState("");
  const [deleteModalMode,setDeleteModalMode] = useState("");
  const [errMsg,setErrMsg] = useState("");
  const [scsMsg,setScsMsg] = useState("");
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
    
  const clearMsg = useCallback(() => {
    setErrMsg("");
    setScsMsg("");
    setMessageContext("")
}, []);

  useEffect(() => {
    loadBatchTotal();
    loadBatchTotalHistory();
    loadGrowthOvertime();
    loadReadings();
    loadAverageReadingsBySensor("moisture");
    loadAverageReadingsBySensor("ultra_sonic");
  }, [
    loadBatchTotal,
    loadBatchTotalHistory,
    loadGrowthOvertime,
    loadReadings,
    loadAverageReadingsBySensor,
  ]);

  const handleOpenInfosModalAnalytics = () =>{
      setInfoModalPurpose("analytics")
      setInfoModalOpen(true)
  }

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
      relative">

    {/* MOBILE MENU BUTTON */}
    <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
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
          }`}>
          <Sidebar
              user={user}
              setLogoutOpen={setLogoutOpen}
              setSidebarOpen={setSidebarOpen}
              setRegisterModalVisible={setRegisterModalVisible}
            />
        </div>
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
         <Sidebar
              user={user}
              setLogoutOpen={setLogoutOpen}
              setSidebarOpen={setSidebarOpen}
              setRegisterModalVisible={setRegisterModalVisible}
            />
        </div>
        
      </aside>

      {/* HEADER */}
      <div className="row-start-1 row-end-1 col-start-1 md:col-start-2 md:col-span-full">
        <Db_Header setNotifOpen={setNotifOpen} />
      </div>




      {/* NAVIGATION TABS */}
      <nav className="analytics_nav row-start-2 row-end-2 col-start-1 col-span-full md:col-start-2 py-3 flex items-center justify-between gap-2 px-4 md:px-0">
        {/* LEFT: Tabs */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setActiveTab("Overview")}
            className={`            
                cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2
                text-xs md:text-sm rounded-lg transition
              ${activeTab === "Overview" 
                ? "bg-white text-[#027c68] shadow-md active"
                : "bg-white/50 hover:bg-white text-[#5A8F73] dark:bg-metal-dark5 dark:hover:bg-[var(--metal-dark4)]"
              }
            `}>
            Overview
          </button>

          <button
            onClick={() => setActiveTab("Seedling Stats")}           
            className={`            
                cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2
                text-xs md:text-sm rounded-lg transition
              ${activeTab === "Seedling Stats" 
                ? "bg-white text-[#027c68] shadow-md active"
                : "bg-white/50 hover:bg-white text-[#5A8F73] dark:bg-metal-dark5 dark:hover:bg-[var(--metal-dark4)]"
              }
            `}
            >
            Seedling Stats
          </button>


          
        </div>

        {/* RIGHT: Info Icon */}
        <button onClick={handleOpenInfosModalAnalytics} className="flex items-center mx-4">
          <CircleQuestionMark className="w-4 h-4 cursor-pointer" />
        </button>
      </nav>


      {/* MAIN CONTENT */}
      <main className="col-start-1 col-end-3 md:col-span-full md:col-start-2 row-start-3 row-span-full overflow-y-auto px-0  ">
        {activeTab === "Overview" && (
          <Overview
            setDeleteModalMode={setDeleteModalMode}
            activeTab={activeTab}
            batchTotal={batchTotal}
            readings={readings}
            setModalOpen={setModalOpen}
            averageReadingsBySensor={averageReadingsBySensor}
          />
        )}

        {activeTab === "Seedling Stats" && (
          <SeedlingStats
            activeTab={activeTab}
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

      {isInfoModalOpen &&
        <InfosModal
          isInfosModalOpen={isInfoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          purpose={infoModalPurpose}  
        />
      }

      {isModalOpen && 
        <AnalyticsModal
          setErrMsg={setErrMsg}
          setScsMsg={setScsMsg}
          deleteModalMode={deleteModalMode}
          isModalOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          reloadReadings={loadReadings}
        />          
      }

      {errMsg && (
      <>
        <FloatErrorMsg txt={errMsg} clearMsg={clearMsg}/>
      </> 
      )}


      {scsMsg && (
      <>
        <FloatSuccessMsg txt={scsMsg} clearMsg={clearMsg}/>
      </> 
      )}

  
      {messageContext && (
        <FloatSuccessMsg  txt={messageContext} clearMsg={clearMsg} />
      )}



    {openDeleteNotifModal && (
        <DeleteNotifModal 
          isOpen={openDeleteNotifModal} 
          selectedNotif={selectedNotif}
          deleteMode={deleteMode} 
          onClose={() => setOpenDeleteNotifModal(false)} 
        />
      )}
    
    {isRegisterModalVisible && (
      <RegisterDeviceModal
        userData={user}
        onClose={() => setRegisterModalVisible(false)} // close modal locally
      />
    )}
    
    </section>
    


  );
}
