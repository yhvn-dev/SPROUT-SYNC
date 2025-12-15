import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { Droplets ,TrendingUp, Sprout, Activity } from "lucide-react";


const seedlingGrowthData = [
  { week: "Week 1", count: 120 },
  { week: "Week 2", count: 145 },
  { week: "Week 3", count: 168 },
  { week: "Week 4", count: 192 },
];
const statusData = [
  { name: "Alive", value: 42, color: "#10b981" },
  { name: "Dead", value: 6, color: "#ef4444" },
  { name: "Replanted", value: 15, color: "#f59e0b" },
];

export const SeedlingStats = ({batchTotal,averageReadingsBySensor}) => {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-3">
      <div className="col-span-8 row-span-7 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Seedling Growth Over Time</h3>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={seedlingGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#027c68" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution Pie */}
      <div className="col-span-4 row-span-7 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Status Distribution</h3>
        <div className="flex-1 min-h-0 flex items-center justify-center">
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          {statusData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-gray-700">{item.name}: {item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="col-span-3 row-span-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <Sprout className="w-12 h-12 text-green-600 mb-2" />
        <span className="text-3xl font-bold text-gray-800">{batchTotal.total_seedlings}</span>
        <span className="text-sm text-gray-600 mt-1">Total Seedlings</span>
      </div>

      <div className="col-span-3 row-span-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <TrendingUp className="w-12 h-12 text-blue-600 mb-2" />
        <span className="text-3xl font-bold text-gray-800">+24</span>
        <span className="text-sm text-gray-600 mt-1">Growth This Week</span>
      </div>

      <div className="col-span-3 row-span-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 text-purple-600 mb-2" />
        <span className="text-3xl font-bold text-gray-800">87%</span>
        <span className="text-sm text-gray-600 mt-1">Survival Rate</span>
      </div>

      <div className="col-span-3 row-span-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center">
        <Droplets className="w-12 h-12 text-amber-600 mb-2" />
            <span className="text-3xl font-bold text-gray-800">
           {averageReadingsBySensor?.moisture.average ?? "--"}
        </span>
        <span className="text-sm text-gray-600 mt-1">Avg Moisture</span>
      </div>
    </div>

    
  );
};

