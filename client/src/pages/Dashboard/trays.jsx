import { LayoutGrid} from 'lucide-react';
import * as trayServices from "../../data/traysServices"

function Trays({ traysData, setTrayModalOpen,setTrayModalMode,setSelectedTray}) {

  const handleUpdateTray = (tray) => {
      setTrayModalOpen(true)
      setTrayModalMode("update")
      setSelectedTray(tray)
  };
  const handleDeleteTray = (tray) => {
      setTrayModalOpen(true)
      setTrayModalMode("delete")
      setSelectedTray(tray)
  };
  const handleAddBatches = (tray) =>{
      setTrayModalOpen(true)
      setTrayModalMode("insert")
      setSelectedTray(tray)
  }


  return (
    <div className="space-y-4">
      {/* ✅ HEADER */}
      <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <LayoutGrid className='mr-4' size={24} />
          <p className="text-2xl">Trays</p>
        </div>
      </header>


      {/* ✅ EMPTY STATE */}
      {traysData?.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          No trays found.
        </p>
      )}

      {/* ✅ ✅ ✅ MAPPED TRAYS */}
      {traysData?.map((tray) => (
        <div
          key={tray.tray_id}
          className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">

            {/* ✅ LEFT CONTENT */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#92e6a7] to-[#25a244] flex items-center justify-center">
                  <LayoutGrid className="w-5 h-5 text-white" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tray.plant|| "No Plant"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tray ID: {tray.tray_id}
                  </p>
                </div>
              </div>



              <div className="ml-13 flex items-center gap-6 mt-3">

                {/* ✅ STATUS */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Status:</span>
                  <span
                  
                    className={`px-3 py-1 rounded-full text-xs font-medium
                      ${tray.status === "Available" && "bg-green-100 text-[var(--color-success-a)]"}
                      ${tray.status === "Occupied" && "bg-yellow-100 text-[var(--color-warning-c)]"}
                      ${tray.status === "Maintenance" && "bg-orange-100 text-[var(--color-warning-b)]"}
                      ${tray.status === "Disabled" && "bg-red-100 text-[var(--acc-darkc)]"}
                    `}>

                    {tray.status || "Unknown"}
                  </span>
                </div>

                {/* ✅ BATCH ID */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Batch ID:</span>
                  <span className="text-sm font-semibold text-gray-700">
                    {tray.batch_id || "None"}
                  </span>
                </div>

              </div>
            </div>



            {/* ✅ RIGHT BUTTON ACTIONS */}
            <div className="flex items-center justify-center gap-2 mt-8 h-full">
              <button onClick={() => handleAddBatches(tray)}
                className="cursor-pointer u_btn shadow-lg bg-[var(--sancgc)] text-white">
                ADD BATCH
              </button>

              <button onClick={() => handleUpdateTray(tray)}
                className="cursor-pointer u_btn shadow-lg bg-[var(--white-blple--)] text-white">
                UPDATE
              </button>

              <button onClick={() => handleDeleteTray(tray)}
                className="cursor-pointer u_btn shadow-lg bg-[var(--color-danger-b)] text-white">
                DELETE
              </button>
            </div>

          </div>
        </div>
      ))}
    </div>
  );

  
}

export default Trays;
