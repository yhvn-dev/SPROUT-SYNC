import { AlertCircle } from 'lucide-react'
import * as plantBatchHistory from "../../data/plantBatchesHistory"

export function Batch_History_Modal({isModalOpen,onClose,selectedBatch,reloadBatchHistory}) {

  if(!isModalOpen) return null

  const handleSubmit = async (e) =>{
    e.preventDefault()
    try {
        await plantBatchHistory.deleteBatchHistory(selectedBatch.history_id)
        onClose()
        reloadBatchHistory()
    } catch (error) {
        console.error("Error Deleting Batch History")
    }
  }


  return (
    <>
     <section className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <form onSubmit={handleSubmit} className="flex items-center justify-between bg-white flex-col p-6 overflow-y-auto h-[200px] rounded-2xl">
            <div className="flex items-center gap-3 p-3 mt-4  rounded-lg  bg-red-50">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">
                    Are you sure you want to delete {selectedBatch.plant_name} Batch this action cannot be undone.
                </p>
            </div>
            <div className="flex gap-2 w-full justify-end">
                <button
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50 text-sm">
                    Cancel
                </button>
                <button 
                    className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors text-white bg-red-500 hover:bg-red-600 text-sm">
                    Delete
                </button>
            </div>
        </form>
    </section>
    </>
  )
}

