import { useState } from 'react';
import { X } from 'lucide-react';

export default function TrayGroupModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    tray_group_name: "Bok BokChoy Zone",
    min_moisture: "40",
    max_moisture: "50",
    plant_type: "",
    soil_type: "Sandy"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated data:', formData);
    isOpen(false);
  };

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-2xl bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Edit Tray Group</h2>
            <p className="text-sm text-gray-500 mt-0.5">Update tray group settings</p>
          </div>
          <button
              onClick={() => onClose()}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-lg p-1 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tray Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tray Group Name
            </label>
            <input
              type="text"
              name="tray_group_name"
              value={formData.tray_group_name}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter tray group name"
            />
          </div>

          {/* Moisture Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Min Moisture (%)
              </label>
              <input
                type="number"
                name="min_moisture"
                value={formData.min_moisture}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Max Moisture (%)
              </label>
              <input
                type="number"
                name="max_moisture"
                value={formData.max_moisture}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Plant Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Plant Type
            </label>
            <select
              name="plant_type"
              value={formData.plant_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Select plant type</option>
              <option value="Bok Choy">Bok Choy</option>
              <option value="Lettuce">Lettuce</option>
              <option value="Spinach">Spinach</option>
              <option value="Kale">Kale</option>
              <option value="Basil">Basil</option>
              <option value="Tomato">Tomato</option>
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Soil Type
            </label>
            <select
              name="soil_type"
              value={formData.soil_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Select soil type</option>
              <option value="Sandy">Sandy</option>
              <option value="Clay">Clay</option>
              <option value="Loam">Loam</option>
              <option value="Silt">Silt</option>
              <option value="Peat">Peat</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all shadow-sm"
              style={{ 
                backgroundColor: '#208b3a',
                boxShadow: '0 1px 2px 0 rgba(32, 139, 58, 0.05)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a7431'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#208b3a'}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}