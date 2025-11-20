import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/sidebar';
import { Db_Header } from '../../components/db_header';
import { Welcome_box } from '../../components/welcome_box';
import { Overview } from './overview';
import { Trends } from "./trends"
import { SensorAnalytics } from './sensorAnalytics';
import { SystemLogs } from './systemLogs';
import * as userService from "../../data/userService"


// Main Dashboard
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_88vh] 
        h-[100vh] w-[100%] gap-4 overflow-hidden relative  bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] ">

      <Sidebar/>
      <Db_Header/>
    
      <main className="h-full w-full  col-start-2 col-end-4 row-start-2 row-end-4 ">
     
        {/* Navigation Tabs */}
        <div   className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview' 
                ? 'bg-white text-[#027c68] shadow-md' 
                : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'trends' 
                ? 'bg-white text-[#027c68] shadow-md' 
                : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
            }`}
          >
            Trends
          </button>


            <button
            onClick={() => setActiveTab('sensor_analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'sensor_analytics' 
                ? 'bg-white text-[#027c68] shadow-md' 
                : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
            }`}
          >
            Sensor Analytics
          </button>


          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'counts' 
                ? 'bg-white text-[#027c68] shadow-md' 
                : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
            }`}
          >
            Counts
          </button>


        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
           <Overview/>
        )}
        {activeTab === 'trends' && (
           <Trends/>
        )}


        {activeTab === "sensor_analytics" && (
          <SensorAnalytics/>
        )}

        {/* Logs Tab
        {activeTab === 'logs' && (
           <SystemLogs/>      
        )} */}
      </main>
    </div>
  );
};

export default Analytics;