import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { Droplets, Activity, AlertTriangle,  Leaf,Sun,Wind} from 'lucide-react';


  // Sample data
const moistureData = [
    { time: '00:00', value: 45 },
    { time: '04:00', value: 42 },
    { time: '08:00', value: 65 },
    { time: '12:00', value: 58 },
    { time: '16:00', value: 52 },
    { time: '20:00', value: 48 },
    { time: '24:00', value: 44 }
];

const waterUsageData = [
    { day: 'Mon', usage: 12 },
    { day: 'Tue', usage: 15 },
    { day: 'Wed', usage: 10 },
    { day: 'Thu', usage: 18 },
    { day: 'Fri', usage: 14 },
    { day: 'Sat', usage: 11 },
    { day: 'Sun', usage: 13 }
  ];

// Gauge Component
const GaugeChart = ({ value, max, label, unit, icon: Icon, color }) => {
  const percentage = (value / max) * 100;
  const rotation = (percentage / 100) * 180 - 90;
  
  return (
    <div className=" flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="8"/>
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-6 h-6 mb-1" style={{ color }} />
          <span className="text-xl font-bold text-[#003333]">{value}</span>
          <span className="text-xs text-[#5A8F73]">{unit}</span>
        </div>
      </div>
      <p className="text-sm text-[#003333] mt-3 font-medium">{label}</p>
    </div>
  );
};


// Alert Component
const AlertItem = ({ type, message, time }) => {
  const colors = {
    warning: { bg: '#fff3cd', border: '#ffc107', text: '#856404' },
    error: { bg: '#f8d7da', border: '#dc3545', text: '#721c24' },
    success: { bg: '#d4edda', border: '#28a745', text: '#155724' }
  };
  
  const color = colors[type] || colors.warning;
  
  return (
    <div 
      className="flex items-start gap-3 p-3 rounded-lg mb-2 transition-all hover:shadow-md"
      style={{ backgroundColor: color.bg, borderLeft: `3px solid ${color.border}` }}
    >
      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: color.border }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium" style={{ color: color.text }}>{message}</p>
        <p className="text-xs mt-1 opacity-70" style={{ color: color.text }}>{time}</p>
      </div>
    </div>
  );
};


export function Overview(){

    return(
        <>
        <div className="grid grid-cols-12 gap-4 row-span-full ">

            {/* Plant Health Score - Large Card */}
            <div className="col-span-4 row-span-2 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[#003333]">Plant Health Index</h3>
                <Leaf className="w-5 h-5 text-[#7BA591]" />
                </div>
                <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                <div className="relative w-40 h-40 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="10"/>
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#b0e892"
                        strokeWidth="10"
                        strokeDasharray="254 282.7"
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                    />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-[#003333]">90</span>
                    <span className="text-sm text-[#5A8F73]">Optimal</span>
                    </div>
                </div>
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs">
                    <span className="text-[#5A8F73]">Moisture</span>
                    <span className="font-medium text-[#003333]">Excellent</span>
                    </div>
                    <div className="flex justify-between text-xs">
                    <span className="text-[#5A8F73]">Temperature</span>
                    <span className="font-medium text-[#003333]">Good</span>
                    </div>
                    <div className="flex justify-between text-xs">
                    <span className="text-[#5A8F73]">Light</span>
                    <span className="font-medium text-[#003333]">N/A</span>
                    </div>
                </div>
                </div>
            </div>
            

            {/* Gauges Row */}
            <div className="col-span-8 grid grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                <GaugeChart value={48} max={100} label="Moisture" unit="%" icon={Droplets} color="#027c68" />
                </div>
               
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all">
                <GaugeChart value={6.8} max={14} label="Water Level" unit="" icon={Droplets} color="#8f9bbc" />
                </div>
               {/* Temperature Gauge */}
             
            </div>
            


            {/* Moisture Trend Chart */}
            <div className="col-span-8 row-span-2 bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">
                <h3 className="text-sm font-semibold text-[#003333] mb-4">Soil Moisture Trend</h3>
                <ResponsiveContainer width="100%" height="85%">
                <LineChart data={moistureData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E8F3ED" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#5A8F73' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#5A8F73' }} />
                    <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                    }} 
                    />
                    <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#027c68" 
                    strokeWidth={3}
                    dot={{ fill: '#027c68', r: 4 }}
                    activeDot={{ r: 6 }}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
         
           
            {/* Alerts */}
            <div className="col-span-4 bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all overflow-y-auto">
                <h3 className="text-sm font-semibold text-[#003333] mb-4">Recent Alerts</h3>
                <AlertItem type="success" message="Watering cycle completed successfully" time="2 hours ago" />
                <AlertItem type="warning" message="Moisture level approaching threshold" time="5 hours ago" />
                <AlertItem type="success" message="System diagnostics passed" time="1 day ago" />
            </div>
        </div>


        </>
    )
   

}