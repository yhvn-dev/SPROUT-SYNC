import  { useState,useContext } from 'react';
import { Menu } from "lucide-react"
import { UserContext } from '../../hooks/userContext';
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Droplets, Wifi, WifiOff, Power, Activity, AlertCircle, CheckCircle, Camera, Maximize2, RotateCw, Sprout, Gauge
} from 'lucide-react';
import * as waterPlantService from "../../data/waterPlantsServices"


function Control_panel() {
  const { user } = useContext(UserContext);
  const [esp32Connected, setEsp32Connected] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [cameraView, setCameraView] = useState('grid'); // 'grid' or 'fullscreen'
  const [cameraStatus, setCameraStatus] = useState('streaming');
  const [pumpStates, setPumpStates] = useState({
    all: false,
    bokchoy: false,
    pechay: false,
    mustasa: false
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

    // Mock moisture data
    const moistureData = {
        bokchoy: [
        { id: 1, name: 'Bokchoy Group A', moisture: 68, status: 'healthy' },
        { id: 2, name: 'Bokchoy Group B', moisture: 72, status: 'healthy' },
        { id: 3, name: 'Bokchoy Group C', moisture: 45, status: 'low' }
        ],
        pechay: [
        { id: 4, name: 'Pechay Group A', moisture: 75, status: 'healthy' },
        { id: 5, name: 'Pechay Group B', moisture: 58, status: 'moderate' }
        ],
        mustasa: [
        { id: 6, name: 'Mustasa Group A', moisture: 81, status: 'healthy' },
        { id: 7, name: 'Mustasa Group B', moisture: 38, status: 'low' }
        ]
    };

  const handlePumpToggle = (pumpType) => {
    setPumpStates(prev => ({
      ...prev,
      [pumpType]: !prev[pumpType]
    }));
  };

  const handleWaterAllGroups = async (e) =>{
         e.preventDefault()
    try {    
        await waterPlantService.waterAllGroups()
    } catch (error) {
        console.error(error)
    }
  }

    const handleWaterBokchoylGroups = async (e) =>{
         e.preventDefault()
    try {    
        await waterPlantService.waterBokchoyGroup()
    } catch (error) {
        console.error(error)
    }
  }

    const handleWaterPechayGroup = async (e) =>{
         e.preventDefault()
        try {    
            await waterPlantService.waterPechayGroup()
        } catch (error) {
            console.error(error)
        }
   }

    const handleWaterMustasaGroup = async (e) =>{
         e.preventDefault()
    try {    
        await waterPlantService.waterMustasaGroup()
    } catch (error) {
        console.error(error)
    }
  }
  


  const getMoistureColor = (moisture) => {
    if (moisture >= 65) return 'bg-green-500';
    if (moisture >= 45) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMoistureStatus = (status) => {
    switch(status) {
      case 'healthy': 
        return { colorClass: 'text-green-600 bg-green-50', text: 'Optimal' };
      case 'moderate': 
        return { colorClass: 'text-yellow-600 bg-yellow-50', text: 'Moderate' };
      case 'low': 
        return { colorClass: 'text-red-600 bg-red-50', text: 'Low' };
      default: 
        return { colorClass: 'text-gray-600 bg-gray-50', text: 'Unknown' };
    }
  };


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
      
  return (
   <section className="
        h-screen
        grid
        gap-4
        grid-cols-[auto_1fr]
        grid-rows-[auto_1fr]
        bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]
        font-sans
        overflow-hidden
        ">

      {/* Sidebar - Column 1, spans both rows (starts at row 1) */}
      <aside className={`col-start-1 col-end-1 row-start-1 row-span-full -50`}>
        <Sidebar
            user={user}
            setLogoutOpen={setLogoutOpen}
            setSidebarOpen={setSidebarOpen}
        />     
      </aside>

      {/* Header - Column 2, Row 1 */}
      <header className="col-start-2 row-start-1">
        <Db_Header/>    
      </header>
   
   
      {/* Main Content - Column 2, Row 2 */}
      <main className="col-start-2 row-start-2 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Header with ESP32 Status */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark-blue)] mb-1">
                Irrigation Control Panel
              </h1>
              <p className="text-base text-[var(--gray_1--)]">
                Monitor and control your hydroponic system
              </p>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-4 px-6 rounded-2xl shadow-md border border-gray-50 relative">
              {esp32Connected ? (
                <>
                  <Wifi size={24} className="text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark-blue)] m-0">
                      ESP32 Connected
                    </p>
                    <p className="text-xs text-[var(--gray_1--)] m-0 mt-1">
                      Last updated: Just now
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_currentColor]" />
                </>
              ) : (
                <>
                  <WifiOff size={24} className="text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark-blue)] m-0">
                      ESP32 Disconnected
                    </p>
                    <p className="text-xs text-[var(--gray_1--)] m-0 mt-1">
                      Trying to reconnect...
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_currentColor]" />
                </>
              )}
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto">
            
            {/* Pump Controls - Large Card */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl col-span-1 lg:col-span-2 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Droplets size={24} className="text-[var(--ptl-greend)]" />
                  <h2 className="text-2xl font-bold text-[var(--color-dark-blue)] m-0">
                    Pump Controls
                  </h2>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* All Pumps */}
                <button
                  className={`flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:col-span-2 ${
                    pumpStates.all
                      ? 'bg-gradient-to-br from-[var(--ptl-greend)] to-[var(--ptl-greene)]'
                      : 'bg-[var(--pal2-whitea)]'
                  }`}
                  onClick={() => handlePumpToggle('all')}
                >
                  <Power size={28} className={pumpStates.all ? 'text-white' : 'text-[var(--ptl-greend)]'} />
                  <span className={`text-lg font-semibold mt-2 ${pumpStates.all ? 'text-white' : 'text-[var(--color-dark-blue)]'}`}>
                    All Pumps
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${pumpStates.all ? 'text-white' : 'text-[var(--gray_1--)]'}`}>
                    {pumpStates.all ? 'Running' : 'Stopped'}
                  </span>
                </button>

                {/* Bokchoy Group */}
                <button
                  className={`flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
                    pumpStates.bokchoy
                      ? 'bg-gradient-to-br from-[var(--sancgd)] to-[var(--sancgb)]'
                      : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => handlePumpToggle('bokchoy')}
                >
                  <Sprout size={24} className={pumpStates.bokchoy ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${pumpStates.bokchoy ? 'text-white' : 'text-[var(--color-dark-blue)]'}`}>
                    Bokchoy
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${pumpStates.bokchoy ? 'text-white' : 'text-[var(--gray_1--)]'}`}>
                    {pumpStates.bokchoy ? 'Watering' : 'Idle'}
                  </span>
                </button>

                {/* Pechay Group */}
                <button
                  className={`flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
                    pumpStates.pechay
                      ? 'bg-gradient-to-br from-[var(--ptl-greenf)] to-[var(--ptl-greeng)]'
                      : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => handlePumpToggle('pechay')}
                >
                  <Sprout size={24} className={pumpStates.pechay ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${pumpStates.pechay ? 'text-white' : 'text-[var(--color-dark-blue)]'}`}>
                    Pechay
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${pumpStates.pechay ? 'text-white' : 'text-[var(--gray_1--)]'}`}>
                    {pumpStates.pechay ? 'Watering' : 'Idle'}
                  </span>
                </button>

                {/* Mustasa Group */}
                <button
                  className={`flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:col-span-2 lg:col-span-1 ${
                    pumpStates.mustasa
                      ? 'bg-gradient-to-br from-[var(--sage-dark)] to-[var(--sage)]'
                      : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => handlePumpToggle('mustasa')}
                >
                  <Sprout size={24} className={pumpStates.mustasa ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${pumpStates.mustasa ? 'text-white' : 'text-[var(--color-dark-blue)]'}`}>
                    Mustasa
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${pumpStates.mustasa ? 'text-white' : 'text-[var(--gray_1--)]'}`}>
                    {pumpStates.mustasa ? 'Watering' : 'Idle'}
                  </span>
                </button>
              </div>
            </div>


            
            {/* System Status Summary */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Activity size={20} className="text-[var(--ptl-greend)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-dark-blue)] m-0">
                    System Status
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4 p-4 bg-[var(--sage-lighter)] rounded-xl">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--gray_1--)] m-0 font-medium">
                      Active Pumps
                    </p>
                    <p className="text-lg font-bold text-[var(--color-dark-blue)] m-0 mt-1">
                      {Object.values(pumpStates).filter(Boolean).length} / 4
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[var(--sage-lighter)] rounded-xl">
                  <AlertCircle size={20} className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--gray_1--)] m-0 font-medium">
                      Low Moisture
                    </p>
                    <p className="text-lg font-bold text-[var(--color-dark-blue)] m-0 mt-1">
                      2 plants
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[var(--sage-lighter)] rounded-xl">
                  <Droplets size={20} className="text-[var(--color-success-c)] flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[var(--gray_1--)] m-0 font-medium">
                      Avg. Moisture
                    </p>
                    <p className="text-lg font-bold text-[var(--color-dark-blue)] m-0 mt-1">
                      62.4%
                    </p>
                  </div>
                </div>
              </div>
            </div>



            {/* Pechay Moisture Readings */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl min-h-[320px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Gauge size={20} className="text-[var(--ptl-greenf)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-dark-blue)] m-0">
                    Pechay Moisture
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {moistureData.pechay.map(plant => (
                  <div key={plant.id} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--color-dark-blue)]">
                        {plant.name}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-xl ${getMoistureStatus(plant.status).colorClass}`}>
                        {getMoistureStatus(plant.status).text}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[var(--sage-lighter)] rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor] ${getMoistureColor(plant.moisture)}`}
                        style={{ width: `${plant.moisture}%` }}
                      />
                    </div>
                    <span className="text-xl font-bold text-[var(--ptl-greend)] self-end">
                      {plant.moisture}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mustasa Moisture Readings */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl min-h-[320px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Gauge size={20} className="text-[var(--sage-dark)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-dark-blue)] m-0">
                    Mustasa Moisture
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {moistureData.mustasa.map(plant => (
                  <div key={plant.id} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--color-dark-blue)]">
                        {plant.name}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-xl ${getMoistureStatus(plant.status).colorClass}`}>
                        {getMoistureStatus(plant.status).text}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[var(--sage-lighter)] rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor] ${getMoistureColor(plant.moisture)}`}
                        style={{ width: `${plant.moisture}%` }}
                      />
                    </div>
                    <span className="text-xl font-bold text-[var(--ptl-greend)] self-end">
                      {plant.moisture}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            
            {/* Bokchoy Moisture Readings */}
            <div className="bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl min-h-[320px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Gauge size={20} className="text-[var(--sancgd)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-dark-blue)] m-0">
                    Bokchoy Moisture
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-5">
                {moistureData.bokchoy.map(plant => (
                  <div key={plant.id} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--color-dark-blue)]">
                        {plant.name}
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-xl ${getMoistureStatus(plant.status).colorClass}`}>
                        {getMoistureStatus(plant.status).text}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[var(--sage-lighter)] rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 shadow-[0_0_8px_currentColor] ${getMoistureColor(plant.moisture)}`}
                        style={{ width: `${plant.moisture}%` }}
                      />
                    </div>
                    <span className="text-xl font-bold text-[var(--ptl-greend)] self-end">
                      {plant.moisture}%
                    </span>
                  </div>
                ))}
              </div>
            </div>


            

            {/* CCTV Camera Feed */}
            <div className={`bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl min-h-[450px] ${
              cameraView === 'fullscreen' ? 'col-span-1 lg:col-span-2 xl:col-span-3' : 'col-span-1 lg:col-span-2'
            }`}>
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Camera size={24} className="text-[var(--ptl-greend)]" />
                  <h2 className="text-2xl font-bold text-[var(--color-dark-blue)] m-0">
                    Live Camera Feed
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button 
                    className="bg-[var(--sage-lighter)] border-none rounded-xl p-2.5 cursor-pointer flex items-center justify-center transition-all text-[var(--sage-dark)] hover:bg-[var(--sage-medium)]"
                    title="Refresh"
                  >
                    <RotateCw size={18} />
                  </button>
                  <button
                    className="bg-[var(--sage-lighter)] border-none rounded-xl p-2.5 cursor-pointer flex items-center justify-center transition-all text-[var(--sage-dark)] hover:bg-[var(--sage-medium)]"
                    onClick={() => setCameraView(cameraView === 'grid' ? 'fullscreen' : 'grid')}
                    title={cameraView === 'grid' ? 'Fullscreen' : 'Exit Fullscreen'}
                  >
                    <Maximize2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="w-full h-[500px] bg-[var(--metal-dark5)] rounded-xl overflow-hidden relative">
                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                  <Camera size={48} className="text-[var(--gray_1--)] opacity-30" />
                  <p className="text-[var(--gray_1--)] text-lg font-medium">Camera Stream</p>
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-sm font-semibold">Live</span>
                  </div>
                </div>
              </div>
            </div>


            

          </div>
        </div>
      </main>
    </section>
  );
}

export default Control_panel;