import React from "react";
import styles from "./ChatMembers.module.css";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDom } from "../../context/DomContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useChat } from "../../context/ChatContext";
import profile from "../../assets/images/profile.png";
import { useAuth } from "../../context/AuthContext";

function ChatMembers() {
  const { setShowMembers } = useDom();
  const { activeChat } = useChat();
  const { user } = useAuth();

  console.log(activeChat, user);

  return (
    <div className={styles.chatMembersInterface}>
      <div class="d-flex align-items-center border-bottom border-bottom-1">
        <h6>Group Members</h6>
        <button
          onClick={() => setShowMembers(false)}
          className={`${styles.closeAddConvBoxBtn} ms-auto`}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className={styles.membersList}>
        {activeChat.users.map((u) => (
          <div key={u._id}>
            <img src={profile} alt="" /> {u.username}{" "}
            {activeChat.groupAdmin === user._id && <button className={`${styles.removeUserBtn} ms-auto`}>Remove</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatMembers;
