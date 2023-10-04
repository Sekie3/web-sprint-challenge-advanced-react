import React from 'react'
import { useState } from 'react';


const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4; 

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  constructor(props) {
    super(props);
    this.state = {
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    };
  }

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };
  

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };
  

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  };
  

  getNextIndex = (direction) => {
    const { index } = this.state;
    const gridSize = 9;
    const rowSize = 3;
  
    const movements = {
      left: -1,
      up: -rowSize,
      right: 1,
      down: rowSize,
    };
  
    const nextIndex = index + movements[direction];
  
    if (
      (direction === 'right' && index % rowSize === rowSize - 1) ||
      (direction === 'left' && index % rowSize === 0 && index >= rowSize)
    ) {
      return index;
    }
  
    if (nextIndex >= 0 && nextIndex < gridSize) {
      return nextIndex;
    } else {
      return index;
    }
  };
  
  
  
  move = (evt) => {
    const direction = evt.target.id.toLowerCase();
    const nextIndex = this.getNextIndex(direction);
  
    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
        message: '',
      }));
    } else {
      const edgeMessages = {
        left: "You can't go left",
        up: "You can't go up",
        right: "You can't go right",
        down: "You can't go down",
      };
      this.setState({ message: edgeMessages[direction] });
    }
  };
  
  
  

  onChange = (evt) => {
    const { id, value } = evt.target;
    this.setState({ [id]: value });
  };
  

  onSubmit = (evt) => {
    evt.preventDefault();
  
    const { email } = this.state;
  
    if (email.trim() === '') {
      this.setState({ message: 'Ouch: email is required' });
      return;
    }
  
    const payload = {
      x: this.getXY().x,
      y: this.getXY().y,
      steps: this.state.steps,
      email: this.state.email,
    };
  
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ message: data.message });
      })
      .catch((error) => {
        console.error('Error:', error);
      });

      this.setState({email: ''});
  };
  
  
  

  render() {
    const { className } = this.props
    const stepsText = this.state.steps === 1 ? 'time' : 'times';
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {stepsText}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? ' active' : ''}`}
            >
              {idx === this.state.index ? 'B' : null}
            </div>
          ))}
        </div>

        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>

        <div id="keypad">
        <button id="left" onClick={this.move}>LEFT</button>
        <button id="up" onClick={this.move}>UP</button>
        <button id="right" onClick={this.move}>RIGHT</button>
        <button id="down" onClick={this.move}>DOWN</button>
        <button id="reset" onClick={this.reset}>RESET</button>
        </div>

        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" />
        </form>

      </div>
    )
  }
}
