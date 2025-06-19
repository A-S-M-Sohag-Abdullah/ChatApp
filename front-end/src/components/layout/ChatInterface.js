import React, { use, useCallback, useEffect, useState } from "react";
import Coversations from "./Coversations";
import Stories from "./Stories";
import Peoples from "./Peoples";
import ConverSationBox from "./ConverSationBox";
import ChatProfile from "./ChatProfile";
import styles from "./ChatInterface.module.css";
import { useDom } from "../../context/DomContext";
import { useChat } from "../../context/ChatContext";
import messageApi from "../../api/messageApi";
import { useAuth } from "../../context/AuthContext";
import socket from "../../services/socketService";

function ChatInterface() {
  const { user } = useAuth();
  const { chats, setChats } = useChat();
  const { profileOpend, activeButton } = useDom();
  const { activeChat } = useChat();
  const [cachedMessages, setCachedMessages] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const messagesData = await messageApi.getMessages(activeChat._id);

      if (cachedMessages.hasOwnProperty(activeChat._id))
        console.log(cachedMessages[activeChat?._id].length);

      setCachedMessages((prev) => ({
        ...prev,
        [activeChat._id]: messagesData,
      }));
      setMessages(messagesData); // Assuming the response is an array of messages
      // scrollToBottm();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [activeChat?._id]);

  const updateChatsWithNewMessage = (newMessage) => {
    setChats((prevChats) => {
      const updatedChats = [...prevChats];
      const chatIndex = updatedChats.findIndex(
        (chat) => chat._id === newMessage.chat._id
      );

      if (chatIndex === -1) return prevChats; // chat not found, don't update

      // Update the latestMessage
      const updatedChat = {
        ...updatedChats[chatIndex],
        latestMessage: {
          _id: newMessage._id,
          sender: newMessage.sender,
          content: newMessage.content,
          createdAt: newMessage.createdAt,
        },
        updatedAt: newMessage.updatedAt, // also useful if you want to sort chats
      };

      // Remove from current position
      updatedChats.splice(chatIndex, 1);

      // Insert updated chat at top
      return [updatedChat, ...updatedChats];
    });
  };

  useEffect(() => {
    if (!activeChat) return;

    if (cachedMessages[activeChat._id]) {
      setMessages(cachedMessages[activeChat._id]); // Instantly show cached
      fetchMessages(activeChat._id); // Update in background
    } else {
      fetchMessages(activeChat._id);
    }
  }, [activeChat]);



  useEffect(() => {
    if (!socket) return;
    socket.emit("joinUser", user._id);

    const handleMessageReceived = ({ message, chatId }) => {
      console.log("ss");
      setChats((prevChats) => {
        // console.log(message);
        const updated = [...prevChats];
        const index = updated.findIndex((c) => c._id === chatId);

        if (index !== -1) {
          if (activeChat?._id !== chatId) {
            if (message._id !== updated[index]?.latestMessage._id)
              updated[index].unreadCount += 1;
          }
          updated[index].latestMessage = message;
        }

        const chat = updated.splice(index, 1);
        console.log(chat);
        return [chat[0],...updated];
      });
    };

    socket.on("recieveUserMessage", handleMessageReceived);

    return () => {
      socket.off("recieveUserMessage", handleMessageReceived);
    };
  }, [activeChat?._id, socket]);

  return (
    <div className={`${styles["chat-interface"]} d-flex position-relative`}>
      {activeButton === "inbox" && <Coversations />}
      {activeButton === "stories" && <Stories />}
      {activeButton === "people" && <Peoples />}

      {activeChat && (
        <ConverSationBox
          loading={loading}
          messages={messages}
          setMessages={setMessages}
        />
      )}
      {!activeChat && (
        <div className="d-sm-flex d-none align-items-center justify-content-center flex-grow-1">
          No Chat selected
        </div>
      )}

      {profileOpend && <ChatProfile />}
    </div>
  );
}

export default ChatInterface;
