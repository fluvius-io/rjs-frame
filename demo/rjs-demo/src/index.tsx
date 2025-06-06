import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'rjs-frame/dist/style.css';
import { initializeFromBrowserLocation } from 'rjs-frame';

// Initialize page state from current URL on app startup
initializeFromBrowserLocation(window.location);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 