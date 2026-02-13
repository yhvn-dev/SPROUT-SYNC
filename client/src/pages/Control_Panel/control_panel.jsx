import { useState, useContext,useEffect} from 'react';
import { UserContext } from '../../hooks/userContext';
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Droplets, Wifi, WifiOff, Power, Sprout, CircleQuestionMark,Menu} from 'lucide-react';
import { Notif_Modal } from '../../components/notifModal';
import { LogoutModal } from '../../components/logoutModal';
import InfosModal from '../../components/infosModal';
import { ESP32Context } from "../../hooks/esp32Hooks"

import { usePlantData } from '../../hooks/plantContext';
import { useValve } from '../../hooks/valveContext';
import * as closeValveServices from "../../data/closeValveServices"

function Control_panel() {
  const { user } = useContext(UserContext);
  const {ESP32Status,setESP32Status} = useContext(ESP32Context)
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isInfoModalOpen,setInfoModalOpen] = useState(false);
  const [infoModalPurpose,setInfoModalPurpose] = useState(""); // FIXED: Removed extra semicolon
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { valveMode, setValveMode } = useValve();
  const {averageReadingsBySensor} = usePlantData();

  const isDark = typeof window !== "undefined" &&
  document.documentElement.classList.contains("dark");

  // ✅ SAVE to localStorage (backup - optional, ValveProvider already does this)
  useEffect(() => {
    localStorage.setItem('valveStates', JSON.stringify(valveMode));
  }, [valveMode]);

  // ✅ HELPER FUNCTIONS
  const isForceOff = (key) => valveMode[key] === 'forceOff';

  // ✅ FIXED: "All Plants" - NOW WORKS!
  const handleCloseAllGroups = async () => {
    const nextState = valveMode.all === 'auto' ? 'forceOff' : 'auto';

    // 🔥 THIS WAS MISSING - NOW ADDED!
    setValveMode({
      all: nextState,
      bokchoy: nextState,
      pechay: nextState,
      mustasa: nextState
    });

    try {
      await closeValveServices.closeAllGroups(nextState === 'forceOff' ? "FORCE_OFF" : "AUTO");
    } catch (error) {
      console.error(error);
    }
  };

  // Toggle individual groups
  const toggleGroup = async (group, apiFn) => {
    const nextState = valveMode[group] === 'auto' ? 'forceOff' : 'auto';

    setValveMode(prev => {
      const updated = { ...prev, [group]: nextState };
      updated.all = updated.bokchoy === 'forceOff' && updated.pechay === 'forceOff' && updated.mustasa === 'forceOff'
        ? 'forceOff'
        : 'auto';
      return updated;
    });

    try {
      await apiFn(nextState === 'forceOff' ? "FORCE_OFF" : "AUTO");
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenInfosModalControlPanel = () =>{
    setInfoModalPurpose("control_panel")
    setInfoModalOpen(true)
  }

  const handleOpenInfosModalWaterLevel = () => {
    setInfoModalPurpose("water_level");
    setInfoModalOpen(true);
  };
  
  const waterLevel = averageReadingsBySensor?.ultra_sonic?.average ?? 0;

  return (
    <section className="control_panel
      con_main h-screen flex flex-col md:grid gap-4  md:grid-cols-[15fr_85fr]
      md:grid-rows-[auto_1fr]
      bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]
      font-sans
      overflow-hidden">
      
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} />
      </button>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
      
      {/* SIDEBAR */}
      <aside
        className={`
          ${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"}
          md:static md:block
          md:row-span-full
        `}>
        <Sidebar
          user={user}
          setLogoutOpen={setLogoutOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </aside>

      {/* Header */}
      <header className="col-start-2 row-start-1">
        <Db_Header setNotifOpen={setNotifOpen}/>    
      </header>

      {/* Main Content */}
      <main className="col-start-2 row-start-2 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto w-full">

          {/* Header with ESP32 Status */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark-blue)] ">
                Control Panel
              </h1>
              <p className="text-base text-[var(--gray_1--)]">
                Monitor and Control your automatic plant watering system
              </p>
            </div>
            
            <div className="conb flex items-center gap-4 bg-white p-4 px-6 rounded-2xl shadow-md border border-gray-50 relative">
              {ESP32Status === true ? (
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
          
          {/* WATER LEVEL GAUGE */}
          <div className="conb flex flex-col justify-start items-start bg-white center rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl mb-6 min-h-[400px]">
            <div className="flex flex-col h-full items-center justify-center ">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isDark ? "#3d56a4" : "#E8F3ED"}
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3d56a4"
                    strokeWidth="8"
                    strokeDasharray={`${(Number(waterLevel) / 100) * 282.7} 282.7`}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Droplets className="w-10 h-10 mb-2 text-[#3d56a4]" />
                  <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                    {waterLevel}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                </div>
              </div>

              <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-4">
                Water Level
              </p>                
            </div>
          </div>

          {/* Valve Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto">
            {/* Valve Controls Card */}
            <div className="conb bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl col-span-full lg:col-span-full min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Droplets size={24} className="text-[var(--ptl-greend)]" />
                  <h2 className="text-2xl font-bold text-[var(--color-dark-blue)] m-0">
                    Valve Controls 
                    <button className='mx-4' onClick={handleOpenInfosModalControlPanel}> 
                      <CircleQuestionMark className='w-4 h-4 cursor-pointer'/>
                    </button> 
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-[var(--gray_1--)] m-0 font-medium">
                    Forced-OFF Valves
                  </p>
                  <p className="text-lg font-bold text-[var(--color-dark-blue)] m-0 mt-1">
                    {['bokchoy', 'pechay', 'mustasa'].filter(p => isForceOff(p)).length} / 3
                  </p>
                </div>   
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* All Plants */}
                <button
                  className={`cp_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:col-span-2 ${
                    isForceOff('all')
                      ? 'bg-gradient-to-br from-[var(--ptl-greend)] to-[var(--ptl-greene)]'
                      : 'bg-[var(--pal2-whitea)]'
                  }`}
                  onClick={handleCloseAllGroups}>
                  <Power size={28} className={isForceOff('all') ? 'text-white' : 'text-[var(--ptl-greend)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('all') ? 'text-white' : 'text-[var(--metal-dark5)]'}`}>
                    All Plants
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('all') ? 'text-white' : 'text-[var(--metal-dark4)]'}`}>
                    {isForceOff('all') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>

                {/* Bokchoy */}
                <button
                  className={`cp_button bokchoy_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
                    isForceOff('bokchoy')
                      ? 'bg-gradient-to-br from-[var(--sancgd)] to-[var(--sancgb)]'
                      : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => toggleGroup('bokchoy', closeValveServices.closeBokchoyGroup)}>
                  <Sprout size={24} className={isForceOff('bokchoy') ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('bokchoy') ? 'text-white' : 'text-[var(--metal-dark5)]'}`}>
                    Bokchoy
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('bokchoy') ? 'text-white' : 'text-[var(--metal-dark4)]'}`}>
                    {isForceOff('bokchoy') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>

                {/* Pechay */}
                <button
                  className={`cp_button pechay_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
                    isForceOff('pechay')
                      ? 'bg-gradient-to-br from-[var(--ptl-greenf)] to-[var(--ptl-greeng)]'
                      : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => toggleGroup('pechay', closeValveServices.closePechayGroup)}>
                  <Sprout size={24} className={isForceOff('pechay') ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('pechay') ? 'text-white' : 'text-[var(--metal-dark5)]'}`}>
                    Pechay 
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('pechay') ? 'text-white' : 'text-[var(--metal-dark4)]'}`}>
                    {isForceOff('pechay') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>

                {/* Mustasa */}
                <button
                  className={`cp_button mustasa_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:col-span-2 lg:col-span-1 ${
                    isForceOff('mustasa')
                      ? 'bg-gradient-to-br from-[var(--sage-dark)] to-[var(--sage)]'
                      : 'bg-[var(--main-white)]'
                  }`}
                  onClick={() => toggleGroup('mustasa', closeValveServices.closeMustasaGroup)}>
                  <Sprout size={24} className={isForceOff('mustasa') ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('mustasa') ? 'text-white' : 'text-[var(--color-dark-blue)]'}`}>
                    Mustasa
                  </span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('mustasa') ? 'text-white' : 'text-[var(--gray_1--)]'}`}>
                    {isForceOff('mustasa') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODALS */}
      {isNotifOpen && (
        <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />
      )}

      {logoutOpen && (
        <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)}  />
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

export default Control_panel;
