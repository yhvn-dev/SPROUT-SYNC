import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Droplets, CircleQuestionMark,Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import InfosModal from "../../components/infosModal";

// =====================
// STAT CARD
// =====================
const StatCard = ({ label, value, gradient, color }) => (
  <div
    className={`stat_card w-full h-full rounded-xl shadow-lg hover:shadow-xl transition-shadow
    flex flex-col items-center justify-center p-3 bg-gradient-to-tr ${gradient}
    dark:from-gray-900 dark:to-gray-800`}
  >
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <h2 className="text-3xl font-bold" style={{ color }}>
      {value ?? 0}
    </h2>
  </div>
);

// =====================
// OVERVIEW
// =====================
export const Overview = ({ batchTotal,averageReadingsBySensor,setModalOpen}) => {
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPurpose, setInfoModalPurpose] = useState("");

  // =====================
  // DARK MODE DETECTION
  // =====================
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const axisColor = isDark ? "#e5e7eb" : "#374151"; // gray-200 / gray-700

  // =====================
  // AVERAGES
  // =====================
  const avgMoisture = averageReadingsBySensor?.moisture?.average ?? 0;
  const waterLevel = averageReadingsBySensor?.ultra_sonic?.average ?? 0;
  const avgMoistureData = [{ sensor: "Moisture", average: Number(avgMoisture) }];

  const handleOpenInfosModalWaterLevel = () => {
    setInfoModalPurpose("water_level");
    setInfoModalOpen(true);
  };

  const handleOpenDeleteModal = () =>{
     setModalOpen(true)
  }
  return (
    <div className="h-full grid md:grid-cols-12 md:grid-rows- gap-4">

      <div
        className="w-full col-start-1 col-span-7 md:col-span-full grid grid-cols-1 gap-4 md:grid-cols-4
         row-start-1">
        <StatCard
          label="Active Total Seedlings"
          value={batchTotal?.total_seedlings}
          gradient="from-white via-green-100 to-blue-50"
          color="#25a244"
        />

        <StatCard
          label="Active Grown"
          value={batchTotal?.total_grown}
          gradient="from-white to-green-50"
          color="var(--color-success-a)"
        />

        <StatCard
          label="Active Dead"
          value={batchTotal?.total_dead}
          gradient="from-white to-red-50"
          color="var(--color-danger-a)"
        />

        <StatCard
          label="Active Replanted"
          value={batchTotal?.total_replanted}
          gradient="from-white to-orange-50"
          color="var(--color-warning)"
        />
      </div>

      {/* =====================
        MOISTURE LINE / BAR CHART
      ====================== */}
      <div className="moisture_div col-span-7 py-2 row-span-9 bg-white dark:bg-gray-900 rounded-xl shadow-lg px-6 flex flex-col items-start justify-start gap-4">
        <div className="flex my-4 items-center justify-between w-full">
          <p className="font-semibold my-2">Average Moisture (%)</p>      
          <button onClick={handleOpenDeleteModal} className=" 
          flex text-sm cursor-pointer bg-[var(--sancga)] rounded-2xl shadow-lg 
          px-4 py-2 text-[var(--main-white)] hover:bg-[var(--sancgb)]">
          <Trash2 className="trash_logo w-4 h-4 mr-2 my-[1px] "/>
            Clear Readings</button>    
        </div>




          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={avgMoistureData}>
              <XAxis dataKey="sensor" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#1f2937" : "#fff",
                  borderColor: isDark ? "#4b5563" : "#ccc",
                  color: "#000"
                }}
              />
             <Bar dataKey="average" fill={isDark ? "#60a5fa" : "#3d56a4"} barSize={40} />
            </BarChart>
          </ResponsiveContainer>

      </div>



      {/* =====================
          WATER LEVEL GAUGE
      ====================== */}
      <div className="relative conb col-span-7 md:col-span-5 row-span-9 bg-white dark:bg-gray-900 rounded-xl shadow-sm flex items-center justify-center p-6">
        <button className="mx-4">
          <CircleQuestionMark onClick={handleOpenInfosModalWaterLevel}
            className="absolute top-4 left-4 mr-4 w-4 h-4 cursor-pointer"
          />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isDark ? "#3d56a4" : "#E8F3ED"}
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3d56a4"
                strokeWidth="8"
                strokeDasharray={`${(Number(waterLevel) / 100) * 282.7} 282.7`}
                strokeLinecap="round"
              />
            </svg>



            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-10 h-10 mb-2 text-[#3d56a4]" />
              <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                {waterLevel}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
            </div>
          </div>

          <p className="text-base font-semibold text-gray-800 dark:text-gray-100 mt-4">
            Water Level
          </p>

          
        </div>
      </div>


      {isInfoModalOpen && (
        <InfosModal
          isInfosModalOpen={isInfoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          purpose={infoModalPurpose}
        />
      )}

      
    </div>
  );
};
