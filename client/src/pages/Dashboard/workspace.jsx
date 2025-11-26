import { useState } from 'react'
import {BedLayout} from "./beds"
import {Leaf} from "lucide-react"


export function Workspace({bed,setOpenTModal,beds}) {
  
  console.log("BEDS ON WOKSPACE",beds)

  return (
    <section className='bg-white
      grid h-full col-start-2 col-end-4 row-start-3 row-end-3
      grid-rows-[1fr_9fr] grid-cols-[1fr] rounded-[10px] overflow-y-auto
       overflow-hidden'> 

        <div className='center w-full h-full col-start-1 col-end-4 bg-transparent mb-4 '>
            <ol className="wp_part full flex items-center justify-start">
                <h1
                className="flex items-center justify-start text-2xl full  font-bold mb-2 text-[var(--sancga)">
                    <Leaf className="mx-4" />
                    <span >Greenhouse Monitoring System</span>
                </h1>
                <p className="text-sm text-end px-4  ">
                    Real-time soil moisture and pH level monitoring.
                </p>  
            </ol>
        
        </div>
      {/* content area */}

      
      <div className="content_box flex flex-col justify-start items-center w-full h-full
        row-start-2 col-span-1 overflow-y-auto shadow-[5px_5px_20px_1px_rgba(53,53,53,0.2)] 
        rounded-[10px]">

        <div className="w-full h-full">                    
          {bed === "bed_1" && <BedLayout bedNum="bed_1" bedName="Bed 1 " setOpenTModal={setOpenTModal} beds={beds}  />}
          {bed === "bed_2" && <BedLayout bedNum="bed_2" bedName="Bed 2"  setOpenTModal={setOpenTModal} beds={beds} />}
          {bed === "bed_3" && <BedLayout bedNum="bed_3" bedName="Bed 3"  setOpenTModal={setOpenTModal} beds={beds} />}
        </div>

      </div>
    </section>
    
  )
}
