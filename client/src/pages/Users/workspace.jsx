
import { UserTable } from "./userTable"
import { useEffect, useState } from "react"
import { Modal } from "./modal"
import { User} from "react-feather"
import { SucessMsgs} from "../../components/sucessMsgs"
import { Users} from 'lucide-react'

import { StatusChart,RoleChart} from "./charts"


import * as userService from "../../data/userService"


export function StatusChartLegend({statusCount,colors}){
  return(
    <>
      <div className="mt-4 space-y-1">
        {statusCount.map((sc, index) => (
          <div key={sc.role} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span>
              {sc.status}: {sc.total_users}
            </span>
          </div>
        ))}
      </div>

    </>

  )
}

export function Workspace({refreshChart,searchValue,userCount,statusData,refreshStatus,chartData}) {
  const [open,setOpen] = useState(false)
  const [mode,setMode] = useState("")
  const [sucessMsg,setSucessMsg] = useState("");
  const [backendError,setBackendError] = useState("");
  const [selectedUser,setSelectedUser] = useState(null)
  const [allUsers,setAllUsers] = useState([]) 
  const [filtered,setFiltered] = useState([])

  const clearMsg = () => setSucessMsg("");

  useEffect(() =>{
    renderUsers();
    console.log("CHART DATA",chartData)
  },[])
  
  const renderUsers = async () =>{

    try{
        const users = await userService.fetchAllUsers();
        setAllUsers(users)
        return users; 
    }catch(err){
      console.error("Error Rendering Users",err)
    }
  }




  // SEARCH USER
  useEffect(() =>{

    if (!searchValue || searchValue.trim() === ""){
      setFiltered([]);
      return;
    }

    const handler = setTimeout(() => {
      const lower = searchValue.toLowerCase();
      const filteredData = allUsers.filter((u) =>  
        (u.username?.toLowerCase() || "").includes(lower) ||
        (u.fullname?.toLowerCase() || "").includes(lower) ||
        (u.email?.toLowerCase() || "").includes(lower) ||
        (u.phone_number?.toLowerCase() || "").includes(lower) ||
        (u.role?.toLowerCase() || "").includes(lower) 
      )
      setFiltered(filteredData)
    },1000)

    return () => clearTimeout(handler)

  },[searchValue,allUsers])

  const handleInsert = async (data) =>  {
    try {
        const newUser = await userService.insertUsers(data);
        await renderUsers()
        await refreshChart()
        await refreshStatus()

        console.log("NEW USER:",newUser)
        setOpen(false)
        setSucessMsg(`${newUser.fullname} is added`)
      

    } catch (err) {
      console.error("Error Inserting Users",err)
      setBackendError(err.response?.data?.message || err.message || "Error Inserting Users");
      throw err
    }
  }
  

  const handleUpdate = async (data) =>{
    try {
      if(!selectedUser?.user_id) return;
      const updatedUser = await userService.updateUsers(selectedUser.user_id,data,setAllUsers)
      await renderUsers();
      await refreshChart()
      await refreshStatus()
      setOpen(false)

      setSucessMsg(`${selectedUser.fullname} is now updated`)
      console.log("UPDATED USER:",updatedUser)

    } catch (err) {
      console.error("Error Updating Users",err)
      setBackendError(err.response?.data?.message || err.message || "Error Updating Users");
      throw err
    }
  }


  const handleDelete = async () => {
    try {
      if (!selectedUser?.user_id) return;
      
      await userService.deleteUsers(selectedUser.user_id);
      const updatedUsers = await userService.fetchAllUsers(); // <-- refetch latest users

      setAllUsers(updatedUsers); // <-- set explicitly
      setFiltered([]); // <-- clear any filter/search

      await refreshChart();
      await refreshStatus();

      setOpen(false);
      setSucessMsg(`${selectedUser.fullname} was deleted successfully`);
      console.log("Deleted:", selectedUser);
    } catch (err) {
      console.error("Error Deleting Users", err);
      throw err;
    }
  };


  
  const handleFilter = async (e) =>{
    try {
        const target = e.target.value
      
        if (target === "all") {
            console.log("Target",target)
            setFiltered([]);
            await renderUsers();
            return;
        }
        const filteredData = await userService.filterUsers({filterBy:target})
        setFiltered(filteredData)

        console.log("Target:",target)
        console.log("Filtered Data:",filteredData)
    } catch (err) {
      console.error("Error Filtering Users",err)
      throw err
    }
  }
  
    const COLORS = ['#7BA591',"#6b7070"];
    // ================================================================================
    return (
        <main className="flex flex-col h-full w-full gap-4">  
        
        {/* USER CHART ======== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====  */}
          <div className="grid row-span-full grid-rows-1 flex-col md:grid-cols-[1fr_1fr] h-[50%] md:h-[30%]  w-full gap-4 ">                  
            <div className="conb center rounded-2xl shadow-lg 
            w-full h-full p-4 pointer-events-none relative bg-white con_b  ">     
              <p className="absolute top-4 left-4 text-[var(--acc-darkc)] text-sm">User status</p>
              {<StatusChart statusData={statusData} COLORS={COLORS}/>}   
           </div>

        

             {/* CARD C USER COUNT */}
            <div className="conb  bg-white rounded-2xl shadow-lg w-full h-full p-6 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                  <h2 className="text-4xl font-bold text-gray-900">{userCount}</h2>
                </div>
              
                  <Users className="w-6 h-6 text-[var(--acc-darkb)]" />
                
              </div>

            </div>


        </div>
            
            
          {/* USER TABLE ======== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====  */}
          <div className="conb bg-white workspace flex flex-col w-full flex-1 row-start-4 row-span-full
          col-start-2 col-end-4 overflow-y-auto  rounded-[10px] my-4">    
            <div className="wp_header flex w-full h-[20%] md:h-[20%] ">
                <ol className='h_part left flex items-center justify-start w-1/2 '>
                    <User className="mx-4" size={24}/>
                    <span className='text-2xl'>Users</span>
                </ol>
                <ol className='h_part right flex flex-row-reverse items-center w-1/2'>
                    <button className="btn-p mx-4 text-[0.9rem] " 
                  onClick={() => 
                    {setMode("insert");
                    setSelectedUser(null);
                    setOpen(true)}}>ADD USER</button>
                    <select onChange={(e) => {handleFilter(e)}} className=" px-[1px] py-[2px] border-1 border-[var(--acc-darkc)] rounded-[10px] p-h-0-6 text-sm shadow-xl">
                        <option value="all" className="options">Filter</option>
                        <option value="username" className="options">Username</option>
                        <option value="fullname" className="options">Fullname</option>
                        <option value="email" className="options">Email</option>
                        <option value="role" className="options">Role</option>
                        <option value="status" className="options">Status</option>  
                        <option value="created_at" className="options">Date</option>  
                    </select>
                </ol>
          </div>

          

            <SucessMsgs txt={sucessMsg} clearMsg={clearMsg}/>
            
            <div className="user_table_div bg-white table_holder flex flex-col items-center justify-start flex-1 w-full  overflow-y-auto shadow-[5px_5px_20px_1px_rgba(53,53,53,0.2)] rounded-[10px]">
                <UserTable
                  users={filtered.length > 0 ? filtered : allUsers}
                  setOpen={() => setOpen(true)}
                  setMode={setMode}
                  setSelectedUser={setSelectedUser}
                />
            </div>

            {open && ( <Modal 
                isOpen={open}
                onClose={() => setOpen(false)}
                mode={mode}
                handleSubmit={mode === "insert" ? handleInsert :
                              mode === "update" ? handleUpdate :
                                                  handleDelete}
                userData={selectedUser}
                backendError={backendError}
                setBackendError={setBackendError}
            />)}       
          </div>





    </main>

    )

  }