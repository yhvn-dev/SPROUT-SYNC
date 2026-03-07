import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy, Suspense, useEffect} from "react";


const Login = lazy(() => import("./pages/Login/login.jsx"));
const Home = lazy(() => import("./pages/Home/home.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/dashboard.jsx"));
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
import './styles.css';

function App() {
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

          {/* Protected routes */}
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
