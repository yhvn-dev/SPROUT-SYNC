import { useState } from "react";
import { X, Plus, Edit,Delete } from "lucide-react";

function BedModal({ isOpen,onClose, mode}) {

 if(!isOpen) return null

  return (
    <div className="fixed column inset-0 z-50 flex items-center justify-center ">

        <main className={`rounded-xl overflow-hidden column bg-white  ${mode === "insert" || mode === "update" ? "w-[45%]" : "h-[40%]"   } ` }>
        
             {/* Header */}
            <header className="flex items-center justify-between p-6 bg-[var(--sage-light)] rounded-t-xl">
            <div className="flex items-center gap-3">
                {mode === "insert" ? <Plus/> : mode === "update" ? <Edit/> : <Delete fill="rgb(53,53,53,0.2)" stroke="white"/>}
                <h2 className="text-xl font-semibold text-white">
                {mode === "insert" ? "Add New Bed" : mode === "update" ?  "Update Bed" : "Delete Bed"}
                </h2>
            </div>

            <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                <X className="w-6 h-6" />
            </button>
            </header>

            {mode === "delete" ? (
                <>
                <div className="full flex items-start flex-col justify-center p-8 rounded-xl">
                    <p>Are you sure you want to delete this bed?</p>  
                    <div className="center-l full ">
                        <button onClick={onClose} className="flex-1 mx-4 px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] transition-colors font-semibold text-[0.9rem]">Cancel</button>       
                        <button className={`flex-1 mx-4 px-4 py-2.5              
                    text-white rounded-lg bg-[var(--color-danger-b)] hover:shadow-lg transition-all font-semibold text-[0.9rem]`}>Delete</button>       
                    </div>                
                </div>
              
             
                </>
              
            
            ):(
            <>

            {/* Form */}
            <form className="bg-white p-6 space-y-4">               
                {/* Bed Name */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--ptl-greenh)] mb-2">
                    Bed Name
                    </label>
                    <input
                    type="text"
                    name="bed_name"
                
                    required
                    className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                    placeholder="Enter bed name"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--ptl-greenh)] mb-2">
                    Location
                    </label>
                    <input
                    type="text"
                    name="location"
            
                    required
                    className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                    placeholder="Enter location"
                    />
                </div>

                {/* Hysteresis */}
                <div>
                    <label className="block text-sm font-semibold text-[var(--ptl-greenh)] mb-2">
                    Hysteresis
                    </label>
                    <input
                    type="number"
                    name="hysteresis"
                
                    required
                    step="0.1"
                    className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                    placeholder="Enter hysteresis value"
                    />
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-4 bg-[var(--sage-lighter)] rounded-lg">
                    <label className="text-sm font-semibold text-[var(--ptl-greenh)]">
                    Active Status
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        name="is_active"
                    
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--ptl-greena)]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--ptl-greenb)]"></div>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] transition-colors font-semibold text-[0.9rem]"
                    >
                    Cancel
                    </button>
                    
                    <button
                    type="button"

                    
                    className={`flex-1 px-4 py-2.5 
                    ${mode === "insert" ? "bg-gradient-to-r from-[var(--ptl-greenb)] to-[var(--ptl-greenc)]" : 
                    "bg-gradient-to-r from-[var(--white-blple--)] to-[var(--purpluish--)]" }
                    text-white rounded-lg hover:shadow-lg transition-all font-semibold text-[0.9rem]`}
                    >
                    {mode === "insert" ? "Add Bed" : "Update Bed"}
                    </button>
                </div>
            </form>
            </>
            )}


         
        </main>    
    </div>


  );
};

export default BedModal