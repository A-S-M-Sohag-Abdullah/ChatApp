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
    setSideBarCollapsed,
    activeButton,
    setShowGroupCreator,
    setActiveButton,
    settingsOpend,
    setSettingsOpend,
    toogleSidebar,
    toggleSettings,
    setShowBlockedAccounts,
    setShowUserDetails,
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
        <FontAwesomeIcon icon={faInbox} className={styles.icon} /> Inboxes
      </button>
      <button
        className={`${styles["control-picker"]} people profile ${
          activeButton === "people" ? styles.active : ""
        }`}
        onClick={() => setActiveButton("people")}
      >
        <FontAwesomeIcon icon={faUser} className={styles.icon} /> People
      </button>
      <button
        className={`${styles["control-picker"]} story folders ${
          activeButton === "stories" ? styles.active : ""
        }`}
        onClick={() => setActiveButton("stories")}
      >
        <FontAwesomeIcon icon={faGripVertical} className={styles.icon} />{" "}
        Stories
      </button>

      <div className={`${styles["user-controls"]} w-100 d-flex flex-column`}>
        <button
          onClick={toggleSettings}
          className={`${styles["user-control"]} text-center settings position-relative`}
        >
          <FontAwesomeIcon icon={faGear} className={`${styles.icon}`} />{" "}
          Settings
        </button>
        <button
          onClick={toogleSidebar}
          id="toggle-control-sidebar"
          className={`${styles["user-control"]} menu`}
        >
          <FontAwesomeIcon icon={faBars} className={`${styles.icon}`} /> Menu
        </button>
        <div
          className={`${styles["settings-container"]} ${
            settingsOpend ? "" : "d-none"
          } position-absolute p-2 rounded rounded-2 d-flex flex-column`}
        >
          <button
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
            onClick={() => setShowBlockedAccounts(true)}
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
            onClick={() => logout()}
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
