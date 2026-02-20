// AnalyticsModal.jsx
import { motion } from "framer-motion";
import * as readingsService from "../../../data/readingsServices"

function AnalyticsModal({setScsMsg,setErrMsg,deleteModalMode, isModalOpen, onClose, reloadReadings}) {
  if (!isModalOpen) return null; 




    const handleSubmit = async () => {
      try {
        const sensorType = deleteModalMode === "moisture" ? "moisture" : "ultra_sonic";
        await readingsService.deleteAllReadingsByType(sensorType);

        setScsMsg("Sensor Readings Successfully Deleted");
        reloadReadings();

        // Close modal after a tiny delay
        setTimeout(() => {
          onClose();
        }, 100); 

      } catch (err) {
        if (err.response?.status === 404) {
          setErrMsg(`No readings to delete for ${sensorType} sensor`);
        } else {
          setErrMsg(err.response?.data?.message || "Something went wrong");
        }
        onClose();
      }
     };




  return (
    <motion.div 
      className="info_modal fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="conb bg-[var(--main-white)] rounded-2xl shadow-2xl max-w-lg w-full p-8 relative"
      >
        <div className="flex justify-between items-center mb-4 border-b py-4">
          <h2 className="text-xl font-semibold">Clear Sensor Readings</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:bg-gray-100 px-1 rounded-xl shadow-sm font-bold text-lg"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 text-gray-700 dark:text-gray-300">
          {deleteModalMode === "moisture" ? (
            <p>
              Deleting all moisture readings will free up space and improve performance. 
              Only clear data when no longer needed.
            </p>
          ) : (
            <p>
              Deleting all water level readings will free up space and improve performance. 
              However, users won’t be able to view current water level data.
            </p>
          )}

          <div className="flex gap-4 justify-end w-full mt-4">
            <button
              onClick={onClose}
              className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors text-white bg-[var(--color-danger-a)] hover:bg-red-500 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AnalyticsModal;
