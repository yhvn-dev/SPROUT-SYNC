import { useContext, useState, useEffect } from "react";
import { UserContext } from "../hooks/userContext";
import { usePlantData } from "../hooks/plantContext";
import Pfp from "../assets/Images/Default Profile Picture 2.jpg";
import { Search } from "./search";
import { Bell } from "lucide-react";

export function Db_Header({ input, setNotifOpen }) {
  const { user } = useContext(UserContext);
  const { notifsCount, loadNotifsCount } = usePlantData();
  
  useEffect(() => {
    loadNotifsCount();
  }, []);
  
  return (
    <section className="bg-[var(--main-whiteb)] col-start-3 col-span-full md:col-start-3 md:col-span-2 row-start-1 px-4 md:px-0  rounded-[10px] flex items-center justify-between shadow-lg min-h-[4rem] gap-2">    
 
      <div className="flex items-center justify-end md:justify-start w-full md:w-1/2 md:mx-4">
        <Search input={input} />
      </div>
      
      {/* User Info Section */}
      <div className="flex items-center gap-2 flex-shrink-0 md:mr-4">
        
        {/* Notification Button */}
        <button 
          onClick={() => setNotifOpen(true)} 
          className="relative  cursor-pointer px-3 py-2 rounded-lg hover:bg-[var(--main-white--)] transition-colors"
          aria-label="Notifications"
          >
            <Bell size={18} />
          {notifsCount > 0 && (
            <span className="absolute rounded-full min-w-[1rem] h-4 text-xs text-[var(--main-white--)] bg-[var(--sancgb)] flex items-center justify-center px-1 top-0 right-0">
              {notifsCount}
            </span>
          )}
        </button>
        
        {/* User Info - Hidden on sm  all screens */}
        <div className="flex items-center justify-center">
          <div className="text-right">
            <p className="name-txt text-sm font-medium whitespace-nowrap">
              {user?.username || "Guest"}
            </p>
            <p className="role-txt text-[0.8rem] text-[var(--acc-darkc)]">
              {user?.role || "Viewer"}
            </p>
          </div>
          
          <img 
            src={user?.profile_picture ? `http://localhost:5000/uploads/${user.profile_picture}` : Pfp} 
            alt="Profile"
            className="profile-img w-10 h-10 rounded-full object-cover"
          />



        </div>
        
      

      </div>


    </section>
  );
}