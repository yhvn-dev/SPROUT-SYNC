import { useEffect, useState } from "react";
import { Tooltip,  ResponsiveContainer,BarChart,CartesianGrid,XAxis,YAxis,Legend,Bar } from 'recharts';
import {Plus} from "lucide-react"
import * as bedService from "../../data/bedServices"
import BedModal from "./bedsModal"

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


function BedsScreen({setOpen,setMode}) {
  const [bed,setBedData] = useState([])

  useEffect(() =>{
    loadBedData()
  },[])

  const loadBedData = async () =>{
    try{
        const data = await bedService.fetchAllBeds()
        console.log("BED DATA",data)
        setBedData(data)
    }catch(err){
        console.error(err)
    }
  }


  const handleOpenInsert = () => {
    setMode("insert");
    setOpen(true);
    console.log("INSERT")
  };

   const handleOpenUpdate = () => {
    setMode("update");
    setOpen(true);
    console.log("UPDATE")
  };

 const handleOpenDelete = () => {
    setMode("delete");
    setOpen(true);
    console.log("DELETE")   
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


        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-[var(--sage-light)]">
                <tr>
                    <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Bed Name</th>
                    <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Location</th>
                    <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Status</th>
                    <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Hysteresis</th>
                    <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Created At</th>
                    <th className="px-6 py-3 text-left text-[0.9rem] font-semibold text-[var(--ptl-greenh)]">Actions</th>
                </tr>
            </thead>

            

            <tbody className="divide-y divide-[var(--sage-lighter)]">
                {bed.length > 0 && bed.map((b) =>{
                return(
                    <tr key={b.bed_id}>
                        <td className="p-8 text-[0.9rem] text-start break-words">{b.bed_name}</td>
                        <td className="p-8 text-[0.9rem] text-start break-words">{b.location}</td>
                        <td className="p-8 text-[0.9rem] text-start break-words">{b.is_active === true ? "Active" : "Inactive"}</td>
                        <td className="p-8 text-[0.9rem] text-start break-words">{b.hysteresis}</td>
                        <td className="p-8 text-[0.9rem] text-start break-words">{b.created_at}</td>
                        <td className="flex items-center justify-around h-full w-full p-8 text-[0.9rem] text-start break-words">
                            <button onClick={handleOpenUpdate}
                            className="u_btn shadow-lg bg-[var(--white-blple--)] text-white">UPDATE</button>
                            <button onClick={handleOpenDelete}
                            className="u_btn shadow-lg bg-[var(--color-danger-b)] text-white  ">DELETE</button>
                         </td> 
                    </tr>
                    )
                })}
                
            </tbody>
            </table>
      
        </div>
        </div>

 
    </div>
  )
}

export default BedsScreen