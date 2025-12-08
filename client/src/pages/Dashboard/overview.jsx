import { Quick_Stats } from "./quick_stats" 
import Nursery from "./nursery.jsx"
import { Droplets,Leaf,Sprout, Plus,X,Wind,Sun} from 'lucide-react';


const GaugeChart = ({ value, max, label, unit, icon: Icon, color }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F3ED" strokeWidth="8"/>
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="none" 
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${percentage * 2.827} 282.7`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-6 h-6 mb-1" style={{ color }} />
          <span className="text-xl font-bold text-[#003333]">{value}</span>
          <span className="text-xs text-[#5A8F73]">{unit}</span>
        </div>
      </div>
      <p className="text-sm text-[#003333] mt-3 font-medium">{label}</p>
    </div>
  );
};


function Overview() {
  return (
    <div className='flex items-center flex-col justify-start gap-4 w-full h-full '>
      
          {/* NUMBER CONTAINER */}
          <Quick_Stats
            data_box={
              <>              
             
                <div className="bg-white w-full rounded-2xl  shadow-lg hover:shadow-xl transition-all">
                    <div className="scale-90 origin-center">
                        <GaugeChart value={48} max={100} label="Moisture" unit="%" icon={Droplets} color="#027c68" />
                    </div>
                    
                </div>
              
              
                <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="scale-90 origin-center">
                      <GaugeChart value={6.8} max={14} label="Water Level" unit="" icon={Droplets} color="#8f9bbc" />
                  </div>            
                </div>        

                {/* plants */}
                <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="scale-90 origin-center">
                      <GaugeChart value={6.8} max={14} label="Plants" unit="" icon={Sprout} color="#8f9bbc" />
                  </div>            
                </div> 

                
                {/* Growth */}
                  <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="scale-90 origin-center">
                      <GaugeChart value={6.8} max={14} label="Growth" unit="" icon={Leaf} color="#8f9bbc" />
                  </div>            
                </div>    

                {/* Died */}
                  <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="scale-90 origin-center">
                      <GaugeChart value={6.8} max={14} label="Died" unit="" icon={X} color="#8f9bbc" />
                  </div>            
                </div>    

                {/* replants */}
                  <div className="bg-white w-full rounded-2xl shadow-lg hover:shadow-xl transition-all">
                  <div className="scale-90 origin-center">
                      <GaugeChart value={6.8} max={14} label="Replants" unit="" icon={Plus} color="#8f9bbc" />
                  </div>            
                </div>           

              </>
            }/>

          {/* MAIN */}
          <main className='bg-white
          flex flex-col items-center justify-start h-full  w-full col-start-2 col-end-4 row-start-3 row-end-3
          rounded-[10px] overflow-y-auto
            '> 
            <Nursery/>
          </main>

        
    </div>
  )
}

export default Overview