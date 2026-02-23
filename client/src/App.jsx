import {BrowserRouter, Routes, Route} from "react-router-dom";
import {lazy,Suspense, useEffect} from "react";
const Login = lazy(() => import("./pages/Login/login.jsx"));
const Contact = lazy(() => import("./pages/Contacts/contacts.jsx"));
const Home = lazy(() => import("./pages/Home/home.jsx"));
const About = lazy(() => import("./pages/About/about.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard/dashboard.jsx"));
const Users = lazy(() => import("./pages/Users/users.jsx"));
const Analytics = lazy(() => import('./pages/Analytics/analytics.jsx'));
const Batch_History = lazy(() => import("./pages/Batch_History/batch_history.jsx"));
const Control_Panel = lazy(() => import("./pages/Control_Panel/control_panel.jsx"));
const Plants = lazy(() => import ("./pages/Plants/plants.jsx"))


import { Dashboard_Skeleton } from "./components/skeletons.jsx";
import { ProtectedRoute } from "./routes/ProtectedRoutes/page.Routes.jsx";
import { PlantDataProvider } from "./hooks/plantContext.jsx";
import { ESP32Provider } from "./hooks/esp32Hooks.jsx"
import { ValveProvider } from "./hooks/valveContext.jsx";
import {listenForMessages } from "./utils/firebase.js";



import './styles.css'
function App() {

  
  useEffect(() => {
  const init = async () => {   
    listenForMessages();    
  };

  init();
}, []);


  
  return (
    <PlantDataProvider>
       <ValveProvider>   
      <BrowserRouter>
        <Suspense fallback={
          <div className="flex justify-center items-center h-screen">
             <Dashboard_Skeleton/>
        </div>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/contacts' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/login' element={<Login />} />

            <Route path='/dashboard' element={
              <ESP32Provider>
                <ProtectedRoute allowedRoles={['admin','viewer']}>
                  <Dashboard />
                </ProtectedRoute>
              </ESP32Provider>
            }/>

            <Route path='/users' element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Users />
              </ProtectedRoute>
            }/>

            <Route path='/analytics' element={
              <ProtectedRoute allowedRoles={['admin','viewer']}>
                <Analytics />
              </ProtectedRoute>
            }/>

            <Route path='/batch_history' element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Batch_History />
              </ProtectedRoute>
            }/>

            <Route path='/control_panel' element={
              <ESP32Provider>
                <ProtectedRoute allowedRoles={['admin']}>
                  <Control_Panel />
                </ProtectedRoute>
              </ESP32Provider>
            }/>


            <Route path='/plants' element={
              <ESP32Provider>
                <ProtectedRoute allowedRoles={['admin',"viewer"]}>
                  <Plants />
                </ProtectedRoute>
              </ESP32Provider>
            }/>
      
          </Routes>
        </Suspense>
        
      </BrowserRouter>
      </ValveProvider>
    </PlantDataProvider>

  );
}

export default App;

