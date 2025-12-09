import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Trash2, Sprout, Save } from "lucide-react";

import * as trayGroupModels from "../../../data/trayGroupServices";

export function TrayGroupModal({ isOpen, onClose, tgModalMode,selectedTrayGroup,setSuccessMsg,setErrorMsg}) {
  if (!isOpen) return null;

  

  const plantTypeOptions = [
    { type: "Leafy Greens", min: 55, max: 80 },
    { type: "Fruiting Plants", min: 60, max: 85 },
    { type: "Herbs", min: 55, max: 70 },
    { type: "Root Crops", min: 60, max: 80 },
  ];

  const [formData, setFormData] = useState({
    tray_group_name: "",
    min_moisture: "",
    max_moisture: ""
  });

  // Initialize modal values when opened
  useEffect(() => {
    if (tgModalMode === "update" && selectedTrayGroup) {
      setFormData({
        tray_group_name: selectedTrayGroup.tray_group_name || "",
        min_moisture: selectedTrayGroup.min_moisture || "",
        max_moisture: selectedTrayGroup.max_moisture || ""
      });
      console.log("SELECTED TRAY GROUP",selectedTrayGroup)
    } else if (tgModalMode === "insert") {
      setFormData({
        tray_group_name: "",
        min_moisture: "",
        max_moisture: ""
      });
      console.log("SELECTED TRAY GROUP",selectedTrayGroup)
    }else{
      setFormData({
        tray_group_name: selectedTrayGroup.tray_group_name || "",
        min_moisture: selectedTrayGroup.min_moisture || "",
        max_moisture: selectedTrayGroup.max_moisture || ""
      });
      console.log("SELECTED TRAY GROUP",selectedTrayGroup)
    }
  }, [tgModalMode,isOpen,selectedTrayGroup]);


  
  // Update min/max moisture when tray_group_name changes
  useEffect(() => {
    const selectedPlant = plantTypeOptions.find(p => p.type === formData.tray_group_name);
    if (selectedPlant) {
      setFormData(prev => ({
        ...prev,
        min_moisture: selectedPlant.min,
        max_moisture: selectedPlant.max,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        min_moisture: "",
        max_moisture: "",
      }));
    }
  }, [formData.tray_group_name]);
  
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onFormSubmit = async (e) => {
    e.preventDefault()
    try {
      if (tgModalMode === "insert") {
          await trayGroupModels.insertTrayGroup(formData);
          setSuccessMsg(`${formData.tray_group_name} Group is Added`)
        } else if (tgModalMode === "update") {
          await trayGroupModels.updateTrayGroup(formData,selectedTrayGroup.tray_group_id); 
          setSuccessMsg(`${selectedTrayGroup.tray_group_name} Group is Updated to ${formData.tray_group_name} `)
        }else if (tgModalMode === "delete"){
          await trayGroupModels.deleteTrayGroup(selectedTrayGroup.tray_group_id)
          setSuccessMsg(`${selectedTrayGroup.tray_group_name} Group is Deleted `)
      }
    } catch (error) {
      console.error("Error Submitting Tray Groups")
    }
    onClose();
  };


  return (
    <motion.div className="modal_backdrop fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <motion.div
        className={`bg-white rounded-xl shadow-xl p-6 relative ${tgModalMode === "delete" ? "w-[420px] h-[220px]" : "w-[600px]"}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}>

        {/* CLOSE */}
        <button onClick={onClose} className="cursor-pointer absolute top-4 right-4 hover:bg-gray-100 p-2 rounded-lg">
          <X />
        </button>

        {tgModalMode === "delete" ? (
          <>
            <div className="flex items-center gap-3">
              <Trash2 className="text-red-600" />
              <h2 className="text-xl font-semibold">Delete Tray Group</h2>
            </div>

            <p className="mt-6 text-gray-600">
              Are you sure you want to delete <b>{selectedTrayGroup.tray_group_name}</b>?
            </p>
            
            <form onSubmit={onFormSubmit} className="flex justify-end mt-8 gap-3 p-4">
              <button onClick={onClose} className="cursor-pointer px-4 py-2 rounded-lg border">
                Cancel
              </button>
              <button type="submit" className="cursor-pointer px-4 py-2 rounded-lg 
              bg-[var(--color-danger-a)] text-white">
                Delete
              </button>
            </form>
            
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
              <Sprout />
              <h2 className="text-xl font-semibold">
                {tgModalMode === "insert" ? "Add Tray Group" : "Update Tray Group"}
              </h2>
            </div>

            {/* FORM */}
            <form onSubmit={onFormSubmit} className="space-y-4">
              {/* Plant Type */}
              <div>
                <label className="text-sm">Tray Group Name / Plant Type</label>
                <select
                  name="tray_group_name"
                  value={formData.tray_group_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required>
                    
                  <option value="">Select a Plant Type</option>
                  {plantTypeOptions.map(plant => (
                    <option key={plant.type} value={plant.type}>
                      {plant.type}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Min/Max Moisture */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Min Moisture (%)</label>
                  <input
                    type="number"
                    name="min_moisture"
                    value={formData.min_moisture}
                    disabled
                    className="w-full p-2 border rounded-lg border-[var(--acc-darkc)]"
                  />
                </div>
                <div>
                  <label className="text-sm">Max Moisture (%)</label>
                  <input
                    type="number"
                    name="max_moisture"
                    value={formData.max_moisture}
                    disabled
                    className="w-full p-2 border rounded-lg border-[var(--acc-darkc)]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2 flex justify-center items-center gap-2 rounded-lg bg-[#7BA591] text-white hover:opacity-90"
              >
                <Save size={18} />
                {tgModalMode === "insert" ? "Insert Tray Group" : "Save Changes"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
