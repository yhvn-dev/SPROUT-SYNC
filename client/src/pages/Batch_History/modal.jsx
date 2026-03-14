import { AlertCircle } from 'lucide-react'
import * as plantBatchHistory from "../../data/plantBatchesHistory"
import { motion } from 'framer-motion' 

export function Batch_History_Modal({isModalOpen,onClose,selectedBatch,reloadBatchHistory,setSuccessMsg}) {
  if(!isModalOpen) return null  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await plantBatchHistory.deleteBatchHistory(selectedBatch.history_id);
      setSuccessMsg(`${selectedBatch.plant_name} Record Deleted Successfully`);
      reloadBatchHistory();
      onClose();
    } catch (error) {
      console.error("Error Deleting Batch History", error);
    }
  };

  return (
    <motion.div 
      key="modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}  // ✅ Proper backdrop
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.form 
        onSubmit={handleSubmit}
        className="conb bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()} >

        <div className="flex items-start justify-start w-full mb-6">
          <p className='text-2xl font-semibold text-gray-900'>Delete Batch History</p>     
        </div>
       
        <div className="bh_message_box flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 leading-relaxed">
            Are you sure you want to delete <span className="bh_plant_name_modal font-semibold">{selectedBatch.plant_name}</span> batch? 
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex gap-3 pt-6 w-full justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium transition-all border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 text-sm shadow-sm"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-2.5 rounded-xl font-medium transition-all text-white bg-red-500 hover:bg-red-600 active:scale-[0.98] text-sm shadow-lg"
          >
            Delete
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

