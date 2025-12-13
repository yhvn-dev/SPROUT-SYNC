import { useState,useContext} from 'react';
import { UserContext } from "../../hooks/userContext"
import { Sidebar } from '../../components/sidebar';
import { Db_Header } from '../../components/db_header';
import { Welcome_box } from '../../components/welcome_box';
import { Overview } from './overview';
import { Trends } from "./trends"
import { SensorAnalytics } from './sensorAnalytics';
import { SystemLogs } from './systemLogs';
import { Notif_Modal } from '../../components/notifModal';

// Main Dashboard
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isNotifOpen,setNotifOpen] = useState(false)
  const {user} = useContext(UserContext)
  
  return (
    <div className="relative grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_92vh] 
        h-[100vh] w-[100%] gap-4 overflow-hidden bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] ">

      <Sidebar user={user}/>
      <Db_Header input={
        <>
        </>
      }
      setNotifOpen={setNotifOpen}
      />
    
      <main className="h-full w-full  col-start-2 col-end-4 row-start-2 row-end-4 ">
     
        <Overview/>
      
      </main>

      {/* NOTIFICATION MODAL */}
      {isNotifOpen && (
        <Notif_Modal
          isOpen={isNotifOpen}
          onClose={() => setNotifOpen(false)}
        />
      )}

    </div>
  );
};

export default Analytics;