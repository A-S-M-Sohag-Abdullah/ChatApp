import React, { useEffect, useState } from "react";
import profile from "../../assets/images/profile.png";
import styles from "./Head.module.css";
import { useAuth } from "../../context/AuthContext";
import messageApi from "../../api/messageApi";

function Head() {
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchResult, setSearchResult] = useState();

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      console.log(debouncedQuery);
      const result = await messageApi.searchMessages(debouncedQuery);
      console.log(result);
      setSearchResult(result); // Assuming the backend returns an array of user objects
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
          placeholder="Search messages or persons here"
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
      <div className={`${styles.searchResults}`}>
        {/*   {searchResult.map((message) => {
          message.content;
        })} */}
      </div>
    </div>
  );
}

export default Head;
