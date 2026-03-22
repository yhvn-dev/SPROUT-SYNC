import { Clock, AlertCircle, CheckCircle, AlertTriangle, Trash2, BellOff } from "lucide-react";
import { usePlantData } from "../hooks/plantContext";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "../hooks/userContext";
import { MessageContext } from "../hooks/messageHooks";


import { getColorByStatus } from "../utils/colors";


const getIconByType = (type) => {
  switch (type?.toLowerCase()) {
    case "critical":
    case "danger":
    case "alert":
      return AlertCircle;
    case "warning":
      return AlertTriangle;
    case "success":
    case "optimal":
      return CheckCircle;
    case "info":
    case "normal":
    default:
      return Clock;
  }
};



// ─────────────────────────────────────────────────────────────────────────────
export function Notif_Modal({ isOpen, onClose }) {
  const { notifs, markNotifsAsRead } = usePlantData();
  const { setOpenDeleteNotifModal, setSelectedNotif, setDeleteMode } = useContext(MessageContext);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      markNotifsAsRead();
    }
  }, [isOpen, markNotifsAsRead]);

  const handleOpenDelete = (notifData) => {
    setOpenDeleteNotifModal(true);
    setDeleteMode("one_notif");
    setSelectedNotif(notifData);
  };

  const handleOpenRemoveAllNotifs = () => {
    setOpenDeleteNotifModal(true);
    setDeleteMode("all_notifs");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="notif_modal absolute top-4 right-4"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <main className="notif_box bg-white rounded-2xl w-auto md:w-96 max-h-[80vh] shadow-lg flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>

          <div className="flex items-center flex-row-reverse gap-1">
            <button
              onClick={onClose}
              className="text-gray-500 cursor-pointer hover:bg-gray-100 rounded-lg p-2">
              ✕
            </button>


            {user?.role === "admin" && (
              <button
                onClick={handleOpenRemoveAllNotifs}
                className="flex items-center gap-2 text-gray-500 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Delete All</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="notifs_scroll_box flex-1 overflow-y-auto px-4 py-3 space-y-3">

          {notifs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
              <BellOff size={32} strokeWidth={1.5} />
              <p className="text-base font-medium">No notifications at the moment</p>
            </div>
          )}

          {(notifs || []).map((notif) => {
            const Icon = getIconByType(notif.type);
            const colors = getColorByStatus(notif.status, notif.type);

            return (
              <div
                key={notif.notification_id}
                className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                style={{
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 p-1.5 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: colors.iconBg }}>
                    
                  <Icon size={18} color={colors.iconColor} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={{ color: colors.text, whiteSpace: "pre-line" }}>
                    {notif.message}
                  </p>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs mt-1.5" style={{ color: colors.iconColor, opacity: 0.8 }}>
                    <Clock size={11} />
                    {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>

                {/* Delete button (admin only) */}
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={() => handleOpenDelete(notif)}
                    className="flex-shrink-0 rounded-full p-1.5 cursor-pointer hover:bg-black/10 transition-colors"
                  >
                    <Trash2 size={15} color={colors.iconColor} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-2 rounded-lg bg-[var(--sancgb)] text-white font-medium hover:bg-[var(--sancgd)] transition"
          >
            Close
          </button>
        </div>
      </main>
    </motion.div>
  );
}