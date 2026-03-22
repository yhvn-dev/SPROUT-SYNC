import {  useEffect } from "react";
import { useUser} from "../hooks/userContext";
import { usePlantData } from "../hooks/plantContext";

import { Bell } from "lucide-react";
import { Darkmode } from "../features/darkmode";

export function Db_Header({ input, setNotifOpen}) {
  const { user } = useUser();
  const { notifsCount, loadNotifsCount } = usePlantData();
  
  useEffect(() => {
    loadNotifsCount();
  }, []);
  

  return (
    <section className="db_header bg-[var(--main-whiteb)] col-start-3 col-span-full md:col-start-3 md:col-span-2 row-start-1 px-4 md:px-0  rounded-[10px] flex items-center justify-between shadow-lg min-h-[4rem] gap-2">    
 
      <div className="flex items-center justify-end md:justify-start w-full md:w-1/2 md:mx-4">
        {input}        
      </div>
           
      {/* User Info Section */}
      <div className="flex items-center gap-2 flex-shrink-0 md:mr-4">
          <Darkmode/>
        {/* Notification Button */}
        <button 
          onClick={() => setNotifOpen(true)} 
          className="notif_button relative cursor-pointer px-3 py-2 rounded-lg hover:bg-[var(--main-white--)] transition-colors"
          aria-label="Notifications">
            
            <Bell className="bell_icon" size={18} />
          {notifsCount > 0 && ( 
            <span className="absolute rounded-full min-w-[1rem] h-4 text-xs text-white bg-[var(--sancgb)] flex items-center justify-center px-1 top-0 right-0">
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
         
        </div>

      
      </div>


    </section>
  );
}