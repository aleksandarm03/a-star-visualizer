import React from 'react';
import ReactDOM from 'react-dom/client'; // import iz 'react-dom/client' umesto 'react-dom'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Kreiraš root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
