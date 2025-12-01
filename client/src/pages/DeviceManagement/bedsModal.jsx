import { useState, useEffect } from "react";
import { X, Plus, Edit, Delete, CircleX } from "lucide-react";
import * as bedService from "../../data/bedServices";

function BedModal({ isBedOpen, onBedClose, bedMode, selectedBed, loadBedData, scsMsg, errMsg }) {
  const [formData, setFormData] = useState({
    bed_code: "BC-",
    bed_name: "",
    location: "",
    is_watering: false,
    min_moisture: "",
    max_moisture: ""
  });
  const [formError, setFormError] = useState([]);

  
  // Extract number from string
  const extractNumber = (str) => {
    if (!str) return "";
    const match = str.match(/\d+/);
    return match ? match[0] : "";
  };

  useEffect(() => {
    if (!isBedOpen) return;

    if (bedMode === "insert") {
      setFormData({
        bed_code: "BC-",
        bed_name: "",
        location: "",
        is_watering: false,
        min_moisture: "",
        max_moisture: ""
      });
    } else if (selectedBed) {
      const bedCodeOnly = extractNumber(selectedBed.bed_code);
      setFormData({
        bed_code: `BC-${bedCodeOnly}`,
        bed_name: selectedBed.bed_name,
        location: selectedBed.location,
        is_watering: selectedBed.is_watering,
        min_moisture: selectedBed.min_moisture,
        max_moisture: selectedBed.max_moisture
      });
    }
  }, [isBedOpen, bedMode, selectedBed]);

  const handleBedCodeChange = (e) => {
    let inputValue = e.target.value;
    if (inputValue === "" || inputValue.toUpperCase() === "B" || inputValue.toUpperCase() === "BC") {
      setFormData(prev => ({ ...prev, bed_code: "BC-" }));
      return;
    }
    const numberPart = inputValue.replace(/^BC-*/i, '').replace(/\D/g, '');
    setFormData(prev => ({ ...prev, bed_code: numberPart ? `BC-${numberPart}` : "BC-" }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "bed_code") return;
    const updatedValue = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
  };


    const handleSubmit = async (e) => {
      e.preventDefault();

      // Validate bed_code and bed_name
      const errors = [];

      if (!formData.bed_name || formData.bed_name.trim() === "") {
        errors.push({ path: "bed_name", msg: "Bed Name is required" });
      }

      if (!/^BC-\d+$/.test(formData.bed_code)) {
        errors.push({ path: "bed_code", msg: "Bed code must start with BC- followed by numbers" });
      }

      if (errors.length > 0) {
        setFormError(errors);
        return;
      }

      try {
        const formattedData = {
          ...formData,
          bed_code: formData.bed_code === "BC-" ? "BC-" : formData.bed_code
        };

        if (bedMode === "insert") {
          await bedService.insertBeds(formattedData);
          scsMsg(`${formattedData.bed_name} Added`);


        } else if (bedMode === "update") {
          await bedService.updateBeds(formattedData, selectedBed.bed_id);
          scsMsg(`${formattedData.bed_name} Updated`);


        } else if (bedMode === "delete") {
          await bedService.deleteBed(selectedBed.bed_id);
          scsMsg(`${formData.bed_name} Deleted`);
        }

        loadBedData();
   
        setFormError([]);
        onBedClose();
      } catch (error) {
        const bedError = error.response?.data;
        if (bedError?.errors) {
          setFormError(bedError.errors);
        } else if (bedError?.error) {
          setFormError([{ path: "bed_code", msg: bedError.error }]);
        } else {
          setFormError([{ path: "general", msg: "Error submitting bed data" }]);
        }
        errMsg?.("Error submitting bed data");
      }
  };




  const getErrorMsg = (fieldName) => {
    const err = formError.find(e => e.path === fieldName);
    return err ? err.msg : "";
  };




  if (!isBedOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl">
      <main className="rounded-xl overflow-hidden bg-white w-[45%]">
        {/* Header */}
        <header className={`flex items-center justify-between p-6 rounded-t-xl 
            ${bedMode === "insert" ? "bg-[var(--sage-light)]" : bedMode === "update" ? "bg-[var(--white-blple--)]" : "bg-red-100"}`}>
          <div className="flex items-center gap-3">
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
            <div className="flex w-full justify-center gap-4">
              <button onClick={onBedClose} className="flex-1 px-4 py-2.5 bg-[var(--metal-dark4)] text-[var(--main-white--)] rounded-lg hover:bg-[var(--acc-darkc)] font-semibold text-[0.9rem]">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 text-white bg-[var(--color-danger-b)] rounded-lg hover:shadow-lg font-semibold text-[0.9rem]">Delete</button>
            </div>
          </div>
        ) : (
          <form className="grid grid-cols-2 gap-4 p-6" onSubmit={handleSubmit}>
            {/* Bed Code */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="bed_code"
                placeholder="Type bed code (e.g., 001)"
                value={formData.bed_code}
                onChange={handleBedCodeChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
              {getErrorMsg("bed_code") && <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("bed_code")}</span>}
            </div>

            {/* Bed Name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="bed_name"
                placeholder="Bed Name"
                value={formData.bed_name}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
              {getErrorMsg("bed_name") && <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("bed_name")}</span>}
            </div>


            {/* Location */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
              {getErrorMsg("location") && <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("location")}</span>}
            </div>


              {/* Max Moisture */}
            <div className="flex flex-col gap-1">
              <input
                type="number"
                name="max_moisture"
                placeholder="Max Moisture"
                value={formData.max_moisture}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
                {getErrorMsg("max_moisture") && <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("max_moisture")}</span>}
            </div>

            {/* Min Moisture */}
            <div className="flex flex-col gap-1">
              <input
                type="number"
                name="min_moisture"
                placeholder="Min Moisture"
                value={formData.min_moisture}
                onChange={handleChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
                {getErrorMsg("min_moisture") && <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("min_moisture")}</span>}
            </div>

        
            {/* Buttons */}
            <div className="col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={onBedClose} className="px-4 py-2.5 bg-[var(--sage-lighter)] text-[var(--ptl-greenh)] rounded-lg hover:bg-[var(--sage-light)] font-semibold text-[0.9rem]">Cancel</button>
              <button type="submit" className={`px-4 py-2.5 rounded-lg hover:shadow-lg font-semibold text-[0.9rem] ${bedMode === "insert" ? "bg-gradient-to-r from-[var(--ptl-greenb)] to-[var(--ptl-greenc)] text-white" : "bg-[var(--white-blple--)] text-black"}`}>
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
