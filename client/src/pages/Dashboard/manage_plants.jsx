import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Sprout, LayoutGrid, TrendingUp, ChevronRight, Search, Filter } from 'lucide-react';

const ManagePlants = () => {
  const [activeTab, setActiveTab] = useState('trayGroups');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const [trayGroups, setTrayGroups] = useState([
    { tray_group_id: 1, tray_group_name: 'Leafy Greens', min_moisture: 65, max_moisture: 80, description: 'High moisture requirement' },
    { tray_group_id: 2, tray_group_name: 'Herbs', min_moisture: 50, max_moisture: 70, description: 'Medium moisture requirement' },
    { tray_group_id: 3, tray_group_name: 'Succulents', min_moisture: 30, max_moisture: 45, description: 'Low moisture requirement' }
  ]);

  const [trays, setTrays] = useState([
    { tray_id: 1, tray_group_id: 1, plant: 'Lettuce', status: 'Active', batch_id: 1 },
    { tray_id: 2, tray_group_id: 1, plant: 'Spinach', status: 'Active', batch_id: 2 },
    { tray_id: 3, tray_group_id: 2, plant: 'Basil', status: 'Active', batch_id: 3 },
    { tray_id: 4, tray_group_id: 2, plant: 'Cilantro', status: 'Inactive', batch_id: 4 },
    { tray_id: 5, tray_group_id: 3, plant: 'Aloe', status: 'Active', batch_id: 5 }
  ]);

  const [batches, setBatches] = useState([
    { batch_id: 1, plant_name: 'Lettuce', date_planted: '2024-01-05', expected_harvest: '2024-02-20', total_planted: 50, seedlings_alive: 48, fully_grown: 12, replant_count: 2 },
    { batch_id: 2, plant_name: 'Spinach', date_planted: '2024-01-08', expected_harvest: '2024-02-25', total_planted: 55, seedlings_alive: 52, fully_grown: 8, replant_count: 1 },
    { batch_id: 3, plant_name: 'Basil', date_planted: '2024-01-10', expected_harvest: '2024-03-01', total_planted: 60, seedlings_alive: 45, fully_grown: 15, replant_count: 0 }
  ]);

  const [formData, setFormData] = useState({});

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setSelectedItem(item);
    setFormData(item || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (activeTab === 'trayGroups') {
      if (modalMode === 'add') {
        const newId = Math.max(...trayGroups.map(g => g.tray_group_id), 0) + 1;
        setTrayGroups([...trayGroups, { ...formData, tray_group_id: newId }]);
      } else {
        setTrayGroups(trayGroups.map(g => g.tray_group_id === selectedItem.tray_group_id ? { ...formData, tray_group_id: selectedItem.tray_group_id } : g));
      }
    } else if (activeTab === 'trays') {
      if (modalMode === 'add') {
        const newId = Math.max(...trays.map(t => t.tray_id), 0) + 1;
        setTrays([...trays, { ...formData, tray_id: newId }]);
      } else {
        setTrays(trays.map(t => t.tray_id === selectedItem.tray_id ? { ...formData, tray_id: selectedItem.tray_id } : t));
      }
    } else if (activeTab === 'batches') {
      if (modalMode === 'add') {
        const newId = Math.max(...batches.map(b => b.batch_id), 0) + 1;
        setBatches([...batches, { ...formData, batch_id: newId }]);
      } else {
        setBatches(batches.map(b => b.batch_id === selectedItem.batch_id ? { ...formData, batch_id: selectedItem.batch_id } : b));
      }
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'trayGroups') {
        setTrayGroups(trayGroups.filter(g => g.tray_group_id !== id));
      } else if (activeTab === 'trays') {
        setTrays(trays.filter(t => t.tray_id !== id));
      } else if (activeTab === 'batches') {
        setBatches(batches.filter(b => b.batch_id !== id));
      }
    }
  };

  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'trayGroups') data = trayGroups;
    if (activeTab === 'trays') data = trays;
    if (activeTab === 'batches') data = batches;

    if (!searchQuery) return data;

    return data.filter(item => 
      JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getTrayGroupName = (id) => {
    const group = trayGroups.find(g => g.tray_group_id === id);
    return group ? group.tray_group_name : 'Unknown';
  };

  return (
  <>

      <style>{`
        :root {
          --sage: #7BA591;
          --sage-light: #A8C7B8;
          --sage-lighter: #E8F3ED;
          --sage-dark: #5A8F73;
          --sage-medium: #C4DED0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Plant Management</h1>
              <p className="text-sm text-gray-500 mt-1">Configure tray groups, trays, and plant batches</p>
            </div>
            <button
              onClick={() => openModal('add')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#7BA591] to-[#5A8F73] text-white rounded-2xl hover:shadow-lg transition-all font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
          <div className="flex p-2 gap-2">
            <button
              onClick={() => setActiveTab('trayGroups')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'trayGroups'
                  ? 'bg-gradient-to-r from-[#A8C7B8] to-[#7BA591] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Sprout className="w-5 h-5" />
              Tray Groups
            </button>
            <button
              onClick={() => setActiveTab('trays')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'trays'
                  ? 'bg-gradient-to-r from-[#A8C7B8] to-[#7BA591] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              Trays
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'batches'
                  ? 'bg-gradient-to-r from-[#A8C7B8] to-[#7BA591] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Plant Batches
            </button>
          </div>
        </div>
        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
          {activeTab === 'trayGroups' && (
            <div className="space-y-3">
              {getFilteredData().map((group) => (
                <div key={group.tray_group_id} className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A8C7B8] to-[#7BA591] flex items-center justify-center">
                          <Sprout className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{group.tray_group_name}</h3>
                          <p className="text-sm text-gray-500">{group.description}</p>
                        </div>
                      </div>
                      <div className="ml-13 flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Min Moisture:</span>
                          <span className="text-sm font-semibold text-[#7BA591]">{group.min_moisture}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Max Moisture:</span>
                          <span className="text-sm font-semibold text-[#7BA591]">{group.max_moisture}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('edit', group)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(group.tray_group_id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'trays' && (
            <div className="space-y-3">
              {getFilteredData().map((tray) => (
                <div key={tray.tray_id} className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                          <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{tray.plant}</h3>
                          <p className="text-sm text-gray-500">Tray ID: {tray.tray_id}</p>
                        </div>
                      </div>
                      <div className="ml-13 flex items-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Zone:</span>
                          <span className="text-sm font-semibold text-[#7BA591]">{getTrayGroupName(tray.tray_group_id)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Status:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            tray.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {tray.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">Batch ID:</span>
                          <span className="text-sm font-semibold text-gray-700">{tray.batch_id}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal('edit', tray)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tray.tray_id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'batches' && (
            <div className="space-y-3">
              {getFilteredData().map((batch) => {
                const deadCount = batch.total_planted - batch.seedlings_alive - batch.fully_grown;
                return (
                  <div key={batch.batch_id} className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{batch.plant_name}</h3>
                          <p className="text-sm text-gray-500">Batch ID: {batch.batch_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openModal('edit', batch)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(batch.batch_id)}
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-white rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Date Planted</p>
                        <p className="text-sm font-semibold text-gray-900">{new Date(batch.date_planted).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Expected Harvest</p>
                        <p className="text-sm font-semibold text-gray-900">{new Date(batch.expected_harvest).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Total Planted</p>
                        <p className="text-xl font-bold text-gray-900">{batch.total_planted}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Seedlings</p>
                        <p className="text-xl font-bold text-[#92e6a7]">{batch.seedlings_alive}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Fully Grown</p>
                        <p className="text-xl font-bold text-[#25a244]">{batch.fully_grown}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Dead</p>
                        <p className="text-xl font-bold text-red-500">{deadCount}</p>
                      </div>
                      <div className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-500 mb-1">Replants</p>
                        <p className="text-xl font-bold text-orange-500">{batch.replant_count}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {modalMode === 'add' ? 'Add New' : 'Edit'} {activeTab === 'trayGroups' ? 'Tray Group' : activeTab === 'trays' ? 'Tray' : 'Plant Batch'}
                </h2>
                <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {activeTab === 'trayGroups' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tray Group Name</label>
                    <input
                      type="text"
                      name="tray_group_name"
                      value={formData.tray_group_name || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                      placeholder="e.g., Leafy Greens"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                      placeholder="e.g., High moisture requirement"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Moisture (%)</label>
                      <input
                        type="number"
                        name="min_moisture"
                        value={formData.min_moisture || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                        placeholder="e.g., 65"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Moisture (%)</label>
                      <input
                        type="number"
                        name="max_moisture"
                        value={formData.max_moisture || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                        placeholder="e.g., 80"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'trays' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plant Name</label>
                    <input
                      type="text"
                      name="plant"
                      value={formData.plant || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                      placeholder="e.g., Lettuce"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tray Group</label>
                    <select
                      name="tray_group_id"
                      value={formData.tray_group_id || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                    >
                      <option value="">Select a tray group</option>
                      {trayGroups.map(group => (
                        <option key={group.tray_group_id} value={group.tray_group_id}>
                          {group.tray_group_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'Active'}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch ID</label>
                    <input
                      type="number"
                      name="batch_id"
                      value={formData.batch_id || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7BA591]"
                      placeholder="e.g., 1"
                    />
                  </div>
                </>
              )}

          {activeTab === 'batches' && (
                <>
                  <input
                    type="text"
                    name="plant_name"
                    placeholder="Plant Name"
                    value={formData.plant_name || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="date"
                    name="date_planted"
                    value={formData.date_planted || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="date"
                    name="expected_harvest"
                    value={formData.expected_harvest || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="number"
                    name="total_planted"
                    placeholder="Total Planted"
                    value={formData.total_planted || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="number"
                    name="seedlings_alive"
                    placeholder="Seedlings Alive"
                    value={formData.seedlings_alive || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="number"
                    name="fully_grown"
                    placeholder="Fully Grown"
                    value={formData.fully_grown || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                  <input
                    type="number"
                    name="replant_count"
                    placeholder="Replant Count"
                    value={formData.replant_count || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
                  />
                </>
              )}

              <button
                onClick={handleSave}
                className="w-full py-3 mt-4 rounded-2xl bg-gradient-to-r from-[#7BA591] to-[#5A8F73] text-white font-semibold hover:shadow-lg transition-all"
              >
                <Save className="inline w-4 h-4 mr-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
};

export default ManagePlants;