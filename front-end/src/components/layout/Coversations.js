import React, { useEffect } from "react";
import profile from "../../assets/images/profile.png";
import styles from "./Conversations.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDom } from "../../context/DomContext";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import moment from "moment";
import { Parser } from "html-to-react";
function Coversations() {
  const htmlParser = new Parser();

  const { setShowAddConv } = useDom();
  const { user } = useAuth();

  const { chats, loading, error, setActiveChat, activeChat } = useChat(); // Store chat data

  useEffect(() => {}, [chats]);

  if (loading) {
    return <div>Loading chats...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className={`${styles.conversations} position-relative`}>
      <ul id="chat-list" className={`p-0 m-0 ${styles["chat-list"]}`}>
        {chats.map((chat) => {
          const lastMessage = chat.latestMessage?.content || ""; // Ensure latestMessage exists

          const userId = user._id;
          const otherUser = chat.users.find(
            (user) => user.userId._id.toString() !== userId.toString()
          );

          return (
            <li
              onClick={() => setActiveChat(chat)}
              key={chat._id}
              className={`${chat._id === activeChat?._id && styles.active}  ${
                styles.conversation
              } mb-1 `}
            >
              <div className="d-flex justify-content-lg-between justify-content-sm-center justify-content-between py-xl-4 py-3 w-100">
                <div className="d-flex">
                  <div
                    className={`${styles["conversation-avatar"]} me-lg-3 me-sm-0 me-3  rounded-circle`}
                  >
                    <img
                      src={
                        chat.isGroupChat
                          ? chat.groupPhoto
                            ? `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${chat.groupPhoto}`
                            : profile
                          : otherUser?.userId?.profilePicture
                          ? `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${otherUser.userId.profilePicture}`
                          : profile
                      }
                      alt={chat.name || otherUser?.username}
                      className="w-100 rounded-circle"
                    />
                  </div>
                  <div className={styles["conversation-info"]}>
                    <h3 className={styles["conversation-name"]}>
                      {chat.name || otherUser?.username || "User"}
                    </h3>
                    <p className={styles["last-conversation"]}>
                      <strong>
                        {lastMessage &&
                          chat.latestMessage?.sender._id === user._id &&
                          "you: "}
                        {lastMessage &&
                          chat.latestMessage?.sender._id !== user._id &&
                          chat.latestMessage?.sender.username + ": "}
                      </strong>
                      {/* {lastMessage && lastMessage.length > 15
                        ? `${lastMessage.slice(0, 15)}...`
                        : lastMessage || "No messages yet"} */}

                      {!/<\/?[a-z][\s\S]*>/i.test(lastMessage) &&
                        (lastMessage && lastMessage.length > 15
                          ? `${lastMessage.slice(0, 15)}...`
                          : lastMessage || "No messages yet")}
                      {lastMessage &&
                        /<\/?[a-z][\s\S]*>/i.test(lastMessage) &&
                        htmlParser.parse(lastMessage)}
                    </p>
                  </div>
                </div>

                <div className="conversation-time-stamp d-lg-flex d-sm-none d-flex flex-column justify-content-between ms-3">
                  <div className={styles["last-modified-time"]}>
                    {lastMessage &&
                      (() => {
                        const createdAt = moment(chat.latestMessage?.createdAt);
                        const now = moment();
                        const duration = moment.duration(now.diff(createdAt));
                        const hours = duration.asHours();
                        const days = duration.asDays();

                        if (hours < 24) {
                          return createdAt.format("LT");
                        } else if (days < 7) {
                          return `${Math.floor(days)}d`;
                        } else {
                          const weeks = Math.floor(days / 7);
                          return `${weeks}wk`;
                        }
                      })()}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div
                      className={`${styles["unread-messages"]} rounded-circle float-end mb-1 ms-auto d-flex align-items-center justify-content-center`}
                    >
                      {chat.unreadCount}
                    </div>
                  )}
                 
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button
        onClick={() => {
          setShowAddConv(true);
        }}
        className={`${styles["add-conversation-btn"]} position-absolute d-flex align-items-center justify-content-center rounded-circle`}
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}

export default Coversations;
