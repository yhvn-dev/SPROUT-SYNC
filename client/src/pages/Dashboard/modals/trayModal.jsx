import { useState,useEffect } from 'react';
import { motion } from "framer-motion";
import { X, Sprout, TrendingUp, Package } from 'lucide-react';


import * as trayModels from "../../../data/traysServices"

export function TrayModal({ isOpen, onClose, trayModalMode, selectedTrayGroup,selectedTray,setSuccessMsg }) {
    const [formData, setFormData] = useState({
        plant:"",
        status:"",
    });

    // Initialize modal values when opened
    useEffect(() => {
        if (trayModalMode === "update" && selectedTray) {
        setFormData({
            plant: selectedTray.plant || "",
            status:selectedTray.status || ""         
        });
        
        console.log("SELECTED TRAY",selectedTray)
        } else if (trayModalMode === "insert") {
        setFormData({
            plant:"",
            status:"",
        });
        console.log("SELECTED TRAY GROUP ",selectedTrayGroup)

    
        }else{
        setFormData({
            plant: selectedTray.plant,
            status:selectedTray.status || ""           
        });
        console.log("SELECTED TRAY",selectedTray)
    }

    }, [trayModalMode,isOpen,selectedTray]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (trayModalMode === "insert") {
            const payload = {
                ...formData,
                tray_group_id: selectedTrayGroup.tray_group_id, // ✅ REQUIRED LINK
            };

            await trayModels.insertTray(payload);
            setSuccessMsg(`${formData.plant}'s Tray is Added`);
            } 
            
            else if (trayModalMode === "update") {
            await trayModels.updateTray(formData, selectedTray.tray_id);
            setSuccessMsg(`${selectedTray.plant}'s Tray is Updated`);
            } 
            
            else if (trayModalMode === "delete") {
            await trayModels.deleteTray(selectedTray.tray_id);
            setSuccessMsg(`${selectedTray.plant}'s Tray is Deleted`);
            }

            onClose();

        } catch (error) {
            console.error("Error Submitting Tray:", error);
        }
        };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



  if (!isOpen) return null;




  return (
    <motion.div className="fixed inset-0 bg-transparent backdrop-blur-2xl flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }}>
            
        {/* ✅ HEADER */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--ptl-greenh)] p-2.5 rounded-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[var(--metal-dark5)] text-xl font-bold ">
                {trayModalMode === "insert" ? "Add New Tray" : "Update Tray"}
              </h2>
              <p className="text-[var(--acc-darkc)]  text-sm">
                Insert a tray inside the {selectedTrayGroup?.tray_group_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer text-[var(--metal-dark5)] hover:text-[var(--metal-dark5)]  hover:bg-gray-100 p-2 rounded-lg transition">
            <X size={24} />
          </button>
        </div>


        {/* ✅ CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-[var(--sage-lighter)]">

          {/* ✅ SELECTED TRAY GROUP INFO */}
          <div className="mb-6 bg-white border border-[var(--sage-medium)] rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[var(--sage-dark)] p-2 rounded-lg">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[var(--sancgb)] font-medium">Selected Tray Group</p>
                  <p className="text-lg font-bold text-[var(--sancga)]">
                    {selectedTrayGroup?.tray_group_name}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-[var(--sancgb)]">Created at</p>
                <p className="text-xs text-[var(--sancga)]">
                  {selectedTrayGroup?.created_at}
                </p>
              </div>
            </div>
          </div>

          {/* ✅ FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* ✅ PLANT NAME */}
              <div className="md:col-span-2 bg-white border border-[var(--sage-medium)] rounded-xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--sancga)] mb-2">
                  <Sprout className="w-4 h-4 text-[var(--ptl-greenf)]" />
                  Plant Name *
                </label>
                <input
                  type="text"
                  name="plant"
                  value={formData.plant}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Bok Choy"
                  className="w-full px-3 py-2 border border-[var(--sage-medium)] rounded-lg focus:ring-2 focus:ring-[var(--ptl-greend)] outline-none"
                />
              </div>

              {/* ✅ TRAY STATUS */}
              <div className="bg-white border border-[var(--sage-medium)] rounded-xl p-4 shadow-sm">
                <label className="flex items-center gap-2 text-sm font-semibold text-[var(--sancga)] mb-2">
                  <TrendingUp className="w-4 h-4 text-[var(--ptl-greenf)]" />
                  Tray Status *
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-[var(--sage-medium)] rounded-lg focus:ring-2 focus:ring-[var(--ptl-greend)] outline-none bg-white"
                >
                  <option value="">Select Tray Status</option>
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

            </div>
          </form>
        </div>

        {/* ✅ FOOTER */}
        <div className="border-t border-[var(--sage-medium)] px-6 py-4 bg-white flex items-center justify-between">
          <p className="text-sm text-[var(--sancga)]">* Required fields</p>

          <div className="flex gap-3">
            <button
              type="submit"
              onClick={onClose}
              className="px-5 py-2.5 border border-[var(--sage-medium)] text-[var(--sancga)] rounded-lg hover:bg-[var(--sage-lighter)] font-medium transition">
              Cancel
            </button>

            {/* ✅ FIXED INSERT MODE (NO SPACE BUG) */}
            <button
              type="submit"
              onClick={handleSubmit}
              className={`px-5 py-2.5 text-white rounded-lg font-medium shadow-lg transition-all
                ${trayModalMode === "insert"
                  ? "bg-[var(--ptl-greend)] hover:bg-[var(--ptl-greenf)]"
                  : "bg-[var(--sancgb)] hover:bg-[var(--sancgd)]"
                }`}>
              {trayModalMode === "insert" ? "Create Tray" : "Update Tray"}
            </button>
          </div>
        </div>

      </motion.div>
    </motion.div>
  );
}
