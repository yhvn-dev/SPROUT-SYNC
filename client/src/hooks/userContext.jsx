import { createContext, useState, useEffect, useContext } from "react";
import * as userService from "../data/userService";

export const UserContext = createContext(null); // ← dagdag ng null

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
      value={{ user, setUser, allUsers, setAllUsers, skippedRegister, setSkippedRegister }}>
      {children}
    </UserContext.Provider>
  );
}


// ← Custom hook para safe ang access
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};