import { useState } from 'react'
import {BedMonitor} from "./beds"
import {Leaf} from "lucide-react"


export function Workspace({ bed,setOpenTModal}) {
  

  return (
    <section className='bg-white
      grid h-full col-start-2 col-end-4 row-start-3 row-end-3
      grid-rows-[1fr_9fr] grid-cols-[1fr] rounded-[10px] overflow-y-auto
       overflow-hidden'> 

        <div className='center w-full h-full col-start-1 col-end-4 bg-transparent mb-4 '>
            <ol className="wp_part left full flex items-center justify-start  ">
              <h1
                className="flex items-center justify-start text-2xl full  font-bold mb-2 text-[var(--sancga)">
                    <Leaf className="mx-4" />
                    <span >Greenhouse Monitoring System</span>
                </h1>
                <p className="text-sm px-4  ">
                    Real-time soil moisture and pH level monitoring
                </p>  
            </ol>
            <ol className="wp_part right w-1/3 h-full flex items-center justify-end">
                <div className="">
                </div>
            </ol>
        </div>

      {/* content area */}
      <div className="content_box flex flex-col justify-start items-center w-full h-full
        row-start-2 col-span-1 overflow-y-auto shadow-[5px_5px_20px_1px_rgba(53,53,53,0.2)] 
        rounded-[10px]">

        <div className="w-full h-full">                    
          {bed === "bed_1" && <BedMonitor bedNum="bed_1" bedName="Bed 1 " setOpenTModal={setOpenTModal}  />}
          {bed === "bed_2" && <BedMonitor bedNum="bed_2" bedName="Bed 2"  setOpenTModal={setOpenTModal} />}
          {bed === "bed_3" && <BedMonitor bedNum="bed_3" bedName="Bed 3"  setOpenTModal={setOpenTModal} />}
        </div>

      </div>
    </section>
    
  )
}
