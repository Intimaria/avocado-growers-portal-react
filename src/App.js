import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const grow = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
         Hola! <span role="img" aria-label="avocado">🥑</span><span role="img"  aria-label="plant">🌱</span>
        </div>

        <div className="bio">
        Soy Inti y me gusta crecer paltas. Si tambien te gustaría, conecta tu billetera Ethereum y crece tu propia paltita conmigo!
        </div>

        <button className="waveButton" onClick={grow}>
          Crece una paltita  <span role="img" aria-label="plant">🌱</span>
        </button>
      </div>
    </div>
  );
}
