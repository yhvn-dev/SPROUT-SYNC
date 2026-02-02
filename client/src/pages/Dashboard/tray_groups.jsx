import { LayoutGrid } from "lucide-react";

function Tray_groups({
  trayGroupsData,
  setTrayGroupModalOpen,
  setTgModalMode,
  setTrayModalOpen,
  setTrayModalMode,
  setSelectedTrayGroup,
}) {

  const handleAdd = () => {
    setTgModalMode("insert");
    setTrayGroupModalOpen(true);
  };

  const handleUpdate = (group) => {
    setSelectedTrayGroup(group);
    setTgModalMode("update");
    setTrayGroupModalOpen(true);
  };

  const handleDelete = (group) => {
    setSelectedTrayGroup(group);
    setTgModalMode("delete");
    setTrayGroupModalOpen(true);
  };

  const handleAddTray = (group) => {
    setSelectedTrayGroup(group);
    setTrayModalMode("insert");
    setTrayModalOpen(true);
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row py-3 sm:py-4 gap-3 sm:gap-0  ">
        <div className="flex items-center gap-2 sm:w-1/2">
          {/* ✅ Trays icon */}
          <LayoutGrid size={20} className="sm:size-[24px]" />
          <p className="text-lg sm:text-2xl font-semibold">
            Tray Groups
          </p>
        </div>

        <div className="flex sm:w-1/2 sm:justify-end">
          <button
            onClick={handleAdd}
            className="cursor-pointer
              rounded-lg sm:rounded-xl
              px-3 py-1.5 sm:px-4 sm:py-2
              text-xs sm:text-sm
              shadow-md
              bg-[var(--sancgb)]
              text-[var(--main-white--)]
              w-full sm:w-auto
            "
          >
            Add Tray Group
          </button>
        </div>
      </header>



      {/* LIST CONTAINER */}
      <div className="tg_data_container h-[330px] overflow-y-auto  ">
        <div className="h-full space-y-3 pr-1 sm:pr-2">

          {/* EMPTY STATE */}
          {trayGroupsData.length === 0   && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              
              <LayoutGrid size={40} className="mb-3 opacity-50" />
              <p className="text-base sm:text-lg font-medium">
                No Tray Groups found
              </p>
              <p className="text-xs sm:text-sm">
                Create a tray group to start tracking plants
              </p>
            </div>
          )}


          {/* GROUP CARDS */}
          {trayGroupsData?.map((group) => (
            <div
              key={group.tray_group_id}
              className="tg_conb
                bg-gradient-to-br from-[#E8F3ED] to-white
                rounded-xl sm:rounded-2xl
                shadow-md hover:shadow-lg
                border border-gray-100
                transition-shadow
                p-3 sm:p-5
              "
            >
              <div className="flex flex-col lg:flex-row gap-3">

                {/* LEFT CONTENT */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl 
                      bg-gradient-to-br from-[#A8C7B8] to-[#7BA591]
                      flex items-center justify-center"
                    >
                      {/* ✅ Trays icon */}
                      <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>

                    <div>
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
                        [{group.group_number}] {group.tray_group_name} Group
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-500">
                        {group.description}
                      </p>

                      {group.location && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                          <span className="font-semibold">Location:</span>{" "}
                          {group.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* MOISTURE */}
                  <div className="flex flex-wrap gap-4 mt-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 uppercase">Min:</span>
                      <span className="font-semibold text-[#7BA591]">
                        {group.min_moisture}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 uppercase">Max:</span>
                      <span className="font-semibold text-[#7BA591]">
                        {group.max_moisture}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="
                  flex flex-col items-end gap-2
                  lg:flex-row lg:items-center
                ">
                  <button
                    onClick={() => handleAddTray(group)}
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
                    ADD TRAY
                  </button>

                  <button
                    onClick={() => handleUpdate(group)}
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



                      
                    {Number(group.sensor_count) === 0 && (
                    <button
                      onClick={() => handleDelete(group)}
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
                      ">
                      DELETE
                    </button>
                    )}
  


                    
        

                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Tray_groups;
