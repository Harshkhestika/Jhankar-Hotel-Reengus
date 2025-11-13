import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
// We are REMOVING the AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* We are REMOVING the AuthProvider wrapper */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);