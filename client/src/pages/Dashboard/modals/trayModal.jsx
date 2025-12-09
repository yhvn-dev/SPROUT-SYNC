import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Trash2, Sprout } from "lucide-react";

export function TrayModal({isOpen,onClose,trayModalMode,trayData}) {
  if (!isOpen) return null;

  const [tray_group_id, setTrayGroupId] = useState("");
  const [plant, setPlant] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (trayData &&  trayModalMode === "update") {
      setTrayGroupId(trayData.tray_group_id || "");
      setPlant(trayData.plant || "");
      setStatus(trayData.status || "Active");
    }
    if (trayModalMode === "insert") {
      setTrayGroupId("");
      setPlant("");
      setStatus("Active");
    }
  }, [trayData, trayModalMode]);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      tray_group_id: parseInt(tray_group_id),
      plant,
      status,
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* DELETE MODE */}
        {trayModalMode === "delete" ? (
          <>
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Delete Tray
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {trayData?.plant || "this tray"}
              </span>
              ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(trayData)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-100 rounded-xl">
                <Sprout className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">
                {trayModalMode === "insert" ? "Add Tray" : "Update Tray"}
              </h2>
            </div>

            {/* FORM */}
            <div className="space-y-4">
        

              {/* Plant */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Name
                </label>
                <input
                  type="text"
                  value={plant}
                  onChange={(e) => setPlant(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g., Lettuce, Tomato, Basil"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Harvested">Harvested</option>
                </select>
              </div>

              {/* BUTTON */}
              <button
                onClick={onFormSubmit}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                {trayModalMode === "insert" ? "Insert Tray" : "Save Changes"}
              </button>
            </div>
          </>
        )}

        
      </motion.div>
    </motion.div>
  );
}