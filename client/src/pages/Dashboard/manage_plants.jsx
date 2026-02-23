import { useEffect, useState, useCallback } from 'react';
import { Sprout, LayoutGrid, TrendingUp } from 'lucide-react';

import Tray_groups from './tray_groups';
import Trays from "./trays";
import Plant_batches from './plant_batches';

import { FloatSuccessMsg, SucessMsgs } from "../../components/sucessMsgs";

import * as trayGroups from "../../data/trayGroupServices";
import * as trays from "../../data/traysServices";
import * as batches from "../../data/batchesData";

import { TrayGroupModal } from './modals/trayGroupModal';
import { TrayModal } from "./modals/trayModal";
import { BatchModal } from './modals/batchModal';

const ManagePlants = ({ reloadTrayGroups }) => {
  const [activeTab, setActiveTab] = useState('trayGroups');
  const [successMsg, setSuccessMsg] = useState("");

  const [trayGroupsData, setTrayGroupsData] = useState([]);
  const [traysData, setTraysData] = useState([]);
  const [batchesData, setBatchesData] = useState([]);

  const [tgModalMode, setTgModalMode] = useState("");
  const [isTrayGroupModalOpen, setTrayGroupModalOpen] = useState(false);
  const [selectedTrayGroup, setSelectedTrayGroup] = useState([]);

  const [isTrayModalOpen, setTrayModalOpen] = useState(false);
  const [trayModalMode, setTrayModalMode] = useState("");
  const [selectedTray, setSelectedTray] = useState([]);

  const [isBatchModalOpen, setBatchModalOpen] = useState(false);
  const [batchModalMode, setBatchModalMode] = useState("");
  const [selectedBatch, setSelectedBatches] = useState([]);



  

  const clearMsg = useCallback(() => setSuccessMsg(""), []);

  useEffect(() => {
    if (activeTab === "trayGroups") loadTrayGroups();
    if (activeTab === "trays") loadTrays();
    if (activeTab === "batches") loadBatches();
  }, [activeTab]);

  const loadTrayGroups = async () => {
    try {
      const data = await trayGroups.fetchAllTrayGroups();
      setTrayGroupsData(data);
    } catch (err) {
      console.error("Error loading tray groups");
    }
  };

  const loadTrays = async () => {
    try {
      const data = await trays.fetchAllTrays();
      setTraysData(data);
    } catch (err) {
      console.error("Error loading trays");
    }
  };

  const loadBatches = async () => {
    try {
      const data = await batches.fetchAllBatches();
      setBatchesData(data);
    } catch (err) {
      console.error("Error loading batches");
    }
  };

  return (
    <>


      {/* ROOT COLORS */}
      <style>{`
        :root {
          --sage: #7BA591;
          --sage-light: #A8C7B8;
          --sage-lighter: #E8F3ED;
        }
      `}</style>

      {/* OUTER CONTAINER */}
      <div className="w-full max-w-7xl mx-0 sm:mx-auto sm:px-0 relative">

        {/* SUCCESS MESSAGE */}
        <div className="mb-3 sm:mb-4">
          <SucessMsgs txt={successMsg} clearMsg={clearMsg} />
        </div>

  

        {/* TABS */}
        <nav className="manage_plants_nav bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 sm:mb-6">
          <div className="flex sm:flex-row gap-2 p-2">
            {[
              { key: 'trayGroups', label: 'Tray Groups', icon:LayoutGrid  },
              { key: 'trays', label: 'Trays', icon: Sprout },
              { key: 'batches', label: 'Plant Batches', icon: TrendingUp },
            ].map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`manage_plants_button flex-1 flex items-center justify-center gap-2
                    px-3 sm:px-6 py-2.5 sm:py-3
                    rounded-xl sm:rounded-2xl
                    text-sm sm:text-base font-medium
                    transition-all
                    cursor-pointer
                    ${active
                      ? 'bg-gradient-to-r from-[var(--sancgb)] to-[var(--sancga)] text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50 {'
                    }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* CONTENT */}
        <div className="manage_plants_page_wrapper bg-white rounded-2xl h-[450px] sm:rounded-3xl shadow-sm border  border-gray-100 p-3 sm:p-6 mt-4">   
          {activeTab === 'trayGroups' && (
            <Tray_groups
              trayGroupsData={trayGroupsData}
              setTrayGroupModalOpen={setTrayGroupModalOpen}
              setTgModalMode={setTgModalMode}
              setTrayModalOpen={setTrayModalOpen}
              setTrayModalMode={setTrayModalMode}
              setSelectedTrayGroup={setSelectedTrayGroup}
            />
          )}

          {activeTab === 'trays' && (
            <Trays
              traysData={traysData}
              trayGroupsData={trayGroupsData}
              setTrayModalOpen={setTrayModalOpen}
              setTrayModalMode={setTrayModalMode}
              setSelectedTray={setSelectedTray}
              setBatchModalMode={setBatchModalMode}
              setBatchModalOpen={setBatchModalOpen}
              setSelectedTrayGroup={setSelectedTrayGroup}
            />
          )}

          {activeTab === 'batches' && (
            <Plant_batches
              traysData={traysData}
              batchesData={batchesData}
              setBatchModalOpen={setBatchModalOpen}
              setBatchModalMode={setBatchModalMode}
              setSelectedBatches={setSelectedBatches}
            />
          )}
        </div>
      </div>

      {/* MODALS */}
      {isTrayGroupModalOpen && (
        <TrayGroupModal
          isOpen
          onClose={() => setTrayGroupModalOpen(false)}
          tgModalMode={tgModalMode}
          trayGroupData={trayGroupsData}
          selectedTrayGroup={selectedTrayGroup}
          setSuccessMsg={setSuccessMsg}
          loadTrayGroups={loadTrayGroups}
          reloadTrayGroups={reloadTrayGroups}
        />
      )}

      {isTrayModalOpen && (
        <TrayModal
          isOpen
          onClose={() => setTrayModalOpen(false)}
          trayModalMode={trayModalMode}
          selectedTrayGroup={selectedTrayGroup}
          selectedTray={selectedTray}
          setSuccessMsg={setSuccessMsg}
          reloadTray={loadTrays}
        />
      )}

      {isBatchModalOpen && (
        <BatchModal
          isOpen
          onClose={() => setBatchModalOpen(false)}
          batchModalMode={batchModalMode}
          selectedTray={selectedTray}
          selectedBatch={selectedBatch}
          setSuccessMsg={setSuccessMsg}
          reloadBatches={loadBatches}
        />
      )}
    </>
  );
};



export default ManagePlants;
