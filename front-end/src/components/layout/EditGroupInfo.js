import React, { useEffect, useState } from "react";
import styles from "./EditGoupInfo.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useChat } from "../../context/ChatContext";
import chatApi from "../../api/chatApi";
import { toast } from "react-toastify";
import { useDom } from "../../context/DomContext";

function EditGroupInfo() {
  const { setShowEditGroupInfo } = useDom();
  const { activeChat, fetchChats } = useChat();

  const [newGroupName, setNewGroupName] = useState(activeChat.name || "");

  const handleGroupNameChange = async (e) => {
    e.preventDefault();

    try {
      console.log(activeChat._id);
      const response = await chatApi.renameGroup(activeChat._id, newGroupName);
      if (response.success) {
        toast.success(response.message);
        fetchChats();
        setShowEditGroupInfo(false);
      }
    } catch (err) {}
  };

  useEffect(() => {
    
    setNewGroupName(activeChat.name || "");
  }, [activeChat]);

  return (
    <div className={styles.editGroupInfoContainer}>
      <div className="d-flex border-bottom">
        <h2 className={styles.editGroupInfoTitle}>Edit Group Info</h2>

        <button
          onClick={() => {
            setShowEditGroupInfo(false);
          }}
          className={`border ms-auto border d-block rounded border-1 mb-3 border-secondary`}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <form onSubmit={handleGroupNameChange} className="d-flex pt-2">
        <label class="GroupCreate_groupPic__E5mC0" for="group-pic">
          <input id="group-pic" hidden type="file" />
          <FontAwesomeIcon icon={faCamera} />
        </label>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border-bottom"
        />

        <button type="submit" className={`ms-auto ${styles.saveBtn} px-3`}>
          Save
        </button>
      </form>
    </div>
  );
}

export default EditGroupInfo;
