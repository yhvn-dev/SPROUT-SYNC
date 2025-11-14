import { useState } from 'react';
import { Db_Header } from '../../components/db_header';
import { Sidebar } from '../../components/sidebar';

import BedsScreen from './bedsScreen';
import SensorsScreen from './sensorsScreen';
import BedModal from './bedsModal';


// Main Component
const DeviceManagement = () => {
  const [activeTab, setActiveTab] = useState('beds');
  const [bed,setBedData] = useState([])
  const [open,setOpen] = useState(false)
  const [mode,setMode] = useState("")

  const COLORS = [
    'var(--ptl-greena)',
    'var(--ptl-greenb)',
    'var(--ptl-greenc)',
    'var(--ptl-greend)',
    'var(--ptl-greene)',
    'var(--sage)',
    'var(--sage-medium)'
  ];


  return (
    <section className="grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_90vh] 
    h-[100vh] w-[100%] gap-4 overflow-y-auto relative 
    bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">
        
      <Db_Header  
        input={               
            <>
            <input type="text" placeholder='' className='border-[1px] border-[var(--metal-dark4)] outline-[var(--sage)] rounded-2xl px-4'/>
            <label>Search For Beds</label>
            </>}
        />
         
      <Sidebar />
      
      
      {/* Main Content */}
      <main className="row-start-2  col-start-2 col-span-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6 overflow-y-auto">
            
        
        <div className='w-full py-4 row-start-2 row-end-2 col-start-2 col-span-full center '>

            <nav className='center-l h-full w-1/2'>        
                <button
                    onClick={() => setActiveTab('beds')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium  mr-2 transition-all ${
                    activeTab === 'beds'
                        ? 'bg-white text-[#027c68] shadow-md' 
                        : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
                    }`}>
                    Beds
                </button>
                <button
                    onClick={() => setActiveTab('sensors')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ml-2 transition-all ${
                    activeTab === 'sensors'
                        ? 'bg-white text-[#027c68] shadow-md' 
                        : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
                    }`}
                >
                    Sensors
                </button>
                
            </nav>

            <div className='center h-full w-1/2 0'>     
                <p className='text-sm text-[var(--acc-darkc)] text-end'>
                    Manage and monitor all connected devices, including beds and sensors, within your automated watering system      
                </p>
            </div>


        </div>
            
    
        {/* Beds Tab */}
        {activeTab === 'beds' && (
        <BedsScreen setOpen={setOpen} onClose={setOpen} setMode={setMode} />
        )}

        {/* Sensors Tab */}
        {activeTab === 'sensors' && (
          <SensorsScreen/>
        )}
      </main>

    {open && <BedModal isOpen={setOpen} onClose={() => setOpen(false)} mode={mode}/>}
        

    </section>
  );
};

export default DeviceManagement;