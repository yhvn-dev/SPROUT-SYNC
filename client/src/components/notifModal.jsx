import { Clock, AlertCircle, CheckCircle, AlertTriangle,Trash2 ,Bell} from "lucide-react";
import { usePlantData } from "../hooks/plantContext";
import { useEffect, useState } from "react";
import * as notifService from "./../data/notifsServices"



const getColorScheme = (type, status) => {
  switch (type.toLowerCase()) {
    case "alert":
    case "danger":
    case "critical":
      return { 
        bg: "#fee2e2", 
        text: "#dc2626", 
        icon: AlertCircle 
      };
    case "warning":
      return { 
        bg: "#fef3c7", 
        text: "#d97706", 
        icon: AlertTriangle 
      };
    case "info":  // ✅ NEW! For 10% approaching thresholds
      return { 
        bg: "#dbeafe", 
        text: "#2563eb", 
        icon: Clock  // ⏰ Approaching/early warning
      };
    case "success":
    case "optimal":
    case "normal":
      return { 
        bg: "#d1fae5", 
        text: "#059669", 
        icon: CheckCircle 
      };
    default:
      return { 
        bg: "#f3f4f6", 
        text: "#374151", 
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
    <aside className="absolute top-4 right-4">
      <div className="bg-white rounded-2xl w-96 max-h-[80vh] shadow-lg overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 cursor-pointer hover:bg-[var(--main-white--)] rounded-lg p-2">
            ✕
          </button>
        </div>
     

        {/* Notification List */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
         
          {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell size={48} className="mb-3 opacity-50" />
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
                  <Icon size={20} color={text} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold" style={{ color: text, whiteSpace: "pre-line" }}>
                    {notif.message}{" "}
                    <span className="text-xs font-normal text-gray-600">
                      ({notif.status})
                    </span>
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} /> {new Date(notif.created_at).toLocaleString()}
                  </div>
                  

                </div>

                <button type="submit" onClick={() => handleDelete(notif)}className="rounded-full p-2 h-5 w-5 cursor-pointer mx-2">
                  <Trash2 className="text-[var(--acc-darkc)]" size={16}/>
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
    </aside>
  );
}


