import React from "react";
import profile from "../../assets/images/profile.png";
import styles from "./Head.module.css";
import { useAuth } from "../../context/AuthContext";

function Head() {
  const { user } = useAuth();
  console.log(user);
  return (
    <div
      className={`${styles.head} w-100 d-flex align-items-center justify-content-between`}
    >
      <div
        className={`${styles["search-box"]} d-flex px-2 py-1 rounded-pill align-items-center`}
      >
        <i className="fa-solid fa-magnifying-glass me-2"></i>
        <input type="text" placeholder="Search messeages or persons here" />
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
    </div>
  );
}

export default Head;
