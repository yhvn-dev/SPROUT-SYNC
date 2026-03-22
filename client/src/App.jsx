import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense, useEffect, useState} from "react";



const Login = lazy(() => import("./pages/Login/login.jsx"));
const Home = lazy(() => import("./pages/Home/home.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/dashboard.jsx"));
const Manage_Plants = lazy(() => import("./pages/Manage_Plants/manage_plants.jsx"))
const Users = lazy(() => import("./pages/Users/users.jsx"));
const Analytics = lazy(() => import('./pages/Analytics/analytics.jsx'));
const Batch_History = lazy(() => import("./pages/Batch_History/batch_history.jsx"));
const Control_Panel = lazy(() => import("./pages/Control_Panel/control_panel.jsx"));
const Plants = lazy(() => import("./pages/Plants/plants.jsx"));

import { Dashboard_Skeleton } from "./components/skeletons.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoutes/page.Routes.jsx";
import { MessagesProvider } from "./hooks/messageHooks.jsx";
import { PlantDataProvider } from "./hooks/plantContext.jsx";
import { ESP32Provider } from "./hooks/esp32Hooks.jsx";
import { ValveProvider } from "./hooks/valveContext.jsx";
import { listenForMessages } from "./utils/firebase.js";
import { markAudioUnlocked } from './utils/notificationSounds'; 

import './styles.css';

function App() {


    useEffect(() => {
    const unlock = () => {
      const audio = new Audio('/sounds/NORMAL_NOTIF.mp3');
      audio.volume = 0;
      audio.play()
        .then(() => {
          markAudioUnlocked();
          console.log("🔊 Audio unlocked");
        })
        .catch((err) => {
          console.warn("Silent play failed:", err.message);
          markAudioUnlocked();
          console.log("🔊 Audio unlocked (fallback)");
        });
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
    };
    
  }, []);




  useEffect(() => {
    const init = async () => {
      console.log("🚀 Starting SPROUT-SYNC notifications...");
      listenForMessages();
    };
    init();
  }, []);


  
  return (
    <BrowserRouter>
      <div 
        id="notification-container"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] hidden space-y-2 max-w-sm w-80 pointer-events-none"
      />
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <Dashboard_Skeleton />
        </div>
      }>
        
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={
            <MessagesProvider>
              <PlantDataProvider>
                <ValveProvider>
                  <ESP32Provider>
                    <ProtectedRoute allowedRoles={['admin', 'viewer']}>
                      <Dashboard />
                    </ProtectedRoute>
                  </ESP32Provider>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

         <Route path='/manage_plants' element={
            <MessagesProvider>
              <PlantDataProvider>
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Manage_Plants/>
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>
    
          <Route path='/users' element={
            <MessagesProvider>
              <PlantDataProvider>
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Users />
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/analytics' element={
            <MessagesProvider>
              <PlantDataProvider>
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin', 'viewer']}>
                    <Analytics />
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/batch_history' element={
            <MessagesProvider>
              <PlantDataProvider>
                <ValveProvider>
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Batch_History />
                  </ProtectedRoute>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/control_panel' element={
             <MessagesProvider> 
              <PlantDataProvider>
                <ValveProvider>
                  <ESP32Provider>
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Control_Panel />
                    </ProtectedRoute>
                  </ESP32Provider>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>

          <Route path='/plants' element={
            <MessagesProvider> 
              <PlantDataProvider>
                <ValveProvider>
                  <ESP32Provider>
                    <ProtectedRoute allowedRoles={['admin', 'viewer']}>
                      <Plants />
                    </ProtectedRoute>
                  </ESP32Provider>
                </ValveProvider>
              </PlantDataProvider>
            </MessagesProvider>
          }/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}




export default App;