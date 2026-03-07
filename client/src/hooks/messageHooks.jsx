import { createContext, useState, useEffect } from "react";

export const MessageContext = createContext();

export function MessagesProvider({ children }) {
  const [messageContext, setMessageContext] = useState("");
  const [openDeleteNotifModal,setOpenDeleteNotifModal] = useState(false);
  const [selectedNotif,setSelectedNotif] = useState([]);
  const [deleteMode,setDeleteMode] = useState("");

  
  return (
    <MessageContext.Provider value={{
        messageContext,setMessageContext,
        openDeleteNotifModal,setOpenDeleteNotifModal,
        selectedNotif,setSelectedNotif,
        deleteMode,setDeleteMode
        }}>
      {children}
    </MessageContext.Provider>
  );
  
  
}



