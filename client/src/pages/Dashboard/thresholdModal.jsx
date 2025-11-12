import { Droplet, X, Save, AlertCircle, Repeat } from "lucide-react";
import { useState } from "react";

export function ThresholdModal({ isOpen, onSave }) {
  const [beds, setBeds] = useState([
    { bed_id: 1, bed_name: "Bed 1", moisture_threshold: 60, hysteresis: 10, zones: 6 },
  ]);

  const [tempBeds, setTempBeds] = useState([...beds]);

  const handleThresholdChange = (bedId, value) => {
    setTempBeds((prev) =>
      prev.map((bed) =>
        bed.bed_id === bedId
          ? { ...bed, moisture_threshold: parseFloat(value) || 0 }
          : bed
      )
    );
  };

  const handleHysteresisChange = (bedId, value) => {
    setTempBeds((prev) =>
      prev.map((bed) =>
        bed.bed_id === bedId
          ? { ...bed, hysteresis: parseFloat(value) || 0 }
          : bed
      )
    );
  };

  const handleSave = () => {
    setBeds([...tempBeds]);
    if (onSave) {
      onSave(tempBeds);
    }
    isOpen(false);
  };

  const handleCancel = () => {
    setTempBeds([...beds]);
    isOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent bg-opacity-40 backdrop-blur-2xl">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--sage-light)] to-[var(--sage-lighter)] px-6 py-5 border-b border-[var(--sage-medium)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white shadow-sm">
                <Droplet size={20} style={{ color: "var(--sancgb)" }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--sancga)]">
                  Moisture & Hysteresis Settings
                </h2>
                <p className="text-sm text-[var(--acc-darkb)] mt-0.5">
                  Adjust thresholds and hysteresis levels for optimal soil control
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-[var(--acc-darkb)] hover:text-[var(--sancga)]"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {tempBeds.map((bed) => (
              <div
                key={bed.bed_id}
                className="rounded-lg p-5 bg-[var(--sage-lighter)] border border-[var(--sage-light)] shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-[var(--sancgb)] text-white text-sm font-medium">
                      {bed.bed_name}
                    </div>
                    <span className="text-sm text-[var(--acc-darkb)]">
                      {bed.zones} {bed.zones === 1 ? "Zone" : "Zones"} Active
                    </span>
                  </div>
                </div>

                {/* Moisture Threshold */}
                <div className="column space-y-4">
                  <div className="column">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--acc-darka)] flex items-center gap-2">
                        <Droplet size={14} style={{ color: "var(--sancgb)" }} />
                        Moisture Threshold
                      </label>
                      <span className="text-sm text-[var(--acc-darkc)]">
                        Current: {bed.moisture_threshold}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={bed.moisture_threshold}
                        onChange={(e) =>
                          handleThresholdChange(bed.bed_id, e.target.value)
                        }
                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, var(--sancgb) 0%, var(--sancgb) ${bed.moisture_threshold}%, var(--sage-medium) ${bed.moisture_threshold}%, var(--sage-medium) 100%)`,
                        }}
                      />
                      <div className="ml-4 flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-[var(--sage-light)] shadow-sm">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bed.moisture_threshold}
                          onChange={(e) =>
                            handleThresholdChange(bed.bed_id, e.target.value)
                          }
                          className="w-16 text-lg font-bold text-[var(--sancgb)] bg-transparent outline-none"
                        />
                        <span className="text-sm text-[var(--acc-darkb)] font-medium">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hysteresis */}
                  <div className="column">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-[var(--acc-darka)] flex items-center gap-2">
                        <Repeat size={14} style={{ color: "var(--sancgb)" }} />
                        Hysteresis
                      </label>
                      <span className="text-sm text-[var(--acc-darkc)]">
                        Current: {bed.hysteresis}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={bed.hysteresis}
                        onChange={(e) =>
                          handleHysteresisChange(bed.bed_id, e.target.value)
                        }
                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, var(--sancgb) 0%, var(--sancgb) ${bed.hysteresis}%, var(--sage-medium) ${bed.hysteresis}%, var(--sage-medium) 100%)`,
                        }}
                      />
                      <div className="ml-4 flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-[var(--sage-light)] shadow-sm">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={bed.hysteresis}
                          onChange={(e) =>
                            handleHysteresisChange(bed.bed_id, e.target.value)
                          }
                          className="w-16 text-lg font-bold text-[var(--sancgb)] bg-transparent outline-none"
                        />
                        <span className="text-sm text-[var(--acc-darkb)] font-medium">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-2 text-xs text-[var(--acc-darkc)] pt-2">
                    <AlertCircle size={12} />
                    <span>
                      The system uses hysteresis to avoid frequent ON/OFF
                      switching around the threshold point.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex gap-3">
              <AlertCircle
                size={16}
                className="text-blue-600 flex-shrink-0 mt-0.5"
              />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Thresholds & Hysteresis</p>
                <p className="text-xs leading-relaxed">
                  Threshold defines when irrigation activates, while hysteresis
                  adds a small range buffer to prevent rapid toggling.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-lg text-sm font-medium text-[var(--acc-darka)] hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-medium bg-[var(--sancgb)] text-white hover:bg-[var(--sancga)] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  
}
