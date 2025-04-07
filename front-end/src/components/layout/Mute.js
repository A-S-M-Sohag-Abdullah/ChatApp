import React from "react";
import styles from "./Mute.module.css"; // Import module CSS
import { useDom } from "../../context/DomContext";

function Mute() {
  const { setShowMute } = useDom();
  return (
    <div className={styles.muteChatInterface}>
      <form action="" className={styles.muteForm}>
        <label htmlFor="forever">
          <input name="mute-duration" type="radio" id="forever" />
          <span className={styles.radioBtn}></span> Forever
        </label>

        <label htmlFor="month">
          <input name="mute-duration" type="radio" id="month" />
          <span className={styles.radioBtn}></span> A month
        </label>

        <label htmlFor="week">
          <input name="mute-duration" type="radio" id="week" />
          <span className={styles.radioBtn}></span> A week
        </label>

        <label htmlFor="day">
          <input name="mute-duration" type="radio" id="day" />
          <span className={styles.radioBtn}></span> A day
        </label>

        <label htmlFor="minute">
          <input name="mute-duration" type="radio" id="minute" />
          <span className={styles.radioBtn}></span> 15 minutes
        </label>

        <div
          className={`${styles.dFlex} ${styles.mtAuto} ${styles.w100} ${styles.justifyContentBetween}`}
        >
          <button
            onClick={() => {
              setShowMute(false);
            }}
            type="button"
          >
            Cancel
          </button>
          <button type="submit">Mute</button>
        </div>
      </form>
    </div>
  );
}

export default Mute;
