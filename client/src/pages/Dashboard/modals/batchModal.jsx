import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { X, Sprout, Calendar, TrendingUp, Trash2, AlertCircle } from 'lucide-react';
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





  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormErrors({});

      try {
        // Prepare payload
        const payload = { 
          ...formData,
          tray_id: batchModalMode === "insert" ? selectedTray.tray_id : formData.tray_id,
          plant_name: batchModalMode === "insert" ? selectedTray.plant : formData.plant_name,
          total_seedlings: formData.total_seedlings !== "" ? parseInt(formData.total_seedlings) : null,
          dead_seedlings: formData.dead_seedlings !== "" ? parseInt(formData.dead_seedlings) : null,
          replanted_seedlings: formData.replanted_seedlings !== "" ? parseInt(formData.replanted_seedlings) : null,
          fully_grown_seedlings: formData.fully_grown_seedlings !== "" ? parseInt(formData.fully_grown_seedlings) : null,
          expected_harvest_days: formData.expected_harvest_days !== "" ? parseInt(formData.expected_harvest_days) : null,
          growth_stage: formData.growth_stage || "Sprout" // default fallback
        };

        console.log("Submitting payload:", payload);

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
        reloadBatches();

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
              <div 
                className={`p-2 rounded-xl shadow-sm ${
                  batchModalMode === "delete" ? 'bg-red-500' : 'bg-[#208b3a]'
                }`}>
                {batchModalMode === "delete" ? (
                  <Trash2 className="w-5 h-5 text-white" />
                ) : (
                  <Sprout className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#155d27]">
                  {batchModalMode === "delete" 
                    ? "Delete Batch" 
                    : batchModalMode === "insert" 
                    ? "Add New Batch" 
                    : "Update Batch"}
                </h2>
                <p className="text-xs mt-0.5 text-[#5A8F73]">
                  {batchModalMode === "delete" 
                    ? `Are you sure you want to delete ${selectedBatch?.plant_name} batch?`
                    : `Manage plant batch for ${selectedTray?.plant}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="close_button cursor-pointer p-2 hover:bg-white/80 rounded-lg transition-colors text-[#5A8F73]">
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
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50 text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors text-white bg-red-500 hover:bg-red-600 text-sm">
                  Delete
                </button>
              </div>
            </>
          ) : (

            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <input
                  disabled
                  type="text"
                  name="tray_id"
                  value={formData.tray_id}  
                  className="py-2 rounded-lg hidden"
                />

                {/* PLANT NAME */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]"> 
                    <Sprout className="w-3 h-3 inline mr-1" /> 
                    Plant Name *
                  </label>
                  <div className='flex gap-4'>
                    <input
                      disabled
                      type="text"
                      name="plant_name"
                      value={formData.plant_name}  
                      className="py-2 rounded-lg text-sm w-full"
                    />  
                    {/* BATCH NUMBER */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5 text-[#155d27]"> 
                        Batch Number
                      </label>
                      <input
                        disabled
                        type="number"
                        name="batch_number"
                        value={formData.batch_number}
                        className="py-2 rounded-lg text-sm w-full border-2 border-[#C4DED0]"
                      />
                    </div>
                  </div>
                </div>

                {/* TOTAL SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    Total Seedlings *
                  </label>
                  <input
                    type="number"
                    name="total_seedlings"
                    value={formData.total_seedlings}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all ${
                      formErrors.total_seedlings ? 'border-red-500' : 'border-[#C4DED0]'
                    }`}
                    placeholder="0"
                    min="0"
                  />
                  {formErrors.total_seedlings && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.total_seedlings}</p>
                  )}
                </div>

                {/* DEAD SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    Dead Seedlings
                  </label>
                  <input
                    type="number"
                    name="dead_seedlings"
                    value={formData.dead_seedlings}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all"
                    placeholder="0 (Optional)"
                    min="0"
                  />
                </div>



                {/* REPLANTED SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    Replanted Seedlings
                  </label>
                  <input
                    type="number"
                    name="replanted_seedlings"
                    value={formData.replanted_seedlings}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all"
                    placeholder="0 (Optional)"
                    min="0"
                  />
                </div>


                  
                {/* FULLY GROWN SEEDLINGS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    Fully Grown Seedlings
                  </label>
                  <input
                    type="number"
                    name="fully_grown_seedlings"
                    value={formData.fully_grown_seedlings}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all"
                    placeholder="0 (Optional)"
                    min="0"
                  />
                </div>

            
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    Growth Stage *
                  </label>
                  <select
                    name="growth_stage"
                    value={formData.growth_stage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border-2 border-[#C4DED0] focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all text-[#155d27]">
                    <option value="Sprout">Sprout</option>
                    <option value="Seedling">Seedling</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Budding">Budding</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Ready To Harvest">Ready To Harvest</option>
                  </select>
                </div>




                {/* DATE PLANTED */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Date Planted *
                  </label>
                  <input
                    type="date"
                    name="date_planted"
                    value={formData.date_planted}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all ${
                      formErrors.date_planted ? 'border-red-500' : 'border-[#C4DED0]'
                    }`}
                  />
                  {formErrors.date_planted && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.date_planted}</p>
                  )}
                </div>

                {/* EXPECTED HARVEST DAYS */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#155d27]">
                    Expected Harvest (Days) *
                  </label>
                  <input
                    type="number"
                    name="expected_harvest_days"
                    value={formData.expected_harvest_days}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 text-sm rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#208b3a] transition-all ${
                      formErrors.expected_harvest_days ? 'border-red-500' : 'border-[#C4DED0]'
                    }`}
                    placeholder="e.g., 60"
                    min="0"
                  />
                  {formErrors.expected_harvest_days && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.expected_harvest_days}</p>
                  )}
                </div>

              </div>





              {/* FOOTER */}
              <div className="flex items-center justify-between pt-4 border-t border-[#C4DED0]">
                {batchModalMode !== "delete" && (
                  <p className="text-xs text-[#5A8F73]">
                    * Required fields
                  </p>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={onClose}
                    type='button'
                    className="cursor-pointer px-4 py-2 text-sm rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    type='submit'
                    className="cursor-pointer px-4 py-2 text-sm rounded-lg font-medium transition-colors text-white bg-[var(--purpluish)] hover:bg-[var(--white-blple)] shadow-lg"
                  >
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
