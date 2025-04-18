import React, { useState } from "react";
import Coversations from "./Coversations";
import Stories from "./Stories";
import Peoples from "./Peoples";
import ConverSationBox from "./ConverSationBox";
import ChatProfile from "./ChatProfile";
import styles from "./ChatInterface.module.css";
import { useDom } from "../../context/DomContext";
import { useChat } from "../../context/ChatContext";

function ChatInterface() {
  const { profileOpend, activeButton } = useDom();
  const { activeChat } = useChat();

  return (
    <div className={`${styles["chat-interface"]} d-flex`}>
      {activeButton === "inbox" && <Coversations />}
      {activeButton === "stories" && <Stories />}
      {activeButton === "people" && <Peoples />}

      {activeChat && <ConverSationBox />}
      {!activeChat && (
        <div className="d-flex align-items-center justify-content-center flex-grow-1">
          No Chat selected
        </div>
      )}

      {profileOpend && <ChatProfile />}
    </div>
  );
}

export default ChatInterface;
