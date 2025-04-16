import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./UserDetails.module.css";
import profile from "../../assets/images/profile.png";
import { useDom } from "../../context/DomContext";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import userApi from "../../api/userApi";
import { toast } from "react-toastify";
function UserDetails() {
  const { user } = useAuth();

  const { setShowUserDetails, userDetailsRef } = useDom();
  // State for toggle edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // State variables to track changes in the input fields
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newFileUrl, setNewFileUrl] = useState(null);
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setShowUserDetails(false);
  };

  // Handlers for input changes
  const handleUserNameChange = (e) => setUsername(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleContactNoChange = (e) => setPhone(e.target.value);
  const handleDobChange = (e) => setDateOfBirth(e.target.value);

  const handleUpdateUser = async () => {
    try {
      console.log("updating user");
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("email", email);
      formData.append("phone", `${phone}`);
      formData.append("dateOfBirth", dateOfBirth);
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const response = await userApi.updateUserProfile(formData);

      if (response.success) {
        toast.success(response.message);
        handleCancelClick();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setNewFileUrl(url);
      setSelectedFile(file);
    }
  };

  return (
    <div
      ref={userDetailsRef}
      className={`${styles.profileDetails} position-fixed rounded rounded-4 p-3`}
    >
      <button
        onClick={handleCancelClick}
        className={`${styles.closeProfileDetails} ms-auto border d-block rounded border-1 mb-3`}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className={`${styles.profileDetailsDpContainer} position-relative`}>
        <img
          src={
            newFileUrl
              ? newFileUrl
              : profilePicture
              ? `http://localhost:5000${user.profilePicture}`
              : profile
          }
          alt="Profile"
          className="w-100 dp-upload rounded-circle"
        />
        <label htmlFor="file-upload" className={isEditMode ? "" : "d-none"}>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="d-none"
            onChange={handleImageChange}
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`${styles.changeDpBtn} centered position-absolute d-flex align-items-center justify-content-center`}
          >
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </label>
      </div>

      <button
        className={`${styles.editBtn} ms-auto d-block mt-3`}
        onClick={handleEditClick}
      >
        Edit
        <FontAwesomeIcon icon={faPenToSquare} />
      </button>

      <form className={`${styles.profileInfoBox} border-top mt-3`}>
        <div className={styles.label}>User Name:</div>
        <input
          type="text"
          className={`${styles.profileName} ${!isEditMode && "disabled"}`}
          value={username}
          onChange={handleUserNameChange}
          readOnly={!isEditMode}
        />

        <div className={styles.label}>Bio:</div>
        <input
          type="text"
          className={`${styles.bio} ${!isEditMode && "disabled"}`}
          value={bio}
          onChange={handleBioChange}
          readOnly={!isEditMode}
        />

        <div className={styles.label}>Contact No:</div>
        <input
          type="tel"
          className={`${styles.contactNo} ${!isEditMode && "disabled"}`}
          value={phone}
          onChange={handleContactNoChange}
          readOnly={!isEditMode}
        />

        <div className={styles.label}>Email:</div>
        <input
          type="email"
          className={`${styles.email} ${!isEditMode && "disabled"}`}
          value={email}
          readOnly={true}
        />

        <div className={styles.label}>Date of Birth:</div>
        <input
          type="date"
          className={`${styles.email} ${!isEditMode && "disabled"}`}
          value={new Date(dateOfBirth).toISOString().split("T")[0]}
          onChange={handleDobChange}
          readOnly={!isEditMode}
        />

        <div className={`${styles.profileInfoSubmit} ms-auto mt-2`}>
          <button type="button" onClick={handleCancelClick}>
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.profileInfoSaveBtn}`}
            disabled={!isEditMode}
            onClick={handleUpdateUser}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserDetails;
