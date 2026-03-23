import { Clock, AlertCircle, CheckCircle, AlertTriangle, Trash2, BellOff } from "lucide-react";
import { usePlantData } from "../hooks/plantContext";
import { useDarkMode } from "../hooks/useDarkmode";
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "../hooks/userContext";
import { MessageContext } from "../hooks/messageHooks";
import { getColorByStatus, getIconByType } from "../utils/colors";

export function Notif_Modal({ isOpen, onClose }) {
  const { notifs, markNotifsAsRead } = usePlantData();
  const { setOpenDeleteNotifModal, setSelectedNotif, setDeleteMode } = useContext(MessageContext);
  const { user } = useUser();
  const isDark = useDarkMode();

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
      className="notif_modal absolute top-4 right-4 z-50"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <main className={`
        notif_box w-auto md:w-96 max-h-[80vh] shadow-2xl flex flex-col rounded-2xl
        ${isDark 
          ? 'bg-gray-800/95 backdrop-blur-sm border border-gray-700/50' 
          : 'bg-white/95 backdrop-blur-sm border border-gray-200/50'
        }
      `}>
        {/* Header */}
        <div className={`
          px-4 py-3 flex justify-between items-center
          ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}
        `}>
          <h2 className={`
            text-lg font-semibold
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Notifications
          </h2>

          <div className="flex items-center flex-row-reverse gap-1">
            <button
              onClick={onClose}
              className={`
                cursor-pointer rounded-lg p-2 transition-colors
                ${isDark 
                  ? 'text-gray-400 hover:bg-gray-700/80' 
                  : 'text-gray-500 hover:bg-gray-100'
                }
              `}
            >
              ✕
            </button>

            {user?.role === "admin" && (
              <button
                onClick={handleOpenRemoveAllNotifs}
                className={`
                  flex items-center gap-2 text-sm cursor-pointer rounded-lg px-3 py-2 transition-colors
                  ${isDark 
                    ? 'text-gray-400 hover:bg-gray-700/80' 
                    : 'text-gray-500 hover:bg-gray-100'
                  }
                `}
              >
                <Trash2 className={`w-4 h-4 ${isDark ? 'stroke-gray-400' : ''}`} />
                <span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="notifs_scroll_box flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {notifs.length === 0 && (
            <div className={`
              flex flex-col items-center justify-center py-12 gap-3
              ${isDark ? 'text-gray-500' : 'text-gray-400'}
            `}>
              <BellOff 
                size={32} 
                strokeWidth={1.5}
                className={isDark ? 'stroke-gray-500' : 'stroke-gray-400'}
              />
              <p className="text-base font-medium">No notifications at the moment</p>
            </div>
          )}


          {(notifs || []).map((notif) => {
            const Icon = getIconByType(notif.type);

            const colors = getColorByStatus(notif.status, notif.type, isDark);

            return (
              <motion.div
                key={notif.notification_id}
                className="flex items-start gap-3 p-4 rounded-xl transition-all hover:shadow-md"
                style={{
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.1 }}
              >
                {/* Icon */}
                <div
                  className="mt-0.5 p-2 rounded-lg flex-shrink-0 shadow-sm"
                  style={{ 
                    backgroundColor: colors.iconBg,
                  }}
                >
                  <Icon 
                    size={20} 
                    color={colors.iconColor} 
                    strokeWidth={2.5}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm font-medium leading-snug mb-1.5" 
                    style={{ 
                      color: colors.text, 
                      whiteSpace: "pre-line" 
                    }}
                  >
                    {notif.message}
                  </p>

                  {/* Timestamp */}
                  <div 
                    className="flex items-center gap-1.5 text-xs" 
                    style={{ 
                      color: colors.iconColor, 
                      opacity: 0.85 
                    }}
                  >
                    <Clock size={12} strokeWidth={2} />
                    <span>{new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {/* Delete button (admin only) */}
                {user?.role === "admin" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDelete(notif);
                    }}
                    className={`
                      rounded-full p-2 cursor-pointer transition-all hover:scale-110 flex-shrink-0 ml-2
                      ${isDark 
                        ? 'hover:bg-white/20' 
                        : 'hover:bg-black/10'
                      }
                    `}
                    title="Delete notification"
                  >
                    <Trash2 
                      size={16} 
                      color={colors.iconColor}
                      strokeWidth={2}
                    />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`
          px-4 py-3
          ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}
        `}>
          <button
            onClick={onClose}
            className="cursor-pointer w-full py-2.5 rounded-xl font-medium transition-all hover:scale-[1.02] shadow-sm
                       bg-gradient-to-r from-blue-600 to-blue-700 
                       hover:from-blue-700 hover:to-blue-800 
                       text-white active:scale-95"
          >
            Close
          </button>
        </div>
      </main>
    </motion.div>
  );
}