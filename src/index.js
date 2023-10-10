import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css";
import App from './App';
import { SwapProvider } from './context/SwapContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SwapProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </SwapProvider>
);
