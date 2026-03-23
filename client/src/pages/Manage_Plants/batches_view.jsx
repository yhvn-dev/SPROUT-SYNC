import {Sprout, TrendingUp, Pencil, Trash2, Calendar, Clock, LayoutGrid} from "lucide-react";
import { getHarvestStatusColor,getStageColor} from '../../utils/colors'; 
import { useDarkMode } from "../../hooks/useDarkmode";

function Batches_View({batchesDataList, handleUpdateBatch, handleDeleteBatch, trays}) {
  const isDark = useDarkMode()

  const getTrayInfo = (tray_id) => {
    const tray = trays.find(t => t.tray_id === tray_id);
    if (!tray) return null;
    return `${tray.plant} #${tray.tray_number ?? tray.tray_id} tray`;
  };
    
 

  return (
    <section className="conb bg-white rounded-3xl p-4 sm:p-6 shadow-sm w-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">All Plant Batches</h2>
      </div>

      {batchesDataList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <TrendingUp size={48} className="mb-3 opacity-50" />
          <p className="text-lg font-medium">No Batches found</p>
          <p className="text-sm">Add a batch from inside a tray</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchesDataList.map(batch => {
            const trayInfo = getTrayInfo(batch.tray_id);

            const stageColors   = getStageColor(batch.growth_stage, isDark);
            const harvestColors = getHarvestStatusColor(batch.harvest_status, isDark);

            return (
              <div key={batch.batch_id} className="conc batch_div bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                    
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      [{batch.batch_number}] {batch.plant_name}
                    </h3>
                    {trayInfo && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <LayoutGrid className="w-3 h-3 text-[#25a244]" />
                        <span className="text-[11px] text-[#25a244] font-medium">{trayInfo}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpdateBatch(batch)}
                      className="cursor-pointer hover:bg-[var(--bluis--)] p-1.5 rounded-lg bg-[var(--purpluish--,#7c6fcd)] text-white shadow hover:opacity-90 transition">
                      <Pencil size={11} />
                    </button>
                    <button
                      onClick={() => handleDeleteBatch(batch)}
                      className="cursor-pointer hover:bg-red-500 p-1.5 rounded-lg bg-[var(--color-danger-a,#e53935)] text-white shadow hover:opacity-90 transition">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>





                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">Planted: {new Date(batch.date_planted).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">
                      Harvest at: {batch.expected_harvest_days} {batch.expected_harvest_days === 1 ? "day" : "days"}
                    </span>
                  </div>


                <div className="flex items-center gap-2 text-xs">
                  <Sprout className="w-3.5 h-3.5 text-gray-400" />
                  <span
                    className="px-[2px]  rounded-2xl font-medium"
                    style={{
                      backgroundColor: stageColors.bg,
                      color: stageColors.text,
                      border: `1px solid ${stageColors.border}`,
                    }}>
                    {batch.growth_stage}
                  </span>
                </div>


                  {/* harvest stattus */}
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
            
                      <span className="text-gray-500">Harvest:</span>
                      <span className="flex flex-row-reverse items-center gap-1 font-medium" style={{ color: harvestColors.text }}>
                        <span 
                          className="w-2 h-2 rounded-full inline-block flex-shrink-0  harvest-status-txt" 
                          style={{ backgroundColor: harvestColors.text }} 
                        />
                        {batch.harvest_status}
                      </span>
                
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1 pt-3 border-t border-gray-200 text-center">
                  <div>
                    <p className="text-[10px] text-gray-500">Seedlings</p>
                    <p className="text-sm font-bold text-[#25a244]">{batch.total_seedlings}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Grown</p>
                    <p className="text-sm font-bold text-[#208b3a]">{batch.fully_grown_seedlings}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Dead</p>
                    <p className="text-sm font-bold text-[var(--color-danger-b,#e53935)]">{batch.dead_seedlings ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Replant</p>
                    <p className="text-sm font-bold text-[var(--color-warning,#f59e0b)]">{batch.replanted_seedlings}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}






export default Batches_View;