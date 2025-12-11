import React from "react";
import { Clock, AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

const getColorScheme = (type) => {
  switch (type.toLowerCase()) {
    case "danger":
    case "critical":
      return { bg: "#fde2e1", text: "#c92c2c", icon: AlertCircle };
    case "warning":
      return { bg: "#fff4e5", text: "#d97706", icon: AlertTriangle };
    case "success":
    case "optimal":
    case "normal":
      return { bg: "#e6f4ea", text: "#15803d", icon: CheckCircle };
    default:
      return { bg: "#f3f4f6", text: "#374151", icon: AlertCircle };
  }
};

// Example notifications array
const NOTIFICATIONS = [
  {
    notification_id: 7,
    type: "warning",
    message: "Moisture is Normal",
    related_sensor: 1,
    status: "Normal",
    created_at: "2025-12-05T15:32:59.230Z",
  },
  {
    notification_id: 8,
    type: "warning",
    message: "Moisture is HIGH",
    related_sensor: 1,
    status: "HIGH",
    created_at: "2025-12-06T08:25:00.894Z",
  },
  {
    notification_id: 9,
    type: "warning",
    message: "Soil is getting wet",
    related_sensor: 7,
    status: "HIGH",
    created_at: "2025-12-06T10:12:00.000Z",
  },
];



    
export function Notif_Modal({ isOpen, onClose, notifs = NOTIFICATIONS }) {
  if (!isOpen) return null;

  return (

    <aside className="absolute top-4 right-4">

      <div className="bg-white rounded-2xl w-96 max-h-[80vh] shadow-lg overflow-y-auto flex flex-col">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
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
                  <p className="text-sm font-semibold" style={{ color: text }}>
                    {notif.message}{" "}
                    <span className="text-xs font-normal text-gray-600">
                      ({notif.status})
                    </span>
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} /> {new Date(notif.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">
            Close
          </button>
        </div>
      </div>
     </aside>
    
   
  );
}
