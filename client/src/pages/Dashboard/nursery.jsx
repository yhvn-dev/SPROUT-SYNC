import React, { useState } from 'react';
import { Droplet, Plus, AlertCircle, ChevronDown, ChevronUp, Sprout, Calendar, TrendingUp } from 'lucide-react';

const NurseryDashboard = () => {
  const [expandedZones, setExpandedZones] = useState({});
  
  // Sample data
  const trayGroups = [
    { 
      tray_group_id: 1, 
      tray_group_name: 'Leafy Greens', 
      min_moisture: 65, 
      max_moisture: 80,
      description: 'High moisture requirement'
    },
    { 
      tray_group_id: 2, 
      tray_group_name: 'Herbs', 
      min_moisture: 50, 
      max_moisture: 70,
      description: 'Medium moisture requirement'
    },
    { 
      tray_group_id: 3, 
      tray_group_name: 'Succulents', 
      min_moisture: 30, 
      max_moisture: 45,
      description: 'Low moisture requirement'
    }
  ];

  const trays = [
    { tray_id: 1, tray_group_id: 1, plant: 'Lettuce', status: 'Active', batch_id: 1 },
    { tray_id: 2, tray_group_id: 1, plant: 'Spinach', status: 'Active', batch_id: 2 },
    { tray_id: 3, tray_group_id: 1, plant: 'Kale', status: 'Active', batch_id: 3 },
    { tray_id: 4, tray_group_id: 1, plant: 'Arugula', status: 'Inactive', batch_id: 4 },
    { tray_id: 5, tray_group_id: 2, plant: 'Basil', status: 'Active', batch_id: 5 },
    { tray_id: 6, tray_group_id: 2, plant: 'Cilantro', status: 'Active', batch_id: 6 },
    { tray_id: 7, tray_group_id: 2, plant: 'Parsley', status: 'Active', batch_id: 7 },
    { tray_id: 8, tray_group_id: 3, plant: 'Aloe', status: 'Active', batch_id: 8 },
    { tray_id: 9, tray_group_id: 3, plant: 'Jade', status: 'Active', batch_id: 9 }
  ];

  const sensors = [
    { sensor_id: 1, tray_id: 1, sensor_type: 'Moisture' },
    { sensor_id: 2, tray_id: 2, sensor_type: 'Moisture' },
    { sensor_id: 3, tray_id: 3, sensor_type: 'Moisture' },
    { sensor_id: 4, tray_id: 4, sensor_type: 'Moisture' },
    { sensor_id: 5, tray_id: 5, sensor_type: 'Moisture' },
    { sensor_id: 6, tray_id: 6, sensor_type: 'Moisture' },
    { sensor_id: 7, tray_id: 7, sensor_type: 'Moisture' },
    { sensor_id: 8, tray_id: 8, sensor_type: 'Moisture' },
    { sensor_id: 9, tray_id: 9, sensor_type: 'Moisture' }
  ];

  const readings = [
    { reading_id: 1, sensor_id: 1, value: 72, created_at: '2024-01-15T10:30:00' },
    { reading_id: 2, sensor_id: 2, value: 45, created_at: '2024-01-15T10:30:00' },
    { reading_id: 3, sensor_id: 3, value: 78, created_at: '2024-01-15T10:30:00' },
    { reading_id: 4, sensor_id: 4, value: 0, created_at: '2024-01-15T10:30:00' },
    { reading_id: 5, sensor_id: 5, value: 58, created_at: '2024-01-15T10:30:00' },
    { reading_id: 6, sensor_id: 6, value: 85, created_at: '2024-01-15T10:30:00' },
    { reading_id: 7, sensor_id: 7, value: 62, created_at: '2024-01-15T10:30:00' },
    { reading_id: 8, sensor_id: 8, value: 38, created_at: '2024-01-15T10:30:00' },
    { reading_id: 9, sensor_id: 9, value: 42, created_at: '2024-01-15T10:30:00' }
  ];

  const plantBatches = [
    { 
      batch_id: 1, 
      plant_name: 'Lettuce', 
      date_planted: '2024-01-05', 
      expected_harvest: '2024-02-20', 
      seedlings_alive: 48,
      fully_grown: 12,
      replant_count: 2 
    },
    { 
      batch_id: 2, 
      plant_name: 'Spinach', 
      date_planted: '2024-01-08', 
      expected_harvest: '2024-02-25', 
      seedlings_alive: 52,
      fully_grown: 8,
      replant_count: 1 
    },
    { 
      batch_id: 5, 
      plant_name: 'Basil', 
      date_planted: '2024-01-10', 
      expected_harvest: '2024-03-01', 
      seedlings_alive: 45,
      fully_grown: 15,
      replant_count: 0 
    }
  ];

  const getMoistureStatus = (value, min, max) => {
    if (value === 0) return { status: 'inactive', color: '#94a3b8', label: 'Inactive' };
    if (value < min) return { status: 'low', color: '#dc2626', label: 'Low' };
    if (value > max) return { status: 'high', color: '#2563eb', label: 'High' };
    return { status: 'optimal', color: '#25a244', label: 'Optimal' };
  };

  const toggleZone = (zoneId) => {
    setExpandedZones(prev => ({
      ...prev,
      [zoneId]: !prev[zoneId]
    }));
  };

  const alerts = [
    { id: 1, type: 'warning', message: 'Spinach moisture below threshold (45%)' },
    { id: 2, type: 'alert', message: 'Cilantro moisture above threshold (85%)' }
  ];

  return (
    <div className="bg-gradient-to-br from-[#E8F3ED] to-white p-4 overflow-y-auto w-full">
      <style>{`
        :root {
          --ptl-greena: #b7efc5;
          --ptl-greenb: #92e6a7;
          --ptl-greenc: #6ede8a;
          --ptl-greend: #2dc653;
          --ptl-greene: #25a244;
          --ptl-greenf: #208b3a;
          --ptl-greeng: #1a7431;
          --ptl-greenh: #155d27;
          --ptl-greenj: #10451d;
          --sage: #7BA591;
          --sage-light: #A8C7B8;
          --sage-lighter: #E8F3ED;
          --sage-dark: #5A8F73;
          --sage-medium: #C4DED0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Nursery Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor and manage your plant cultivation</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-[#25a244] animate-pulse"></div>
              Live monitoring
            </div>
          </div>
        </div>

  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content - Zones */}
          <div className="lg:col-span-2 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {trayGroups.map((group, index) => {
              const isExpanded = expandedZones[group.tray_group_id];
              const groupTrays = trays.filter(t => t.tray_group_id === group.tray_group_id);
              
              return (
                <div key={group.tray_group_id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Zone Header */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleZone(group.tray_group_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A8C7B8] to-[#7BA591] flex items-center justify-center">
                          <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{group.tray_group_name}</h2>
                          <p className="text-sm text-gray-500">{group.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Threshold</p>
                          <p className="text-sm font-medium text-gray-900">{group.min_moisture}% - {group.max_moisture}%</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-600" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trays Grid */}
                  {isExpanded && (
                    <div className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {groupTrays.map(tray => {
                          const sensor = sensors.find(s => s.tray_id === tray.tray_id);
                          const reading = sensor ? readings.find(r => r.sensor_id === sensor.sensor_id) : null;
                          const moistureValue = reading ? reading.value : 0;
                          const moistureStatus = getMoistureStatus(moistureValue, group.min_moisture, group.max_moisture);

                          return (
                            <div key={tray.tray_id} className="bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] rounded-2xl p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{tray.plant}</h3>
                                  <p className="text-xs text-gray-600">{tray.status}</p>
                                </div>
                                <div 
                                  className="px-3 py-1 rounded-full text-xs font-medium"
                                  style={{ 
                                    backgroundColor: `${moistureStatus.color}15`,
                                    color: moistureStatus.color 
                                  }}
                                >
                                  {moistureStatus.label}
                                </div>
                              </div>

                              <div className="bg-white rounded-xl p-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${moistureStatus.color}15` }}
                                  >
                                    <Droplet className="w-5 h-5" style={{ color: moistureStatus.color }} />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Soil Moisture</p>
                                    <p className="text-2xl font-bold text-gray-900">{moistureValue}%</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Add Tray Button */}
                        <button className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4 hover:border-[#7BA591] hover:bg-gray-50 transition-all flex flex-col items-center justify-center min-h-[140px] group">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[#E8F3ED] flex items-center justify-center mb-2 transition-colors">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#7BA591]" />
                          </div>
                          <p className="text-sm font-medium text-gray-600 group-hover:text-[#7BA591]">Add Tray</p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar - Plant Batches */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Plant Batches</h2>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto">
                {plantBatches.map(batch => (
                  <div key={batch.batch_id} className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900">{batch.plant_name}</h3>
                      <button className="text-xs text-[#7BA591] hover:text-[#5A8F73] font-medium">Edit</button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600">Planted: {new Date(batch.date_planted).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600">Harvest: {new Date(batch.expected_harvest).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Seedlings</p>
                        <p className="text-lg font-bold text-[#25a244]">{batch.seedlings_alive}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Grown</p>
                        <p className="text-lg font-bold text-[#208b3a]">{batch.fully_grown}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Replants</p>
                        <p className="text-lg font-bold text-gray-600">{batch.replant_count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseryDashboard;