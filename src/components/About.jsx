import React from 'react';
import styles from './About.module.scss';

class About extends React.PureComponent {
  render() {
    return (
      <div className={styles.aboutContainer}>
        <div className={styles.terminal}>
          <div className={styles.terminalHeader}>
            <div className={`${styles.headerButton} ${styles.red}`} />
            <div className={`${styles.headerButton} ${styles.yellow}`} />
            <div className={`${styles.headerButton} ${styles.green}`} />
          </div>
          <div className={styles.terminalWindow}>
            <Statements statements={this.props.statements} />
          </div>
        </div>
      </div>
    );
  }
}

class Statements extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.statements.map((statement, index) => (
          <Statement statement={statement} key={index} />
        ))}
        <div className={styles.statement}>
          <div className={styles.inputStatement}>
            <span>&nbsp;</span>
          </div>
        </div>
      </div>
    );
  }
}

class Statement extends React.PureComponent {
  render() {
    return (
      <div className={styles.statement}>
        <div className={styles.inputStatement}>{this.props.statement.input}</div>
        <div
          className={styles.returnStatement}
          dangerouslySetInnerHTML={{ __html: this.props.statement.return }}
        />
      </div>
    );
  }
}

export default About;