import { useContext,useState,useEffect} from "react";
import { UserContext } from "../hooks/userContext";
import { usePlantData } from "../hooks/plantContext";

import Pfp from "../assets/Images/Default Profile Picture 2.jpg";
import { Search } from "./search";
import {Bell} from "lucide-react"



export function Db_Header({input,setNotifOpen}) {
  const { user } = useContext(UserContext);
  const {notifsCount,loadNotifsCount} = usePlantData()
  
  useEffect(() =>{
    loadNotifsCount()
  })
  
  
  return (
    <section className="bg-[var(--main-whiteb)] rounded-[10px] col-start-3 col-end-5 header flex items-center justify-center shadow-lg">
      <div className="flex items-center justify-start w-full relative mx-4">
        <Search input={input}/>
 
      </div>
      <div className="right_header w-[70%] flex flex-row-reverse">
        <img 
          src={user?.profile_picture ? `http://localhost:5000/uploads/${user.profile_picture}` : Pfp} 
          className='profile-img max-w-[2rem] max-h-[2rem] h-[3rem] w-[3rem]'
        />
       
        <ul className=" col_text">  
          <p className='name-txt'>{user?.username || "Guest"}</p>
          <p className='role-txt text-[0.8rem] text-[var(--acc-darkc)]'>{user?.role || "Viewer"}</p>
        
        </ul>

          <button onClick={() =>setNotifOpen(true)} className="relative cursor-pointer  px-4 rounded-lg mx-2 hover:bg-[var(--main-white--)] ">
            <Bell size={18}/>
            <span className="absolute rounded-full w-4 h-4 text-xs text-[var(--main-white--)] 
            bg-[var(--sancgb)] p-[1px] top-[1px] right-0">
              {notifsCount}
            </span>
          </button>
      </div>
    </section>
  );
}
