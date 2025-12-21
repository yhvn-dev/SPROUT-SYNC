import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Trash2, Sprout } from "lucide-react";

import * as trayGroupModels from "../../../data/trayGroupServices";

export function TrayGroupModal({
  isOpen,
  onClose,
  tgModalMode,
  selectedTrayGroup,
  setSuccessMsg,
  loadTrayGroups,
  reloadTrayGroups,
}) {
  if (!isOpen) return null;

  
  const plantOptions = [
    { name: "Bokchoy", min: 45, max: 70 },
    { name: "Pechay", min: 50, max: 75 },
    { name: "Mustasa", min: 45, max: 70 },
    { name: "Lettuce", min: 50, max: 75 },
    { name: "Spinach", min: 50, max: 75 },
    { name: "Kangkong", min: 55, max: 80 },
    { name: "Basil", min: 45, max: 70 },
    { name: "Mint", min: 50, max: 75 },
    { name: "Tomato", min: 40, max: 70 },
    { name: "Cucumber", min: 50, max: 75 },
    { name: "Bell Pepper", min: 45, max: 75 }
  ];

  const [formData, setFormData] = useState({
    tray_group_name: "",
    min_moisture: "",
    max_moisture: "",
    location: "",
    is_watering: false
  });



  const [formErrors, setFormErrors] = useState({});
  // Initialize modal values only when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if ((tgModalMode === "update" || tgModalMode === "delete") && selectedTrayGroup) {
      setFormData({
        tray_group_name: selectedTrayGroup.tray_group_name || "",
        min_moisture: selectedTrayGroup.min_moisture || "",
        max_moisture: selectedTrayGroup.max_moisture || "",
        location: selectedTrayGroup.location || "",
      });
    } else if (tgModalMode === "insert") {
      setFormData({
        tray_group_name: "",
        min_moisture: "",
        max_moisture: "",
        location: "",
      });
    }
  }, [isOpen]);

  
  // Auto-update min/max moisture based on selected plant
  useEffect(() => {
    const selectedPlant = plantOptions.find(
      (p) => p.name === formData.tray_group_name
    );

    if (selectedPlant) {
      setFormData((prev) => ({
        ...prev,
        min_moisture: selectedPlant.min,
        max_moisture: selectedPlant.max,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        min_moisture: "",
        max_moisture: "",
      }));
    }
  }, [formData.tray_group_name]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors({});
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      setFormErrors({ location: "Location is required" });
      return;
    }

    try {
      if (tgModalMode === "insert") {
        const newGroup = await trayGroupModels.insertTrayGroup(formData);
        onClose();
        setSuccessMsg(`${newGroup.tray_group_name} Group is Added`);
      } else if (tgModalMode === "update") {
        const updatedGroup = await trayGroupModels.updateTrayGroup(
          formData,
          selectedTrayGroup.tray_group_id
        );
        onClose();
        setSuccessMsg(
          `${selectedTrayGroup.tray_group_name} Group is Updated to ${updatedGroup.tray_group_name}`
        );
      } else if (tgModalMode === "delete") {
        await trayGroupModels.deleteTrayGroup(selectedTrayGroup.tray_group_id);
        onClose();
        setSuccessMsg(`${selectedTrayGroup.tray_group_name} Group is Deleted`);
      }

      setFormErrors({});
      loadTrayGroups();
      reloadTrayGroups();
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
    <motion.div className="modal_backdrop fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <motion.div
        className={`bg-white rounded-xl shadow-xl p-6 relative ${
          tgModalMode === "delete" ? "w-[420px]" : "w-[600px]"
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 hover:bg-gray-100 p-2 rounded-lg"
        >
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

            <form onSubmit={onFormSubmit} className="flex justify-end mt-8 gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[var(--color-danger-a)] text-white"
              >
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
                <label className="text-sm">Plant</label>
                <select
                  name="tray_group_name"
                  value={formData.tray_group_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select a Plant</option>
                  {plantOptions.map((plant) => (
                    <option key={plant.name} value={plant.name}>
                      {plant.name}
                    </option>
                  ))}
                </select>
                {formErrors.tray_group_name && (
                  <p className="text-sm text-[var(--color-danger-a)] mt-1">
                    {formErrors.tray_group_name}
                  </p>
                )}
              </div>

              {/* Min/Max Moisture */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Min Moisture (%)</label>
                  <input
                    type="number"
                    value={formData.min_moisture}
                    disabled
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm">Max Moisture (%)</label>
                  <input
                    type="number"
                    value={formData.max_moisture}
                    disabled
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm">Location</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select a Location</option>
                  <option value="Left 1">Left 1</option>
                  <option value="Left 2">Left 2</option>
                  <option value="Left 3">Left 3</option>
                  <option value="Right 1">Right 1</option>
                  <option value="Right 2">Right 2</option>
                  <option value="Right 3">Right 3</option>
                </select>
                {formErrors.location && (
                  <p className="text-sm text-[var(--color-danger-a)] mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`cursor-pointer px-5 py-2 text-white rounded-lg ${
                    tgModalMode === "insert"
                      ? "bg-[var(--sancgb)]"
                      : "bg-[var(--purpluish--)]"
                  }`}
                >
                  {tgModalMode === "insert" ? "Create Tray Group" : "Update Group"}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>

    
  );
}
