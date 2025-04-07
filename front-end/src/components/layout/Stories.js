import React, { useEffect, useRef, useState } from "react";
import styles from "./Stories.module.css"; // Import CSS module
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import soty from "../../assets/images/commonsoty.jpg";
import profile from "../../assets/images/profile.png";
import storyApi from "../../api/storyApi";
import { useChat } from "../../context/ChatContext";
import { useDom } from "../../context/DomContext";
import { useStory } from "../../context/StoryContext";
import { toast } from "react-toastify";

const Stories = () => {
  const fileInputRef = useRef(null);
  const formRef = useRef(null);
  const { groupedStories, setGroupedStories } = useStory();
  const { setStories, setStoryOwner } = useStory();
  const { setShowStory } = useDom();
  let toastId = null;
  // Function to handle the file selection and automatic form submission
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file logic (e.g., uploading the file)
      console.log("File selected:", file);

      // Automatically submit the form after file selection
      handleFormSubmit();
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    // Prevent default form submission behavior (if triggered by other methods)
    event?.preventDefault();
    // Here, handle the form submission logic (e.g., upload the file or send form data)
    try {
      const files = fileInputRef.current.files;
      if (files.length > 0) {
        const selectedFile = files[0]; // Assuming a single file is selected

        // Create FormData to send the file
        const formData = new FormData();
        formData.append("storyImage", selectedFile);

        const response = await toast.promise(
          storyApi.postStory(formData), // your API call here
          {
            pending: "Submitting Story...", // message when the promise is pending
            success: "Story Created Successfully 👌", // message when the promise resolves
            error: "Failed to Create Story 🤯", // message when the promise rejects
          }
        );
       
      } else {
        console.error("File upload failed");
        // Handle error response (e.g., show an error message)
      }
    } catch (error) {
      console.log(error);
    }

    // Reset the form or perform any post-submission actions
  };

  const handleFormClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`${styles.stories} d-flex flex-wrap justify-content-between position-relative align-content-start px-2`}
    >
      {/* Add Story Button */}
      <form
        className={`${styles.addStory} d-flex align-items-center justify-content-center rounded rounded-3 mb-2`}
        onClick={handleFormClick} // Open the file dialog when form is clicked
        onSubmit={handleFormSubmit} // Handle form submission
        ref={formRef} // Reference to the form
      >
        <input
          type="file"
          hidden
          ref={fileInputRef} // Reference to the file input
          onChange={handleFileChange} // Handle file selection
        />
        <FontAwesomeIcon icon={faPlus} />
      </form>

      {groupedStories.map((userData) => {
        const { user, stories } = userData; // Destructure user and stories
        const { profilePicture, username } = user;

        return (
          <div
            onClick={() => {
              setStories(stories);
              setStoryOwner(user.username);
              setShowStory(true);
            }}
            key={user._id}
            className={`${styles.storyContainer} rounded rounded-3 position-relative mb-2`}
          >
            {/* User's Profile Image */}
            <div
              className={`${styles.storyPoster} rounded-circle position-absolute d-flex align-items-center justify-content-center`}
            >
              <img src={profile} alt={username} className="w-100" />
            </div>

            {/* Story Image */}
            <div className="latest-story-img h-100">
              <img
                src={`http://localhost:5000/${stories[0].image}`} // Ensure the image path is correctly resolved
                alt={`Story by ${username}`}
                className="w-100 h-100"
              />
            </div>

            {/* Story Count */}
            <div
              className={`${styles.storyCount} position-absolute d-flex align-items-center justify-content-center rounded-circle`}
            >
              {stories.length}{" "}
              {/* Placeholder, replace with dynamic count if available */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stories;
