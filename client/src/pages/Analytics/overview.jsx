import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Droplets, AlertTriangle, Activity, TrendingUp, Sprout } from "lucide-react";
import { useEffect, useMemo } from "react"
import { usePlantData } from "../../hooks/plantContext";

// Gauge Component
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
          {Icon && <Icon className="w-4 h-4 mb-1" style={{ color }} />}
          <span className="text-xl font-bold text-gray-800">{value}</span>
          {unit && <span className="text-xs text-gray-600">{unit}</span>}
        </div>
      </div>
      <p className="text-xs text-gray-700 mt-2 font-medium text-center">{label}</p>
    </div>
  );
};

// Number/Stat Card Component
const StatCard = ({ label, value, color }) => (
  <div className={`bg-white rounded-xl  flex flex-col items-center justify-center p-4 `}>
    <p className="text-xs text-gray-500">{label}</p>
    <h2 className={`text-3xl font-bold`} style={{ color }}>{value}</h2>
  </div>
);


export const Overview = ({batchTotal,readings,moistureReadingsLast24h,averageReadingsBySensor}) => {

    const moistureData = useMemo(() => {
    if (!moistureReadingsLast24h) return [];

    return moistureReadingsLast24h
      .filter(r => r.sensor_type === "moisture") // optional, filter moisture sensors only
      .map((reading) => {
        const date = new Date(reading.recorded_at); // use recorded_at
        return {
          time: isNaN(date.getTime())
            ? "Invalid"
            : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          value: parseFloat(reading.value) || 0, // convert string to number
        };
      });
  }, [moistureReadingsLast24h]);
      
    return (
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-4">
      <div className="gap-4 flex items-start justify-evenly col-start-1 col-span-full row-start-1 row-end-4">
        
        {/* Alive % - Gauge */}
        <div className="flex-grow h-full  bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center p-3">
          <GaugeChart value={batchTotal.total_alive} max={100} label="Alive %" unit="%" icon={Droplets} color="#10b981" />
        </div>

          {/* TOTAL */}
          <div className="flex-grow h-full  bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center p-3">
              <StatCard label="Total Seedlings" value={batchTotal.total_seedlings} color="#25a244" />    
          </div>
          {/* GROWN */}
          <div className="flex-grow h-full  bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center p-3">
              <StatCard label="Grown" value={batchTotal.total_grown} color="var(--color-success-a)" />
         </div>
         
          {/* DEAD */}
          <div className="flex-grow h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center p-3">
            <StatCard label="Dead" value={batchTotal.total_dead} color="var(--color-danger-a)" />    
          </div>

          <div className="flex-grow h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center p-3">
              <StatCard label="Replanted" value={batchTotal.total_replanted}color="var(--color-warning)" />
          </div>    
      </div>


      {/* Moisture Chart */}
      <div className="col-span-7 row-span-9 bg-white rounded-xl shadow-lg hover:shadow-md transition-shadow p-4 flex flex-col">
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

      {/* Featured Large Gauge - Water Level */}
      <div className="col-span-5 row-span-9 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--white-blple--)"
                strokeWidth="8"
                strokeDasharray={`${(48 / 100) * 282.7} 282.7`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-10 h-10 mb-2" style={{ color: "var(--white-blple--)" }} />
              <span className="text-4xl font-bold text-gray-800">
                {averageReadingsBySensor?.ultra_sonic.average ?? "--"}       
              </span>
              <span className="text-lg text-gray-600">%</span>
            </div>
          </div>
          <p className="text-base font-semibold text-gray-800 mt-4">Water Level</p>
        </div>
      </div>


    </div>
  );
};
