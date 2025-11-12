import { Droplets, Activity, Waves, Thermometer } from 'lucide-react';

const metricsData = {
  moisture: {
    current: 68,
    average: 65.5,
    min: 58,
    max: 75,
    unit: '%',
    status: 'Optimal'
  },
  ph: {
    current: 6.7,
    average: 6.6,
    min: 6.3,
    max: 7.0,
    unit: 'pH',
    status: 'Good'
  },
  temperature: {
    current: 27.5,
    average: 26.8,
    min: 23,
    max: 34,
    unit: '°C',
    status: 'Normal'
  },
  waterLevel: {
    current: 82,
    average: 78.5,
    min: 65,
    max: 95,
    unit: '%',
    status: 'High'
  }
};


// Function to get status colors based on status text
const getStatusColors = (status) => {
  const statusLower = status.toLowerCase();
  
  // Danger/Critical/High states
  if (statusLower.includes('high') || statusLower.includes('critical') || statusLower.includes('danger')) {
    return {
      bg: 'hsl(353, 40%, 90%)',      // color-danger-c (light red bg)
      text: 'hsl(355, 100%, 70%)',   // color-danger-a (red text)
      border: 'hsl(355,100%, 85%)'   // color-danger-b (red border)
    };
  }
  
  // Warning/Medium states
  if (statusLower.includes('warning') || statusLower.includes('medium') || statusLower.includes('moderate')) {
    return {
      bg: 'hsl(35, 80%, 90%)',       // lighter warning bg
      text: 'hsl(35, 80%, 40%)',     // darker warning text
      border: 'hsl(35, 80%, 70%)'    // color-warning (orange border)
    };
  }
  
  // Success/Good/Optimal/Normal states
  if (statusLower.includes('optimal') || statusLower.includes('good') || 
      statusLower.includes('normal') || statusLower.includes('healthy')) {
    return {
      bg: 'hsl(110, 58%, 90%)',      // color-success-a-soft (light green bg)
      text: 'hsl(125, 85%, 35%)',    // darker green text
      border: 'hsl(125, 85%, 60%)'   // color-success-a (green border)
    };
  }
  
  // Low states (can be good or bad depending on context)
  if (statusLower.includes('low')) {
    return {
      bg: 'hsl(160,60%, 90%)',       // light cyan bg
      text: 'hsl(160,60%, 40%)',     // darker cyan text
      border: 'hsl(160,60%, 70%)'    // color-success-c (cyan border)
    };
  }
  
  // Disabled/Unknown states
  return {
    bg: 'hsl(0, 0%, 90%)',           // color-sign-disabled
    text: 'hsl(0, 0%, 40%)',         // gray text
    border: 'hsl(0, 0%, 70%)'        // gray border
  };
};


const MetricCard = ({ icon: Icon, title, data, gradient, iconColor }) => {
  const statusColors = getStatusColors(data.status);
  
  return (
    <div className="w-full h-full bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all relative overflow-hidden border border-gray-100">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: gradient }}
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: iconColor + '20' }}
            >
              <Icon size={18} style={{ color: iconColor }} />
            </div>
            <h3 
              className="text-sm font-semibold"
              style={{ color: '#003333' }}
            >
              {title}
            </h3>
          </div>
          <div 
            className="text-xs px-3 py-1 rounded-full font-semibold border"
            style={{ 
              backgroundColor: statusColors.bg,
              color: statusColors.text,
              borderColor: statusColors.border
            }}
          >
            {data.status}
          </div>
        </div>

        {/* Current Value - Large Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span 
              className="text-4xl font-bold"
              style={{ color: iconColor }}
            >
              {data.current}
            </span>
            <span 
              className="text-lg font-medium"
              style={{ color: '#6b7070' }}
            >
              {data.unit}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: '#6b7070' }}>
            Current Reading
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mt-auto">
          {/* Average */}
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#E8F3ED' }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7070' }}>
              Average
            </p>
            <p className="text-sm font-bold" style={{ color: '#5A8F73' }}>
              {data.average}{data.unit}
            </p>
          </div>

          {/* Minimum */}
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#E8F3ED' }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7070' }}>
              Min
            </p>
            <p className="text-sm font-bold" style={{ color: '#027c68' }}>
              {data.min}{data.unit}
            </p>
          </div>

          {/* Maximum */}
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: '#E8F3ED' }}
          >
            <p className="text-xs font-medium mb-1" style={{ color: '#6b7070' }}>
              Max
            </p>
            <p className="text-sm font-bold" style={{ color: '#208b3a' }}>
              {data.max}{data.unit}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div 
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: '#E8F3ED' }}
          >
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(100, (data.current / data.max) * 100)}%`,
                background: gradient
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: '#6b7070' }}>
              {data.min}{data.unit}
            </span>
            <span className="text-xs" style={{ color: '#6b7070' }}>
              {data.max}{data.unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SensorAnalytics() {
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#E8F3ED' }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#003333' }}>
          Sensor Analytics Dashboard
        </h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* Moisture Card - Teal/Cyan */}
          <MetricCard
            icon={Droplets}
            title="Soil Moisture"
            data={metricsData.moisture}
            gradient="linear-gradient(135deg, #027c68 0%, #009983 100%)"
            iconColor="#027c68"
          />

          {/* pH Level Card - Deep Green */}
          <MetricCard
            icon={Activity}
            title="pH Level"
            data={metricsData.ph}
            gradient="linear-gradient(135deg, #208b3a 0%, #25a244 100%)"
            iconColor="#208b3a"
          />

          {/* Temperature Card - Sage */}
          <MetricCard
            icon={Thermometer}
            title="Temperature"
            data={metricsData.temperature}
            gradient="linear-gradient(135deg, #7BA591 0%, #A8C7B8 100%)"
            iconColor="#5A8F73"
          />

          {/* Water Level Card - Vibrant Green */}
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