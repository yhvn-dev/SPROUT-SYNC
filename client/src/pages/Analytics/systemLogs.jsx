    
  const pumpLogs = [
    { time: '08:15 AM', duration: '3m 45s', status: 'Completed' },
    { time: '02:30 PM', duration: '4m 12s', status: 'Completed' },
    { time: '06:45 PM', duration: '3m 58s', status: 'Completed' }
  ];


export function SystemLogs() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-[calc(100vh-140px)]">
    <h3 className="text-sm font-semibold text-[#003333] mb-4">Pump Activity Logs</h3>
    <div className="overflow-x-auto">
        <table className="w-full">
        <thead>
            <tr className="border-b border-[#E8F3ED]">
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5A8F73]">Time</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5A8F73]">Duration</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-[#5A8F73]">Status</th>
            </tr>
        </thead>
        <tbody>
            {pumpLogs.map((log, index) => (
            <tr key={index} className="border-b border-[#E8F3ED] hover:bg-[#E8F3ED] transition-colors">
                <td className="py-3 px-4 text-sm text-[#003333]">{log.time}</td>
                <td className="py-3 px-4 text-sm text-[#003333]">{log.duration}</td>
                <td className="py-3 px-4">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#d4edda] text-[#155724]">
                    {log.status}
                </span>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
  )
}

