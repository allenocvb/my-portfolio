import React from 'react';
import styles from './ContactLinks.module.scss';

const ContactLinks = () => {
  return (
    <div className={styles.contactLinks}>
      <span>
        <a rel="noopener noreferrer" target="_blank" href="mailto:aodoom04@gmail.com">
          aodoom04@gmail.com
        </a>
      </span>
      <span>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.linkedin.com/in/allen-odoom/"
        >
          LinkedIn
        </a>
      </span>
      <span>
        <a rel="noopener noreferrer" target="_blank" href="https://github.com/allenocvb">
          GitHub
        </a>
      </span>
    </div>
  );
};

export default ContactLinks;