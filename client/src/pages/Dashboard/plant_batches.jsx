import React from 'react';
import { TrendingUp, Edit2, Trash2 } from 'lucide-react';

function Plant_batches({batchesData, setSelectedBatches, setBatchModalOpen,setBatchModalMode}) {


    const handleUpdateBatches = (batch) => {
      setBatchModalOpen(true)
      setBatchModalMode("update");
      setSelectedBatches(batch);

      console.log("SELECTED BATCH",batch)
  };
  
  
  const handleDeleteBatches = (batch) => {
      setBatchModalOpen(true) 
      setBatchModalMode("delete")
      setSelectedBatches(batch);
      console.log("SELECTED BATCH",batch)
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

  return (
    <div className="space-y-3">

      {/* Header */}
      <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <TrendingUp className="mr-4" size={24} />
          <p className="text-2xl">Batches</p>
        </div>
      </header>

      <div className="pb_data_container h-[330px] overflow-y-auto pr-2 space-y-3">

        {batchesData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <TrendingUp size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">No batches found</p>
            <p className="text-sm">Create a batch to start tracking plants</p>
          </div>
        )}
        {batchesData.length > 0 && batchesData.map((pb) => {
          function formatBatchDisplay(batch) {
              const date = new Date(batch.date_planted);
              const yyyy = date.getFullYear();
              const mm = String(date.getMonth() + 1).padStart(2, "0");
              const dd = String(date.getDate()).padStart(2, "0");
              return `${yyyy}${mm}${dd}-${String(batch.batch_id).padStart(3, "0")}`;
            }

          return (        

            <div
              key={pb.batch_id}
              className="pb_con rounded-2xl p-5 border shadow-lg border-gray-100 hover:shadow-xl transition-shadow bg-white">
              <div className="pb_name_div flex items-start justify-between mb-4 bg-[var(--sage-lighter)] rounded-2xl p-4 ">
                <div className="flex items-center gap-3 ">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div >
                    <h3 className="text-lg font-semibold text-gray-900">{pb.plant_name} Tray's Batch</h3>
                    <p className="text-sm text-gray-500">Batch: {formatBatchDisplay(pb)}</p>
                  </div>  
                </div>



                <div className="flex flex-col items-end gap-2
                  lg:flex-row lg:items-center">
                  <button
                    onClick={() => handleUpdateBatches(pb)}
                    className="mx-2
                    cursor-pointer
                    text-xs
                    px-2.5 py-1
                    rounded-md
                    bg-[var(--purpluish--)]
                  text-white
                    shadow
                    hover:shadow-md
                    transition">
                    UPDATE
                  </button>

                  <button
                    onClick={() => handleDeleteBatches(pb)}
                    className="mx-2
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
                </div>

                
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className=" rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Date Planted</p>
                   <p className="text-sm font-semibold text-gray-900">{formatDateOnly(pb.date_planted)}</p>
                </div>
                <div className="rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Expected Harvest Days</p>
                  <p className="text-sm font-semibold text-gray-900">{pb.expected_harvest_days}</p>
                </div>
              </div>


              <ul className="grid grid-cols-5 gap-3">
                <li className="total_seedlings_div bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Total Planted</p>
                  <p className="text-xl font-bold text-gray-900">{pb.total_seedlings}</p>
                </li>

                <li className="alive_seeedlings_div bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Alive Seedlings</p>
                  <p className="text-xl font-bold text-[#92e6a7]">{pb.alive_seedlings}</p>
                </li>

                <li className="fully_grown_seeedlings_div bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Fully Grown</p>
                  <p className="text-xl font-bold text-[#25a244]">{pb.fully_grown_seedlings}</p>
                </li>

                <li className="dead_seeedlings_div bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Dead</p>
                  <p className="text-xl font-bold text-red-500">{pb.dead_seedlings}</p>
                </li>

                <li className="replanted_seeedlings_div bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Replants</p>
                  <p className="text-xl font-bold text-orange-500">{pb.replanted_seedlings}</p>
                </li>
                
              </ul>


            </div>
          );
        })}
      </div>
    </div>
  );
}



export default Plant_batches;
