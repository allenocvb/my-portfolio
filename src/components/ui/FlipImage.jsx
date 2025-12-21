import React from "react";
import styles from "./FlipImage.module.scss";

const FlipImage = ({ front, back, alt = "", triggerFlip = false }) => {
  const backImage = back || front;

  return (
    <div
      className={`${styles.flipContainer} ${
        triggerFlip ? styles.animateFlip : ""
      }`}
    >
      <img className={styles.front} src={front} alt={alt} />
      <img className={styles.back} src={backImage} alt={alt} />
    </div>
  );
};

export default FlipImage;
