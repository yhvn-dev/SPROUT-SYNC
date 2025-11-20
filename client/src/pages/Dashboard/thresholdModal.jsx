import { Droplet, X, Save, AlertCircle } from "lucide-react";
import { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export function ThresholdModal({ isOpen, onSave }) {
  const [beds, setBeds] = useState([
    { bed_id: 1, bed_name: "Bed 1", min_threshold: 40, max_threshold: 60 },
  ]);

  const [tempBeds, setTempBeds] = useState([...beds]);

  const handleThresholdChange = (bedId, type, value) => {
    setTempBeds((prev) =>
      prev.map((bed) =>
        bed.bed_id === bedId
          ? { ...bed, [type]: value }
          : bed
      )
    );
  };

  const handleSave = () => {
    setBeds([...tempBeds]);
    if (onSave) onSave(tempBeds);
  };

  const handleCancel = () => {
    setTempBeds([...beds]);
    if (onSave) onSave(null);
    isOpen(false)
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-200 px-6 py-4 flex justify-between items-center border-b border-green-300">
          <div className="flex items-center gap-3">
            <Droplet size={24} className="text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">
              Moisture Thresholds
            </h2>
          </div>
          <button onClick={handleCancel} className="p-2 hover:bg-green-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[400px] overflow-y-auto space-y-6">
          {tempBeds.map((bed) => (
            <div key={bed.bed_id} className="p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <h3 className="text-md font-medium text-green-800 mb-4">{bed.bed_name}</h3>

              {/* Min Slider */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <Droplet size={14} /> Minimum Moisture (%)
                </label>
                <Slider
                  min={0}
                  max={100}
                  value={bed.min_threshold}
                  onChange={(value) => handleThresholdChange(bed.bed_id, "min_threshold", value)}
                  trackStyle={{ backgroundColor: "#16a34a" }}
                  handleStyle={{ borderColor: "#16a34a" }}
                />
                <div className="text-sm text-green-800 mt-1">Min: {bed.min_threshold}%</div>
              </div>

              {/* Max Slider */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <Droplet size={14} /> Maximum Moisture (%)
                </label>
                <Slider
                  min={0}
                  max={100}
                  value={bed.max_threshold}
                  onChange={(value) => handleThresholdChange(bed.bed_id, "max_threshold", value)}
                  trackStyle={{ backgroundColor: "#16a34a" }}
                  handleStyle={{ borderColor: "#16a34a" }}
                />
                <div className="text-sm text-green-800 mt-1">Max: {bed.max_threshold}%</div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
                <AlertCircle size={14} />
                Watering starts below minimum and stops above maximum to avoid rapid toggling.
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end gap-3 border-t border-green-100 bg-green-50">
          <button onClick={handleCancel} className="px-5 py-2 rounded-lg text-green-700 hover:bg-green-100 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
