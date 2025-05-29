// src/main.jsx
const desiredHost = "velocitygems.com";
const currentHost = window.location.hostname;

if (
  currentHost !== desiredHost &&
  (currentHost === "www.velocitygems.com" || currentHost === "lion-lease-frontend.onrender.com")
) {
  window.location.replace(
    "https://" +
      desiredHost +
      window.location.pathname +
      window.location.search +
      window.location.hash
  );
}


import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import App from './App';
import './index.css';
import { disableReactDevTools } from '@fvilers/disable-react-devtools';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
