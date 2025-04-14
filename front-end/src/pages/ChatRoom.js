import React, { useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import MainSection from "../components/layout/MainSection";
import styles from "./ChatRoom.module.css";
import { setUserOnline } from "../services/socketService";
import { useAuth } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import { StoryProvider } from "../context/StoryContext";
import { ActiveStatusProvider } from "../context/ActiveStatusContext";

function ChatRoom() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setUserOnline(user._id);
    }
  }, [user]);

  return (
    <ChatProvider>
      <StoryProvider>
        <ActiveStatusProvider>
          <div
            className={`${styles["inbox-container"]} overflow-hidden d-flex`}
          >
            <Sidebar />
            <MainSection />
            {/* {<ChatComponent/>} */}

            {/* ChatRoom {JSON.stringify(user)} */}
          </div>
        </ActiveStatusProvider>
      </StoryProvider>
    </ChatProvider>
  );
}

export default ChatRoom;
