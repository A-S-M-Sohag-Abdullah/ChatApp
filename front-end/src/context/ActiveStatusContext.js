import { createContext, useContext, useEffect, useState } from "react";
import storyApi from "../api/storyApi";
import { listenForUserStatus } from "../services/socketService";

const ActiveStatusContext = createContext();

export const ActiveStatusProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState({});

  useEffect(() => {
    listenForUserStatus(({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
    });
  }, []);

  
  return (
    <ActiveStatusContext.Provider
      value={{
        onlineUsers,
      }}
    >
      {children}
    </ActiveStatusContext.Provider>
  );
};

export const useActiveStatus = () => useContext(ActiveStatusContext);
