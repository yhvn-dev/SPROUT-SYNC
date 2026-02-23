import { createContext, useState, useEffect } from "react";
import * as userService from "../data/userService";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [skippedRegister, setSkippedRegister] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const loggedUser = await userService.fetchLoggedUser();
      setUser(loggedUser);
    } catch (err) {
      console.error("Error fetching logged user:", err);
    }
  }

  
  return (
    <UserContext.Provider
      value={{user,setUser,allUsers,setAllUsers,skippedRegister,setSkippedRegister}}>
      {children}
    </UserContext.Provider>
  );


}