
import * as readingsServices from "../../../data/readingsServices"

function AnalyticsModal({ isModalOpen, onClose,reloadReadings}) {
  if (!isModalOpen) return null; 

  const handleSubmit = async () =>{
    try {
        await readingsServices.deleteAllReadings()      
        reloadReadings()
        onClose()
    } catch (error) {
      console.error(error)
    }
  }
  

  return (
    <section className="info_modal fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <main className="conb bg-[var(--main-white)] rounded-2xl shadow-2xl max-w-lg w-full p-8  relative">
  
        <div className="flex justify-between items-center mb-4 border-b py-4">
          <h2 className="text-xl font-semibold">Clear Sensor Readings</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:bg-gray-100 px-1 rounded-xl shadow-sm font-bold text-lg">
              ×
          </button>
        </div>

        <div className="flex flex-col items-center gap-3 text-gray-700 dark:text-gray-300">
            <p>
              Deleting all sensor readings will free up space and improve performance. 
              Only clear data when no longer needed.
            </p>

            <div className="flex gap-4 justify-end w-full mt-4 ">
                <button
                  onClick={onClose}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border-2 border-[#C4DED0] text-[#5A8F73] hover:bg-gray-50 text-sm">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors text-white bg-[var(--color-danger-a)] hover:bg-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
              
  
        </div>
        
      </main>
      
      

    </section>
  );
}

export default AnalyticsModal;
