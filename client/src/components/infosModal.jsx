function InfosModal({ isInfosModalOpen, onClose, purpose }) {
  if (!isInfosModalOpen) return null; // better than false

  // Function to render the title dynamically
  const renderTitle = () => {
    switch (purpose?.toLowerCase()) {
      case "nursery":
        return "Real-Time Nursery Dashboard";
      case "batch":
        return "Plant Batches Overview";
      case "traygroups":
        return "Plant Monitoring System";
      default:
        return "System Information";
    }
  };

  // Function to render the content dynamically
  const renderContent = () => {
    switch (purpose?.toLowerCase()) {
      case "nursery":
        return (
         <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Monitor all tray groups and their trays at a glance.</li>
            <li>Monitor plant batches and growth cycles and dates.</li>
            <li>Keep Track of tray's sensor readings to identify which one need's attention.</li>
        </ul>
        );

      case "batch":
        return (
          <ul className="list-disc pl-5 space-y-2">
            <li>Track plant batches from planting to harvesting.</li>
            <li>View growth, seedlings, replants and plant deathrate.</li>
            <li>Analyze data from different.</li>
          </ul>
        );

      case "traygroups":
        return (
          <ul className="list-disc pl-5 space-y-2">
            <li>View and monitor trays within groups for a clear overview.</li>
            <li>Monitor multiple trays at once for sensor readings.</li>
            <li>Quickly identify which tray group needs attention.</li>
          </ul>
        );
      default:
        return <p>This section provides information about the selected system feature.</p>;
    }
  };


  
  return (
    <section className="info_modal fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <main className="conb bg-[var(--main-white)] rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b py-4">
          <h2 className="text-xl font-semibold">{renderTitle()}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:bg-gray-100 px-1 rounded-xl shadow-sm font-bold text-lg">
            ×
          </button>
        </div>

        {/* Conditional Description */}
        <div className="text-gray-700">{renderContent()}</div>
      </main>
      
    </section>
  );
}





export default InfosModal;
