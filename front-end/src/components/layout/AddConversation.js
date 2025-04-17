import React, { useEffect, useRef, useState } from "react";
import styles from "./AddConversation.module.css"; // Import the CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons"; // Import FontAwesome icons
import profile from "../../assets/images/profile.png";
import { useDom } from "../../context/DomContext";
import userApi from "../../api/userApi";
import chatApi from "../../api/chatApi";

const AddConversation = () => {
  const containerRef = useRef(null);
  const { setShowAddConv } = useDom();

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

  const createChats = (userid, username) => {
    const formData = new FormData();
    formData.append("userId", userid);
    formData.append("username", username);
    chatApi.createChat(formData);
  };

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        if (
          containerRef.current === e.target &&
          containerRef.current.contains(e.target)
        ) {
          // If the click is outside, close the conversation box
          setShowAddConv(false);
        }
      }}
      className={`${styles.addConversationContainer} position-fixed d-flex align-items-center justify-content-center`}
    >
      <div
        className={`${styles.addConversationBox} p-4 rounded-4 border border-2`}
      >
        <button
          onClick={() => {
            setShowAddConv(false);
          }}
          className={`${styles.closeAddConvBoxBtn} ms-auto border d-block rounded border-1 mb-3`}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <input
          type="text"
          onChange={handleQueryChange}
          className={`${styles.addConversationInput} w-100 border border-1 rounded px-2`}
          placeholder="Search people with username, email or phone no."
        />

        <ul className={`${styles.searchResult} m-0 p-0 mt-3 pt-3 border-top`}>
          {users.map((user) => (
            <li
              key={user._id}
              className="d-flex align-items-center mb-3"
              onClick={() => createChats(user._id, user.username)}
            >
              <div className={`${styles.searchUserImg}`}>
                <img src={profile} alt="user profile pic" className="w-100" />
              </div>
              <h4 className={`${styles.searchUserName} ms-2 mb-0`}>
                {user.username}
              </h4>
            </li> // Assuming each user has an 'id' and 'name'
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddConversation;
