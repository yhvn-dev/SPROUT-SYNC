import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Logout } from "./logout";
import { LogoutModal } from "./logoutModal";
import {User,LayoutPanelTop,ChartNoAxesCombined,LogOut} from "lucide-react"


export function Sidebar() {
  const [isOpen, setModal] = useState(false);
 
  return (
    <section className="bg-white  flex flex-col col-start-1 col-end-2 row-start-1 row-end-4 p-4 rounded-[10px] shadow-lg">
      
      <div className="logo_div flex items-center justify-center h-[10%] w-[95%] mb-6 text-xl font-bold text-green-600">
        LOGO
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
                  : "text-[var(--acc-darkb)]  hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)] "
              }`
          }>
                        
          <LayoutPanelTop  className="ml-2 mr-1" strokeWidth={1.5} size={18}/>
          <p className="text-sm">Dashboard</p>
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

          <User className="ml-2 mr-1"  strokeWidth={1.5} size={18}/>
          <p className="text-sm">Users</p>
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
            
          <ChartNoAxesCombined  className="ml-2 mr-1" strokeWidth={1.5} size={18}/>
          <p className="text-sm">Analytics</p>
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
