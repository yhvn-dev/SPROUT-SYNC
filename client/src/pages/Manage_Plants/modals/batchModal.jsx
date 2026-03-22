import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { X, Sprout, Calendar, TrendingUp, Trash2, AlertCircle, Leaf } from 'lucide-react';
import * as batchModels from "../../../data/batchesData"

export function BatchModal({ isOpen, onClose, batchModalMode, selectedTray, selectedBatch, setSuccessMsg, reloadBatches }) {
   
  const [formData, setFormData] = useState({
    tray_id: 0,
    plant_name: "",
    total_seedlings: "",
    dead_seedlings: "",
    replanted_seedlings: "",
    fully_grown_seedlings: "", 
    growth_stage: "Sprout",
    date_planted: "",
    expected_harvest_days: "",
    batch_number: selectedTray?.tray_number || ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [harvestConfirm, setHarvestConfirm] = useState(false);
  const [harvestLoading, setHarvestLoading] = useState(false);

  if (!isOpen) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  useEffect(() => {
    if (!isOpen) return;             
    if (!selectedTray) return;          
    if (batchModalMode === "update" && !selectedBatch) return; 

    const trayId = selectedTray.tray_id;
    const plantName = selectedTray.plant;

    if (batchModalMode === "update") {
      setFormData({
        tray_id: selectedBatch.tray_id,
        plant_name: selectedBatch.plant_name,
        total_seedlings: selectedBatch.total_seedlings ?? 0,
        dead_seedlings: selectedBatch.dead_seedlings ?? 0,
        replanted_seedlings: selectedBatch.replanted_seedlings ?? 0,
        fully_grown_seedlings: selectedBatch.fully_grown_seedlings ?? 0,
        growth_stage: selectedBatch.growth_stage ?? "",
        date_planted: formatDate(selectedBatch.date_planted),
        expected_harvest_days: selectedBatch.expected_harvest_days ?? 0,
        batch_number: selectedBatch.batch_number ?? selectedTray.tray_number
      });
      setHarvestConfirm(false);
      
    } else if (batchModalMode === "insert") {
      setFormData((prev) => ({
        tray_id: trayId,
        plant_name: plantName,
        total_seedlings: "",
        dead_seedlings: "",
        replanted_seedlings: "",
        fully_grown_seedlings: "",
        growth_stage: prev.growth_stage || "Sprout", 
        date_planted: "",
        expected_harvest_days: "",
        batch_number: selectedTray.tray_number
      }));
      setHarvestConfirm(false);
      
    } else if (batchModalMode === "delete") {
      setFormData({
        tray_id: selectedBatch.tray_id,
        plant_name: selectedBatch.plant_name ?? "",
        total_seedlings: selectedBatch.total_seedlings ?? 0,
        dead_seedlings: selectedBatch.dead_seedlings ?? 0,
        replanted_seedlings: selectedBatch.replanted_seedlings ?? 0,
        fully_grown_seedlings: selectedBatch.fully_grown_seedlings ?? 0,
        growth_stage: selectedBatch.growth_stage ?? "Sprout",
        date_planted: selectedBatch.date_planted,
        expected_harvest_days: selectedBatch.expected_harvest_days ?? 0,
        batch_number: selectedBatch.batch_number ?? selectedTray.tray_number
      });
    }

  }, [isOpen, selectedTray, selectedBatch, batchModalMode]);

  const handleMarkReplantedAsGrown = () => {
    setFormData(prev => ({
      ...prev,
      fully_grown_seedlings: Number(prev.fully_grown_seedlings) + Number(prev.replanted_seedlings),
      replanted_seedlings: 0
    }));
  };

  const handleMarkAsHarvested = async () => {
  if (!harvestConfirm) {
    setHarvestConfirm(true);
    return;
  }

  try {
    setHarvestLoading(true);
    await batchModels.updateHarvestStatus(
      selectedBatch.batch_id,
      "Harvested"
    );

    setSuccessMsg(`${selectedBatch.plant_name} is Marked as Harvested`);
    onClose();
    reloadBatches();

  } catch (error) {
    console.error("Error marking batch as harvested:", error);
  } finally {
    setHarvestLoading(false);
    setHarvestConfirm(false);
  }
};





  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const payload = { 
        ...formData,
        tray_id: batchModalMode === "insert" ? selectedTray.tray_id : formData.tray_id,
        plant_name: batchModalMode === "insert" ? selectedTray.plant : formData.plant_name,
        total_seedlings: formData.total_seedlings !== "" ? parseInt(formData.total_seedlings) : null,
        dead_seedlings: formData.dead_seedlings !== "" ? parseInt(formData.dead_seedlings) : null,
        replanted_seedlings: formData.replanted_seedlings !== "" ? parseInt(formData.replanted_seedlings) : null,
        fully_grown_seedlings: formData.fully_grown_seedlings !== "" ? parseInt(formData.fully_grown_seedlings) : null,
        expected_harvest_days: formData.expected_harvest_days !== "" ? parseInt(formData.expected_harvest_days) : null,
        growth_stage: formData.growth_stage || "Sprout" 
      };

      if (batchModalMode === "insert") {
        await batchModels.insertBatches(payload);
        setSuccessMsg(`Batch for ${payload.plant_name} is Added`);
      } else if (batchModalMode === "update") {
        await batchModels.updateBatches(payload, selectedBatch.batch_id);
        setSuccessMsg(`Batch for ${payload.plant_name} is Updated`);
      } else if (batchModalMode === "delete") {
        await batchModels.deleteBatches(selectedBatch.batch_id);
        setSuccessMsg(`Batch for ${selectedBatch.plant_name} is Deleted`);
      }

      onClose();

      setTimeout(() => {
        reloadBatches();
      }, 500);

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
  }


  const isAlreadyHarvested = selectedBatch?.harvest_status === "Harvested";

  return (
    <motion.div
      className="batch_modal fixed inset-0 bg-transparent backdrop-blur-2xl z-50 flex items-center justify-center p-4">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className="conb bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <header className="pb_modal_header px-6 py-4 border-b border-gray-200 bg-[#E8F3ED]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-4 rounded-xl shadow-sm ${batchModalMode === "delete" ? 'bg-red-500' : 'bg-[#208b3a]'}`}>
                {batchModalMode === "delete" ? (
                  <Trash2 className="w-5 h-5 text-white" />
                ) : (
                  <Sprout className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#155d27]">
                  {batchModalMode === "delete" ? "Delete Batch" : batchModalMode === "insert" ? "Add New Batch" : "Update Batch"}
                </h2>
                <p className="text-xs mt-0.5 text-[#5A8F73]">
                  {batchModalMode === "delete" 
                    ? `Are you sure you want to delete ${selectedBatch?.plant_name} batch?`
                    : `Manage plant batch for [${selectedBatch.batch_number}] ${selectedBatch?.plant_name}`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="close_button w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 hover:text-gray-200 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="batch_modal_main p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {batchModalMode === "delete" ? (
            <>
              <div className="pb_delete_modal flex items-center gap-3 p-3 rounded-lg mb-4 bg-red-50">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  Are you sure you want to delete the batch for <strong>{selectedBatch.plant_name}</strong>? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={onClose} className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50 text-sm">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors text-white bg-red-500 hover:bg-red-600 text-sm">
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input disabled type="text" name="tray_id" value={formData.tray_id} className="py-2 rounded-lg hidden" />

                {/* PLANT NAME */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    <Sprout className="w-3 h-3 inline mr-1" />
                    Plant Name *
                  </label>
                  <div className='flex gap-4'>
                    <input
                      disabled
                      readOnly
                      type="text"
                      name="plant_name"
                      value={formData.plant_name}
                      className="py-2 rounded-lg text-sm w-full"
                    />
                    <div className='hidden'>
                      <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">Batch Number</label>
                      <input
                        readOnly
                        type="number"
                        name="batch_number"
                        value={formData.batch_number}
                        className="py-2 rounded-lg text-sm w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* TOTAL SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">Total Seedlings *</label>
                  <input
                    type="number" name="total_seedlings" value={formData.total_seedlings}
                    onChange={handleChange} placeholder="0" min="0"
                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all ${formErrors.total_seedlings ? 'border-red-500' : 'border-[#C4DED0]'}`}
                  />
                  {formErrors.total_seedlings && <p className="text-red-600 text-xs mt-1">{formErrors.total_seedlings}</p>}
                </div>

                {/* DEAD SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">Dead Seedlings</label>
                  <input
                    type="number" name="dead_seedlings" value={formData.dead_seedlings}
                    onChange={handleChange} placeholder="0 (Optional)" min="0"
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all"
                  />
                </div>

                {/* REPLANTED SEEDLINGS */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-[#155d27]">Replanted Seedlings</label>
                    {batchModalMode === "update" && (
                      <button
                        type="button" onClick={handleMarkReplantedAsGrown}
                        disabled={Number(formData.replanted_seedlings) === 0}
                        className={`cursor-pointer text-xs px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1
                          ${Number(formData.replanted_seedlings) === 0 ? "bg-gray-500 text-white cursor-not-allowed" : "bg-[#208b3a] text-white hover:bg-[#155d27] cursor-pointer"}`}
                      >
                        <Sprout className="w-3 h-3" />
                        Mark Replants as Grown
                      </button>
                    )}
                  </div>
                  <input
                    type="number" name="replanted_seedlings" value={formData.replanted_seedlings}
                    onChange={handleChange} placeholder="0 (Optional)" min="0"
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all"
                  />
                </div>

                {/* FULLY GROWN SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">Fully Grown Seedlings</label>
                  <input
                    type="number" name="fully_grown_seedlings" value={formData.fully_grown_seedlings}
                    onChange={handleChange} placeholder="0 (Optional)" min="0"
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all"
                  />
                </div>

                {/* GROWTH STAGE */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Growth Stage *
                  </label>
                  <select
                    name="growth_stage" value={formData.growth_stage} onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all text-[#155d27]">
                    <option value="Sprout">Sprout</option>
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Budding">Budding</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                  </select>
                </div>

                {/* DATE PLANTED */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Date Planted *
                  </label>
                  <input
                    type="date" name="date_planted" value={formData.date_planted} onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all ${formErrors.date_planted ? 'border-red-500' : 'border-[#C4DED0]'}`}
                  />
                  {formErrors.date_planted && <p className="text-red-600 text-xs mt-1">{formErrors.date_planted}</p>}
                </div>

                {/* EXPECTED HARVEST DAYS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">Expected Harvest (Days) *</label>
                  <input
                    type="number" name="expected_harvest_days" value={formData.expected_harvest_days}
                    onChange={handleChange} placeholder="e.g., 60" min="0"
                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all ${formErrors.expected_harvest_days ? 'border-red-500' : 'border-[#C4DED0]'}`}
                  />
                  {formErrors.expected_harvest_days && <p className="text-red-600 text-xs mt-1">{formErrors.expected_harvest_days}</p>}
                </div>

              </div>

              {/* ── MARK AS HARVESTED (update mode only) ── */}
              {batchModalMode === "update" && (
                <div className="pt-1">
                  {isAlreadyHarvested ? (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-green-200 bg-green-50">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <p className="text-sm font-semibold text-green-700">This batch is already marked as Harvested.</p>
                    </div>
                  ) : harvestConfirm ? (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 border-amber-300 bg-amber-50"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <p className="text-xs text-amber-800 font-medium">
                          Mark <strong>[{selectedBatch?.batch_number}] {selectedBatch?.plant_name}</strong> as Harvested? This cannot be undone.
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button" onClick={() => setHarvestConfirm(false)}
                          className="cursor-pointer text-xs px-3 py-1.5 rounded-lg font-medium border-2 border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button" onClick={handleMarkAsHarvested} disabled={harvestLoading}
                          className="cursor-pointer text-xs px-3 py-1.5 rounded-lg font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors disabled:opacity-60"
                        >
                          {harvestLoading ? "Saving..." : "Confirm"}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button
                      type="button" onClick={handleMarkAsHarvested}
                      className="cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[#C4DED0] bg-[#E8F3ED] text-[#155d27] hover:bg-[#d4edde] hover:border-[#208b3a] transition-all font-semibold text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <Leaf className="w-4 h-4" />
                        Mark Batch as Harvested
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#C4DED0] text-[#155d27] font-medium">
                        Record Harvest
                      </span>
                    </button>
                  )}
                </div>
              )}





              {/* FOOTER */}
              <div className="flex items-center justify-between pt-4 border-t border-[#C4DED0]">
                {batchModalMode !== "delete" && (
                  <p className="text-xs text-[#5A8F73]">* Required fields</p>
                )}
                <div className="flex gap-2 ml-auto">
                  <button onClick={onClose} type='button' className="cursor-pointer px-4 py-2 text-sm rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit} type='submit'
                    className={`cursor-pointer px-4 py-2 text-sm rounded-lg font-medium transition-colors text-white 
                    ${batchModalMode === "insert" ? "bg-[var(--sancgb)] hover:bg-[var(--sancgd)]" : "bg-[var(--purpluish)] hover:bg-[var(--white-blple)]"} shadow-lg`}>
                    {batchModalMode === "insert" ? "Create Batch" : "Update Batch"}
                  </button>
                </div>
              </div>

            </div>
          )}
        </main>
      </motion.div>
    </motion.div>
  );




}