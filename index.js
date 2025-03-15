import React from 'react';
import ReactDOM from 'react-dom/client';  // Import from 'react-dom/client'
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create a root using createRoot
root.render(  // Use root.render() instead of ReactDOM.render()
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
