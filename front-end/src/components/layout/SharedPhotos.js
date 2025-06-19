import React from "react";
import Story from "../../assets/images/commonsoty.jpg";
import styles from "./SharedPhotos.module.css"; // Import module CSS
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDom } from "../../context/DomContext";

function SharedPhotos({ messages }) {
  const { setShowSharedPhotos } = useDom();
  return (
    <div className={styles.sharedPhotosInterface + " p-3"}>
      <div className={`d-flex align-items-center border-bottom pb-2 mb-2`}>
        <h2 className={styles.sharedPhotosTitle}>Shared Photos</h2>
        <button
          onClick={() => {
            setShowSharedPhotos(false);
          }}
          className={`ms-auto border d-block rounded-2 px-2 ${styles.closeChatProfileBtn}`}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div
        className={`d-flex flex-wrap justify-content-between ${styles.sharedImages}`}
      >
        {messages.map((message) => {
          return message?.images.map((image) => {
            return (
              <a
                key={message._id + image}
                href={`${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${image}`}
                target="_blank"
              >
                <img
                  src={`${process.env.REACT_APP_NEXT_PUBLIC_API_BASE_URL}${image}`}
                  alt="attachment-preview"
                />
              </a>
            );
          });
        })}
      </div>
    </div>
  );
}

export default SharedPhotos;
