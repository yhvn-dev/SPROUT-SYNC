import { useState, useContext,useEffect,useCallback} from 'react';
import { UserContext } from '../../hooks/userContext';
import { Sidebar } from "../../components/sidebar";
import { Db_Header } from "../../components/db_header";
import { Droplets, Wifi, WifiOff, Power, Sprout, CircleQuestionMark, Menu, Video, VideoOff, Radio, Loader2, AlertTriangle } from 'lucide-react';
import { Notif_Modal } from '../../components/notifModal';
import { LogoutModal } from '../../components/logoutModal';
import InfosModal from '../../components/infosModal';
import { ESP32Context } from "../../hooks/esp32Hooks";
import { usePlantData } from '../../hooks/plantContext';
import { useValve } from '../../hooks/valveContext';
import { useStream } from '../../hooks/streamHooks';
import { MessageContext } from "../../hooks/messageHooks.jsx";
import { DeleteNotifModal } from '../../components/deleteNotifModal.jsx';
import { FloatSuccessMsg } from '../../components/messages.jsx';

import * as closeValveServices from "../../data/closeValveServices";
import RegisterDeviceModal from '../Dashboard/modals/registerDeviceModal';


function Control_panel() {
  const { user, skippedRegister} = useContext(UserContext);
  const {openDeleteNotifModal,setOpenDeleteNotifModal,selectedNotif,
        deleteMode,
        messageContext,setMessageContext} = useContext(MessageContext);

         
  const { ESP32Status } = useContext(ESP32Context);
  const [ logoutOpen, setLogoutOpen ] = useState(false);
  const [ isInfoModalOpen, setInfoModalOpen ] = useState(false);
  const [ infoModalPurpose, setInfoModalPurpose ] = useState("");
  const [ isNotifOpen, setNotifOpen ] = useState(false);
  const [ sidebarOpen, setSidebarOpen ] = useState(false);
  const { valveMode, setValveMode } = useValve();
  const { readings } = usePlantData();
  const [ isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const { running, loading, error, videoRef, start, stop, refreshStatus } = useStream();

  const clearMsg = useCallback(() => {
     setMessageContext("")
  }, []);
    
  useEffect(() => {
  if (user?.first_time_login && !skippedRegister) {
    setRegisterModalVisible(true);
  } else {
    setRegisterModalVisible(false);
  }
}, [user?.first_time_login, skippedRegister]);

  const isDark = typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    localStorage.setItem('valveStates', JSON.stringify(valveMode));
  }, [valveMode]);

  const isForceOff = (key) => valveMode[key] === 'forceOff';

  const handleCloseAllGroups = async () => {
    const nextState = valveMode.all === 'auto' ? 'forceOff' : 'auto';
    setValveMode({ all: nextState, bokchoy: nextState, pechay: nextState, mustasa: nextState });
    try {
      await closeValveServices.closeAllGroups(nextState === 'forceOff' ? "FORCE_OFF" : "AUTO");
    } catch (err) { console.error(err); }
  };

  const toggleGroup = async (group, apiFn) => {
    const nextState = valveMode[group] === 'auto' ? 'forceOff' : 'auto';
    setValveMode(prev => {
      const updated = { ...prev, [group]: nextState };
      updated.all = updated.bokchoy === 'forceOff' && updated.pechay === 'forceOff' && updated.mustasa === 'forceOff'
        ? 'forceOff' : 'auto';
      return updated;
    });
    try {
      await apiFn(nextState === 'forceOff' ? "FORCE_OFF" : "AUTO");
    } catch (err) { console.error(err); }
  };


  
  const handleOpenInfosModalControlPanel = () => {
    setInfoModalPurpose("control_panel");
    setInfoModalOpen(true);
  };


  const handleOpenInfosModalValveControls = () => {
    setInfoModalPurpose("valve_controls");
    setInfoModalOpen(true);
  };

  const waterLevel = readings
    .filter(r => r.sensor_id === 8)
    .at(-1)?.value;

  const formattedWaterLevel = waterLevel ? Number(waterLevel).toFixed(1) : null;


  
  return (
    <section className="control_panel con_main h-screen flex flex-col md:grid gap-4 md:grid-cols-[15fr_85fr] md:grid-rows-[auto_1fr] bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] font-sans overflow-hidden">

      <button onClick={() => setSidebarOpen(true)} className="menu_button md:hidden fixed top-4 left-4 z-40 bg-white p-2.5 rounded-lg shadow-lg">
        <Menu size={22} />
      </button>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}

      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block md:row-span-full`}>
     {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "fixed inset-y-0 left-0 w-64 z-50" : "hidden"} md:static md:block`}>
          <Sidebar
            user={user}
            setLogoutOpen={setLogoutOpen}
            setSidebarOpen={setSidebarOpen}
            setRegisterModalVisible={setRegisterModalVisible}
          />
      </aside>
      </aside>

      <header className="col-start-2 row-start-1">
        <Db_Header setNotifOpen={setNotifOpen} />
      </header>

      <main className="col-start-2 row-start-2 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto w-full">

          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-dark-blue)]">Control Panel

                          <button className='mx-4' onClick={handleOpenInfosModalControlPanel}>
                            <CircleQuestionMark className='w-4 h-4 cursor-pointer' />
                          </button>
                   
              </h1>
              <p className="text-base text-[var(--gray_1--)]">Monitor and Control your automatic plant watering system</p>
            </div>
            <div className="conb flex items-center gap-4 bg-white p-4 px-6 rounded-2xl shadow-md border border-gray-50">
              {ESP32Status === true ? (
                <>
                  <Wifi size={24} className="text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark-blue)] m-0">ESP32 Connected</p>
                    <p className="text-xs text-[var(--gray_1--)] m-0 mt-1">Last updated: Just now</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_currentColor]" />
                </>
              ) : (
                <>
                  <WifiOff size={24} className="text-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark-blue)] m-0">ESP32 Disconnected</p>
                    <p className="text-xs text-[var(--gray_1--)] m-0 mt-1">Trying to reconnect...</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_currentColor]" />
                </>
              )}
            </div>
          </div>

          {/* ── SPROUT-SYNC MONITORING ─────────────────────────────────────── */}
          <div className="conb  bg-white rounded-3xl p-7 shadow-lg border border-gray-50 hover:shadow-xl transition-all mb-6">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--ptl-greend)] to-[var(--ptl-greene)] flex items-center justify-center shadow-md">
                  <Radio size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-dark-blue)] m-0">SPROUT-SYNC</h2>
                  <p className="text-[10px] text-[var(--gray_1--)] m-0 font-medium tracking-widest uppercase">Monitoring</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  loading ? 'bg-yellow-50 text-yellow-600' :
                  error   ? 'bg-red-50 text-red-500'      :
                  running ? 'bg-red-50 text-red-600'      :
                            'bg-gray-100 text-gray-500'
                }`}>
                  {loading
                    ? <Loader2 size={10} className="animate-spin" />
                    : <span className={`w-2 h-2 rounded-full ${running ? 'bg-red-500 animate-pulse' : error ? 'bg-red-400' : 'bg-gray-400'}`} />
                  }
                  {loading ? (running ? 'Stopping...' : 'Starting...') : error ? 'Error' : running ? 'LIVE' : 'Idle'}
                </span>

                {/* Start / Stop */}
                {!running ? (
                  <button
                    onClick={start}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-br from-[var(--ptl-greend)] to-[var(--ptl-greene)] text-white hover:opacity-90 hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <Video size={15} />}
                    {loading ? 'Starting...' : 'Start Stream'}
                  </button>
                ) : (
                  <button
                    onClick={stop}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md ${
                      loading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:opacity-90 hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {loading ? <Loader2 size={15} className="animate-spin" /> : <VideoOff size={15} />}
                    {loading ? 'Stopping...' : 'Stop Stream'}
                  </button>
                )}
              </div>
            </div>



            <div
              className="relative w-full bg-gray-900 rounded-2xl overflow-hidden"
              style={{ aspectRatio: "16/9", minHeight: "220px" }}>     
              {running && (
                  <video
                    key="live-video"
                    ref={videoRef}
                    muted
                    autoPlay
                    playsInline
                    controls
                    onCanPlay={(e) => {
                      console.log("🎬 onCanPlay fired");
                      e.target.play().catch(err => console.warn("onCanPlay play() failed:", err));
                    }}
                    onError={(e) => console.error("❌ Video element error:", e.target.error)}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                )}

                
              {/* IDLE */}
              {!running && !loading && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4  pointer-events-none">
                  <Video size={40} className="text-white/20" />
                  <p className="text-white/50 font-semibold text-sm m-0">
                    Camera Offline
                  </p>
                  <p className="text-white/25 text-xs m-0">
                    Press Start Stream to begin monitoring
                  </p>
                </div>
              )}

              {/* LOADING */}                                             
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 pointer-events-none">
                  <Loader2 size={36} className="text-yellow-400 animate-spin" />
                  <p className="text-white/50 font-semibold text-sm m-0">
                    Starting stream...
                  </p>
                  <p className="text-white/25 text-xs m-0">
                    Please wait
                  </p>
                </div>
              )}

              {/* ERROR */}
              {error && !loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center z-10">
                  <AlertTriangle size={36} className="text-red-400" />
                  <p className="text-red-400 font-semibold text-sm m-0">
                    Stream Error
                  </p>
                  <p className="text-white/30 text-xs m-0 max-w-xs">
                    {error}
                  </p>
                  <button
                    onClick={start}
                    className="mt-1 px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* LIVE BADGE */}
              {running && !loading && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-white text-[10px] font-bold tracking-widest">
                    LIVE
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
              <span className="text-xs text-[var(--gray_1--)]">
                Protocol: <strong className="text-[var(--color-dark-blue)]">HLS</strong>
              </span>
              <span className="text-xs text-[var(--gray_1--)]">
                Stream: <strong className={running ? 'text-green-500' : 'text-gray-400'}>{running ? 'Active' : 'Inactive'}</strong>
              </span>
              {!running && !loading && (
                <button onClick={refreshStatus} className="text-xs text-[var(--ptl-greend)] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer">
                  Refresh Status
                </button>
              )}
            </div>
          </div>



          {/* WATER LEVEL GAUGE */}
          <div className="conb flex flex-col justify-start items-start bg-white center rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl mb-6 min-h-[400px]">
            <div className="flex flex-col h-full items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke={isDark ? "#3d56a4" : "#E8F3ED"} strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#3d56a4" strokeWidth="8"
                    strokeDasharray={`${(Number(waterLevel) / 100) * 282.7} 282.7`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Droplets className="w-10 h-10 mb-2 text-[#3d56a4]" />
                  <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{formattedWaterLevel }</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
                </div>
              </div>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-4">Water Level</p>
            </div>
          </div>





          {/* Valve Controls  ============================================= ========================================*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto">
            <div className="conb bg-white rounded-3xl p-7 shadow-lg border border-gray-50 transition-all hover:shadow-xl col-span-full lg:col-span-full min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <Droplets size={24} className="text-[var(--ptl-greend)]" />
                  <h2 className="text-2xl font-bold text-[var(--color-dark-blue)] m-0">
                    Valve Controls
                    <button className='mx-4' onClick={handleOpenInfosModalValveControls}>
                      <CircleQuestionMark className='w-4 h-4 cursor-pointer' />
                    </button>
                  </h2>
                </div>
                <div>
                  <p className="text-sm text-[var(--gray_1--)] m-0 font-medium">Forced-OFF Valves</p>
                  <p className="text-lg font-bold text-[var(--color-dark-blue)] m-0 mt-1">
                    {['bokchoy', 'pechay', 'mustasa'].filter(p => isForceOff(p)).length} / 3
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <button
                  className={`cp_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:col-span-2 ${
                    isForceOff('all') ? 'bg-gradient-to-br from-[var(--ptl-greend)] to-[var(--ptl-greene)]' : 'bg-[var(--pal2-whitea)]'
                  }`}
                  onClick={handleCloseAllGroups}>
                  <Power size={28} className={isForceOff('all') ? 'text-white' : 'text-[var(--ptl-greend)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('all') ? 'text-white' : 'text-[var(--metal-dark5)]'}`}>All Plants</span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('all') ? 'text-white' : 'text-[var(--metal-dark4)]'}`}>
                    {isForceOff('all') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>

                <button
                  className={`cp_button bokchoy_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
                    isForceOff('bokchoy') ? 'bg-gradient-to-br from-[var(--sancgd)] to-[var(--sancgb)]' : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => toggleGroup('bokchoy', closeValveServices.closeBokchoyGroup)}>
                  <Sprout size={24} className={isForceOff('bokchoy') ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('bokchoy') ? 'text-white' : 'text-[var(--metal-dark5)]'}`}>Bokchoy</span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('bokchoy') ? 'text-white' : 'text-[var(--metal-dark4)]'}`}>
                    {isForceOff('bokchoy') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>

                <button
                  className={`cp_button pechay_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 ${
                    isForceOff('pechay') ? 'bg-gradient-to-br from-[var(--ptl-greenf)] to-[var(--ptl-greeng)]' : 'bg-[var(--sage-lighter)]'
                  }`}
                  onClick={() => toggleGroup('pechay', closeValveServices.closePechayGroup)}>
                  <Sprout size={24} className={isForceOff('pechay') ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('pechay') ? 'text-white' : 'text-[var(--metal-dark5)]'}`}>Pechay</span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('pechay') ? 'text-white' : 'text-[var(--metal-dark4)]'}`}>
                    {isForceOff('pechay') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>

                <button
                  className={`cp_button mustasa_button flex flex-col items-center justify-center p-8 px-6 rounded-2xl border-none cursor-pointer transition-all gap-3 shadow-md min-h-[160px] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:col-span-2 lg:col-span-1 ${
                    isForceOff('mustasa') ? 'bg-gradient-to-br from-[var(--sage-dark)] to-[var(--sage)]' : 'bg-[var(--main-white)]'
                  }`}
                  onClick={() => toggleGroup('mustasa', closeValveServices.closeMustasaGroup)}>
                  <Sprout size={24} className={isForceOff('mustasa') ? 'text-white' : 'text-[var(--sage-dark)]'} />
                  <span className={`text-lg font-semibold mt-2 ${isForceOff('mustasa') ? 'text-white' : 'text-[var(--color-dark-blue)]'}`}>Mustasa</span>
                  <span className={`text-sm font-medium opacity-90 ${isForceOff('mustasa') ? 'text-white' : 'text-[var(--gray_1--)]'}`}>
                    {isForceOff('mustasa') ? 'FORCE OFF' : 'AUTO'}
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {isNotifOpen && <Notif_Modal isOpen={isNotifOpen} onClose={() => setNotifOpen(false)} />}
      {logoutOpen && <LogoutModal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} />}
      {isInfoModalOpen && (
        <InfosModal
          isInfosModalOpen={isInfoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          purpose={infoModalPurpose}
        />
      )}
    
    {isRegisterModalVisible && (
      <RegisterDeviceModal
        userData={user}
        onClose={() => setRegisterModalVisible(false)} 
      />
      )}

    {openDeleteNotifModal && (
      <DeleteNotifModal 
        isOpen={openDeleteNotifModal} 
        selectedNotif={selectedNotif}
        deleteMode={deleteMode} 
        onClose={() => setOpenDeleteNotifModal(false)} 
      />
    )}
        
    {messageContext && (
      <FloatSuccessMsg  txt={messageContext} clearMsg={clearMsg} />
    )}

        

    </section>
  );

  
}




export default Control_panel;