// src/Main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Pastikan Tailwind sudah disetup dengan benar
import { Provider } from 'react-redux'; // Import Redux provider
import store from './redux/store'; // Import Redux store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
