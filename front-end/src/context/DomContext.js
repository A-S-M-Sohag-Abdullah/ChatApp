import { createContext, useContext, useEffect, useRef, useState } from "react";

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
  const [showAddGroupMembers, setShwoAddGroupMembers] = useState(false);
  const [showEditGroupInfo, setShowEditGroupInfo] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const settingsRef = useRef(null);
  const settingsContainerRef = useRef(null);
  const optionsRef = useRef(null);
  const blockAssuranceRef = useRef(null);
  const blockBtn1Ref = useRef(null);
  const blockBtn2Ref = useRef(null);
  const deleteAssuranceRef = useRef(null);
  const deleteBtn1Ref = useRef(null);
  const deleteBtn2Ref = useRef(null);

  const userDetailsBtnRef = useRef(null);
  const userDetailsRef = useRef(null);

  const groupCreatorBtnRef = useRef(null);
  const groupCreatorRef = useRef(null);
  const blockAccountBtnRef = useRef(null);
  const blockAccountRef = useRef(null);

  const pickerBtnRef = useRef(null);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickOutside = (refs) => {
        return refs.every(
          (ref) => !ref.current || !ref.current.contains(e.target)
        );
      };

      /* if (
        settingsRef.current &&
        settingsContainerRef.current &&
        !settingsRef.current.contains(e.target) &&
        !settingsContainerRef.current.contains(e.target)
      ) {
        setSettingsOpend(false);
      } */

      if (isClickOutside([settingsRef, settingsRef])) {
        setSettingsOpend(false);
      }
      /* if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOptionsOpend(false);
      }
 */
      if (isClickOutside([optionsRef])) {
        setOptionsOpend(false);
      }
      if (isClickOutside([blockAssuranceRef, blockBtn1Ref, blockBtn2Ref])) {
        setShowBlockBox(false);
      }

      if (isClickOutside([deleteAssuranceRef, deleteBtn1Ref, deleteBtn2Ref])) {
        setShowDeleteConvBox(false);
      }

      if (isClickOutside([userDetailsBtnRef, userDetailsRef])) {
        setShowUserDetails(false);
      }
      if (isClickOutside([groupCreatorBtnRef, groupCreatorRef])) {
        setShowGroupCreator(false);
      }

      if (isClickOutside([blockAccountBtnRef, blockAccountRef])) {
        setShowBlockedAccounts(false);
      }

      if (isClickOutside([pickerBtnRef, pickerRef])) {
        setShowPicker(false);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  /*   useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        settingsRef.current &&
        settingsContainerRef.current &&
        !settingsRef.current.contains(e.target) &&
        !settingsContainerRef.current.contains(e.target)
      ) {
        setSettingsOpend(false);
      }

      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOptionsOpend(false);
      }

      if (
        blockAssuranceRef.current &&
        blockBtn1Ref?.current &&
        !blockAssuranceRef.current.contains(e.target) &&
        !blockBtn1Ref?.current.contains(e.target)
      ) {
        setShowBlockBox(false);
      }

      if (
        blockAssuranceRef.current &&
        blockBtn2Ref?.current &&
        !blockAssuranceRef.current.contains(e.target) &&
        !blockBtn2Ref?.current.contains(e.target)
      ) {
        setShowBlockBox(false);
      }

      if (
        deleteAssuranceRef.current &&
        deleteBtn1Ref?.current &&
        !deleteAssuranceRef.current.contains(e.target) &&
        !deleteBtn1Ref?.current.contains(e.target)
      ) {
        setShowDeleteConvBox(false);
      }

      if (
        deleteAssuranceRef.current &&
        deleteBtn2Ref?.current &&
        !deleteAssuranceRef.current.contains(e.target) &&
        !deleteBtn2Ref?.current.contains(e.target)
      ) {
        setShowDeleteConvBox(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    // 👇 Clean up to avoid memory leaks
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []); */

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
        showAddGroupMembers,
        setShwoAddGroupMembers,
        showEditGroupInfo,
        setShowEditGroupInfo,
        showPicker,
        setShowPicker,
        settingsRef,
        settingsContainerRef,
        optionsRef,
        blockAssuranceRef,
        blockBtn1Ref,
        blockBtn2Ref,
        deleteAssuranceRef,
        deleteBtn1Ref,
        deleteBtn2Ref,
        userDetailsRef,
        userDetailsBtnRef,
        groupCreatorBtnRef,
        groupCreatorRef,
        blockAccountBtnRef,
        blockAccountRef,
        pickerBtnRef,
        pickerRef,
      }}
    >
      {children} {/* Prevent rendering until auth check is done */}
    </DomContext.Provider>
  );
};

export const useDom = () => useContext(DomContext);
