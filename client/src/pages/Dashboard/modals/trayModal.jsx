import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { X, Sprout, TrendingUp, Package, Trash2 } from 'lucide-react';

import * as trayModels from "../../../data/traysServices";

export function TrayModal({ isOpen, onClose, trayModalMode, selectedTrayGroup, selectedTray, setSuccessMsg, reloadTray}) {
  const [formData, setFormData] = useState({ tray_group_id:0,plant: "", status: "" });
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  // Initialize modal values when opened
  useEffect(() => {
    if (trayModalMode === "update" && selectedTray) {
      setFormData({
        tray_group_id: selectedTrayGroup.tray_group_id || "",
        plant: selectedTray.plant || "",
        status: selectedTray.status || ""
      });
    } else if (trayModalMode === "insert") {
      setFormData({ tray_group_id: selectedTrayGroup.tray_group_id, plant: "", status: "" });
    } else if (trayModalMode === "delete" && selectedTray) {
      setFormData({
        tray_group_id: selectedTrayGroup.tray_group_id || "",
        plant: selectedTray.plant || "",
        status: selectedTray.status || ""
      });
    }
  }, [trayModalMode, isOpen, selectedTray]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (trayModalMode === "insert") {
        const payload = { ...formData, tray_group_id: selectedTrayGroup.tray_group_id };
        await trayModels.insertTray(payload);
        onClose();
        reloadTray()
        setSuccessMsg(`${formData.plant}'s Tray is Added`);
      } else if (trayModalMode === "update") {
        await trayModels.updateTray(formData, selectedTray.tray_id);
        onClose();
        reloadTray()
        setSuccessMsg(`${selectedTray.plant}'s Tray is Updated`);
      } else if (trayModalMode === "delete") {
        await trayModels.deleteTray(selectedTray.tray_id);
        onClose();
        reloadTray()
        setSuccessMsg(`${selectedTray.plant}'s Tray is Deleted`);
      }
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div className="fixed inset-0 bg-transparent backdrop-blur-2xl flex items-center justify-center p-4 z-50">
      <motion.div
        className={`bg-white rounded-2xl shadow-2xl ${trayModalMode === "delete" ? "w-[450px] h-[250px]" : "w-[750px]"} overflow-hidden flex flex-col`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >

        {/* HEADER */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${trayModalMode === "delete" ? "bg-red-600" : "bg-[var(--ptl-greenh)]"}`}>
              {trayModalMode === "delete" ? <Trash2 className="w-5 h-5 text-white" /> : <Package className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h2 className="text-[var(--metal-dark5)] text-xl font-bold">
                {trayModalMode === "delete" ? "Delete Tray" : trayModalMode === "insert" ? "Add New Tray" : "Update Tray"}
              </h2>
              <p className="text-[var(--acc-darkc)] text-sm">
                {trayModalMode === "delete"
                  ? `Are you sure you want to delete ${selectedTray?.plant}?`
                  : `Insert a tray inside the ${selectedTrayGroup?.tray_group_name}`}
              </p>
            </div>
          </div>



          <button
            onClick={onClose}
            className="cursor-pointer text-[var(--metal-dark5)] hover:text-[var(--metal-dark5)] hover:bg-gray-100 p-2 rounded-lg transition">
            <X size={24} />
          </button>
        </div>


        {/* CONTENT */}
        {trayModalMode === "delete" ? (
          <>
            <div className="px-6 py-4 flex-1 flex flex-col justify-center">
              <p className="text-gray-600 text-center">
                Are you sure you want to delete <b>{selectedTray.plant}</b>?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex justify-end gap-3 p-8">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer px-4 py-2 rounded-lg bg-[var(--color-danger-a)] text-white"
              >
                Delete
              </button>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* PLANT NAME */}
                  <input
                    type="text"
                    name="tray_group_id"
                    value={formData.tray_group_id}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Bok Choy"
                    className="hidden"/>
                    
                <div className="md:col-span-2 bg-white border border-[var(--sage-medium)] rounded-xl p-4 shadow-sm">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[var(--sancga)] mb-2">
                    <Sprout className="w-4 h-4 text-[var(--ptl-greenf)]" />
                    Plant Name *
                  </label>
                  <input
                    type="text"
                    name="plant"
                    value={formData.plant}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Bok Choy"
                    className="w-full px-3 py-2 border border-[var(--sage-medium)] rounded-lg focus:ring-2 focus:ring-[var(--ptl-greend)] outline-none"
                  />
                  <p className="text-sm text-[var(--color-danger-a)] mt-1">{formErrors.plant}</p>
                </div>

                {/* TRAY STATUS */}
                <div className="bg-white border border-[var(--sage-medium)] rounded-xl p-4 shadow-sm">
                  <label className="flex items-center gap-2 text-sm font-semibold text-[var(--sancga)] mb-2">
                    <TrendingUp className="w-4 h-4 text-[var(--ptl-greenf)]" />
                    Tray Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-[var(--sage-medium)] rounded-lg focus:ring-2 focus:ring-[var(--ptl-greend)] outline-none bg-white"
                  >
                    <option value="">Select Tray Status</option>
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Disabled">Disabled</option>
                  </select>
                  <p className="text-sm text-[var(--color-danger-a)] mt-1">{formErrors.status}</p>
                </div>
              </div>
            </form>

            {/* FOOTER */}
            <div className="border-t border-[var(--sage-medium)] px-6 py-4 bg-white flex items-center justify-between">
              {trayModalMode !== "delete" && <p className="text-sm text-[var(--sancga)]">* Required fields</p>}
              <div className="flex gap-3">
                <button
                  type="submit"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-[var(--sage-medium)] text-[var(--sancga)] rounded-lg hover:bg-[var(--sage-lighter)] font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-lg transition-all
                  ${trayModalMode === "insert" ? "bg-[var(--sancgb)] hover:bg-[var(--ptl-greenf)]" :
                    "bg-[var(--sancgb)] hover:bg-[var(--sancgd)]"
                  }`}>

                  {trayModalMode === "insert" ? "Create Tray" : "Update Tray"}
                </button>
              </div>
            </div>
          </>
        )}

      </motion.div>
    </motion.div>
  );
}
