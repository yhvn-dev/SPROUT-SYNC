import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import * as notifServices from "../data/notifsServices"
import { useContext } from "react";
import { MessageContext } from "../hooks/messageHooks";
import { motion } from "framer-motion";



export function DeleteNotifModal({ isOpen, deleteMode, selectedNotif, onClose, loadNotifs }) {
  const { setMessageContext } = useContext(MessageContext);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (deleteMode === "one_notif") {
        await notifServices.deleteNotifs(selectedNotif.notification_id);
        setMessageContext("Notification deleted successfully");
      } else {
        await notifServices.deleteAllNotifs();
        setMessageContext("All notifications have been deleted successfully");
      }

      loadNotifs();
      onClose();
    } catch (error) {
      console.error("Error Deleting Notifications", error);
    }
  };


  
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-transparent backdrop-blur-3xl"
      onClick={onClose}>
      <motion.div
        className="conb relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}>
          
         <button
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4  text-gray-500 hover:bg-gray-100 px-1 rounded-xl  text-lg" >
            x
          </button>

        <div className="delete_notif_icon flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className=" text-center text-gray-800 font-semibold text-lg mb-1">
          Delete Notification
        </h3>
        <p className="text-center text-gray-400 text-sm mb-6">
          {deleteMode === "one_notif"
            ? "Are you sure you want to delete this notification? This cannot be undone."
            : "Are you sure you want to delete all notifications? This cannot be undone."
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer delete_notif_cancel_btn flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="cursor-pointer flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );



}