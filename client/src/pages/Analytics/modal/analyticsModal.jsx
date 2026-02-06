function InfosModal({ isModalOpen, onClose }) {
  if (!isModalOpen) return null; 

  return (
    <section className="info_modal fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <main className="conb bg-[var(--main-white)] rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b py-4">
          <h2 className="text-xl font-semibold">Sensor Readings</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:bg-gray-100 px-1 rounded-xl shadow-sm font-bold text-lg">
            ×
          </button>
        </div>

        {/* Conditional Description */}
        <div className="text-gray-700">           
            form
        </div>
      </main>
      
      

    </section>
  );
}



export default InfosModal;
