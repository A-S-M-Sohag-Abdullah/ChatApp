import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./BlockedAccounts.module.css";
import profile from "../../assets/images/profile.png";
import { useDom } from "../../context/DomContext";
import { useAuth } from "../../context/AuthContext";
import blockApi from "../../api/blockApi";
import { toast } from "react-toastify";
import { useChat } from "../../context/ChatContext";

const BlockedAccounts = () => {
  const { setShowBlockedAccounts, blockAccountRef } = useDom();
  const { user, setUser } = useAuth();
  const { fetchChats, chats } = useChat();

  const handleUnblockUser = async (id) => {
    const response = await blockApi.unblockUser(id);

    if (response.success) {
      toast.success(response.message, {
        progressClassName: "green-progress-bar",
      });
      setUser(response.result);
      fetchChats();
    }
  };

  return (
    <div ref={blockAccountRef} className={`${styles.blockedAccountsInterface}`}>
      <div className="d-flex align-items-center border-bottom border-bottom-1">
        <h6>Blocked Accounts</h6>
        <button
          onClick={() => setShowBlockedAccounts(false)}
          className={`${styles.closeAddConvBoxBtn} ms-auto`}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className={styles.blockedAccounts}>
        {user.blockedUsers.map((user) => {
          return (
            <div key={user._id} className={styles.blockedAccount}>
              <h5 className={styles.blockedPerson}>
                <img src={profile} alt="user profile pic" />
                {user.username}
              </h5>
              <button
                onClick={() => handleUnblockUser(user._id)}
                className={styles.unblockBtn}
              >
                Unblock
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlockedAccounts;
