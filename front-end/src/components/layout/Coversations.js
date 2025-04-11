import React from "react";
import profile from "../../assets/images/profile.png";
import styles from "./Conversations.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDom } from "../../context/DomContext";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import moment from "moment";

function Coversations() {
  const { setShowAddConv } = useDom();
  const { user } = useAuth();

  const { chats, loading, error, setActiveChat } = useChat(); // Store chat data

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
              className={`${styles.conversation} mb-1 `}
            >
              <div className="d-flex justify-content-between py-4 w-100">
                <div className="d-flex">
                  <div
                    className={`${styles["conversation-avatar"]} me-3 rounded-circle`}
                  >
                    <img
                      src={profile}
                      alt={chat.name || otherUser?.username}
                      className="w-100"
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
                      {lastMessage && lastMessage.length > 15
                        ? `${lastMessage.slice(0, 15)}...`
                        : lastMessage || "No messages yet"}
                    </p>
                  </div>
                </div>

                <div className="conversation-time-stamp d-flex flex-column justify-content-between ms-3">
                  <div className={styles["last-modified-time"]}>
                    {lastMessage &&
                    moment(chat.latestMessage?.createdAt).isSame(
                      moment(),
                      "day"
                    )
                      ? moment(chat.latestMessage?.createdAt).format("LT")
                      : moment(chat.latestMessage?.createdAt).format(
                          "MM / DD / YY : LT"
                        )}
                  </div>
                  <div
                    className={`${styles["unread-messages"]} rounded-circle float-end mb-1 ms-auto d-flex align-items-center justify-content-center`}
                  >
                    {chat.unreadMessagesCount || 0}
                  </div>
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
