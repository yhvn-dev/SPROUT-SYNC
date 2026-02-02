import { useState, useContext } from 'react';
import { Menu } from "lucide-react"
import { UserContext } from '../../hooks/userContext';
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Droplets, Wifi, WifiOff, Power, Sprout } from 'lucide-react';
import * as closeValveServices from "../../data/closeVavlveServices"
import { Notif_Modal } from '../../components/notifModal';
import { LogoutModal } from '../../components/logoutModal';

function Control_panel() {
  const { user } = useContext(UserContext);
  const [esp32Connected, setEsp32Connected] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [cameraView, setCameraView] = useState('grid'); // 'grid' or 'fullscreen'
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔁 AUTO / FORCE OFF states (for closing valves)
  const [valveMode, setValveMode] = useState({
    all: 'auto',
    bokchoy: 'auto',
    pechay: 'auto',
    mustasa: 'auto'
  });

  // helpers
  const isForceOff = (key) => valveMode[key] === 'forceOff';

  // Toggle all valves
  const handleCloseAllGroups = async () => {
    const nextState = valveMode.all === 'auto' ? 'forceOff' : 'auto';

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

  return (
    <section className="control_panel
      con_main h-screen grid gap-4 grid-cols-[auto_1fr]
      grid-rows-[auto_1fr]
      bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]
      font-sans
      overflow-hidden">

      {/* Sidebar */}
      <aside className={`col-start-1 col-end-1 row-start-1 row-span-full`}>
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
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark-blue)] mb-1">
                Irrigation Control Panel
              </h1>
              <p className="text-base text-[var(--gray_1--)]">
                Monitor and control your hydroponic system
              </p>
            </div>

            <div className="conb flex items-center gap-4 bg-white p-4 px-6 rounded-2xl shadow-md border border-gray-50 relative">
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

          {/* Valve Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto">

            {/* Valve Controls Card */}
            <div className="conb bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl col-span-full lg:col-span-full min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Droplets size={24} className="text-[var(--ptl-greend)]" />
                  <h2 className="text-2xl font-bold text-[var(--color-dark-blue)] m-0">
                    Valve Controls
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
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('pechay') ? 'text-white' : 'ext-[var(--metal-dark4)]'}`}>
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
                  onClick={() => toggleGroup('mustasa', closeValveServices.closeMustasaGroup)}
                >
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

    </section>
  );
}

export default Control_panel;
