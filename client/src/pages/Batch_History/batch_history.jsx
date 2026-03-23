import { useEffect, useState, useContext, useCallback } from 'react';
import { Menu, Trash2, Calendar, Sprout, TrendingUp, AlertCircle, FileText, CircleQuestionMark } from "lucide-react";
import { getStageColor, getHarvestStatusColor } from "../../utils/colors";

import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from '../../components/notifModal';
import { Batch_History_Modal } from "./modal";
import { LogoutModal } from '../../components/logoutModal';
import { useUser } from '../../hooks/userContext';
import { usePlantData } from '../../hooks/plantContext';
import InfosModal from '../../components/infosModal';
import RegisterDeviceModal from '../Dashboard/modals/registerDeviceModal';



import { DeleteNotifModal } from '../../components/deleteNotifModal';
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { FloatSuccessMsg } from "../../components/sucessMsgs";


import { useDarkMode } from "../../hooks/useDarkmode.jsx";


const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="conb bg-white rounded-2xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs lg:text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl lg:text-3xl font-bold" style={{ color }}>{value}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-2 lg:p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon size={20} className="lg:w-6 lg:h-6" style={{ color }} />
      </div>
    </div>
  </div>
);

function Batch_History() {
  const { user, skippedRegister } = useUser();
  const { openDeleteNotifModal, setOpenDeleteNotifModal, selectedNotif,
    deleteMode, messageContext, setMessageContext } = useContext(MessageContext);
  const isDark = useDarkMode(); 

  const { batchHistory, loadBatchHistory, loadNotifs } = usePlantData();
  const [filteredData, setFilteredData] = useState(batchHistory);
  const [searchValue, setSearchValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPurpose, setInfoModalPurpose] = useState("");
  const [successMsg, setSuccessMsg] = useState(null);
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);

  const clearMsg = useCallback(() => {
    setSuccessMsg("");
    setMessageContext("");
  }, []);

  useEffect(() => { loadBatchHistory(); }, []);

  useEffect(() => {
    if (user?.first_time_login && !skippedRegister) {
      setRegisterModalVisible(true);
    } else {
      setRegisterModalVisible(false);
    }
  }, [user?.first_time_login, skippedRegister]);

  const stats = {
    totalRecords: batchHistory.length,
    totalBatches: new Set(batchHistory.map(h => h.batch_id)).size,
    totalDeadSeedlings: batchHistory.reduce((sum, h) => sum + h.dead_seedlings, 0),
    totalFullyGrown: batchHistory.reduce((sum, h) => sum + h.fully_grown_seedlings, 0),
    avgSurvivalRate: batchHistory.length > 0
      ? ((batchHistory.reduce((sum, h) => sum + (h.total_seedlings - h.dead_seedlings), 0) /
        batchHistory.reduce((sum, h) => sum + h.total_seedlings, 0)) * 100).toFixed(1)
      : 0
  };

  useEffect(() => {
    let filtered = batchHistory;
    if (searchValue) {
      filtered = filtered.filter(record =>
        record.plant_name.toLowerCase().includes(searchValue.toLowerCase()) ||
        record.growth_stage.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (selectedStage !== "All") {
      filtered = filtered.filter(record => record.growth_stage === selectedStage);
    }
    setFilteredData(filtered);
  }, [searchValue, selectedStage, batchHistory]);

  const handleDelete = (historyData) => {
    setSelectedBatch(historyData);
    setModalOpen(true);
  };

  const growthStages = ["All", "Sprout", "Seedling", "Vegetative", "Budding", "Flowering", "Fruiting", "Ready To Harvest"];

  const handleOpenInfosModalBatchHistory = () => {
    setInfoModalPurpose("batch_history");
    setInfoModalOpen(true);
  };

  return (
    <section className="con_main grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr] 
      grid-rows-[8vh_10vh_auto] md:grid-rows-[8vh_10vh_82vh] gap-4 h-screen w-full 
      overflow-x-hidden overflow-y-auto md:overflow-hidden relative 
      bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      <button
        onClick={() => setSidebarOpen(true)}
        className="menu_button md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} className="text-[#027c68]" />
      </button>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block`}>
        <Sidebar user={user} setLogoutOpen={setLogoutOpen} setSidebarOpen={setSidebarOpen} setRegisterModalVisible={setRegisterModalVisible} />
      </aside>

      <div className='col-start-1 col-span-full md:col-start-2'>
        <Db_Header
          input={
            <div className="form_box center h-full flex-grow-1">
              <input
                className="border-[1px] text-sm p-[2px] w-full md:w-1/2 border-[var(--metal-dark4)] rounded-2xl px-4"
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                value={searchValue}
                placeholder="Search by plant name, batch ID, or stage..."
              />
            </div>
          }
          setNotifOpen={setNotifOpen}
        />
      </div>

      <main className='w-full h-full col-start-1 md:col-start-2 col-span-full row-start-2 row-span-full rounded-lg my-4'>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <StatsCard icon={Calendar} title="Total Records" value={stats.totalRecords} color="#027c68" />
          <StatsCard icon={TrendingUp} title="Fully Grown" value={stats.totalFullyGrown} subtitle="Total Grown" color="#2dc653" />
          <StatsCard icon={AlertCircle} title="Dead Seedlings" value={stats.totalDeadSeedlings} subtitle="Total losses" color="hsl(355, 100%, 70%)" />
          <StatsCard icon={TrendingUp} title="Survival Rate" value={`${stats.avgSurvivalRate}%`} subtitle="Average across batches" color="#009983" />
        </div>

        <main className='conb bg-white rounded-tr-2xl rounded-tl-2xl'>
          <nav className='center w-full py-4'>
            <div className='flex items-center justify-start w-1/2'>
              <FileText className='ml-4' size={20} />
              <p className='text-xl mx-4'>Batch History</p>
              <button className="mx-4">
                <CircleQuestionMark onClick={handleOpenInfosModalBatchHistory} className='mr-4 w-4 h-4 cursor-pointer' />
              </button>
            </div>
            <div className='flex items-center justify-start flex-row-reverse w-1/2'>
              <select
                value={selectedStage}
                onChange={(e) => setSelectedStage(e.target.value)}
                className="...">
                {growthStages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
              <label className="text-sm font-medium text-[#027c68]">Filter by Stage:</label>
            </div>
          </nav>

          <div className="rounded-2xl shadow-lg h-full md:h-[57vh] overflow-y-auto">

            {/* ✅ DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto">
              <table className="w-full overflow-y-auto">
                <thead className="bg-[var(--sancgb)] overflow-y-auto">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Plant Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Date Planted</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Grown</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Replanted</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Dead</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">Harvest Stage</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Harvest Day/s</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>

                <tbody className="batch_history_table divide-y divide-gray-200">
                  {filteredData.map((record, index) => {
     


                   const stageColors   = getStageColor(record.growth_stage, isDark);
                   const harvestColors = getHarvestStatusColor(record.harvest_status, isDark);

                    return (
                      <tr
                        key={record.history_id}
                        className={`pbh_tr hover:bg-[#E8F3ED] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>

                        <td className="px-4 py-3 flex items-center justify-center text-sm font-medium text-[#027c68]">
                          <span>{record.display_id}</span>
                        </td>

                        <td className="date_planted_data px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {new Date(record.date_recorded).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3 text-sm text-center font-semibold">{record.total_seedlings}</td>

                        <td className="px-4 py-3 text-sm text-center">
                          <span className="fully_grown_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {record.fully_grown_seedlings}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-center">
                          <span className="replanted_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {record.replanted_seedlings}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-center">
                          {record.dead_seedlings === null ? "" :
                            <span className="dead_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {record.dead_seedlings}
                            </span>
                          }
                        </td>

                        {/* ✅ GROWTH STAGE - pill/badge style */}
                        <td className="px-4 py-3 text-sm">
                          <span
                            className="bh_growth_stage inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold"
                            style={{
                              backgroundColor: stageColors.bg,
                              color: stageColors.text,
                              border: `1px solid ${stageColors.border}`,
                            }}>
                            {record.growth_stage}
                          </span>
                        </td>

                        {/* ✅ HARVEST STATUS - dot indicator style */}
                        <td className="px-4 py-3 text-sm">
                          <span
                            className="bh_harvest_status inline-flex items-center gap-1.5 text-xs font-semibold"
                            style={{ color: harvestColors.text }}>
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: harvestColors.dot }}
                            />
                            {record.harvest_status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                          {record.expected_harvest_days}
                        </td>

                        <td className="px-4 py-3 text-sm text-center">
                          <button
                            onClick={() => handleDelete(record)}
                            className="cursor-pointer inline-flex items-center p-2 hover:bg-red-100 rounded-full transition-colors group"
                            title="Delete record">
                            <Trash2 size={16} className="text-gray-400 group-hover:text-red-600" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ✅ MOBILE LIST */}
            <div className="h-full md:hidden">
              {filteredData.map((record) => {
               
              const stageColors   = getStageColor(record.growth_stage, isDark);
              const harvestColors = getHarvestStatusColor(record.harvest_status, isDark);





                return (
                  <div
                    key={record.history_id}
                    className="batch_history_table_mobile_box h-full border-b border-gray-200 p-4 hover:bg-[#E8F3ED] transition-colors">

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-[#027c68]">
                          <span>{record.display_id}</span>
                        </h3>
                        <p className="text-xs text-gray-500">{new Date(record.date_recorded).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleDelete(record)} className="p-2 hover:bg-red-100 rounded-full transition-colors">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>

                    <div className="flex items-center justify-start w-auto gap-2 mb-2">

                      {/* ✅ GROWTH STAGE - pill/badge */}
                      <span
                        className="bh_stage px-2 py-0.5 rounded-md text-xs font-semibold"
                        style={{
                          backgroundColor: stageColors.bg,
                          color: stageColors.text,
                          border: `1px solid ${stageColors.border}`,
                        }}>
                        {record.growth_stage}
                      </span>

                      {/* ✅ HARVEST STATUS - dot indicator */}
                      <span
                        className="bh_harvest inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: harvestColors.text }}>
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: harvestColors.dot }}
                        />
                        {record.harvest_status}
                      </span>

                      <span className="text-xs text-gray-600">{record.expected_harvest_days} days to harvest</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div>
                        <p className="text-gray-600">Total</p>
                        <p className="font-bold">{record.total_seedlings}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Dead</p>
                        <p className="font-bold text-red-600">{record.dead_seedlings}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Replanted</p>
                        <p className="font-bold text-blue-600">{record.replanted_seedlings}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Grown</p>
                        <p className="font-bold text-green-600">{record.fully_grown_seedlings}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Sprout size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No records found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </main>

      {isNotifOpen && <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />}
      {logoutOpen && <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />}
      {isModalOpen && (
        <Batch_History_Modal
          isModalOpen={isModalOpen}
          selectedBatch={selectedBatch}
          reloadBatchHistory={loadBatchHistory}
          onClose={() => setModalOpen(false)}
          setSuccessMsg={setSuccessMsg}
        />
      )}
      {isInfoModalOpen && (
        <InfosModal isInfosModalOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} purpose={infoModalPurpose} />
      )}
      {isRegisterModalVisible && (
        <RegisterDeviceModal userData={user} onClose={() => setRegisterModalVisible(false)} />
      )}
      {successMsg && <FloatSuccessMsg txt={successMsg} clearMsg={clearMsg} />}
      {openDeleteNotifModal && (
        <DeleteNotifModal
          isOpen={openDeleteNotifModal}
          selectedNotif={selectedNotif}
          deleteMode={deleteMode}
          onClose={() => setOpenDeleteNotifModal(false)}
          loadNotifs={loadNotifs}
        />
      )}
      {messageContext && <FloatSuccessMsg txt={messageContext} clearMsg={clearMsg} />}
    </section>
  );
}

export default Batch_History;