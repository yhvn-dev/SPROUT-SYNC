import { Trash2, Pencil, Activity, Thermometer, Droplets, Wind } from "lucide-react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, AreaChart, Area } from 'recharts';
import { Plus } from "lucide-react";

const SensorCard = ({ sensor, onEdit, onDelete, onViewReadings }) => {
  const getStatusColor = (status) => {
    if (status === 'active') return 'bg-[#2dc653] text-white';
    if (status === 'warning') return 'bg-[#fbbf24] text-white';
    return 'bg-[#ef4444] text-white';
  };

  const getSensorIcon = (type) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'humidity': return <Droplets className="w-5 h-5" />;
      case 'pressure': return <Wind className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-[#E8F3ED]">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#b7efc5] to-[#92e6a7] rounded-lg">
            {getSensorIcon(sensor.type)}
          </div>
          <div>
            <h4 className="font-semibold text-[#155d27] text-sm">{sensor.name}</h4>
            <p className="text-xs text-[#5A8F73]">{sensor.code}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.status)}`}>
          {sensor.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[#7BA591]">Location:</span>
          <span className="font-medium text-[#155d27]">{sensor.location}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#7BA591]">Last Reading:</span>
          <span className="font-medium text-[#155d27]">{sensor.lastReading}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#7BA591]">Updated:</span>
          <span className="font-medium text-[#155d27]">{sensor.lastUpdate}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onViewReadings(sensor)}
          className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-[#92e6a7] to-[#6ede8a] hover:from-[#6ede8a] hover:to-[#2dc653] text-white text-xs font-medium transition-all shadow-sm"
        >
          View Readings
        </button>
        <button
          onClick={() => onEdit(sensor)}
          className="px-3 py-2 rounded-lg bg-[#7BA591] hover:bg-[#5A8F73] text-white shadow-sm transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(sensor)}
          className="px-3 py-2 rounded-lg bg-[#ef4444] hover:bg-[#dc2626] text-white shadow-sm transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

function SensorsScreen() {
  // Mock data
  const sensors = [
    { id: 1, name: 'Sensor A1', code: 'SN-001', type: 'temperature', location: 'Bed 1 - Zone A', status: 'active', lastReading: '23.5°C', lastUpdate: '2 min ago' },
    { id: 2, name: 'Sensor B2', code: 'SN-002', type: 'humidity', location: 'Bed 2 - Zone B', status: 'active', lastReading: '65%', lastUpdate: '5 min ago' },
    { id: 3, name: 'Sensor C3', code: 'SN-003', type: 'pressure', location: 'Bed 3 - Zone C', status: 'warning', lastReading: '1013 hPa', lastUpdate: '10 min ago' },
    { id: 4, name: 'Sensor D4', code: 'SN-004', type: 'temperature', location: 'Bed 4 - Zone A', status: 'active', lastReading: '24.1°C', lastUpdate: '1 min ago' },
    { id: 5, name: 'Sensor E5', code: 'SN-005', type: 'humidity', location: 'Bed 5 - Zone B', status: 'inactive', lastReading: 'N/A', lastUpdate: '2 hours ago' },
    { id: 6, name: 'Sensor F6', code: 'SN-006', type: 'temperature', location: 'Bed 6 - Zone C', status: 'active', lastReading: '22.8°C', lastUpdate: '3 min ago' },
  ];

  const readingsData = [
    { time: '00:00', temperature: 22, humidity: 60, pressure: 1012 },
    { time: '04:00', temperature: 21, humidity: 65, pressure: 1013 },
    { time: '08:00', temperature: 23, humidity: 62, pressure: 1014 },
    { time: '12:00', temperature: 25, humidity: 58, pressure: 1015 },
    { time: '16:00', temperature: 24, humidity: 60, pressure: 1013 },
    { time: '20:00', temperature: 23, humidity: 63, pressure: 1012 },
  ];

  const handleOpenInsert = () => {
    console.log("INSERT CLICKED");
  };

  const handleOpenUpdate = (sensor) => {
    console.log("UPDATE CLICKED", sensor);
  };

  const handleOpenDelete = (sensor) => {
    console.log("DELETE CLICKED", sensor);
  };

  const handleViewReadings = (sensor) => {
    console.log("VIEW READINGS CLICKED", sensor);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards - Bento Grid Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#b7efc5] to-[#92e6a7] text-white rounded-xl p-6 shadow-lg">
          <Activity className="w-8 h-8 mb-2 opacity-90" />
          <h3 className="text-sm opacity-90 mb-1">Total Sensors</h3>
          <p className="text-3xl font-bold">{sensors.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#7BA591] to-[#5A8F73] text-white rounded-xl p-6 shadow-lg">
          <div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/20 rounded-lg">✓</div>
          <h3 className="text-sm opacity-90 mb-1">Active Sensors</h3>
          <p className="text-3xl font-bold">{sensors.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#6ede8a] to-[#2dc653] text-white rounded-xl p-6 shadow-lg">
          <div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/20 rounded-lg">⚠</div>
          <h3 className="text-sm opacity-90 mb-1">Warnings</h3>
          <p className="text-3xl font-bold">{sensors.filter(s => s.status === 'warning').length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#208b3a] to-[#155d27] text-white rounded-xl p-6 shadow-lg">
          <div className="w-8 h-8 mb-2 flex items-center justify-center bg-white/20 rounded-lg">📊</div>
          <h3 className="text-sm opacity-90 mb-1">Total Readings</h3>
          <p className="text-3xl font-bold">1,247</p>
        </div>
      </div>


      {/* Sensors Grid (Bento Style) */}
      <div className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#155d27]">Sensors Management</h3>
          <button
            onClick={handleOpenInsert}
            className="flex items-center gap-2 bg-gradient-to-r from-[#92e6a7] to-[#6ede8a] hover:from-[#6ede8a] hover:to-[#2dc653] text-white px-5 py-2.5 rounded-lg transition-all shadow-md font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Sensor
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((sensor) => (
            <SensorCard
              key={sensor.id}
              sensor={sensor}
              onEdit={handleOpenUpdate}
              onDelete={handleOpenDelete}
              onViewReadings={handleViewReadings}
            />
          ))}
        </div>
      </div>

      {/* Readings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#E8F3ED] to-[#C4DED0] p-4">
          <h3 className="text-lg font-semibold text-[#155d27]">Recent Readings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#A8C7B8]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#155d27]">Sensor</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#155d27]">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#155d27]">Reading</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#155d27]">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#155d27]">Timestamp</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#155d27]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8F3ED]">
              {sensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-[#E8F3ED] transition-colors">
                  <td className="px-6 py-4 text-sm text-[#155d27] font-medium">{sensor.name}</td>
                  <td className="px-6 py-4 text-sm text-[#7BA591]">{sensor.type}</td>
                  <td className="px-6 py-4 text-sm text-[#155d27] font-semibold">{sensor.lastReading}</td>
                  <td className="px-6 py-4 text-sm text-[#7BA591]">{sensor.location}</td>
                  <td className="px-6 py-4 text-sm text-[#7BA591]">{sensor.lastUpdate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      sensor.status === 'active' ? 'bg-[var(--color-success-a)] text-white' :
                      sensor.status === 'warning' ? 'bg-[var(--color-warning-a)] text-white' :
                      'bg-[#ef4444] text-white'
                    }`}>
                      {sensor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SensorsScreen;