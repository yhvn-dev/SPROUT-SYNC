import { Clock, AlertCircle, CheckCircle, AlertTriangle,Trash2 } from "lucide-react";
import { usePlantData } from "../hooks/plantContext";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../hooks/userContext";
import { MessageContext } from "../hooks/messageHooks";



    
const getColorScheme = (type, status) => {
  switch (type.toLowerCase()) {
  case "alert":
  case "danger":
  case "critical":
    return { 
      bg: "hsl(353, 40%, 90%)",  // --color-danger-c
      text: "var(--color-danger-a)", // --color-danger-a
      icon: AlertCircle,
      iconBg:"#fff"
    };
  case "warning":
    return { 
      bg: "hsl(35, 80%, 90%)",  // --color-warning-b
      text: "hsl(0, 1%, 25%)", // --color-warning
      icon: AlertTriangle,
      iconBg:"#fff"
    };
  case "info":
    return { 
      bg: "hsl(258, 44%, 93%)",  
      text: "hsl(0, 1%, 25%)",  
      icon: Clock,
      iconBg:"#fff"
    };
  case "success":
  case "optimal":
  case "normal":
    return { 
      bg: "#E8F3ED",  
      text: "hsl(125, 85%, 60%)", 
      icon: CheckCircle,
      iconBg:"#fff"
    };
  default:
    return { 
      bg: "hsl(210, 20%, 95%)",  
      text: "hsl(210, 10%, 25%)",
      icon: AlertCircle,
      iconBg:"#fff"
    };
}
};

export function Notif_Modal({ isOpen, onClose}) {
  const {notifs,markNotifsAsRead} = usePlantData() 
  const {setOpenDeleteNotifModal,setSelectedNotif,setDeleteMode} = useContext(MessageContext);
  const {user} = useContext(UserContext);


  
  useEffect(() => {
    if (isOpen) {
      markNotifsAsRead();
    }
  }, [isOpen, markNotifsAsRead]); 


  const handleOpenDelete = async (notifData) => {
    setOpenDeleteNotifModal(true);
    setDeleteMode("one_notif")
    setSelectedNotif(notifData);
  };
  const handleOpenRemoveAllNotifs = async () => {
    setOpenDeleteNotifModal(true)
   setDeleteMode("all_notifs")
  }
  
  
    if (!isOpen) return null;
  return (
    <motion.div className="notif_modal absolute top-4 right-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}>
      
      <main className="notif_box bg-white rounded-2xl w-auto md:w-96 max-h-[80vh] shadow-lg flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>

          <div className="flex items-center flex-row-reverse">
         
            <button onClick={onClose} className="text-gray-500 cursor-pointer hover:bg-[var(--main-white--)] rounded-lg p-2">
              ✕
            </button>
            
            {user?.role === "admin" ? (
                <>
                  <button onClick={handleOpenRemoveAllNotifs} className="flex items-center gap-2 m-4 text-gray-500 cursor-pointer hover:bg-[var(--main-white--)] rounded-lg p-2">
                    <Trash2  className="trash_logo w-4 h-4 stroke-var(--metal-dark4)"/>
                    <span className="text-sm">Delete All</span>
                  </button> 
                </>
              ) :
              null}
                                
          </div>
        </div>
     




        {/* Notification List */}
        <div className="notifs_scroll_box flex-1 overflow-y-auto px-4 py-3 space-y-3">
         
          {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
             
              <p className="text-lg font-medium">No notifications at the moment</p>
            </div>
          )}



          {(notifs || []).map((notif) => {
            const { bg, text, icon: Icon,iconBg:iconBg } = getColorScheme(notif.type);
            return (
              <div
                key={notif.notification_id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ backgroundColor: bg }}>

                 <div className="mt-1  p-[4px] rounded-lg  " style={{ backgroundColor: iconBg }}>
                  <Icon size={20} className="clock_icon" color={text} />
                </div>

                <div className="flex-1">
                  <p
                    className="text-sm font-semibold" style={{ color: text, whiteSpace: "pre-line" }}>
                    {notif.message}{""}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} className="clock_icon" /> {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>

                {user?.role === "admin" ? (
                    <>
                      <button
                        type="submit"
                        onClick={() => handleOpenDelete(notif)}
                        className="rounded-full p-2 h-5 w-5 cursor-pointer mx-2">
                        <Trash2 className="delete_notif text-[var(--acc-darkc)]" size={16} />
                      </button>
                    </>
                  ) : 
                  null}
           
              </div>


            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-2 rounded-lg bg-[var(--sancgb)] text-white font-medium hover:bg-[var(--sancgd)] transition">
            Close
          </button>
        </div>
      </main>
    </motion.div>
  );
}


