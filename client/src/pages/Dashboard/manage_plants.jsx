import {useEffect, useState, useCallback} from 'react';
import {Sprout, LayoutGrid, TrendingUp} from 'lucide-react';
import Tray_groups from './tray_groups';
import Trays from "./trays"
import Plant_batches from './plant_batches';
import { FloatSuccessMsg, SucessMsgs  } from "../../components/sucessMsgs"

import * as trayGroups from "../../data/trayGroupServices"
import * as trays from "../../data/traysServices"
import * as sensors from "../../data/sensorServices"
import * as batches from "../../data/batchesData"
import * as readings from "../../data/readingsServices"

import { TrayGroupModal } from './modals/trayGroupModal';
import { TrayModal  } from "./modals/trayModal"
import { BatchModal } from './modals/batchModal';


const ManagePlants = ({reloadTrayGroups,reloadTrays,reloadBatches}) => {
  const [activeTab, setActiveTab] = useState('trayGroups');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({});
  const [successMsg,setSuccessMsg] = useState("");
  const [errorMsg,setErrorMsg] = useState("");
 
  const [trayGroupsData,setTrayGroupsData] = useState([])
  const [traysData,setTraysData] = useState([]);
  const [batchesData,setBatchesData] = useState([])

  const [tgModalMode,setTgModalMode] = useState(""); 
  const [isTrayGroupModalOpen,setTrayGroupModalOpen] = useState(false)
  const [selectedTrayGroup, setSelectedTrayGroup] = useState([]);
  
  const [isTrayModalOpen, setTrayModalOpen] = useState(false);
  const [trayModalMode, setTrayModalMode] = useState("")
  const [selectedTray,setSelectedTray] = useState([]);


  const [isBatchModalOpen,setBatchModalOpen] = useState(false)
  const [batchModalMode, setBatchModalMode] = useState("")
  const [selectedBatch,setSelectedBatches] = useState([])

  


  const clearMsg =  useCallback(() => {
    setSuccessMsg("")
  },[]);
  
  useEffect(() =>{
    if(activeTab === "trayGroups"){
      loadTrayGroups()
    }else if(activeTab === "trays"){
      loadTrays()
    }else if(activeTab === "batches"){
      loadBatches()
    }
  },[activeTab])

  
  const loadTrayGroups = async () =>{
      try {
      const tgData = await trayGroups.fetchAllTrayGroups()
      setTrayGroupsData(tgData)
    } catch (error) {
      console.error("Error Loading Tray Groups")
    }
  }
  const loadTrays = async () =>{
      try {
      const traysData = await trays.fetchAllTrays()
      setTraysData(traysData)
    } catch (error) {
      console.error("Error Loading Trays")
    }
  } 
  const loadBatches = async () => {
      try {
      const pb = await batches.fetchAllBatches()
      console.log("PLANT BATCHES",pb)
      setBatchesData(pb)
    } catch (error) {
      console.error("Error Loading Batches")
    }
  }



  return (
  <>
      <style>{`
        :root {
          --sage: #7BA591;
          --sage-light: #A8C7B8;
          --sage-lighter: #E8F3ED;
          --sage-dark: #5A8F73;
          --sage-medium: #C4DED0;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className='mb-4'>
          <SucessMsgs txt={successMsg} clearMsg={clearMsg}/>    
        </div>
    
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Plant Management</h1>
              <p className="text-sm text-gray-500 mt-1">Configure tray groups, trays, and plant batches</p>
            </div>
          
          </div>
        </div>


       
        {/* Navigation Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-6">
          <div className="flex p-2 gap-2">
            <button
              onClick={() => setActiveTab('trayGroups')}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'trayGroups'
                  ? 'bg-gradient-to-r from-[#A8C7B8] to-[#7BA591] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Sprout className="w-5 h-5" />
              Tray Groups
            </button>
            <button
              onClick={() => setActiveTab('trays')}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'trays'
                  ? 'bg-gradient-to-r from-[#A8C7B8] to-[#7BA591] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
              Trays
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`cursor-pointer flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all ${
                activeTab === 'batches'
                  ? 'bg-gradient-to-r from-[#A8C7B8] to-[#7BA591] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Plant Batches
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="rounded-3xl shadow-sm border border-gray-100 p-6 bg-white">
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
            <>
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
            </>
          )}

          {activeTab === 'batches' && (
               <Plant_batches 
               traysData={traysData} 
               batchesData={batchesData}  
               setBatchModalOpen={setBatchModalOpen}
               setBatchModalMode={setBatchModalMode}
               setSelectedBatches={setSelectedBatches}/>
          )}
        </div>

  
      </div>


    {isTrayGroupModalOpen && (
      <TrayGroupModal
        isOpen={isTrayGroupModalOpen}
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
        isOpen={isTrayModalOpen}
        onClose={() => setTrayModalOpen(false)}
        isTrayModalOpen={isTrayModalOpen}
        trayModalMode={trayModalMode}       
        selectedTrayGroup={selectedTrayGroup}
        selectedTray={selectedTray}
        setSuccessMsg={setSuccessMsg}
        reloadTray={loadTrays}
      />
    )}


    {isBatchModalOpen && (
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        isBatchModalOpen={isBatchModalOpen}
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