import React from "react";
import styles from "./Footer.module.scss";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>© {currentYear} Allen Odoom - All rights reserved</p>
    </footer>
  );
};

export default Footer;
