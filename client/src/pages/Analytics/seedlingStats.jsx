import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Droplets, TrendingUp, Sprout, X } from "lucide-react";

const seedlingGrowthData = [
  { week: "Week 1", count: 120 },
  { week: "Week 2", count: 145 },
  { week: "Week 3", count: 168 },
  { week: "Week 4", count: 192 },
];

export const SeedlingStats = ({ batchTotal, averageReadingsBySensor,growthOvertime}) => {

  // Safe totals with optional chaining and default to 0
  const total_grown = batchTotal?.total_grown ?? 0;
  const total_dead = batchTotal?.total_dead ?? 0;
  const total_replanted = batchTotal?.total_replanted ?? 0;

  // Use total_seedlings as denominator to match DB logic
  const total = batchTotal?.total_seedlings ?? 0;

  const statusData = [
    {
      name: "Grown",
      value: total ? parseFloat(((total_grown / total) * 100).toFixed(1)) : 0,
      color: "#10b981",
    },
    {
      name: "Dead",
      value: total ? parseFloat(((total_dead / total) * 100).toFixed(1)) : 0,
      color: "#ef4444",
    },
    {
      name: "Replanted",
      value: total ? parseFloat(((total_replanted / total) * 100).toFixed(1)) : 0,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-3">


      
      {/* Seedling Growth Over Time */}
      <div className="col-span-8 row-span-7 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Seedling Growth Over Time
        </h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthOvertime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="grown" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="dead" stackId="a" fill="#ef4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="replanted" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Doughnut */}
      <div className="col-span-4 row-span-7 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Status Distribution
        </h3>
        <div className="relative flex-1 min-h-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center flex-col justify-start absolute">
            <p>Total</p>
            <p className="text-[var(--acc-darkc)] text-sm">{batchTotal?.total_seedlings ?? 0}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-1 mt-2">
          {statusData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700">
                {item.name}: {item.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="col-span-3 row-span-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-green-500 mb-2" />
        <span className="text-3xl font-bold text-gray-800">
          {batchTotal?.total_seedlings ?? 0}
        </span>
        <span className="text-sm text-gray-600 mt-1">Total Seedlings</span>
      </div>

      <div className="col-span-3 row-span-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <TrendingUp className="w-12 h-12 text-blue-500 mb-2" />
        <span className="text-3xl font-bold text-gray-800">
          {parseFloat(batchTotal?.growth_rate_percentage ?? 0).toFixed(1)}%
        </span>
        <span className="text-sm text-gray-600 mt-1">Growth This Week</span>
      </div>

      <div className="col-span-3 row-span-5 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <X className="w-12 h-12 text-red-500 mb-2" />
        <span className="text-3xl font-bold text-gray-800">
          {parseFloat(batchTotal?.death_rate_percentage ?? 0).toFixed(1)}%
        </span>
        <span className="text-sm text-gray-600 mt-1">Death Rate</span>
      </div>

      <div className="col-span-3 row-span-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <Droplets className="w-12 h-12 text-amber-500 mb-2" />
        <span className="text-3xl font-bold text-gray-800">
          {averageReadingsBySensor?.moisture.average ?? "--"}
        </span>
        <span className="text-sm text-gray-600 mt-1">Avg Moisture</span>
      </div>
    </div>
  );
};
