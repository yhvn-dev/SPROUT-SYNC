import { useEffect, useState, useContext } from 'react';
import { Menu, Trash2, Calendar, Sprout, TrendingUp, AlertCircle } from "lucide-react";
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Notif_Modal } from '../../components/notifModal';
import { LogoutModal } from '../../components/logoutModal';
import { UserContext } from '../../hooks/userContext';
import { usePlantData } from '../../hooks/plantContext';

// Mock data - replace with actual API calls
const mockHistoryData = [
  {
    history_id: 1,
    batch_id: 101,
    tray_id: 5,
    plant_name: "Lettuce",
    date_recorded: "2024-12-20",
    total_seedlings: 48,
    dead_seedlings: 2,
    replanted_seedlings: 2,
    fully_grown_seedlings: 0,
    growth_stage: "Seedling",
    expected_harvest_days: 30,
    notes: "Good germination rate",
    created_at: "2024-12-20T08:30:00"
  },
  {
    history_id: 2,
    batch_id: 101,
    tray_id: 5,
    plant_name: "Lettuce",
    date_recorded: "2024-12-22",
    total_seedlings: 48,
    dead_seedlings: 1,
    replanted_seedlings: 1,
    fully_grown_seedlings: 0,
    growth_stage: "Vegetative",
    expected_harvest_days: 28,
    notes: "Healthy growth observed",
    created_at: "2024-12-22T09:15:00"
  },
  {
    history_id: 3,
    batch_id: 102,
    tray_id: 8,
    plant_name: "Tomato",
    date_recorded: "2024-12-18",
    total_seedlings: 36,
    dead_seedlings: 3,
    replanted_seedlings: 3,
    fully_grown_seedlings: 0,
    growth_stage: "Seedling",
    expected_harvest_days: 60,
    notes: "Some pest damage observed",
    created_at: "2024-12-18T10:00:00"
  },
  {
    history_id: 4,
    batch_id: 103,
    tray_id: 12,
    plant_name: "Basil",
    date_recorded: "2024-12-23",
    total_seedlings: 50,
    dead_seedlings: 0,
    replanted_seedlings: 0,
    fully_grown_seedlings: 15,
    growth_stage: "Mature",
    expected_harvest_days: 5,
    notes: "Ready for harvest soon",
    created_at: "2024-12-23T11:20:00"
  },
  {
    history_id: 5,
    batch_id: 104,
    tray_id: 3,
    plant_name: "Spinach",
    date_recorded: "2024-12-21",
    total_seedlings: 40,
    dead_seedlings: 2,
    replanted_seedlings: 2,
    fully_grown_seedlings: 0,
    growth_stage: "Vegetative",
    expected_harvest_days: 25,
    notes: "Strong growth pattern",
    created_at: "2024-12-21T14:30:00"
  },
  {
    history_id: 6,
    batch_id: 105,
    tray_id: 15,
    plant_name: "Cucumber",
    date_recorded: "2024-12-19",
    total_seedlings: 30,
    dead_seedlings: 1,
    replanted_seedlings: 1,
    fully_grown_seedlings: 0,
    growth_stage: "Seedling",
    expected_harvest_days: 45,
    notes: "Standard growth",
    created_at: "2024-12-19T09:00:00"
  },
  {
    history_id: 7,
    batch_id: 106,
    tray_id: 20,
    plant_name: "Bell Pepper",
    date_recorded: "2024-12-24",
    total_seedlings: 25,
    dead_seedlings: 0,
    replanted_seedlings: 0,
    fully_grown_seedlings: 10,
    growth_stage: "Mature",
    expected_harvest_days: 10,
    notes: "Excellent quality",
    created_at: "2024-12-24T08:45:00"
  }
];

// Stats Card Component
const StatsCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 lg:p-6 hover:shadow-lg transition-shadow">
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
  const { user } = useContext(UserContext);
  const [historyData, setHistoryData] = useState(mockHistoryData);
  const [filteredData, setFilteredData] = useState(mockHistoryData);
  const [searchValue, setSearchValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const {batchHistory,loadBatchHistory} = usePlantData()
  const [selectedStage, setSelectedStage] = useState("All");

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
        record.batch_id.toString().includes(searchValue) ||
        record.growth_stage.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (selectedStage !== "All") {
      filtered = filtered.filter(record => record.growth_stage === selectedStage);
    }

    setFilteredData(filtered);
  }, [searchValue, selectedStage, historyData]);

  const handleDelete = (historyId) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setHistoryData(prev => prev.filter(record => record.history_id !== historyId));
    }
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const growthStages = ["All", "Seedling", "Vegetative", "Mature", "Harvest"];

  const getStageColor = (stage) => {
    const colors = {
      'Seedling': '#b0e892',
      'Vegetative': '#7BA591',
      'Mature': '#027c68',
      'Harvest': '#2dc653'
    };
    return colors[stage] || '#5A8F73';
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-[12fr_30fr_58fr] 
    grid-rows-[8vh_10vh_auto] 
    md:grid-rows-[8vh_10vh_82vh] gap-4 h-screen w-full overflow-x-hidden 
    overflow-y-auto md:overflow-hidden 
    relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2.5 rounded-lg shadow-lg">
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

        <main>         

        <nav className='center w-full py-4 '>
          <div className='flex items-center justify-start w-1/2'><p>Batch History</p></div>
          <div className='flex items-center justify-start flex-row-reverse w-1/2'>                     
              <select
                value={selectedStage}
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
          <div className="bg-white rounded-2xl shadow-lg 
                    h-[55vh] md:h-[57vh] 
                    overflow-y-auto">
              
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto overflow-y-auto">
              <table className="w-full f overflow-y-auto">
                <thead className="bg-[#E8F3ED]  overflow-y-auto">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Batch ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Plant Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Dead</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Replanted</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Grown</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Stage</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Harvest Day</th>
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

                      <td className="px-4 py-3 text-sm font-medium text-gray-900">#{record.batch_id}</td>               
                      <td className="px-4 py-3 text-sm font-medium text-[#027c68]">{record.plant_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{new Date(record.date_recorded).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm text-center font-semibold">{record.total_seedlings}</td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {record.dead_seedlings}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {record.replanted_seedlings}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {record.fully_grown_seedlings}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
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
                          onClick={() => handleDelete(record.history_id)}
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
                      className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: getStageColor(record.growth_stage) }}
                    >
                      {record.growth_stage}
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
    </section>
  );
}

export default Batch_History;