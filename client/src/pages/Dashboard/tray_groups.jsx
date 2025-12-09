import React from 'react';
import { Sprout } from 'lucide-react';

function Tray_groups({trayGroupsData,
  setTrayGroupModalOpen,setTrayModalOpen,
  setTgModalMode,setTrayModalMode,
  setSelectedTrayGroup}) {

  // TrayGroup handlers
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
  // Tray handlers
  const handleAddTray = (group) => {
    setSelectedTrayGroup(group);
    setTrayModalMode("insert");
    setTrayModalOpen(true);
  };

  
  return (
    <>
      <header className="flex py-4">
        <div className="w-1/2 flex items-center justify-start">
          <p className="text-2xl">Tray Groups</p>
        </div>
        <div className="w-1/2 flex items-center justify-start flex-row-reverse">
          <button
            onClick={handleAdd}
            className="rounded-xl shadow-lg px-4 py-2 bg-[var(--sage)] text-[var(--main-white--)] cursor-pointer"
          >
            Add Tray Group
          </button>
        </div>
      </header>



      <div className="h-[270px] overflow-hidden">
        <div className="space-y-3 h-full overflow-y-auto pr-2">
          {trayGroupsData?.map((group) => (
            <div
              key={group.tray_group_id}
              className="bg-gradient-to-br from-[#E8F3ED] to-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A8C7B8] to-[#7BA591] flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {group.tray_group_name}
                      </h3>
                      <p className="text-sm text-gray-500">{group.description}</p>
                    </div>
                  </div>

                  <div className="ml-13 flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Min Moisture:
                      </span>
                      <span className="text-sm font-semibold text-[#7BA591]">
                        {group.min_moisture}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Max Moisture:
                      </span>
                      <span className="text-sm font-semibold text-[#7BA591]">
                        {group.max_moisture}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center h-full gap-2 my-4">
                  <button
                    onClick={() => handleAddTray(group)}
                    className="cursor-pointer u_btn shadow-lg bg-[var(--sancgc)] text-white">
                    ADD TRAY
                  </button>
                  <button
                    onClick={() => handleUpdate(group)}
                    className="cursor-pointer u_btn shadow-lg bg-[var(--white-blple--)] text-white">
                    UPDATE
                  </button>
                  <button
                    onClick={() => handleDelete(group)}
                    className="cursor-pointer u_btn shadow-lg bg-[var(--color-danger-b)] text-white">
                    DELETE
                  </button>
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
