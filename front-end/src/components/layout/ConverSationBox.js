import React, { useEffect, useRef, useState } from "react";
import profile from "../../assets/images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faEllipsisVertical,
  faXmark,
  faPaperclip,
  faPaperPlane,
  faUser,
  faMagnifyingGlass,
  faBan,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faFaceSmile as faFaceSmileRegular } from "@fortawesome/free-regular-svg-icons";

import styles from "./ConverSationBox.module.css";
import { useDom } from "../../context/DomContext";
import Mute from "./Mute";
import SharedPhotos from "./SharedPhotos";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import messageApi from "../../api/messageApi";
import blockApi from "../../api/blockApi";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import chatApi from "../../api/chatApi";
import moment from "moment/moment";
import ChatMembers from "./ChatMembers";
import AddGroupMembers from "./AddGroupMembers";
import EditGroupInfo from "./EditGroupInfo";

const socket = io("http://localhost:5000");

function ConverSationBox() {
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const {
    optionsOpend,
    setOptionsOpend,
    showDeleteConvBox,
    setShowDeleteConvBox,
    showBlockBox,
    setShowBlockBox,
    setProfileOpend,
    showMute,
    showSharedPhotos,
    showMembers,
    showAddGroupMembers,
    showEditGroupInfo,
  } = useDom();

  const { activeChat, fetchChats, setActiveChat } = useChat();
  const { user, setUser } = useAuth();
  /*   console.log(activeChat); */

  const isBlockedByUser1 = activeChat.users[0].userId.blockedUsers.some(
    (blockedUser) => blockedUser._id === user._id
  );
  const isBlockedByUser2 = activeChat.users[1].userId.blockedUsers.some(
    (blockedUser) => blockedUser._id === user._id
  );

  // Check if the current user has blocked the other user
  const isBlockedCurrentUser1 = activeChat.users[0].userId.blockedUsers.some(
    (blockedUser) => blockedUser._id === activeChat.users[1].userId._id
  );
  const isBlockedCurrentUser2 = activeChat.users[1].userId.blockedUsers.some(
    (blockedUser) => blockedUser._id === activeChat.users[0].userId._id
  );

  /*   console.log(
    isBlockedByUser1,
    isBlockedByUser2,
    isBlockedCurrentUser1,
    isBlockedCurrentUser2
  ); */

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typedMessage, setTypedMessage] = useState("");
  const [attachments, setAttachments] = useState([]);

  const otherUser = activeChat?.users.find(
    (u) => u.userId._id.toString() !== user._id.toString()
  );

  const hanldeBlockUser = async (e) => {
    e.preventDefault();
    setShowBlockBox(false);

    try {
      const response = await blockApi.blockUser(otherUser.userId._id);

      if (response.success) {
        toast.error(response.message, {
          progressClassName: "red-progress-bar",
        });
        setUser(response.result);
        fetchChats();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const scrollToBottm = () => {
    const scrollHeight = containerRef.current.scrollHeight;
    const height = containerRef.current.clientHeight;
    const maxScrollTop = scrollHeight - height;
    containerRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  };

  const toggleOptions = () => {
    optionsOpend ? setOptionsOpend(false) : setOptionsOpend(true);
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  // Remove Selected Attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };
  // Send Message (Text + Attachments)
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!typedMessage && attachments.length === 0) return;

    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("content", typedMessage);
    formData.append("chatId", activeChat._id);

    attachments.forEach((file, index) => {
      formData.append(`attachments`, file);
    });

    try {
      const response = await messageApi.sendMessage(formData);

      if (response.success) {
        console.log(response);
        setTypedMessage("");
        setMessages([...messages, response.message]);
        setAttachments([]);
        scrollToBottm();
        fetchChats();
      }
    } catch (err) {
      setError(err);
    }
  };

  // delete chat for user
  const handleDeleteChat = async (e) => {
    e.preventDefault();
    try {
      const response = await chatApi.deleteChat(activeChat._id);
      toast.success(response.message);
      setShowDeleteConvBox(false);
      fetchChats();
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    // Scroll to the bottom whenever messages are updated
    scrollToBottm();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const messagesData = await messageApi.getMessages(activeChat._id);
        setMessages(messagesData); // Assuming the response is an array of messages
        scrollToBottm();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    // Cleanup on component unmount
    socket.emit("joinChat", activeChat._id); // Join chat room

    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      fetchChats();
      scrollToBottm();
    });

    return () => {
      socket.off("receiveMessage"); // Cleanup on unmount
    };
  }, [activeChat]);

  return (
    <div
      className={
        styles["conversation-box"] +
        " d-flex justify-content-between flex-column mx-auto position-relative"
      }
    >
      <div
        className={
          styles["conversation-head"] +
          " d-flex justify-content-between align-items-center border-bottom"
        }
      >
        <div
          className={styles["conversation-with"] + " d-flex align-items-center"}
        >
          <div className={styles["profile-picture"] + " rounded-circle me-2"}>
            <img src={profile} alt="profilePic" className="w-100" />
          </div>
          <h3 className={styles["profile-name"] + " mb-0"}>
            {activeChat?.name || otherUser?.username}

            <div className={styles["active-status"]}>online</div>
          </h3>
        </div>
        <div className={styles["conversation-actions"]}>
          <button className={styles["conversation-action"] + " audio-call"}>
            <FontAwesomeIcon icon={faPhone} />
          </button>
          <button className={styles["conversation-action"] + " video-call"}>
            <FontAwesomeIcon icon={faVideo} />
          </button>
          <button
            onClick={toggleOptions}
            className={styles["conversation-action"] + " options-btn"}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={styles["chat"] + " border-bottom pb-3"}
      >
        <div className="py-3"></div>
        {messages.length == 0 && <div>No messages yet</div>}
        {messages.map((message) => {
          if (message.sender._id === user._id)
            return (
              <div
                key={message._id}
                className={
                  styles["self"] +
                  " mb-3 me-2 d-flex flex-row-reverse align-items-end"
                }
              >
                <div
                  className={
                    styles["messenger-pic"] + " rounded-circle mb-1 ms-2"
                  }
                >
                  <img src={profile} alt="profile-pic" className="w-100" />
                </div>
                <div className={styles["messages"]}>
                  <div className={styles["message"]}>{message.content}</div>
                  {message?.images.map((image) => (
                    <div className={styles.messageAttachment + " ms-auto"}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt="attachment-preview"
                        className="w-100"
                      />
                    </div>
                  ))}
                </div>
                <div className={styles["message-date"] + " me-3 mb-2"}>
                  {moment(message?.createdAt).isSame(moment(), "day")
                    ? moment(message?.createdAt).format("LT")
                    : moment(message?.createdAt).format("MMMM D, YYYY [at] LT")}
                </div>
              </div>
            );
          else {
            return (
              <div
                key={message._id}
                className={
                  styles["participant"] + " mb-3 ms-2 d-flex align-items-end "
                }
              >
                <div
                  className={
                    styles["messenger-pic"] + " rounded-circle mb-1 me-2"
                  }
                >
                  <img src={profile} alt="profile-pic" className="w-100" />
                </div>
                <div className={styles["messages"]}>
                  {activeChat.isGroupChat && (
                    <div className={styles.sender}>
                      {message.sender.username}
                    </div>
                  )}
                  <div className={styles["message"]}>{message.content}</div>
                  {message?.images.map((image) => (
                    <div className={styles.messageAttachment}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt="attachment-preview"
                        className="w-100"
                      />
                    </div>
                  ))}
                </div>
                <div className={styles["message-date"] + " ms-3 mb-2"}>
                  {moment(message?.createdAt).isSame(moment(), "day")
                    ? moment(message?.createdAt).format("LT")
                    : moment(message?.createdAt).format("MMMM D, YYYY [at] LT")}
                </div>
              </div>
            );
          }
        })}

        <div ref={messagesEndRef} />
      </div>

      {isBlockedByUser1 ||
      isBlockedByUser2 ||
      isBlockedCurrentUser1 ||
      isBlockedCurrentUser2 ? (
        <div className="py-4 text-center text-danger">
          Can't send message to this conversation !!
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className={
            styles["input-section"] +
            " py-3 mt-auto w-100 d-flex flex-wrap justify-content-between align-items-center"
          }
        >
          <div className={styles["attached-images"] + " w-100 d-flex"}>
            {attachments.map((file, index) => (
              <div key={index} className={styles["attached-img"]}>
                <button type="button" onClick={() => removeAttachment(index)}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <img
                  src={URL.createObjectURL(file)}
                  alt="attachment-preview"
                  className="w-100"
                />
              </div>
            ))}
          </div>

          <input
            onChange={(e) => {
              setTypedMessage(e.target.value);
            }}
            type="text"
            className={styles["messange-input"] + " bg-transparent"}
            placeholder="Type Your Message Here..."
            value={typedMessage}
          />

          <label htmlFor="file-upload" className={styles["file-picker"]}>
            <FontAwesomeIcon icon={faPaperclip} />
          </label>
          <input
            id="file-upload"
            type="file"
            className="d-none"
            multiple
            onChange={handleFileChange}
          />
          <button type="button" className={styles["emojiPicker"]}>
            <FontAwesomeIcon icon={faFaceSmileRegular} />
          </button>
          <button type="submit" className={styles["send-btn"]}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      )}

      <div
        className={`
          ${styles["conversation-options-box"]} 
           ${
             optionsOpend ? "" : "d-none"
           } position-absolute border border-1 rounded d-flex flex-column align-items-start justify-content-around p-2
        `}
      >
        <button
          onClick={() => {
            setProfileOpend(true);
            setOptionsOpend(false);
          }}
          className={
            styles["conversation-option"] + " rounded p-2 w-100 text-start"
          }
        >
          <FontAwesomeIcon icon={faUser} /> View Profile
        </button>
        <button
          className={
            styles["conversation-option"] + " rounded p-2 w-100 text-start"
          }
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} /> Search messages
        </button>
        <button
          onClick={() => {
            setShowBlockBox(true);
            setOptionsOpend(false);
          }}
          className={
            styles["conversation-option"] + " rounded p-2 w-100 text-start"
          }
        >
          <FontAwesomeIcon icon={faBan} /> Block User
        </button>
        <button
          onClick={() => {
            setShowDeleteConvBox(true);
            setOptionsOpend(false);
          }}
          className={
            styles["conversation-option"] + " rounded p-2 w-100 text-start"
          }
        >
          <FontAwesomeIcon icon={faTrash} /> Delete Conversation
        </button>
      </div>

      <div
        className={`${styles["delete-assurance"]} ${
          showDeleteConvBox ? "" : "d-none"
        }  position-absolute p-4`}
      >
        <h3 className={styles["delete-assurance-title"]}>
          All Messages including files will be deleted.
        </h3>
        <form
          onSubmit={handleDeleteChat}
          className={
            styles["delete-conv-form"] + " d-flex justify-content-between"
          }
        >
          <button
            type="button"
            onClick={() => {
              setShowDeleteConvBox(false);
            }}
          >
            Cancel
          </button>
          <button type="submit">Ok</button>
        </form>
      </div>

      <div
        className={`${styles["block-assurance"]} ${
          showBlockBox ? "" : "d-none"
        }  position-absolute p-4`}
      >
        <h3 className={styles["block-assurance-title"]}>
          Are you sure you want to block this person?
        </h3>
        <form
          onSubmit={hanldeBlockUser}
          className={
            styles["block-person-form"] + " d-flex justify-content-between"
          }
        >
          <button type="button" onClick={() => setShowBlockBox(false)}>
            No
          </button>
          <button type="submit">Yes</button>
        </form>
      </div>
      {showEditGroupInfo && <EditGroupInfo />}

      {showAddGroupMembers && <AddGroupMembers />}
      {showMembers && <ChatMembers />}
      {showMute && <Mute />}
      {showSharedPhotos && <SharedPhotos messages={messages} />}
    </div>
  );
}

export default ConverSationBox;
