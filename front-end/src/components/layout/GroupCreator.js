import React, { useEffect, useState } from "react";
import profile from "../../assets/images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./GroupCreate.module.css"; // Import your modular CSS
import { useDom } from "../../context/DomContext";
import userApi from "../../api/userApi";
import chatApi from "../../api/chatApi";
import { useAuth } from "../../context/AuthContext";

const GroupCreator = () => {
  const { setShowGroupCreator, groupCreatorRef } = useDom();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userList, setUserList] = useState([user]);
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // Debounce the search to avoid unnecessary API calls
    const debounceTimer = setTimeout(async () => {
      if (searchQuery) {
        try {
          setLoading(true);
          const results = await userApi.searchUsers(searchQuery);
          const filteredResults = results.filter(
            (user) => !userList.some((u) => u._id === user._id)
          );
          setSearchResults(filteredResults);
        } catch (error) {
          console.error("Error fetching search results:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); // Debounce time set to 500ms

    // Clean up the timer on component unmount or searchQuery change
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleAddUser = (user) => {
    // Add the selected user to the user list
    setUserList((prevList) => [...prevList, user]);
    setSearchQuery("");
  };

  const handleRemoveUser = (userId) => {
    // Remove the user from the list
    setUserList((prevList) => prevList.filter((user) => user._id !== userId));
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    // Example logic for creating a chat, send userList to the backend API or handle it accordingly
    console.log("Creating chat with users:", userList);
    // Call an API to create a chat or handle the logic accordingly
    if (userList.length <= 2) {
      alert("At least 3 users needs to be selected");
      return;
    } else {
      const formData = new FormData();
      formData.append("userid", null);
      formData.append("username", null);
      formData.append("users", JSON.stringify(userList));
      formData.append("chatName", chatName);
      formData.append("groupPhoto", selectedFile);

      await chatApi.createChat(formData);

      setShowGroupCreator(false); // Close the group creator modal after creating the chat
    }
  };

  const handleGroupImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setGroupPhoto(url);
      setSelectedFile(file);
    }
  };

  return (
    <div ref={groupCreatorRef} className={styles.groupCreateInterface}>
      <button
        onClick={() => setShowGroupCreator(false)}
        className={`${styles.closeAddConvBoxBtn} ms-auto border d-block rounded border-1 mb-3`}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <form
        className="group-info d-flex align-items-center justify-content-center mt-3"
        onSubmit={handleCreateChat}
      >
        <label htmlFor="group-pic" className={styles.groupPic}>
          <input
            id="group-pic"
            type="file"
            className="d-none"
            onChange={handleGroupImageChange}
          />
          {groupPhoto ? (
            <img src={groupPhoto} />
          ) : (
            <FontAwesomeIcon icon={faCamera} />
          )}
        </label>
        <input
          className={styles.groupName}
          type="text"
          placeholder="Group Name"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          required
        />
        <button type="submit" className={styles.createGroupBtn}>
          Create
        </button>
      </form>
      <div className="d-flex flex-wrap mt-3">
        {/* Render the added users */}
        {userList.map((u) => (
          <div className={`${styles.member}`} key={u._id}>
            <img
              src={
                u.profilePicture
                  ? `http://localhost:5000${u.profilePicture}`
                  : profile
              }
              alt="user profile pic"
              className="w-100 rounded-circle"
            />
            {u._id !== user._id && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUser(u._id);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
        ))}
      </div>
      <div className="add-group-user mt-2">
        <input
          type="text"
          className={`${styles.searchInput} w-100 border border-1 rounded px-2`}
          placeholder="Search people with username, email or phone no."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loading && <div>Loading...</div>}
        <ul className={`${styles.searchResult} m-0 p-0 mt-3 pt-3 border-top`}>
          {searchResults.length === 0 && !loading ? (
            <li></li>
          ) : (
            searchResults.map((user) => (
              <li
                className="d-flex align-items-center mb-3"
                key={user.id}
                onClick={() => handleAddUser(user)} // Add user on click
                style={{ cursor: "pointer" }} // Change cursor to pointer to indicate it's clickable
              >
                <div className={styles.searchUserImg}>
                  <img
                    src={user.profilePic || profile}
                    alt="user profile pic"
                    className="w-100"
                  />
                </div>
                <h4 className={`${styles.searchUserName} ms-2 mb-0`}>
                  {user.username}
                </h4>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupCreator;
