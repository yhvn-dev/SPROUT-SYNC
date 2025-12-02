import React, { useState, useEffect } from 'react';
import { Droplets, Thermometer, Sun, Wind } from 'lucide-react';

const Trays = () => {
  const [trayGroups, setTrayGroups] = useState([
    {
      id: 'group-a',
      name: 'North Wing - Zone A',
      trays: [
        {
          id: 'tray-a1',
          name: 'Tray A1',
          sensors: [
            { id: 's1', type: 'moisture', value: 65, unit: '%', position: 'top-left' },
        
          ]
        },
        {
          id: 'tray-a2',
          name: 'Tray A2',
          sensors: [
            { id: 's4', type: 'moisture', value: 72, unit: '%', position: 'top-left' },
       
          ]
        },
        {
          id: 'tray-a3',
          name: 'Tray A3',
          sensors: [
            { id: 's6', type: 'moisture', value: 58, unit: '%', position: 'center' },
      
          ]
        }
      ]
    },
    {
      id: 'group-b',
      name: 'South Wing - Zone B',
      trays: [
        {
          id: 'tray-b1',
          name: 'Tray B1',
          sensors: [
            { id: 's9', type: 'moisture', value: 68, unit: '%', position: 'top-left' },
          
          ]
        },
        {
          id: 'tray-b2',
          name: 'Tray B2',
          sensors: [
            { id: 's11', type: 'moisture', value: 75, unit: '%', position: 'top-right' },
            
          ]
        }
      ]
    },
    {
      id: 'group-c',
      name: 'East Wing - Zone C',
      trays: [
        {
          id: 'tray-c1',
          name: 'Tray C1',
          sensors: [
            { id: 's14', type: 'moisture', value: 61, unit: '%', position: 'center' },
         
          ]
        },
        {
          id: 'tray-c2',
          name: 'Tray C2',
          sensors: [
            { id: 's16', type: 'moisture', value: 70, unit: '%', position: 'top-left' },
         
          ]
        },
        {
          id: 'tray-c3',
          name: 'Tray C3',
          sensors: [
            { id: 's18', type: 'moisture', value: 25, unit: '°%', position: 'top-left' },
      
          ]
        }
      ]
    }
  ]);

  const getSensorIcon = (type) => {
    switch(type) {
      case 'moisture': return <Droplets className="w-4 h-4" />;
      case 'temp': return <Thermometer className="w-4 h-4" />;
      case 'light': return <Sun className="w-4 h-4" />;
      case 'humidity': return <Wind className="w-4 h-4" />;
      default: return <Droplets className="w-4 h-4" />;
    }
  };

  const getSensorColor = (type, value) => {
    if (type === 'moisture') {
      if (value >= 70) return '#2dc653';
      if (value >= 60) return '#92e6a7';
      return '#027c68';
    }
    if (type === 'ph') {
      if (value >= 6.0 && value <= 7.0) return '#25a244';
      return '#b0e892';
    }
    if (type === 'temp') {
      if (value >= 22 && value <= 26) return '#6ede8a';
      return '#7BA591';
    }
    return '#5A8F73';
  };

  const getPositionClasses = (position) => {
    switch(position) {
      case 'top-left': return 'absolute top-2 left-2';
      case 'top-right': return 'absolute top-2 right-2';
      case 'bottom-left': return 'absolute bottom-2 left-2';
      case 'bottom-right': return 'absolute bottom-2 right-2';
      case 'center': return 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'absolute top-2 left-2';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTrayGroups(prev => prev.map(group => ({
        ...group,
        trays: group.trays.map(tray => ({
          ...tray,
          sensors: tray.sensors.map(sensor => ({
            ...sensor,
            value: sensor.type === 'moisture' 
              ? Math.max(50, Math.min(85, sensor.value + (Math.random() - 0.5) * 2))
              : sensor.type === 'ph'
              ? Math.max(5.5, Math.min(7.5, sensor.value + (Math.random() - 0.5) * 0.2))
              : sensor.type === 'temp'
              ? Math.max(20, Math.min(30, sensor.value + (Math.random() - 0.5) * 1))
              : sensor.value + (Math.random() - 0.5) * 10
          }))
        }))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (

      <div className="max-w-[1400px] mx-auto w-full">
        <div className="bg-white bg-opacity-95 rounded-xl p-8 shadow-lg">
          <div className="flex flex-col gap-8">
            {trayGroups.map(group => (
              <div key={group.id} className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-green-900 mb-4">{group.name}</h2>
                <div className="flex gap-6 overflow-x-auto pb-4">
                  {group.trays.map(tray => (
                    <div key={tray.id} className="min-w-[280px] bg-white rounded-lg p-5 shadow-md border-2 border-green-100 relative">
                      <h3 className="text-center font-semibold text-green-700 mb-4">{tray.name}</h3>
                      <div className="relative h-60 bg-gradient-to-br from-green-50 to-white rounded-lg border-2 border-dashed border-green-200">
                        {tray.sensors.map(sensor => (
                          <div
                            key={sensor.id}
                            className={`${getPositionClasses(sensor.position)} rounded-lg p-3 min-w-[90px] text-white shadow-md border-2 border-white/30 transition-all`}
                            style={{ backgroundColor: getSensorColor(sensor.type, sensor.value) }}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {getSensorIcon(sensor.type)}
                              <span className="text-xs font-semibold uppercase opacity-90">{sensor.type}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-bold">{sensor.value.toFixed(1)}</span>
                              <span className="text-xs opacity-90">{sensor.unit}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-2 bg-green-50 rounded text-xs text-green-700 text-center">
                        {tray.sensors.length} sensor{tray.sensors.length !== 1 ? 's' : ''} active
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

  );
};

export default Trays;
