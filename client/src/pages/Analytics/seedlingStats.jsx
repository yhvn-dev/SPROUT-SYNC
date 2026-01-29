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

// =====================
// SEEDLING STATS
// =====================
export const SeedlingStats = ({
  growthOvertime,
  batchHistoryTotal,
}) => {

  /* ================= SOURCE OF TRUTH ================= */
  const totals = batchHistoryTotal ?? {};

  const total_grown = totals?.total_grown ?? 0;
  const total_dead = totals?.total_dead ?? 0;
  const total_replanted = totals?.total_replanted ?? 0;
  const total = totals?.total_seedlings ?? 0;

  const statusData = [
    {
      name: "Grown",
      value: total ? +((total_grown / total) * 100).toFixed(1) : 0,
      color: "#027c68",
    },
    {
      name: "Dead",
      value: total ? +((total_dead / total) * 100).toFixed(1) : 0,
      color: "#ff6673",
    },
    {
      name: "Replanted",
      value: total ? +((total_replanted / total) * 100).toFixed(1) : 0,
      color: "#f0bd75",
    },
  ];

  /* ================= DARK MODE ================= */
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const axisColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "#374151" : "#e5e7eb";

  return (
    <div className="w-full h-full grid gap-4 md:grid-cols-[6fr_4fr] md:grid-rows-[2fr_1fr] overflow-x-hidden">

      {/* ================= GROWTH OVER TIME ================= */}
      <div className="conb col-span-full md:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Seedling Growth Over Time
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthOvertime}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />

              <XAxis
                dataKey="week"
                tick={{ fontSize: 11, fill: axisColor }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />

              <YAxis
                tick={{ fontSize: 11, fill: axisColor }}
                axisLine={{ stroke: axisColor }}
                tickLine={{ stroke: axisColor }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                  borderColor: gridColor,
                  color: axisColor,
                }}
                labelStyle={{ color: axisColor }}
                itemStyle={{ color: axisColor }}
              />

              <Bar dataKey="grown" stackId="a" fill="#027c68" />
              <Bar dataKey="dead" stackId="a" fill="#ff6673" />
              <Bar dataKey="replanted" stackId="a" fill="#f0bd75" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= STATUS DISTRIBUTION ================= */}
      <div className="conb col-span-full md:col-span-1 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
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

              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  backgroundColor: isDark ? "#111827" : "#ffffff",
                  borderColor: gridColor,
                  color: axisColor,
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute flex flex-col items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {total}
            </p>
          </div>
        </div>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="col-span-full grid grid-cols-2 md:grid-cols-4 gap-4">

        <StatCard
          icon={Sprout}
          value={total}
          label="Total Seedlings"
          gradient="from-blue-50 to-cyan-50"
          darkFrom="from-blue-800"
          darkTo="to-cyan-800"
          iconColor="text-green-500"
        />

        <StatCard
          icon={TrendingUp}
          value={total_grown}
          label="Total Grown"
          gradient="from-green-50 to-green-200"
          darkFrom="from-green-800"
          darkTo="to-green-600"
          iconColor="text-blue-500"
        />

        <StatCard
          icon={X}
          value={total_dead}
          label="Total Dead"
          gradient="from-red-50 to-pink-50"
          darkFrom="from-red-800"
          darkTo="to-pink-700"
          iconColor="text-red-500"
        />

        <StatCard
          icon={Droplets}
          value={total_replanted}
          label="Total Replanted"
          gradient="from-amber-50 to-orange-50"
          darkFrom="from-[var(--metal-dark4)]"
          darkTo="to-[var(--metal-dark1)]"
          iconColor="text-amber-500"
        />
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({
  icon: Icon,
  value,
  label,
  gradient,
  darkFrom,
  darkTo,
  iconColor,
}) => (
  <div
    className={`stat_card bg-gradient-to-br ${gradient}
      ${darkFrom ? `dark:${darkFrom}` : ""}
      ${darkTo ? `dark:${darkTo}` : ""}
      rounded-xl shadow-sm hover:shadow-md transition-shadow
      p-4 flex flex-col items-center justify-center`}
  >
    <Icon className={`w-12 h-12 mb-2 ${iconColor} dark:text-white`} />
    <span className="text-3xl font-bold text-gray-800 dark:text-gray-200">
      {value}
    </span>
    <span className="text-sm text-gray-600 mt-1 dark:text-gray-400">
      {label}
    </span>
  </div>
);
