"use client";
import { useEffect, useState, useMemo, useContext,useCallback} from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { usePlantData } from "../../hooks/plantContext.jsx";
import { UserContext } from "../../hooks/userContext.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { CircleQuestionMark } from "lucide-react";
import { Notif_Modal } from "../../components/notifModal.jsx"
import { FloatSuccessMsg } from "../../components/sucessMsgs.jsx";
import { DeleteNotifModal } from '../../components/deleteNotifModal';
import { MessageContext } from "../../hooks/messageHooks.jsx";

import RegisterDeviceModal from "../Dashboard/modals/registerDeviceModal";
import InfosModal from "../../components/infosModal.jsx";
import { PlantModal } from "./modals/plantModal.jsx";
import { PlantGroupsModal } from "./modals/plantGroupsModal.jsx";

import {PlantGroups} from "./plant_groups.jsx"
import {Plant_Inventory} from "./plant_inventory.jsx"


/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function Plants() {
  const { user } = useContext(UserContext);
  const {plants,loadPlantGroups, loadPlants } = usePlantData();
  const {openDeleteNotifModal,setOpenDeleteNotifModal,selectedNotif,
        deleteMode,setMessageContext} = useContext(MessageContext);

  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPurpose, setInfoModalPurpose] = useState("");
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [activeTab,setActiveTab] = useState("plant_inventory");
  const [plantModal, setPlantModal] = useState({
    isOpen: false,
    mode: "insert",
    plant: null,
  });
  
  
  const [plantGroupModal, setPlantGroupModal] = useState({
    isOpen: false,
    mode: "insert",
    plantGroup:null,
    plant: null,
  });
  
  
  const clearMsg = useCallback(() => {
      setMessageContext("")
      },
  []);
    
  useEffect(() => {
    loadPlantGroups();
  }, [loadPlantGroups, loadPlants]);

  
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 3000);
    return () => clearTimeout(t);
  }, [successMsg]);

  
   const handleOpenInfosPlants = () => {
    setInfoModalPurpose("plants");
    setInfoModalOpen(true);
  };

  return (
    <section className="con_main grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr]
      grid-rows-[8vh_auto_auto]
      md:grid-rows-[8vh_auto_82vh] gap-4 h-screen w-full overflow-x-hidden
      overflow-y-auto md:overflow-hidden
      relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} className="text-[#027c68]" />
      </button>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />)}

      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"
        } md:static md:block`}>
        <Sidebar
          user={user}
          setLogoutOpen={setLogoutOpen}
          setSidebarOpen={setSidebarOpen}
          setRegisterModalVisible={setRegisterModalVisible}
        />
      </aside>

      {/* HEADER */}
      <div className="col-start-1 col-span-full md:col-start-2">
        <Db_Header notifOpen={notifOpen} setNotifOpen={setNotifOpen} />
      </div>


      <nav className="plants_nav flex my-4 gap-2 px-4 md:px-0 md:col-start-2">
         <button
          onClick={() => setActiveTab("plant_inventory")}
          className={`db_nav_button cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2
            text-xs md:text-sm rounded-lg transition
            ${activeTab === "plant_inventory"
              ? "bg-white text-[#027c68] shadow-md active"
              : "bg-white/50 hover:bg-white text-[#5A8F73] dark:bg-metal-dark5 dark:hover:bg-[var(--metal-dark4)]"
            }`}>
          Inventory
        </button>
        
        <button
          onClick={() => setActiveTab("categories")}
          className={`db_nav_button cursor-pointer flex-1 md:flex-none px-4 md:px-6 py-2
            text-xs md:text-sm rounded-lg transition bg-[var(-)]
            ${activeTab === "categories"
              ? "bg-white text-[#027c68] shadow-md active"
              : "bg-white/50 hover:bg-white text-[#5A8F73] dark:hover:bg-[var(--metal-dark4)]"
            }`}>
             Categories
        </button>            
      </nav>



      <main className="col-start-1 md:col-start-2 row-start-3 col-span-full">
        {activeTab === "plant_inventory" ? (
          <Plant_Inventory setPlantModal={setPlantModal}/>
        ) : (
          <PlantGroups 
            setPlantGroupModal={setPlantGroupModal} 
            setInfoModalOpen={setInfoModalOpen} 
            setInfoModalPurpose={setInfoModalPurpose}
          />
        )}    
      </main>
      

      
    {/* MODALS */}
    {logoutOpen && (
      <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
    )}

    {isRegisterModalVisible && (
      <RegisterDeviceModal
        userData={user}
        onClose={() => setRegisterModalVisible(false)}
      />
    )}

      <PlantModal
      isOpen={plantModal.isOpen}
      onClose={() => {
        setPlantModal(prev => ({ ...prev, isOpen: false }));
        setTimeout(() => {
          setPlantModal({ isOpen: false, mode: "insert", plant: null });
        }, 300); 
      }}
      plantModalMode={plantModal.mode}
      selectedPlant={plantModal.plant}
      setSuccessMsg={setSuccessMsg}
      reloadPlants={loadPlants}/>


    <PlantGroupsModal
      isOpen={plantGroupModal.isOpen}
      onClose={() => {
        setPlantGroupModal(prev => ({ ...prev, isOpen: false }));
        setTimeout(() => {
          setPlantGroupModal({ isOpen: false, mode: "insert", plantGroup:null,plant: null });
        }, 300);}}
      plantModalMode={plantGroupModal.mode}
      selectedPlant={plantGroupModal.plant}
      selectedPlantGroup={plantGroupModal.plantGroup}
      setSuccessMsg={setSuccessMsg}
      reloadPlants={loadPlants}
      plants={plants}
    />


    {openDeleteNotifModal && (
      <DeleteNotifModal 
        isOpen={openDeleteNotifModal} 
        selectedNotif={selectedNotif}
        deleteMode={deleteMode} 
        onClose={() => setOpenDeleteNotifModal(false)} 
      />
    )}

    {isInfoModalOpen && (
      <InfosModal
        isInfosModalOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        purpose={infoModalPurpose}
      />
    )}

    {notifOpen && (
      <Notif_Modal
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    )}
    
    {successMsg && (
      <FloatSuccessMsg  txt={successMsg} clearMsg={clearMsg} />
    )}



    </section>
  );



  
}