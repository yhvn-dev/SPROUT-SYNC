import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sprout, Trash2 } from "lucide-react";
import * as plantModels from "../../../data/plantServices";

export function PlantModal({
  isOpen,
  onClose,
  plantModalMode,
  selectedPlantGroup,
  selectedPlant,
  setSuccessMsg,
  reloadPlants,
}) {
  const [formData, setFormData] = useState({
    group_id: 0,        // ✅ renamed to match your DB field
    name: "",
    moisture_min: "",
    moisture_max: "",
    reference_link:""
  });
  const [formErrors, setFormErrors] = useState({});


  // ── Initialize form based on mode ──
  useEffect(() => {
    if (!isOpen) return;

    if (plantModalMode === "update" && selectedPlant) {
      setFormData({
        group_id: selectedPlant.group_id,           // ✅ correct field
        name: selectedPlant.name,
        moisture_min: selectedPlant.moisture_min,
        moisture_max: selectedPlant.moisture_max,
        reference_link:selectedPlant.reference_link,
      });
    } else if (plantModalMode === "insert") {
      console.log("SELECTED PLANT GROUP →", selectedPlantGroup);
      setFormData({
        group_id: selectedPlantGroup?.plant_group_id || 0,
        name: "",
        moisture_min: "",
        moisture_max: "",
        reference_link:""
      });
    } else if (plantModalMode === "delete" && selectedPlant) {
      setFormData({
        group_id: selectedPlant.group_id,         
        name: selectedPlant.name,
        moisture_min: selectedPlant.moisture_min,
        moisture_max: selectedPlant.moisture_max,
        reference_link:selectedPlant.reference_link
      });
    }
    setFormErrors({});
  }, [isOpen, plantModalMode, selectedPlant, selectedPlantGroup]);




  
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (plantModalMode === "insert") {
       const newPlant = await plantModels.createPlant({
        group_id: selectedPlantGroup.plant_group_id,
        name: formData.name,
        moisture_min: Number(formData.moisture_min),
        moisture_max: Number(formData.moisture_max),
        reference_link: formData.reference_link,
        });
        setFormErrors({});
        setSuccessMsg(`${newPlant.name} Plant Added`);
      }

      if (plantModalMode === "update") {
        const updatedPlant = await plantModels.updatePlant(
            selectedPlant.plant_id, 
            {
                group_id: selectedPlant.group_id,
                name: formData.name,
                moisture_min: Number(formData.moisture_min),
                moisture_max: Number(formData.moisture_max),
                reference_link: formData.reference_link,
            }
            );
        setFormErrors({});
        setSuccessMsg(`${updatedPlant.name} Plant Updated`);
      }

      if (plantModalMode === "delete") {
        await plantModels.deletePlant(selectedPlant.plant_id);
        setFormErrors({});
        setSuccessMsg(`${selectedPlant.name} Plant Deleted`);
      }

      reloadPlants();
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

  const isDelete = plantModalMode === "delete";
  const isInsert = plantModalMode === "insert";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-transparent backdrop-blur-2xl flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-white rounded-2xl shadow-2xl ${
              isDelete ? "w-[450px] h-[250px]" : "w-[750px]"
            } overflow-hidden flex flex-col`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── HEADER ── */}
            <header className="px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg ${
                    isDelete ? "bg-red-600" : "bg-emerald-600"
                  }`}
                >
                  {isDelete ? (
                    <Trash2 className="w-5 h-5 text-white" />
                  ) : (
                    <Sprout className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {isDelete
                      ? "Delete Plant"
                      : isInsert
                      ? "Add New Plant"
                      : "Update Plant"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isDelete
                      ? `Are you sure you want to delete ${selectedPlant?.name}?`
                      : `Plant group: ${
                          selectedPlantGroup?.group_name ||
                          selectedPlant?.group_name
                        }`}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            {/* ── DELETE MODE ── */}
            {isDelete ? (
              <>
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-600">
                    Delete <b>{selectedPlant?.name}</b> plant? This action
                    cannot be undone.
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex justify-end gap-3 p-6"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
                  >
                    Yes, Delete
                  </button>
                </form>
              </>
            ) : (
                
              /* ── INSERT / UPDATE MODE ── */
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* hidden group_id just for reference */}
                <input type="hidden" name="group_id" value={formData.group_id} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                  {/* PLANT NAME */}
                  <div className="md:col-span-3 border border-gray-100 rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Sprout className="w-4 h-4 text-emerald-500" />
                      Plant Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Bok Choy A"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>


                   {/* REFERENCE LINK */}
                  <div className="md:col-span-3 border border-gray-100 rounded-xl p-4">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Sprout className="w-4 h-4 text-emerald-500" />
                        Refrence Link
                    </label>
                    <input
                        type="text"
                        name="reference_link"
                        value={formData.reference_link}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                    />

                    {formErrors.reference_link && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.reference_link}
                      </p>
                    )}
                  </div>
                
                  {/* MIN MOISTURE */}
                  <div className="md:col-span-1 border border-gray-100 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Moisture % *
                    </label>
                    <input
                      type="number"
                      name="moisture_min"
                      value={formData.moisture_min}
                      onChange={handleChange}
                      placeholder="0"
                      min={0}
                      max={100}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                    {formErrors.moisture_min && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.moisture_min}
                      </p>
                    )}
                  </div>

                  {/* MAX MOISTURE */}
                  <div className="md:col-span-1 border border-gray-100 rounded-xl p-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Moisture % *
                    </label>
                    <input
                      type="number"
                      name="moisture_max"
                      value={formData.moisture_max}
                      onChange={handleChange}
                      placeholder="100"
                      min={0}
                      max={100}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition"
                    />
                    {formErrors.moisture_max && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.moisture_max}
                      </p>
                    )}
                  </div>



                  {/* MOISTURE PREVIEW BAR */}
                  <div className="md:col-span-1 border border-gray-100 rounded-xl p-4 flex flex-col justify-center gap-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Preview
                    </label>
                    <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 h-full rounded-full bg-emerald-400 transition-all"
                        style={{
                          left: `${formData.moisture_min || 0}%`,
                          width: `${
                            (formData.moisture_max || 0) -
                            (formData.moisture_min || 0)
                          }%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>{formData.moisture_min || 0}%</span>
                      <span>{formData.moisture_max || 0}%</span>
                    </div>
                  </div>
                </div>

                {/* GENERAL ERROR */}
                {formErrors.general && (
                  <p className="text-sm text-red-500">{formErrors.general}</p>
                )}



                {/* ── FOOTER ── */}
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">* Required fields</span>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`cursor-pointer px-5 py-2.5 text-white rounded-lg font-medium shadow-lg transition-all ${
                        isInsert
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      {isInsert ? "Add Plant" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  
}