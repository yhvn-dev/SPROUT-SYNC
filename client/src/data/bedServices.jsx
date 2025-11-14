import api from "../utils/api";

export const fetchAllBeds = async () => {
    try{
        const res = await api.get("/beds/get/beds");
        return res.data.data
    }catch(err){
        console.err("Error Fetching Beds",err);
        throw err
    }
}


export const insertBeds = async (data) =>{
    try{
        const res = await api.post("/beds/post/beds",[data]);
        console.log("API",res)
        return res        
    }catch(err){
        throw err
    }
} 

export const updateBeds = async (bedData,bedID) =>{

    if(!selectedUser){console.error("No user selected for update"); }

    try{
        const res = await api.put("/beds/put/beds",[bedData,bedID]);
        console.log("UPDATED DATA",res)
        return res
    }catch(err){
        console.error("Error Updating Users",err)
        throw err
    }
}


export const deleteUsers = async (selectedUser,setAllUsers) => {

    if (!selectedUser) { console.error("No user selected for delete"); return;

    }
    try{

    } catch (err) {
        console.error("Error Deleting Beds")
    }z
};

