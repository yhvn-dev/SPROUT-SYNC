import React from 'react'

import { Droplet, Activity } from 'lucide-react';


function BedSimulation() {
  return (
   <> 

   <main className='full center p-4'>

        {/* Sensor Cards */}
        <div className="grid grid-cols-6 gap-4 ">
    
            <div
        
            className="relative rounded-lg p-4 shadow-lg transition-all hover:shadow-xl bg-white border border-[var(--sage-light)]"
            >
            <div className="absolute -top-3 left-3 px-2 py-1 rounded text-sm font-semibold bg-[var(--sancgb)] text-white">
                Zone number
            </div>
            <div className="mt-4 space-y-3">
                {/* Moisture */}
                <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Droplet size={14} style={{ color: "var(--sancgb)" }} />
                    <span className="text-sm font-medium text-[var(--acc-darka)]">
                    Moisture
                    </span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[var(--sancgb)]">
                   
                    </span>
                    <span className="text-sm text-[var(--acc-darkb)]">%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[var(--sage-lighter)] overflow-hidden">
                    <div
                    className="h-full rounded-full transition-all"
                    style={{
                        backgroundColor: "var(--sancgb)",
                    }}
                    />
                </div>
                </div>

                {/* pH */}
                <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <Activity size={14} style={{ color: "var(--sancgd)" }} />
                    <span className="text-sm font-medium text-[var(--acc-darka)]">
                    pH Level
                    </span>
                </div>
                <div className="text-2xl font-bold text-[var(--sancgd)]">
                    Sensor Ph
                </div>
                <div className="flex gap-0.5">
                   
                </div>
                </div>
            </div>

            {/* Status */}
            <div className="mt-3 pt-3 border-t border-[var(--sage-light)]">
                <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--acc-darkc)]">Status</span>
                <div className="flex items-center gap-1">
                    <div
                    className="w-2 h-2 rounded-full"/>
                    <span
                    className="text-sm font-medium">

                    
                    </span>
                </div>
                </div>
            </div>
            </div>
        </div>

            
   </main>
   
   </>
  )
}

export default BedSimulation