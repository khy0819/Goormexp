import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // 기본 스타일이 있다면 포함

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);