import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sprout, Trash2, AlertTriangle, Leaf } from "lucide-react";
import * as plantModels from "../../../data/plantServices";

export function PlantGroupsModal({isOpen, onClose, plantModalMode, selectedPlantGroup, selectedPlant, setSuccessMsg, reloadPlants, plants}) {
  const [formData, setFormData] = useState({
    selected_plant_id: null,
    group_id: 0,
    name: "",
    moisture_min: "",
    moisture_max: "",
    reference_link: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (plantModalMode === "insert_for_groups") {
      // ✅ Reset lang — user pipili pa sa dropdown
      setFormData({
        selected_plant_id: null,
        group_id: selectedPlantGroup?.plant_group_id || 0,
        name: "",
        moisture_min: "",
        moisture_max: "",
        reference_link: "",
      });

    } else if (plantModalMode === "update_for_groups" && selectedPlant) {
      setFormData({
        selected_plant_id: selectedPlant.plant_id,
        group_id: selectedPlant.group_id || 0,
        name: selectedPlant.name,
        moisture_min: selectedPlant.moisture_min,
        moisture_max: selectedPlant.moisture_max,
        reference_link: selectedPlant.reference_link,
      });

    } else if (plantModalMode === "delete_for_groups" && selectedPlant) {
      setFormData({
        selected_plant_id: selectedPlant.plant_id,
        group_id: selectedPlant.group_id,
        name: selectedPlant.name,
        moisture_min: selectedPlant.moisture_min,
        moisture_max: selectedPlant.moisture_max,
        reference_link: selectedPlant.reference_link,
      });
    }

    setFormErrors({});
  }, [isOpen, plantModalMode, selectedPlant?.plant_id, selectedPlantGroup?.plant_group_id]);

  // ✅ Para sa insert — pipili ng plant sa dropdown, auto-fill lahat
  const handlePlantSelect = (e) => {
    const chosen = plants?.find(p => p.plant_id === Number(e.target.value));
    if (!chosen) return;
    setFormData({
      selected_plant_id: chosen.plant_id,
      group_id: selectedPlantGroup?.plant_group_id || 0,
      name: chosen.name,
      moisture_min: chosen.moisture_min,
      moisture_max: chosen.moisture_max,
      reference_link: chosen.reference_link,
    });
  };

  // ✅ Para sa update — manual edit ng fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (plantModalMode === "insert_for_groups") {
        // ✅ Assign plant sa group — updatePlant gamit ang selected_plant_id
        await plantModels.updatePlant(formData.selected_plant_id, {
          group_id: selectedPlantGroup?.plant_group_id,
          name: formData.name,
          moisture_min: Number(formData.moisture_min),
          moisture_max: Number(formData.moisture_max),
          reference_link: formData.reference_link,
        });
        setFormErrors({});
        setSuccessMsg(`${formData.name} assigned to ${selectedPlantGroup?.group_name}`);
      }

      if (plantModalMode === "update_for_groups") {
        // ✅ Update existing plant sa group
        await plantModels.updatePlant(selectedPlant.plant_id, {
          group_id: selectedPlant.group_id,
          name: formData.name,
          moisture_min: Number(formData.moisture_min),
          moisture_max: Number(formData.moisture_max),
          reference_link: formData.reference_link,
        });
        setFormErrors({});
        setSuccessMsg(`${formData.name} Plant Updated`);
      }

      if (plantModalMode === "delete_for_groups") {
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

  const isDelete = plantModalMode === "delete_for_groups";
  const isInsert = plantModalMode === "insert_for_groups";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal Wrapper */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">

            <div className={`pointer-events-auto w-full bg-white rounded-2xl overflow-hidden shadow-2xl ${isDelete ? "max-w-md" : "max-w-lg"}`}>

              {/* HEADER */}
              <div className={`conb flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-800/60 ${
                isDelete
                  ? "bg-gradient-to-br from-[var(--color-danger-c)] to-[var(--color-danger-a)]"
                  : "bg-gradient-to-br from-[var(--sancga)] to-[var(--sancgb)]"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDelete
                      ? "bg-red-500/10 border border-red-500/25"
                      : "bg-white-500/10 border border-green-500/25"
                  }`}>
                    {isDelete
                      ? <Trash2 size={18} className="text-red-400" />
                      : <Sprout size={18} className="text-green-400" />}
                  </div>
                  <div>
                    <h2 className={`text-sm font-semibold ${isDelete ? "text-[var(--metal-dark5)]" : "text-white"} tracking-tight`}>
                      {isDelete ? "Delete Plant" : isInsert ? "Assign Plant to Group" : "Update Plant"}
                    </h2>
                    <p className="plant_group_name text-xs text-gray-500 mt-0.5">
                      {isDelete
                        ? `Removing: ${selectedPlant?.name}`
                        : `Group: ${selectedPlantGroup?.group_name || selectedPlant?.group_name || "—"}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 cursor-pointer flex items-center justify-center rounded-lg text-gray-500 hover:bg-white/10 hover:text-gray-200 transition-colors shrink-0">
                  <X size={15} />
                </button>
              </div>

              {/* DELETE MODE */}
              {isDelete ? (
                <div className="conb p-6">
                  <div className="flex gap-3 items-start bg-red-500/8 border border-red-500/20 rounded-xl p-4 mb-6">
                    <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300 leading-relaxed">
                      <span className="font-semibold text-red-400">{selectedPlant?.name}</span> will be
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
                <form onSubmit={handleSubmit} className="conb bg-[var(--main-white)] p-4">
                  <div className="px-6 pt-5 pb-1 space-y-4">

                    <FieldGroup label="Plant Name" required icon={<Leaf size={12} />} error={formErrors.name}>
                        <select
                          value={formData.selected_plant_id || ""}
                          onChange={handlePlantSelect}
                          className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors focus:border-green-500 bg-white ${
                            formErrors.name ? "border-red-500" : "border-gray-700"
                          }`}>
                          <option value="">-- Select a Plant --</option>
                          {plants?.map((plant) => (
                            <option key={plant.plant_id} value={plant.plant_id}>
                              {plant.name}
                            </option>
                          ))}
                        </select>
                    </FieldGroup>

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

                    <div className="flex items-center justify-end gap-4 my-4">
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
                        {isInsert ? "Assign Plant" : "Save Changes"}
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