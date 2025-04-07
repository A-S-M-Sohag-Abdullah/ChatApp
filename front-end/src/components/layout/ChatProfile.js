import React from "react";
import profile from "../../assets/images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faImage,
  faCirclePlay,
  faBellSlash,
  faTrash,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./ChatProfile.module.css";
import { useDom } from "../../context/DomContext";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useStory } from "../../context/StoryContext";

function ChatProfile() {
  const {
    setProfileOpend,
    setShowBlockBox,
    setShowDeleteConvBox,
    setShowStory,
    setShowMute,
    setShowSharedPhotos,
  } = useDom();

  const { setStories, setStoryOwner, groupedStories } = useStory();

  const { user } = useAuth();
  const { activeChat } = useChat();

  const otherUser = activeChat?.users.find(
    (u) => u.userId.toString() !== user._id.toString()
  );

  function setUserStories() {
    // Find the user by _id and return the stories array
    const inChatUser = groupedStories.find(
      (userData) => userData.user._id === otherUser.userId
    );
    setStories(inChatUser.stories);
    setStoryOwner(otherUser.username);
  }

  return (
    <div className={`${styles["chat-profile-container"]} p-3`}>
      <div
        className={`${styles["chat-profile"]} w-100 border rounded-4 border-1 h-100`}
      >
        <button
          onClick={() => setProfileOpend(false)}
          className={`${styles["close-chat-profile-btn"]} ms-auto border d-block rounded-2 px-2 mb-3 mt-2 me-2`}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <div
          className={`${styles["chat-profile-img"]} border mx-auto mt-3 mb-2 rounded-circle border-1 p-1`}
        >
          <img src={profile} alt="" className="w-100" />
        </div>

        <h2 className={styles["chat-profile-name"] + " text-center mb-0"}>
          {otherUser.username}
        </h2>

        <p className={styles["chat-profile-status"] + " text-center"}>Active</p>

        <div
          className={`${styles["chat-profile-info-section"]} border-bottom d-flex mx-auto align-items-baseline mt-2`}
        >
          <h5 className={styles["chat-profile-info-section-name"]}>Bio: </h5>
          <p className={styles["chat-profile-info-section-desc"]}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>

        <div
          className={`${styles["chat-profile-info-section"]} border-bottom d-flex mx-auto align-items-baseline mt-2 mb-4`}
        >
          <h5 className={styles["chat-profile-info-section-name"]}>Phone: </h5>
          <p className={styles["chat-profile-info-section-desc"]}>
            +88 01717******
          </p>
        </div>

        <button
          onClick={() => {
            setShowSharedPhotos(true);
          }}
          className={`${styles["chat-profile-links"]} d-block mx-auto py-1 px-2 rounded-2 mb-2 text-dark text-start`}
        >
          <FontAwesomeIcon icon={faImage} className="me-2" /> Shared Photos
        </button>
        <button
          onClick={() => {
            setUserStories();
            setShowStory(true);
          }}
          className={`${styles["chat-profile-links"]} d-block mx-auto py-1 px-2 rounded-2 mb-2 text-dark text-start`}
        >
          <FontAwesomeIcon icon={faCirclePlay} className="me-2" /> Stories
        </button>
        <button
          onClick={() => {
            setShowMute(true);
          }}
          className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
        >
          <FontAwesomeIcon icon={faBellSlash} className="me-2" /> Mute
          Notification
        </button>
        <button
          onClick={() => {
            setShowDeleteConvBox(true);
          }}
          className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
          Conversation
        </button>
        <button
          onClick={() => {
            setShowBlockBox(true);
          }}
          className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} ${styles["block-action"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
        >
          <FontAwesomeIcon icon={faBan} className="me-2" /> Block User
        </button>
      </div>
    </div>
  );
}

export default ChatProfile;
