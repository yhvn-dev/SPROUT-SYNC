import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import * as notifServices from "../data/notifsServices"
import { useContext, useEffect } from "react";
import { MessageContext } from "../hooks/messageHooks";
import { usePlantData } from "../hooks/plantContext";


export function DeleteNotifModal({ isOpen,deleteMode,selectedNotif, onClose }) {
  const {setMessageContext} = useContext(MessageContext)
  const {loadNotifs} = usePlantData() 

  if (!isOpen) return null;

  useEffect(() =>{
    console.log("CURRENT DELETE MODE",deleteMode)
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (deleteMode === "one_notif") {
        await notifServices.deleteNotifs(selectedNotif.notification_id); // wait for deletion
        setMessageContext("Notification deleted successfully");
      } else {
        await notifServices.deleteAllNotifs(); // wait for all deletion
        setMessageContext("All notifications have been deleted successfully");
      }

      loadNotifs(); 
      onClose();  
    } catch (error) {
    console.error("Error Deleting Notifications", error);
  }
  };




  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-center text-gray-800 font-semibold text-lg mb-1">
          Delete Notification
        </h3>
        <p className="text-center text-gray-400 text-sm mb-6">
            {selectedNotif ? (
                <>  
                Are you sure you want to delete this notification? This cannot be undone.
                </>
            ) : (
               <>
                 Are you sure you want delete all notifications? This cannot be undone.
               </>
            )}
        
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );

  
}