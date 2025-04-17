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
  const [groupPhoto, setGroupPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [newGroupName, setNewGroupName] = useState(activeChat.name || "");

  const handleGroupImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (file) {
      const url = URL.createObjectURL(file);
      setGroupPhoto(url);
      setSelectedFile(file);
    }
  };

  const handleGroupChange = async (e) => {
    e.preventDefault();

    try {
      console.log(activeChat._id);
      const formData = new FormData();
      formData.append("chatId", activeChat._id);
      formData.append("chatName", newGroupName);
      if (selectedFile) formData.append("groupPhoto", selectedFile);

      const response = await chatApi.editGroup(formData);
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

      <form onSubmit={handleGroupChange} className="d-flex pt-2">
        <label class="GroupCreate_groupPic__E5mC0" for="group-pic">
          <input
            id="group-pic"
            hidden
            type="file"
            onChange={handleGroupImageChange}
          />
          {groupPhoto ? (
            <img src={groupPhoto} />
          ) : (
            <FontAwesomeIcon icon={faCamera} />
          )}
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
