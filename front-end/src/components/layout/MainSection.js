import React from "react";
import Head from "./Head";
import ChatInterface from "./ChatInterface";
import styles from "./MainSection.module.css";
import AddConversation from "./AddConversation";
import GroupCreator from "./GroupCreator";
import { useDom } from "../../context/DomContext";
import BlockedAccounts from "./BlockedAccounts";
import UserDetails from "./UserDetails";
import Story from "./Story";

function MainSection({}) {
  const {
    showAddConv,
    showGroupCreator,
    shoBlockedAccounts,
    showUserDetails,
    showStory,
  } = useDom();

  return (
    <div className={`${styles["main-section"]}`}>
      <Head />
      <ChatInterface />
      {showAddConv && <AddConversation />}
      {showGroupCreator && <GroupCreator />}
      {shoBlockedAccounts && <BlockedAccounts />}
      {showUserDetails && <UserDetails />}
      {showStory && <Story />}
    </div>
  );
}

export default MainSection;
