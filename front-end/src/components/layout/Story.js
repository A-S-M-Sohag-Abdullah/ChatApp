import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faTrash,
  faDownload,
  faBellSlash,
  faXmark,
  faCamera,
  faPenToSquare,
  faCircleChevronLeft,
  faCircleChevronRight,
  faL,
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Story.module.css";
import story from "../../assets/images/commonsoty.jpg";
import profile from "../../assets/images/profile.png";
import { useDom } from "../../context/DomContext";
import { useStory } from "../../context/StoryContext";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import messageApi from "../../api/messageApi";
import { toast } from "react-toastify";

function Story() {
  const { setShowStory } = useDom();
  const { chats, fetchChats } = useChat();
  const { user } = useAuth();
  const [reply, setReply] = useState("");
  const [currentStory, setCurrentStory] = useState(0);
  const [optionsActive, setOptionsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // milliseconds
  const { stories, storyOwner } = useStory();

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);
  const startStoryCycle = () => {
    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
      startTimeRef.current = Date.now(); // reset start time for next cycle
    }, 5000);
  };

  const stopStoryCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const toggleOptions = () => {
    optionsActive ? setOptionsActive(false) : setOptionsActive(true);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleSendReply = async () => {
    const filteredChat = chats.filter((chat) => {
      if (chat.isGroupChat) return false;

      const userIds = chat.users.map((u) => u.userId._id);

      return userIds.includes(user._id) && userIds.includes(storyOwner._id);
    });

    console.log(filteredChat);
    const formData = new FormData();

    formData.append("chatId", filteredChat[0]._id);
    formData.append("content", reply);
    formData.append("storyImage", currentStoryData?.image);
    // handle sending the reply here (e.g., API call or state update)
    try {
      const response = await messageApi.sendMessage(formData);
      if (response.success) {
        toast.success("Message sent to " + storyOwner.username);
        fetchChats();
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
    setReply("");
  };

  const handleNext = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
    if (isPaused) togglePause();
  };

  const handlePrev = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
    if (isPaused) togglePause();
  };

  const currentStoryData = stories[currentStory];

  useEffect(() => {
    if (!isPaused) {
      if (elapsedTime > 0) {
        // Resume after remaining time
        const remaining = 5000 - elapsedTime;
        timeoutRef.current = setTimeout(() => {
          setCurrentStory((prev) => (prev + 1) % stories.length);
          startStoryCycle(); // Continue regular cycle
          setElapsedTime(0); // Reset elapsed
        }, remaining);
      } else {
        startStoryCycle();
      }
    } else {
      // Pausing: calculate how much time has passed since last story started
      if (startTimeRef.current) {
        const timePassed = Date.now() - startTimeRef.current;
        setElapsedTime(timePassed);
      }
      stopStoryCycle();
    }

    return () => {
      stopStoryCycle();
    };
  }, [isPaused, stories.length, currentStory]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    toast("Story paused");
  };

  return (
    <div className={styles.storyInterface}>
      <div className={styles.storyHead}>
        <div className={styles.storyOwner}>
          <img
            src={
              storyOwner.profilePicture
                ? `http://localhost:5000${storyOwner.profilePicture}`
                : profile
            }
            alt="Profile"
          />
          {storyOwner.username}
        </div>
        <div className={styles.storyActions}>
          <button onClick={togglePause} className="text-white">
            {isPaused ? (
              <FontAwesomeIcon icon={faPlay} />
            ) : (
              <FontAwesomeIcon icon={faPause} />
            )}
          </button>
          <button onClick={toggleOptions} className={styles.options}>
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {optionsActive && (
            <div className={styles.storyOptions}>
              <div className={styles.storyOption}>
                <FontAwesomeIcon icon={faTrash} /> Delete Story
              </div>
              <div className={styles.storyOption}>
                <FontAwesomeIcon icon={faDownload} /> Download
              </div>
              <div className={styles.storyOption}>
                <FontAwesomeIcon icon={faBellSlash} /> Mute this story
              </div>
            </div>
          )}

          <button onClick={() => setShowStory(false)} className={styles.cross}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className={styles.storyProgresses}>
          {stories?.map((_, index) => (
            <div
              key={index}
              className={`${styles.storyProgress}
              ${index < currentStory && styles.seen}
              ${index === currentStory ? styles.active : ""}
              ${index === currentStory && isPaused ? styles.paused : ""}`}
            ></div>
          ))}
        </div>
      </div>
      <div className={styles.storyMedia}>
        <img
          src={`http://localhost:5000/${currentStoryData?.image}`}
          alt="Story Media"
        />
      </div>
      <div className={styles.storyFoot}>
        <input
          type="text"
          placeholder="Reply to this story"
          value={reply}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onChange={handleReplyChange}
        />
        <button onClick={handleSendReply}>Send</button>
      </div>
      <div className={styles.storyNav}>
        <button
          className={styles.prev}
          onClick={handlePrev}
          disabled={currentStory === 0}
        >
          <FontAwesomeIcon icon={faCircleChevronLeft} />
        </button>
        <button
          className={styles.next}
          onClick={handleNext}
          disabled={currentStory === stories.length - 1}
        >
          <FontAwesomeIcon icon={faCircleChevronRight} />
        </button>
      </div>
    </div>
  );
}

export default Story;
