import React, { useState } from 'react';

function App() {
  const [counter, setCounter] =  useState(0);

  const handleClick = () => setCounter((prev) => prev + 1)

  return (
    <div style={{display: "flex", flexDirection:'column',margin: "40px",padding: "8px", width: "300px", alignItems:"center", backgroundColor:"teal"}}>
      <React.Fragment>
        <div style={{height: 80, width: 200, textAlign:"center"}}>I am an counter!</div>
        <h3>counter : <span>{counter}</span></h3>
        <button onClick={handleClick}> increment</button>
      </React.Fragment>
    </div>
  );
}

export default App;
