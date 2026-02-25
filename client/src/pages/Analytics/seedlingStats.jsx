import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Droplets, TrendingUp, Sprout, X, CircleQuestionMark } from "lucide-react";
import { useState } from "react";

import InfosModal from "../../components/infosModal";

export const SeedlingStats = ({ activeTab, growthOvertime, batchHistoryTotal }) => {
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPurpose, setInfoModalPurpose] = useState("");

  // ================= SOURCE OF TRUTH =================
  const totals = batchHistoryTotal ?? {};
  const totalSeedlings = Number(totals?.total_seedlings ?? 0);
  const total_grown = Number(totals?.total_grown ?? 0);
  const total_dead = Number(totals?.total_dead ?? 0);
  const total_replanted = Number(totals?.total_replanted ?? 0);

  // Calculate percentages based on totalSeedlings
  const grownPercent = totalSeedlings ? +((total_grown / totalSeedlings) * 100).toFixed(1) : 0;
  const deadPercent = totalSeedlings ? +((total_dead / totalSeedlings) * 100).toFixed(1) : 0;
  const replantedPercent = totalSeedlings ? +((total_replanted / totalSeedlings) * 100).toFixed(1) : 0;

  const statusData = [
    { name: "Grown", value: grownPercent, color: "#027c68" },
    { name: "Dead", value: deadPercent, color: "#ff6673" },
    { name: "Replanted", value: replantedPercent, color: "#f0bd75" },
  ];

  const handleOpenInfosModalseedlingGrowthOvertime = () => {
    setInfoModalPurpose("seedling_growth_overtime");
    setInfoModalOpen(true);
  };

  const handleOpenInfosModalStatusDistribution = () => {
    setInfoModalPurpose("status_distribution");
    setInfoModalOpen(true);
  };

  // ================= DARK MODE =================
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const axisColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="w-full h-full grid gap-4 md:grid-cols-[6fr_4fr] md:grid-rows-[2fr_1fr] overflow-x-hidden">

      {/* ================= GROWTH OVER TIME ================= */}
      <div className="conb col-span-full md:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col h-[260px] sm:h-[300px] md:h-full">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center">
          Seedling Growth Over Time
          <button className="ml-2">
            <CircleQuestionMark onClick={handleOpenInfosModalseedlingGrowthOvertime} className="w-4 h-4 cursor-pointer text-gray-400 dark:text-gray-300"/>
          </button>
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthOvertime} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: axisColor }} axisLine={{ stroke: axisColor }} tickLine={{ stroke: axisColor }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={{ stroke: axisColor }} tickLine={{ stroke: axisColor }} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? "#111827" : "#ffffff", borderColor: gridColor, fontSize: "12px", borderRadius: "8px" }} labelStyle={{ color: axisColor }} itemStyle={{ color: axisColor }} />
              <Bar dataKey="grown" stackId="a" fill="#027c68" />
              <Bar dataKey="dead" stackId="a" fill="#ff6673" />
              <Bar dataKey="replanted" stackId="a" fill="#f0bd75" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= STATUS DISTRIBUTION ================= */}
      <div className="conb col-span-full md:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col h-[280px] sm:h-[320px]">
        <h3 className="flex text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 items-center">
          Status Distribution
          <button className="ml-2">
            <CircleQuestionMark onClick={handleOpenInfosModalStatusDistribution} className="w-4 h-4 cursor-pointer text-gray-400 dark:text-gray-300"/>
          </button>
        </h3>

        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4">
          <div className="relative w-full sm:w-1/2 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} contentStyle={{ backgroundColor: isDark ? "#111827" : "#ffffff", borderColor: gridColor, fontSize: "12px", borderRadius: "8px" }} />
              </PieChart>
            </ResponsiveContainer>

            {/* CENTER TOTAL */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{totalSeedlings}</p>
            </div>
          </div>

          {/* LEGENDS */}
          <div className="w-full sm:w-1/2 flex flex-col gap-2 text-xs">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700 dark:text-gray-300">{item.name}</span>
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-100">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat_card total_seedlings_div bg-gradient-to-br from-white via-green-100 to-blue-50 dark:from-gray-800 dark:via-green-700 dark:to-blue-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
          <Sprout className="stat_card_icon total_seedling_icon w-12 h-12 mb-2 text-green-600 dark:text-green-300" />
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{totalSeedlings}</span>
          <span className="text-sm text-gray-600 mt-1 dark:text-gray-400">Total Seedlings</span>
        </div>

        <div className="stat_card total_grown_div bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
          <TrendingUp className="total_growth_icon w-12 h-12 mb-2 text-green-500 dark:text-green-300" />
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{total_grown}</span>
          <span className="text-sm text-gray-600 mt-1 dark:text-gray-400">Total Grown</span>
        </div>

        <div className="stat_card dead_seedlings_div bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
          <X className="dead_seedlings_icon w-12 h-12 mb-2 text-red-500 dark:text-red-300" />
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{total_dead}</span>
          <span className="text-sm text-gray-600 mt-1 dark:text-gray-400">Dead Seedlings</span>
        </div>

        <div className="stat_card replanted_seedlings_div bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-700 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
          <Droplets className="stat_card_icon replanted_icon w-12 h-12 mb-2 text-amber-500 dark:text-amber-300" />
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">{total_replanted}</span>
          <span className="text-sm text-gray-600 mt-1 dark:text-gray-400">Replanted</span>
        </div>
      </div>

      {/* MODAL */}
      {isInfoModalOpen && (
        <InfosModal isInfosModalOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} purpose={infoModalPurpose} />
      )}
    </div>



  );
};