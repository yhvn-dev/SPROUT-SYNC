import React, { useEffect, useState } from 'react';
import { Droplet, Plus, AlertCircle, ChevronDown, ChevronUp, Sprout, Calendar, TrendingUp } from 'lucide-react';

import { usePlantData } from '../../hooks/plantContext';

function NurseryDashboard(){
  const [expandedZones, setExpandedZones] = useState({});
  const { trayGroups, trays, batches, sensors, readings,loadTrayGroups,loadTrays,loadBatches,loadSensors, loadReadings } = usePlantData();

   useEffect(() => {
    loadTrayGroups()
    loadTrays()
    loadBatches();
    loadSensors()
  }, [loadTrayGroups,loadTrays,loadBatches,loadSensors]);

   useEffect(() => {  
      const interval = setInterval(() => {
        loadReadings();
      }, 5000);
      return () => clearInterval(interval);
  }, [loadBatches, loadReadings]);

  
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

    <main className='bg-white
          flex flex-col items-center justify-start h-full  w-full col-start-2 col-end-4 row-start-3 row-end-3
          rounded-[10px] overflow-hidden'>

      <div className="bg-gradient-to-br from-[#E8F3ED] to-white p-4 overflow-hidden w-full">
    
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
              {trayGroups.length > 0 && trayGroups.map((group) => {
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


                    {isExpanded && (
                      <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {groupTrays.map(tray => {
                            // Find sensor for the tray
                            const sensor = sensors.find(s => s.tray_id === tray.tray_id);
                            const reading = sensor ? readings.find(r => r.sensor_id === sensor.sensor_id) : null;
                            const moistureValue = reading ? reading.value : 0;
                            const moistureStatus = getMoistureStatus(moistureValue, group.min_moisture, group.max_moisture);

                            return (
                              <div key={tray.tray_id} className="bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] rounded-2xl p-4 hover:shadow-md transition-shadow">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{tray.plant}</h3>
                                    <p className="text-xs text-gray-600">{tray.status}</p>
                                  </div>
                                
                                </div>

                                {/* Soil Moisture UI */}
                                {sensor && (
                                  <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <div className="flex">
                                      <div 
                                        className="w-20 h-10 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${moistureStatus.color}15` }}
                                      >
                                        <Droplet className="w-5 h-5" style={{ color: moistureStatus.color }} />
                                      </div>

                                      <div className='w-full mx-4'>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{sensor.sensor_type} Sensor</p>
                                        <p className="text-2xl font-bold text-gray-900">{moistureValue}%</p>
                                      </div>   
                                  
                                      <div className='flex-row-reverse '>                                       
                                          {sensor && (
                                            <div 
                                              className="px-3 py-1 rounded-full text-xs font-medium"
                                              style={{ 
                                                backgroundColor: `${moistureStatus.color}15`,
                                                color: moistureStatus.color 
                                              }}
                                            >
                                              {moistureStatus.label}
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                )}


                              </div>
                            );
                          })}
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

                  
                  {batches.length > 0 && batches.map(batch => (
                    <div key={batch.batch_id} className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-base font-semibold text-gray-900">{batch.plant_name}</h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-600">Planted: {new Date(batch.date_planted).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-600">Harvest at : {batch.expected_harvest_days} days</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Seedlings</p>
                          <p className="text-lg font-bold text-[#25a244]">{batch.total_seedlings}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Grown</p>
                          <p className="text-lg font-bold text-[#208b3a]">{batch.fully_grown_seedlings}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Replants</p>
                          <p className="text-lg font-bold text-gray-600">{batch.replanted_seedlings}</p>
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

      </main>
  );
};

export default NurseryDashboard;
