import { useNavigate } from "react-router-dom"
import {motion,AnimatePresence} from "framer-motion";
import axios from "axios"

import { LogOut,X} from "react-feather";

export function LogoutModal({isOpen,onClose}) {
  const navigate = useNavigate()
  if(!isOpen) return null;

  const handleAllLogout = async (e) =>{
      e.preventDefault();
  
       try {

        await axios.delete("http://localhost:5000/users/logout-all",{ withCredentials: true });
        localStorage.removeItem("accessToken")
        navigate("/login");
  
      } catch (err) {
        console.error("Logout error:", err.response?.data?.message || err.message);
      }
    };

    const handleDeviceLogout = async (e) =>{
      e.preventDefault()
      try{
        await axios.delete("http://localhost:5000/users/logout",{withCredentials:true})

        localStorage.removeItem("accessToken")
        navigate("/login");

      }catch(err){
        console.error("Logout error:",err.response?.data?.message || err.message)
      }
    }

  return (
    <section className="modal_bg flex items-center justify-center h-full w-full absolute
    top-0 left-0 bg-transparent-[20%]  backdrop-blur-[10px] z-[1]">

        <motion.div className="bg-white p-4
         w-[450px] h-[250px] relative rounded-[10px] shadow-lg"  
         initial={{ scale: 0.9, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 0.9, opacity: 0 }}
         transition={{ duration: 0.5 }}>
          
          <button className='logout-btn cancel-btn absolute top-[20px] right-[20px]' onClick={onClose}>
            <div className="transiton-1s rounded-[10px] p-[1px] transition-colors duration-300 hover:bg-[var(--pal2-whiteb)]"><X/></div>
          </button>
          
          <ul className='flex justify-start items-center'> 
            <LogOut className="mr-4" strokeWidth={1.5} size={24} />
            <p className="text-[1.5rem] text-[var(--acc-darkb)]">Logout Your Account?</p>
          </ul>
 
          <ul className="btn_box w-full h-full flex items-center justify-around p-t">
            <button className='logout-choices logout-all bg-[var(--color-danger-b)] rounded-[10px]'
            onClick={handleAllLogout}>To all devices</button>
            <button className='logout-choices logout-device btn-a rounded-[10px]
            'onClick={handleDeviceLogout}>This devices only</button>
          </ul>
      </motion.div>

    </section>
  

  )
}

