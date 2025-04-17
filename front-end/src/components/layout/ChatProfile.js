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
  faPeopleGroup,
  faUserPlus,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./ChatProfile.module.css";
import { useDom } from "../../context/DomContext";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useStory } from "../../context/StoryContext";
import { toast } from "react-toastify";

function ChatProfile() {
  const {
    setProfileOpend,
    setShowBlockBox,
    setShowDeleteConvBox,
    setShowStory,
    setShowMute,
    setShowSharedPhotos,
    setShowMembers,
    setShwoAddGroupMembers,
    setShowEditGroupInfo,
    blockBtn2Ref,
    deleteBtn2Ref,
  } = useDom();

  const { setStories, setStoryOwner, groupedStories } = useStory();

  const { user } = useAuth();
  const { activeChat } = useChat();

  const otherUser = activeChat?.users.find(
    (u) => u.userId._id.toString() !== user._id.toString()
  );

  function setUserStories() {
    // Find the user by _id and return the stories array
    if (groupedStories.length > 0) {
      const inChatUser = groupedStories.find(
        (userData) => userData.user._id === otherUser.userId._id
      );

      setStories(inChatUser?.stories);
      setStoryOwner(otherUser.username);
      setShowStory(true);
    } else {
      toast.error("No stories to show");
    }
  }

  return (
    <div className={`${styles["chat-profile-container"]} p-3`}>
      <div
        className={`${styles["chat-profile"]} w-100 border rounded-4 border-1 h-100`}
      >
        <div
          className={`${styles["chat-profile-head"]} d-flex align-items-center px-2 mb-3 py-2 border-bottom`}
        >
          <h3 className={styles["chat-profile-title"]}>
            {activeChat.isGroupChat ? "Group Info" : "Profile Info"}
          </h3>
          <button
            onClick={() => setProfileOpend(false)}
            className={`${styles["close-chat-profile-btn"]} ms-auto border d-block rounded-2 `}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div
          className={`${styles["chat-profile-img"]} border mx-auto mt-3 mb-2 rounded-circle border-1 p-1`}
        >
          <img
            src={
              !activeChat.isGroupChat && otherUser.userId.profilePicture
                ? `http://localhost:5000${otherUser.userId.profilePicture}`
                : profile
            }
            alt=""
            className="w-100 rounded-circle"
          />
        </div>

        <h2 className={styles["chat-profile-name"] + " text-center mb-0"}>
          {activeChat.isGroupChat ? activeChat.name : otherUser.username}
        </h2>

        <p className={styles["chat-profile-status"] + " text-center"}>
          {!activeChat.isGroupChat && "Active"}
        </p>

        <div
          className={`${styles["chat-profile-info-section"]} border-bottom d-flex mx-auto align-items-baseline mt-2`}
        >
          {!activeChat.isGroupChat && (
            <>
              <h5
                className={styles["chat-profile-info-section-name"] + " me-1"}
              >
                Bio:{" "}
              </h5>
              <p className={styles["chat-profile-info-section-desc"]}>
                {" "}
                {otherUser.userId.bio}
              </p>
            </>
          )}
        </div>

        <div
          className={`${styles["chat-profile-info-section"]} border-bottom d-flex mx-auto align-items-baseline mt-2 pb-2 flex-column flex-wrap`}
        >
          <div className="d-flex align-items-center ">
            <p className={styles["chat-profile-info-section-desc"] + " mb-0"}>
              Phone: {otherUser.userId.phone}
            </p>
          </div>
          <div className="d-flex align-items-center flex-wrap">
            <p className={styles["chat-profile-info-section-desc"] + " mb-0 "}>
              {`Email: ${otherUser.userId.email}`}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setShowSharedPhotos(true);
          }}
          className={`${styles["chat-profile-links"]} d-block mx-auto py-1 px-2 rounded-2 mb-2 text-dark text-start`}
        >
          <FontAwesomeIcon icon={faImage} className="me-2" /> Shared Photos
        </button>

        {!activeChat.isGroupChat && (
          <button
            onClick={() => {
              setUserStories();
              setStoryOwner({
                username: otherUser.username,
                profilePicture: otherUser.userId.profilePicture,
              });
            }}
            className={`${styles["chat-profile-links"]} d-block mx-auto py-1 px-2 rounded-2 mb-2 text-dark text-start`}
          >
            <FontAwesomeIcon icon={faCirclePlay} className="me-2" /> Stories
          </button>
        )}

        <button
          onClick={() => {
            setShowMute(true);
          }}
          className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
        >
          <FontAwesomeIcon icon={faBellSlash} className="me-2" /> Mute
          Notification
        </button>

        {activeChat.isGroupChat && (
          <button
            onClick={() => {
              setShowMembers(true);
            }}
            className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
          >
            <FontAwesomeIcon icon={faPeopleGroup} className="me-2" /> See
            Members
          </button>
        )}

        {activeChat.isGroupChat && activeChat.groupAdmin === user._id && (
          <button
            onClick={() => {
              setShwoAddGroupMembers(true);
            }}
            className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
          >
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Add Members
          </button>
        )}

        {activeChat.isGroupChat && activeChat.groupAdmin === user._id && (
          <button
            onClick={() => {
              setShowEditGroupInfo(true);
            }}
            className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
          >
            <FontAwesomeIcon icon={faPenToSquare} className="me-2" />
            Edit Group Info
          </button>
        )}

        <button
          ref={deleteBtn2Ref}
          onClick={() => {
            setShowDeleteConvBox(true);
          }}
          className={`${styles["conversation-option"]} ${styles["chat-profile-links"]} px-2 py-1 rounded p-1 text-start mx-auto d-block mb-2`}
        >
          <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
          Conversation
        </button>
        <button
          ref={blockBtn2Ref}
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
