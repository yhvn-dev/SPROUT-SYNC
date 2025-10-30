import { useEffect, useState } from 'react'
import axios from "axios";


import * as userService from "../../data/userService"
import { Sidebar } from "../../components/Global/sidebar"
import { Db_Header } from "../../components/Global/db_header"
import { Workspace } from "./workspace"
import { Quick_Stats } from "./quick_stats"
import { Welcome_box } from '../../components/Global/welcome_box';
import * as Chart from "./charts"


import "./users.css"
import "./users_responsive.css"

function Users() {
  const [user,setUser] = useState(false)
  const [chartData,setChartData] = useState({count: { total_users: 0}, roleCount: []})
  const [searchValue,setSearchValue] = useState("");
  const [percentage,setPercentage] = useState(35);
  const token = localStorage.getItem("accessToken")

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
          userService.getUsersCountByRole()
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

  useEffect(() =>{
    fetchUser();
    fetchChartData();
  },[token])

  const handleSearchChange = async (e) =>{
      const value = e.target.value
      setSearchValue(value)
      console.log("Search Value:",value)
  }



  





  return (
    <section className="page users grid grid-cols-[12fr_30fr_58fr] grid-rows-[8vh_40vh_52vh] 
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
          <div class="form_box center h-full">
            <input className="border-[1px] border-[var(--acc-darkc)] rounded-2xl px-4" onChange={handleSearchChange} type="text" value={searchValue} placeholder='' />
            <label for="">Search  For Users</label>
          </div>    
        </>}
          
        user={user}
        />
  
      <Sidebar
        />

      {/* Data like graphs and charts */}
      <Quick_Stats           
  
        data_boxes={
          <>
            <div className='rounded-2xl logs_card col-start-1 col-end-1
            bg-white backdrop-blur-[100px]  shadow-lg'>Logs Card</div>
            <div className='rounded-2xl chart_card col-start-2 col-end-2
            bg-white backdrop-blur-[80px]  shadow-lg'><Chart.RoleChart chartData={chartData}/></div>
          </>
        }
        
      />

      {/* Users Table with navigations and filters */}
      <Workspace chartData={chartData} refreshChart={fetchChartData} searchValue={searchValue}/>


          
    </section>
  )
}

export default Users