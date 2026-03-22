import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { User, LayoutPanelTop, ChartNoAxesCombined, LogOut, FileText, Settings, Plug, Flower2, Sprout } from "lucide-react";
import * as Logo from "../components/logo";

export function Sidebar({ user, setRegisterModalVisible = null, setLogoutOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleRegisterModal = () => {
    setRegisterModalVisible(true);
  };

  return (
    <aside className={`sidebar h-[100vh] bg-white flex flex-col col-start-1 col-end-2 row-start-1 row-span-full p-4 rounded-[10px] shadow-lg ${isMobile ? 'w-[50%]' : 'w-auto'}`}>

    <div className="logo_div flex items-center justify-center h-[10%] w-[95%] mb-6 text-xl font-bold text-green-600">
     {isMobile ? <Logo.Img /> : <Logo.Db_Logo />}
    </div>

      {/* Nav Buttons */}
      <div className="flex flex-col items-center justify-start gap-2 flex-grow h-full w-full">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }>
          <LayoutPanelTop strokeWidth={1.5} size={isMobile ? 18 : 18} />
          {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Dashboard</p>}
        </NavLink>

     
        {/* Manage Plants */}
         {user?.role === "admin" &&
            <NavLink
              to="/manage_plants"
              className={({ isActive }) =>
                `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
                ${isActive
                  ? "text-white bg-[var(--sancgb)] shadow-lg"
                  : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
                }`
              }>
              <Sprout strokeWidth={1.5} size={isMobile ? 18 : 18} />
              {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Manage Plants</p>}
            </NavLink>
        }

        {/* Users */}
        {user?.role === "admin" &&
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }
          >
            <User strokeWidth={1.5} size={isMobile ? 18 : 18} />
            {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Users</p>}
          </NavLink>
        }

        {/* Analytics */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }
        >
          <ChartNoAxesCombined strokeWidth={1.5} size={isMobile ? 18 : 18} />
          {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Analytics</p>}
        </NavLink>

        {/* Batch History - Admin only */}
        {user?.role === "admin" && (
          <NavLink
            to="/batch_history"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }
          >
            <FileText strokeWidth={1.5} size={isMobile ? 18 : 18} />
            {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Batch History</p>}
          </NavLink>
        )}

        {/* Control Panel - Admin only */}
        {user?.role === "admin" &&
          <NavLink
            to="/control_panel"
            className={({ isActive }) =>
              `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
              ${isActive
                ? "text-white bg-[var(--sancgb)] shadow-lg"
                : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
              }`
            }>
            <Plug strokeWidth={1.5} size={isMobile ? 18 : 18} />
            {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Control Panel</p>}
          </NavLink>
        }

        {/* Plants */}
        <NavLink
          to="/plants"
          className={({ isActive }) =>
            `flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full
            ${isActive
              ? "text-white bg-[var(--sancgb)] shadow-lg"
              : "hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]"
            }`
          }>
          <Flower2 strokeWidth={1.5} size={isMobile ? 18 : 18} />
          {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Plants</p>}
        </NavLink>

        {/* Device - First time login */}
        {user?.first_time_login && (
          <div className="flex justify-start w-full">
            <button
              onClick={handleRegisterModal}
              className={`cursor-pointer text-sm hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]
                flex items-center w-full transition-all duration-300 rounded-[10px] my-2
                ${isMobile ? 'h-12 justify-center' : 'gap-2 py-1 px-2'}
              `}>
              <Settings strokeWidth={1.5} size={isMobile ? 18 : 18} />
              {!isMobile && 'Device'}
            </button>
          </div>
        )}

        {/* Logout Button */}
        <button
          className={`text-sm cursor-pointer flex justify-center items-center ${isMobile ? 'w-full h-12' : 'gap-2 py-1 px-2 justify-start'} transition-all duration-300 rounded-[10px] my-2 w-full hover:bg-[var(--sage-light)] hover:text-[var(--acc-darkb)]`}
          onClick={() => setLogoutOpen(true)}>
          <LogOut strokeWidth={1.5} size={isMobile ? 18 : 18} />
          {!isMobile && <p className="text-sm mr-2 whitespace-nowrap">Logout</p>}
        </button>

      </div>
    </aside>
  );
}