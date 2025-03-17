import React from 'react';
import Canvas from './components/Canvas';
import './App.css';

const App = () => {
  return (
    <div>
      
      <Canvas width={800} height={800} />
      <div className="legend">
        <h3>Legenda boja:</h3>
        <ul>
          <li><span className="black"></span> Crna - Zid</li>
          <li><span className="blue"></span> Plava - Putanja</li>
          <li><span className="yellow"></span> Žuta - Mogući koraci</li>
          <li><span className="green"></span> Zelena - Početna tačka</li>
          <li><span className="red"></span> Crvena - Cilj</li>
        </ul>
      </div>
    
     
    </div>
  );
};

export default App;