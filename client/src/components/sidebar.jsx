import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Logout } from "./logout";
import { LogoutModal } from "./logoutModal";
import {User,LayoutPanelTop,ChartNoAxesCombined,Cable} from "lucide-react"
import * as Logo from "../components/logo"


export function Sidebar() {
  const [isOpen, setModal] = useState(false);
 
  return (
    <section className="bg-white  flex flex-col col-start-1 col-end-2 row-start-1 row-span-full p-4 rounded-[10px] shadow-lg">
      
      <div className="logo_div flex items-center justify-center h-[10%] w-[95%] mb-6 text-xl font-bold text-green-600">
        <Logo.Db_Logo/>
      </div>

      {/* Nav Buttons */}
      <div className="flex flex-col items-center justify-start gap-2 flex-grow h-full w-full">  
        {/* Dashboard */}
        <NavLink
          to="/Dashboard"
          end
          className={({ isActive }) =>
            `flex justify-start items-center text-[var(--acc-darkb)] gap-2 py-1 transition-colors duration-300 rounded-[10px] px-2 my-2 w-full
              ${
                isActive
                  ? "text-white bg-[var(--sancgb)] shadow-lg"
                  : "text-[var(--acc-darkb)]  hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)] "}` }>
                        
          <LayoutPanelTop  className="mx-1" strokeWidth={1.5} size={18}/>
          <p className="text-sm mr-2">Dashboard</p>
        </NavLink>

        {/* Users */}
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex justify-start items-center :text-[var(--acc-darkb)] gap-2 py-1 transition-colors duration-300 rounded-[10px] px-2  my-2 w-full
              ${
                isActive
                  ? "text-white bg-[var(--sancgb)] shadow-lg" 
                  : "text-[var(--acc-darkb)]  hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
          }>

          <User className="mx-1"  strokeWidth={1.5} size={18}/>
          <p className="text-sm mr-2">Users</p>
        </NavLink>

        
        {/* Analytics */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex justify-start items-center gap-2 py-1 transition-colors duration-300 rounded-[10px]  px-2 my-2 w-full
              ${
                isActive
                  ? "text-white bg-[var(--sancgb)] shadow-lg"
                  : "text-[var(--acc-darkb)] hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)] "
              }`
          }>
            
        <ChartNoAxesCombined  className="mx-1" strokeWidth={1.5} size={18}/>
          <p className="text-sm mr-2">Analytics</p>
        </NavLink>    


        <NavLink
          to="/device_management"
          className={({ isActive }) =>
            `flex justify-start items-center gap-2 py-1 transition-colors duration-300 rounded-[10px]  px-2 my-2 w-full
              ${
                isActive
                  ? "text-white bg-[var(--sancgb)] shadow-lg"
                  : "text-[var(--acc-darkb)] hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)] "
              }`
          }>
            
        <Cable className="mx-1" strokeWidth={1.5} size={22}/>
          <p className="text-sm mr-2">Manage Devices</p>
        </NavLink>    
      </div>


      {/* Logout Section */}
      <div className="flex items-center justify-start flex-col w-full h-[50%]  ">
        {isOpen && <LogoutModal isOpen={isOpen} onClose={() => setModal(false)} />}
        <Logout onOpen={() => setModal(true)} />
      </div>
    </section>
  );



}
