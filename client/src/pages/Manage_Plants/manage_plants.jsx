// manage_plants.jsx
import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { UserContext } from "../../hooks/userContext";
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { Menu, Plus, LayoutGrid, Search, MapPin, Droplet, X, ArrowUpDown } from "lucide-react";

import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from "../../components/notifModal.jsx";
import { LogoutModal } from "../../components/logoutModal.jsx";
import { DeleteNotifModal } from "../../components/deleteNotifModal.jsx";
import { FloatSuccessMsg, SucessMsgs } from "../../components/sucessMsgs.jsx";
import { FloatErrorMsg } from "../../components/messages.jsx";

import { usePlantData } from "../../hooks/plantContext.jsx";

import { TrayGroupModal } from './modals/trayGroupModal';
import { TrayModal } from "./modals/trayModal";
import { BatchModal } from './modals/batchModal';

import Batches_View from "./batches_view.jsx";
import TrayGroups_View from "./trayGroups_view.jsx";
import RegisterDeviceModal from "./modals/registerDeviceModal.jsx";


export function Manage_Plants() {
  const { user, skippedRegister } = useContext(UserContext);
  const { openDeleteNotifModal, setOpenDeleteNotifModal, selectedNotif, deleteMode, messageContext, setMessageContext } = useContext(MessageContext);
  const {
    trayGroups,
    trays,
    batches,
    plants,
    loadTrayGroups,
    loadTrays,
    loadBatches,
    sensors,
    latestReadings,
  } = usePlantData();
  
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  const [expandedZones, setExpandedZones] = useState({});
  const [activeView, setActiveView] = useState("traygroups");

  const [successMsg, setSuccessMsg] = useState("");
  const [msg, setMsg] = useState("");

  // TrayGroup Modal
  const [isTrayGroupModalOpen, setTrayGroupModalOpen] = useState(false);
  const [tgModalMode, setTgModalMode] = useState("");
  const [selectedTrayGroup, setSelectedTrayGroup] = useState({});

  // Tray Modal
  const [isTrayModalOpen, setTrayModalOpen] = useState(false);
  const [trayModalMode, setTrayModalMode] = useState("");
  const [selectedTray, setSelectedTray] = useState({});

  // Batch Modal
  const [isBatchModalOpen, setBatchModalOpen] = useState(false);
  const [batchModalMode, setBatchModalMode] = useState("");
  const [selectedBatch, setSelectedBatch] = useState({});

  // Filter + Sort state
  const [filters, setFilters] = useState({ search: "", location: "", moisture: "" });
  const [sortBy, setSortBy] = useState("name_asc");

  const clearMsg = useCallback(() => {
    setSuccessMsg("");
    setMsg("");
    setMessageContext("");
  }, [setMessageContext]);

  useEffect(() => {
    if (user?.first_time_login && !skippedRegister) {
      setRegisterModalVisible(true);
    } else {
      setRegisterModalVisible(false);
    }
  }, [user?.first_time_login, skippedRegister]);

  const toggleZone = (zoneId) => {
    setExpandedZones(prev => ({ ...prev, [zoneId]: !prev[zoneId] }));
  };

  const sortedTrayGroups = useMemo(() => {
    if (!Array.isArray(trayGroups)) return [];
    return [...trayGroups].sort((a, b) =>
      String(a.tray_group_name).trim().toLowerCase()
        .localeCompare(String(b.tray_group_name).trim().toLowerCase(), "en")
    );
  }, [trayGroups]);

  // Get live moisture status of a group based on actual sensor readings vs thresholds
  const getGroupMoistureStatus = (group) => {
    const groupTrays = trays.filter(t => t.tray_group_id === group.tray_group_id);
    const readings = groupTrays.flatMap(tray => {
      const traySensors = sensors.filter(
        s => s.tray_id === tray.tray_id && s.sensor_type === "moisture"
      );
      return traySensors
        .map(sensor => latestReadings.find(r => r.sensor_id === sensor.sensor_id)?.value ?? null)
        .filter(v => v !== null);
    });
    if (readings.length === 0) return "no_data";
    const avg = readings.reduce((a, b) => a + b, 0) / readings.length;
    if (avg < group.min_moisture) return "dry";
    if (avg > group.max_moisture) return "wet";
    return "optimal";
  };


  
  // Filter + Sort
  const filteredTrayGroups = sortedTrayGroups
    .filter(group => {
      if (filters.search && !group.tray_group_name.toLowerCase().includes(filters.search.toLowerCase()))
        return false;
      if (filters.location && group.location !== filters.location)
        return false;
      if (filters.moisture && getGroupMoistureStatus(group) !== filters.moisture)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc":   return a.tray_group_name.localeCompare(b.tray_group_name);
        case "name_desc":  return b.tray_group_name.localeCompare(a.tray_group_name);
        case "trays_desc": return trays.filter(t => t.tray_group_id === b.tray_group_id).length
                                - trays.filter(t => t.tray_group_id === a.tray_group_id).length;
        case "trays_asc":  return trays.filter(t => t.tray_group_id === a.tray_group_id).length
                                - trays.filter(t => t.tray_group_id === b.tray_group_id).length;
        default: return 0;
      }
    });

  // TrayGroup Handlers
  const handleAddTrayGroup = () => {
    setSelectedTrayGroup({});
    setTgModalMode("insert");
    setTrayGroupModalOpen(true);
  };
  const handleUpdateTrayGroup = (e, tg) => {
    e.stopPropagation();
    setSelectedTrayGroup({ ...tg });
    setTgModalMode("update");
    setTrayGroupModalOpen(true);
  };
  const handleDeleteTrayGroup = (e, tg) => {
    e.stopPropagation();
    setSelectedTrayGroup({ ...tg });
    setTgModalMode("delete");
    setTrayGroupModalOpen(true);
  };

  // Tray Handlers
  const handleAddTray = (e, tg) => {
    e.stopPropagation();
    setSelectedTrayGroup({ ...tg });
    setSelectedTray({});
    setTrayModalMode("insert");
    setTrayModalOpen(true);
  };
  const handleUpdateTray = (tray) => {
    setSelectedTray({ ...tray });
    setTrayModalMode("update");
    setTrayModalOpen(true);
  };
  const handleDeleteTray = (tray) => {
    setSelectedTray({ ...tray });
    setTrayModalMode("delete");
    setTrayModalOpen(true);
  };

  // Batch Handlers
  const handleAddBatch = (tray) => {
    setSelectedTray({ ...tray });
    setSelectedBatch({});
    setBatchModalMode("insert");
    setBatchModalOpen(true);
  };
  const handleUpdateBatch = (batch) => {
    setSelectedBatch({ ...batch });
    setBatchModalMode("update");
    setBatchModalOpen(true);
  };
  const handleDeleteBatch = (batch) => {
    const hasData = batch.fully_grown_seedlings > 0 || batch.dead_seedlings > 0 || batch.replanted_seedlings > 0;
    if (!hasData) {
      setMsg("Cannot delete this batch. Update the batch data first before deleting.");
      return;
    }
    setSelectedBatch({ ...batch });
    setBatchModalMode("delete");
    setBatchModalOpen(true);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <section className="con_main w-full h-screen bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] flex flex-col md:grid md:grid-cols-[15fr_85fr] md:grid-rows-[auto_1fr] gap-4 overflow-hidden relative">

      {/* MOBILE MENU */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="cursor-pointer menu_button md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} />
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
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

      {/* RIGHT COLUMN */}
      <div className="md:col-start-2 flex flex-col gap-4 overflow-y-auto h-full pb-4">

        {/* HEADER */}
        <Db_Header setNotifOpen={setNotifOpen} />

        {/* MAIN CONTENT */}
        <div className="w-full max-w-full sm:max-w-7xl mx-auto space-y-4 px-4 sm:px-0">

          <SucessMsgs txt={successMsg} clearMsg={clearMsg} />
          <FloatErrorMsg txt={msg} clearMsg={clearMsg} />

          {/* TOP CARD */}
          <div className="conb bg-white rounded-3xl p-4 sm:p-6 shadow-sm w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
                  <LayoutGrid className="w-6 h-6 text-[#7BA591]" />
                  Manage Plants
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Manage your tray groups, trays, and plant batches
                </p>
              </div>

              <div className="flex items-center justify-center flex-row-reverse gap-3 flex-wrap">
                <div className="flex rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setActiveView("traygroups")}
                    className={`cursor-pointer px-4 py-2 text-xs font-semibold transition
                      ${activeView === "traygroups"
                        ? "bg-[#7BA591] text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                    Tray Groups
                  </button>
                  <button
                    onClick={() => setActiveView("batches")}
                    className={`cursor-pointer px-4 py-2 text-xs font-semibold transition
                      ${activeView === "batches"
                        ? "bg-[#25a244] text-white"
                        : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                    Batches
                  </button>
                </div>

                {activeView === "traygroups" && (
                  <button
                    onClick={handleAddTrayGroup}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl 
                    bg-gradient-to-br from-[var(--sancgb)] to-[var(--sancgd)]
                    text-white text-xs font-semibold shadow hover:shadow-lg">
                    <Plus size={14} />
                    Add Tray Group
                  </button>
                )}
              </div>
            </div>

            {/* FILTER BAR */}
            {activeView === "traygroups" && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 flex-wrap">

                {/* Search by name */}
                <div className="relative flex-1 min-w-[160px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search group name..."
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7BA591] bg-gray-50"
                  />
                </div>

                {/* Filter by location */}
                <div className="relative min-w-[140px]">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={filters.location}
                    onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7BA591] bg-gray-50 appearance-none cursor-pointer">
                    <option value="">All Locations</option>
                    {[...new Set(sortedTrayGroups.map(g => g.location).filter(Boolean))].map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>



                {/* Filter by live moisture status */}
                <div className="relative min-w-[170px]">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={filters.moisture}
                    onChange={e => setFilters(f => ({ ...f, moisture: e.target.value }))}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7BA591] bg-gray-50 appearance-none cursor-pointer">
                    <option value="">All Conditions</option>
                    <option value="dry">🔴 Dry — below min</option>
                    <option value="optimal">🟢 Optimal — within range</option>
                    <option value="wet">🟡 Wet — above max</option>
                    <option value="no_data">⚪ No Sensor Data</option>
                  </select>
                </div>


                {/* Sort */}
                <div className="relative min-w-[150px]">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#7BA591] bg-gray-50 appearance-none cursor-pointer">
                    <option value="name_asc">Name A–Z</option>
                    <option value="name_desc">Name Z–A</option>
                    <option value="trays_desc">Most Trays</option>
                    <option value="trays_asc">Fewest Trays</option>
                  </select>
                </div>

                {/* Clear filters — only show when something is active */}
                {(filters.search || filters.location || filters.moisture) && (
                  <button
                    onClick={() => setFilters({ search: "", location: "", moisture: "" })}
                    className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition bg-white">
                    <X size={12} /> Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* TRAY GROUPS VIEW */}
          {activeView === "traygroups" && (
            <TrayGroups_View
              sortedTrayGroups={filteredTrayGroups}
              getGroupMoistureStatus={getGroupMoistureStatus}
              toggleZone={toggleZone}
              expandedZones={expandedZones}
              trays={trays}
              batches={batches}
              handleAddTrayGroup={handleAddTrayGroup}
              handleUpdateTrayGroup={handleUpdateTrayGroup}
              handleDeleteTrayGroup={handleDeleteTrayGroup}
              handleAddTray={handleAddTray}
              handleUpdateTray={handleUpdateTray}
              handleDeleteTray={handleDeleteTray}
              handleAddBatch={handleAddBatch}
              sensors={sensors}
              latestReadings={latestReadings}
            />
          )}

          {activeView === "batches" && (
            <Batches_View
              batchesDataList={batches}
              handleUpdateBatch={handleUpdateBatch}
              handleDeleteBatch={handleDeleteBatch}
            />
          )}

        </div>
      </div>

      {/* MODALS */}
      {openDeleteNotifModal && (
        <DeleteNotifModal
          isOpen={openDeleteNotifModal}
          selectedNotif={selectedNotif}
          deleteMode={deleteMode}
          onClose={() => setOpenDeleteNotifModal(false)}
        />
      )}

      {isNotifOpen && (
        <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
      )}

      {isTrayGroupModalOpen && (
        <TrayGroupModal
          isOpen
          onClose={() => setTrayGroupModalOpen(false)}
          tgModalMode={tgModalMode}
          trayGroupData={trayGroups}
          selectedTrayGroup={selectedTrayGroup}
          setSuccessMsg={setSuccessMsg}
          loadTrayGroups={loadTrayGroups}
          reloadTrayGroups={loadTrayGroups}
          plants={plants}
        />
      )}

      {isTrayModalOpen && (
        <TrayModal
          isOpen
          onClose={() => setTrayModalOpen(false)}
          trayModalMode={trayModalMode}
          selectedTrayGroup={selectedTrayGroup}
          selectedTray={selectedTray}
          setSuccessMsg={setSuccessMsg}
          reloadTray={loadTrays}
        />
      )}

      {isBatchModalOpen && (
        <BatchModal
          isOpen
          onClose={() => setBatchModalOpen(false)}
          batchModalMode={batchModalMode}
          selectedTray={selectedTray}
          selectedBatch={selectedBatch}
          setSuccessMsg={setSuccessMsg}
          reloadBatches={loadBatches}
        />
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
        <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />
      )}
    </section>
  );
}



export default Manage_Plants;