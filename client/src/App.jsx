import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login/login.jsx"
import Contact from "./pages/Contacts/contacts.jsx"
import Home from "./pages/Home/home.jsx"
import About from "./pages/About/about.jsx"
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Users from "./pages/Users/users.jsx"
import Analytics from './pages/Analytics/analytics.jsx';
import Batch_History from "./pages/Batch_History/batch_history.jsx";
import Control_Panel from "./pages/Control_Panel/control_panel.jsx";


import { ProtectedRoute } from "./routes/ProtectedRoutes/page.Routes.jsx";
import { PlantDataProvider } from "./hooks/plantContext.jsx";

import './styles.css'
function App() {

  return(
      <>
      <PlantDataProvider>
        <BrowserRouter>
          <Routes>         
              <Route path='/' element={<Home/>}/>
              <Route path='/contacts' element={<Contact/>}/>
              <Route path='/about' element={<About/>}/>
              <Route path='/login' element={<Login/>}/>  
        

              <Route path='/dashboard' element={
                <ProtectedRoute allowedRoles={['admin','viewer']}>
                  <Dashboard/>
                </ProtectedRoute>
              }/>

              <Route path='/users' element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Users/>
                </ProtectedRoute>
              }/>

               <Route path='/analytics' element={
                <ProtectedRoute allowedRoles={['admin','viewer']}>
                  <Analytics/>
                </ProtectedRoute>
              }/>

              <Route path='/batch_history' element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Batch_History/>
                </ProtectedRoute>
              }/>

              <Route path='/control_panel' element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Control_Panel/>
              </ProtectedRoute>
            }/>

            

          </Routes>
        </BrowserRouter>
    </PlantDataProvider>

      </>

  )

}

export default App
