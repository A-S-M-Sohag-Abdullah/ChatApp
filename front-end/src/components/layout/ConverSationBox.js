import React, { useEffect, useRef, useState } from "react";
import { PulseLoader } from "react-spinners";
import profile from "../../assets/images/profile.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
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
  faArrowLeft,
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
import { toast } from "react-toastify";
import chatApi from "../../api/chatApi";
import moment from "moment/moment";
import ChatMembers from "./ChatMembers";
import AddGroupMembers from "./AddGroupMembers";
import EditGroupInfo from "./EditGroupInfo";
import { useActiveStatus } from "../../context/ActiveStatusContext";
import { Parser } from "html-to-react";

import socket from "../../services/socketService";

function ConverSationBox({ loading, messages, setMessages }) {
  const override = {
    display: "flex",
  };

  const htmlParser = new Parser();
  const { onlineUsers } = useActiveStatus();
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
    optionsRef,
    blockAssuranceRef,
    blockBtn1Ref,
    deleteAssuranceRef,
    deleteBtn1Ref,
    showPicker,
    setShowPicker,
    pickerBtnRef,
    pickerRef,
  } = useDom();

  const { activeChat, fetchChats, setActiveChat, setChats } = useChat();
  const { user, setUser } = useAuth();
  /*   console.log(activeChat); */

  const isBlockedByAnyone = activeChat.users.some(
    (chatUser) =>
      chatUser.userId._id !== user._id &&
      chatUser.userId.blockedUsers.some(
        (blockedUser) => blockedUser._id === user._id
      )
  );

  // Check if current user has blocked anyone in the chat
  const hasBlockedAnyone = user.blockedUsers.some((blockedUser) =>
    activeChat.users.some(
      (chatUser) =>
        chatUser.userId._id !== user._id &&
        chatUser.userId._id === blockedUser._id
    )
  );

  const editorRef = useRef(null);

  const [attachments, setAttachments] = useState([]);

  const otherUser = activeChat?.users.find(
    (u) => u.userId._id.toString() !== user._id.toString()
  );

  const [isEmpty, setIsEmpty] = useState(true);
  const handleInput = () => {
    const html = editorRef.current.innerHTML.trim();
    const isBlank = html === "<br>" ? true : false;
    setIsEmpty(isBlank);
  };

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
    console.log("sending message");

    const content = getEditorContent();

    if (!content && attachments.length === 0) return;
    const isEmpty = content === "<br>" ? true : false;
    if (isEmpty) return;
    const formData = new FormData();
    formData.append("sender", user._id);
    formData.append("content", JSON.stringify(content));
    formData.append("chatId", activeChat._id);

    attachments.forEach((file, index) => {
      formData.append(`attachments`, file);
    });
    editorRef.current.innerHTML = "";
    try {
      const response = await messageApi.sendMessage(formData);

      if (response.success) {
        setAttachments([]);
        scrollToBottm();
      }
    } catch (err) {}
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

  const savedSelection = useRef(null);
  // Make sure you pass this into your editor

  // Save caret selection only if it's within the editor
  const saveSelection = () => {
    const selection = window.getSelection();
    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.anchorNode)
    ) {
      savedSelection.current = selection.getRangeAt(0).cloneRange();
    }
  };

  // Insert emoji at saved caret position
  const insertAtCursor = (emojiData) => {
    const img = document.createElement("img");
    img.src = emojiData.imageUrl;
    img.alt = emojiData.emoji;
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.cursor = "default";
    img.style.margin = "0 3px";

    insertNodeAtCaret(img);
  };

  // Handles actual insertion of the node (emoji)
  const insertNodeAtCaret = (node) => {
    const selection = window.getSelection();
    let range;

    const isCaretInsideEditor =
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current?.contains(selection.getRangeAt(0).startContainer);

    if (isCaretInsideEditor) {
      range = selection.getRangeAt(0);
      savedSelection.current = range.cloneRange();
    } else if (savedSelection.current) {
      range = savedSelection.current.cloneRange();
    } else {
      // fallback to placing at end
      range = document.createRange();
      const editor = editorRef.current;
      if (!editor) return;
      range.selectNodeContents(editor);
      range.collapse(false);
      savedSelection.current = range.cloneRange();
    }

    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    savedSelection.current = range.cloneRange(); // Update saved selection
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    if (savedSelection.current && selection) {
      selection.removeAllRanges();
      selection.addRange(savedSelection.current);
    }
  };

  const handleEmojiClick = (emojiData) => {
    editorRef.current.focus();
    restoreSelection(); // Restore caret
    insertAtCursor(emojiData); // Insert emoji
    saveSelection(); // Save the new position after insertion
    // Refocus the editor
    handleInput();
  };

  const getEditorContent = () => {
    const rawHtml = editorRef.current?.innerHTML || "";
    console.log(rawHtml);
    const cleanedHtml = rawHtml.replace(/["\n]/g, "");

    return cleanedHtml;
  };

  useEffect(() => {
    // Optional: set initial content
    if (editorRef.current) {
      editorRef.current.innerHTML = "<br/>";
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages are updated
    scrollToBottm();
  }, [messages]);

  useEffect(() => {
    if (!activeChat?._id) return;

    socket.emit("joinChat", activeChat._id); // Join chat room

    socket.on("receiveMessage", (message) => {
      if (message.chat._id === activeChat._id) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    const markMessagesAsRead = async () => {
      await messageApi.markAsRead(activeChat._id); // Implement this route
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === activeChat._id ? { ...chat, unreadCount: 0 } : chat
        )
      );
    };

    markMessagesAsRead();

    return () => {
      socket.off("receiveMessage"); // Cleanup on unmount
    };
  }, [activeChat?._id, socket]);

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
          " d-flex justify-content-between align-items-center border-bottom px-3"
        }
      >
        <div
          className={styles["conversation-with"] + " d-flex align-items-center"}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className={`${styles.backBtn} me-2`}
            onClick={() => setActiveChat(null)}
          />
          <div className={styles["profile-picture"] + " rounded-circle me-2"}>
            <img
              src={
                activeChat.isGroupChat
                  ? activeChat.groupPhoto
                    ? `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${activeChat.groupPhoto}`
                    : profile
                  : otherUser?.userId?.profilePicture
                  ? `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${otherUser.userId.profilePicture}`
                  : profile
              }
              alt={activeChat.name || otherUser?.username}
              className="w-100 rounded-circle"
            />
          </div>
          <h3 className={styles["profile-name"] + " mb-0"}>
            {activeChat?.name || otherUser?.username}

            <div className={styles["active-status"]}>
              {!activeChat.isGroupChat &&
                onlineUsers[otherUser.userId._id] &&
                " Online"}
            </div>
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
            ref={optionsRef}
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

        {messages.length === 0 ? (
          <div>No messages yet</div>
        ) : (
          messages.map((message) => {
            const isSelf = message.sender._id === user._id;

            return (
              <div
                key={message._id}
                className={
                  (isSelf
                    ? styles["self"] + " flex-row-reverse me-2"
                    : styles["participant"] + " ms-2") +
                  " mb-3 d-flex flex-wrap-reverse"
                }
              >
                <div
                  className={
                    styles["messenger-pic"] +
                    " rounded-circle mb-1 " +
                    (isSelf ? "ms-2" : "me-2")
                  }
                >
                  <img
                    src={
                      message.sender.profilePicture
                        ? `${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${message.sender.profilePicture}`
                        : profile
                    }
                    alt="profile-pic"
                    className="w-100"
                  />
                </div>

                <div className={styles["messages"]}>
                  {activeChat.isGroupChat && !isSelf && (
                    <div className={styles.sender}>
                      {message.sender.username}
                    </div>
                  )}

                  {message?.images.map((image, index) => (
                    <div
                      key={index}
                      className={
                        styles.messageAttachment + (isSelf ? " ms-auto" : "")
                      }
                    >
                      <img
                        src={`${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${image}`}
                        alt="attachment-preview"
                        className="w-100"
                      />
                    </div>
                  ))}

                  <div className={styles["message"]}>
                    {htmlParser.parse(message.content)}
                  </div>
                </div>

                <div
                  className={
                    styles["message-date"] +
                    " mb-2 " +
                    (isSelf ? "me-lg-3" : "ms-lg-3")
                  }
                >
                  {moment(message?.createdAt).isSame(moment(), "day")
                    ? moment(message?.createdAt).format("LT")
                    : moment(message?.createdAt).format("MM / DD / YY : LT")}
                </div>
              </div>
            );
          })
        )}
        {loading && (
          <PulseLoader
            color="#6d73e1"
            loading={loading}
            cssOverride={override}
            size={5}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {isBlockedByAnyone || hasBlockedAnyone ? (
        <div className="py-4 text-center text-danger">
          Can't send message to this conversation !!
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className={
            styles["input-section"] +
            " py-lg-3 py-2 mt-auto w-100 d-flex flex-wrap justify-content-between align-items-center px-3"
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

          <div className={styles["editor-wrapper"] + " flex-auto"}>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onMouseUp={saveSelection}
              onKeyUp={saveSelection}
              onBlur={saveSelection}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              role="textbox"
              aria-label="Message"
              aria-placeholder="Type your message..."
              onInput={handleInput}
              onDrop={(e) => e.preventDefault()}
              onDragOver={(e) => e.preventDefault()}
              className={styles["editor"]}
            >
              <br />
            </div>
            {isEmpty && (
              <div className={styles["placeholder"]}>Type your message...</div>
            )}
          </div>

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
          <div
            ref={pickerRef}
            type="button"
            className={styles["emojiPicker"] + " position-relative"}
          >
            {showPicker && (
              <EmojiPicker
                open={true}
                className={styles.emojiPickerInterface}
                onEmojiClick={handleEmojiClick}
                height={300}
                width={300}
                previewConfig={{ showPreview: false }}
              />
            )}

            <FontAwesomeIcon
              ref={pickerBtnRef}
              onClick={() => {
                setShowPicker((prev) => !prev);
              }}
              icon={faFaceSmileRegular}
            />
          </div>
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
          ref={blockBtn1Ref}
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
          ref={deleteBtn1Ref}
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
        ref={deleteAssuranceRef}
        className={`${styles["delete-assurance"]} ${
          showDeleteConvBox ? "" : "d-none"
        }  position-lg-absolute  position-fixed p-4`}
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
        ref={blockAssuranceRef}
        className={`${styles["block-assurance"]} ${
          showBlockBox ? "" : "d-none"
        }  position-lg-absolute position-fixed p-4`}
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
