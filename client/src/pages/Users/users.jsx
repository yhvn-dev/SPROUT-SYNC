import { useEffect, useState } from 'react'
import axios, { all } from "axios";
import * as userService from "../../data/userService"
import { Sidebar } from "../../components/Global/sidebar"
import { Db_Header } from "../../components/Global/db_header"
import { Workspace } from "./workspace"

import { Welcome_box } from '../../components/Global/welcome_box';
import { UserInsights } from './userInsights';

import "./users.css"


function Users() {
  const [user,setUser] = useState(false)
  const [chartData,setChartData] = useState({count: {total_users:0}, roleCount: []})
  const [statusData,setStatusData] = useState([])
  const [searchValue,setSearchValue] = useState("");
  const token = localStorage.getItem("accessToken")
  const [activeTab, setActiveTab] = useState('Overview');

  
  // Fetch Login User
  const fetchUser =  async () =>{
    try{
      const res = await axios.get("http://localhost:5000/users/me",
        {headers:{Authorization:`Bearer ${token}`}})
        setUser(res.data)
    }catch(err){
      console.error("Error Fetching Users")
    }
  } 

  // fetch chart data
  const fetchChartData = async () =>{
    try {
        const [userCount,userCountByRole] = await Promise.all([
          userService.getUsersCount(),
          userService.getUsersCountByRole(),
          userService.getUsersByStatus()
        ]);
        
        setChartData({
          count:userCount,
          roleCount:userCountByRole.map(rc => 
            ({ 
              role:rc.role,
              total_users:Number(rc.total_users)
            }))
        })
        
    } catch (err) {
      console.error("Error Fetching Chart")
    }
    }

    

    const fetchStatusData = async () =>{
      try{
        const userCountByStatus = await userService.getUsersByStatus()
        console.log("STATUS DATA",userCountByStatus)

        setStatusData(userCountByStatus.map(sc => ({
          status:sc.status,
          total_users: Number(sc.total_users || 0)
        })))

      }catch(err){
        console.error("Error Fetching Status Data")
      }
      
    }


  useEffect(() =>{
    fetchUser();
    fetchChartData();
    fetchStatusData()
  },[token])

  const handleSearchChange = async (e) =>{
      const value = e.target.value
      setSearchValue(value)
      console.log("Search Value:",value)
  }
  
  return (
    <section className="page users grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_8vh_84vh] 
        h-[100vh] w-[100%] gap-x-4 overflow-y-auto
        relative bg-gradient-to-br from-[#E8F3ED] to-[#C4DED0]">

      <Welcome_box
          text={
            <>
              <p className="font-bold ">Manage your Users</p>
              <p className="text-sm opacity-[0.5]">As an  { user?.role || "Guest"} you can modify your people.</p>
            </>
          }
        />

      <Db_Header  
  
        input={
        <>
          <div className="form_box center h-full">
            <input className="border-[1px] border-[var(--acc-darkc)] rounded-2xl px-4" onChange={handleSearchChange} type="text" value={searchValue} placeholder='' />
            <label htmlFor="">Search  For Users</label>
          </div>    
        </>}
          
        user={user}
        />
  
      <Sidebar
      />

      {/* Tab Navigation */}
      <div className='flex col-start-2 col-span-full row-start-2 row-end-2 gap-4 pt-4'>
          <button onClick={() => setActiveTab("Overview")} 
              className={`${activeTab === "Overview" ? "bg-white shadow-lg" : "bg-[--sage-lighter]"} 
            px-6 py-2 text-sm rounded-lg hover:bg-white text-[var(--sage)] transition-all duration-200`}>
              Overview
          </button>
        
          <button onClick={() => setActiveTab("User Insights")} 
            className={`${activeTab === "User Insights" ?  "bg-white shadow-lg" : "bg-[--sage-lighter]"}
            px-6 py-2 text-sm rounded-lg hover:bg-white text-[var(--sage)] transition-all duration-200`}>
            User Insights
          </button>   
      </div>


      <main className='w-full h-full col-start-2 col-span-full row-start-3 row-span-full pt-4 rounded-lg '>
        {activeTab === "Overview" ? 
        <Workspace refreshChart={fetchChartData} 
        refreshStatus={fetchStatusData}
        searchValue={searchValue} 
        userCount={chartData.count.total_users}
        statusData={statusData}/> 
    
        : <UserInsights chartData={chartData}/>} 
      </main>
      {/* Users Table with navigations and filters */}
    

    </section>


      

  )

 
}

export default Users