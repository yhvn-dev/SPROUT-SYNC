import { Return } from "three/tsl";
import api from "../utils/api";


export const fetchAllUsers = async () => {
    try{
        const res = await api.get("/users");
        return res.data
    }catch(err){
        console.err("Error Fetching Users",err);
        throw err
    }
}

export const getUsersCount = async () =>{
    try{
        const res = await api.get("/users/count")
        return res.data
    }catch(err){
        console.err("Error Fetching Users",err);
        throw err
    }
}

export const getUsersCountByRole = async () =>{
    try{
        const res = await api.get("/users/roles")
        return res.data
    }catch(err){
        console.err("Error Fetching Users By Count",err);
        throw err
    }
}

export const getUsersByStatus = async () => {
    try {
        const res = await api.get("/users/status")
        console.log(res.data)
        return res.data
    } catch (error) {
        console.err("Error Fetching Users By Status",err);
        throw err
    }
}


export const filterUsers = async ({value = "",filterBy}) => {
    try {
        const res = await api.get(`/users/filter?${value ? `value=${value}&` : ""}filterBy=${filterBy}`);
        return res.data
    } catch (err) {
        console.err("Error Fetching Users",err)
        throw err
    }
}

export const searchUsers = async (term) =>{
    try {
        const res = await api.get(`/users/search?${term ? `q=${term}` : ""}`)
        return res.data
    } catch (err) {
        console.err("Error Fetching Users",err)
        throw err
    }
}


export const insertUsers = async (data) =>{
    try{
        const isFormData = data instanceof FormData;
        const res = await api.post("/users/",data,{
            headers: isFormData ? {"Content-Type":"multipart/form-data"} :{},})

        console.log("User Added Succesfully! | ",res)    
        return res.data        
    }catch(err){
        console.error("Error Inserting Users",err);
        const backendErrors = err.response?.data?.errors;
            if (backendErrors) {
                const formatted = {};
                backendErrors.forEach(e => { formatted[e.param] = e.msg });
                throw formatted; 
            }
        throw err
    }
} 

export const updateUsers = async (selectedUser,data,setAllUsers) =>{

    if(!selectedUser){console.error("No user selected for update"); }

    try{
         
        const isFormData = data instanceof FormData;
        const res = await api.put(`/users/${selectedUser}`,data,{
            headers: isFormData ? {"Content-Type":"multipart/form-data"} :{},
        })
        console.log("User Updated Sucessfully! | ",res)
        setAllUsers((prev) =>
            prev.map(u => u.user_id === selectedUser ? res.data : u)
        )
        return res.data
    }catch(err){
         console.error("Error Updating Users",err)
         throw err
    }
}


export const deleteUsers = async (selectedUser,setAllUsers) => {

    if (!selectedUser) { console.error("No user selected for delete"); return;
    }

    try{

    console.log("Deleting user:", selectedUser); 
    const res = await api.delete(`/users/${selectedUser}`);
    console.log("User Deleted Successfully");

    setAllUsers((prev) =>
        prev.filter((u) => u.user_id !== selectedUser.user_id));

    return res.data

    } catch (err) {
        console.error("Error Deleting Users:",
        err.response?.data || err.message
    );
    }
};

