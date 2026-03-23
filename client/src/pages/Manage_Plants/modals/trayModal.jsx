import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Sprout, TrendingUp, Trash2, Grid3x3} from "lucide-react";
import * as trayModels from "../../../data/traysServices";

export function TrayModal({
  isOpen,
  onClose,
  trayModalMode,
  selectedTrayGroup,
  selectedTray,
  setSuccessMsg,
  reloadTray,
  reloadBatches,
  trayGroups, 
}) {
  const [formData, setFormData] = useState({ tray_group_id: 0, plant: "", status: "Available" });
  const [formErrors, setFormErrors] = useState({});

  
  // ✅ FIX: for insert, use selectedTrayGroup. For update/delete,
  const resolvedGroup =
    trayModalMode === "insert"
      ? selectedTrayGroup
      : (trayGroups || []).find(
          (g) => g.tray_group_id === selectedTray?.tray_group_id
        );

  const resolvedGroupId = resolvedGroup?.tray_group_id;
  const resolvedGroupName = resolvedGroup?.tray_group_name ?? "Unknown";

  useEffect(() => {
    if (!isOpen) return;
    if (trayModalMode === "update" && selectedTray) {
      setFormData({
        tray_group_id: selectedTray.tray_group_id,
        plant: selectedTray.plant,
        status: selectedTray.status || "Available",
      });
    } else if (trayModalMode === "insert") {
      setFormData({
        tray_group_id: resolvedGroupId || 0,
        plant: resolvedGroupName !== "Unknown" ? resolvedGroupName : "",
        status: "Available",
      });
    } else if (trayModalMode === "delete" && selectedTray) {
      setFormData({
        tray_group_id: selectedTray.tray_group_id,
        plant: selectedTray.plant,
        status: selectedTray.status,
      });
    }
  }, [trayModalMode, selectedTray, selectedTrayGroup, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (trayModalMode === "insert") {
        const newTray = await trayModels.insertTray({
          tray_group_id: resolvedGroupId,
          plant: formData.plant,
          status: formData.status,
        });
        setFormErrors({});
        setSuccessMsg(`${newTray.plant} Tray Added`);
      }
      if (trayModalMode === "update") {
        const updatedTray = await trayModels.updateTray(
          {
            tray_group_id: resolvedGroupId,
            plant: formData.plant,
            status: formData.status,
          },
          selectedTray.tray_id
        );
        setFormErrors({});
        setSuccessMsg(`${updatedTray.plant} Tray Updated`);
      }
      if (trayModalMode === "delete") {
        await trayModels.deleteTray(selectedTray.tray_id);
        setFormErrors({});
        setSuccessMsg(`${selectedTray.plant} Tray Deleted`);
      }
      reloadTray();
      reloadBatches();
      onClose();
    } catch (error) {
      const rawErrors = error?.response?.data?.errors;
      if (Array.isArray(rawErrors)) {
        const formattedErrors = rawErrors.reduce((acc, err) => {
          acc[err.path] = err.msg;
          return acc;
        }, {});
        setFormErrors(formattedErrors);
      } else {
        setFormErrors({ general: "Something went wrong." });
      }
    }
  };

  return (
    <motion.div
      className="tray_modal fixed inset-0 bg-transparent backdrop-blur-2xl flex items-center justify-center p-4 z-50">
      <motion.div
        className={`conb bg-white rounded-2xl shadow-2xl ${trayModalMode === "delete" ? "w-[450px] h-[250px]" : "w-[750px]"} overflow-hidden flex flex-col`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}>

        {/* HEADER */}
        <header className={`tray_modal_header px-6 py-5 flex items-center justify-between 
            ${trayModalMode === "insert" ? "bg-[#E8F3ED]" :
             trayModalMode === "update" ?
            "bg-[var(--main-white)]" :
            "bg-[var(--color-danger-c)]"}`}>

          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${trayModalMode === "delete" ? "bg-[var(--color-danger-a)]" : "bg-[var(--ptl-greenh)]"}`}>
              {trayModalMode === "delete" ?
              <Trash2 className="w-5 h-5 text-white" /> :
              <Grid3x3 className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--metal-dark5)]">
                {trayModalMode === "delete" ? "Delete Tray" : trayModalMode === "insert" ? "Add New Tray" : "Update Tray"}
              </h2>
              <p className="text-sm text-[var(--acc-darkc)]">
                {trayModalMode === "delete"
                  ? `Are you sure you want to delete ${selectedTray?.plant}?`
                  : `Tray group: ${resolvedGroupName}`}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="cursor-pointer close_button p-2 rounded-lg hover:bg-gray-100">
            <X size={24} />
          </button>
        </header>

        {/* DELETE MODE */}
        {trayModalMode === "delete" ? (
          <>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600">Delete <b>{selectedTray?.plant}</b> tray?</p>
            </div>
            <form onSubmit={handleSubmit} className="flex justify-end gap-3 p-6">
              <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" className="cursor-pointer px-4 py-2 rounded-lg bg-[var(--color-danger-a)] hover:bg-red-500 text-white">Delete</button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <input type="hidden" name="tray_group_id" value={formData.tray_group_id} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* PLANT (auto-filled) */}
              <div className="md:col-span-2 border-2 border-[#C4DED0] text-[#5A8F73] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm text-[var(--sancgb)] font-semibold mb-2">
                  <Sprout className="w-4 h-4" /> Plant *
                </label>
                <input
                  type="text"
                  name="plant"
                  value={formData.plant}
                  disabled
                  className="w-full px-3 py-2 border-2 border-[#C4DED0] text-[#5A8F73] rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* STATUS */}
              <div className="border-2 border-[#C4DED0] text-[#5A8F73] rounded-xl p-4">
                <label className="flex items-center gap-2 text-sm text-[var(--sancgb)] font-semibold mb-2">
                  <TrendingUp className="w-4 h-4" /> Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-[#C4DED0] text-[#5A8F73] rounded-lg bg-white">
                  <option value="">Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                {formErrors.status && (
                  <p className="text-sm text-[var(--color-danger-a)] mt-1">
                    {formErrors.status}
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t border-[#C4DED0] py-4 flex justify-between">
              <span className="text-sm text-gray-500">* Required fields</span>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  type="button"
                  className="cursor-pointer px-4 py-2 text-sm rounded-lg font-medium 
                  transition-colors border-2 border-[#C4DED0] text-[#5A8F73] 
                  hover:bg-[var(--main-white)]">
                  Cancel
                </button>
                <button type="submit"
                  className={`cursor-pointer px-5 py-2.5 text-white rounded-lg font-medium shadow-lg transition-all ${trayModalMode === "insert" ? "bg-[var(--sancgb)] hover:bg-[var(--ptl-greenf)]" : "bg-[var(--purpluish--)] hover:bg-[var(--bluis--)]"}`}>
                  {trayModalMode === "insert" ? "Create Tray" : "Update Tray"}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}