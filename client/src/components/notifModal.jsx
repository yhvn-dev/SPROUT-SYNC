import { Clock, AlertCircle, CheckCircle, AlertTriangle,Trash2 ,Bell} from "lucide-react";
import { usePlantData } from "../hooks/plantContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


import * as notifService from "./../data/notifsServices"




  // --color-danger-a: hsl(355, 100%, 70%);
  // --color-danger-b: hsl(355,100%, 85%);
  // --color-danger-c:hsl(353, 40%, 90%);
  // --color-warning: hsl(35, 80%, 70%);
  // --color-warning-b: hsl(35, 80%, 90%);
  // --color-warning-c: hsl(35, 80%, 95%);
  // --color-success-a: hsl(125, 85%, 60%);
  // --color-success-a-soft: hsl(110, 58%, 90%);
  // --color-success-c: hsl(160,60%, 70%);
  // --color-success-d:hsl(150, 80%, 80%);
 
    




    
const getColorScheme = (type, status) => {
  switch (type.toLowerCase()) {
  case "alert":
  case "danger":
  case "critical":
    return { 
      bg: "hsl(353, 40%, 90%)",  // --color-danger-c
      text: "var(--color-danger-a)", // --color-danger-a
      icon: AlertCircle
    };
  case "warning":
    return { 
      bg: "hsl(35, 80%, 90%)",  // --color-warning-b
      text: "hsl(35, 80%, 70%)", // --color-warning
      icon: AlertTriangle
    };
  case "info":
    return { 
      bg: "hsl(210, 100%, 97%)",  
      text: "hsl(220, 80%, 50%)",  
      icon: Clock
    };
  case "success":
  case "optimal":
  case "normal":
    return { 
      bg: "hsl(110, 58%, 90%)",  // --color-success-a-soft
      text: "hsl(125, 85%, 60%)", // --color-success-a
      icon: CheckCircle
    };
  default:
    return { 
      bg: "hsl(210, 20%, 95%)",  // light gray fallback
      text: "hsl(210, 10%, 25%)",
      icon: AlertCircle
    };
}
};



export function DeleteNotifModal({isOpen,onClose}){
  


  if (!isOpen) return null;


}

export function Notif_Modal({ isOpen, onClose}) {
  const {notifs,loadNotifs,markNotifsAsRead} = usePlantData()
  const [notifData,setNoifData] = useState([])

  useEffect(() => {
    if (isOpen) {
      markNotifsAsRead();
    }
  }, [isOpen, markNotifsAsRead]); 



  const handleDelete = async (notifData) =>{
    try {
      setNoifData(notifData)
    } catch (error) {
      
    }
  }

  const removeAllNotifs = async () => {
    try {
        await notifService.deleteAllNotifs()
        loadNotifs()
    } catch (error) {
      console.error("Error Deleting Notifications")
    }
  }
  

  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
        await notifService.deleteNotifs(notifData.notification_id)
        loadNotifs()
    } catch (error) {
      console.error("Error Deleting Notifications")
    }
  }

  
  if (!isOpen) return null;
  return (
    <motion.div className="notif_modal absolute top-4 right-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    >
      <div className="notif_box bg-white rounded-2xl w-96 max-h-[80vh] shadow-lg flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>

          <div className="flex items-center flex-row-reverse">
         
            <button onClick={onClose} className="text-gray-500 cursor-pointer hover:bg-[var(--main-white--)] rounded-lg p-2">
              ✕
            </button>
            <button onClick={removeAllNotifs} className="flex items-center gap-2 m-4 text-gray-500 cursor-pointer hover:bg-[var(--main-white--)] rounded-lg p-2">
              <Trash2 
                className="trash_logo w-4 h-4 stroke-var(--metal-dark4)" 
               
            
              />

              <span className="text-sm">Delete All</span>
            </button> 
          </div>
        </div>
     




        {/* Notification List */}
        <form onSubmit={handleSubmit} className="notifs_scroll_box flex-1 overflow-y-auto px-4 py-3 space-y-3">
         
          {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
             
              <p className="text-lg font-medium">No notifications at the moment</p>
            </div>
          )}

          {(notifs || []).map((notif) => {
            const { bg, text, icon: Icon } = getColorScheme(notif.type);
            return (
              <div
                key={notif.notification_id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: bg }}
              >
                <div className="mt-1">
                  <Icon size={20} className="clock_icon" color={text} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold" style={{ color: text, whiteSpace: "pre-line" }}>
                    {notif.message}{" "}
                 
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} className="clock_icon" /> {new Date(notif.created_at).toLocaleString()}
                  </div>
                
                </div>


                <button type="submit" onClick={() => handleDelete(notif)}className="rounded-full p-2 h-5 w-5 cursor-pointer mx-2">
                  <Trash2 className="delete_notif text-[var(--acc-darkc)]" size={16}/>
                  </button>
              </div>
            );
          })}
        </form>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-2 rounded-lg bg-[var(--sancgb)] text-white font-medium hover:bg-[var(--sancgd)] transition">
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}


