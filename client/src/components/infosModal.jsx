import { motion } from "framer-motion";

function InfosModal({ isInfosModalOpen, onClose, purpose }) {
  if (!isInfosModalOpen) return null; 

  // Function to render the title dynamically
  const renderTitle = () => {
    switch (purpose?.toLowerCase()) {
      case "nursery":
        return "Real-Time Nursery Dashboard";
      case "batch":
        return "Plant Batches Overview";
      case "traygroups":
        return "Plant Monitoring System";
      case "soilmoistureanalytics":
        return "Soil Moisture Trend Graph";
      case "water_level":
        return "Water Level Gauge"
        case "valves_control":
        return "Valve Control"
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


      case "users":
        return (
         <ul className="list-disc pl-5 space-y-2">
            <li>Add new user accounts and capture relevant user information</li>
            <li>Update existing user profiles, including personal details and access permissions</li>
            <li>Delete or remove user accounts when necessary</li>
            <li>Assign and manage user roles and permissions</li>
            <li>View overall user statistics, such as total users and role distribution</li>
            <li>Ensure secure access and maintain data integrity for all user accounts</li>
          </ul>
        );

        case "analytics":
          return (
          <ul className="list-disc pl-5 space-y-2">
              <li>Monitor the current batch ofseedlings, including grown, dead, and replanted seedlings</li>
              <li>Track average soil moisture levels across all seedling trays</li>
              <li>Check water levels in the system in real-time</li>
              <li>Analyze seedling growth over time with historical data</li>
              <li>Review seedling status distribution for better management</li>
              <li>Access existing totals for seedlings, grown, dead, and replanted data of seedlings currently in a nursery.</li>
          </ul>
        
        );
        case "soilmoistureanalytics":
          return (
          <ul className="list-disc pl-5 space-y-2">
            <li>The X-axis represents time for the past 24 hours, with data points recorded every 10 minutes.</li>
            <li>The Y-axis shows the soil moisture levels for the selected seedling trays.</li>
            <li>Each point on the line represents the average soil moisture at that 10-minute interval.</li>
            <li>The line connects the points to show trends in soil moisture over the day.</li>
            <li>The color of the line indicates normal readings (green) — you could add thresholds for dry or wet alerts.</li>
            <li>Hover over any point to see the exact moisture value and the corresponding time.</li>
            <li>This graph helps identify patterns, such as consistent drying, overwatering, or sudden drops in moisture.</li>
          </ul>      
        );
        
         case "water_level":
          return (
          <ul className="list-disc pl-5 space-y-2">
            <li>The water level gauge shows the current amount of water available in the system as a percentage.</li>
            <li>A full gauge (100%) means there is enough water to irrigate all seedlings effectively.</li>
            <li>A low gauge indicates the water supply is running low and may need refilling or checking.</li>
            <li>The gauge updates in real-time to help you monitor water availability continuously.</li>
            <li>Maintaining proper water levels ensures seedlings receive consistent hydration and helps prevent overwatering or drought stress.</li>
          </ul>
        );

        
        case "seedling_growth_overtime":
          return (
           <ul className="list-disc pl-5 space-y-2">
              <li>This chart shows how seedlings change over time, grouped by week.</li>
              <li>The X-axis represents the week or time period of monitoring.</li>
              <li>The Y-axis represents the number of seedlings recorded.</li>
              <li>Each bar is stacked to show how many seedlings were grown, dead, or replanted during that week.</li>
              <li>The green section represents successfully grown seedlings.</li>
              <li>The red section shows seedlings that did not survive.</li>
              <li>The yellow section indicates seedlings that were replanted.</li>
              <li>This graph helps track trends, identify problem weeks, and evaluate overall seedling performance over time.</li>
            </ul>
        );

        
         case "status_distribution":
          return (
          <ul className="list-disc pl-5 space-y-2">
              <li>This chart shows the overall distribution of seedling statuses.</li>
              <li>Each slice represents a percentage of the total seedlings.</li>
              <li>Green indicates the portion of seedlings that successfully grew.</li>
              <li>Red shows the percentage of seedlings that died.</li>
              <li>Yellow represents seedlings that were replanted.</li>
              <li>The number at the center shows the total number of seedlings monitored.</li>
              <li>This graph provides a quick overview of overall seedling health and success rate.</li>
              <li>It helps assess whether the current growing process is effective or needs improvement.</li>
          </ul>
        );

          case "batch_history":
          return (    
          <ul className="list-disc pl-5 space-y-2">
            <li>The Batch History section records and displays all previous planting batches.</li>
            <li>Each row represents a single batch with its plant name, planting date, and growth stage.</li>
            <li>The table shows the total number of seedlings, including how many grew successfully, were replanted, or died.</li>
            <li>Color-coded tags help easily identify the growth stage of each batch.</li>
            <li>Summary cards at the top provide an overview of total records, grown seedlings, losses, and survival rate.</li>
            <li>You can search batches by plant name or growth stage using the search bar.</li>
            <li>The filter option allows you to view batches based on their current growth stage.</li>
            <li>This section helps monitor plant performance, track losses, and evaluate overall growing efficiency.</li>
        </ul>
        );

        case "plants":
          return (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                  Stores and displays different plants grouped by similar moisture requirements, making it easy to identify which plants can be transferred or managed together
                </li>     
            </ul>
          );

          case "plants":
          return (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                  Stores and displays different plants grouped by similar moisture requirements, making it easy to identify which plants can be transferred or managed together
                </li>     
            </ul>
          );

          case "valve_controls":
          return (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                 Lets you manually turn off unused valves—so if there are no plants like bokchoy growing, the valve stays off and doesn’t waste water.
                </li>     
            </ul>
          );

        case "control_panel":
          return (
            <ul className="list-disc pl-5 space-y-2">
                <li>
                   Monitor your nursery in real-time by starting the IMOU CCTV stream, controlling valves, and checking the current water level all in one place.
                </li>     
            </ul>
          );



          

 
      default:
        return <p>This section provides information about the selected system feature.</p>;
    }
  };


  
  const handleOpenInfosModalControlPanel = () => {
    setInfoModalPurpose("control_panel");
    setInfoModalOpen(true);
  };


  const handleOpenInfosModalValveControls = () => {
    setInfoModalPurpose("valve_controls");
    setInfoModalOpen(true);
  };

  
  return (
    <section className="info_modal fixed inset-0 bg-transparent backdrop-blur-2xl flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.4 }} 
        className="conb bg-[var(--main-white)] rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b py-4">
          <h2 className="z-50 text-xl font-semibold">{renderTitle()}</h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-500 hover:bg-gray-100 px-1 rounded-xl shadow-sm font-bold text-lg">
            ×
          </button>
        </div>

        {/* Conditional Description */}
        <div className="z-50 text-gray-700">{renderContent()}</div>
      </motion.div>
      
    </section>
  );
}



export default InfosModal;
