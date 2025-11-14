import { useState } from 'react';
import { Plus} from 'lucide-react';
import { Tooltip,  ResponsiveContainer,  Pie, PieChart ,Cell } from 'recharts';



function SensorsScreen({COLORS}) {


  return (
  <div className="space-y-6">
    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--ptl-greena)] to-[var(--ptl-greenb)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Total Sensors</h3>
            {/* <p className="text-4xl font-bold">{sensors.length}</p> */}
        </div>
        <div className="bg-gradient-to-br from-[var(--color-success-a)] to-[var(--color-success-c)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Active Sensors</h3>
            {/* <p className="text-4xl font-bold">{sensors.filter(s => s.status === 'active').length}</p> */}
        </div>
        <div className="bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-danger-a)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Inactive Sensors</h3>
            {/* <p className="text-4xl font-bold">{sensors.filter(s => s.status === 'inactive').length}</p> */}
        </div>
    </div>

    {/* Chart */}
    <div className="bg-white rounded-lg p-6 shadow-md">
    <h3 className="text-lg font-semibold text-[var(--ptl-greenh)] mb-4">Sensor Type Distribution</h3>
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
        <Pie

            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="var(--ptl-greenb)"
            dataKey="value"
        >
            
        </Pie>
        <Tooltip />
        </PieChart>
    </ResponsiveContainer>
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="flex justify-between items-center p-4 bg-[var(--sage-lighter)]">
        <h3 className="text-lg font-semibold text-[var(--ptl-greenh)]">Sensors Management</h3>
        <button className="flex items-center gap-2 bg-[var(--ptl-greenb)] text-white px-4 py-2 rounded-lg hover:bg-[var(--ptl-greenc)] transition-colors text-[0.9rem] shadow-md">
        <Plus className="w-4 h-4" />
        Add Sensor
        </button>
    </div>
    <div className="overflow-x-auto">
        <table className="w-full">
        <thead className="bg-[var(--sage-light)]">
            <tr>
            <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Sensor Name</th>
            <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Type</th>
            <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Unit</th>
            <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Status</th>
            <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Connected Bed</th>
            <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-[var(--sage-lighter)]">
        
        </tbody>
        </table>
    </div>
    </div>
</div>
  )
}

export default SensorsScreen