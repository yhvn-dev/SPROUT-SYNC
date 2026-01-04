import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Droplets } from "lucide-react";
import { useMemo } from "react";

// =====================
// STAT CARD
// =====================
const StatCard = ({ label, value, gradient, color }) => (
  <div
    className={`stat_card w-full h-full rounded-xl shadow-lg hover:shadow-xl transition-shadow
    flex flex-col items-center justify-center p-3 bg-gradient-to-tr ${gradient}`}>
    <p className="text-xs text-gray-500">{label}</p>
    <h2 className="text-3xl font-bold" style={{ color }}>
      {value ?? 0}
    </h2>
  </div>
);

// =====================
// OVERVIEW
// =====================
export const Overview = ({ batchTotal, moistureReadingsLast24h, averageReadingsBySensor,
}) => {

  console.log("MOISTURE READINGS LAST 24HR",moistureReadingsLast24h)

  // =====================
  // MOISTURE CHART DATA
  // =====================
  const moistureData = useMemo(() => {
    if (!moistureReadingsLast24h) return [];

    return moistureReadingsLast24h
      .filter((r) => r.sensor_type === "moisture")
      .map((reading) => {
        const date = new Date(reading.recorded_at);
        return {
          time: isNaN(date)
            ? "--"
            : date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          value: Number(reading.value) || 0,
        };
      });
  }, [moistureReadingsLast24h]);


  

  // =====================
  // AVERAGES
  // =====================
  const avgMoisture =
    averageReadingsBySensor?.moisture?.average ?? "--";

  const waterLevel =
    averageReadingsBySensor?.ultra_sonic?.average ?? "--";

  return (
    <div className="h-full grid md:grid-cols-12 md:grid-rows-12 gap-4">

      {/* =====================
          STAT CARDS
      ====================== */}
      <div
        className="gap-4 w-full grid grid-cols-2 md:grid-cols-5
        col-span-full row-start-1 row-end-4"
      >
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

        <StatCard
          label="Average Moisture (%)"
          value={avgMoisture}
          gradient="from-white to-blue-50"
          color="#027c68"
        />
      </div>




      {/* =====================
          MOISTURE LINE CHART
      ====================== */}
      <div className="conb  col-span-7 row-span-9 bg-white rounded-xl shadow-lg p-4 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Soil Moisture Trend (Last 24h)
        </h3>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#027c68"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* =====================
          WATER LEVEL GAUGE
      ====================== */}
      <div className="conb col-span-5 row-span-9 bg-white rounded-xl shadow-sm flex items-center justify-center p-6">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E8F3ED"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#027c68"
                strokeWidth="8"
                strokeDasharray={`${
                  (Number(waterLevel) / 100) * 282.7
                } 282.7`}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Droplets className="w-10 h-10 mb-2 text-[#027c68]" />
              <span className="text-4xl font-bold text-gray-800">
                {waterLevel}
              </span>
              <span className="text-sm text-gray-600">%</span>
            </div>
          </div>

          <p className="text-base font-semibold text-gray-800 mt-4">
            Water Level
          </p>
        </div>
      </div>
    </div>
  );
};
