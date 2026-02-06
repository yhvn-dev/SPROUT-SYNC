import { useEffect, useState, useContext } from 'react';
import { Menu, Trash2, Calendar, Sprout, TrendingUp, AlertCircle,FileText,CircleQuestionMark  } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from '../../components/notifModal';
import { Batch_History_Modal } from "./modal"
import { LogoutModal } from '../../components/logoutModal';
import { UserContext } from '../../hooks/userContext';
import { usePlantData } from '../../hooks/plantContext';

import InfosModal from '../../components/infosModal';

// Stats Card Component
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
  const { user } = useContext(UserContext);;
  const {batchHistory,loadBatchHistory} = usePlantData()
  const [filteredData, setFilteredData] = useState(batchHistory);
  const [searchValue, setSearchValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [selectedStage,setSelectedStage] = useState("All")
  const [selectedBatch, setSelectedBatch] = useState([]);
  const [isModalOpen,setModalOpen] = useState(false)
  const [isInfoModalOpen,setInfoModalOpen] = useState(false);
  const [infoModalPurpose,setInfoModalPurpose] = useState("");
  

  const token = localStorage.getItem("accessToken");
  
  useEffect(() =>{
    loadBatchHistory()
  },[])

  // Calculate statistics
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

  // Filter data based on search and stage
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
    setSelectedBatch(historyData)
    setModalOpen(true)
    console.log("DELETE")
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const growthStages = ["All", "Seedling", "Vegetative", "Mature", "Harvest"];

  

  const getStageColor = (stage, isDark = false) => {
  const lightColors = {
    'Seedling': '#b0e892',
    'Vegetative': '#7BA591',
    'Mature': '#027c68',
    'Harvest': '#2dc653'
  };

  const darkColors = {
    'Seedling': '#0f4420',
    'Vegetative': '#1a5042',
    'Mature': '#025047',
    'Harvest': '#1a6b38'
  };
  return isDark ? darkColors[stage] || '#5A8F73' : lightColors[stage] || '#5A8F73';
};


  const handleOpenInfosModalBatchHistory = () =>{
      setInfoModalPurpose("batch_history")
      setInfoModalOpen(true)
  }
  



  return (
    <section className="con_main grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr] 
    grid-rows-[8vh_10vh_auto] 
    md:grid-rows-[8vh_10vh_82vh] gap-4 h-screen w-full overflow-x-hidden 
    overflow-y-auto md:overflow-hidden 
    relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      {/* MOBILE MENU BUTTON */}
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
        />
      )}

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block`}>
        <Sidebar user={user} setLogoutOpen={setLogoutOpen} />
      </aside>

      {/* HEADER */}
      <div className='col-start-1 col-span-full md:col-start-2'>
        <Db_Header
          input={
            <div className="form_box center h-full flex-grow-1">
              <input
                className="border-[1px] w-full md:w-1/2 border-[#027c68] rounded-2xl px-4"
                onChange={handleSearchChange}
                type="text"
                value={searchValue}
                placeholder="Search by plant name, batch ID, or stage..."
              />
            </div>
          }
          setNotifOpen={setNotifOpen}
        />
      </div>

      {/* MAIN CONTENT */}
      <main className='w-full h-full col-start-1 md:col-start-2 col-span-full row-start-2 row-span-full rounded-lg  my-4'>
        {/* STATS SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 gag-4">
          <StatsCard
            icon={Calendar}
            title="Total Records"
            value={stats.totalRecords}
            color="#027c68"
          />
          <StatsCard
            icon={TrendingUp}
            title="Fully Grown"
            value={stats.totalFullyGrown}
            subtitle="Ready for harvest"
            color="#2dc653"
          />
          <StatsCard
            icon={AlertCircle}
            title="Dead Seedlings"
            value={stats.totalDeadSeedlings}
            subtitle="Total losses"
            color="hsl(355, 100%, 70%)"
          />
          <StatsCard
            icon={TrendingUp}
            title="Survival Rate"
            value={`${stats.avgSurvivalRate}%`}
            subtitle="Average across batches"
            color="#009983"
          />
        </div> 

        <main className='conb bg-white rounded-tr-2xl rounded-tl-2xl'>         

          <nav className='center w-full py-4 '>
            <div className='flex items-center justify-start w-1/2'>
              <FileText className='ml-4' size={20}/> <p className='text-xl mx-4'>Batch History</p>

                <button className="mx-4">    
                  <CircleQuestionMark onClick={handleOpenInfosModalBatchHistory} 
                  className='mr-4 w-4 h-4 cursor-pointer'/> 
              </button>
            </div>
            <div className='flex items-center justify-start flex-row-reverse w-1/2'>                     
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="mx-4 border border-[#027c68] rounded-lg px-4 py-[1px] focus:outline-none focus:ring-2 focus:ring-[#027c68] bg-white"
                >
                  {growthStages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <label className="text-sm font-medium text-[#027c68] ">Filter by Stage:</label>
            </div>
          </nav>

          {/* TABLE SECTION */}
          <div className="batch_history_table  rounded-2xl shadow-lg 
                    h-[55vh] md:h-[57vh] 
                    overflow-y-auto">
              
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto">
              <table className="w-full f overflow-y-auto">
                <thead className="  overflow-y-auto">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Plant Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Date Planted</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Grown</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Replanted</th>

                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Dead</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Stage</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Harvest Day/s</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((record, index) => (
                    <tr
                      key={record.history_id}
                      className={`hover:bg-[#E8F3ED] transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}>
                      <td className="px-4 py-3 text-sm font-medium text-[#027c68]">{record.plant_name}</td>
                      <td className="date_planted_data px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(record.date_recorded).toLocaleDateString()}</td>
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
                        </span> }                    
                      </td>                                            
                      <td className="px-4 py-3 text-sm">
                        <span
                          className="bh_growth_stage inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: getStageColor(record.growth_stage) }}
                        >
                          {record.growth_stage}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                        {record.expected_harvest_days}
                      </td>
                    
                      <td className="px-4 py-3 text-sm text-center">
                        <button
                          onClick={() => handleDelete(record)}
                          className="inline-flex items-center p-2 hover:bg-red-100 rounded-full transition-colors group"
                          title="Delete record"
                        >
                          <Trash2 size={16} className="text-gray-400 group-hover:text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



            {/* Mobile Table - Simple List */}
            <div className="md:hidden">
              {filteredData.map((record) => (
                <div
                  key={record.history_id}
                  className="border-b border-gray-200 p-4 hover:bg-[#E8F3ED] transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-gray-600">Batch #{record.batch_id}</p>
                      <h3 className="text-base font-bold text-[#027c68]">{record.plant_name}</h3>

                      <p className="text-xs text-gray-500">{new Date(record.date_recorded).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(record.history_id)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>


                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="bh_stage px-2 py-1 
                      rounded-full text-xs font-semibold text-black"
                      style={{ backgroundColor: getStageColor(record.growth_stage) }}
                    >
                    
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
              ))}
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

      {/* NOTIFICATION MODAL */}
      {isNotifOpen && (
        <Notif_Modal
          isOpen={isNotifOpen}
          onClose={() => setNotifOpen(false)}
        />
      )}

      {/* LOGOUT MODAL */}
      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />
      )}

      {isModalOpen && (
        <Batch_History_Modal 
         isModalOpen={isModalOpen}
         selectedBatch={selectedBatch} 
         reloadBatchHistory={loadBatchHistory()}
         onClose={() => setModalOpen(false)}/>
      )}

      {isInfoModalOpen &&
        <InfosModal
          isInfosModalOpen={isInfoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          purpose={infoModalPurpose}  
        />
      }      
      
    </section>
  );
  
}

export default Batch_History;

