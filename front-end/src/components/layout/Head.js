import React, { useEffect, useState } from "react";
import profile from "../../assets/images/profile.png";
import styles from "./Head.module.css";
import { useAuth } from "../../context/AuthContext";
import messageApi from "../../api/messageApi";
import chatApi from "../../api/chatApi";
import { useChat } from "../../context/ChatContext";

function Head() {
  const { user } = useAuth();
  const { setActiveChat } = useChat();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatSearchResults, setChatSearchResults] = useState();

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setChatSearchResults(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(debouncedQuery);
      const chats = await chatApi.searchChat(debouncedQuery);
      console.log(chats);
      setChatSearchResults(chats);
      /*   setMsgSearchResult(messageresult); */ // Assuming the backend returns an array of user objects
    } catch (err) {
      setError("Error fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
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
  }, [debouncedQuery]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) {
      setChatSearchResults(null); // clear the user list
      setError(""); // optionally clear any previous error
    }
  };

  return (
    <div
      className={`${styles.head} w-100 d-flex align-items-center justify-content-between`}
    >
      <div
        className={`${styles["search-box"]} d-flex px-2 py-1 rounded-pill align-items-center position-relative`}
      >
        <i className="fa-solid fa-magnifying-glass me-2"></i>
        <input
          type="text"
          placeholder="Search Groups or Persons here"
          value={query}
          onChange={handleInputChange}
        />
      </div>
      <div className={`${styles.user} d-flex align-items-center pe-5`}>
        <h1 className={`${styles["user-name"]} me-3 mb-0`}>{user.username}</h1>
        <div className={`${styles["user-img"]} rounded-circle p-1`}>
          <img
            src={
              user.profilePicture
                ? `http://localhost:5000${user.profilePicture}`
                : profile
            }
            alt="profile"
            className="w-100 rounded-circle"
          />
        </div>
      </div>
      {chatSearchResults?.chats.length > 0 && (
        <div className={`${styles.searchResults}`}>
          {/*   {searchResult.map((message) => {
          message.content;
        })} */}

          <ul className="list-unstyled  m-0">
            {chatSearchResults?.chats.map((chat) => {
              if (chat.isGroupChat) {
                // GROUP CHAT
                return (
                  <li
                    key={chat._id}
                    onClick={() => {
                      setActiveChat(chat);
                      setChatSearchResults(null);
                      setQuery("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={
                        `http://localhost:5000${chat.groupPhoto}` || { profile }
                      }
                      alt={chat.name}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <span>{chat.name}</span>
                  </li>
                );
              } else {
                // ONE-TO-ONE CHAT
                const otherUser = chat.users.find(
                  (u) => u.userId._id !== user._id
                );
                return (
                  <li
                    key={chat._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                    onClick={() => {
                      setActiveChat(chat);
                      setChatSearchResults(null);
                      setQuery("");
                    }}
                  >
                    <img
                      src={
                        `http://localhost:5000${otherUser.userId.profilePicture}` || {
                          profile,
                        }
                      }
                      alt={otherUser.username}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    <span>{otherUser.username}</span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Head;
