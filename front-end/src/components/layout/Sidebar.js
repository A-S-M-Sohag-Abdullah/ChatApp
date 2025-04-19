import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component
import {
  faInbox,
  faUser,
  faGripVertical,
  faGear,
  faBars,
  faUser as faUserAlt,
  faUsersLine,
  faTriangleExclamation,
  faRepeat,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons"; // Import specific icons

import styles from "./Control-sidebar.module.css"; // Import the CSS module
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useDom } from "../../context/DomContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const {
    sideBarCollapsed,

    activeButton,
    setShowGroupCreator,
    setActiveButton,
    settingsOpend,

    toogleSidebar,
    toggleSettings,
    setShowBlockedAccounts,
    setShowUserDetails,
    settingsRef,
    settingsContainerRef,
    userDetailsBtnRef,
    groupCreatorBtnRef,
    blockAccountBtnRef,
  } = useDom();

  return (
    <div
      className={`${styles["control-sidebar"]} ${
        sideBarCollapsed ? styles.collapsed : ""
      } d-flex align-items-start flex-column position-relative`}
    >
      <a
        href="/"
        className={`${styles.logo} d-flex align-items-center justify-content-start`}
      >
        <img src={logo} alt="Chat App Logo" /> Chat App
      </a>

      <button
        className={`${styles["control-picker"]} inbox ${
          activeButton === "inbox" ? styles.active : ""
        }`}
        onClick={() => setActiveButton("inbox")}
      >
        <FontAwesomeIcon icon={faInbox} className={styles.icon} />{" "}
        <span>Inbox</span>
      </button>
      <button
        className={`${styles["control-picker"]} people profile ${
          activeButton === "people" ? styles.active : ""
        }`}
        onClick={() => setActiveButton("people")}
      >
        <FontAwesomeIcon icon={faUser} className={styles.icon} />
        <span>People</span>
      </button>
      <button
        className={`${styles["control-picker"]} story folders ${
          activeButton === "stories" ? styles.active : ""
        }`}
        onClick={() => setActiveButton("stories")}
      >
        <FontAwesomeIcon icon={faGripVertical} className={styles.icon} />{" "}
        <span>Stories</span>
      </button>

      <div className={`${styles["user-controls"]} w-100 d-flex flex-column`}>
        <button
          ref={settingsRef}
          onClick={toggleSettings}
          className={`${styles["user-control"]} text-center settings position-relative`}
        >
          <FontAwesomeIcon icon={faGear} className={`${styles.icon}`} />{" "}
          <span>Settings</span>
        </button>
        <button
          onClick={toogleSidebar}
          id="toggle-control-sidebar"
          className={`${styles["user-control"]} menu d-lg-block d-none`}
        >
          <FontAwesomeIcon icon={faBars} className={`${styles.icon}`} /> Menu
        </button>
        <div
          ref={settingsContainerRef}
          className={`${styles["settings-container"]} ${
            settingsOpend ? "" : "d-none"
          } position-absolute p-2 rounded rounded-2 d-flex flex-column`}
        >
          <button
            ref={userDetailsBtnRef}
            onClick={() => {
              setShowUserDetails(true);
              toggleSettings();
            }}
            className="rounded p-2 w-100 text-start view-account"
          >
            <FontAwesomeIcon icon={faUserAlt} className={`${styles.icon}`} />{" "}
            Account
          </button>
          <button
            ref={groupCreatorBtnRef}
            onClick={() => {
              setShowGroupCreator(true);
              toggleSettings();
            }}
            className="rounded p-2 w-100 text-start"
          >
            <FontAwesomeIcon icon={faUsersLine} className={`${styles.icon}`} />{" "}
            Create a group
          </button>
          <button
            ref={blockAccountBtnRef}
            onClick={() => {
              toggleSettings();
              setShowBlockedAccounts(true);
            }}
            className="rounded p-2 w-100 text-start"
          >
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className={`${styles.icon}`}
            />{" "}
            Blocked Accounts
          </button>
          <button className="rounded p-2 w-100 text-start">
            <FontAwesomeIcon icon={faRepeat} className={`${styles.icon}`} />{" "}
            Switch Account
          </button>
          <button
            onClick={() => {
              toggleSettings();
              logout();
            }}
            className="rounded p-2 w-100 text-start"
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className={`${styles.icon}`}
            />{" "}
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
