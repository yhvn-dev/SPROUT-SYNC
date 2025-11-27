import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login/login.jsx"
import Contact from "./pages/Contacts/contacts.jsx"
import Home from "./pages/Home/home.jsx"
import About from "./pages/About/about.jsx"
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Users from "./pages/Users/users.jsx"
import Analytics from './pages/Analytics/analytics.jsx';
import DeviceManagement from "./pages/DeviceManagement/deviceManagement.jsx"

import { ProtectedRoute } from "./routes/ProtectedRoutes/page.Routes.jsx";

import './styles.css'
function App() {

  return(
      <>
        <BrowserRouter>
          <Routes>         
              <Route path='/' element={<Home/>}/>
              <Route path='/contacts' element={<Contact/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/login' element={<Login/>}/>  
              <Route path='/device_management' element={
                <ProtectedRoute allowedRoles={['admin']}>
                 <DeviceManagement/> 
                </ProtectedRoute>
              }/>

              <Route path='/dashboard' element={
                <ProtectedRoute allowedRoles={['admin','viewer']}>
                  <Dashboard/>
                </ProtectedRoute>
              }/>

              <Route path='/analytics' element={
                <ProtectedRoute allowedRoles={['admin','viewer']}>
                  <Analytics/>
                </ProtectedRoute>
              }/>

              <Route path='/users' element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users/>
                </ProtectedRoute>
              }/>
          </Routes>
        </BrowserRouter>

      </>

  )

}

export default App
