import { useState, useEffect } from "react";
import { X, Plus, Edit, Delete,CircleX } from "lucide-react";
import * as bedService from "../../data/bedServices";

function BedModal({ isBedOpen, onBedClose, bedMode, selectedBed, loadBedData, scsMsg, errMsg }) {
  const [formData, setFormData] = useState({
    bed_number: "",
    bed_code: "",
    bed_name: "",
    location: "",
    is_watering: false,
    min_moisture: "",
    max_moisture: ""
  });
  const [formError,setFormError] = useState([]);
  
  

  useEffect(() => {
    if (bedMode === "insert") {
      setFormData({
        bed_number: "",
        bed_code: "",
        bed_name: "",
        location: "",
        is_watering: false,
        min_moisture: "",
        max_moisture: ""
      });
    } else {
      setFormData({
        bed_number: selectedBed.bed_number,
        bed_code: selectedBed.bed_code,
        bed_name: selectedBed.bed_name,
        location: selectedBed.location,
        is_watering: selectedBed.is_watering,
        min_moisture: selectedBed.min_moisture,
        max_moisture: selectedBed.max_moisture
      });
    }
  }, [isBedOpen, bedMode, selectedBed]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (bedMode === "insert") {
        await bedService.insertBeds(formData);
        loadBedData();
        setFormError([])
        onBedClose();
        scsMsg(`${formData.bed_name} Added`);
      } else if (bedMode === "update") {
        await bedService.updateBeds(formData, selectedBed.bed_id);
        loadBedData();
        setFormError([])
        onBedClose();
        scsMsg(`${formData.bed_name} Updated`);
      } else {
        await bedService.deleteBed(selectedBed.bed_id);
        loadBedData();
        setFormError([])
        onBedClose();
        scsMsg(`${formData.bed_name} Deleted`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setFormError(error.response.data)
      errMsg?.("Error submitting bed data");
    }
  };

  if (!isBedOpen) return null;


  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl">
      <main className={`rounded-xl overflow-hidden bg-white w-[45%]`}>
        
        {/* Header */}
        <header className={`flex items-center justify-between p-6  rounded-t-xl 
            ${ bedMode === "insert" ? "bg-[var(--sage-light)]"  : bedMode === "update" ? "bg-[var(--white-blple--)]"  : "bg-red-100"}`} >
          <div className="flex items-center gap-3 ">
            {bedMode === "insert" ? <Plus stroke="white" /> : bedMode === "update" ? <Edit stroke="white" /> : <Delete fill="rgb(53,53,53,0.2)" stroke="white" />}
            <h2 className={`text-xl font-semibold ${bedMode === "delete" ? "text-[var(--metal-dark4)]" : "text-white"}`}>
              {bedMode === "insert" ? "Add New Bed" : bedMode === "update" ? "Update Bed" : "Delete Bed"}
            </h2>
          </div>
          <button onClick={onBedClose} className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </header>





        {bedMode === "delete" ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl">
            <CircleX className="stroke-1 stroke-red-300" size={90}/>
            <p className="text-2xl mt-12 mb-6">Are you sure?</p>
            <p className="text-sm mb-12 text-[var(--metal-dark4)]">Are you sure you want to delete {selectedBed.bed_name}?</p>
            <div className="flex w-full justify-center gap-4 mt-">
              <button onClick={onBedClose} className="flex-1 px-4 py-2.5 bg-[var(--metal-dark4)] text-[var(--main-white--)] rounded-lg
               hover:bg-[var(--acc-darkc)] font-semibold text-[0.9rem]">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 text-white bg-[var(--color-danger-b)] rounded-lg hover:shadow-lg font-semibold text-[0.9rem]">Delete</button>
            </div>
          </div>

        ) : (
          <form className="grid grid-cols-2 gap-4 p-6" onSubmit={handleSubmit}>
            {/* Left Column */}
            <div className="flex flex-col gap-4">

          
              <input
                type="text"
                name="bed_number"
                placeholder="Bed Number"
                value={formData.bed_number}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                required
              />
              <input
                type="text"
                name="bed_code"
                placeholder="Bed Code"
                value={formData.bed_code}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                required
              />
              {formError?.error && <p>{formError.error}</p>}


              <input
                type="text"
                name="bed_name"
                placeholder="Bed Name"
                value={formData.bed_name}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
          
              <input
                type="number"
                name="min_moisture"
                placeholder="Min Moisture"
                value={formData.min_moisture}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                required
              />
              <input
                type="number"
                name="max_moisture"
                placeholder="Max Moisture"
                value={formData.max_moisture}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={onBedClose} className="px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] font-semibold text-[0.9rem]">Cancel</button>
             <button
                type="submit"
                className={`px-4 py-2.5 rounded-lg hover:shadow-lg font-semibold text-[0.9rem] ${
                    bedMode === "insert"
                    ? "bg-gradient-to-r from-[var(--ptl-greenb)] to-[var(--ptl-greenc)] text-white"
                    : "bg-[var(--white-blple--)] text-black"
                }`}>

            {bedMode === "insert" ? "Add Bed" : "Update Bed"}
            </button>


            </div>
          </form>



        )}
      </main>
    </div>
  );
}

export default BedModal;
