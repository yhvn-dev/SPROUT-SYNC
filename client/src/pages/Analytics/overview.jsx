import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  Droplets,
  AlertTriangle
} from "lucide-react";

import { usePlantData } from "../../hooks/plantContext";
import { useEffect } from "react";

/* =======================
   SAMPLE CHART DATA
======================= */
const moistureData = [
  { time: "00:00", value: 45 },
  { time: "04:00", value: 42 },
  { time: "08:00", value: 65 },
  { time: "12:00", value: 58 },
  { time: "16:00", value: 52 },
  { time: "20:00", value: 48 },
  { time: "24:00", value: 44 }
];

/* =======================
   GAUGE COMPONENT
======================= */
const GaugeChart = ({ value, max, label, unit, icon: Icon, color }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.827} 282.7`}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-6 h-6 mb-1" style={{ color }} />
          <span className="text-xl font-bold text-[#003333]">{value}</span>
          <span className="text-xs text-[#5A8F73]">{unit}</span>
        </div>
      </div>

      <p className="text-sm text-[#003333] mt-3 font-medium">{label}</p>
    </div>
  );
};

/* =======================
   ALERT ITEM COMPONENT
======================= */
const AlertItem = ({ type, message, time }) => {
  const colors = {
    warning: { bg: "#fff3cd", border: "#ffc107", text: "#856404" },
    error: { bg: "#f8d7da", border: "#dc3545", text: "#721c24" },
    success: { bg: "#d4edda", border: "#28a745", text: "#155724" }
  };

  const color = colors[type] || colors.warning;

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg mb-2"
      style={{ backgroundColor: color.bg, borderLeft: `3px solid ${color.border}` }}
    >
      <AlertTriangle className="w-4 h-4 mt-0.5" style={{ color: color.border }} />
      <div className="flex-1">
        <p className="text-xs font-medium" style={{ color: color.text }}>
          {message}
        </p>
        <p className="text-xs mt-1 opacity-70" style={{ color: color.text }}>
          {time}
        </p>
      </div>
    </div>
  );
};

/* =======================
   TIME FORMATTER
======================= */
const formatTimeAgo = (dateString) => {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 60000);

  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} min ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;
  return `${Math.floor(diff / 1440)} days ago`;
};

/* =======================
   MAIN COMPONENT
======================= */
export function Overview() {
  const { notifs, loadNotifs } = usePlantData();

  useEffect(() => {
    loadNotifs();
  }, [loadNotifs]);

  return (
    <div className="grid grid-cols-8 grid-rows-[1fr_2fr] gap-4 row-span-full">

      {/* ===== GAUGES ===== */}
      <div className="col-span-full grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <GaugeChart value={48} max={100} label="Moisture" unit="%" icon={Droplets} color="#027c68"/>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <GaugeChart value={6.8} max={14} label="Water Level" unit="" icon={Droplets} color="#8f9bbc"/>
        </div>
      </div>



      {/* ===== MOISTURE CHART ===== */}
      <div className="col-start-1 col-end-6 row-start-2 bg-white rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-semibold text-[#003333] mb-4">
          Soil Moisture Trend
        </h3>

        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={moistureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8F3ED" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#027c68"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>




      {/* ===== ALERTS ===== */}
      <div className="col-start-6 col-span-full bg-white rounded-2xl p-5 shadow-lg overflow-y-auto">
        <h3 className="text-sm font-semibold text-[#003333] mb-4">
          Recent Alerts
        </h3>

        {notifs?.length > 0 ? (
          notifs.map((notif) => (
            
            <AlertItem
              key={notif.notification_id}
              type={notif.type}      
              message={notif.message}
              time={formatTimeAgo(notif.created_at)}
            />
          ))

        ) : (
          <p className="text-xs text-gray-400">No alerts available</p>
        )}
      </div>



    </div>
  );
}
