import { createContext, useContext, useEffect, useState } from "react";
import chatApi from "../api/chatApi";

const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeChat, setActiveChat] = useState(null);

  const fetchChats = async () => {
    try {
      const response = await chatApi.getChats(); // Adjust with your actual API endpoint

      setChats(response); // Assuming the backend returns an array of chats
      if (activeChat)
        setActiveChat(response.find((chat) => chat._id === activeChat._id));
    } catch (err) {
      setError("Error fetching chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chats,
        loading,
        error,
        activeChat,
        setActiveChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
