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

export const SeedlingStats = ({
  batchTotal,
  averageReadingsBySensor,
  growthOvertime,
}) => {
  const total_grown = batchTotal?.total_grown ?? 0;
  const total_dead = batchTotal?.total_dead ?? 0;
  const total_replanted = batchTotal?.total_replanted ?? 0;
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
      value: total
        ? parseFloat(((total_replanted / total) * 100).toFixed(1))
        : 0,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="w-full h-full grid gap-4 md:grid-cols-[6fr_4fr] md:grid-rows-[2fr_1fr] overflow-x-hidden">
      {/* ================= GROWTH OVER TIME ================= */}
      <div className="col-span-full md:col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
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
              <Bar dataKey="grown" stackId="a" fill="#10b981" />
              <Bar dataKey="dead" stackId="a" fill="#ef4444" />
              <Bar dataKey="replanted" stackId="a" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= STATUS DISTRIBUTION ================= */}
      <div className="col-span-full md:col-span-1 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
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
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute flex flex-col items-center">
            <p className="text-xs text-gray-500">Total</p>
            <p className="text-sm font-semibold text-[var(--acc-darkc)]">
              {batchTotal?.total_seedlings ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Sprout}
          value={batchTotal?.total_seedlings ?? 0}
          label="Total Seedlings"
          gradient="from-green-50 to-emerald-50"
          iconColor="text-green-500"
        />

        <StatCard
          icon={TrendingUp}
          value={`${parseFloat(batchTotal?.growth_rate_percentage ?? 0).toFixed(1)}%`}
          label="Growth This Week"
          gradient="from-blue-50 to-cyan-50"
          iconColor="text-blue-500"
        />

        <StatCard
          icon={X}
          value={`${parseFloat(batchTotal?.death_rate_percentage ?? 0).toFixed(1)}%`}
          label="Death Rate"
          gradient="from-red-50 to-pink-50"
          iconColor="text-red-500"
        />

        <StatCard
          icon={Droplets}
          value={averageReadingsBySensor?.moisture?.average ?? "--"}
          label="Avg Moisture"
          gradient="from-amber-50 to-orange-50"
          iconColor="text-amber-500"
        />
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ icon: Icon, value, label, gradient, iconColor }) => (
  <div
    className={`bg-gradient-to-br ${gradient} rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center justify-center`}
  >
    <Icon className={`w-12 h-12 mb-2 ${iconColor}`} />
    <span className="text-3xl font-bold text-gray-800">{value}</span>
    <span className="text-sm text-gray-600 mt-1">{label}</span>
  </div>
);
