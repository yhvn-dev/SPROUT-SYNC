import { useState, useEffect } from 'react';
import { Sidebar } from '../../components/sidebar';
import { Db_Header } from '../../components/db_header';
import { Welcome_box } from '../../components/welcome_box';
import { Overview } from './overview';
import { Trends } from "./trends"
import { SensorAnalytics } from './sensorAnalytics';
import { SystemLogs } from './systemLogs';

import axios from "axios"

// Main Dashboard
const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [user,setUser] = useState(null);
  const token = localStorage.getItem("accessToken")

    useEffect(() =>{

    const fetchUser = async () =>{

      try{
        const res = await axios.get("http://localhost:5000/users/me",{
          headers:{Authorization : `Bearer ${token}`}
        })  
        console.log(res.data)
        setUser(res.data)
      }catch(err){
        console.error(err);
      }
    }

    fetchUser() 

  },[token])




  return (
    <div className="grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_92vh] 
        h-[100vh] w-[100%] gap-4 overflow-y-auto relative  min-h-screen bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0] ">

      <Sidebar/>
      <Welcome_box text={
        <>
          <p className="font-bold ">Welcome to GREENLINK</p>
          <p className="text-sm opacity-[0.5]">Hi{" "}{user?.username || "Guest"} Start Monitoring your plant.</p>
        </>
      }/>
      <Db_Header   
          user={user}
      />
    
  
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
              activeTab === 'logs' 
                ? 'bg-white text-[#027c68] shadow-md' 
                : 'bg-white/50 text-[#5A8F73] hover:bg-white/70'
            }`}
          >
            System Logs
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

  
        {/* Logs Tab */}
        {activeTab === 'logs' && (
           <SystemLogs/>      
        )}
      </main>
    </div>
  );
};

export default Analytics;