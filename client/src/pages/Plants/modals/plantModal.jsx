import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Sprout, Trash2, AlertTriangle, Leaf, Droplets } from "lucide-react";
import * as plantModels from "../../../data/plantServices";

export function PlantModal({isOpen, onClose, plantModalMode, selectedPlant, setSuccessMsg, reloadPlants}) {
  const [formData, setFormData] = useState({
    name: "",
    moisture_min: "",
    moisture_max: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (plantModalMode === "update" && selectedPlant) {
      setFormData({
        name: selectedPlant.name,
        moisture_min: selectedPlant.moisture_min,
        moisture_max: selectedPlant.moisture_max,
      });
    } else if (plantModalMode === "insert") {
      setFormData({
        name: "",
        moisture_min: "",
        moisture_max: "",
      });
    } else if (plantModalMode === "delete" && selectedPlant) {
      setFormData({
        name: selectedPlant.name,
        moisture_min: selectedPlant.moisture_min,
        moisture_max: selectedPlant.moisture_max,
      });
    }
    setFormErrors({});
  }, [isOpen, plantModalMode, selectedPlant?.plant_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (plantModalMode === "insert") {
        await plantModels.createPlant({
          name: formData.name,
          moisture_min: Number(formData.moisture_min),
          moisture_max: Number(formData.moisture_max),
        });
        onClose();
        setFormErrors({});
        setSuccessMsg(`${formData.name} Plant Added`);
      }
      if (plantModalMode === "update") {
        await plantModels.updatePlant(selectedPlant.plant_id, {
          name: formData.name,
          moisture_min: Number(formData.moisture_min),
          moisture_max: Number(formData.moisture_max),
        });
        setFormErrors({});
        setSuccessMsg(`${selectedPlant.name} Plant Updated`);
      }
      if (plantModalMode === "delete") {
        await plantModels.deletePlant(selectedPlant.plant_id);
        setFormErrors({});
        setSuccessMsg(`${selectedPlant.name} Plant Deleted`);
      }
      onClose();
      reloadPlants();

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
    } finally {
      setIsLoading(false);
    }
  };

  const isDelete = plantModalMode === "delete";
  const isInsert = plantModalMode === "insert";
  const minVal = Number(formData.moisture_min) || 0;
  const maxVal = Number(formData.moisture_max) || 0;
  const barLeft = Math.min(minVal, 100);
  const barWidth = Math.max(0, Math.min(maxVal, 100) - Math.min(minVal, 100));


  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"/>

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">

            <div className={`pointer-events-auto w-full bg-white rounded-2xl overflow-hidden shadow-2xl ${isDelete ? "max-w-md" : "max-w-lg"}`}>

              {/* ── HEADER ── */}
              <div className={`conb flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-800/60 ${
                isDelete
                  ? "bg-gradient-to-br from-[var(--color-danger-b)] via-[var(--color-danger-b) to-[var(--color-danger-b)]"
                  : "bg-gradient-to-br from-[var(--sancga)] to-[var(--sancgb)]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDelete
                      ? "bg-red-500/10 border border-white"
                      : "bg-white-500/10 border border-green-500/25"
                  }`}>
                    {isDelete ? (
                      <Trash2 size={18} className="text-white" />
                    ) : (
                      <Sprout size={18} className="text-green-400" />
                    )}
                  </div>

                  
                  <div>
                    <h2 className={`text-sm font-semibold ${isDelete ? "text-[var(--metal-dark5)]" : "text-white"} tracking-tight`}>
                      {isDelete ? "Delete Plant" : isInsert ? "Add New Plant" : "Update Plant"}
                    </h2>
                    <p className="plant_group_name text-xs text-gray-500 mt-0.5">
                      {isDelete
                        ? `Removing: ${selectedPlant?.name}`
                        : `${selectedPlant?.group_name || "—"}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/10 hover:text-gray-200 transition-colors shrink-0">
                  <X size={15} />
                </button>
              </div>

              {/* ── DELETE MODE ── */}
              {isDelete ? (
                <div className="conb p-6">
                  <div className="flex gap-3 items-start bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-6">
                    <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm  text-red-500">
                      <span className="font-semibold text-[var(--color-danger-a)]">{selectedPlant?.name}</span> will be
                      permanently deleted. This action cannot be undone.
                    </p>
                  </div>
                  
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 border border-gray-700 hover:bg-white/5 transition-colors">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-red-600 to-red-700 border border-red-500/30 hover:opacity-85 transition-opacity">
                      <Trash2 size={14} />
                      Yes, Delete
                    </button>
                  </div>
                </div>

              ) : (

                <form onSubmit={handleSubmit} className="bg-white conb">
                  <div className="px-6 pt-5 pb-1 space-y-4">

                    {/* Plant Name */}
                    <FieldGroup label="Plant Name" required icon={<Leaf size={12} />} error={formErrors.name}>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Monstera Deliciosa"
                        className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 outline-none transition-colors focus:border-green-500 ${
                          formErrors.name ? "border-red-500" : "border-gray-700"
                        }`}
                      />
                    </FieldGroup>

                    {/* Moisture Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <FieldGroup label="Min Moisture %" required icon={<Droplets size={12} />} error={formErrors.moisture_min}>
                        <input
                          name="moisture_min"
                          type="number"
                          min={0}
                          max={100}
                          value={formData.moisture_min}
                          onChange={handleChange}
                          placeholder="0 (optional)"
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 outline-none transition-colors focus:border-green-500 ${
                            formErrors.moisture_min ? "border-red-500" : "border-gray-700"
                          }`}
                        />
                      </FieldGroup>
                      <FieldGroup label="Max Moisture %" required icon={<Droplets size={12} />} error={formErrors.moisture_max}>
                        <input
                          name="moisture_max"
                          type="number"
                          min={0}
                          max={100}
                          value={formData.moisture_max}
                          onChange={handleChange}
                          placeholder="100 (optional)"
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm placeholder-gray-600 outline-none transition-colors focus:border-green-500 ${
                            formErrors.moisture_max ? "border-red-500" : "border-gray-700"
                          }`}
                        />
                      </FieldGroup>
                    </div>

                    {/* Moisture Preview Bar */}
                    <div className="border border-gray-800 rounded-xl px-4 py-3">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] font-medium uppercase tracking-widest">
                          Moisture Range Preview
                        </span>
                        <span className="text-[11px] font-semibold text-green-400">
                          {minVal}% – {maxVal}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full overflow-hidden shadow-lg bg-[var(--main-white)]">
                        {[25, 50, 75].map((t) => (
                          <div
                            key={t}
                            className="absolute top-0 w-px h-full bg-white/5"
                            style={{ left: `${t}%` }}
                          />
                        ))}
                        <motion.div
                          animate={{ left: `${barLeft}%`, width: `${barWidth}%` }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="absolute top-0 h-full bg-gradient-to-r from-green-700 to-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                        />
                      </div>
                      <div className="flex justify-between mt-1.5 text-[10px] text-gray-600">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* General Error */}
                    <AnimatePresence>
                      {formErrors.general && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-2 bg-red-500/8 border border-red-500/20 rounded-lg px-3 py-2.5 text-sm text-red-300">
                          <AlertTriangle size={13} className="text-red-400 shrink-0" />
                          {formErrors.general}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between gap-3 px-6 py-4 mt-3 border-t border-gray-800/60">
                    <span className="text-[11px] text-gray-600">* Required fields</span>
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 border border-gray-700 hover:bg-white/5 transition-colors">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-green-700 to-green-500 border border-green-500/30 hover:opacity-85 transition-opacity min-w-[110px] justify-center">
                        <Sprout size={14} />
                        {isInsert ? "Add Plant" : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}




/* ── FieldGroup Sub-component ── */
function FieldGroup({ label, required, icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <span className="text-gray-500">{icon}</span>
        {label}
        {required && <span className="text-green-400">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1 text-[11px] text-red-400 mt-0.5">
            <AlertTriangle size={10} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  
}