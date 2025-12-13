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
    <div className="space-y-3 ">

      {/* Header */}
      <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <TrendingUp className="mr-4" size={24} />
          <p className="text-2xl">Batches</p>
        </div>
      </header>


      <div className="max-h-[240px] overflow-y-auto pr-2 space-y-3">

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
              className="rounded-2xl p-5 border shadow-lg border-gray-100 hover:shadow-xl transition-shadow bg-white">

              <div className="flex items-start justify-between mb-4 bg-[var(--sage-lighter)] rounded-2xl p-4 ">
                <div className="flex items-center gap-3 ">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div >
                    <h3 className="text-lg font-semibold text-gray-900">{pb.plant_name} Tray's Batch</h3>
                    <p className="text-sm text-gray-500">Batch: {formatBatchDisplay(pb)}</p>
                  </div>  
                </div>

                <div className="flex items-center my-4 gap-2 h-full ">
                  <button
                    onClick={() => handleUpdateBatches(pb)}
                    className="cursor-pointer u_btn shadow-lg bg-[var(--white-blple--)] text-white">
                    UPDATE
                  </button>
                  <button
                    onClick={() => handleDeleteBatches(pb)}
                    className="cursor-pointer u_btn shadow-lg bg-[var(--color-danger-b)] text-white">
                    DELETE
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Date Planted</p>
                   <p className="text-sm font-semibold text-gray-900">{formatDateOnly(pb.date_planted)}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Expected Harvest</p>
                  <p className="text-sm font-semibold text-gray-900">{pb.expected_harvest_days}</p>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">

                <div className="bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Total Planted</p>
                  <p className="text-xl font-bold text-gray-900">{pb.total_seedlings}</p>
                </div>

                <div className="bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Alive Seedlings</p>
                  <p className="text-xl font-bold text-[#92e6a7]">{pb.alive_seedlings}</p>
                </div>

                <div className="bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Fully Grown</p>
                  <p className="text-xl font-bold text-[#25a244]">{pb.fully_grown_seedlings}</p>
                </div>

                <div className="bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Dead</p>
                  <p className="text-xl font-bold text-red-500">{pb.dead_seedlings}</p>
                </div>

                <div className="bg-white rounded-xl p-3 text-center shadow-lg">
                  <p className="text-xs text-gray-500 mb-1">Replants</p>
                  <p className="text-xl font-bold text-orange-500">{pb.replanted_seedlings}</p>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Plant_batches;
