import { createContext, useState, useEffect } from "react";
import * as userService from "../data/userService";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allUsers,setAllUsers] = useState([]);
  

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
        const loggedUser = await userService.fetchLoggedUser();
        setUser(loggedUser);
        } catch (err) {
        console.error(err);
        }
    }

 

    
  return (
    <UserContext.Provider value={{ user, setUser,allUsers,setAllUsers}}>
      {children}
    </UserContext.Provider>
  );
  
}