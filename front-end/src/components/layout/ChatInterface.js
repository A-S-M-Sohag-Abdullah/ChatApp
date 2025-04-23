import React, { useCallback, useEffect, useState } from "react";
import Coversations from "./Coversations";
import Stories from "./Stories";
import Peoples from "./Peoples";
import ConverSationBox from "./ConverSationBox";
import ChatProfile from "./ChatProfile";
import styles from "./ChatInterface.module.css";
import { useDom } from "../../context/DomContext";
import { useChat } from "../../context/ChatContext";
import messageApi from "../../api/messageApi";

function ChatInterface() {
  const { profileOpend, activeButton } = useDom();
  const { activeChat } = useChat();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const messagesData = await messageApi.getMessages(activeChat._id);
      setMessages(messagesData); // Assuming the response is an array of messages
      // scrollToBottm();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [activeChat?._id]);

  useEffect(() => {
    fetchMessages();
  }, [activeChat]);

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
        <div className="d-flex align-items-center justify-content-center flex-grow-1">
          No Chat selected
        </div>
      )}

      {profileOpend && <ChatProfile />}
    </div>
  );
}

export default ChatInterface;
