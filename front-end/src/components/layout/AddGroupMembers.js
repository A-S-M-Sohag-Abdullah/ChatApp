import React, { useEffect, useState } from "react";
import styles from "./AddGroupMembers.module.css";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userApi from "../../api/userApi";
import profile from "../../assets/images/profile.png";
import { useDom } from "../../context/DomContext";
import chatApi from "../../api/chatApi";
import { useChat } from "../../context/ChatContext";
import { toast } from "react-toastify";

function AddGroupMembers() {
  const { setShwoAddGroupMembers } = useDom();
  const { activeChat, fetchChats } = useChat();

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    // Set a delay before calling the search function
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms delay (debounce time)

    // Clean up the timer on component unmount or when the query changes
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    // Call the search function when the debounced query changes
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery]); // Only run when debouncedQuery changes

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const result = await userApi.searchUsers(debouncedQuery);
      setUsers(result); // Assuming the backend returns an array of user objects
    } catch (err) {
      setError("Error fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value); // Update the query state on every key press
  };

  const handleAddGroupMember = async (user, userId) => {
    try {
      console.log(user);
      const response = await chatApi.addToGroup(activeChat._id, userId);
      if (response.success) {
        toast.success(response.message);
        fetchChats();
      }
    } catch (err) {}
  };
  return (
    <div className={styles.addGroupMembersContainer + " position-lg-absolute position-fixed"}>
      <div className="d-flex">
        <h2 className={styles.addGroupMembersTitle}>Add Group Members</h2>

        <button
          onClick={() => setShwoAddGroupMembers(false)}
          className={`border ms-auto border d-block rounded border-1 mb-3 border-dark`}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <input
        class={styles.seachBar + " w-100 border border-1 rounded px-2"}
        placeholder="Search people with username, email or phone no."
        type="text"
        onChange={handleQueryChange}
      ></input>

      <ul className={`${styles.searchResult} m-0 p-0 mt-3 pt-3 border-top`}>
        {users.map((user) => (
          <li key={user._id} className="d-flex align-items-center mb-3">
            <div className={`${styles.searchUserImg}`}>
              <img src={profile} alt="user profile pic" className="w-100" />
            </div>
            <h4 className={`${styles.searchUserName} ms-2 mb-0`}>
              {user.username}
            </h4>

            <button
              onClick={() => handleAddGroupMember(user, user._id)}
              className={styles.addMemberBtn}
            >
              Add Member
            </button>
          </li> // Assuming each user has an 'id' and 'name'
        ))}
      </ul>
    </div>
  );
}

export default AddGroupMembers;
