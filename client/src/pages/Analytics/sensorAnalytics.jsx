import { Droplets, Activity, Waves, Thermometer } from 'lucide-react';

const metricsData = {
  moisture: { current: 68, average: 65.5, min: 58, max: 75, unit: '%', status: 'Optimal' },
  ph: { current: 6.7, average: 6.6, min: 6.3, max: 7.0, unit: 'pH', status: 'Good' },
  temperature: { current: 27.5, average: 26.8, min: 23, max: 34, unit: '°C', status: 'Normal' },
  waterLevel: { current: 82, average: 78.5, min: 65, max: 95, unit: '%', status: 'High' }
};

// Status color function
const getStatusColors = (status) => {
  const s = status.toLowerCase();
  if (s.includes('high') || s.includes('critical') || s.includes('danger'))
    return { bg: 'hsl(353, 40%, 90%)', text: 'hsl(355, 100%, 70%)', border: 'hsl(355,100%, 85%)' };
  if (s.includes('warning') || s.includes('medium') || s.includes('moderate'))
    return { bg: 'hsl(35, 80%, 90%)', text: 'hsl(35, 80%, 40%)', border: 'hsl(35, 80%, 70%)' };
  if (s.includes('optimal') || s.includes('good') || s.includes('normal') || s.includes('healthy'))
    return { bg: 'hsl(110, 58%, 90%)', text: 'hsl(125, 85%, 35%)', border: 'hsl(125, 85%, 60%)' };
  if (s.includes('low'))
    return { bg: 'hsl(160,60%, 90%)', text: 'hsl(160,60%, 40%)', border: 'hsl(160,60%, 70%)' };
  return { bg: 'hsl(0, 0%, 90%)', text: 'hsl(0, 0%, 40%)', border: 'hsl(0, 0%, 70%)' };
};

const MetricCard = ({ icon: Icon, title, data, gradient, iconColor }) => {
  const statusColors = getStatusColors(data.status);
  
  return (
    <div className="w-full h-full bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition-all relative overflow-hidden border border-gray-100">
      <div className="absolute inset-0 opacity-5" style={{ background: gradient }} />
      <div className="relative h-full flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md" style={{ backgroundColor: iconColor + '20' }}>
              <Icon size={16} style={{ color: iconColor }} />
            </div>
            <h3 className="text-xs font-semibold" style={{ color: '#003333' }}>
              {title}
            </h3>
          </div>
          <div
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold border"
            style={{
              backgroundColor: statusColors.bg,
              color: statusColors.text,
              borderColor: statusColors.border
            }}
          >
            {data.status}
          </div>
        </div>

        {/* Current Reading */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold" style={{ color: iconColor }}>
              {data.current}
            </span>
            <span className="text-sm font-medium" style={{ color: '#6b7070' }}>
              {data.unit}
            </span>
          </div>
          <p className="text-xs mt-0.5" style={{ color: '#6b7070' }}>
            Current Reading
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-auto">
          <div className="p-1.5 rounded-md" style={{ backgroundColor: '#E8F3ED' }}>
            <p className="text-[10px] font-medium mb-0.5" style={{ color: '#6b7070' }}>Avg</p>
            <p className="text-xs font-bold" style={{ color: '#5A8F73' }}>
              {data.average}{data.unit}
            </p>
          </div>

          <div className="p-1.5 rounded-md" style={{ backgroundColor: '#E8F3ED' }}>
            <p className="text-[10px] font-medium mb-0.5" style={{ color: '#6b7070' }}>Min</p>
            <p className="text-xs font-bold" style={{ color: '#027c68' }}>
              {data.min}{data.unit}
            </p>
          </div>

          <div className="p-1.5 rounded-md" style={{ backgroundColor: '#E8F3ED' }}>
            <p className="text-[10px] font-medium mb-0.5" style={{ color: '#6b7070' }}>Max</p>
            <p className="text-xs font-bold" style={{ color: '#208b3a' }}>
              {data.max}{data.unit}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8F3ED' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (data.current / data.max) * 100)}%`,
                background: gradient
              }}
            />
          </div>
          <div className="flex justify-between mt-0.5">
            <span className="text-[10px]" style={{ color: '#6b7070' }}>
              {data.min}{data.unit}
            </span>
            <span className="text-[10px]" style={{ color: '#6b7070' }}>
              {data.max}{data.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SensorAnalytics() {
  return (
    <div className="p-4 gap-4" style={{ backgroundColor: '#E8F3ED' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb-4" style={{ color: '#003333' }}>
          Sensor Analytics Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3">
          <MetricCard
            icon={Droplets}
            title="Soil Moisture"
            data={metricsData.moisture}
            gradient="linear-gradient(135deg, #027c68 0%, #009983 100%)"
            iconColor="#027c68"
          />
          <MetricCard
            icon={Activity}
            title="pH Level"
            data={metricsData.ph}
            gradient="linear-gradient(135deg, #208b3a 0%, #25a244 100%)"
            iconColor="#208b3a"
          />
          <MetricCard
            icon={Thermometer}
            title="Temperature"
            data={metricsData.temperature}
            gradient="linear-gradient(135deg, #7BA591 0%, #A8C7B8 100%)"
            iconColor="#5A8F73"
          />
          <MetricCard
            icon={Waves}
            title="Water Level"
            data={metricsData.waterLevel}
            gradient="linear-gradient(135deg, #2dc653 0%, #6ede8a 100%)"
            iconColor="#25a244"
          />
        </div>
      </div>
    </div>
  );
}
