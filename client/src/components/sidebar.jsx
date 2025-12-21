import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Logout } from "./logout";
import { LogoutModal } from "./logoutModal";
import { User, LayoutPanelTop, ChartNoAxesCombined } from "lucide-react"
import * as Logo from "../components/logo"

export function Sidebar({ user }) {
  const [isOpen, setModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <aside className="con bg-white flex flex-col col-start-1 col-end-2 row-start-1 row-span-full p-4 rounded-[10px] shadow-lg w-full md:w-auto">
      
      {/* Logo - Always visible */}
      <div className="logo_div flex items-center justify-center h-[10%] w-[95%] mb-6 text-xl font-bold text-green-600">
        <Logo.Db_Logo />
      </div>

      {/* Nav Buttons */}
      <div className="flex flex-col items-center justify-start gap-2 flex-grow h-full w-full">
        
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex justify-center md:justify-start items-center ${isMobile ? 'w-12 h-12' : 'gap-2 py-1 px-2'} text-[var(--acc-darkb)] transition-all duration-300 rounded-[10px] my-2 w-full
            ${
              isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }
        >
          <LayoutPanelTop className="mx-1" strokeWidth={1.5} size={isMobile ? 20 : 18} />
          {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Dashboard</p>}
        </NavLink>

        {/* Users - Admin only */}
        {user?.role === "admin" &&
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex justify-center md:justify-start items-center ${isMobile ? 'w-12 h-12' : 'gap-2 py-1 px-2'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${
                isActive
                  ? "text-white bg-[var(--sancgb)] shadow-lg"
                  : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }
          >
            <User className="mx-1" strokeWidth={1.5} size={isMobile ? 20 : 18} />
            {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Users</p>}
          </NavLink>
        }

        {/* Analytics */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex justify-center md:justify-start items-center ${isMobile ? 'w-12 h-12' : 'gap-2 py-1 px-2'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${
              isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }
        >
          <ChartNoAxesCombined className="mx-1" strokeWidth={1.5} size={isMobile ? 20 : 18} />
          {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Analytics</p>}
        </NavLink>
      </div>

      {/* Logout Section */}
      <div className="flex items-center justify-start flex-col w-full h-[50%] mt-auto">
        {isOpen && <LogoutModal isOpen={isOpen} onClose={() => setModal(false)} />}
        <Logout onOpen={() => setModal(true)} />
      </div>
      
    </aside>
  );
}
