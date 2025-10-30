
import { UserTable } from "./userTable"
import { useEffect, useState } from "react"
import { Modal } from "./modal"

import {User} from "react-feather"
import * as userService from "../../data/userService"
import {SucessMsgs} from "../../components/Global/sucessMsgs"

export function Workspace({refreshChart,searchValue}) {
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
  },[])
  
  const renderUsers = async () =>{

    try{
        const users = await userService.fetchAllUsers();
        setAllUsers(users)
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

        console.log("NEW USER:",newUser)
        setOpen(false)

        setSucessMsg(`${newUser.fullname} is added`)
        console.log(`${newUser.fullname} is added`)

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
      setOpen(false)

      setSucessMsg(`${selectedUser.fullname} is now updated`)
      console.log("UPDATED USER:",updatedUser)

    } catch (err) {
      console.error("Error Updating Users",err)
      setBackendError(err.response?.data?.message || err.message || "Error Updating Users");
      throw err
    }
  }


  const handleDelete = async () =>{
    try{
      if(!selectedUser?.user_id) return;
      await userService.deleteUsers(selectedUser.user_id,setAllUsers)
      await renderUsers();
      await refreshChart()
      setOpen(false)
      setSucessMsg(`${selectedUser.fullname} is deleted successfully`)
      console.log("UPDATED USER:",selectedUser) 
    }catch(err){
      console.error("Error Deleting Users",err)
      throw err
    }
  }

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
  
   
    // ================================================================================
    return (
      <div className="bg-white workspace flex flex-col h-[100%] w-full row-start-3 row-end-3
      col-start-2 col-end-4 overflow-y-auto gap-x- rounded-[10px]">

        <div className="wp_header flex w-full h-[20%] ">
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
                    <option value="all" class="options">Filter</option>
                    <option value="username" class="options">Username</option>
                    <option value="fullname" class="options">Fullname</option>
                    <option value="email" class="options">Email</option>
                    <option value="role" class="options">Role</option>
                    <option value="status" class="options">Status</option>  
                    <option value="created_at" class="options">Date</option>  
                </select>
            </ol>
      </div>

      

        <SucessMsgs txt={sucessMsg} clearMsg={clearMsg}/>
        
        <div className="bg-white table_holder flex flex-col items-center justify-start h-full w-full  overflow-y-auto shadow-[5px_5px_20px_1px_rgba(53,53,53,0.2)] rounded-[10px]">
            <UserTable
              users={filtered.length > 0 ? filtered : allUsers}
              setOpen={setOpen}
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

    )

  }