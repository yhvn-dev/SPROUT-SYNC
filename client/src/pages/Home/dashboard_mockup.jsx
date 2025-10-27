import { Droplets, Sun, Wind, Activity, User ,LayoutPanelTop ,ChartNoAxesCombined, LogOut } from 'lucide-react';

import {Img_Logo} from "../../components/Global/logo"
import {GaugeChart}  from '../../components/Global/charts';

export function Dashboard_Mockup() {
  return (
    <>
      <section id="dashboard" className="py-24 bg-white">

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-[#003333] mb-6">
              Your Control Center
            </h2>
            <p className="text-xl text-[#5A8F73] max-w-2xl mx-auto">
              Access all your farm data through our intuitive dashboard interface
            </p>
          </div>

          {/* Mac Browser Mockup */}
          <div className="relative max-w-6xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-[#003333] bg-[#003333]">
              {/* Browser Chrome */}
              <div className="bg-[#E8F3ED] px-4 py-3 flex items-center gap-2 ">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
                </div>
                <div className="flex-1 mx-4 bg-white rounded-lg px-4 py-1.5 text-sm text-[#5A8F73] flex items-center">
                  <span className="text-[#003333] font-medium">greenlink.farm/dashboard</span>
                </div>
              </div>



              {/* Dashboard Content */}
              <div className="grid grid-cols-[1.5fr_8.5fr] grid-rows-[10vhfr_30vh_40vh] max-h-[100vh] gap-4 bg-gradient-to-br from-[#E8F3ED] to-white">
                <aside className='bg-white flex flex-col items-center justify-evenly rounded-[10px] col-start-1 col-end-1 row-start-1 row-end-4 shadow-lg '>
                    <Img_Logo/>
                    <p className='rounded-2xl shadow-lg p-2'><LayoutPanelTop strokeWidth={1.5} size={30}/></p>
                    <p className='rounded-2xl shadow-lg p-2'><User strokeWidth={1.5} size={30}/></p>
                    <p className='rounded-2xl shadow-lg p-2'><ChartNoAxesCombined strokeWidth={1.5} size={30} /></p>
                    <p className='rounded-2xl shadow-lg p-2'><LogOut strokeWidth={1.5} size={30} /></p>                          
                </aside>

                <header className="flex items-center justify-end bg-white shadow-lg rounded-[10px] p-2">
                    <div className='rounded-full w-8 h-8 mx-4 bg-[var(--pal2-whiteb)]'></div>
                </header>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {[
                    { color: '#027c68',chart:<GaugeChart value={6.8} max={14} label="Moisture" unit="" icon={Droplets} color="var(--sancgb)" /> },
                    { color: '#b0e892',chart:<GaugeChart value={6.8} max={14} label="Temperature" unit="" icon={Sun} color="var(--sancgc)" /> },
                    { color: '#7BA591',chart:<GaugeChart value={6.8} max={14} label="Humidity" unit="" icon={Wind} color="var(--sage)" /> },
                    { color: '#009983',chart:<GaugeChart value={6.8} max={14} label="pH Level" unit="" icon={Activity} color="#009983" /> },
                    { color: '#5A8F73',chart:<GaugeChart value={6.8} max={14} label="Water Level" unit="" icon={Droplets} color="var(--purpluish--" /> }
                  ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-lg">
                      <div className="relateive flex flex-col items-center text-center ">
                        <div className="w-50 h-50 aboluste">{stat.chart}</div>
                      </div>
                    </div>
                  ))}
                </div>
                

                <div className="col-start-2 col-end-3 row-start-3 row-end-3 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-sm font-semibold text-[#003333] mb-4">BED 1 - MONITORING</div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 my-2">
                    {['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].map((zone) => (
                        <>
                        <div key={zone} className="flex items-center justify-center flex-col bg-[#E8F3ED] rounded-xl p-3 text-center">
                            <p className="text-xs font-bold text-[#027c68] mb-1">{zone}</p>
                            <p className="text-lg font-bold text-[#003333]">65%</p> 
                            <p className="text-lg font-bold text-[#003333]"><Droplets size={16}/></p> 
                            
                            <p className="text-xs text-[#5A8F73]">Optimal</p>
                        </div>
                        </>
                      
                    ))}
                  </div>

                  <div className='grid grid-cols-3 md:grid-cols-6 gap-3 my-2'>
                    {['A1', 'A2', 'A3', 'A4', 'A5', 'A6'].map((zone) => (
                             
                        <div key={zone} className="flex items-center justify-center flex-col bg-[#E8F3ED] rounded-xl p-3 text-center">
                            <p className="text-xs font-bold text-[#027c68] mb-1">{zone}</p>
                            <p className="text-lg font-bold text-[#003333]">65%</p>
                            <p className="text-lg font-bold text-[#003333] "><Activity size={16}/></p>
                            <p className="text-xs text-[#5A8F73]">Optimal</p>
                        </div>
                        
                    ))}
                    
                  </div>
                    
                  
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-[#5A8F73] mb-6">
              Real-time data visualization • Multi-bed management • Historical analytics
            </p>
          </div>
        </div>
      </section>
    </>
  )


}


