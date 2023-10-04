import React, { useState } from 'react';

export default function AppFunctional(props) {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [index, setIndex] = useState(4);
  const [steps, setSteps] = useState(0);

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }
  

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }
  

  function reset() {
    setMessage('');
    setEmail('');
    setIndex(4);
    setSteps(0);
  }
  

  function getNextIndex(direction) {
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
  }
  
  

  function move(evt) {
    const direction = evt.target.id.toLowerCase();
    const nextIndex = getNextIndex(direction);
  
    if (nextIndex !== index) {
      setIndex(nextIndex);
      setSteps((prevSteps) => prevSteps + 1);
      setMessage('');
    } else {
      const edgeMessages = {
        left: "You can't go left",
        up: "You can't go up",
        right: "You can't go right",
        down: "You can't go down",
      };
      setMessage(edgeMessages[direction]);
    }
  }
  
  

  function onChange(evt) {
    setEmail(evt.target.value);
  }
  

  function onSubmit(evt) {
    evt.preventDefault();
    console.log(email);
  
    if (email.trim() === '') {
      setMessage('Ouch: email is required');
      return;
    }
  
    const payload = {
      x: getXY().x,
      y: getXY().y,
      steps: steps,
      email: email,
    };
  
  
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        if (data.message === 'Success') {
          setEmail('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      setEmail('');
  }
  
  
  
  
  const stepsText = steps === 1 ? 'time' : 'times';

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {stepsText}</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === index ? ' active' : ''}`}
          >
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          RESET
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
  
}
