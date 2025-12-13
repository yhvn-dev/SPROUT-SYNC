import { LayoutGrid} from 'lucide-react';
import * as trayServices from "../../data/traysServices"

function Trays({ traysData,trayGroupsData,setTrayModalOpen,setTrayModalMode,setBatchModalOpen,setBatchModalMode,setSelectedTray}) {

  const handleUpdateTray = (tray) => {
      setSelectedTray(tray);
      setTrayModalMode("update");
      setTrayModalOpen(true);
  };
  
  const handleDeleteTray = (tray) => {
      setTrayModalOpen(true)
      setTrayModalMode("delete")

      setSelectedTray(tray)
  };
  const handleAddBatches = (tray) =>{
      setBatchModalOpen(true)
      setBatchModalMode("insert")
      setSelectedTray(tray)
  }


  return (
    <div className="space-y-4">
      {/* HEADER */}
      <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <LayoutGrid className='mr-4' size={24} />
          <p className="text-2xl">Trays</p>
        </div>
      </header>

      {/* TRAYS LIST WRAPPER */}
      <div className="h-[235px] overflow-y-auto space-y-3">

        {traysData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <LayoutGrid size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">No Trays found</p>
            <p className="text-sm">Create a trays to start tracking plants</p>
          </div>
        )}

        {/* MAPPED TRAYS */}
        {traysData?.map((tray) => (
          <div
            key={tray.tray_id}
            className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              
              {/* LEFT CONTENT */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tray.plant || "No Plant"}, Tray
                    </h3>
                    <p className="text-sm text-gray-500">
                          Tray Group: {trayGroupsData?.find(g => g.tray_group_id === tray.tray_group_id)?.tray_group_name || "Unknown"}
                      </p>        
                  </div>
                </div>

                <div className="ml-13 flex items-center gap-6 mt-3">
                  {/* STATUS */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${tray.status === "Available" && "bg-green-100 text-[var(--color-success-a)]"}
                        ${tray.status === "Occupied" && "bg-[var(--color-warning-c)] text-orange-500"}
                        ${tray.status === "Maintenance" && "bg-[var(--color-warning-b)] text-orange-500"}
                        ${tray.status === "Disabled" && "bg-red-100 text-[var(--acc-darkc)]"}
                      `}>
                        
                      {tray.status || "Unknown"}
                    </span>
                  </div>

                </div>
              </div>

              {/* RIGHT BUTTON ACTIONS */}
              <div className="flex items-center justify-center gap-2 mt-8 h-full">
                <button
                  onClick={() => handleAddBatches(tray)}
                  className="cursor-pointer u_btn shadow-lg bg-[var(--sancgc)] text-white"
                >
                  ADD BATCH
                </button>

                <button
                  onClick={() => handleUpdateTray(tray)}
                  className="cursor-pointer u_btn shadow-lg bg-[var(--white-blple--)] text-white"
                >
                  UPDATE
                </button>

                <button
                  onClick={() => handleDeleteTray(tray)}
                  className="cursor-pointer u_btn shadow-lg bg-[var(--color-danger-b)] text-white"
                >
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );

  
}

export default Trays;
