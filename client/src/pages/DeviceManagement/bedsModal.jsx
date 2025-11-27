import { useState, useEffect } from "react";
import { X, Plus, Edit, Delete, CircleX } from "lucide-react";
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
  const [formError, setFormError] = useState([]);

  // Function to extract just the number from existing bed_number
  const extractBedNumber = (bedNumber) => {
    if (!bedNumber) return "";
    const match = bedNumber.match(/\d+/);
    return match ? match[0] : "";
  };

  // Function to extract just the number from existing bed_code
  const extractBedCodeNumber = (bedCode) => {
    if (!bedCode) return "";
    const match = bedCode.match(/\d+/);
    return match ? match[0] : "";
  };

  // Function to format bed number with "Bed" prefix
  const formatBedNumber = (number) => {
    if (!number) return "Bed";
    return `Bed ${number}`;
  };

  // Function to format bed code with "BC-" prefix
  const formatBedCode = (number) => {
    if (!number) return "BC-";
    return `BC-${number}`;
  };

  useEffect(() => {
    if (bedMode === "insert") {
      setFormData({
        bed_number: "Bed", // Pre-fill with "Bed"
        bed_code: "BC-", // Pre-fill with "BC-"
        bed_name: "",
        location: "",
        is_watering: false,
        min_moisture: "",
        max_moisture: ""
      });
    } else {
      // For update mode, extract just the number from existing bed_number and bed_code
      const bedNumberOnly = extractBedNumber(selectedBed.bed_number);
      const bedCodeOnly = extractBedCodeNumber(selectedBed.bed_code);
      
      setFormData({
        bed_number: `Bed ${bedNumberOnly}`, // Keep full format for display
        bed_code: `BC-${bedCodeOnly}`, // Keep full format for display
        bed_name: selectedBed.bed_name,
        location: selectedBed.location,
        is_watering: selectedBed.is_watering,
        min_moisture: selectedBed.min_moisture,
        max_moisture: selectedBed.max_moisture
      });
    }
  }, [isBedOpen, bedMode, selectedBed]);

  // Special handler for bed number input
  const handleBedNumberChange = (e) => {
    const inputValue = e.target.value;
    
    // If user tries to delete "Bed", prevent it and keep "Bed"
    if (inputValue === "" || inputValue === "B" || inputValue === "Be") {
      setFormData(prev => ({ ...prev, bed_number: "Bed" }));
      return;
    }
    
    // Remove "Bed" prefix to get just the number part
    const numberPart = inputValue.replace(/^Bed\s*/i, '');
    
    // Only allow numbers
    const numbersOnly = numberPart.replace(/\D/g, '');
    
    // Combine "Bed" with the number
    const formattedValue = numbersOnly ? `Bed ${numbersOnly}` : "Bed";
    
    setFormData(prev => ({
      ...prev,
      bed_number: formattedValue
    }));
  };

  // Special handler for bed code input
  const handleBedCodeChange = (e) => {
    const inputValue = e.target.value;
    
    // If user tries to delete "BC-", prevent it and keep "BC-"
    if (inputValue === "" || inputValue === "B" || inputValue === "BC") {
      setFormData(prev => ({ ...prev, bed_code: "BC-" }));
      return;
    }
    
    // Remove "BC-" prefix to get just the number part
    const numberPart = inputValue.replace(/^BC-*/i, '');
    
    // Only allow numbers
    const numbersOnly = numberPart.replace(/\D/g, '');
    
    // Combine "BC-" with the number
    const formattedValue = numbersOnly ? `BC-${numbersOnly}` : "BC-";
    
    setFormData(prev => ({
      ...prev,
      bed_code: formattedValue
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Skip custom handling for bed_number and bed_code since we have special handlers
    if (name === "bed_number" || name === "bed_code") {
      return;
    }
    
    const updatedValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Ensure bed_number and bed_code are properly formatted before submitting
      const formattedFormData = {
        ...formData,
        bed_number: formData.bed_number === "Bed" ? "Bed" : formData.bed_number,
        bed_code: formData.bed_code === "BC-" ? "BC-" : formData.bed_code
      };

      if (bedMode === "insert") {
        await bedService.insertBeds(formattedFormData);
        loadBedData();
        setFormError([]);
        onBedClose();
        scsMsg(`${formattedFormData.bed_name} Added`);
      } else if (bedMode === "update") {
        await bedService.updateBeds(formattedFormData, selectedBed.bed_id);
        loadBedData();
        setFormError([]);
        onBedClose();
        scsMsg(`${formattedFormData.bed_name} Updated`);
      } else {
        await bedService.deleteBed(selectedBed.bed_id);
        loadBedData();
        setFormError([]);
        onBedClose();
        scsMsg(`${formData.bed_name} Deleted`);
      }
    } catch (error) {
      const bedError = error.response?.data;
      
      // Handle different error formats from backend
      if (bedError?.errors) {
        // Format: { errors: [{ path: "field", msg: "message" }] }
        setFormError(bedError.errors);
      } else if (bedError?.error) {
        // Format: { error: "Error message" } - map to bed_code for duplicate errors
        setFormError([{ path: "bed_code", msg: bedError.error }]);
      } else {
        // Fallback for other error formats
        setFormError([{ path: "general", msg: "Error submitting bed data" }]);
      }
      
      errMsg?.("Error submitting bed data");
    }
  };

  if (!isBedOpen) return null;

  const getErrorMsg = (fieldName) => {
    const err = formError.find(e => e.path === fieldName);
    return err ? err.msg : "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-2xl">
      <main className={`rounded-xl overflow-hidden bg-white w-[45%]`}>
        
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
         
            {/* Bed Number - Pre-filled with "Bed", user only types number */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="bed_number"
                placeholder="Type number only (1, 2, 3...)"
                value={formData.bed_number}
                onChange={handleBedNumberChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
              {getErrorMsg("bed_number") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("bed_number")}</span>
              )}
              <span className="text-xs text-gray-500 mt-1">Just type the number (1, 2, 3...)</span>
            </div>

            {/* Bed Code - Pre-filled with "BC-", user only types number */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                name="bed_code"
                placeholder="Type number only (001, 002, 003...)"
                value={formData.bed_code}
                onChange={handleBedCodeChange}
                className="px-4 py-2 border-2 border-[var(--sage-lighter)] rounded-lg focus:outline-none focus:border-[var(--ptl-greenb)]"
              />
              {getErrorMsg("bed_code") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("bed_code")}</span>
              )}
              <span className="text-xs text-gray-500 mt-1">Just type the number (001, 002, 003...)</span>
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
              {getErrorMsg("bed_name") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("bed_name")}</span>
              )}
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
              {getErrorMsg("location") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("location")}</span>
              )}
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
              {getErrorMsg("min_moisture") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("min_moisture")}</span>
              )}
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
              {getErrorMsg("max_moisture") && (
                <span className="text-[var(--color-danger-a)] bg-[var(--color-dangerb-b)] text-xs">{getErrorMsg("max_moisture")}</span>
              )}
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