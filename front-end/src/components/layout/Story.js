import React, { useEffect, useState } from "react";
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
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Story.module.css";
import story from "../../assets/images/commonsoty.jpg";
import profile from "../../assets/images/profile.png";
import { useDom } from "../../context/DomContext";
import { useStory } from "../../context/StoryContext";

function Story() {
  const { setShowStory } = useDom();
  const [reply, setReply] = useState("");
  const [currentStory, setCurrentStory] = useState(0);
  const [optionsActive, setOptionsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { stories, storyOwner } = useStory();

  

  const toggleOptions = () => {
    optionsActive ? setOptionsActive(false) : setOptionsActive(true);
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleSendReply = () => {
    // handle sending the reply here (e.g., API call or state update)
    console.log("Reply Sent: ", reply);
    setReply("");
  };

  const handleNext = () => {
    setCurrentStory((prev) => (prev + 1) % stories.length);
  };

  const handlePrev = () => {
    setCurrentStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const currentStoryData = stories[currentStory];

  useEffect(() => {
    if (isPaused) return;

    const intervalId = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isPaused, stories.length]);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
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
            {isPaused ? "Play" : "Pause"}
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
