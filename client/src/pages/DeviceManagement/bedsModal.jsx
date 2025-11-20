import { useState,useEffect } from "react";
import { X, Plus, Edit,Delete } from "lucide-react";
import * as bedService from "../../data/bedServices"

function BedModal({ isBedOpen,onBedClose,bedMode,selectedBed,loadBedData,scsMsg,errMsg}) {
  const [formData,setFormData] = useState({bed_number:"",
                                          bed_code:"",
                                          bed_name:"",
                                          location:"",
                                          status:""})
                                                    
    useEffect(() =>{
        if(bedMode === "insert"){
            setFormData({bed_number:"",
                        bed_code:"",
                        bed_name:"",
                        location:"",
                        status:""})
        }else{
            setFormData({bed_number:selectedBed.bed_number,
                        bed_code:selectedBed.bed_code,
                        bed_name:selectedBed.bed_name,
                        location:selectedBed.location,
                        status:selectedBed.status})
        }
    },[isBedOpen,bedMode,onBedClose])



    const handleChange = (e) =>{
        const {name,value} = e.target

        setFormData(prev =>({
            ...prev,[name]:value
        }))
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try {
            if(bedMode === "insert"){
                await bedService.insertBeds(formData)
                loadBedData()
                isBedOpen(false)
                scsMsg(`${formData.bed_name} Added`)
            }else if(bedMode === "update"){             
                await bedService.updateBeds(formData,selectedBed.bed_id)
                loadBedData() 
                isBedOpen(false)
                scsMsg(`${formData.bed_name} Updated`)
            }else{
                await bedService.deleteBed(selectedBed.bed_id)
                loadBedData()   
                isBedOpen(false)
                scsMsg(`${formData.bed_name} Deleted`)
        }    
        } catch (error) {
            console.error("Submit Error")
        }
    }

               
  if(!isBedOpen) return null

  return (
    <div className="fixed column inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl ">

        <main className={`rounded-xl overflow-hidden column bg-white  
            ${bedMode  === "insert" || bedMode === "update" ? "w-[45%]" : "h-[40%]"   } ` }>
             {/* Header */}
            <header className="flex items-center justify-between p-6 bg-[var(--sage-light)] rounded-t-xl">
            <div className="flex items-center gap-3">
                {bedMode === "insert" ? <Plus stroke="white"/> : bedMode  === "update" ? <Edit stroke="white"/> : <Delete fill="rgb(53,53,53,0.2)" stroke="white"/>}
                <h2 className="text-xl font-semibold text-white">
                {bedMode  === "insert" ? "Add New Bed" 
                : bedMode  === "update" ?  "Update Bed" 
                : "Delete Bed"}
                </h2>
            </div>

            <button
                onClick={onBedClose}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
                <X className="w-6 h-6" />
            </button>
            </header>

            {bedMode  === "delete" ? (
                <div className="full flex items-start flex-col justify-center p-8 rounded-xl">
                    <p>Are you sure you want to delete this bed?</p>  
                    <div className="center-l full ">
                        <button onClick={onBedClose} className="flex-1 mx-4 px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] transition-colors font-semibold text-[0.9rem]">Cancel</button>       
                        <button onClick={handleSubmit} type="button" className={`flex-1 mx-4 px-4 py-2.5              
                    text-white rounded-lg bg-[var(--color-danger-b)] hover:shadow-lg transition-all font-semibold text-[0.9rem]`}>Delete</button>       
                    </div>                
                </div>        
            ) :
            (
                <>      
            {/* Bed Form */}
            <form  className="grid grid-cols-2 grid-rows-[8fr_2fr] p-6 space-y-4">   

                <div className="flex items-center justify-evenly flex-col full col-start-1 col-end-1 row-start-1 row-end-1 p-4">
    
                    {/* Bed Number */}
                    <div className="form_box input-box relative center">                  
                        <input
                        type="text"
                        name="bed_number"
                        onChange={handleChange}
                        value={formData.bed_number}                           
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0  text-[var(--acc-darkc)]">Bed Number</label>
                    </div>
                        
                    {/* Bed Code */}
                    <div className="form_box input-box relative center">                
                        <input
                        type="text"
                        name="bed_code"
                        onChange={handleChange}      
                        value={formData.bed_code}                                         
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0 text-[var(--acc-darkc)]">Bed Code</label>
                    </div>

                    {/* Bed Name */}
                    <div className="form_box input-box relative center">                  
                        <input
                        type="text"
                        name="bed_name"   
                        onChange={handleChange}         
                        value={formData.bed_name}                        
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0  text-[var(--acc-darkc)]">Bed Name</label>
                    </div>                        
                </div>

                
                <div className="flex items-center justify-evenly flex-col  full p-4 col-start-2 col-end-2 row-start-1 row-end-1">
                    {/* Location */}
                    <div className="form_box input-box relative center">                   
                        <input
                        type="text"
                        name="location" 
                        onChange={handleChange}    
                        value={formData.location}                         
                        className="w-full px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)] transition-colors text-[0.9rem]"
                        placeholder=""/>
                        <label className="absolute text-sm px-4 pointer-events-none left-0 text-[var(--acc-darkc)]">Location</label>
                    </div> 
                    {/* Status Toggle */}
                    <div className="flex items-center justify-between  p-2 bg-[var(--sage-lighter)] rounded-lg">                            
                        <p>Status</p>
                    </div>
                </div>


                {/* Action Buttons */}
                <div className="flex items-center justify-end col-start-1 col-span-full gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onBedClose}
                        className=" px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] transition-colors font-semibold text-[0.9rem]">
                        Cancel
                    </button>
                    
                    <button
                    type="submit"  
                    onClick={handleSubmit}               
                    className={` px-4 py-2.5 
                    ${bedMode === "insert" ? "bg-gradient-to-r from-[var(--ptl-greenb)] to-[var(--ptl-greenc)]" : 
                    "bg-gradient-to-r from-[var(--white-blple--)] to-[var(--purpluish--)]" }
                    text-white rounded-lg hover:shadow-lg transition-all font-semibold text-[0.9rem]`}
                    >
                    {bedMode  === "insert" ? "Add Bed" : "Update Bed"}
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