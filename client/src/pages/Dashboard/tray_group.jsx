import React from 'react';

const TrayGroup = ({ trayGroups = [], trays = [], sensors = [], readings = [], setOpenModal }) => {
  return (
    <main className="max-w-[1400px] mx-auto w-full">
      <div className="bg-white bg-opacity-95 rounded-xl px-4 py-8 shadow-lg">

        {/* Vertical Stack of Zones */}
        <div className="flex flex-col gap-6">
          {trayGroups.length > 0 ? (
            trayGroups.map((group, index) => (
              <div 
                key={group.tray_group_id || index} 
                className="shadow-2xl rounded-xl p-4 bg-[var(--sage-lighter)]"
              >
                {/* Zone Header */}
                <div className="flex justify-between items-center mb-3 py-4">
                  <h2 className="text-lg font-medium">
                    Zone {index + 1}: {group.tray_group_name}
                  </h2>
                  <div className='flex items-center justify-end flex-row-reverse'>
                    <button 
                      onClick={() => setOpenModal(true)} 
                      className='mx-4 text-sm rounded-lg border-1 border-[var(--acc-darkc)] px-4 py-[1px]'
                    >
                      Modify
                    </button>
                    <span className="text-sm text-gray-700">
                      Threshold: {group.min_moisture} - {group.max_moisture}
                    </span>
                  </div>
                </div>


                {/* Trays */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trays
                    .filter(tray => tray.tray_group_id === group.tray_group_id)
                    .map(tray => (
                      <div key={tray.tray_id} className="flex flex-col p-4 bg-white rounded-2xl shadow-md">
                        <ul className='flex items-center justify-between w-full'>
                          <li className="text-xs text-gray-500">Status: {tray.status}</li>
                           <li className="text-xs text-gray-500">{tray.plant} Tray</li>
                        </ul>
                     
                        {/* Sensors per tray */}    
                        <div className="mt-2 shadow-lg bg-[var(--sage-light)] rounded-2xl p-4">
                          {sensors.filter(sensor => sensor.tray_id === tray.tray_id).length > 0 ? (
                            sensors
                              .filter(sensor => sensor.tray_id === tray.tray_id)
                              .map(sensor => {
                                // Get readings for this sensor
                                const sensorReadings = readings.filter(r => r.sensor_id === sensor.sensor_id);
                                const latestReading = sensorReadings.length > 0 
                                  ? sensorReadings.reduce((latest, current) => {
                                      return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
                                    }, sensorReadings[0])
                                  : null;

                                return (
                                  <ul key={sensor.sensor_id} className="mb-2">
                                    <li className="text-sm font-medium">{sensor.sensor_type}</li>
                                    <li className="text-xl text-white font-bold">
                                      {latestReading ? `${latestReading.value}%` : '--'}
                                    </li>
                                  
                                  </ul>
                                );
                              })
                          ) : (
                            <p className="text-sm">No sensors in this tray</p>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No zones available.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default TrayGroup;
