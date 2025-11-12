import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';


const moistureData = [
{ time: '00:00', value: 45 },
{ time: '04:00', value: 42 },
{ time: '08:00', value: 65 },
{ time: '12:00', value: 58 },
{ time: '16:00', value: 52 },
{ time: '20:00', value: 48 },
{ time: '24:00', value: 44 }
];


export function Trends() {
  return (
     <div className="grid grid-cols-2 gap-4 h-[calc(100vh-140px)]">

        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-semibold text-[#003333] mb-4">Multi-Metric Comparison</h3>
            <ResponsiveContainer width="100%" height="90%">
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
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="value" stroke="#027c68" name="Moisture" strokeWidth={2} />
            </LineChart>
            </ResponsiveContainer>
        </div>
</div>
  )
}
