import React from 'react';

class Typewriter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  typeOutText(text, minSpeed, maxSpeed, delay) {
    let currentText = '';
    let typingSpeed = 0;

    text.split('').forEach((char) => {
      typingSpeed += Math.random() * (maxSpeed - minSpeed) + minSpeed;
      setTimeout(() => {
        currentText += char;
        this.setState({ text: currentText });
      }, delay + typingSpeed);
    });
  }

  componentDidMount() {
    this.typeOutText(this.props.text, this.props.minSpeed, this.props.maxSpeed, this.props.delay);
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.state.text}
        <span>&nbsp;</span>
      </div>
    );
  }
}

Typewriter.defaultProps = {
  text: 'Your Name',
  minSpeed: 50,
  maxSpeed: 90,
  delay: 700,
};

export default Typewriter;