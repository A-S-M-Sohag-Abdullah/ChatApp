import { createContext, useContext, useState } from "react";

const DomContext = createContext();

export const DomProvider = ({ children }) => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(true);
  const [showAddConv, setShowAddConv] = useState(false);
  const [activeButton, setActiveButton] = useState("inbox");
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [settingsOpend, setSettingsOpend] = useState(false);
  const [optionsOpend, setOptionsOpend] = useState(false);
  const [showDeleteConvBox, setShowDeleteConvBox] = useState(false);
  const [showBlockBox, setShowBlockBox] = useState(false);
  const [profileOpend, setProfileOpend] = useState(false);
  const [shoBlockedAccounts, setShowBlockedAccounts] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showMute, setShowMute] = useState(false);
  const [showSharedPhotos, setShowSharedPhotos] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const toogleSidebar = () => {
    sideBarCollapsed ? setSideBarCollapsed(false) : setSideBarCollapsed(true);
  };

  const toggleSettings = () => {
    settingsOpend ? setSettingsOpend(false) : setSettingsOpend(true);
  };

  return (
    <DomContext.Provider
      value={{
        sideBarCollapsed,
        setSideBarCollapsed,
        showAddConv,
        setShowAddConv,
        activeButton,
        setActiveButton,
        showGroupCreator,
        setShowGroupCreator,
        settingsOpend,
        setSettingsOpend,
        toogleSidebar,
        toggleSettings,
        optionsOpend,
        setOptionsOpend,
        showDeleteConvBox,
        setShowDeleteConvBox,
        showBlockBox,
        setShowBlockBox,
        profileOpend,
        setProfileOpend,
        shoBlockedAccounts,
        setShowBlockedAccounts,
        showUserDetails,
        setShowUserDetails,
        showStory,
        setShowStory,
        showMute,
        setShowMute,
        showSharedPhotos,
        setShowSharedPhotos,
        showMembers,
        setShowMembers,
      }}
    >
      {children} {/* Prevent rendering until auth check is done */}
    </DomContext.Provider>
  );
};

export const useDom = () => useContext(DomContext);
