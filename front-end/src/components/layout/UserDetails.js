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
function UserDetails() {
  const { setShowUserDetails } = useDom();
  // State for toggle edit mode
  const [isEditMode, setIsEditMode] = useState(false);

  // State variables to track changes in the input fields
  const [userName, setUserName] = useState("Nick Fury");
  const [bio, setBio] = useState("Nick Fury");
  const [contactNo, setContactNo] = useState("01717100000");
  const [email, setEmail] = useState("example@gmail.com");
  const [dob, setDob] = useState("2000-09-23");
  const [password, setPassword] = useState("password");

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelClick = () => {
    setIsEditMode(false);
    setShowUserDetails(false);
  };

  // Handlers for input changes
  const handleUserNameChange = (e) => setUserName(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleContactNoChange = (e) => setContactNo(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleDobChange = (e) => setDob(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  return (
    <div
      className={`${styles.profileDetails} position-fixed rounded rounded-4 p-3`}
    >
      <button
        className={`${styles.closeProfileDetails} ms-auto border d-block rounded border-1 mb-3`}
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>

      <div className={`${styles.profileDetailsDpContainer} position-relative`}>
        <img src={profile} alt="Profile" className="w-100 dp-upload" />
        <button className={`${styles.changeDpBtn} centered position-absolute`}>
          <FontAwesomeIcon icon={faCamera} />
        </button>
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
          value={userName}
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
          value={contactNo}
          onChange={handleContactNoChange}
          readOnly={!isEditMode}
        />

        <div className={styles.label}>Email:</div>
        <input
          type="email"
          className={`${styles.email} ${!isEditMode && "disabled"}`}
          value={email}
          onChange={handleEmailChange}
          readOnly={!isEditMode}
        />

        <div className={styles.label}>Date of Birth:</div>
        <input
          type="date"
          className={`${styles.email} ${!isEditMode && "disabled"}`}
          value={dob}
          onChange={handleDobChange}
          readOnly={!isEditMode}
        />

        <div className={styles.label}>Password:</div>
        <input
          type="password"
          className={`${styles.email} ${!isEditMode && "disabled"}`}
          value={password}
          onChange={handlePasswordChange}
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
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserDetails;
