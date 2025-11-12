import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/Login/login.jsx"
import Contact from "./pages/Contacts/contacts.jsx"
import Home from "./pages/Home/home.jsx"
import About from "./pages/About/about.jsx"
import Dashboard from "./pages/Dashboard/dashboard.jsx";
import Users from "./pages/Users/users.jsx"
import Analytics from './pages/Analytics/analytics.jsx';
import ControlPanel from "./pages/ControlPanel/control_panel.jsx"


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
              <Route path='/dashboard' element={<ProtectedRoute> <Dashboard/> </ProtectedRoute>}/>
              <Route path='/users' element={<ProtectedRoute> <Users/> </ProtectedRoute>} />
              <Route path='/analytics' element={<ProtectedRoute> <Analytics/> </ProtectedRoute>}/> 
              <Route path='/control_panel' element={<ProtectedRoute> <ControlPanel/> </ProtectedRoute>}/>

          </Routes>

        </BrowserRouter>

      </>

  )

}

export default App
