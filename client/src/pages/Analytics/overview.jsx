import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Droplets, AlertTriangle, Menu, Bell, User, Search, TrendingUp, Sprout, Activity } from "lucide-react";



const GaugeChart = ({ value, max, label, unit, icon: Icon, color }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-20 h-20">
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
          <Icon className="w-4 h-4 mb-1" style={{ color }} />
          <span className="text-xl font-bold text-gray-800">{value}</span>
          <span className="text-xs text-gray-600">{unit}</span>
        </div>
      </div>
      <p className="text-xs text-gray-700 mt-2 font-medium text-center">{label}</p>
    </div>
  );
};


const moistureData = [
  { time: "00:00", value: 45 },
  { time: "04:00", value: 42 },
  { time: "08:00", value: 65 },
  { time: "12:00", value: 58 },
  { time: "16:00", value: 52 },
  { time: "20:00", value: 48 },
  { time: "24:00", value: 44 }
];


export const Overview = () => {
  return (

    
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-4 ">
      {/* Top Row - Small Gauge Cards */}
      <div className="col-span-2 row-span-3  bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center ">
        <GaugeChart value={48} max={100} label="Total" unit="%" icon={Sprout} color="#027c68"/>
      </div>

      <div className="col-span-2 row-span-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-3">
        <GaugeChart value={42} max={100} label="Alive" unit="%" icon={Droplets} color="#10b981"/>
      </div>

      <div className="col-span-2 row-span-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-3">
        <GaugeChart value={6} max={100} label="Dead" unit="%" icon={AlertTriangle} color="#ef4444"/>
      </div>

      <div className="col-span-2 row-span-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-3">
        <GaugeChart value={15} max={100} label="Replanted" unit="%" icon={Activity} color="#f59e0b"/>
      </div>

      <div className="col-span-2 row-span-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-3">
        <GaugeChart value={35} max={100} label="Grown" unit="%" icon={TrendingUp} color="#8b5cf6"/>
      </div>

      <div className="col-span-2 row-span-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-3">
        <GaugeChart value={6.8} max={14} label="Water" unit="L" icon={Droplets} color="#3b82f6"/>
      </div>

      {/* Moisture Chart */}
      <div className="col-span-7 row-span-9 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Soil Moisture Trend (24h)</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#027c68" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Featured Large Gauge */}
      <div className="col-span-5 row-span-9 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#027c68"
                strokeWidth="8"
                strokeDasharray={`${(48 / 100) * 282.7} 282.7`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-10 h-10 mb-2" style={{ color: "#027c68" }} />
              <span className="text-4xl font-bold text-gray-800">48</span>
              <span className="text-lg text-gray-600">%</span>
            </div>
          </div>
          <p className="text-base font-semibold text-gray-800 mt-4">Overall Health</p>
        </div>
      </div>
    </div>
    
  );
};
