import { Droplets, CircleQuestionMark, Trash2 } from "lucide-react";
import InfosModal from "../../components/infosModal";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../hooks/userContext";

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
// MOISTURE PROGRESS BAR
// =====================
const MoistureProgressBar = ({ average, isDark }) => {
  const value = Math.min(Math.max(average, 0), 100);

  let status = "Dry";
  let barClass = "bg-red-500";

  if (value > 30 && value <= 60) {
    status = "Moist";
    barClass = "bg-yellow-400";
  } else if (value > 60) {
    status = "Wet";
    barClass = "bg-green-500";
  }

  return (
    <div className="flex flex-col items-start w-full">
      <p className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-200">
        {value}%
      </p>

      {/* Progress Bar Container */}
      <div
        className={`w-full h-4 rounded-full overflow-hidden ${
          isDark ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-full transition-all duration-500 ease-out ${barClass}`}
          style={{ width: `${value}%` }}
        />
      </div>

      {/* Status */}
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Status: <strong>{status}</strong>
      </p>
    </div>
  );
};

// =====================
// OVERVIEW COMPONENT
// =====================
export const Overview = ({
  setDeleteModalMode,
  batchTotal,
  averageReadingsBySensor,
  setModalOpen,
}) => {
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalPurpose, setInfoModalPurpose] = useState("");
  const { user } = useContext(UserContext);

  // =====================
  // DARK MODE DETECTION
  // =====================
  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");


  const avgMoisture =
    averageReadingsBySensor?.moisture?.average ?? 0;

  const waterLevel =
    averageReadingsBySensor?.ultra_sonic?.average ?? 0;

  
  // =====================
  // HANDLERS
  // =====================
  const handleOpenInfosModalWaterLevel = () => {
    setInfoModalPurpose("water_level");
    setInfoModalOpen(true);
  };
  const handleOpenDeleteMoistureModal = () => {
    setModalOpen(true);
    setDeleteModalMode("moisture");
  };
  const handleOpenDeleteWaterLevelModal = () => {
    setModalOpen(true);
    setDeleteModalMode("water_level");
  };


  
  return (
    <div className="h-full grid md:grid-cols-12 md:grid-rows- gap-4">
      {/* =====================
          STAT CARDS
      ====================== */}
      <div className="w-full col-start-1 row-end-8 col-span-7 md:col-span-full grid grid-cols-4 gap-4 md:grid-cols-4 row-start-1">
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
          MOISTURE PROGRESS BAR
      ====================== */}
      <div className="conb col-span-7 bg-white py-2 row-span-9 dark:bg-gray-900 rounded-xl shadow-lg px-6 flex flex-col items-start justify-start gap-4">
        <div className="flex my-4 items-center justify-between w-full">
          <p className="font-semibold my-2">Average Moisture (%)</p>
          {user.role === "admin" && (
            <button
              onClick={handleOpenDeleteMoistureModal}
              className="flex text-xs cursor-pointer bg-[var(--sancga)] rounded-2xl shadow-lg px-4 py-2 text-[var(--main-white)] hover:bg-[var(--sancgb)]"
            >
              <Trash2 className="trash_logo w-3 h-3 mr-2 my-[1px]" />
              Clear Readings
            </button>
          )}
        </div>

        <MoistureProgressBar average={avgMoisture} isDark={isDark} />
      </div>

      {/* =====================
          WATER LEVEL GAUGE
      ====================== */}
      <div className="relative flex-col conb col-span-7 md:col-span-5 row-span-9 bg-white dark:bg-gray-900 rounded-xl shadow-sm flex items-center justify-start p-6">
        <div className="flex items-center justify-between w-full h-auto">
          <button className="mx-4">
            <CircleQuestionMark
              onClick={handleOpenInfosModalWaterLevel}
              className="mr-4 w-4 h-4 cursor-pointer"
            />
          </button>

          {user.role === "admin" && (
            <button
              onClick={handleOpenDeleteWaterLevelModal}
              className="flex text-xs cursor-pointer bg-[var(--sancga)] rounded-2xl shadow-lg px-4 py-2 text-[var(--main-white)] hover:bg-[var(--sancgb)]"
            >
              <Trash2 className="trash_logo w-3 h-3 mr-2 my-[1px]" />
              Clear Readings
            </button>
          )}
        </div>

        <div className="flex flex-col justify-center items-center h-full">
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

      {/* =====================
          INFO MODAL
      ====================== */}
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
