import React, { useEffect, useId, useState } from "react";
import profile from "../../assets/images/profile.png";
import styles from "./Peoples.module.css"; // Import the CSS module
import { useChat } from "../../context/ChatContext";
import { listenForUserStatus } from "../../services/socketService";
import { useAuth } from "../../context/AuthContext";

const Peoples = () => {
  const { user } = useAuth();
  const { chats } = useChat();


  const [onlineUsers, setOnlineUsers] = useState({});
  const [filteredUsers, setFilteredUsers] = useState([]);



  useEffect(() => {
    let chattedWith = chats
      .map((chat) => {
        // Filter the users in the chat whose userId is not equal to loggedInUserId
        return chat.users.filter((u) => u.userId !== user._id);
      })
      .flat();

    setFilteredUsers(chattedWith);
    listenForUserStatus(({ userId, isOnline }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }));
    });
  }, []);

  const getUserStatus = (userId) => {

    return onlineUsers[userId] ? "🟢 Online" : "⚪ Offline";
  };
  return (
    <div className={`${styles.peoples} position-relative px-4 py-3`}>
      <h4 className={styles.peoplesTitle}>Active people</h4>
      <ul className={`${styles.contactsList} list-unstyled h-100 d-none`}>
        <li className="d-flex align-items-center my-2">
          <div className={`${styles.contactImg} rounded-circle me-2`}>
            <img src={profile} alt="Profile" className="w-100" />
          </div>
          <h5 className={styles.contactName + " mb-0"}>Contact Name</h5>
        </li>
        <li className="d-flex align-items-center my-2">
          <div className={`${styles.contactImg} rounded-circle me-2`}>
            <img src={profile} alt="Profile" className="w-100" />
          </div>
          <h5 className={styles.contactName + " mb-0"}>Contact Name</h5>
        </li>
        <li className="d-flex align-items-center my-2">
          <div className={`${styles.contactImg} rounded-circle me-2`}>
            <img src={profile} alt="Profile" className="w-100" />
          </div>
          <h5 className={styles.contactName + " mb-0"}>Contact Name</h5>
        </li>
      </ul>

      {filteredUsers.map((u) => {
        return (
          <div key={u.userId}>
            {u.username} - {getUserStatus(u.userId)}
          </div>
        );
      })}
    </div>
  );
};

export default Peoples;
