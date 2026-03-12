import {TrendingUp } from "lucide-react";
import {getStageColor,getHarvestStatusColor} from "../../utils/colors"
import {formatDateOnly} from "../../utils/formatDates"

function Plant_batches({ setMsg, batchesData, setSelectedBatches, setBatchModalOpen, setBatchModalMode }) {
  
  const handleUpdateBatches = (batch) => {
    setSelectedBatches({ ...batch });
    setBatchModalMode("update");
    setBatchModalOpen(true);
  };

  const handleDeleteBatches = (batch) => {
    const hasData = batch.fully_grown_seedlings > 0 || batch.dead_seedlings > 0 || batch.replanted_seedlings > 0;
    if (!hasData) {
      setMsg("Cannot delete this batch. Update the batch data first before deleting");
      return;
    }

    setSelectedBatches({ ...batch });
    setBatchModalMode("delete");
    setBatchModalOpen(true);
  };


  return (
    <main className="space-y-3">

      {/* Header */}
      <header className="flex ">
        <div className="h-full w-1/2 flex items-center justify-start">
          <TrendingUp className="mr-4" size={24} />
          <p className="text-2xl">Batches</p>
        </div>
      </header>
      <div className="batch_table h-[350px] overflow-y-auto pr-2 space-y-3">



      <table className="batch_table w-full f overflow-y-auto">
        <thead className="  overflow-y-auto">
          <tr className="">
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Plant Name</th>             
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Total</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Grown</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Replanted</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Dead</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Stage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Harvest Stage</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-[#027c68] uppercase tracking-wider">Date Planted</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Harvest Day/s</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-[#027c68] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        {batchesData.length === 0 && (
          <tbody>
            <tr>
              <td colSpan="100%" className="py-12 text-center text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <TrendingUp size={48} className="mb-3 opacity-50" />
                  <p className="text-lg font-medium">No batches found</p>
                  <p className="text-sm">Create a batch to start tracking plants</p>
                </div>
              </td>
            </tr>
          </tbody>
        )}

        {batchesData.length > 0 && batchesData.map((pb,index) => {

          // const formatBatchDisplay = (batch) => {
          //   const date = new Date(batch.date_planted);
          //   const yyyy = date.getFullYear();
          //   const mm = String(date.getMonth() + 1).padStart(2, "0");
          //   const dd = String(date.getDate()).padStart(2, "0");
          //   return `${yyyy}${mm}${dd}-${String(batch.batch_id).padStart(3, "0")}`;
          // };
          
          return (
       
            <tbody className="divide-y divide-gray-200">              
                <tr 
                 key={pb.batch_id}
                  className={`pb_tr hover:bg-[#E8F3ED] transition-colors
                  ${index % 2 === 0 
                    ? "bg-white dark:bg-[var(--metal-dark4)]" 
                    : "bg-[#f0f9f5] dark:bg-[var(--metal-dark5)]"
                  }`}>
                  <td className="px-4 py-3 text-sm font-medium text-[#027c68] flex"><p>[{pb.batch_number}]</p>{pb.plant_name}</td>

                  <td className="px-4 py-3 text-sm text-center font-semibold">{pb.total_seedlings}</td>
              
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="fully_grown_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {pb.fully_grown_seedlings}
                    </span>
                  </td> 

                  <td className="px-4 py-3 text-sm text-center">
                    <span className="replanted_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {pb.replanted_seedlings}
                    </span>
                  </td>            
                    
                  <td className="px-4 py-3 text-sm text-center">    
                    {pb.dead_seedlings === null ? "" : 
                      <span className="dead_seedlings_data inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {pb.dead_seedlings}
                    </span> }                    
                  </td>          
                                                    
                  <td className="px-4 py-3 text-sm">
                    <span
                      className="bh_growth_stage inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: getStageColor(pb.growth_stage) }}>
                      {pb.growth_stage}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                    <span className='bh_growth_stage inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white' 
                      style={{ backgroundColor: getHarvestStatusColor(pb.harvest_status) }}>                        
                      {pb.harvest_status}    
                    </span>
                  </td>
                   <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                    {formatDateOnly(pb.date_planted)}
                   </td>
                    <td className="px-4 py-3 text-sm text-center font-medium text-[#027c68]">
                      {pb.expected_harvest_days}
                   </td>
                    <td className="flex gap-4 px-4 py-3 text-sm text-center font-medium text-[#027c68]">

                      <button
                      onClick={() => handleUpdateBatches(pb)}
                      className="
                      cursor-pointer
                      text-xs
                      px-2.5 py-1
                      rounded-md
                      bg-[var(--purpluish--)]
                    text-white
                      shadow
                      hover:shadow-md
                      transition
                      "
                    >
                      UPDATE
                    </button>
               
              
                    <button
                      onClick={() => handleDeleteBatches(pb)}
                      className="
                        cursor-pointer
                        text-xs
                        px-2.5 py-1
                        rounded-md
                        bg-[var(--color-danger-a)]
                        text-white
                        shadow
                        hover:shadow-md
                        transition">
                      DELETE
                    </button>
                               
                               
                   </td>



              </tr>            
            </tbody>
  
          );
        })}

        </table>

    
      </div>
    </main>


  );
}

export default Plant_batches;