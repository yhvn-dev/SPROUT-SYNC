import { useState,useContext} from 'react';
import { UserContext } from "../../hooks/userContext"
import { Sidebar } from '../../components/sidebar';
import { Db_Header } from '../../components/db_header';
import { Welcome_box } from '../../components/welcome_box';
import { Overview } from './overview';
import { Trends } from "./trends"
import { SensorAnalytics } from './sensorAnalytics';
import { SystemLogs } from './systemLogs';


// Main Dashboard
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {user} = useContext(UserContext)
  

  
  return (
    <div className="grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_92vh] 
        h-[100vh] w-[100%] gap-4 overflow-hidden relative  bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] ">

      <Sidebar user={user}/>
      <Db_Header/>
    
      <main className="h-full w-full  col-start-2 col-end-4 row-start-2 row-end-4 ">
     
        <Overview/>
      
      </main>
    </div>
  );
};

export default Analytics;