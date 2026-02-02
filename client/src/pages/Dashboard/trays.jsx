import { Sprout } from "lucide-react";
import * as trayServices from "../../data/traysServices";

function Trays({
  traysData,
  trayGroupsData,
  setTrayModalOpen,
  setTrayModalMode,
  setBatchModalOpen,
  setBatchModalMode,
  setSelectedTray,
  setSelectedTrayGroup
}) {

  const handleUpdateTray = (tray) => {
    const trayGroup = trayGroupsData.find(
      g => g.tray_group_id === tray.tray_group_id
    );
    setSelectedTrayGroup(trayGroup);
    setSelectedTray(tray);
    setTrayModalMode("update");
    setTrayModalOpen(true);
  };

  const handleDeleteTray = (tray) => {
    const trayGroup = trayGroupsData.find(
      g => g.tray_group_id === tray.tray_group_id
    );
    setSelectedTrayGroup(trayGroup);
    setTrayModalMode("delete");
    setSelectedTray(tray);
    setTrayModalOpen(true);
  };

  const handleAddBatches = (tray) => {
    setBatchModalOpen(true);
    setBatchModalMode("insert");
    setSelectedTray(tray);
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <header className="flex py-4">
        <div className="h-full w-1/2 flex items-center justify-start">
          <Sprout className="mr-4" size={24} />
          <p className="text-2xl">Trays</p>
        </div>
      </header>



      {/* TRAYS LIST */}
      <div className="trays_data_container h-[330px] overflow-y-auto space-y-3">

        {/* EMPTY STATE */}
        {traysData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Sprout size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-medium">No Trays found</p>
            <p className="text-sm">
              Create trays to start tracking plants
            </p>
          </div>
        )}

        {/* TRAY CARDS */}
        {traysData?.map((tray) => (
          <div
            key={tray.tray_id}
            className="trays_conb
              bg-gradient-to-br from-[#E8F3ED] to-white
              rounded-2xl shadow-md p-5
              border border-gray-100
              hover:shadow-xl transition-shadow
            "
          >
            <div className="flex flex-col lg:flex-row gap-3">

              {/* LEFT CONTENT */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="
                    w-10 h-10 rounded-xl
                    bg-gradient-to-br from-[#92e6a7] to-[#25a244]
                    flex items-center justify-center
                  ">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      [{tray.tray_number}] {tray.plant || "No Plant"} Tray
                    </h3>

                    <p className="text-sm text-gray-500">
                      Tray Group:{" "}
                      {trayGroupsData?.find(
                        g => g.tray_group_id === tray.tray_group_id
                      )?.tray_group_name || "Unknown"}
                    </p>
                  </div>
                </div>



                {/* STATUS */}
                <div className="flex items-center gap-6 mt-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className=" text-gray-500 uppercase tracking-wide">
                      Status:
                    </span>                  
                    <span
                      className={`status-data text-xs py-1 px-2 rounded-2xl border-[1px]
                        ${tray.status === "Available" && "status-available"}
                        ${tray.status === "Occupied" && "status-occupied"}
                        ${tray.status === "Maintenance" && "status-maintenance"}
                        ${tray.status === "Disabled" && "status-disabled"}
                      `}
                    >
                      {tray.status || "Unknown"}
                    </span>                
                  </div>
                </div>

                
              </div>


              {/* ACTION BUTTONS (RESPONSIVE) */}
              <div
                className="
                  flex flex-col items-end gap-2
                  lg:flex-row lg:items-center
                "
              >
                <button
                  onClick={() => handleAddBatches(tray)}
                  className="
                    cursor-pointer
                    text-xs
                    px-2.5 py-1
                    rounded-md
                    bg-[var(--sancgb)]
                    text-white
                    shadow
                    hover:shadow-md
                    transition
                  "
                >
                  ADD BATCH
                </button>

                <button
                  onClick={() => handleUpdateTray(tray)}
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

              
                {tray.sensorCount === "0" && (
                  <button
                    onClick={() => handleDeleteTray(tray)}
                    className="
                      cursor-pointer
                      text-xs
                      px-2.5 py-1
                      rounded-md
                      bg-[var(--color-danger-a)]
                      text-white
                      shadow
                      hover:shadow-md
                      transition
                    "
                  >
                    DELETE
                  </button>
                )}


              </div>

            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default Trays;
