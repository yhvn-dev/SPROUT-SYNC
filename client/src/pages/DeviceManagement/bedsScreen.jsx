import {Trash2,Pencil,Columns2,Droplet} from "lucide-react";

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

function BedsScreen({setOpenBed,setBedMode,setSelectedBed,bed,bedCount,
                    setOpenSensor,sensors,sensorCount,setSelectedSensor,sensorMode}) {
 
  const handleOpenInsert = () => {
    setBedMode("insert");
    setOpenBed(true);
  };

   const handleOpenUpdate = (value) => {
    setBedMode("update");
    setOpenBed(true);
    setSelectedBed(value)
    console.log("SELECTED BED",value)
    console.log("UPDATE CLICKED")
  };

 const handleOpenDelete = (value) => {
    setBedMode("delete");
    setOpenBed(true);
    setSelectedBed(value)
  };

 const handleAddSensor = (bedValue) => {
    setOpenSensor(true)
    const bedSensors = sensors.filter(s => s.bed_id === bedValue.bed_id)
    sensorMode("insert")
    setSelectedBed(bedValue)
    console.log("SELECTED BED",bedSensors )
    setSelectedSensor(bedSensors)
  };

  return (
    <div className="space-y-6">
              {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[var(--ptl-greena)] to-[var(--ptl-greenb)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Total Beds</h3>
            <p className="text-4xl font-bold">{bedCount}</p>
        </div>
   
        <div className="bg-gradient-to-br from-[var(--ptl-greenc)] to-[var(--ptl-greend)] text-white rounded-lg p-6 shadow-lg">
            <h3 className="text-[0.9rem] opacity-90 mb-2">Total Sensors</h3>
            {sensorCount && <p className="text-4xl font-bold">{sensorCount}</p>}
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
        <main className="bg-white rounded-lg shadow-md overflow-hidden">

            
            <div className="flex justify-between items-center p-4 bg-[var(--sage-lighter)]">
                <h3 className="text-lg font-semibold text-[var(--ptl-greenh)]">Beds Management</h3>
                <button onClick={handleOpenInsert} className="flex items-center gap-2 bg-[var(--ptl-greenb)] text-white px-4 py-2 
                rounded-lg hover:bg-[var(--ptl-greenc)] transition-colors text-[0.9rem] shadow-md">
                    <Columns2 className="w-4 h-4" />
                    Add Bed
                </button>
            </div>

            <div className="w-full overflow-x-auto pb-4 ">

                <div className="min-w-max px-6 py-8 ">  
                    {bed.length > 0 && bed.map((b) =>{
                        return(                  
                        <div key={b.bed_id} className="relative rounded-xl p-6 shadow-lg bg-[var(--sage-lighter)] border-[var(--sage-light)] my-4 ">
                            
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between ">
                            <div className="flex items-center justify-start">
                            <h3 className="text-sm font-semibold tracking-wide text-[var(--sancga)]">
                                {b.bed_number} - MONITORING 
                            </h3>
                            <div className="text-sm px-3 py-1 mx-4 rounded-full bg-[var(--sage-medium)] text-[var(--sage-dark)]">
                               {b.sensorCount} Zones Active
                            </div>
                            </div>    

                            <div>
                                <p className="text-sm  bg-amber-100 text-[var(--acc-darkc)] font-medium font px-3 py-1 rounded-2xl">{b.bed_name}</p>
                            </div>            

                        </div>
                        
                        
                            {/* BED CARD */}
                            <div className="flex-col  ">                                                                   
                                {/* Sensor Cards */}                                
                                <div className="grid grid-cols-[1fr] grid-rows-[6fr_2fr_2fr] gap-4">
                                    <div className="flex gap-4">
                                        {sensors && sensors
                                        .filter((s) => s.bed_id === b.bed_id) //
                                        .map((s) => (
                                    <div key={s.sensor_id}
                                        className="relative rounded-lg p-4 shadow-lg transition-all hover:shadow-xl bg-white border border-[var(--sage-light)] w-35"
                                    >
                                        {/* ZONE LABEL */}
                                        <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                                            Zone {s.zone_number}
                                        </div>

                                        {/* SENSOR TYPE */}
                                        <div className="mt-4 space-y-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Droplet size={14} />
                                                    <span className="text-sm font-medium text-[var(--acc-darka)]">
                                                        {s.sensor_type}
                                                    </span>
                                                </div>

                                                {/* VALUE */}
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold text-[var(--sancgb)]">
                                                        {s.value ?? "--"}
                                                    </span>
                                                    <span className="text-sm text-[var(--acc-darkb)]">
                                                        {s.unit}
                                                    </span>
                                                </div>

                                                {/* RANGE BAR */}
                                                <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                                                    <div className="h-full rounded-full transition-all bg-[var(--sancgb)] w-[65%]" />
                                                </div>
                                            </div>
                                        </div>

                            
                                        {/* SENSOR ACTION BUTTONS */}
                                        <div className="mt-4 flex items-center justify-between gap-2">
                                            {/* UPDATE */}
                                            <button
                                                onClick={() => {
                                                    sensorMode("update");
                                                    setSelectedSensor(s);
                                                    setOpenSensor(true);
                                                }}
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--white-blple--)] 
                                                        hover:bg-[var(--purpluish--)] transition-colors shadow-md"
                                            >
                                                <Pencil size={16} className="text-white" />
                                             
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                onClick={() => {
                                                    sensorMode("delete");
                                                    setSelectedSensor(s);
                                                    setOpenSensor(true);
                                                }}
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-danger-b)] 
                                                        hover:bg-[var(--color-danger-a)] transition-colors shadow-md">

                                                <Trash2 size={16} className="text-white" />
                                             
                                            </button>
                                        </div>
                                    </div>
                                        ))}
                                    </div>


                                    {/* PH LEVEL  */}
                                    <div className="col-start-1 col-end-2 row-start-2 row-end-2 w-full h-full center rounded-xl shadow-lg">
                                        <div className="space-y-1 " >
                                            <div className="flex items-center gap-2 p-4">
                                        
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
                                    
                                        <aside className="flex items-center justify-evenly shadow-lg bg-white rounded-2xl 
                                        col-start-1 col-end-1 row-start-3 row-end-3">      
                                            <nav className="flex items-center justify-start full">
                                                <button onClick={() => handleAddSensor(b)} className="center rounded-lg 
                                                bg-[var(--color-success-b)] shadow-xl px-2 py-1 stroke-[var(--acc-darkc)] 
                                                mx-4  hover:bg-blue-400 transition-colors text-[0.9rem] shadow-md">
                                                    <Plus className="text-[var(--main-white--)]"   size={18}/>
                                                    <span className="text-white mx-2">ADD SENSOR</span>
                                                </button>
                                                <button onClick={() => handleOpenUpdate(b)} className="center rounded-lg 
                                                bg-[var(--white-blple--)] shadow-xl px-2 py-1 stroke-[var(--acc-darkc)] 
                                                mx-4 hover:bg-[var(--purpluish--)] transition-colors text-[0.9rem] shadow-md ">
                                                    <Pencil className="text-[var(--main-white--)]" size={18}/>
                                                    <span className="text-white mx-2">UPDATE BED</span>
                                                </button>
                                                <button onClick={() => handleOpenDelete(b)} className="center rounded-lg 
                                                bg-[var(--color-danger-b)] shadow-xl px-2 py-1 stroke-[var(--acc-darkc)] 
                                                mx-4 hover:bg-[var(--color-danger-a)] transition-colors text-[0.9rem] shadow-md">
                                                    <Trash2 className="text-[var(--main-white--)]" size={18}/>
                                                    <span className="text-white mx-2">DELETE BED</span>
                                                </button>                      
                                            </nav>                                             
                                        </aside>
                                    </div>
                                                                        
                                                   
                            </div>                     
                    </div>
                    )
                })}  

            </div>
            {/* END OF SENSOR CARDS */}

            </div>

    
        </main>

 
    </div>
  )
}

export default BedsScreen