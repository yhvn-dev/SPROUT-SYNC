import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { X, Trash2, Sprout, Save } from "lucide-react";

export function TrayGroupModal({
  isOpen,
  onClose,
  mode,
  handleSubmit,
  trayGroupData,
  selectedPlantGroup
}) {
  if (!isOpen) return null;

  const [tray_group_name, setName] = useState("");
  const [min_moisture, setMinMoisture] = useState("");
  const [max_moisture, setMaxMoisture] = useState("");
  const [soil_type, setSoilType] = useState("");

  useEffect(() => {
    if (trayGroupData && mode === "update") {
      setName(trayGroupData.tray_group_name || "");
      setMinMoisture(trayGroupData.min_moisture || "");
      setMaxMoisture(trayGroupData.max_moisture || "");
      setSoilType(trayGroupData.soil_type || "");
    }

    if (mode === "insert") {
      setName("");
      setMinMoisture("");
      setMaxMoisture("");
      setSoilType("");
    }
  }, [trayGroupData, mode]);

  const onFormSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      tray_group_name,
      min_moisture,
      max_moisture,
      soil_type,
    };

    await handleSubmit(payload);
    onClose();
  };

    const plantTypeOptions = [
    {
        type: "Leafy Greens",
        min: 55,
        max: 80
    },
    {
        type: "Fruiting Plants",
        min: 60,
        max: 85
    },
    {
        type: "Herbs",
        min: 55,
        max: 70,
    },
    {
        type: "Root Crops",
        min: 60,
        max: 80
    },
    ];

  return (
    <motion.div className="modal_backdrop fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
      <motion.div
        className={`bg-white rounded-xl shadow-xl p-6 relative
        ${mode === "delete" ? "w-[420px] h-[220px]" : "w-[600px]"}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}>
            
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 p-2 rounded-lg">
          <X />
        </button>


        {/* DELETE MODE */}
        {mode === "delete" ? (
          <>
            <div className="flex items-center gap-3">
              <Trash2 className="text-red-600" />
              <h2 className="text-xl font-semibold">Delete Tray Group</h2>
            </div>

            <p className="mt-6 text-gray-600">
              Are you sure you want to delete{" "}
              <b>{trayGroupData?.tray_group_name}</b>?
            </p>

            <div className="flex justify-end mt-8 gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={() => handleSubmit(trayGroupData)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-6">
              <Sprout />
              <h2 className="text-xl font-semibold">
                {mode === "insert" ? "Add Tray Group" : "Update Tray Group"}
              </h2>
            </div>

            {/* FORM */}
            <form onSubmit={onFormSubmit} className="space-y-4">
              <div>
                <label className="text-sm">Tray Group Name</label>
                   <select
                    value={tray_group_name}
                    onChange={(e) => {
                        // find the selected plant type based on its 'type'
                        const selectedPlant = plantTypeOptions.find(p => p.type === e.target.value);
                        setName(selectedPlant?.type || "");
                        setMinMoisture(selectedPlant?.min || "");
                        setMaxMoisture(selectedPlant?.max || "");
                    }}
                    className="w-full p-2 border rounded-lg"
                    required
                    >
                    <option value="">Select a Plant Type</option>
                    {plantTypeOptions.map((plant) => (
                        <option key={plant.type} value={plant.type}>
                        {plant.type}
                        </option>
                    ))}
                    </select>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Min Moisture (%)</label>
                  <input
                    disabled
                    type="number"
                    value={min_moisture}
                    onChange={(e) => setMinMoisture(e.target.value)}
                    className="w-full p-2 border rounded-lg border-[var(--acc-darkc)]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm">Max Moisture (%)</label>
                  <input
                    disabled
                    type="number"
                    value={max_moisture}
                    onChange={(e) => setMaxMoisture(e.target.value)}
                    className="w-full p-2 border rounded-lg border-[var(--acc-darkc)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm">Soil Type</label>
                <select
                  value={soil_type}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Soil Type</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Clay">Clay</option>
                </select>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full mt-4 py-2 flex justify-center items-center gap-2 rounded-lg bg-[#7BA591] text-white hover:opacity-90"
              >
                <Save size={18} />
                {mode === "insert" ? "Insert Tray Group" : "Save Changes"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
