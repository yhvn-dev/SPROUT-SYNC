import {Trash2,Pencil,DiamondPlus,SquarePen,Activity,Droplet} from "lucide-react";

import { Tooltip,  ResponsiveContainer,BarChart,CartesianGrid,XAxis,YAxis,Legend,Bar } from 'recharts';
import {Plus} from "lucide-react"

const StatusBadge = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === 'active' 
        ? 'bg-[var(--color-success-a-soft)] text-[var(--color-success-d)]' 
        : 'bg-[var(--color-sign-disabled)] text-[var(--gray_1)]'
    }`}>
        {status === 'active' ? <Wifi className="inline w-3 h-3 mr-1" /> : <WifiOff className="inline w-3 h-3 mr-1" />}
        {status}
    </span>
);


function BedsScreen({setOpenBed,setBedMode,setSelectedBed,bed,
                    setOpenSensor
                    }) {
 
  const handleOpenInsert = () => {
    setBedMode("insert");
    setOpenBed(true);
    console.log("INSERT CLICKED")
  };

   const handleOpenUpdate = (value) => {
    setBedMode("update");
    setOpenBed(true);
    setSelectedBed(value)
    console.log("UPDATE CLICKED")
  };

 const handleOpenDelete = (value) => {
    setBedMode("delete");
    setOpenBed(true);
    setSelectedBed(value)
  };

 const handleOpenSensor = (value) => {
    setOpenSensor(true)
    setSelectedBed(value)
  };


  return (
    <div className="space-y-6">
              {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--ptl-greena)] to-[var(--ptl-greenb)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Total Beds</h3>
            {/* <p className="text-4xl font-bold">{beds.length}</p> */}
        </div>
        <div className="bg-gradient-to-br from-[var(--sage)] to-[var(--sage-medium)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Active Beds</h3>
            {/* <p className="text-4xl font-bold">{beds.filter(b => b.status === 'active').length}</p> */}
        </div>
        <div className="bg-gradient-to-br from-[var(--ptl-greenc)] to-[var(--ptl-greend)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Total Sensors</h3>
            {/* <p className="text-4xl font-bold">{beds.reduce((sum, bed) => sum + bed.sensorCount, 0)}</p> */}
        </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-[var(--ptl-greenh)] mb-4">Sensors Per Bed</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--sage-lighter)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sensors" fill="var(--ptl-greenb)" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-[var(--sage-lighter)]">
            <h3 className="text-lg font-semibold text-[var(--ptl-greenh)]">Beds Management</h3>
            <button onClick={handleOpenInsert} className="flex items-center gap-2 bg-[var(--ptl-greenb)] text-white px-4 py-2 rounded-lg hover:bg-[var(--ptl-greenc)] transition-colors text-[0.9rem] shadow-md">
                <Plus className="w-4 h-4" />
                Add Bed
            </button>
        </div>

         <div className="w-full overflow-x-auto pb-4 ">
      <div className="min-w-max px-6 py-8 ">

    
        {bed.length > 0 && bed.map((b) =>{
            return(
              
            <div className="relative rounded-xl p-6 shadow-lg bg-[var(--sage-lighter)] border-[var(--sage-light)] my-4">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center justify-start">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--sancga)]">
                    {b.bed_number} - MONITORING
                </h3>
                <div className="text-sm px-3 py-1 mx-4 rounded-full bg-[var(--sage-medium)] text-[var(--sage-dark)]">
                    Zones Active
                </div>
                </div>
        
            </div>
            
            {/* Sensor Cards */}
            <div className="center-l gap-4 bg-amber-200 ">
        
                <div className="relative rounded-lg p-4 shadow-lg transition-all hover:shadow-xl bg-white border border-[var(--sage-light)] w-auto]">
                    <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                        Zone 1
                    </div>
                        <div className="mt-4 space-y-3  ">
                        {/* Moisture */}
                        <div className="space-y-1 ">

                            {/* label */}
                            <div className="flex items-center gap-2">
                            <Droplet size={14} />
                            <span className="text-sm font-medium text-[var(--acc-darka)]">
                                Moisture
                            </span>
                            </div>


                            {/* numbers */}
                            <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-[var(--sancgb)]">
                            
                            </span>
                            <span className="text-sm text-[var(--acc-darkb)]">65%</span>
                            </div>

                            {/* range */}
                            <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"                    
                            />
                            </div>
                        </div>

            
                        </div>

                        {/* Status */}
                        <div className="mt-3 pt-3 border-t border-[var(--sage-light)]">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[var(--acc-darkc)]">Status</span>
                            <div className="flex items-center gap-1">
                            <div
                                className="w-2 h-2 rounded-full"
                            
                            />
                            <span
                                className="text-sm font-medium"
                            
                            >
                            
                            </span>
                            </div>
                        </div>
                        </div>
                    </div>
                
                </div>

                    <div className="w-full h-1/2 center bg-amber-300">

                        <div className="space-y-1 bg-amber-700" >
                            <div className="flex items-center gap-2">
                        
                                <span className="text-sm font-medium text-[var(--acc-darka)]">
                                pH Level
                                </span>
                            </div>
                            <div className="text-2xl font-bold text-[var(--sancgd)]">
                            
                            </div>
                            <div className="flex gap-0.5">
                            
                            </div>
                        </div>


                    </div>
                        
                </div>

                )
            })}
       
      </div>
    </div>

    
        </div>

 
    </div>
  )
}

export default BedsScreen