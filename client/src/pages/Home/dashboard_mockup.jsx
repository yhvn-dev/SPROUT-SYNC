import { useState } from 'react';
import { Droplet, ChevronDown, ChevronUp, Sprout, Calendar, TrendingUp, LayoutDashboard, Plug, FileText, User, LogOut, Flower2 } from 'lucide-react';

export default function Dashboard_Mockup() {
  const [expandedZones, setExpandedZones] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleZone = (zoneId) => {
    setExpandedZones(prev => ({ ...prev, [zoneId]: !prev[zoneId] }));
  };

  const trayGroups = [
    {
      tray_group_id: 1,
      group_number: '1',
      tray_group_name: 'Bokchoy',
      location: 'Right 3',
      min_moisture: 50,
      max_moisture: 70,
      trays: [
        { tray_id: 1, tray_number: '1', plant: 'Bokchoy', hasSensor: true },
        { tray_id: 2, tray_number: '2', plant: 'Bokchoy', hasSensor: false }
      ]
    },
    {
      tray_group_id: 2,
      group_number: '2',
      tray_group_name: 'Pechay',
      location: 'Right 2',
      min_moisture: 50,
      max_moisture: 70,
      trays: [
        { tray_id: 3, tray_number: '1', plant: 'Lettuce', hasSensor: true }
      ]
    },
      {
      tray_group_id: 3,
      group_number: '2',
      tray_group_name: 'Mustasa',
      location: 'Right 1 ',
      min_moisture: 60,
      max_moisture: 90,
      trays: [
        { tray_id: 3, tray_number: '1', plant: 'Lettuce', hasSensor: true }
      ]
    }
   
  ];

  
  const batches = [
    {
      batch_id: 1,
      plant_name: 'Bokchoy',
      date_planted: new Date(),
      expected_harvest_days: 45,
      total_seedlings: 120,
      alive_seedlings: 90,
      dead_seedlings: 10
    }
  ];





  

  return (
    <section className="flex flex-col md:flex-row items-center justify-center min-h-screen w-[90%]  p-2 md:p-0">

      <div className="browser_window_main_container flex-1 w-full max-w-[1600px] h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">

        {/* ================= APPLE-STYLE TOP BAR ================= */}
        <div className="flex items-center justify-between gap-3 p-3 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          {/* Stoplight buttons */}
          <div className="flex gap-2 ml-2 md:ml-4">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
          </div>

          {/* Fake URL bar */}
          <div className="flex-1 h-6 bg-gray-200/50 backdrop-blur-sm rounded-full flex items-center px-3 text-gray-700 text-sm mx-2 md:mx-4">
             https://sprout-sync-phi.vercel.app/
          </div>

          {/* Right placeholder */}
          <div className="flex gap-3 text-gray-400 mr-2 md:mr-4">
            <span>🔍</span>
            <span>⋮</span>
          </div>
        </div>

        {/* ================= MAIN DASHBOARD ================= */}
        <div className="flex flex-1 overflow-hidden">

          {/* ================= SIDEBAR ================= */}
          <aside className={`mockup_dashboard_sidebar fixed md:relative z-20 inset-y-0 left-0 w-64 bg-white/70 backdrop-blur-xl border-r border-gray-200 p-6 flex flex-col gap-8 transform md:translate-x-0 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
            <div className="flex justify-between items-center md:hidden">
              <h1 className="text-lg font-semibold">🌱 SPROUTSYNC</h1>
              <button onClick={() => setSidebarOpen(false)}>✕</button>
            </div>

            <h1 className="text-lg font-semibold hidden md:block">🌱SPROUTSYNC</h1>

            <nav className="space-y-4">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
              <SidebarItem icon={Sprout} label="Manage Plants"/>
              <SidebarItem icon={User} label="Users" />
              <SidebarItem icon={TrendingUp} label="Analytics" />
              <SidebarItem icon={FileText } label="Batch History" />
              <SidebarItem icon={Plug } label="Control Panel" />
              <SidebarItem icon={Flower2} label="Plants" />
              <SidebarItem icon={LogOut} label="Logout" />
            </nav>
            

          </aside>
      

  

          {/* ================= CONTENT ================= */}
          <main className="flex-1 p-2 md:p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

              {/* ================= ZONES ================= */}
              <section className="lg:col-span-2 space-y-4">
                {trayGroups.map(group => {
                  const isExpanded = expandedZones[group.tray_group_id];
                  return (
                    <div key={group.tray_group_id} className="mockup_traygroup_div overflow-hidden rounded-3xl shadow-sm border border-gray-200">




                      {/* Header */}
                      <div
                        className="mockup_db_pb_header  p-4 md:p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 rounded-3xl"
                        onClick={() => toggleZone(group.tray_group_id)}>
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#34c759] flex items-center justify-center">
                            <Sprout className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-md md:text-lg font-semibold">[{group.group_number}] {group.tray_group_name}</h3>
                            <p className="text-xs md:text-sm text-gray-500">{group.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                          <span className="text-xs md:text-sm text-gray-600">{group.min_moisture}%–{group.max_moisture}%</span>
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </div>
                      </div>



                      {/* Trays */}
                      {isExpanded && (
                        <div className="conb  px-3 md:px-6 pb-4 md:pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          {group.trays.map(tray => (
                            <div key={tray.tray_id} className="mockup_db_tray_div rounded-2xl bg-[#f5f5f7] p-3 md:p-4">
                              <h4 className="font-semibold text-sm md:text-base">Tray {tray.tray_number}</h4>

                              {tray.hasSensor ? (
                                <div className="mockup_db_sensor_div  mt-2 md:mt-3 bg-white rounded-xl p-3 md:p-4 flex items-center gap-2 md:gap-3 shadow-sm">
                                  <Droplet className="text-[#34c759]" />
                                  <div>
                                    <p className="text-xs text-gray-500">Moisture</p>
                                    <p className="text-lg md:text-xl font-bold">65%</p>
                                  </div>
                                  <span className="ml-auto text-[10px] md:text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    Optimal
                                  </span>
                                </div>
                              ) : (
                                <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-500">No sensor attached</p>
                              )}
                            </div>
                          ))}
                        </div>

                        
                      )}
                    </div>
                  );
                })}
              </section>



              {/* ================= BATCHES ================= */}
              <aside className="space-y-4">
                <div className="plant_batch_div  bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Plant Batches</h3>

                  {batches.map(batch => (
                    <div key={batch.batch_id} className="conb rounded-2xl bg-[#f5f5f7] p-3 md:p-4 mb-2">
                      <h4 className="font-semibold text-sm md:text-base">{batch.plant_name}</h4>

                      <div className="text-[10px] md:text-xs text-gray-600 mt-2 space-y-1">
                        <div className="flex items-center gap-1 md:gap-2">
                          <Calendar size={12}/> <p>{batch.date_planted.toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                          <Calendar size={12}/> <p>{batch.expected_harvest_days} days</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1 md:gap-2 mt-2 md:mt-4 text-center text-[10px] md:text-xs">
                        <Stat label="Total" value={batch.total_seedlings} />
                        <Stat label="Alive" value={batch.alive_seedlings} />
                        <Stat label="Dead" value={batch.dead_seedlings} />
                      </div>
                    </div>
                  ))}
                </div>
              </aside>

            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

function SidebarItem({ icon: Icon, label, active }) {
  return (
    <div className={`sidebar_item_div flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer ${active ? 'bg-[var(--sancgb)] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
      <Icon size={18} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
